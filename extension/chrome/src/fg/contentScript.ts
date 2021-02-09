import * as config from '../../../allParam.config';
import { TextSeeker } from './TextSeeker';
import { t, i18n } from '../i18n';
import { ProcessTextRequest } from '../interfaces/ProcessTextRequest';
import { ProcessTextResponse } from '../interfaces/ProcessTextResponse';
import { apiCall, isStringContainsJapanese, state } from './common';
import { showSnackbar } from './Snackbar';

function log(message: string) {
  chrome.runtime.sendMessage({ type: 'sendLogServer', data: message }, () => { });
}

async function init() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['token', 'user'], (result) => {
      if (result.hasOwnProperty('token') && result.hasOwnProperty('user')) {
        state.user = result.user;
        i18n.changeLanguage(state.user.language);
        console.log(state.user);
      }
      resolve(null);
    });
  });
}

async function initOnAppPage() {
  const token = localStorage.getItem('token');
  state.user = JSON.parse(localStorage.getItem('user'));

  if (token !== null && state.user !== null) {
    chrome.runtime.sendMessage({ type: 'siteAuth', data: { token: token, user: state.user } });
  }
}

window.onload = (async (ev) => {
  if (ev.target.baseURI === config.URIFront + '/') {
    await initOnAppPage();
  }
  await init();

  try {
    createButtonListener();
  } catch (e) {
    log(e.stack);
  }
});

window.addEventListener('message', (event) => {
  if (event.source !== window) {
    return;
  }

  if (event.data.type && (event.data.type === 'LoginSuccess') && (event.origin === config.URIFront)) {
    const token = localStorage.getItem('token');
    state.user = JSON.parse(localStorage.getItem('user'));
    chrome.runtime.sendMessage({ type: 'siteAuth', data: { token: token, user: state.user } });
  }

  if (event.data.type && (event.data.type === 'saveSettingExtension') && (event.origin === config.URIFront)) {
    chrome.runtime.sendMessage({ type: 'updateUserInfo' });
  }

  if (event.data.type && (event.data.type === 'Logout') && (event.origin === config.URIFront)) {
    chrome.runtime.sendMessage({ type: 'siteLogout' });
    state.user = null;
  }
});

function shouldReactToDblClick(e: MouseEvent) {
  switch (state.user.extensionSettings.clickModifier) {
    case 'DoubleClick':
      return (e.metaKey === false || e.ctrlKey === false) && e.shiftKey === false && e.altKey === false;
    case 'DoubleClickCtrl':
      return (e.metaKey === true || e.ctrlKey === true) && e.shiftKey === false && e.altKey === false;
    case 'DoubleClickShift':
      return (e.metaKey === false || e.ctrlKey === false) && e.shiftKey === true && e.altKey === false;
    case 'DoubleClickAlt':
      return (e.metaKey === false || e.ctrlKey === false) && e.shiftKey === false && e.altKey === true;
  }

  return false;
}

function shouldReactToClick(e: MouseEvent) {
  return (e.metaKey === true || e.ctrlKey === true) && e.shiftKey === false && e.altKey === false;
}

function createButtonListener() {
  document.addEventListener('dblclick', (e) => {
    if (!state.user) {
      showSnackbar(t('please_login'), { duration: 0 });
      return;
    }
    if (shouldReactToDblClick(e)) {
      innerTranslateObject(document.caretRangeFromPoint(e.x, e.y), e.pageY);
    }
  });

  document.addEventListener('click', (e) => {
    if (shouldReactToClick(e)) {
      let selection = window.getSelection();
      if (selection.rangeCount > 0) {
        let selectedRange = selection.getRangeAt(0);
        if (selectedRange.toString().length > 0) {
          innerTranslateObject(selectedRange, e.pageY, true);
        }
      }
    }
  });
}

async function innerTranslateObject(range: Range, pageY: number, exactMatch: boolean = false) {
  let prevLength = 0;
  let context: string;
  if (exactMatch) {
    context = range.toString();
  }
  else {
    const seekPrev = new TextSeeker(range.startContainer, range.startOffset).seek(-100);
    const seekNext = new TextSeeker(range.startContainer, range.startOffset).seek(100);
    prevLength = seekPrev.content.length;
    context = seekPrev.content + seekNext.content;
  }
  if (!isStringContainsJapanese(context)) {
    return;
  }

  let request: ProcessTextRequest = {
    text: context,
    url: range.startContainer.ownerDocument.location.href,
    offset: prevLength,
    languages: ['rus', 'eng'],
    exactMatch: exactMatch
  };

  let firstSymbolRange = new Range();
  firstSymbolRange.setStart(range.startContainer, range.startOffset);
  state.modal.showText(t('loading'));
  state.modal.updatePosition(firstSymbolRange);

  let response: ProcessTextResponse = <ProcessTextResponse>await apiCall('POST', 'processText', request);
  if (!response.success) {
    showSnackbar(t('no_words_found'));
    state.modal.hide();
  }
  else {
    state.modal.showTranslations(request, response);
  }

  // TODO: call addToDictionary(context.user, translateObj.url, context, listDictionary[i].getAttribute('data-translate'), listDictionary[i].getAttribute('data-word'), listDictionary[i].getAttribute('data-id') ); on click

  let newSelectionRange = new Range();
  let newSelectionStart = response.offsetStart - prevLength;
  let start = (new TextSeeker(range.startContainer, range.startOffset, true, false)).seek(newSelectionStart);
  newSelectionRange.setStart(start.node, start.offset);

  let newSelectionEnd = response.offsetEnd - prevLength;
  let end = (new TextSeeker(range.startContainer, range.startOffset, true, false)).seek(newSelectionEnd);
  newSelectionRange.setEnd(end.node, end.offset);

  if (newSelectionRange.toString().length > 0) {
    let sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(newSelectionRange);

    state.modal.updatePosition(newSelectionRange);
  }
}

function addToDictionary(user, url, allText, translate, word, dictionary_id) {
  let request = {
    user_id: state.user.id,
    word: word,
    translate: translate,
    dictionary_id: parseInt(dictionary_id),
    context: allText,
    url: url
  };

  chrome.runtime.sendMessage({ type: 'sendToDictionary', data: request }, (response) => {
    alert(response.data.text);
  });
}

function findUpClass(el, class_Name: Array<string>) {
  while (el.parentNode) {
    el = el.parentNode;
    if (class_Name.indexOf(el.className) !== -1) {
      return true;
    }
  }
  return false;
}
