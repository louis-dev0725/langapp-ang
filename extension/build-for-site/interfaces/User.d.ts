export default interface User {
    balance: string;
    balancePartner: string;
    company: string;
    config: any;
    currency: string;
    email: string;
    extensionSettings: ExtensionSettings;
    homeLanguage?: HomeLanguage;
    id: number;
    isAdmin: boolean;
    isPartner: number;
    isServicePaused: number;
    language: string;
    languages: string[];
    name: string;
    notifications: any[];
    paidUntilDateTime: string;
    partnerPercent: string;
    site: string;
    telephone: string;
    timezone: string;
    wmr: string;
}
export interface HomeLanguage {
    code: string;
    id: number;
    title: string;
}
export interface ExtensionSettings {
    clickModifier?: string;
    processSubtitles?: boolean;
}
