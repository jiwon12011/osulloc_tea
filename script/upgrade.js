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

        // brand (기존 reveal은 content1 대상이라 서브페이지에선 미작동 → 신규)
        add(".brand_story .story_header", false);
        add(".brand_story .val_item", true);
        add(".brand_story .col_text", false);
        add(".brand_mission .value_card", true);
        add(".brand_history .section_label", false);
        add(".brand_history .section_title", false);
        add(".timeline_item", true);
        add(".award_item", true);

        // program / sub_01
        add(".sub_intro .intro_text", false);
        add(".sub_intro .intro_content", true);
        add(".program_info_card", true);
        add(".space_item", true);
        add(".step_item", true);

        // community
        add(".notice_header", false);
        add(".gallery_header", false);
        add(".sns_header", false);
        add(".notice_item", true);
        add(".event_card", true);
        add(".gallery_card", true);
        add(".sns_tile", true);

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

        /* ── 5-1. 섹션 사이드 내비게이션 (서브페이지) ─────── */
        var spySections = [];
        var spyLinks = [];
        var spyEl = null;
        var panels = document.querySelectorAll("[data-tab-panel]");
        var labelMap = {
            course: "코스소개", guide: "프로그램 안내", space: "공간안내", reservation: "예약 가이드",
            story: "브랜드 스토리", philosophy: "철학과 가치", history: "브랜드 히스토리", awards: "인증·수상",
            featured: "피쳐드", all: "전체 제품", best: "베스트셀러",
            notice: "공지사항", news: "뉴스·이벤트", reviews: "방문 후기", sns: "SNS 피드"
        };
        if (panels.length) {
            panels.forEach(function (p) {
                var name = p.getAttribute("data-tab-name");
                var h2 = p.querySelector("h2");
                var label = labelMap[name] || (h2 ? h2.textContent.trim().split("\n")[0] : "");
                spySections.push({
                    el: p,
                    label: label,
                    dark: p.classList.contains("community_gallery") || p.classList.contains("brand_mission")
                });
            });
        } else if (document.querySelector(".cs_section")) {
            var cs = document.querySelector(".cs_section");
            var info = cs.querySelector(".cs_info");
            if (info) spySections.push({ el: info, label: "연락처", dark: false });
            cs.querySelectorAll(".cs_section_title").forEach(function (t) {
                spySections.push({ el: t, label: t.textContent.trim(), dark: false });
            });
        }

        if (spySections.length >= 2) {
            spyEl = document.createElement("nav");
            spyEl.className = "u-spy";
            spyEl.setAttribute("aria-label", "섹션 바로가기");
            var ul = document.createElement("ul");
            spySections.forEach(function (s) {
                var li = document.createElement("li");
                var a = document.createElement("a");
                a.href = "#";
                a.setAttribute("aria-label", s.label);
                var lab = document.createElement("span");
                lab.className = "u-spy-label";
                lab.textContent = s.label;
                var dot = document.createElement("span");
                dot.className = "u-spy-dot";
                a.appendChild(lab);
                a.appendChild(dot);
                a.addEventListener("click", function (e) {
                    e.preventDefault();
                    var y = s.el.getBoundingClientRect().top + window.scrollY - 90;
                    window.scrollTo({ top: y, behavior: reduceMotion ? "auto" : "smooth" });
                });
                li.appendChild(a);
                ul.appendChild(li);
                spyLinks.push(a);
            });
            spyEl.appendChild(ul);
            document.body.appendChild(spyEl);
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
                if (spySections.length && spyEl) {
                    var firstTop = spySections[0].el.getBoundingClientRect().top + window.scrollY;
                    spyEl.classList.toggle("is-ready", window.scrollY + window.innerHeight * 0.5 >= firstTop);
                    var mark = window.scrollY + window.innerHeight * 0.35;
                    var active = 0;
                    for (var i = 0; i < spySections.length; i++) {
                        if (spySections[i].el.getBoundingClientRect().top + window.scrollY <= mark) active = i;
                    }
                    spyLinks.forEach(function (a, i) { a.classList.toggle("is-active", i === active); });
                    spyEl.classList.toggle("on-dark", !!spySections[active].dark);
                }
                ticking = false;
            });
        }
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
    });
})();
