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

const overview = document.createElement('div');
const modal = document.createElement('div');
const mHeader = document.createElement('div');
const mBody = document.createElement('div');

window.onload = (ev) => {
  chrome.storage.sync.get(['token'], (result) => {
    if (result.hasOwnProperty('token')) {
      token = result.token;
      extensionSetting = true;

      createButtonListener();
    } else {
      if (ev.target.location.origin == 'http://localhost:4200') {
        token = localStorage.getItem('token');
        user = localStorage.getItem('user');

        if (token != '' && user != '') {
          chrome.runtime.sendMessage({ type: 'siteAuth', data: { token: token, user: user }});
          extensionSetting = true;

          createButtonListener();
        }
      }
    }
  });
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

function createButtonListener() {
  if (extensionSetting) {
    chrome.storage.sync.get(['settingExtensionAction'], (result) => {
      if (result.hasOwnProperty('settingExtensionAction')) {
        setting = result.settingExtensionAction;
      } else {
        setting = 'extension.DoubleClick';
      }
    });

    createModal();

    document.addEventListener('dblclick', function(e) {
      if (setting == 'extension.DoubleClick') {
        if ((e.metaKey == false || e.ctrlKey == false) && e.shiftKey == false && e.altKey == false) {
          innerTranslateObject(document.caretRangeFromPoint(e.x, e.y), token);
        }
      }

      if (setting == 'extension.DoubleClickCtrl') {
        if ((e.metaKey == true || e.ctrlKey == true) && e.shiftKey == false && e.altKey == false) {
          innerTranslateObject(document.caretRangeFromPoint(e.x, e.y), token);
        }
      }

      if (setting == 'extension.DoubleClickShift') {
        if ((e.metaKey == false || e.ctrlKey == false) && e.shiftKey == true && e.altKey == false) {
          innerTranslateObject(document.caretRangeFromPoint(e.x, e.y), token);
        }
      }

      if (setting == 'extension.DoubleClickAlt') {
        if ((e.metaKey == false || e.ctrlKey == false) && e.shiftKey == false && e.altKey == true) {
          innerTranslateObject(document.caretRangeFromPoint(e.x, e.y), token);
        }
      }
    });
  }
}

function createModal() {
  modal.setAttribute('id', 'modalTranslate');
  modal.style.display = 'flex';
  modal.style.flexFlow = 'column nowrap';
  modal.style.zIndex = '9999999';
  modal.style.width = '600px';
  modal.style.background = 'rgba(255, 255, 255, 1)';
  modal.style.borderRadius = '10px';

  overview.setAttribute('id', 'overviewTranslate');
  overview.style.position = 'fixed';
  overview.style.top = '0';
  overview.style.left = '0';
  overview.style.zIndex = '999999';
  overview.style.display = 'none';
  overview.style.width = '100vw';
  overview.style.height = '100vh';
  overview.style.alignItems = 'center';
  overview.style.justifyContent = 'center';
  overview.style.background = 'rgba(0, 0, 0, .7)';
  document.body.appendChild(overview);
  overview.appendChild(modal);

  modal.appendChild(mHeader);
  modal.appendChild(mBody);

  mHeader.setAttribute('id', 'modal-translate-header');
  mBody.setAttribute('id', 'modal-translate-body');

  document.getElementById('modal-translate-header').style.display = 'flex';
  document.getElementById('modal-translate-header').style.flexFlow = 'row nowrap';
  document.getElementById('modal-translate-header').style.width = '100%';
  document.getElementById('modal-translate-header').style.justifyContent = 'flex-end';
  document.getElementById('modal-translate-header').style.height = '45px';

  document.getElementById('modal-translate-body').style.boxSizing = 'border-box';
  document.getElementById('modal-translate-body').style.display = 'flex';
  document.getElementById('modal-translate-body').style.flexFlow = 'column nowrap';
  document.getElementById('modal-translate-body').style.width = '100%';
  document.getElementById('modal-translate-body').style.padding = '20px';

  mHeader.innerHTML = '<button type="button" class="close" id="closeModal"><span>&times;</span></button>';
  document.getElementById('closeModal').style.border = 'none';
  document.getElementById('closeModal').style.background = 'transparent';
  document.getElementById('closeModal').style.padding = '1rem 2rem';
  document.getElementById('closeModal').style.fontSize = '2rem';
  document.getElementById('closeModal').style.fontWeight = '700';

  document.getElementById('closeModal').onclick = () => {
    overview.style.display = 'none';
    mBody.innerHTML = '';
  }

  document.getElementById('overviewTranslate').onclick = () => {
    overview.style.display = 'none';
    mBody.innerHTML = '';
  }
}

function innerTranslateObject (range, token) {
  translateObj = null;
  translateObj = {
    token: token,
    all_text: range.startContainer.data,
    url: range.startContainer.ownerDocument.location.href,
    offset: range.startOffset
  };

  chrome.runtime.sendMessage({ text: 'sendBackground', data: translateObj }, (response) => {
    if (response.data.success) {
      mBody.innerHTML = '';
      response.data.res.forEach((res) => {
        const transObj = JSON.parse(res.sourceData);
        let kanjiCounter = 0;
        let senseCounter = 0;
        transObj.kanji.forEach((trans) => {
          if (kanjiCounter == 0) {
            mBody.innerHTML += 'Kanji text: ';
          }
          if (kanjiCounter == transObj.kanji.length - 1) {
            mBody.innerHTML += trans.text + '; ';
          } else {
            mBody.innerHTML += trans.text + ', ';
          }
          kanjiCounter++;
        });

        transObj.sense.forEach((sen) => {
          if (senseCounter == 0) {
            mBody.innerHTML += 'Sense, gloss text: ';
          }

          if (senseCounter == transObj.sense.length - 1) {
            let glCounter = 0;
            sen.gloss.forEach((gl) => {
              if (glCounter == sen.gloss.length - 1) {
                mBody.innerHTML += gl.text;
              } else {
                mBody.innerHTML += gl.text + ', ';
              }
            });
          } else {
            sen.gloss.forEach((gl) => {
              mBody.innerHTML += gl.text + ', ';
            });
          }
          senseCounter++;
        });
        mBody.innerHTML += '<br>';
      });
      overview.style.display = 'flex';
    }
  });
}
