import { TextSeeker } from "./TextSeeker";

const _transparentColorPattern = /rgba\s*\([^)]*,\s*0(?:\.0+)?\s*\)/;

export function caretRangeFromPoint(x: number, y: number, deepContentScan: boolean) {
  const elements = _getElementsFromPoint(x, y, deepContentScan);
  let imposter = null;
  let imposterContainer = null;
  let imposterSourceElement = null;
  if (elements.length > 0) {
    const element = elements[0];
    switch (element.nodeName.toUpperCase()) {
      case "IMG":
      case "BUTTON":
      case "SELECT":
        return null;
      // return new TextSourceElement(element);
      case "INPUT":
        // @ts-ignore
        if (element.type === "text") {
          imposterSourceElement = element;
          [imposter, imposterContainer] = _createImposter(element, false);
        }
        break;
      case "TEXTAREA":
        imposterSourceElement = element;
        [imposter, imposterContainer] = _createImposter(element, true);
        break;
    }
  }

  const range = _caretRangeFromPointExt(x, y, deepContentScan ? elements : []);
  if (range !== null) {
    if (imposter !== null) {
      _setImposterStyle(imposterContainer.style, "z-index", "-2147483646");
      _setImposterStyle(imposter.style, "pointer-events", "none");
    }
    return range;
    // return new TextSourceRange(range, "", imposterContainer, imposterSourceElement);
  } else {
    if (imposterContainer !== null) {
      imposterContainer.parentNode.removeChild(imposterContainer);
    }
    return null;
  }
}

function extractSentence(source, layoutAwareScan, extent, terminateAtNewlines, terminatorMap, forwardQuoteMap, backwardQuoteMap) {
  source = source.clone();
  const startLength = source.setStartOffset(extent, layoutAwareScan);
  const endLength = source.setEndOffset(extent * 2 - startLength, layoutAwareScan, true);
  const text = source.text();
  const textLength = text.length;
  const textEndAnchor = textLength - endLength;
  let pos1 = startLength;
  let pos2 = textEndAnchor;

  let quoteStack = [];
  for (; pos1 > 0; --pos1) {
    const c = text[pos1 - 1];
    if (c === "\n" && terminateAtNewlines) {
      break;
    }

    if (quoteStack.length === 0) {
      const terminatorInfo = terminatorMap.get(c);
      if (typeof terminatorInfo !== "undefined") {
        if (terminatorInfo[0]) {
          --pos1;
        }
        break;
      }
    }

    let quoteInfo = forwardQuoteMap.get(c);
    if (typeof quoteInfo !== "undefined") {
      if (quoteStack.length === 0) {
        if (quoteInfo[1]) {
          --pos1;
        }
        break;
      } else if (quoteStack[0] === c) {
        quoteStack.pop();
        continue;
      }
    }

    quoteInfo = backwardQuoteMap.get(c);
    if (typeof quoteInfo !== "undefined") {
      quoteStack.unshift(quoteInfo[0]);
    }
  }

  quoteStack = [];
  for (; pos2 < textLength; ++pos2) {
    const c = text[pos2];
    if (c === "\n" && terminateAtNewlines) {
      break;
    }

    if (quoteStack.length === 0) {
      const terminatorInfo = terminatorMap.get(c);
      if (typeof terminatorInfo !== "undefined") {
        if (terminatorInfo[1]) {
          ++pos2;
        }
        break;
      }
    }

    let quoteInfo = backwardQuoteMap.get(c);
    if (typeof quoteInfo !== "undefined") {
      if (quoteStack.length === 0) {
        if (quoteInfo[1]) {
          ++pos2;
        }
        break;
      } else if (quoteStack[0] === c) {
        quoteStack.pop();
        continue;
      }
    }

    quoteInfo = forwardQuoteMap.get(c);
    if (typeof quoteInfo !== "undefined") {
      quoteStack.unshift(quoteInfo[0]);
    }
  }

  for (; pos1 < startLength && _isWhitespace(text[pos1]); ++pos1) {
    /* NOP */
  }
  for (; pos2 > textEndAnchor && _isWhitespace(text[pos2 - 1]); --pos2) {
    /* NOP */
  }

  return {
    text: text.substring(pos1, pos2),
    offset: startLength - pos1,
  };
}

function isPointInRect(x, y, rect) {
  return x >= rect.left && x < rect.right && y >= rect.top && y < rect.bottom;
}

