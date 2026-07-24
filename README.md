# 가톨릭정밀의학연구센터 (PMRC) 홈페이지

Catholic Precision Medicine Research Center 공식 홈페이지 (정적 웹사이트).

## 구조

```
pmrc-web/
├── index.html        # 메인 페이지 (전체 콘텐츠)
├── css/styles.css    # 스타일
├── js/main.js        # 인터랙션 (내비게이션, 스크롤 애니메이션, 카운터)
└── README.md
```

의존성 없는 순수 정적 사이트입니다. 웹폰트(Noto Sans KR)만 Google Fonts에서 불러옵니다.

## 로컬 실행

`index.html`을 브라우저로 바로 열거나, 로컬 서버로 실행합니다.

```bash
# Python
python -m http.server 8000

# Node
npx serve
```

브라우저에서 `http://localhost:8000` 접속.

## 수정이 필요한 부분

- **연락처 정보**: `index.html`의 `#contact` 섹션 — 주소/전화/이메일 `[...]` 자리표시자를 실제 값으로 교체하세요.
- **유전체 분석 서비스 4~6번**: 원본 콘텐츠가 잘려 전달되어, 정밀의학 분야의 일반적인 서비스(전사체 분석, 액체생검, 단일세포 분석)로 임시 구성했습니다. `is-placeholder` 클래스가 붙은 카드이니 실제 서비스 내용으로 교체하세요.
- **문의 이메일 링크**: `.contact-cta`의 `mailto:` 및 CTA 버튼에 실제 이메일 주소를 넣으세요.
