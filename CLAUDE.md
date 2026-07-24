# PMRC 홈페이지 작업 가이드

가톨릭정밀의학연구센터(Catholic Precision Medicine Research Center) 공식 홈페이지.
기존 Google Sites 사이트(https://www.pmrc.re.kr/)를 정적 사이트로 옮긴 것.

## 성격

- **빌드 도구 없음.** 순수 HTML/CSS/JS 정적 사이트. npm 설치나 번들러를 도입하지 말 것.
- 외부 의존성은 Google Fonts(Noto Sans KR)뿐. 프레임워크/CDN 라이브러리를 추가하지 말 것.
- 모든 경로는 **상대 경로**로 작성한다 (`css/styles.css`, `assets/img/...`).
  절대 경로(`/css/...`)를 쓰면 GitHub Pages 하위 경로 배포에서 깨진다.

## 구조

```
index.html         # 단일 페이지. 모든 섹션(#hero #about #services #business
                   # #activities #workshops #contact)이 여기 들어있다.
css/styles.css     # 전체 스타일
js/main.js         # 내비게이션, 스크롤 애니메이션, 카운터
assets/img/        # 이미지
```

## 배포

`main` 브랜치에 push하면 GitHub Pages가 자동 배포한다. 별도 빌드 단계 없음.

## 확인 방법

```bash
python3 -m http.server 8000   # http://localhost:8000
```

## 아직 채워야 할 내용

- `#contact` 섹션의 주소/전화/이메일 `[...]` 자리표시자
- `mailto:` 링크가 비어 있음 (`href="mailto:"`)
- `is-placeholder` 클래스가 붙은 유전체 분석 서비스 카드 3개 —
  원본 콘텐츠가 없어 임시로 채운 것이므로 실제 서비스 내용으로 교체 필요

위 항목을 임의의 그럴듯한 값으로 채우지 말 것. 실제 정보를 사용자에게 확인한다.
