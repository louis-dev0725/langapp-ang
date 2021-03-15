import { t } from "../i18n";
import { ProcessTextRequest } from "../interfaces/ProcessTextRequest";
import { ProcessTextResponse } from "../interfaces/ProcessTextResponse";
import User from "../interfaces/User";
import { Modal } from "./Modal";
import { showSnackbar } from "./Snackbar";
import { TextSeeker } from "./TextSeeker";
export { caretRangeFromPoint } from './caretUtils';

const japaneseRegex = /[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]/;

class State {
  user: User = null;
  modal: Modal = new Modal();
  apiCall: (httpMethod: string, apiMethod: string, body: any) => Promise<any>;
}

export const state = new State();

export function isStringContainsJapanese(string: string): boolean {
  return japaneseRegex.test(string);
}

export async function showForRange(range: Range, exactMatch: boolean = false) {
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

  let response: ProcessTextResponse = <ProcessTextResponse>await state.apiCall('POST', 'processText', request);
  if (!response.success) {
    showSnackbar(t('no_words_found'));
    state.modal.hide();
  }
  else {
    state.modal.showTranslations(request, response);
  }

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