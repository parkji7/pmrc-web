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
education.html      # 교육정보 — 분석 워크샵 3종
notice.html         # 공지사항 — 워크샵 공지

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

## 배포

`main` 브랜치에 push하면 GitHub Pages가 자동 배포합니다.
현재 주소: https://parkji7.github.io/pmrc-web/

## 아직 채워야 할 내용

원본 Google Sites에서 **이미지로만** 제공되던 부분이라 텍스트를 옮겨오지 못했습니다.
(Google이 이미지 직접 다운로드를 차단해 자동 수집도 불가했습니다. Google Sites 편집 화면에서
직접 내려받아 `assets/img/`에 저장해 주세요.)

| 위치 | 필요한 것 | 저장할 파일명 |
|---|---|---|
| `services.html` 대표 서비스 항목 | 상세표 이미지 | `assets/img/service-items.png` |
| `services.html` 신청방법 | 절차 안내 (텍스트로 주시면 단계별로 구성) | `assets/img/service-apply.png` |
| `equipment.html` | 장비 사진 5장 | `assets/img/equipment-1.png` ~ `equipment-5.png` |
| `about.html` 조직구성 | 조직도 이미지 (선택) | `assets/img/org-chart.png` |

각 파일의 해당 위치에 주석 처리된 `<img>` 태그가 준비되어 있습니다. 파일을 저장한 뒤 주석만
해제하면 됩니다.

또한 영문 사이트(https://en.pmrc.re.kr)는 아직 Google Sites에 남아 있으며, 이 저장소로 옮기지
않았습니다.
