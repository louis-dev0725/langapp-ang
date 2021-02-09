import i18next, { TFunction } from 'i18next';
import translations from './translations';

let language = navigator.language;

i18next.init({
    lng: language,
    fallbackLng: 'en',
    resources: translations, 
    initImmediate: false
});

export const i18n = i18next;
export const t : TFunction = function (...args : any) {
    // @ts-ignore
    return i18next.t(...args);
};