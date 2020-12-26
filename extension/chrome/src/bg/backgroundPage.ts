import * as config from '../../../allParam.config';

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

async function processMessageAsync(message: any, sender: chrome.runtime.MessageSender, sendResponse: (r?: any) => void) {
    if (message.type == 'apiCall') {
        let response = await apiCall(message.httpMethod, message.apiMethod, message.body);
        sendResponse({ type: 'apiResponse', response: response });
    }
}

chrome.runtime.onMessage.addListener((message: any, sender: chrome.runtime.MessageSender, sendResponse: (r?: any) => void) => {
    let objData = message.data;
    let result: any = '';

    if (message.type == 'apiCall') {
        processMessageAsync(message, sender, sendResponse);
        return true;
    }
    if (message.type === 'sendBackground') {
        let objWord = JSON.stringify(objData);

        let request = new XMLHttpRequest();
        request.open('POST', config.URIApi + 'api/processText', true);
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        request.setRequestHeader('Authorization', `Bearer ${token}`);
        request.send(objWord);

        request.onload = (() => {
            if (request.readyState === 4 && request.status === 200) {
                result = JSON.parse(request.responseText);
                sendResponse({ type: 'sendTranslateModal', data: result });
            } else if (request.status === 401) {
                result = {
                    status: false,
                    error: 'nonAuth'
                };

                const text = JSON.parse(request.responseText);
                log({ objData, result, text });
                sendResponse({ type: 'sendTranslateModal', data: result });
            } else {
                result = {
                    status: false,
                    error: 'errorToServer'
                };

                const text = JSON.parse(request.responseText);
                log({ objData, result, text });
                sendResponse({ type: 'sendTranslateModal', data: result });
            }
        });

        return true;
    } else if (message.type === 'sendSelectedBackground') {
        let objWord = JSON.stringify(objData);

        let request = new XMLHttpRequest();
        request.open('POST', config.URIApi + 'api/translates/select', true);
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        request.setRequestHeader('Authorization', `Bearer ${token}`);
        request.send(objWord);

        request.onload = (() => {
            if (request.readyState === 4 && request.status === 200) {
                result = JSON.parse(request.responseText);
                sendResponse({ type: 'sendTranslateModal', data: result });
            } else if (request.status === 401) {
                result = {
                    status: false,
                    error: 'nonAuth'
                };

                const text = JSON.parse(request.responseText);
                log({ objData, result, text });
                sendResponse({ type: 'sendTranslateModal', data: result });
            } else {
                result = {
                    status: false,
                    error: 'errorToServer'
                };

                const text = JSON.parse(request.responseText);
                log({ objData, result, text });
                sendResponse({ type: 'sendTranslateModal', data: result });
            }
        });

        return true;
    } else if (message.type === 'sendToDictionary') {
        let objWord = JSON.stringify(objData);

        let request = new XMLHttpRequest();
        request.open('POST', config.URIApi + 'api/dictionaries', true);
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        request.setRequestHeader('Authorization', `Bearer ${token}`);
        request.send(objWord);

        request.onload = (() => {
            if (request.readyState === 4 && request.status === 200) {
                result = JSON.parse(request.responseText);
                sendResponse({ type: 'sendResultDictionary', data: result });
            } else if (request.status === 401) {
                result = {
                    status: false,
                    error: 'nonAuth'
                };

                const text = JSON.parse(request.responseText);
                log({ objData, result, text });
                sendResponse({ type: 'sendTranslateModal', data: result });
            } else {
                result = {
                    status: false,
                    error: 'errorToServer'
                };

                const text = request.responseText;
                const res = JSON.stringify(result);
                log({ objWord, res, text });
                sendResponse({ type: 'sendTranslateModal', data: result });
            }
        });

        return true;
    } else if (message.type === 'siteAuth') {
        user = objData.user;
        token = objData.token;

        chrome.storage.local.set({ token: token, user: user }, () => {
            console.log('Set token and user');
        });
    } else if (message.type === 'updateUserInfo') {
        updateUserInfo();
    } else if (message.type === 'saveSetting') {
        chrome.storage.local.set({
            settingExtensionAction: objData.settingExtension,
            settingExtensionSubtitle: objData.settingExtensionSubtitle
        }, () => {
            console.log('Set setting extension');
        });
    } else if (message.type === 'siteLogout') {
        token = '';
        chrome.storage.local.clear(() => {
            console.log('Remove extension, token, user');
        });
    } else if (message.type === 'sendLogServer') {
        log({ objData });
    }
});

async function loadUserFromStorage() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['token', 'user'], (result) => {
            if (result.token) {
                token = result.token;
            }
            if (result.user) {
                user = result.user;
            }
            resolve();
        });
    });
}

async function updateUserInfo() {
    if (user && token) {
        let responseTmp = await apiCall('GET', 'users/me');
        if (responseTmp && responseTmp.id) {
            user = responseTmp;
        }
    }
}

async function log(data) {
    let response = await apiCall('POST', 'logs/create', data);
    if (response.error) {
        console.log('Unable to send log. Error: ', response.error);
    }
}

init();

setInterval(() => {
    updateUserInfo();
}, 60 * 60 * 1000);