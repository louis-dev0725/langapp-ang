export class TextSeeker {
  private _node: Node;
  private _offset: number;
  private _content: string;
  private _remainder: number;
  private _resetOffset: boolean;
  private _newlines: number;
  private _lineHasWhitespace: boolean;
  private _lineHasContent: boolean;
  private _forcePreserveWhitespace: boolean;
  private _generateLayoutContent: boolean;

  constructor(node: Node, offset: number, forcePreserveWhitespace = false, generateLayoutContent = true) {
    const ruby = TextSeeker.getParentRubyElement(node);
    const resetOffset = ruby !== null;
    if (resetOffset) {
      node = ruby;
    }

    this._node = node;
    this._offset = offset;
    this._content = "";
    this._remainder = 0;
    this._resetOffset = resetOffset;
    this._newlines = 0;
    this._lineHasWhitespace = false;
    this._lineHasContent = false;
    this._forcePreserveWhitespace = forcePreserveWhitespace;
    this._generateLayoutContent = generateLayoutContent;
  }

  get node() {
    return this._node;
  }

  get offset() {
    return this._offset;
  }

  get remainder() {
    return this._remainder;
  }

  get content() {
    return this._content;
  }

  seek(length: number) {
    const forward = length >= 0;
    this._remainder = forward ? length : -length;
    if (length === 0) {
      return this;
    }

    const TEXT_NODE = Node.TEXT_NODE;
    const ELEMENT_NODE = Node.ELEMENT_NODE;

    const generateLayoutContent = this._generateLayoutContent;
    let node = this._node;
    let lastNode = node;
    let resetOffset = this._resetOffset;
    let newlines = 0;
    while (node !== null) {
      let enterable = false;
      const nodeType = node.nodeType;

      if (nodeType === TEXT_NODE) {
        lastNode = node;
        if (!(forward ? this._seekTextNodeForward(<Text>node, resetOffset) : this._seekTextNodeBackward(<Text>node, resetOffset))) {
          break;
        }
      } else if (nodeType === ELEMENT_NODE) {
        lastNode = node;
        this._offset = 0;
        ({ enterable, newlines } = TextSeeker.getElementSeekInfo(<HTMLElement>node));
        if (newlines > this._newlines && generateLayoutContent) {
          this._newlines = newlines;
        }
      }

      const exitedNodes = [];
      node = TextSeeker.getNextNode(node, forward, enterable, exitedNodes);

      for (const exitedNode of exitedNodes) {
        if (exitedNode.nodeType !== ELEMENT_NODE) {
          continue;
        }
        ({ newlines } = TextSeeker.getElementSeekInfo(exitedNode));
        if (newlines > this._newlines && generateLayoutContent) {
          this._newlines = newlines;
        }
      }

      resetOffset = true;
    }

    this._node = lastNode;
    this._resetOffset = resetOffset;

    return this;
  }

  _seekTextNodeForward(textNode: Text, resetOffset: boolean) {
    const nodeValue = textNode.nodeValue;
    const nodeValueLength = nodeValue.length;
    const { preserveNewlines, preserveWhitespace } = this._getWhitespaceSettings(textNode);

    let lineHasWhitespace = this._lineHasWhitespace;
    let lineHasContent = this._lineHasContent;
    let content = this._content;
    let offset = resetOffset ? 0 : this._offset;
    let remainder = this._remainder;
    let newlines = this._newlines;

    while (offset < nodeValueLength) {
      const char = nodeValue[offset];
      const charAttributes = TextSeeker.getCharacterAttributes(char, preserveNewlines, preserveWhitespace);
      ++offset;

      if (charAttributes === 0) {
        continue;
      } else if (charAttributes === 1) {
        lineHasWhitespace = true;
      } else {
        if (newlines > 0) {
          if (content.length > 0) {
            const useNewlineCount = Math.min(remainder, newlines);
            content += "\n".repeat(useNewlineCount);
            remainder -= useNewlineCount;
            newlines -= useNewlineCount;
          } else {
            newlines = 0;
          }
          lineHasContent = false;
          lineHasWhitespace = false;
          if (remainder <= 0) {
            --offset;
            break;
          }
        }

        lineHasContent = charAttributes === 2;

        if (lineHasWhitespace) {
          if (lineHasContent) {
            content += " ";
            lineHasWhitespace = false;
            if (--remainder <= 0) {
              --offset;
              break;
            }
          } else {
            lineHasWhitespace = false;
          }
        }

        content += char;

        if (--remainder <= 0) {
          break;
        }
      }
    }

    this._lineHasWhitespace = lineHasWhitespace;
    this._lineHasContent = lineHasContent;
    this._content = content;
    this._offset = offset;
    this._remainder = remainder;
    this._newlines = newlines;

    return remainder > 0;
  }

  _seekTextNodeBackward(textNode: Text, resetOffset: boolean) {
    const nodeValue = textNode.nodeValue;
    const nodeValueLength = nodeValue.length;
    const { preserveNewlines, preserveWhitespace } = this._getWhitespaceSettings(textNode);

    let lineHasWhitespace = this._lineHasWhitespace;
    let lineHasContent = this._lineHasContent;
    let content = this._content;
    let offset = resetOffset ? nodeValueLength : this._offset;
    let remainder = this._remainder;
    let newlines = this._newlines;

    while (offset > 0) {
      --offset;
      const char = nodeValue[offset];
      const charAttributes = TextSeeker.getCharacterAttributes(char, preserveNewlines, preserveWhitespace);

      if (charAttributes === 0) {
        continue;
      } else if (charAttributes === 1) {
        lineHasWhitespace = true;
      } else {
        if (newlines > 0) {
          if (content.length > 0) {
            const useNewlineCount = Math.min(remainder, newlines);
            content = "\n".repeat(useNewlineCount) + content;
            remainder -= useNewlineCount;
            newlines -= useNewlineCount;
          } else {
            newlines = 0;
          }
          lineHasContent = false;
          lineHasWhitespace = false;
          if (remainder <= 0) {
            ++offset;
            break;
          }
        }

        lineHasContent = charAttributes === 2;

        if (lineHasWhitespace) {
          if (lineHasContent) {
            content = " " + content;
            lineHasWhitespace = false;
            if (--remainder <= 0) {
              ++offset;
              break;
            }
          } else {
            lineHasWhitespace = false;
          }
        }

        content = char + content;

        if (--remainder <= 0) {
          break;
        }
      }
    }

    this._lineHasWhitespace = lineHasWhitespace;
    this._lineHasContent = lineHasContent;
    this._content = content;
    this._offset = offset;
    this._remainder = remainder;
    this._newlines = newlines;

    return remainder > 0;
  }

  _getWhitespaceSettings(textNode: Text) {
    if (this._forcePreserveWhitespace) {
      return { preserveNewlines: true, preserveWhitespace: true };
    }
    const element = TextSeeker.getParentElement(textNode);
    if (element !== null) {
      const style = window.getComputedStyle(element);
      switch (style.whiteSpace) {
        case "pre":
        case "pre-wrap":
        case "break-spaces":
          return { preserveNewlines: true, preserveWhitespace: true };
        case "pre-line":
          return { preserveNewlines: true, preserveWhitespace: false };
      }
    }
    return { preserveNewlines: false, preserveWhitespace: false };
  }

  static getNextNode(node: Node, forward: boolean, visitChildren: boolean, exitedNodes: Node[]) {
    let next: Node = visitChildren ? (forward ? node.firstChild : node.lastChild) : null;
    if (next === null) {
      while (true) {
        exitedNodes.push(node);

        next = forward ? node.nextSibling : node.previousSibling;
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

  static getParentElement(node: Node): HTMLElement {
    while (node !== null && node.nodeType !== Node.ELEMENT_NODE) {
      node = node.parentNode;
    }
    return <HTMLElement>node;
  }

  static getParentRubyElement(node: Node) {
    node = TextSeeker.getParentElement(node);
    if (node !== null && node.nodeName.toUpperCase() === "RT") {
      node = node.parentNode;
      if (node !== null && node.nodeName.toUpperCase() === "RUBY") {
        return node;
      }
    }
    return null;
  }

  static getElementSeekInfo(element: HTMLElement) {
    let enterable = true;
    switch (element.nodeName.toUpperCase()) {
      case "HEAD":
      case "RT":
      case "SCRIPT":
      case "STYLE":
        return { enterable: false, newlines: 0 };
      case "BR":
        return { enterable: false, newlines: 1 };
      case "TEXTAREA":
      case "INPUT":
      case "BUTTON":
        enterable = false;
        break;
    }

    const style = window.getComputedStyle(element);
    const display = style.display;

    const visible = display !== "none" && TextSeeker.isStyleVisible(style);
    let newlines = 0;

    if (!visible) {
      enterable = false;
    } else {
      switch (style.position) {
        case "absolute":
        case "fixed":
        case "sticky":
          newlines = 2;
          break;
      }
      if (newlines === 0 && TextSeeker.doesCSSDisplayChangeLayout(display)) {
        newlines = 1;
      }
    }

    return { enterable, newlines };
  }

  static getCharacterAttributes(character: string, preserveNewlines: boolean, preserveWhitespace: boolean) {
    switch (character.charCodeAt(0)) {
      case 0x09:
      case 0x0c:
      case 0x0d:
      case 0x20:
        return preserveWhitespace ? 2 : 1;
      case 0x0a:
        return preserveNewlines ? 3 : 1;
      case 0x200b:
      case 0x200c:
        return 0;
      default:
        return 2;
    }
  }

  static isStyleVisible(style: CSSStyleDeclaration) {
    return !(
      style.visibility === "hidden" ||
      parseFloat(style.opacity) <= 0 ||
      parseFloat(style.fontSize) <= 0 ||
      (!TextSeeker.isStyleSelectable(style) && (TextSeeker.isCSSColorTransparent(style.color) || TextSeeker.isCSSColorTransparent(style.webkitTextFillColor)))
    );
  }

  static isStyleSelectable(style: CSSStyleDeclaration) {
    // @ts-ignore
    return !(style.userSelect === "none" || style.webkitUserSelect === "none" || style.MozUserSelect === "none" || style.msUserSelect === "none");
  }

  static isCSSColorTransparent(cssColor: string) {
    return typeof cssColor === "string" && cssColor.startsWith("rgba(") && /,\s*0.?0*\)$/.test(cssColor);
  }

  static doesCSSDisplayChangeLayout(cssDisplay: string) {
    let pos = cssDisplay.indexOf(" ");
    if (pos >= 0) {
      cssDisplay = cssDisplay.substring(0, pos);
    }

    pos = cssDisplay.indexOf("-");
    if (pos >= 0) {
      cssDisplay = cssDisplay.substring(0, pos);
    }

    switch (cssDisplay) {
      case "block":
      case "flex":
      case "grid":
      case "list":
      case "table":
        return true;
      case "ruby":
        return pos >= 0;
      default:
        return false;
    }
  }
}