function isPointInAnyRect(x, y, rects) {
  for (const rect of rects) {
    if (isPointInRect(x, y, rect)) {
      return true;
    }
  }
  return false;
}

function isPointInSelection(x, y, selection) {
  for (let i = 0; i < selection.rangeCount; ++i) {
    const range = selection.getRangeAt(i);
    if (isPointInAnyRect(x, y, range.getClientRects())) {
      return true;
    }
  }
  return false;
}

function isMouseButtonPressed(mouseEvent, button) {
  const mouseEventButton = mouseEvent.button;
  switch (button) {
    case "primary":
      return mouseEventButton === 0;
    case "secondary":
      return mouseEventButton === 2;
    case "auxiliary":
      return mouseEventButton === 1;
    default:
      return false;
  }
}

function getActiveModifiers(event) {
  const modifiers = [];
  if (event.altKey) {
    modifiers.push("alt");
  }
  if (event.ctrlKey) {
    modifiers.push("ctrl");
  }
  if (event.metaKey) {
    modifiers.push("meta");
  }
  if (event.shiftKey) {
    modifiers.push("shift");
  }
  return modifiers;
}

function getActiveModifiersAndButtons(event) {
  const modifiers = getActiveModifiers(event);
  _getActiveButtons(event, modifiers);
  return modifiers;
}

function getActiveButtons(event) {
  const buttons = [];
  _getActiveButtons(event, buttons);
  return buttons;
}

function addFullscreenChangeEventListener(onFullscreenChanged, eventListenerCollection = null) {
  const target = document;
  const options = false;
  const fullscreenEventNames = ["fullscreenchange", "MSFullscreenChange", "mozfullscreenchange", "webkitfullscreenchange"];
  for (const eventName of fullscreenEventNames) {
    if (eventListenerCollection === null) {
      target.addEventListener(eventName, onFullscreenChanged, options);
    } else {
      eventListenerCollection.addEventListener(target, eventName, onFullscreenChanged, options);
    }
  }
}

function getFullscreenElement() {
  // @ts-ignore
  return document.fullscreenElement || document.msFullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || null;
}

function getNodesInRange(range) {
  const end = range.endContainer;
  const nodes = [];
  for (let node = range.startContainer; node !== null; node = getNextNode(node)) {
    nodes.push(node);
    if (node === end) {
      break;
    }
  }
  return nodes;
}

function getNextNode(node) {
  let next = node.firstChild;
  if (next === null) {
    while (true) {
      next = node.nextSibling;
      if (next !== null) {
        break;
      }

      next = node.parentNode;
      if (next === null) {
        break;
      }

      node = next;
    }
  }
  return next;
}

function anyNodeMatchesSelector(nodes, selector) {
  const ELEMENT_NODE = Node.ELEMENT_NODE;
  for (let node of nodes) {
    for (; node !== null; node = node.parentNode) {
      if (node.nodeType !== ELEMENT_NODE) {
        continue;
      }
      if (node.matches(selector)) {
        return true;
      }
      break;
    }
  }
  return false;
}

function everyNodeMatchesSelector(nodes, selector) {
  const ELEMENT_NODE = Node.ELEMENT_NODE;
  for (let node of nodes) {
    while (true) {
      if (node === null) {
        return false;
      }
      if (node.nodeType === ELEMENT_NODE && node.matches(selector)) {
        break;
      }
      node = node.parentNode;
    }
  }
  return true;
}

function isMetaKeySupported(os, browser) {
  return !(browser === "firefox" || browser === "firefox-mobile") || os === "mac";
}

function isInputElementFocused() {
  const element = <HTMLElement>document.activeElement;
  if (element === null) {
    return false;
  }
  const type = element.nodeName.toUpperCase();
  switch (type) {
    case "INPUT":
    case "TEXTAREA":
    case "SELECT":
      return true;
    default:
      return element.isContentEditable;
  }
}

function _getActiveButtons(event, array) {
  let { buttons } = event;
  if (typeof buttons === "number" && buttons > 0) {
    for (let i = 0; i < 6; ++i) {
      const buttonFlag = 1 << i;
      if ((buttons & buttonFlag) !== 0) {
        array.push(`mouse${i}`);
        buttons &= ~buttonFlag;
        if (buttons === 0) {
          break;
        }
      }
    }
  }
}

function _setImposterStyle(style, propertyName, value) {
  style.setProperty(propertyName, value, "important");
}

