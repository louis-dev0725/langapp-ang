let token = '';
let user = '';
let extensionSetting = false;
let setting = '';
let range: any = '';
let translateObj = {
  symbol: null,
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
    console.log('Есть доступ к настройкам плагина и функционалу');

    document.addEventListener('dblclick', function(e) {
      if (setting == 'extension.DoubleClick') {
        if ((e.metaKey == false || e.ctrlKey == false) && e.shiftKey == false && e.altKey == false) {
          console.log('Двойной клик');

          range = document.caretRangeFromPoint(e.x, e.y);
          console.log(getTranslateObject(range));
        }
      }

      if (setting == 'extension.DoubleClickCtrl') {
        if ((e.metaKey == true || e.ctrlKey == true) && e.shiftKey == false && e.altKey == false) {
          console.log('Двойной клик + Ctrl');

          range = document.caretRangeFromPoint(e.x, e.y);
          console.log(getTranslateObject(range));
        }
      }

      if (setting == 'extension.DoubleClickShift') {
        if ((e.metaKey == false || e.ctrlKey == false) && e.shiftKey == true && e.altKey == false) {
          console.log('Двойной клик + Shift');

          range = document.caretRangeFromPoint(e.x, e.y);
          console.log(getTranslateObject(range));
        }
      }

      if (setting == 'extension.DoubleClickAlt') {
        if ((e.metaKey == false || e.ctrlKey == false) && e.shiftKey == false && e.altKey == true) {
          console.log('Двойной клик + Alt');

          range = document.caretRangeFromPoint(e.x, e.y);
          console.log(getTranslateObject(range));
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

function getTranslateObject (range) {
  translateObj = null;

  return translateObj = {
    symbol: range.startContainer.data.substring(range.startOffset, range.startOffset + 1),
    all_text: range.startContainer.data,
    url: range.startContainer.ownerDocument.location.href,
    offset: range.startOffset
  };
}
