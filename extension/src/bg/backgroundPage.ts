import { browser } from 'webextension-polyfill-ts';
import * as config from '../config.js';

browser.browserAction.onClicked.addListener(function (activeTab) {
    browser.tabs.create({ url: config.URIFront + '/#/settings/plugin' });
});

let token = null;
let user = null;

async function init() {
    await loadUserFromStorage();
    await updateUserInfo();
}

async function apiCall(httpMethod: string, apiMethod: string, body: any = null) {
    try {
        let url = config.URIApi + 'api/' + apiMethod;
        let requestParams: RequestInit = {
            method: httpMethod,
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${token}`
            }
        };
        if (body) {
            requestParams.body = JSON.stringify(body);
        }
        let response = await fetch(url, requestParams);
        let responseBody = await response.json();
        if (response.status == 200) {
            return responseBody;
        } else {
            return { error: 'Error: ' + response.statusText }; // TODO: format to standart API error format
        }
    } catch (e) {
        return { error: 'Unknown error' }; // TODO: format to standart API error format
    }
}

browser.runtime.onMessage.addListener(async (message: any) => {
    let objData = message.data;
    let result: any = '';

    if (message.type == 'apiCall') {
        let response = await apiCall(message.httpMethod, message.apiMethod, message.body);
        return { type: 'apiResponse', response: response };
    }
    else if (message.type === 'siteAuth') {
        user = objData.user;
        token = objData.token;

        await browser.storage.local.set({ token: token, user: user });
    } else if (message.type === 'updateUserInfo') {
        updateUserInfo();
    } else if (message.type === 'saveSetting') {
        await browser.storage.local.set({
            settingExtensionAction: objData.settingExtension,
            settingExtensionSubtitle: objData.settingExtensionSubtitle
        });
    } else if (message.type === 'siteLogout') {
        token = '';
        await browser.storage.local.clear();
    } else if (message.type === 'sendLogServer') {
        await log({ objData });
    }
});

async function loadUserFromStorage() {
    let result = await browser.storage.local.get(['token', 'user']);
    if (result.token) {
        token = result.token;
    }
    if (result.user) {
        user = result.user;
    }
}

async function updateUserInfo() {
    if (user && token) {
        let responseTmp = await apiCall('GET', 'users/me');
        if (responseTmp && responseTmp.id) {
            user = responseTmp;
        }
    }
}

async function log(data: any) {
    let response = await apiCall('POST', 'logs/create', data);
    if (response.error) {
        console.log('Unable to send log. Error: ', response.error);
    }
}

init();

setInterval(() => {
    updateUserInfo();
}, 60 * 60 * 1000);