# PMRC 홈페이지 작업 가이드

가톨릭정밀의학연구센터(Catholic Precision Medicine Research Center) 공식 홈페이지.
기존 Google Sites 사이트(https://www.pmrc.re.kr/)의 콘텐츠를 옮겨 재구성한 정적 사이트.

## 성격

- **런타임 프레임워크 없음.** 정적 HTML + Tailwind CSS(빌드 결과물 커밋) + 바닐라 JS.
  React/Vue/번들러를 도입하지 말 것.
- 외부 런타임 의존성은 Pretendard 웹폰트(jsDelivr CDN) 하나뿐. 새 CDN 라이브러리를 추가하지 말 것.
- 모든 경로는 **상대 경로**로 작성한다 (`css/tailwind.css`, `assets/img/...`).
  절대 경로(`/css/...`)는 GitHub Pages 하위 경로 배포에서 깨진다.

## 구조

```
index.html      Home        — 소개 / 주요 활동 / 유전체 분석 서비스 / 찾아오시는 길
about.html      연구소 소개  — 센터장 인사말 / 연혁 / 연구환경 구축 / 조직구성
research.html   연구성과     — PubMed 연동 논문 / 특허 / 학술활동
services.html   분석서비스   — 대표 서비스 항목 / 신청방법
equipment.html  장비소개     — 보유 장비 5종
education.html  교육정보     — 분석 워크샵 3종 / 교육 워크샵 목록(표) /
                              초청세미나 공고문·현장 사진
notice.html     (메뉴에서 제외) 예전 공지사항 페이지. 어느 메뉴에서도 링크하지 않는다.
                내용은 education.html로 옮겨졌다.

en/index.html          영문판 Home
en/about.html          About Us
en/research.html       Our Research
en/services.html       Analysis Services
en/equipment.html      Equipment
en/education.html      Training Programs
                       (영문판에는 공지사항에 해당하는 페이지가 없다)

seminar/               초청세미나 원본 자료(공고문 pdf + 현장 사진)
workshop.pmrc.xlsx     education.html '교육 워크샵' 표의 원본. 날짜는 엑셀 serial 값이라
                       1899-12-30 기준으로 환산해야 한다
                       ↑ 이 둘은 .gitignore 로 제외되어 로컬에만 있다. 저장소가 공개이고
                         Pages가 저장소 전체를 서빙해서, 커밋하면 pdf·원본 사진이 URL로
                         노출되기 때문이다. 변환 결과물만 assets/img/ 에 커밋한다.

css/tailwind.src.css  Tailwind 소스 (@theme 색상 토큰, .reveal 등 커스텀)
css/tailwind.css      빌드 결과물 — 커밋 대상
js/main.js            헤더 스크롤 상태 / 모바일 메뉴 / .reveal 애니메이션 / 연도
js/publications.js    research.html 전용 — PubMed 최신 논문 10편 실시간 조회
```

## 논문 목록 (research.html)

PubMed E-utilities(esearch + esummary)를 브라우저에서 직접 호출한다. 두 엔드포인트
모두 `Access-Control-Allow-Origin: *`이라 서버 없이 동작한다. 검색어를 바꾸려면
`js/publications.js`의 `QUERY` 상수만 고치면 되고, 하단 '전체 목록 보기' 링크도
같은 값으로 자동 생성된다.

**주의**: 이 파일은 HTML 문자열을 만들어 넣으므로 Tailwind 클래스가 JS 안에 들어있다.
`tailwind.src.css`의 `@source "../js/**/*.js"` 설정이 이를 스캔하므로 지우지 말 것.
JS 안에서 클래스를 새로 쓰면 반드시 `npm run build:css`를 다시 돌려야 한다.

헤더와 푸터는 한글 7개 + 영문 6개, 총 13개 파일에 각각 복제되어 있다.
**한쪽만 고치지 말 것** — 메뉴나 연락처를 바꾸면 13개 파일을 모두 동일하게 수정해야 한다.
(notice.html은 메뉴에서 빠졌지만 파일에는 남아 있으므로 헤더·푸터 동기화 대상에 포함한다.)

## 영문판 (en/)

한글 6개 페이지에 1:1 대응하는 영문 페이지가 `en/` 에 있다. 헤더 ENG 버튼 →
`en/index.html`, 영문 헤더 KOR 버튼 → `../index.html` 로 왕복한다.
(예전에는 ENG가 외부 en.pmrc.re.kr 로 나갔다. 지금은 이 저장소 안에서 해결된다.)

- **경로 주의**: en/ 은 한 단계 아래라 에셋을 `../assets/`, `../css/`, `../js/` 로 참조한다.
- **@source**: `tailwind.src.css` 에 `@source "../en/*.html"` 가 있어야 영문 페이지에서
  처음 쓰는 클래스가 빌드된다. 지우지 말 것.
- **js는 공유한다**: `js/main.js` 와 `js/publications.js` 를 한/영이 같이 쓴다.
  `publications.js` 는 `<html lang>` 이 en 으로 시작하면 영문 문구를 쓴다.
  화면에 나가는 새 문구를 추가할 때는 `T` 객체의 ko/en 양쪽을 채워야 한다.
  `<html lang="en">` 을 빼먹으면 이 문구만 한국어로 돌아간다.
- **캐시 무효화**: `research.html` / `en/research.html` 의 script 태그는
  `js/publications.js?v=2` 처럼 버전을 달고 있다. **publications.js 의 화면 문구나
  동작을 고치면 두 파일의 `?v=` 숫자를 같이 올릴 것.** 한글판과 영문판이 같은 URL을
  쓰기 때문에, 올리지 않으면 한쪽을 먼저 본 브라우저가 다른 쪽에서도 캐시된 옛 파일을
  재사용해 문구가 반대 언어로 나온다 (실제로 겪은 문제다).
- **헤더·푸터 복제**: 한글 7개 + 영문 6개 = 13개 파일에 각각 복제되어 있다.
  메뉴나 연락처를 바꾸면 13개를 모두 맞춰야 한다.

문구 출처는 두 갈래다.

- en.pmrc.re.kr(공식 영문 사이트)에 있던 문장은 그대로 옮겼다 — Home 전체, 센터장
  인사말, 연혁, 연구환경, 조직구성, 분석 워크샵 3종 설명.
- 영문 사이트에 없어서 한글판을 영어로 옮긴 부분 — **장비 5종, 분석서비스 표·신청방법,
  교육 워크샵 표, 초청세미나 장소**. 기관에서 공식 영문 표현을 주면 이쪽을 교체한다.
  단 **초청세미나 연자 영문 이름은 사용자 확인을 받았다**(2026-07-27). 임의로 바꾸지 말 것.

영문 사이트의 분석서비스 표는 이미지로만 되어 있고, 이제 그 이미지도 403으로 막혀
직접 확인할 수 없다 (아래 '원본 자료' 절의 설명은 지금은 통하지 않는다).

## 초청세미나 자료 추가 (education.html)

`seminar/<YYYYMMDD>.pdf`(공고문)와 `seminar/<YYYYMMDD>.jpg`(현장 사진)를 넣은 뒤
1400x1050(4:3) JPG로 변환해 `assets/img/seminar-<YYYYMMDD>-poster.jpg` /
`-photo.jpg`로 저장하고, education.html `#seminars`의 `<article>`을 최신이 위에
오도록 하나 복제해 채운다. 공고문 pdf는 그대로 배포하지 않는다.

## CSS 수정 시

Tailwind 클래스를 새로 쓰거나 `tailwind.src.css`를 고쳤다면 반드시 다시 빌드하고
결과물을 함께 커밋한다. 빌드를 잊으면 새 클래스가 적용되지 않는다.

```bash
npm run build:css
```

`js/main.js`가 클래스 문자열을 동적으로 붙이므로(`bg-navy-950/85` 등),
`tailwind.src.css`의 `@source`에 js 경로가 포함되어 있다. 이 설정을 지우지 말 것.

## 배포

`main` 브랜치 push → GitHub Pages 자동 배포. 빌드 단계 없음.
현재 https://parkji7.github.io/pmrc-web/ · 커스텀 도메인(www.pmrc.re.kr)은 아직 미연결.

## 확인 방법

```bash
python3 -m http.server 8000   # http://localhost:8000
```

## 콘텐츠 원칙

이 사이트의 내용은 실제 연구기관 정보다. **추측해서 채우지 말 것.**

- 논문 제목·저자·저널, 특허 번호, 장비 사양, 인물 정보를 임의로 생성하지 않는다.
- 연락처는 `cmcpmrc@gmail.com` / `02-3147-9008` /
  서울시 서초구 반포대로 222 가톨릭대학교 의과대학 의생명연구원 3017-2 가 정확한 값이다.
  (초기 디자인 시안에 있던 `pmrc@catholic.ac.kr`, `02-2258-xxxx`, 서울성모병원 주소는 오류였다.)
- 아직 못 옮긴 내용은 `assets/img/README.txt`에 목록으로 정리되어 있다.
  해당 위치에는 주석 처리된 `<img>`가 준비되어 있으니, 파일이 생기면 주석만 해제한다.

## 원본 자료를 더 찾아야 할 때

한글·영문 두 Google Sites 모두 이미지가 `lh3.googleusercontent.com/sitesv/...` URL로
제공되고, **이제 양쪽 다 외부 요청이 403으로 차단된다.** (2026-07 확인. 예전에는 영문
사이트 이미지만 받을 수 있었다.) 따라서 이미지로만 된 내용은 자동으로 가져올 수 없다.

반면 **텍스트는 정상적으로 받아진다.** 페이지 HTML을 `curl -sL`로 내려 script/style을
지우고 태그를 벗기면 본문이 그대로 나온다. WebFetch는 내용을 요약해버리므로 원문이
필요할 때는 쓰지 말 것. 영문 대응 페이지는 `/about-us`, `/analysis-services`,
`/our-research`, `/training-programs`, `/whats-new` 이고, 영문 사이트에는 장비 페이지가 없다.

한글↔영문을 서로 옮긴 부분(분석서비스 표·신청방법, 조직도, 장비 5종)은 원본 표현과
다를 수 있으므로, 사용자가 원문을 주면 그쪽을 우선한다.
