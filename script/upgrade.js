/* ============================================================
   OSULLOC TEA MUSEUM — Design Upgrade Layer (index)
   인터랙션/애니메이션 보강 스크립트.
   기존 script.js와 충돌하지 않도록 별도 IIFE로 동작합니다.
   ============================================================ */
(function () {
    "use strict";

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function ready(fn) {
        if (document.readyState !== "loading") fn();
        else document.addEventListener("DOMContentLoaded", fn);
    }

    ready(function () {

        /* ── 1. 히어로 로드 인트로 ────────────────────────── */
        // 이미 로드가 끝났을 수도 있으니 양쪽 모두 처리
        function markLoaded() { document.body.classList.add("u-loaded"); }
        if (document.readyState === "complete") markLoaded();
        else window.addEventListener("load", markLoaded);
        // 안전장치: 1초 뒤엔 무조건 노출
        setTimeout(markLoaded, 1000);

        /* ── 2. 스크롤 등장 애니메이션 ────────────────────── */
        // content1은 기존 로직(.show)이 이미 처리하므로 제외한다.
        var revealTargets = [];
        function add(selector, stagger) {
            var nodes = document.querySelectorAll(selector);
            for (var i = 0; i < nodes.length; i++) {
                var el = nodes[i];
                el.classList.add("u-reveal");
                if (stagger) el.style.setProperty("--u-delay", (i * 0.1) + "s");
                revealTargets.push(el);
            }
        }

        // index (해당 셀렉터는 메인에서만 매칭됨)
        add(".content2 .teacourse", false);
        add(".content2 ul li", true);
        add(".content3 .map_wrapper", false);
        add(".content3 .textbox", false);
        add(".content4 .c4_textbox", false);
        add(".content4 .c4_shop > a", false);
        add(".content4 .c4_shop .shopbox a", true);

        // product (자체 reveal 없음)
        add(".product_section_header", false);
        add(".product_catalog .product_card", true);
        add(".product_featured .highlight_item", true);
        add(".best_rank_item", true);
        add(".product_featured .product_featured_visual", false);

        // cs / 고객센터 (자체 reveal 없음)
        add(".cs_section_title", false);
        add(".cs_info_card", true);
        add(".faq_item", true);
        add(".cs_field", true);

        // login (자체 reveal 없음)
        add(".auth_form_section.is_active", false);

        // 모든 페이지 공통: 푸터
        add("footer .footer_box", false);

        if (reduceMotion || !("IntersectionObserver" in window)) {
            revealTargets.forEach(function (el) { el.classList.add("u-in"); });
        } else {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("u-in");
                        io.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
            revealTargets.forEach(function (el) { io.observe(el); });
        }

        /* ── 3. 상품 이미지 줌 래퍼 ───────────────────────── */
        // content4의 이미지를 .u-thumb로 감싸 호버 줌이 깔끔히 클리핑되게 함
        var shopImgs = document.querySelectorAll(".content4 .c4_shop > a > img, .content4 .c4_shop .shopbox a > img");
        shopImgs.forEach(function (img) {
            if (img.closest(".u-thumb")) return;
            var wrap = document.createElement("span");
            wrap.className = "u-thumb";
            img.parentNode.insertBefore(wrap, img);
            wrap.appendChild(img);
        });

        /* ── 4. 히어로 스크롤 인디케이터 삽입 ─────────────── */
        var scrollInd = null;
        if (document.querySelector(".mySwiper") && window.innerWidth > 640) {
            scrollInd = document.createElement("div");
            scrollInd.className = "u-scroll";
            scrollInd.setAttribute("aria-hidden", "true");
            scrollInd.innerHTML = '<div class="u-mouse"></div><span>SCROLL</span>';
            document.body.appendChild(scrollInd);
        }

        /* ── 5. 맨 위로 버튼 ──────────────────────────────── */
        var topBtn = document.createElement("button");
        topBtn.className = "u-top";
        topBtn.type = "button";
        topBtn.setAttribute("aria-label", "맨 위로 이동");
        topBtn.innerHTML = "↑";
        document.body.appendChild(topBtn);

        topBtn.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
        });

        var ticking = false;
        function onScroll() {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(function () {
                topBtn.classList.toggle("is-visible", window.scrollY > 500);
                if (scrollInd) scrollInd.classList.toggle("u-hide", window.scrollY > 300);
                ticking = false;
            });
        }
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
    });
})();
