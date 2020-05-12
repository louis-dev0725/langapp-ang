import * as config from './../../allParam.config';

let token = '';
let user = '';
let extensionSetting = false;
let setting = '';
let statusModal = null;
let translateObj = {
  token: null,
  all_text: null,
  url: null,
  offset: null
};

const modal = document.createElement('div');
const mHeader = document.createElement('div');
const mBody = document.createElement('div');
const wordT = document.createElement('div');

window.onload = (ev) => {
  chrome.storage.local.get(['token', 'user'], (result) => {
    if (result.hasOwnProperty('token') && result.hasOwnProperty('user')) {
      token = result.token;
      extensionSetting = true;

      createButtonListener();
    } else {
      if (ev.target.baseURI === config.URIFront + '/') {
        token = localStorage.getItem('token');
        user = localStorage.getItem('user');

        if (token !== null && user !== null) {
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

  if (event.data.type && (event.data.type === 'LoginSuccess') && (event.origin === config.URIFront)) {
    token = localStorage.getItem('token');
    user = localStorage.getItem('user');
    chrome.runtime.sendMessage({ type: 'siteAuth', data: { token: token, user: user }});
  }

  if (event.data.type && (event.data.type === 'saveSettingExtension') && (event.origin === config.URIFront)) {
    let settingExtension = JSON.parse(localStorage.getItem(event.data.text));
    chrome.runtime.sendMessage({ type: 'saveSetting', data: {
      settingExtension: String(settingExtension.extensionShowTranslate)
    }});

    setting = String(settingExtension.extensionShowTranslate);
  }

  if (event.data.type && (event.data.type === 'Logout') && (event.origin === config.URIFront)) {
    chrome.runtime.sendMessage({ type: 'siteLogout' });
  }
});

function createButtonListener() {
  if (extensionSetting) {
    chrome.storage.local.get(['settingExtensionAction'], (result) => {
      if (result.hasOwnProperty('settingExtensionAction')) {
        setting = result.settingExtensionAction;
      } else {
        setting = 'extension.DoubleClick';
      }
    });

    document.addEventListener('dblclick', function(e) {
      if (setting === 'extension.DoubleClick') {
        if ((e.metaKey === false || e.ctrlKey === false) && e.shiftKey === false && e.altKey === false) {
          statusModal = document.getElementById('modalTranslate');
          if (statusModal === null) {
            createModal();
          }

          innerTranslateObject(document.caretRangeFromPoint(e.x, e.y), token, e.pageX, e.pageY);
        }
      }

      if (setting === 'extension.DoubleClickCtrl') {
        if ((e.metaKey === true || e.ctrlKey === true) && e.shiftKey === false && e.altKey === false) {
          statusModal = document.getElementById('modalTranslate');
          if (statusModal === null) {
            createModal();
          }

          innerTranslateObject(document.caretRangeFromPoint(e.x, e.y), token, e.pageX, e.pageY);
        }
      }

      if (setting === 'extension.DoubleClickShift') {
        if ((e.metaKey === false || e.ctrlKey === false) && e.shiftKey === true && e.altKey === false) {
          statusModal = document.getElementById('modalTranslate');
          if (statusModal === null) {
            createModal();
          }

          innerTranslateObject(document.caretRangeFromPoint(e.x, e.y), token, e.pageX, e.pageY);
        }
      }

      if (setting === 'extension.DoubleClickAlt') {
        if ((e.metaKey === false || e.ctrlKey === false) && e.shiftKey === false && e.altKey === true) {
          console.log(e);
          statusModal = document.getElementById('modalTranslate');
          if (statusModal === null) {
            createModal();
          }

          innerTranslateObject(document.caretRangeFromPoint(e.x, e.y), token, e.pageX, e.pageY);
        }
      }
    });
  }
}

function createModal() {
  modal.setAttribute('id', 'modalTranslate');
  modal.style.position = 'absolute';
  modal.style.display = 'flex';
  modal.style.flexFlow = 'column';
  modal.style.zIndex = '9999999';
  modal.style.width = '300px';
  modal.style.height = 'auto';
  modal.style.maxHeight = '60vh';
  modal.style.background = '#fff';
  modal.style.borderRadius = '10px';
  modal.style.padding = '10px';

  document.body.appendChild(modal);

  modal.appendChild(mHeader);
  modal.appendChild(mBody);

  mHeader.setAttribute('id', 'modal-translate-header');
  mBody.setAttribute('id', 'modal-translate-body');

  mHeader.innerHTML = '<button type="button" class="close" id="closeModal"><span>&times;</span></button>';

  document.getElementById('closeModal').style.border = 'none';
  document.getElementById('closeModal').style.background = 'transparent';
  document.getElementById('closeModal').style.padding = '0.5rem 1rem';
  document.getElementById('closeModal').style.fontSize = '1.5rem';
  document.getElementById('closeModal').style.fontWeight = '700';
  document.getElementById('closeModal').style.marginLeft = 'auto';

  document.getElementById('closeModal').onclick = () => {
    modal.style.display = 'none';
  }

  mHeader.style.display = 'flex';
  mHeader.style.flexFlow = 'row nowrap';
  mHeader.style.width = '100%';
  mHeader.style.justifyContent = 'space-between';
  mHeader.style.height = '45px';

  mBody.style.boxSizing = 'border-box';
  mBody.style.display = 'flex';
  mBody.style.overflowY = 'scroll';
  mBody.style.flexFlow = 'column nowrap';
  mBody.style.width = '100%';
  mBody.style.padding = '0 15px';
  mBody.style.margin = '10px 0';

  mBody.innerHTML = '<ul id="list-translate"></ul>';

  document.getElementById('modalTranslate').onclick = () => {
    modal.style.display = 'none';
    mBody.innerHTML = '<ul id="list-translate"></ul>';
  }
}

function innerTranslateObject (range, token, offsetX, offsetY) {
  translateObj = null;
  translateObj = {
    token: token,
    all_text: range.startContainer.data,
    url: range.startContainer.ownerDocument.location.href,
    offset: range.startOffset
  };

  chrome.runtime.sendMessage({ type: 'sendBackground', data: translateObj }, (response) => {
    if (response.data.success) {
      console.log(response.data);

      wordT.setAttribute('class', 'word-translate');

      mHeader.insertBefore(wordT, document.getElementById('closeModal'));
      wordT.style.textAlign = 'center';

      if (response.data.res.length > 0) {
        mBody.innerHTML = '<ul id="list-translate"></ul>';

        wordT.innerHTML = '<span>' + JSON.parse(response.data.res[0].sourceData).kana[0].text + '</span>'
            + '<h1 style="font-size:2em;text-align:center;">' + response.data.word + '</h1>';

        let listTranslate = document.getElementById('list-translate');

        response.data.res.forEach((res) => {
          const transObj = JSON.parse(res.sourceData);

          transObj.sense.forEach((sen) => {
            sen.gloss.forEach((gl) => {
              listTranslate.innerHTML += '<li style="padding-left:10px;border-bottom:1px solid #000;">'
                  + '<a data-text="' + gl.text + '">' + gl.text + '</a></li>';
            });
          });
        });

        document.getElementById('list-translate').style.border = '1px solid #000';
        document.getElementById('list-translate').style.borderRadius = '5px';
        document.getElementById('list-translate').style.listStyle = 'none';
        document.getElementById('list-translate').style.padding = '0';
        document.getElementById('list-translate').style.borderBottom = 'none';
      } else {
        wordT.innerHTML = '<span></span><h1 style="font-size:2em;text-align:center;">' + response.data.word + '</h1>';
        mBody.innerHTML = 'Перевод не найден... пока-что';
      }

      modal.style.top = parseInt(offsetY) + 15 + 'px';
      modal.style.left = '0';
      if (parseInt(offsetX) - 150 > 0) {
        modal.style.left = parseInt(offsetX) - 150 + 'px';
      }
      modal.style.display = 'flex';
    }
  });
}
