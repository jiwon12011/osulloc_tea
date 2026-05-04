document.addEventListener("DOMContentLoaded", () => {
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

        const updateHeaderShadow = () => {
            header.classList.toggle("is_scrolled", window.scrollY > 8);
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
});
