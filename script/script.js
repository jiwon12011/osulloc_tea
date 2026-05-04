document.addEventListener("DOMContentLoaded", () => {
    const tabGroups = document.querySelectorAll("[data-tab-group]");

    tabGroups.forEach(group => {
        const triggers = group.querySelectorAll("[data-tab-target]");
        const panels = document.querySelectorAll(`[data-tab-panel="${group.dataset.tabGroup}"]`);

        if (!triggers.length || !panels.length) return;

        const setActiveTab = tabName => {
            triggers.forEach(trigger => {
                const item = trigger.closest("li");
                const isActive = trigger.dataset.tabTarget === tabName;

                if (item) item.classList.toggle("on", isActive);
                trigger.setAttribute("aria-selected", isActive ? "true" : "false");
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
                    trigger.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest",
                        inline: "center"
                    });
                }
            });
        });

        const defaultTrigger = group.querySelector("li.on [data-tab-target]") || triggers[0];
        setActiveTab(defaultTrigger.dataset.tabTarget);
    });
});
