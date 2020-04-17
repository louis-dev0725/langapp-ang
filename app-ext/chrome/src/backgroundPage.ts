chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.text == 'sendBackground') {
        let result = '';
        let jwt_token = message.data.token;
        delete message.data.token;
        let filter = JSON.stringify(message.data);
        let request = new XMLHttpRequest();
        request.open('POST', 'http://localhost:8090/api/translates', true);
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        request.setRequestHeader('Authorization', `Bearer ${jwt_token}`);
        request.send(filter);

        request.onload = function () {
            if (request.readyState == 4 && request.status == 200) {
                result = JSON.parse(request.responseText);
                console.log(result);
                sendResponse({ type: 'sendTranslateModal', data: result });
            }
        };

        return true;
    }
});
