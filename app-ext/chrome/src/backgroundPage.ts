import * as config from '../../allParam.config'

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    let objData = message.data;
    if (message.type == 'sendBackground') {
        let result = '';
        let jwt_token = message.data.token;
        delete message.data.token;
        let filter = JSON.stringify(message.data);
        let request = new XMLHttpRequest();
        request.open('POST', config.URIApi + 'api/translates', true);
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        request.setRequestHeader('Authorization', `Bearer ${jwt_token}`);
        request.send(filter);

        request.onload = function () {
            if (request.readyState == 4 && request.status == 200) {
                result = JSON.parse(request.responseText);
                sendResponse({ type: 'sendTranslateModal', data: result });
            }
        };

        return true;
    } else if (message.type === 'siteAuth') {
        this.user = JSON.parse(objData.user);
        this.token = objData.token;

        chrome.storage.local.set({ token: objData.token, user: objData.user }, () => {
            console.log('Set token and user');
        });

        console.log('siteAuth');
    } else if (message.type === 'saveSetting') {
        chrome.storage.local.set({ settingExtensionAction: objData.settingExtension }, () => {
            console.log('Set setting extension');
        });

        console.log('saveSetting');
    } else if (message.type === 'siteLogout') {
        chrome.storage.local.remove(['token', 'user', 'settingExtension']);

        console.log('siteLogout');
    }
});

setInterval(() => {
    chrome.storage.local.get(['token', 'user'], (result) => {
        if (result.hasOwnProperty('token') && result.hasOwnProperty('user')) {
            let requestSettingsPlugin = new XMLHttpRequest();
            requestSettingsPlugin.open('GET', config.URIApi + 'api/plugins/' + JSON.parse(result.user).id, true);
            requestSettingsPlugin.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            requestSettingsPlugin.setRequestHeader('Authorization', `Bearer ${result.token}`);
            requestSettingsPlugin.send();

            requestSettingsPlugin.onload = function () {
                if (requestSettingsPlugin.readyState == 4 && requestSettingsPlugin.status == 200) {
                    let settingPlugin = JSON.parse(requestSettingsPlugin.responseText);
                    chrome.storage.local.set({ settingExtensionAction: String(settingPlugin.extensionShowTranslate) }, () => {
                        console.log('Set new setting extension');
                    });
                }
            };
        }
    });
}, 3600000);