function _createImposter(element, isTextarea) {
  const body = document.body;
  if (body === null) {
    return [null, null];
  }

  const elementStyle = window.getComputedStyle(element);
  const elementRect = element.getBoundingClientRect();
  const documentRect = document.documentElement.getBoundingClientRect();
  let left = elementRect.left - documentRect.left;
  let top = elementRect.top - documentRect.top;

  const container = document.createElement("div");
  const containerStyle = container.style;
  _setImposterStyle(containerStyle, "all", "initial");
  _setImposterStyle(containerStyle, "position", "absolute");
  _setImposterStyle(containerStyle, "left", "0");
  _setImposterStyle(containerStyle, "top", "0");
  _setImposterStyle(containerStyle, "width", `${documentRect.width}px`);
  _setImposterStyle(containerStyle, "height", `${documentRect.height}px`);
  _setImposterStyle(containerStyle, "overflow", "hidden");
  _setImposterStyle(containerStyle, "opacity", "0");
  _setImposterStyle(containerStyle, "pointer-events", "none");
  _setImposterStyle(containerStyle, "z-index", "2147483646");

  const imposter = document.createElement("div");
  const imposterStyle = imposter.style;

  let value = element.value;
  if (value.endsWith("\n")) {
    value += "\n";
  }
  imposter.textContent = value;

  for (let i = 0, ii = elementStyle.length; i < ii; ++i) {
    const property = elementStyle[i];
    _setImposterStyle(imposterStyle, property, elementStyle.getPropertyValue(property));
  }
  _setImposterStyle(imposterStyle, "position", "absolute");
  _setImposterStyle(imposterStyle, "top", `${top}px`);
  _setImposterStyle(imposterStyle, "left", `${left}px`);
  _setImposterStyle(imposterStyle, "margin", "0");
  _setImposterStyle(imposterStyle, "pointer-events", "auto");

  if (isTextarea) {
    if (elementStyle.overflow === "visible") {
      _setImposterStyle(imposterStyle, "overflow", "auto");
    }
  } else {
    _setImposterStyle(imposterStyle, "overflow", "hidden");
    _setImposterStyle(imposterStyle, "white-space", "nowrap");
    _setImposterStyle(imposterStyle, "line-height", elementStyle.height);
  }

  container.appendChild(imposter);
  body.appendChild(container);

  const imposterRect = imposter.getBoundingClientRect();
  if (imposterRect.width !== elementRect.width || imposterRect.height !== elementRect.height) {
    const width = parseFloat(elementStyle.width) + (elementRect.width - imposterRect.width);
    const height = parseFloat(elementStyle.height) + (elementRect.height - imposterRect.height);
    _setImposterStyle(imposterStyle, "width", `${width}px`);
    _setImposterStyle(imposterStyle, "height", `${height}px`);
  }
  if (imposterRect.left !== elementRect.left || imposterRect.top !== elementRect.top) {
    left += elementRect.left - imposterRect.left;
    top += elementRect.top - imposterRect.top;
    _setImposterStyle(imposterStyle, "left", `${left}px`);
    _setImposterStyle(imposterStyle, "top", `${top}px`);
  }

  imposter.scrollTop = element.scrollTop;
  imposter.scrollLeft = element.scrollLeft;

  return [imposter, container];
}

function _getElementsFromPoint(x, y, all) {
  if (all) {
    const elements = document.elementsFromPoint(x, y);
    return elements.filter((e, i) => elements.indexOf(e) === i);
  }

  const e = document.elementFromPoint(x, y);
  return e !== null ? [e] : [];
}

function _isPointInRange(x, y, range) {
  if (range.startContainer.nodeType !== Node.TEXT_NODE) {
    return false;
  }

  const nodePre = range.endContainer;
  const offsetPre = range.endOffset;
  try {
    const { node, offset, content } = new TextSeeker(range.endContainer, range.endOffset, true, false).seek(1);
    range.setEnd(node, offset);

    if (!_isWhitespace(content) && isPointInAnyRect(x, y, range.getClientRects())) {
      return true;
    }
  } finally {
    range.setEnd(nodePre, offsetPre);
  }

  const { node, offset, content } = new TextSeeker(range.startContainer, range.startOffset, true, false).seek(-1);
  range.setStart(node, offset);

  if (!_isWhitespace(content) && isPointInAnyRect(x, y, range.getClientRects())) {
    range.setEnd(node, offset);
    return true;
  }

  return false;
}

