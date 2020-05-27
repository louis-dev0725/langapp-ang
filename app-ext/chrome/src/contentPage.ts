import * as config from './../../allParam.config';

let user = null;
let extensionSetting = false;
let setting = null;
let statusModal = null;
let translateObj = {
  all_text: null,
  url: null,
  offset: null
};
let selectedObj = {
  text: null,
  url: null,
};
let dictionaryWord = {
    user_id: null,
    word: null,
    translate: null,
    dictionary_id: null,
    context: null,
    url: null
};

const modalShadowElement = document.createElement('div');
const modalShadowRoot = modalShadowElement.attachShadow({mode: 'open'});

const modal = document.createElement('div');
const mHeader = document.createElement('div');
const mBody = document.createElement('div');
const wordT = document.createElement('div');

window.onload = ((ev) => {
  chrome.storage.local.get(['token', 'user'], (result) => {
    if (result.hasOwnProperty('token') && result.hasOwnProperty('user')) {
      user = result.user;
      extensionSetting = true;

      createButtonListener();
    } else {
      if (ev.target.baseURI === config.URIFront + '/') {
        const token = localStorage.getItem('token');
        user = localStorage.getItem('user');

        if (token !== null && user !== null) {
          chrome.runtime.sendMessage({ type: 'siteAuth', data: { token: token, user: user }});
          extensionSetting = true;
        }
      }

      createButtonListener();
    }
  });
});

window.addEventListener('message', (event) => {
  if (event.source !== window) {
    return;
  }

  if (event.data.type && (event.data.type === 'LoginSuccess') && (event.origin === config.URIFront)) {
    const token = localStorage.getItem('token');
    user = localStorage.getItem('user');
    chrome.runtime.sendMessage({ type: 'siteAuth', data: { token: token, user: user }});

    extensionSetting = true;
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

    extensionSetting = false;
  }
});

function createButtonListener() {
  chrome.runtime.sendMessage({ type: 'setToToken', data: '' }, () => {});

  chrome.storage.local.get(['settingExtensionAction'], (result) => {
    if (result.hasOwnProperty('settingExtensionAction')) {
      setting = result.settingExtensionAction;
    } else {
      setting = 'extension.DoubleClick';
    }
  });

  document.addEventListener('dblclick', (e) => {
    if (setting === 'extension.DoubleClick') {
      if ((e.metaKey === false || e.ctrlKey === false) && e.shiftKey === false && e.altKey === false) {
        createAndSendData(e);
      }
    }

    if (setting === 'extension.DoubleClickCtrl') {
      if ((e.metaKey === true || e.ctrlKey === true) && e.shiftKey === false && e.altKey === false) {
        createAndSendData(e);
      }
    }

    if (setting === 'extension.DoubleClickShift') {
      if ((e.metaKey === false || e.ctrlKey === false) && e.shiftKey === true && e.altKey === false) {
        createAndSendData(e);
      }
    }

    if (setting === 'extension.DoubleClickAlt') {
      if ((e.metaKey === false || e.ctrlKey === false) && e.shiftKey === false && e.altKey === true) {
        createAndSendData(e);
      }
    }
  });

  document.addEventListener('click', (e) => {
    if ((e.metaKey === true || e.ctrlKey === true) && e.shiftKey === false && e.altKey === false) {
      let selectedText = window.getSelection().toString().replace("\n", ' ');
      if (selectedText.length > 0) {
        statusModal = modalShadowRoot.getElementById('modalTranslate');
        if (statusModal === null) {
          createModal();
        }

        innerSelectedTranslateObject(selectedText, window.location, user, document.caretRangeFromPoint(e.x, e.y));
      }
    }
  });
}

function createAndSendData(e) {
  statusModal = modalShadowRoot.getElementById('modalTranslate');
  if (statusModal === null) {
    createModal();
  }

  innerTranslateObject(document.caretRangeFromPoint(e.x, e.y), user, e.pageY);
}

