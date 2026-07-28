/*
 * 브랜드별 지점 목록 렌더러 (+ 검색)
 * 사용법: window.BRAND_KEY 설정 후 centers-data.js → 이 파일 순서로 로드.
 * 컨테이너: #brand-grid, 개수: #brand-count, 검색창(선택): #brand-search
 * 분류: page(파일명) 접미사 — W=더블유플러스, 글로리드=글로리드, 모두=모두오름, 나머지=와와
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
  // 학교 정식명↔약칭 통일 + 소문자화
  function norm(s) {
    return String(s == null ? "" : s).toLowerCase()
      .replace(/여자중학교/g, "여중").replace(/여자고등학교/g, "여고").replace(/여자초등학교/g, "여초")
      .replace(/초등학교/g, "초").replace(/중학교/g, "중").replace(/고등학교/g, "고")
      .replace(/\s+/g, " ");
  }

  var all = (window.WAWA_CENTERS || []).filter(function (c) { return suffixOf(c.page) === key; });

  var grid = document.getElementById("brand-grid");
  var countEl = document.getElementById("brand-count");
  var searchEl = document.getElementById("brand-search");
  if (!grid) return;

  function match(c, tokens) {
    if (!tokens.length) return true;
    var hay = norm(cleanName(c.name) + " " + c.region + " " + c.addr + " " + (c.dong || "") + " " + c.elem + " " + c.mid + " " + c.high);
    return tokens.every(function (t) { return hay.indexOf(t) >= 0; });
  }

  function render(kw) {
    var tokens = norm(kw || "").split(" ").filter(Boolean);
    var list = all.filter(function (c) { return match(c, tokens); });
    if (countEl) countEl.textContent = list.length + "개 지점";

    if (!list.length) {
      grid.innerHTML = '<p style="color:var(--color-muted);text-align:center;padding:40px 0">검색 결과가 없습니다. 다른 지역·학교명으로 검색해 보세요.</p>';
      return;
    }
    // 지역(region)별 그룹핑
    var groups = {}, order = [];
    list.forEach(function (c) {
      var r = c.region || "기타";
      if (!groups[r]) { groups[r] = []; order.push(r); }
      groups[r].push(c);
    });
    order.sort(function (a, b) { return a.localeCompare(b, "ko"); });

    var html = "";
    order.forEach(function (r) {
      var arr = groups[r].sort(function (a, b) { return cleanName(a.name).localeCompare(cleanName(b.name), "ko"); });
      html += '<div class="brand-region">';
      html += '<h3 class="brand-region-title">' + esc(r) + ' <span style="color:var(--color-muted);font-weight:600;font-size:14px">' + arr.length + '개</span></h3>';
      html += '<div class="brand-branch-grid">';
      arr.forEach(function (c) {
        html += '<a class="brand-branch-card" href="' + esc(c.page) + '">' +
                  '<span class="bb-name">' + esc(cleanName(c.name)) + '</span>' +
                  '<span class="bb-addr">' + esc(cleanAddr(c.addr)) + '</span>' +
                  '<span class="bb-more">센터 정보 보기 →</span>' +
                '</a>';
      });
      html += '</div></div>';
    });
    grid.innerHTML = html;
  }

  if (searchEl) {
    searchEl.addEventListener("input", function () { render(this.value.trim()); });
  }
  render("");
})();
