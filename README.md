# 가톨릭정밀의학연구센터 (PMRC) 홈페이지

Catholic Precision Medicine Research Center 공식 홈페이지 (정적 사이트).
기존 Google Sites 사이트(https://www.pmrc.re.kr/)의 콘텐츠를 그대로 옮겨 재구성했습니다.

## 구조

```
index.html          # Home — 소개, 주요 활동, 유전체 분석 서비스, 찾아오시는 길
about.html          # 연구소 소개 — 센터장 인사말, 연혁, 연구환경 구축, 조직구성
research.html       # 연구성과 — PubMed 연동 논문, 특허, 학술활동
services.html       # 분석서비스 — 대표 서비스 항목, 신청방법
equipment.html      # 장비소개 — 보유 장비 5종
education.html      # 교육정보 — 분석 워크샵 3종, 교육 워크샵 목록, 초청세미나
notice.html         # (메뉴에서 제외) 예전 공지사항 페이지 — 내용은 education.html로 이동

en/                 # 영문판. 위 6개 페이지에 1:1 대응 (공지사항 없음)
                    #   헤더 ENG ↔ KOR 버튼으로 왕복. 에셋·CSS·JS는 한글판과 공유

css/tailwind.src.css  # Tailwind 소스 (테마·커스텀 스타일)
css/tailwind.css      # 빌드 결과물 — 커밋되어 있음. 배포 시 빌드 불필요
js/main.js            # 헤더·모바일 메뉴·스크롤 애니메이션
assets/img/           # 이미지
```

폰트는 Pretendard(jsDelivr CDN), 스타일은 Tailwind CSS v4입니다.

## 로컬 실행

```bash
python3 -m http.server 8000
```

브라우저에서 `http://localhost:8000` 접속.

## 스타일 수정

HTML의 Tailwind 클래스를 바꾸거나 `css/tailwind.src.css`를 수정한 뒤 다시 빌드합니다.

```bash
npm install          # 최초 1회
npm run build:css    # css/tailwind.css 재생성
```

빌드 결과물(`css/tailwind.css`)은 반드시 **함께 커밋**해야 합니다. GitHub Pages는 빌드를 돌리지 않고
저장소의 파일을 그대로 서빙합니다.

## 교육 워크샵 추가

표를 손으로 고치지 말고 `workshop.pmrc.xlsx`(A 날짜 / B 한글 제목 / C 영문 제목)에 줄을 넣은 뒤
아래를 실행하면 한글·영문 표가 함께 갱신됩니다. 최신순 정렬도 자동입니다.

```bash
npm run sync:workshops
```

## 배포

`main` 브랜치에 push하면 GitHub Pages가 자동 배포합니다.
현재 주소: https://parkji7.github.io/pmrc-web/

## 콘텐츠 출처

한글 사이트(www.pmrc.re.kr)의 이미지는 Google이 외부 다운로드를 차단(403)해 가져올 수
없었습니다. 대신 **영문 사이트(en.pmrc.re.kr)의 동일 자료**는 접근이 가능해, 이미지로만
제공되던 다음 내용을 그쪽에서 확보해 한글로 옮겼습니다.

- 분석서비스 「대표 서비스 항목」 상세표 6종 → `services.html`에 HTML 표로 재작성
- 분석서비스 「신청방법」 5단계 → `services.html`에 단계 카드로 재작성
- 조직도 → `about.html`에 HTML 도식으로 재작성 (이미지 대신, 반응형·한글)
- 개소 기념 세미나 사진, 2024 초청 세미나 포스터·현장 사진 → 각 페이지에 삽입

영문 자료를 한글로 옮긴 것이므로, 원본 한글 표현과 다를 수 있습니다. 확인 후 알려주시면
문구를 맞추겠습니다.

## 장비 자료 출처

`equipment.html`의 장비 사진과 사양은 **초정밀의학사업단 설명회 자료(2024-01-05)**에서
가져왔습니다. 설치 사진은 해당 PDF에 실린 실제 설치 현장 사진을 추출한 것입니다.
원본 PDF는 내부 발표 자료이므로 이 공개 저장소에는 포함하지 않았습니다.

영문 사이트(https://en.pmrc.re.kr)는 아직 Google Sites에 남아 있으며, 이 저장소로 옮기지
않았습니다. 헤더의 ENG 버튼이 그쪽으로 연결됩니다.
