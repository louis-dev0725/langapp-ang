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
let context = null;

const IGNORE_TEXT_PATTERN = /\u200c/;

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
  chrome.runtime.sendMessage({ type: 'setToToken', data: '' }, () => {
    console.log('Set token to background');
  });

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

        innerSelectedTranslateObject(selectedText, window.location, user, document.caretRangeFromPoint(e.x, e.y), e.pageY);
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
    wordT.innerHTML = '';
    mBody.innerHTML = '<ul id="list-translate"></ul>';
    modal.style.display = 'none';
  });

  mHeader.style.display = 'flex';
  mHeader.style.flexFlow = 'row nowrap';
  mHeader.style.width = '100%';
  mHeader.style.justifyContent = 'space-between';

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

  const seekPrev = seekBackward(range.startContainer, range.startOffset, 100);
  const seekNext = seekForward(range.startContainer, range.startOffset, 100);
  context = seekPrev.content + seekNext.content;

  if (extensionSetting) {
    translateObj = {
      all_text: context,
      url: range.startContainer.ownerDocument.location.href,
      offset: seekPrev.content.length
    };

    let prev_length = seekPrev.content.length - range.startOffset;

    let new_range = new Range();
    new_range.setStart(range.startContainer, range.startOffset);
    let rect = new_range.getBoundingClientRect();

    if (user.language === 'ru') {
      mBody.innerHTML = '<h3>Загрузка...</h3>';
    } else {
      mBody.innerHTML = '<h3>Loading...</h3>';
    }
    modal.style.left = rect.x + 'px';
    modal.style.top = pageY + 20 + 'px';
    modal.style.display = 'flex';

    chrome.runtime.sendMessage({ type: 'sendBackground', data: translateObj }, (response) => {
      if (response.data.success) {
        wordT.setAttribute('class', 'word-translate');
        mHeader.insertBefore(wordT, modalShadowRoot.getElementById('closeModal'));
        wordT.style.textAlign = 'center';

        if (response.data.res.length > 0) {
          mBody.innerHTML = '<ul id="list-translate"></ul>';
          wordT.innerHTML = '<span>' + response.data.res[0].sourceData.kana[0].text + '</span>'
              + '<h1 style="font-size:2em;text-align:center;margin:.5rem 0;">' + response.data.word.word + '</h1>';

          let listTranslate = modalShadowRoot.getElementById('list-translate');

          response.data.res.forEach((res) => {
            const transObj = res.sourceData;

            transObj.sense.forEach((sen) => {
              sen.gloss.forEach((gl) => {
                listTranslate.innerHTML += '<li style="padding-left:10px;border-bottom:1px solid #000;">'
                    + '<a class="textDictionary" data-word="' + response.data.word.word
                    + '" data-id="' + res.id + '" data-translate="' + gl.text + '">' + gl.text + '</a></li>';
              });
            });
          });

          let listDictionary = modalShadowRoot.querySelectorAll('.textDictionary');
          for (let i = 0; i < listDictionary.length; i++) {
            listDictionary[i].addEventListener('click', () => {
              addToDictionary(user, translateObj.url, context,
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

          let sel = window.getSelection();
          sel.removeAllRanges();

          const s_offset =  parseInt(response.data.word.s_offset) - parseInt(String(prev_length));
          const e_offset =  parseInt(response.data.word.e_offset) - parseInt(String(prev_length));

          new_range.setStart(range.startContainer, s_offset);

          if (e_offset <= range.startContainer.length) {
            new_range.setEnd(range.startContainer, e_offset);
          } else {
            const nextLength = e_offset - range.startContainer.length
            const next = seekForward(range.startContainer, range.startOffset, nextLength)
            new_range.setEnd(next.node, nextLength);
          }

          rect = new_range.getBoundingClientRect();
          modal.style.left = rect.x + 'px';

          sel.addRange(new_range);
        } else {
          wordT.innerHTML = '<span></span><h1 style="font-size:2em;text-align:center;">' + response.data.word + '</h1>';

          if (user.language === 'ru') {
            mBody.innerHTML = '<h3>Перевод не найден... пока-что</h3>';
          } else {
            mBody.innerHTML = '<h3>Translation not found... for now</h3>';
          }
        }
      } else {
        if (response.data.error === 'nonAuth') {
          if (user.language === 'ru') {
            mBody.innerHTML = '<h3>Произошла неизвестная ошибка при передаче данных авторизации, пожалуйста авторизуйтесь в сервисе заново.</h3>';
          } else {
            mBody.innerHTML = '<h3>An unknown error occurred while transferring authorization data, please log in to the service again.</h3>';
          }
        } else {
          if (user.language === 'ru') {
            mBody.innerHTML = '<h3>На сервере произошла неизвестная ошибка, пожалуйста попробуйте позже.</h3>';
          } else {
            mBody.innerHTML = '<h3>An unknown error has occurred on the server, please try again later.</h3>';
          }
        }
      }
    });
  } else {
    if (user.language === 'ru') {
      mBody.innerHTML = '<h3>Для использования расширения нужно авторизоваться в сервисе.</h3>';
    } else {
      mBody.innerHTML = '<h3>To use the extension you need to log in to the service.</h3>';
    }

    modal.style.left = (window.innerWidth / 2 - 150) + 'px';
    modal.style.top = '200px';
    modal.style.display = 'flex';
  }
}

function innerSelectedTranslateObject (selectedText, urlPage, user, range, pageY) {
  selectedObj = null;

  if (extensionSetting) {
    selectedObj = {
      text: selectedText,
      url: urlPage.href
    };

    let new_range = new Range();
    new_range.setStart(range.startContainer, range.startOffset);
    let rect = new_range.getBoundingClientRect();

    if (user.language === 'ru') {
      mBody.innerHTML = '<h3>Загрузка...</h3>';
    } else {
      mBody.innerHTML = '<h3>Loading...</h3>';
    }
    modal.style.left = rect.x + 'px';
    modal.style.top = pageY + 20 + 'px';
    modal.style.display = 'flex';

    chrome.runtime.sendMessage({ type: 'sendSelectedBackground', data: selectedObj }, (response) => {
      if (response.data.success) {
        wordT.setAttribute('class', 'word-translate');
        mHeader.insertBefore(wordT, modalShadowRoot.getElementById('closeModal'));
        wordT.style.textAlign = 'center';

        if (response.data.res.length > 0) {
          mBody.innerHTML = '<ul id="list-translate"></ul>';
          wordT.innerHTML = '<span>' + response.data.res[0].sourceData.kana[0].text + '</span>'
              + '<h1 style="font-size:2em;text-align:center;line-height:normal;margin-top:0;margin-bottom:10px;">'
              + response.data.word + '</h1>';

          let listTranslate = modalShadowRoot.getElementById('list-translate');

          const arrRes = Array.from(Object.entries(response.data.res));
          let res = [];
          arrRes.forEach((el) => {
            res.push(el[1]);
          });

          res.forEach((res) => {
            const transObj = res.sourceData;

            transObj.sense.forEach((sen) => {
              sen.gloss.forEach((gl) => {
                listTranslate.innerHTML += '<li style="padding-left:10px;border-bottom:1px solid #000;">'
                    + '<a class="textDictionary" data-word="' + response.data.word + '" data-id="'
                    + res.id + '" data-translate="' + gl.text + '">' + gl.text + '</a></li>';
              });
            });
          });

          let listDictionary = modalShadowRoot.querySelectorAll('.textDictionary');
          for (let i = 0; i < listDictionary.length; i++) {
            listDictionary[i].addEventListener('click', () => {
              addToDictionary(user, translateObj.url, context,
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

          if (user.language === 'ru') {
            mBody.innerHTML = '<h3>Перевод не найден... пока-что</h3>';
          } else {
            mBody.innerHTML = '<h3>Translation not found... for now</h3>';
          }
        }
      } else {
        if (response.data.error === 'nonAuth') {
          if (user.language === 'ru') {
            mBody.innerHTML = '<h3>Произошла неизвестная ошибка при передаче данных авторизации, пожалуйста авторизуйтесь в сервисе заново.</h3>';
          } else {
            mBody.innerHTML = '<h3>An unknown error occurred while transferring authorization data, please log in to the service again.</h3>';
          }
        } else {
          if (user.language === 'ru') {
            mBody.innerHTML = '<h3>На сервере произошла неизвестная ошибка, пожалуйста попробуйте позже.</h3>';
          } else {
            mBody.innerHTML = '<h3>An unknown error has occurred on the server, please try again later.</h3>';
          }
        }
      }
    });
  } else {
    if (user.language === 'ru') {
      mBody.innerHTML = '<h3>Для использования расширения нужно авторизоваться в сервисе.</h3>';
    } else {
      mBody.innerHTML = '<h3>To use the extension you need to log in to the service.</h3>';
    }

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

function seekForward(node, offset, length) {
  const state = {node, offset, remainder: length, content: ''};
  if (length <= 0) {
    return state;
  }

  const TEXT_NODE = Node.TEXT_NODE;
  const ELEMENT_NODE = Node.ELEMENT_NODE;
  let resetOffset = false;

  const ruby = getRubyElement(node);
  if (ruby !== null) {
    node = ruby;
    resetOffset = true;
  }

  while (node !== null) {
    let visitChildren = true;
    const nodeType = node.nodeType;

    if (nodeType === TEXT_NODE) {
      state.node = node;
      if (seekForwardTextNode(state, resetOffset)) {
        break;
      }
      resetOffset = true;
    } else if (nodeType === ELEMENT_NODE) {
      visitChildren = shouldEnter(node);
    }

    node = getNextNode(node, visitChildren);
  }

  return state;
}

function getRubyElement(node) {
  node = getParentElement(node);
  if (node !== null && node.nodeName.toUpperCase() === 'RT') {
    node = node.parentNode;
    return (node !== null && node.nodeName.toUpperCase() === 'RUBY') ? node : null;
  }

  return null;
}

function shouldEnter(node) {
  switch (node.nodeName.toUpperCase()) {
    case 'RT':
    case 'SCRIPT':
    case 'STYLE':
      return false;
  }

  const style = window.getComputedStyle(node);
  return !(
      style.visibility === 'hidden' ||
      style.display === 'none' ||
      parseFloat(style.fontSize) === 0
  );
}

function getParentElement(node) {
  while (node !== null && node.nodeType !== Node.ELEMENT_NODE) {
    node = node.parentNode;
  }

  return node;
}

function getNextNode(node, visitChildren) {
  let next = visitChildren ? node.firstChild : null;
  if (next === null) {
    while (true) {
      next = node.nextSibling;
      if (next !== null) { break; }

      next = node.parentNode;
      if (next === null) { break; }

      node = next;
    }
  }

  return next;
}

function seekForwardTextNode(state, resetOffset) {
  const nodeValue = state.node.nodeValue;
  const nodeValueLength = nodeValue.length;
  let content = state.content;
  let offset = resetOffset ? 0 : state.offset;
  let remainder = state.remainder;
  let result = false;

  for (; offset < nodeValueLength; ++offset) {
    const c = nodeValue[offset];
    if (!IGNORE_TEXT_PATTERN.test(c)) {
      content += c;
      if (--remainder <= 0) {
        result = true;
        ++offset;
        break;
      }
    }
  }

  state.offset = offset;
  state.content = content;
  state.remainder = remainder;

  return result;
}

function seekBackward(node, offset, length) {
  const state = {node, offset, remainder: length, content: ''};
  if (length <= 0) {
    return state;
  }

  const TEXT_NODE = Node.TEXT_NODE;
  const ELEMENT_NODE = Node.ELEMENT_NODE;
  let resetOffset = false;

  const ruby = getRubyElement(node);
  if (ruby !== null) {
    node = ruby;
    resetOffset = true;
  }

  while (node !== null) {
    let visitChildren = true;
    const nodeType = node.nodeType;

    if (nodeType === TEXT_NODE) {
      state.node = node;
      if (seekBackwardTextNode(state, resetOffset)) {
        break;
      }
      resetOffset = true;
    } else if (nodeType === ELEMENT_NODE) {
      visitChildren = shouldEnter(node);
    }

    node = getPreviousNode(node, visitChildren);
  }

  return state;
}

function seekBackwardTextNode(state, resetOffset) {
  const nodeValue = state.node.nodeValue;
  let content = state.content;
  let offset = resetOffset ? nodeValue.length : state.offset;
  let remainder = state.remainder;
  let result = false;

  for (; offset > 0; --offset) {
    const c = nodeValue[offset - 1];
    if (!IGNORE_TEXT_PATTERN.test(c)) {
      content = c + content;
      if (--remainder <= 0) {
        result = true;
        --offset;
        break;
      }
    }
  }

  state.offset = offset;
  state.content = content;
  state.remainder = remainder;

  return result;
}

function getPreviousNode(node, visitChildren) {
  let next = visitChildren ? node.lastChild : null;
  if (next === null) {
    while (true) {
      next = node.previousSibling;
      if (next !== null) { break; }

      next = node.parentNode;
      if (next === null) { break; }

      node = next;
    }
  }

  return next;
}
