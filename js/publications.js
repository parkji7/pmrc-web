/* 연구성과 페이지 — PubMed 최신 논문 실시간 조회
 *
 * NCBI E-utilities를 두 번 호출한다.
 *   1) esearch  : 검색어에 맞는 PMID를 최신순으로 10개
 *   2) esummary : 그 PMID들의 제목·저자·저널·DOI
 * 두 엔드포인트 모두 Access-Control-Allow-Origin: * 이라 정적 사이트에서 바로 호출된다.
 *
 * 검색어를 바꾸려면 아래 QUERY만 수정하면 된다. 페이지 하단의
 * 'PubMed에서 전체 목록 보기' 링크도 같은 검색어로 자동 생성된다.
 *
 * 한글판(research.html)과 영문판(en/research.html)이 같은 파일을 공유한다.
 * 화면에 나가는 문구는 <html lang>을 보고 고른다.
 */
(function () {
  'use strict';

  var EN = (document.documentElement.lang || 'ko').toLowerCase().indexOf('en') === 0;

  var T = EN
    ? {
        locale: 'en-US',
        count: function (total, shown) {
          return 'Showing the ' + shown + ' most recent of ' + total + ' publications';
        },
        more: function (n) { return ' and ' + n + ' more'; },
        error: 'Could not load the publication list from PubMed. Please try again in a moment, ' +
               'or use &lsquo;View the full list on PubMed&rsquo; below.'
      }
    : {
        locale: 'ko-KR',
        count: function (total, shown) {
          return '전체 ' + total + '편 중 최근 ' + shown + '편';
        },
        more: function (n) { return ' 외 ' + n + '명'; },
        error: 'PubMed에서 논문 목록을 불러오지 못했습니다. 잠시 후 다시 시도하시거나, ' +
               '아래 &lsquo;PubMed에서 전체 목록 보기&rsquo;를 이용해 주세요.'
      };

  var QUERY =
    '(("Precision Medicine Research Center") AND ("The Catholic University of Korea")) OR ' +
    '((Yeun-Jun Chung[Author]) AND (The Catholic University of Korea[Affiliation]) AND ' +
    '(Department of Microbiology[Affiliation]))';

  var COUNT = 10;
  var EUTILS = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';
  // NCBI 이용 규약상 호출 주체를 밝히도록 되어 있다.
  var IDENT = '&tool=pmrc-web&email=cmcpmrc%40gmail.com';

  var listEl = document.getElementById('pubList');
  var countEl = document.getElementById('pubCount');
  var allEl = document.getElementById('pubAll');
  if (!listEl) return;

  // 전체 목록 링크를 검색어와 항상 일치시킨다
  if (allEl) {
    allEl.href =
      'https://pubmed.ncbi.nlm.nih.gov/?term=' +
      encodeURIComponent(QUERY) + '&sort=date&size=100';
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function getJSON(url) {
    return fetch(url, { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error('PubMed 응답 오류 ' + r.status);
      return r.json();
    });
  }

  /* PubMed 제목에는 <i>, <sub> 같은 태그가 섞여 오기도 하고 끝에 마침표가 붙는다 */
  function cleanTitle(t) {
    return esc(String(t || '').replace(/<[^>]+>/g, '').replace(/\.$/, ''));
  }

  function formatAuthors(authors) {
    if (!authors || !authors.length) return '';
    var names = authors
      .filter(function (a) { return a.authtype === 'Author'; })
      .map(function (a) { return a.name; });
    if (!names.length) return '';
    if (names.length <= 6) return esc(names.join(', '));
    return esc(names.slice(0, 6).join(', ')) + T.more(names.length - 6);
  }

  function doiOf(item) {
    var ids = item.articleids || [];
    for (var i = 0; i < ids.length; i++) {
      if (ids[i].idtype === 'doi') return ids[i].value;
    }
    return null;
  }

  /* "2026 Jul 3" / "2026 Apr" / "2026" → 연도만 따로 뽑아 강조에 쓴다 */
  function yearOf(pubdate) {
    var m = /\d{4}/.exec(pubdate || '');
    return m ? m[0] : '';
  }

  function renderItem(item, index) {
    var pmid = item.uid;
    var doi = doiOf(item);
    var journal = item.fulljournalname || item.source || '';
    var vol = item.volume ? item.volume + (item.issue ? '(' + item.issue + ')' : '') : '';
    var authors = formatAuthors(item.authors);

    var meta = [esc(journal), esc(vol), esc(item.pubdate || '')]
      .filter(Boolean).join(' · ');

    return '' +
      '<li class="group rounded-2xl border border-white/10 bg-navy-900/60 p-7 transition-colors hover:border-brand-500/40 sm:p-8">' +
        '<div class="flex flex-col gap-4 sm:flex-row sm:gap-7">' +
          '<div class="flex shrink-0 items-start gap-3 sm:w-20 sm:flex-col sm:gap-1">' +
            '<span class="text-sm font-bold tracking-widest text-brand-500">' +
              String(index + 1).padStart(2, '0') +
            '</span>' +
            '<span class="text-sm font-semibold text-mist-400">' + esc(yearOf(item.pubdate)) + '</span>' +
          '</div>' +
          '<div class="min-w-0 flex-1">' +
            '<h3 class="text-base leading-snug font-bold text-white sm:text-lg">' +
              '<a href="https://pubmed.ncbi.nlm.nih.gov/' + esc(pmid) + '/" target="_blank" rel="noopener noreferrer" ' +
                 'class="transition-colors hover:text-brand-400">' +
                cleanTitle(item.title) +
              '</a>' +
            '</h3>' +
            (authors ? '<p class="mt-3 text-sm leading-relaxed text-mist-500">' + authors + '</p>' : '') +
            (meta ? '<p class="mt-2 text-sm font-medium text-mist-400">' + meta + '</p>' : '') +
            '<div class="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold">' +
              '<a href="https://pubmed.ncbi.nlm.nih.gov/' + esc(pmid) + '/" target="_blank" rel="noopener noreferrer" ' +
                 'class="text-brand-400 transition-colors hover:text-brand-300">PMID ' + esc(pmid) + '</a>' +
              (doi
                ? '<a href="https://doi.org/' + esc(doi) + '" target="_blank" rel="noopener noreferrer" ' +
                     'class="text-mist-500 transition-colors hover:text-brand-400">DOI ' + esc(doi) + '</a>'
                : '') +
            '</div>' +
          '</div>' +
        '</div>' +
      '</li>';
  }

  function showError() {
    listEl.setAttribute('aria-busy', 'false');
    listEl.innerHTML =
      '<li class="rounded-2xl border border-white/10 bg-navy-900/60 p-7 leading-relaxed text-mist-400">' +
        T.error +
      '</li>';
  }

  var searchUrl = EUTILS + 'esearch.fcgi?db=pubmed&retmode=json&sort=date&retmax=' +
    COUNT + '&term=' + encodeURIComponent(QUERY) + IDENT;

  getJSON(searchUrl)
    .then(function (data) {
      var res = (data || {}).esearchresult || {};
      var ids = res.idlist || [];
      if (!ids.length) throw new Error('검색 결과 없음');

      if (countEl && res.count) {
        countEl.textContent = T.count(Number(res.count).toLocaleString(T.locale), ids.length);
        countEl.classList.remove('hidden');
      }

      return getJSON(
        EUTILS + 'esummary.fcgi?db=pubmed&retmode=json&id=' + ids.join(',') + IDENT
      ).then(function (sum) {
        var result = (sum || {}).result || {};
        // esummary는 요청 순서를 uids에 그대로 담아준다 (= 최신순)
        return (result.uids || []).map(function (id) { return result[id]; })
                                  .filter(Boolean);
      });
    })
    .then(function (items) {
      if (!items.length) throw new Error('상세 정보 없음');
      listEl.innerHTML = items.map(renderItem).join('');
      listEl.setAttribute('aria-busy', 'false');
    })
    .catch(function (err) {
      if (window.console && console.warn) console.warn('[publications]', err);
      showError();
    });
})();
