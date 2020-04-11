let token = '';
let user = '';
let extensionSetting = false;
let setting = '';

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
    setting = localStorage.getItem(event.data.message);

    chrome.storage.sync.set({ settingExtension: setting }, () => {
      console.log('Set setting extension');
    });
    console.log(setting);
  }

  if (event.data.type && (event.data.type == 'Logout') && (event.origin == 'http://localhost:4200')) {
    chrome.runtime.sendMessage({ type: 'siteLogout' });
  }
});

chrome.storage.sync.get(['settingExtension'], (result) => {
  if (result.hasOwnProperty('settingExtension')) {
    setting = JSON.parse(result.settingExtension);
    console.log(setting);
  }
});
chrome.storage.sync.get(['token'], (result) => {
  if (result.hasOwnProperty('token')) {
    token = result.token;
    extensionSetting = true;
  }
});

if (extensionSetting) {
  if (setting === '') {
    setting = 'extension.DoubleClick';
  }
  console.log('Есть доступ к настройкам плагина и функционалу');

  document.addEventListener("dblclick", function(e) {
    //if (setting === 'extension.DoubleClick') {
      if ((e.metaKey === false || e.ctrlKey === false) && e.shiftKey === false && e.altKey === false) {
        console.log('Двойной клик');
      }
    //}
    //if (setting === 'extension.DoubleClickCtrl') {
      if ((e.metaKey === true || e.ctrlKey === true) && e.shiftKey === false && e.altKey === false) {
        console.log('Двойной клик + Ctrl');
      }
    //}
    //if (setting === 'extension.DoubleClickShift') {
      if ((e.metaKey === false || e.ctrlKey === false) && e.shiftKey === true && e.altKey === false) {
        console.log('Двойной клик + Shift');
      }
    //}
    //if (setting === 'extension.DoubleClickAlt') {
      if ((e.metaKey === false || e.ctrlKey === false) && e.shiftKey === false && e.altKey === true) {
        console.log('Двойной клик + Alt');
      }
    //}

    let selection = window.getSelection();
    console.log(selection.toString());

    console.log(e);
  });
}

// Послыаем данные куда-то в расширение
// chrome.extension.sendMessage();

// Принимаем данные от расширения
// chrome.extension.onMessage.addListener((request, sender, respond) => {});
