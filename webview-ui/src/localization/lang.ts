import enUS from './languages/en-US';
import zhCN from './languages/zh-CN';

interface LanguageData {
  [key: string]: string;
}

let _currentLanguage = process.env.REACT_APP_DEFAULT_LANG || 'en-US';
let _currentLanguagePackage: null | LanguageData = null;

export function installLanguage(
  lang: string,
  callback: (lang: string) => void
) {
  if (lang.startsWith('zh')) {
    lang = 'zh-CN';
  }

  const handler = (langPackage: LanguageData) => {
    _currentLanguage = lang;
    _currentLanguagePackage = langPackage;
    callback(lang);
  };

  if (lang === 'zh-CN') {
    handler(zhCN);
  } else {
    handler(enUS);
  }
}

export function localizedMessage(mid: string) {
  const langPack = _currentLanguagePackage;
  let value;
  if (langPack) {
    value = langPack[mid];
  }

  return value !== undefined ? value : mid;
}

export const _L = localizedMessage;

export function currentLanguage() {
  return _currentLanguage;
}

export function currentLanguagePackage() {
  return _currentLanguagePackage;
}
