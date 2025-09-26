/*
  i18n.js – client-side translation loader.
  Loads a JSON language file from /lang and updates all elements with data-i18n keys.
*/
let currentLang = 'de';
async function loadLanguage(lang) {
  try {
    const res = await fetch(`lang/${lang}.json`, {cache:'no-store'});
    if (!res.ok) throw new Error('Translation file not found');
    const dict = await res.json();
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) el.innerHTML = dict[key];
    });
    currentLang = lang;
    localStorage.setItem('smartliving_lang', lang);
  } catch (err) {
    console.warn('Failed to load language', lang, err);
  }
}
function setLanguage(lang) {
  loadLanguage(lang);
}
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('smartliving_lang');
  loadLanguage(saved || currentLang);
});
