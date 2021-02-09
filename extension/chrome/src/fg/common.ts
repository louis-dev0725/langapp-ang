import User from "../interfaces/User";
import { Modal } from "./Modal";

const japaneseRegex = /[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]/;

class State {
    user: User = null;
    modal: Modal = new Modal();
}

export const state = new State();

export function isStringContainsJapanese(string: string): boolean {
    return japaneseRegex.test(string);
}

export async function apiCall(httpMethod: string, apiMethod: string, body: any) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ type: 'apiCall', httpMethod, apiMethod, body }, (response) => {
        resolve(response.response);
      });
    });
  }