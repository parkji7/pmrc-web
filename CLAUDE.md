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
education.html  교육정보     — 분석 워크샵 3종
notice.html     공지사항     — 워크샵 공지

css/tailwind.src.css  Tailwind 소스 (@theme 색상 토큰, .reveal 등 커스텀)
css/tailwind.css      빌드 결과물 — 커밋 대상
js/main.js            헤더 스크롤 상태 / 모바일 메뉴 / .reveal 애니메이션 / 연도
```

헤더와 푸터는 7개 파일에 각각 복제되어 있다. **한쪽만 고치지 말 것** —
메뉴나 연락처를 바꾸면 7개 파일 모두 동일하게 수정해야 한다.

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
