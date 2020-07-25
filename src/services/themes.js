import { themes_data } from '../assets/themes/themes_data';

export const themes = {

    themes_data,


    getStyle(element, property) {
        return window.getComputedStyle(element).getPropertyValue("--" + property);
    },

    loadThemes() {
        // localStorageTheme
        const lcStTm = localStorage.getItem("theme");
        const newTheme = (lcStTm) ? JSON.parse(lcStTm) : this.themes_data.dark;
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