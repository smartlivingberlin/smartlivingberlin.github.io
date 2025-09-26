// i18n.js – simple client-side translation loader
// This script fetches translation dictionaries from the `lang/` directory
// and applies translated text to elements with a `data-i18n` attribute.

let currentLang = 'de';

/**
 * Load a language file and update the page.
 * @param {string} lang Language code (e.g. 'de' or 'en')
 */
async function loadLanguage(lang) {
  try {
    const response = await fetch(`lang/${lang}.json`, {cache: 'no-store'});
    if (!response.ok) throw new Error('Translation file not found');
    const dict = await response.json();
    applyTranslations(dict);
    currentLang = lang;
  } catch (err) {
    console.warn('Failed to load language', lang, err);
  }
}

/**
 * Apply all translations to elements with data-i18n attributes.
 * @param {object} dict A dictionary mapping keys to translated strings
 */
function applyTranslations(dict) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      // Use textContent to avoid interpreting HTML inside translations.
      el.innerHTML = dict[key];
    }
  });
}

/**
 * Change the current language and persist the preference in localStorage.
 * @param {string} lang
 */
function setLanguage(lang) {
  localStorage.setItem('smartliving_lang', lang);
  loadLanguage(lang);
}

// Load the saved language preference (if any) on page load.
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('smartliving_lang');
  const lang = saved || currentLang;
  loadLanguage(lang);
});