function createModal() {
  document.body.appendChild(modalShadowElement);

  modal.setAttribute('id', 'modalTranslate');
  modal.style.position = 'absolute';
  modal.style.display = 'flex';
  modal.style.flexFlow = 'column';
  modal.style.zIndex = '999999';
  modal.style.width = '300px';
  modal.style.height = 'auto';
  modal.style.maxHeight = '60vh';
  modal.style.background = '#fff';
  modal.style.borderRadius = '10px';
  modal.style.padding = '10px';
  modal.style.border = '1px solid #000';

  modalShadowRoot.appendChild(modal);

  modal.appendChild(mHeader);
  modal.appendChild(mBody);

  mHeader.setAttribute('id', 'modal-translate-header');
  mBody.setAttribute('id', 'modal-translate-body');

  mHeader.innerHTML = '<button type="button" class="close" id="closeModal"><span>&times;</span></button>';

  modalShadowRoot.getElementById('closeModal').style.border = 'none';
  modalShadowRoot.getElementById('closeModal').style.background = 'transparent';
  modalShadowRoot.getElementById('closeModal').style.padding = '0.5rem 1rem';
  modalShadowRoot.getElementById('closeModal').style.fontSize = '1.5rem';
  modalShadowRoot.getElementById('closeModal').style.fontWeight = '700';
  modalShadowRoot.getElementById('closeModal').style.marginLeft = 'auto';

  modalShadowRoot.getElementById('closeModal').onclick = (() => {
    mBody.innerHTML = '<ul id="list-translate"></ul>';
    modal.style.display = 'none';
  });

  document.body.onclick = (() => {
    mBody.innerHTML = '<ul id="list-translate"></ul>';
    modal.style.display = 'none';
  });

  mHeader.style.display = 'flex';
  mHeader.style.flexFlow = 'row nowrap';
  mHeader.style.width = '100%';
  mHeader.style.justifyContent = 'space-between';
  mHeader.style.height = '60px';

  mBody.style.boxSizing = 'border-box';
  mBody.style.display = 'flex';
  mBody.style.overflowY = 'scroll';
  mBody.style.flexFlow = 'column nowrap';
  mBody.style.width = '100%';
  mBody.style.padding = '0 15px';
  mBody.style.margin = '10px 0';

  mBody.innerHTML = '<ul id="list-translate"></ul>';
}

function innerTranslateObject (range, user, pageY) {
  translateObj = null;

  if (extensionSetting) {
    translateObj = {
      all_text: range.startContainer.data,
      url: range.startContainer.ownerDocument.location.href,
      offset: range.startOffset
    };

    chrome.runtime.sendMessage({ type: 'sendBackground', data: translateObj }, (response) => {
      if (response.data.success) {
        let new_range = new Range();
        new_range.setStart(range.startContainer, response.data.offset);
        let rect = new_range.getBoundingClientRect();

        wordT.setAttribute('class', 'word-translate');
        mHeader.insertBefore(wordT, modalShadowRoot.getElementById('closeModal'));
        wordT.style.textAlign = 'center';

        if (response.data.res.length > 0) {
          mBody.innerHTML = '<ul id="list-translate"></ul>';
          wordT.innerHTML = '<span>' + JSON.parse(response.data.res[0].sourceData).kana[0].text + '</span>'
              + '<h1 style="font-size:2em;text-align:center;">' + response.data.word + '</h1>';

          let listTranslate = modalShadowRoot.getElementById('list-translate');

          response.data.res.forEach((res) => {
            const transObj = JSON.parse(res.sourceData);

            transObj.sense.forEach((sen) => {
              sen.gloss.forEach((gl) => {
                listTranslate.innerHTML += '<li style="padding-left:10px;border-bottom:1px solid #000;">'
                    + '<a class="textDictionary" data-word="' + response.data.word
                    + '" data-id="' + res.id + '" data-translate="' + gl.text + '">' + gl.text + '</a></li>';
              });
            });
          });

          let listDictionary = document.getElementsByClassName('textDictionary');
          for (let i = 0; i < listDictionary.length; i++) {
            listDictionary[i].addEventListener('click', () => {
              addToDictionary(user, translateObj.url, translateObj.all_text,
                  listDictionary[i].getAttribute('data-translate'),
                  listDictionary[i].getAttribute('data-word'),
                  listDictionary[i].getAttribute('data-id')
              );
            });
          }

          modalShadowRoot.getElementById('list-translate').style.border = '1px solid #000';
          modalShadowRoot.getElementById('list-translate').style.borderRadius = '5px';
          modalShadowRoot.getElementById('list-translate').style.listStyle = 'none';
          modalShadowRoot.getElementById('list-translate').style.padding = '0';
          modalShadowRoot.getElementById('list-translate').style.borderBottom = 'none';
        } else {
          wordT.innerHTML = '<span></span><h1 style="font-size:2em;text-align:center;">' + response.data.word + '</h1>';
          mBody.innerHTML = '<h3>Перевод не найден... пока-что</h3>';
        }

        console.log(rect);

        modal.style.left = rect.x + 'px';
        modal.style.top = pageY + 20 + 'px';
        modal.style.display = 'flex';
      }
    });
  } else {
    mBody.innerHTML = '<h3>Для использования расширения нужно авторизоваться в сервисе.</h3>';
    modal.style.left = (window.innerWidth / 2 - 150) + 'px';
    modal.style.top = '200px';
    modal.style.display = 'flex';
  }
}

