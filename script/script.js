/* ── 언어 번역 데이터 ── */
const i18nData = {
    ko: { login: "로그인", signup: "회원가입", cs: "고객센터", logout: "로그아웃", mypage: "마이페이지", lang_label: "KR" },
    en: { login: "Login",  signup: "Sign Up",  cs: "Support",  logout: "Log Out",  mypage: "My Page",    lang_label: "EN" },
    ja: { login: "ログイン", signup: "会員登録", cs: "サポート", logout: "ログアウト", mypage: "マイページ", lang_label: "JP" }
};

function applyLang(lang) {
    if (!i18nData[lang]) return;
    const t = i18nData[lang];
    document.documentElement.lang = lang === "ko" ? "ko" : lang === "en" ? "en" : "ja";
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.dataset.i18n;
        if (t[key]) el.textContent = t[key];
    });
    const langCurrent = document.querySelector(".lang_current");
    if (langCurrent) langCurrent.textContent = t.lang_label;
    document.querySelectorAll(".lang_option").forEach(btn => {
        btn.classList.toggle("is_active", btn.dataset.lang === lang);
    });
    localStorage.setItem("osulloc_lang", lang);
}

document.addEventListener("DOMContentLoaded", () => {
    /* ── 언어 선택기 ── */
    const langSelector = document.querySelector(".lang_selector");
    if (langSelector) {
        const langBtn = langSelector.querySelector(".lang_btn");
        langBtn.addEventListener("click", e => {
            e.stopPropagation();
            const isOpen = langSelector.classList.toggle("is_open");
            langBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });
        langSelector.querySelectorAll(".lang_option").forEach(btn => {
            btn.addEventListener("click", () => {
                applyLang(btn.dataset.lang);
                langSelector.classList.remove("is_open");
                langBtn.setAttribute("aria-expanded", "false");
            });
        });
        document.addEventListener("click", e => {
            if (!langSelector.contains(e.target)) {
                langSelector.classList.remove("is_open");
                langBtn.setAttribute("aria-expanded", "false");
            }
        });
        document.addEventListener("keydown", e => {
            if (e.key === "Escape") langSelector.classList.remove("is_open");
        });
        applyLang(localStorage.getItem("osulloc_lang") || "ko");
    }
    const header = document.querySelector(".header");
    const menuButton = document.querySelector(".mobile_menu_btn");

    if (header && menuButton) {
        const setMenuOpen = isOpen => {
            header.classList.toggle("is_menu_open", isOpen);
            menuButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
            menuButton.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
            if (menuButton.firstChild) {
                menuButton.firstChild.nodeValue = isOpen ? "×" : "☰";
            }
        };

        let headerScrolled = null;
        const applyHeaderShadow = () => {
            const next = window.scrollY > 8;
            // 상태가 바뀔 때만 클래스 토글 → backdrop-filter 리페인트 비용 최소화
            if (next !== headerScrolled) {
                headerScrolled = next;
                header.classList.toggle("is_scrolled", next);
            }
        };
        let headerTicking = false;
        const updateHeaderShadow = () => {
            if (headerTicking) return;
            headerTicking = true;
            window.requestAnimationFrame(() => {
                applyHeaderShadow();
                headerTicking = false;
            });
        };

        menuButton.addEventListener("click", event => {
            event.preventDefault();
            setMenuOpen(!header.classList.contains("is_menu_open"));
        });

        header.querySelectorAll(".nav a").forEach(link => {
            link.addEventListener("click", () => setMenuOpen(false));
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") setMenuOpen(false);
        });

        window.addEventListener("resize", () => {
            if (!window.matchMedia("(max-width: 640px)").matches) {
                setMenuOpen(false);
            }
        });

        window.addEventListener("scroll", updateHeaderShadow, { passive: true });
        updateHeaderShadow();
    }

    const tabGroups = document.querySelectorAll("[data-tab-group]");

    tabGroups.forEach(group => {
        const triggers = group.querySelectorAll("[data-tab-target]");
        const panels = document.querySelectorAll(`[data-tab-panel="${group.dataset.tabGroup}"]`);

        if (!triggers.length || !panels.length) return;

        const toggle = document.createElement("button");
        toggle.className = "submenu_toggle";
        toggle.type = "button";
        toggle.setAttribute("aria-expanded", "false");
        group.insertBefore(toggle, group.querySelector("ul"));

        const setSubmenuOpen = isOpen => {
            group.classList.toggle("is_open", isOpen);
            toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        };

        const updateToggleText = activeTrigger => {
            toggle.textContent = activeTrigger.textContent.trim();
        };

        const setActiveTab = tabName => {
            triggers.forEach(trigger => {
                const item = trigger.closest("li");
                const isActive = trigger.dataset.tabTarget === tabName;

                if (item) item.classList.toggle("on", isActive);
                trigger.setAttribute("aria-selected", isActive ? "true" : "false");

                if (isActive) updateToggleText(trigger);
            });

            panels.forEach(panel => {
                const isActive = panel.dataset.tabName === tabName;

                panel.classList.toggle("is_active", isActive);
                panel.hidden = !isActive;
            });
        };

        triggers.forEach(trigger => {
            trigger.addEventListener("click", event => {
                event.preventDefault();
                setActiveTab(trigger.dataset.tabTarget);

                if (window.matchMedia("(max-width: 640px)").matches) {
                    setSubmenuOpen(false);
                }
            });
        });

        toggle.addEventListener("click", () => {
            setSubmenuOpen(!group.classList.contains("is_open"));
        });

        document.addEventListener("click", event => {
            if (!group.contains(event.target)) setSubmenuOpen(false);
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") setSubmenuOpen(false);
        });

        const defaultTrigger = group.querySelector("li.on [data-tab-target]") || triggers[0];
        setActiveTab(defaultTrigger.dataset.tabTarget);
    });

    /* ── 로그인/회원가입 탭 ── */
    const authTabBtns = document.querySelectorAll(".auth_tab_btn");
    if (authTabBtns.length) {
        const authSections = document.querySelectorAll(".auth_form_section");
        authTabBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const target = btn.dataset.authTab;
                authTabBtns.forEach(b => b.classList.toggle("is_active", b === btn));
                authSections.forEach(s => s.classList.toggle("is_active", s.dataset.authSection === target));
            });
        });
        const hash = location.hash.replace("#", "");
        const initial = (hash === "signup") ? "signup" : "login";
        authTabBtns.forEach(b => b.classList.toggle("is_active", b.dataset.authTab === initial));
        authSections.forEach(s => s.classList.toggle("is_active", s.dataset.authSection === initial));
    }

    /* ── FAQ 아코디언 ── */
    document.querySelectorAll(".faq_question").forEach(btn => {
        btn.addEventListener("click", () => {
            const item = btn.closest(".faq_item");
            const isOpen = item.classList.contains("is_open");
            document.querySelectorAll(".faq_item.is_open").forEach(i => i.classList.remove("is_open"));
            if (!isOpen) item.classList.add("is_open");
        });
    });

    const mapPoints = Array.from(document.querySelectorAll(".map_wrapper .point"));

    if (mapPoints.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        let activeMapPoint = null;
        let previousIndex = -1;

        const showRandomMapPoint = () => {
            if (activeMapPoint) activeMapPoint.classList.remove("is_auto_active");

            let nextIndex = Math.floor(Math.random() * mapPoints.length);
            if (mapPoints.length > 1) {
                while (nextIndex === previousIndex) {
                    nextIndex = Math.floor(Math.random() * mapPoints.length);
                }
            }

            previousIndex = nextIndex;
            activeMapPoint = mapPoints[nextIndex];
            activeMapPoint.classList.add("is_auto_active");
        };

        mapPoints.forEach(point => {
            point.addEventListener("mouseenter", () => point.classList.remove("is_auto_active"));
        });

        showRandomMapPoint();
        const mapIntervalId = window.setInterval(showRandomMapPoint, 1800);
        window.addEventListener("beforeunload", () => clearInterval(mapIntervalId));
    }
});
