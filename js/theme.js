 /* =========================================================
   TOMA — SISTEMA GLOBAL DE TEMA
   BLOCO 1 — MODO CLARO E MODO ESCURO
========================================================= */

(function () {
    "use strict";

    const THEME_STORAGE_KEY = "toma_dark_mode";
    const DARK_MODE_CLASS = "dark-mode";

    /* Ler a preferência guardada */
    function getSavedTheme() {
        try {
            return localStorage.getItem(THEME_STORAGE_KEY) === "true";
        } catch (error) {
            console.warn(
                "[TOMA THEME] Não foi possível ler a preferência:",
                error
            );

            return false;
        }
    }

    /* Aplicar o tema à página atual */
    function applyTheme(enabled) {
        document.documentElement.classList.toggle(
            DARK_MODE_CLASS,
            enabled
        );

        if (document.body) {
            document.body.classList.toggle(
                DARK_MODE_CLASS,
                enabled
            );
        }

        document.documentElement.style.colorScheme =
            enabled ? "dark" : "light";
    }

    /* Guardar e aplicar a preferência */
    function setTheme(enabled) {
        const darkModeEnabled = Boolean(enabled);

        try {
            localStorage.setItem(
                THEME_STORAGE_KEY,
                darkModeEnabled ? "true" : "false"
            );
        } catch (error) {
            console.warn(
                "[TOMA THEME] Não foi possível guardar a preferência:",
                error
            );
        }

        applyTheme(darkModeEnabled);
    }

    /* Aplicar imediatamente o tema guardado */
    applyTheme(getSavedTheme());

    /* Disponibilizar funções para as páginas Toma */
    window.TomaTheme = {
        apply: applyTheme,
        set: setTheme,
        isDark: getSavedTheme
    };

    console.info("[TOMA THEME] Sistema global carregado.");
})();
