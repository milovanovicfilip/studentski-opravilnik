document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("darkModeToggle");

    if (!toggle) return;

    const isDarkMode = localStorage.getItem("dark-mode") === "enabled";

    if (isDarkMode) {
        document.documentElement.setAttribute("data-theme", "dark");
        document.body.classList.add("dark-mode");
        toggle.checked = true;
    }

    toggle.addEventListener("change", () => {
        if (toggle.checked) {
            document.documentElement.setAttribute("data-theme", "dark");
            document.body.classList.add("dark-mode");
            localStorage.setItem("dark-mode", "enabled");
        } else {
            document.documentElement.removeAttribute("data-theme");
            document.body.classList.remove("dark-mode");
            localStorage.setItem("dark-mode", "disabled");
        }
    });
});

// Apply dark mode before page renders to prevent flickering
(function () {
    if (localStorage.getItem("dark-mode") === "enabled") {
        document.documentElement.setAttribute("data-theme", "dark");
        document.body.classList.add("dark-mode");
    }
})();
