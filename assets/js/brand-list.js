/*
 * 브랜드별 지점 목록 렌더러
 * 사용법: 브랜드 페이지에서 window.BRAND_KEY 설정 후 centers-data.js → 이 파일 순서로 로드.
 *   <script>window.BRAND_KEY="wplus";</script>
 *   <script src="assets/js/centers-data.js"></script>
 *   <script src="assets/js/brand-list.js"></script>
 * 대상 컨테이너: #brand-grid, 개수: #brand-count
 * 분류 기준: page(파일명) 접미사 — W=더블유플러스, 글로리드=글로리드, 모두=모두오름, 나머지=와와
 */
(function () {
  var key = window.BRAND_KEY || "wawa";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function suffixOf(page) {
    var m = /c\/(.+)\.html$/.exec(page || "");
    var f = m ? m[1] : "";
    if (/W$/.test(f)) return "wplus";
    if (/글로리드$/.test(f)) return "gloried";
    if (/모두$/.test(f)) return "moduoreum";
    return "wawa";
  }
  function cleanName(n) {
    return String(n || "").replace(/\s*\((?:W\+|글로리드|모두)\)\s*$/, "").trim();
  }
  function cleanAddr(a) {
    return String(a || "").replace(/\s*(와와학습코칭센터|와와학습코칭|더블유플러스|글로리드|모두오름)?\s*(보습)?\s*학원\s*$/, "").replace(/\s{2,}/g, " ").trim();
  }

  var all = (window.WAWA_CENTERS || []).filter(function (c) { return suffixOf(c.page) === key; });

  var grid = document.getElementById("brand-grid");
  var countEl = document.getElementById("brand-count");
  if (countEl) countEl.textContent = all.length + "개 지점";

  if (!all.length) {
    if (grid) grid.innerHTML = '<p style="color:var(--color-muted)">준비 중입니다.</p>';
    return;
  }

  // 지역(region)별 그룹핑
  var groups = {}, order = [];
  all.forEach(function (c) {
    var r = c.region || "기타";
    if (!groups[r]) { groups[r] = []; order.push(r); }
    groups[r].push(c);
  });
  order.sort(function (a, b) { return a.localeCompare(b, "ko"); });

  var html = "";
  order.forEach(function (r) {
    var list = groups[r].sort(function (a, b) { return cleanName(a.name).localeCompare(cleanName(b.name), "ko"); });
    html += '<div class="brand-region">';
    html += '<h3 class="brand-region-title">' + esc(r) + ' <span style="color:var(--color-muted);font-weight:600;font-size:14px">' + list.length + '개</span></h3>';
    html += '<div class="brand-branch-grid">';
    list.forEach(function (c) {
      html += '<a class="brand-branch-card" href="' + esc(c.page) + '">' +
                '<span class="bb-name">' + esc(cleanName(c.name)) + '</span>' +
                '<span class="bb-addr">' + esc(cleanAddr(c.addr)) + '</span>' +
                '<span class="bb-more">센터 정보 보기 →</span>' +
              '</a>';
    });
    html += '</div></div>';
  });
  if (grid) grid.innerHTML = html;
})();
