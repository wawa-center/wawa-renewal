/* =========================================================
   와와 학습코칭센터 — shared interactions
   ========================================================= */
(function () {
  "use strict";

  /* ---- Mobile nav toggle ---- */
  var toggle = document.querySelector(".nav-toggle");
  var body = document.body;
  if (toggle) {
    toggle.addEventListener("click", function () {
      body.classList.toggle("nav-open");
      var open = body.classList.contains("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // close menu when a link is clicked
    document.querySelectorAll(".main-nav a").forEach(function (a) {
      a.addEventListener("click", function () { body.classList.remove("nav-open"); });
    });
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    if (!q || !a) return;
    q.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      // close siblings within the same .faq group
      var group = item.closest(".faq");
      if (group) {
        group.querySelectorAll(".faq-item.open").forEach(function (other) {
          if (other !== item) {
            other.classList.remove("open");
            var oa = other.querySelector(".faq-a");
            if (oa) oa.style.maxHeight = null;
          }
        });
      }
      if (isOpen) {
        item.classList.remove("open");
        a.style.maxHeight = null;
      } else {
        item.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Simple auto slider (testimonials / hero) ---- */
  document.querySelectorAll("[data-slider]").forEach(function (slider) {
    var track = slider.querySelector(".slider-track");
    var slides = slider.querySelectorAll(".slide");
    if (!track || slides.length < 2) return;
    var i = 0;
    setInterval(function () {
      i = (i + 1) % slides.length;
      track.style.transform = "translateX(-" + i * 100 + "%)";
    }, 4000);
  });

  /* ---- Demo form submit (시트 미연동 폼) ---- */
  document.querySelectorAll("form[data-demo]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = form.querySelector(".form-result");
      if (msg) {
        msg.textContent = "✅ 신청이 접수되었습니다. 빠른 시일 내에 연락드리겠습니다. (데모)";
        msg.style.display = "block";
      }
      form.reset();
    });
  });

  /* ---- Google Sheet 연동 폼 (Apps Script 웹앱으로 전송) ---- */
  document.querySelectorAll("form[data-sheet]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var endpoint = form.getAttribute("data-sheet");
      var msg = form.querySelector(".form-result");
      var btn = form.querySelector('button[type="submit"]');

      function show(text, color) {
        if (!msg) return;
        msg.textContent = text;
        msg.style.color = color || "var(--color-primary)";
        msg.style.display = "block";
      }

      // 아직 시트 URL이 연결되지 않은 경우(데모)
      if (!endpoint) {
        show("✅ (데모) 구글 시트 연동 전입니다. 연동 후 실제로 저장됩니다.");
        form.reset();
        return;
      }

      var data = new URLSearchParams(new FormData(form));
      var orig = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "전송 중..."; }

      // Apps Script 웹앱은 CORS 응답을 주지 않으므로 no-cors로 전송
      fetch(endpoint, { method: "POST", mode: "no-cors", body: data })
        .then(function () {
          show("✅ 신청이 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.");
          form.reset();
        })
        .catch(function () {
          show("⚠️ 전송에 실패했습니다. 잠시 후 다시 시도하거나 1599-1497로 연락 주세요.", "#ef4444");
        })
        .then(function () {
          if (btn) { btn.disabled = false; btn.textContent = orig; }
        });
    });
  });

  /* ---- Footer year ---- */
  var yr = document.querySelector("[data-year]");
  if (yr) yr.textContent = new Date().getFullYear();
})();

/* ---- 모바일 가로 카테고리 바 (햄버거 대체, 전 페이지 공통) ---- */
(function () {
  if (document.querySelector(".mobile-cat-bar")) return;
  var header = document.querySelector(".site-header");
  var links = document.querySelectorAll(".main-nav ul li a");
  if (!header || !links.length) return;
  var bar = document.createElement("nav");
  bar.className = "mobile-cat-bar";
  bar.setAttribute("aria-label", "카테고리");
  var ul = document.createElement("ul");
  links.forEach(function (a) {
    var li = document.createElement("li");
    var na = document.createElement("a");
    na.href = a.getAttribute("href");
    na.textContent = a.textContent.trim();
    if (a.classList.contains("active")) na.classList.add("active");
    li.appendChild(na);
    ul.appendChild(li);
  });
  bar.appendChild(ul);
  header.insertAdjacentElement("afterend", bar);
  var act = bar.querySelector("a.active");
  if (act && act.scrollIntoView) { try { act.scrollIntoView({ inline: "center", block: "nearest" }); } catch (e) {} }
})();

/* ---- 카톡 상담 플로팅 버튼 (전 페이지 공통) ---- */
(function () {
  if (document.querySelector(".kakao-float")) return;
  var a = document.createElement("a");
  a.className = "kakao-float";
  a.href = "https://open.kakao.com/o/sg4iDU3c";
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.setAttribute("aria-label", "카카오톡 상담");
  a.innerHTML = '<span class="kakao-float-ic" aria-hidden="true">💬</span><span class="kakao-float-tx">카톡 상담</span>';
  document.body.appendChild(a);
})();
