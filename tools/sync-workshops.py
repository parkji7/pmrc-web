#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""workshop.pmrc.xlsx 를 읽어 교육정보 페이지의 '교육 워크샵' 표를 다시 쓴다.

    npm run sync:workshops        (또는 python3 tools/sync-workshops.py)
    npm run sync:workshops -- --check   변경 없이 어긋난 곳만 알려준다

엑셀 열 구성
    A  날짜          엑셀 serial 값. 1899-12-30 기준으로 환산한다
    B  워크샵         한글 제목  -> education.html
    C  Workshop (EN)  영문 제목  -> en/education.html

표는 항상 최신순(내림차순)으로 정렬해 넣는다. 두 파일의 <tbody> 안쪽만 갈아끼우고
바깥 마크업은 건드리지 않는다. 실행 후 결과물을 함께 커밋한다.
"""
import argparse
import html
import re
import sys
import zipfile
from datetime import date, timedelta
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
XLSX = ROOT.parent / 'pmrc-data' / 'workshop.pmrc.xlsx'
NS = '{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'
EXCEL_EPOCH = date(1899, 12, 30)

# (파일, 엑셀에서 가져올 열, 표를 찾을 caption 키워드)
TARGETS = [
    (ROOT / 'education.html', 'ko', '워크샵'),
    (ROOT / 'en' / 'education.html', 'en', 'workshop'),
]

ROW = '''              <tr class="border-b border-white/5 transition-colors last:border-0 hover:bg-white/[0.03]">
                <th scope="row" class="w-36 px-6 py-5 text-left align-top text-sm font-bold tracking-widest whitespace-nowrap text-brand-500">
                  <time datetime="{iso}">{disp}</time>
                </th>
                <td class="px-6 py-5 align-top leading-relaxed font-medium text-mist-100">{title}</td>
              </tr>'''


def read_xlsx():
    """[(date, ko, en), ...] 를 최신순으로 돌려준다."""
    if not XLSX.exists():
        sys.exit(f'없음: {XLSX}\n  원본 엑셀은 pmrc-web과 같은 상위 폴더의 pmrc-data 저장소에 있다 '
                 f'(github.com/cmcpmrc/pmrc-data, private). 그 저장소를 clone 했는지 확인할 것.')

    z = zipfile.ZipFile(XLSX)
    shared = []
    if 'xl/sharedStrings.xml' in z.namelist():
        shared = [''.join(t.text or '' for t in si.iter(NS + 't'))
                  for si in ET.fromstring(z.read('xl/sharedStrings.xml')).iter(NS + 'si')]

    def value(cell):
        inline = cell.find(NS + 'is')
        if inline is not None:
            return ''.join(t.text or '' for t in inline.iter(NS + 't'))
        v = cell.find(NS + 'v')
        if v is None:
            return ''
        return shared[int(v.text)] if cell.get('t') == 's' else (v.text or '')

    items, problems = [], []
    for row in ET.fromstring(z.read('xl/worksheets/sheet1.xml')).iter(NS + 'row'):
        cells = {re.match(r'([A-Z]+)', c.get('r')).group(1): value(c).strip() for c in row}
        a, b, c = cells.get('A', ''), cells.get('B', ''), cells.get('C', '')
        if not a or a == '날짜':          # 빈 줄과 머리글은 건너뛴다
            continue
        if not a.isdigit():
            problems.append(f'A열이 날짜가 아니다: {a!r} (셀 서식을 날짜로 두어야 한다)')
            continue
        if not b:
            problems.append(f'{EXCEL_EPOCH + timedelta(days=int(a))}: B열(한글 제목)이 비었다')
            continue
        if not c:
            problems.append(f'{EXCEL_EPOCH + timedelta(days=int(a))}: C열(영문 제목)이 비었다 — {b}')
            continue
        items.append((EXCEL_EPOCH + timedelta(days=int(a)), b, c))

    if problems:
        sys.exit('엑셀을 고쳐야 한다:\n  - ' + '\n  - '.join(problems))
    if not items:
        sys.exit('엑셀에서 워크샵을 한 건도 읽지 못했다.')

    items.sort(key=lambda x: x[0], reverse=True)
    return items


def render(items, lang):
    out = []
    for d, ko, en in items:
        title = html.escape(ko if lang == 'ko' else en)
        out.append(ROW.format(iso=d.isoformat(), disp=d.strftime('%Y.%m.%d'), title=title))
    return '\n'.join(out)


def main():
    ap = argparse.ArgumentParser(description='엑셀 -> 교육 워크샵 표 동기화')
    ap.add_argument('--check', action='store_true', help='파일을 고치지 않고 어긋난 곳만 보고한다')
    args = ap.parse_args()

    items = read_xlsx()
    print(f'{XLSX.name}: {len(items)}건 ({items[-1][0]} ~ {items[0][0]})')

    stale = False
    for path, lang, keyword in TARGETS:
        src = path.read_text(encoding='utf-8')
        # '교육 워크샵' 표의 <tbody> 만 찾는다. 같은 페이지의 다른 표를 건드리면 안 된다.
        pattern = re.compile(
            r'(<caption class="sr-only">[^<]*' + keyword + r'[^<]*</caption>.*?<tbody>\n)(.*?)(\n            </tbody>)',
            re.S | re.I)
        m = pattern.search(src)
        if not m:
            sys.exit(f'{path.relative_to(ROOT)}: 교육 워크샵 표를 찾지 못했다. '
                     f'caption 이나 tbody 마크업이 바뀌었는지 확인할 것.')

        body = render(items, lang)
        if m.group(2) == body:
            print(f'  {path.relative_to(ROOT)}  변경 없음')
            continue

        stale = True
        if args.check:
            print(f'  {path.relative_to(ROOT)}  어긋남 — sync 필요')
        else:
            path.write_text(src[:m.start(2)] + body + src[m.end(2):], encoding='utf-8')
            print(f'  {path.relative_to(ROOT)}  {len(items)}행으로 갱신')

    if args.check and stale:
        sys.exit(1)
    if not args.check and stale:
        print('\n표를 새로 썼다. 새 Tailwind 클래스를 쓴 게 아니라면 CSS 재빌드는 필요 없다.')


if __name__ == '__main__':
    main()
