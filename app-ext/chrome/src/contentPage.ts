let token = '';
let user = '';
let extensionSetting = false;
let setting = '';
let range: any = '';
let translateObj = {
  token: null,
  all_text: null,
  url: null,
  offset: null
};

window.onload = function(ev) {
  let isAuth = false;
  if (ev.target.location.origin == 'http://localhost:4200') {
    chrome.storage.sync.get(['token'], (result) => {
      if (result.hasOwnProperty('token')) {
        isAuth = true;
      }
    });

    if (!isAuth) {
      token = localStorage.getItem('token');
      user = localStorage.getItem('user');

      if (token != '' && user != '') {
        chrome.runtime.sendMessage({ type: 'siteAuth', data: { token: token, user: user }});
        extensionSetting = true;
      }
    }
  }

  chrome.storage.sync.get(['settingExtensionAction'], (result) => {
    if (result.hasOwnProperty('settingExtensionAction')) {
      setting = result.settingExtensionAction;
    }
  });

  chrome.storage.sync.get(['token'], (result) => {
    if (result.hasOwnProperty('token')) {
      token = result.token;
      extensionSetting = true;
    }
  });

  if (extensionSetting) {
    if (setting == '') {
      setting = 'extension.DoubleClick';
    }
    document.body.append(`<div id="overviewTranslate"><div id="modalTranslate"></div></div>`);

    document.addEventListener('dblclick', function(e) {
      if (setting == 'extension.DoubleClick') {
        if ((e.metaKey == false || e.ctrlKey == false) && e.shiftKey == false && e.altKey == false) {
          console.log('Двойной клик');

          createModalTranslateObject(document.caretRangeFromPoint(e.x, e.y), token);
        }
      }

      if (setting == 'extension.DoubleClickCtrl') {
        if ((e.metaKey == true || e.ctrlKey == true) && e.shiftKey == false && e.altKey == false) {
          console.log('Двойной клик + Ctrl');

          createModalTranslateObject(document.caretRangeFromPoint(e.x, e.y), token);
        }
      }

      if (setting == 'extension.DoubleClickShift') {
        if ((e.metaKey == false || e.ctrlKey == false) && e.shiftKey == true && e.altKey == false) {
          console.log('Двойной клик + Shift');

          createModalTranslateObject(document.caretRangeFromPoint(e.x, e.y), token);
        }
      }

      if (setting == 'extension.DoubleClickAlt') {
        if ((e.metaKey == false || e.ctrlKey == false) && e.shiftKey == false && e.altKey == true) {
          console.log('Двойной клик + Alt');

          createModalTranslateObject(document.caretRangeFromPoint(e.x, e.y), token);
        }
      }
    });
  }
};

window.addEventListener('message', function(event) {
  if (event.source != window) {
    return;
  }

  if (event.data.type && (event.data.type == 'LoginSuccess') && (event.origin == 'http://localhost:4200')) {
    token = localStorage.getItem('token');
    user = localStorage.getItem('user');

    chrome.runtime.sendMessage({ type: 'siteAuth', data: { token: token, user: user }});
  }

  if (event.data.type && (event.data.type == 'saveSettingExtension') && (event.origin == 'http://localhost:4200')) {
    let settingExtension = JSON.parse(localStorage.getItem(event.data.text));
    chrome.runtime.sendMessage({ type: 'saveSetting', data: { settingExtension: String(settingExtension.extensionShowTranslate) }});

    setting = String(settingExtension.extensionShowTranslate);
  }

  if (event.data.type && (event.data.type == 'Logout') && (event.origin == 'http://localhost:4200')) {
    chrome.runtime.sendMessage({ type: 'siteLogout' });
  }
});

function createModalTranslateObject (range, token) {
  translateObj = null;
  //translateObj = {
  //  token: token,
  //  all_text: range.startContainer.data,
  //  url: range.startContainer.ownerDocument.location.href,
  //  offset: range.startOffset
  //};

  translateObj = {
    token: token,
    all_text: 'これは日本語の形態素解析のテストです。動詞の形も一般化できるようになっています。',
    url: range.startContainer.ownerDocument.location.href,
    offset: 3
  };

  chrome.runtime.sendMessage({ text: 'sendBackground', data: translateObj }, function (response) {
    console.log(response);
  });
}