function _isWhitespace(string) {
  return string.trim().length === 0;
}

function _caretRangeFromPoint(x, y) {
  if (typeof document.caretRangeFromPoint === "function") {
    return document.caretRangeFromPoint(x, y);
  }

  // @ts-ignore
  if (typeof document.caretPositionFromPoint === "function") {
    return _caretPositionFromPoint(x, y);
  }

  return null;
}

function _caretPositionFromPoint(x, y) {
  // @ts-ignore
  const position = document.caretPositionFromPoint(x, y);
  if (position === null) {
    return null;
  }
  const node = position.offsetNode;
  if (node === null) {
    return null;
  }

  let offset = 0;
  const { nodeType } = node;
  switch (nodeType) {
    case Node.TEXT_NODE:
      offset = position.offset;
      break;
    case Node.ELEMENT_NODE:
      if (_isElementUserSelectAll(node)) {
        return _caretPositionFromPointNormalizeStyles(x, y, node);
      }
      break;
  }

  try {
    const range = document.createRange();
    range.setStart(node, offset);
    range.setEnd(node, offset);
    return range;
  } catch (e) {
    return null;
  }
}

function _caretPositionFromPointNormalizeStyles(x, y, nextElement) {
  const previousStyles = new Map();
  try {
    while (true) {
      _recordPreviousStyle(previousStyles, nextElement);
      nextElement.style.setProperty("user-select", "text", "important");

      // @ts-ignore
      const position = document.caretPositionFromPoint(x, y);
      if (position === null) {
        return null;
      }
      const node = position.offsetNode;
      if (node === null) {
        return null;
      }

      let offset = 0;
      const { nodeType } = node;
      switch (nodeType) {
        case Node.TEXT_NODE:
          offset = position.offset;
          break;
        case Node.ELEMENT_NODE:
          if (_isElementUserSelectAll(node)) {
            if (previousStyles.has(node)) {
              return null;
            }
            nextElement = node;
            continue;
          }
          break;
      }

      try {
        const range = document.createRange();
        range.setStart(node, offset);
        range.setEnd(node, offset);
        return range;
      } catch (e) {
        return null;
      }
    }
  } finally {
    _revertStyles(previousStyles);
  }
}

function _caretRangeFromPointExt(x, y, elements) {
  let previousStyles = null;
  try {
    let i = 0;
    let startContinerPre = null;
    while (true) {
      const range = _caretRangeFromPoint(x, y);
      if (range === null) {
        return null;
      }

      const startContainer = range.startContainer;
      if (startContinerPre !== startContainer) {
        if (_isPointInRange(x, y, range)) {
          return range;
        }
        startContinerPre = startContainer;
      }

      if (previousStyles === null) {
        previousStyles = new Map();
      }
      i = _disableTransparentElement(elements, i, previousStyles);
      if (i < 0) {
        return null;
      }
    }
  } finally {
    if (previousStyles !== null && previousStyles.size > 0) {
      _revertStyles(previousStyles);
    }
  }
}

function _disableTransparentElement(elements, i, previousStyles) {
  while (true) {
    if (i >= elements.length) {
      return -1;
    }

    const element = elements[i++];
    if (_isElementTransparent(element)) {
      _recordPreviousStyle(previousStyles, element);
      element.style.setProperty("pointer-events", "none", "important");
      return i;
    }
  }
}

function _recordPreviousStyle(previousStyles, element) {
  if (previousStyles.has(element)) {
    return;
  }
  const style = element.hasAttribute("style") ? element.getAttribute("style") : null;
  previousStyles.set(element, style);
}

function _revertStyles(previousStyles) {
  for (const [element, style] of previousStyles.entries()) {
    if (style === null) {
      element.removeAttribute("style");
    } else {
      element.setAttribute("style", style);
    }
  }
}

function _isElementTransparent(element) {
  if (element === document.body || element === document.documentElement) {
    return false;
  }
  const style = window.getComputedStyle(element);
  return parseFloat(style.opacity) <= 0 || style.visibility === "hidden" || (style.backgroundImage === "none" && _isColorTransparent(style.backgroundColor));
}

function _isColorTransparent(cssColor) {
  return _transparentColorPattern.test(cssColor);
}

function _isElementUserSelectAll(element) {
  return getComputedStyle(element).userSelect === "all";
}
