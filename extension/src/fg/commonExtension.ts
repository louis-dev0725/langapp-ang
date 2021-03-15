import { browser } from "../../node_modules/webextension-polyfill-ts/lib/index";

export async function apiCall(httpMethod: string, apiMethod: string, body: any) {
    let response = await browser.runtime.sendMessage({ type: 'apiCall', httpMethod, apiMethod, body });
    return response.response;
}