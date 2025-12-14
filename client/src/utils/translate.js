// Language utilities - ready for custom implementation
// Google Translate has been removed

export const changeLanguage = (languageCode) => {
  // Save preference to localStorage
  localStorage.setItem("preferredLanguage", languageCode);

  const setGoogleCookie = (lang) => {
    try {
      // Set googtrans cookie so Google Translate remembers the language
      const domain = window.location.hostname;
      document.cookie = `googtrans=/en/${lang};path=/;domain=${domain}`;
      document.cookie = `googtrans=/en/${lang};path=/`; // fallback without domain
    } catch (e) {
      // ignore cookie failures
    }
  };

  const loadScript = () => {
    if (window.__googleTranslateLoaded) return;
    window.__googleTranslateLoaded = true;
    // Create callback that Google will call after loading
    window.googleTranslateElementInit = function () {
      try {
        new window.google.translate.TranslateElement(
          { pageLanguage: 'en', includedLanguages: 'hi', layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE },
          'google_translate_element'
        );
      } catch (err) {
        // ignore
      }
    };
    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.head.appendChild(script);
  };

  // Apply cookie then load widget (or reload to apply)
  setGoogleCookie(languageCode);
  loadScript();

  // Give the widget a moment to initialize and then reload so translation takes effect
  setTimeout(() => {
    try { window.location.reload(); } catch (e) {}
  }, 700);
};

export const initializeLanguage = () => {
  const savedLanguage = localStorage.getItem("preferredLanguage");
  if (savedLanguage && savedLanguage !== 'en') {
    try {
      document.cookie = `googtrans=/en/${savedLanguage};path=/`; 
    } catch (e) {}
    // Load translator so language persists
    if (!window.__googleTranslateLoaded) {
      window.googleTranslateElementInit = function () {
        try {
          new window.google.translate.TranslateElement(
            { pageLanguage: 'en', includedLanguages: 'hi', layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE },
            'google_translate_element'
          );
        } catch (err) {}
      };
      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.head.appendChild(script);
      window.__googleTranslateLoaded = true;
    }
  }
};
