export const themes = {

    themes: {
        dark: {
            bgc: "#123",
            hover: "#374757",
            border: "#25323f",
            textColor: "#fff",
        },
        blue: {
            bgc: "#2367ac",
            hover: "#4981b9",
            border: "#0c59a7",
            textColor: "#fff",
        }
    },


    getStyle(element, property) {
        return window.getComputedStyle(element).getPropertyValue("--" + property);
    },

    loadThemes() {
        // localStorageTheme
        const lcStTm = localStorage.getItem("theme");
        const newTheme = (lcStTm) ? JSON.parse(lcStTm) : this.themes.dark;
        this.setTheme(newTheme);
    },

    setTheme(theme) {
        const html = document.querySelector("html");
        html.style.setProperty("--bgc", theme.bgc);
        html.style.setProperty("--hover", theme.hover);
        html.style.setProperty("--border", theme.border);
        html.style.setProperty("--text-color", theme.textColor);
        this.save(theme);
    },

    save(theme) {
        localStorage.setItem("theme", JSON.stringify(theme));
    }
};