function innerSelectedTranslateObject (selectedText, urlPage, user, range) {
  selectedObj = null;

  if (extensionSetting) {
    selectedObj = {
      text: selectedText,
      url: urlPage.href
    };

    chrome.runtime.sendMessage({ type: 'sendSelectedBackground', data: selectedObj }, (response) => {
      if (response.data.success) {
        let new_range = new Range();
        new_range.setStart(range.startContainer, range.startOffset);
        let rect = new_range.getBoundingClientRect();

        wordT.setAttribute('class', 'word-translate');
        mHeader.insertBefore(wordT, modalShadowRoot.getElementById('closeModal'));
        wordT.style.textAlign = 'center';

        if (response.data.res.length > 0) {
          mBody.innerHTML = '<ul id="list-translate"></ul>';
          wordT.innerHTML = '<span>' + JSON.parse(response.data.res[0].sourceData).kana[0].text + '</span>'
              + '<h1 style="font-size:2em;text-align:center;">' + response.data.word + '</h1>';

          let listTranslate = modalShadowRoot.getElementById('list-translate');

          response.data.res.forEach((res) => {
            const transObj = JSON.parse(res.sourceData);

            transObj.sense.forEach((sen) => {
              sen.gloss.forEach((gl) => {
                listTranslate.innerHTML += '<li style="padding-left:10px;border-bottom:1px solid #000;">'
                    + '<a class="textDictionary" data-word="' + response.data.word
                    + '" data-id="' + res.id + '" data-translate="' + gl.text + '">' + gl.text + '</a></li>';
              });
            });
          });

          let listDictionary = document.getElementsByClassName('textDictionary');
          for (let i = 0; i < listDictionary.length; i++) {
            listDictionary[i].addEventListener('click', () => {
              addToDictionary(user, translateObj.url, translateObj.all_text,
                  listDictionary[i].getAttribute('data-translate'),
                  listDictionary[i].getAttribute('data-word'),
                  listDictionary[i].getAttribute('data-id')
              );
            });
          }

          modalShadowRoot.getElementById('list-translate').style.border = '1px solid #000';
          modalShadowRoot.getElementById('list-translate').style.borderRadius = '5px';
          modalShadowRoot.getElementById('list-translate').style.listStyle = 'none';
          modalShadowRoot.getElementById('list-translate').style.padding = '0';
          modalShadowRoot.getElementById('list-translate').style.borderBottom = 'none';
        } else {
          wordT.innerHTML = '<span></span><h1 style="font-size:2em;text-align:center;">' + response.data.word + '</h1>';
          mBody.innerHTML = '<h3>Перевод не найден... пока-что</h3>';
        }

        modal.style.left = rect.x + 'px';
        modal.style.top = rect.y + 20 + 'px';
        modal.style.display = 'flex';
      }
    });
  } else {
    mBody.innerHTML = '<h3>Для использования расширения нужно авторизоваться в сервисе.</h3>';
    modal.style.left = (window.innerWidth / 2 - 150) + 'px';
    modal.style.top = '200px';
    modal.style.display = 'flex';
  }
}

function addToDictionary(user, url, allText, translate, word, dictionary_id) {
  dictionaryWord = null;
  dictionaryWord = {
      user_id: user.id,
      word: word,
      translate: translate,
      dictionary_id: parseInt(dictionary_id),
      context: allText,
      url: url
  };

  chrome.runtime.sendMessage({ type: 'sendToDictionary', data: dictionaryWord }, (response) => {
    alert(response.data.text);
  });
}
