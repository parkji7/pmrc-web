/* PMRC 홈페이지 인터랙션
 * - 스크롤 시 헤더 배경 전환
 * - 모바일 내비게이션 토글
 * - 스크롤 진입 애니메이션 (.reveal)
 * - 푸터 연도 자동 갱신
 */
(function () {
  'use strict';

  /* ---------- 헤더: 스크롤하면 반투명 배경 + 블러 ---------- */
  var header = document.getElementById('siteHeader');
  var SOLID_CLASSES = ['bg-navy-950/85', 'backdrop-blur-lg', 'border-white/10'];

  function syncHeader() {
    if (!header) return;
    var scrolled = window.scrollY > 24;
    SOLID_CLASSES.forEach(function (cls) {
      header.classList.toggle(cls, scrolled);
    });
  }

  window.addEventListener('scroll', syncHeader, { passive: true });
  syncHeader();

  /* ---------- 모바일 내비게이션 ---------- */
  var toggle = document.getElementById('navToggle');
  var mobileNav = document.getElementById('mobileNav');

  if (toggle && mobileNav) {
    var iconOpen = toggle.querySelector('[data-icon="open"]');
    var iconClose = toggle.querySelector('[data-icon="close"]');

    var setMenu = function (open) {
      mobileNav.classList.toggle('hidden', !open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
      if (iconOpen) iconOpen.classList.toggle('hidden', open);
      if (iconClose) iconClose.classList.toggle('hidden', !open);
    };

    toggle.addEventListener('click', function () {
      setMenu(mobileNav.classList.contains('hidden'));
    });

    // 메뉴 항목을 누르면 닫기
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setMenu(false);
      });
    });

    // Esc로 닫기
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !mobileNav.classList.contains('hidden')) {
        setMenu(false);
        toggle.focus();
      }
    });

    // 데스크톱 폭으로 넓어지면 열린 상태를 정리
    window.matchMedia('(min-width: 768px)').addEventListener('change', function (e) {
      if (e.matches) setMenu(false);
    });
  }

  /* ---------- 스크롤 진입 애니메이션 ---------- */
  var revealTargets = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    // 미지원 브라우저에서는 그냥 전부 보이게 둔다
    revealTargets.forEach(function (el) {
      el.classList.add('is-visible');
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    revealTargets.forEach(function (el, i) {
      // 같은 섹션 내 요소가 순차적으로 나타나도록 약간의 지연
      el.style.transitionDelay = (i % 4) * 90 + 'ms';
      observer.observe(el);
    });
  }

  /* ---------- 푸터 연도 ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
