import * as config from '../../allParam.config';

let token = null;
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    let objData = message.data;
    let result: any = '';

    if (message.type === 'sendBackground') {
        let objWord = JSON.stringify(objData);

        let request = new XMLHttpRequest();
        request.open('POST', config.URIApi + 'api/translates', true);
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
                sendResponse({ type: 'sendTranslateModal', data: result });
            } else {
                result = {
                    status: false,
                    error: 'errorToServer'
                };
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
                sendResponse({ type: 'sendTranslateModal', data: result });
            } else {
                result = {
                    status: false,
                    error: 'errorToServer'
                };
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
                sendResponse({ type: 'sendTranslateModal', data: result });
            } else {
                result = {
                    status: false,
                    error: 'errorToServer'
                };
                sendResponse({ type: 'sendTranslateModal', data: result });
            }
        });

        return true;
    } else if (message.type === 'siteAuth') {
        const user = JSON.parse(objData.user);
        token = objData.token;

        chrome.storage.local.set({ token: token, user: user }, () => {
            console.log('Set token and user');
        });
    } else if (message.type === 'saveSetting') {
        chrome.storage.local.set({ settingExtensionAction: objData.settingExtension }, () => {
            console.log('Set setting extension');
        });
    } else if (message.type === 'siteLogout') {
        token = '';
        chrome.storage.local.clear(() => {
            console.log('Remove extension, token, user');
        });
    } else if (message.type === 'setToToken') {
        chrome.storage.local.get(['token'], (result) => {
            if (result.hasOwnProperty('token')) {
                token = result.token;

                console.log('Writing a token into a variable');
            }
        });
    }
});

setInterval(() => {
    chrome.storage.local.get(['token', 'user'], (result) => {
        if (result.hasOwnProperty('token') && result.hasOwnProperty('user')) {
            let requestSettingsPlugin = new XMLHttpRequest();
            requestSettingsPlugin.open('GET', config.URIApi + 'api/plugins/' + result.user.id, true);
            requestSettingsPlugin.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            requestSettingsPlugin.setRequestHeader('Authorization', `Bearer ${result.token}`);
            requestSettingsPlugin.send();

            requestSettingsPlugin.onload = (() => {
                if (requestSettingsPlugin.readyState === 4 && requestSettingsPlugin.status === 200) {
                    let settingPlugin = JSON.parse(requestSettingsPlugin.responseText);

                    chrome.storage.local.set({ settingExtensionAction: String(settingPlugin.extensionShowTranslate),
                        user: settingPlugin.user }, () => {
                        console.log('Set new setting extension and user data');
                    });
                }
            });
        }
    });
}, 3600000);


setTimeout(() => {
    if (token === null) {
        chrome.storage.local.get(['token'], (result) => {
            if (result.hasOwnProperty('token')) {
                token = result.token;

                console.log('Writing a token into a variable, to timeout.');
            }
        });
    }
}, 12000);
