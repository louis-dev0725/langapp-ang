export function caretRangeFromPoint(x: number, y: number) {
    if (typeof document.caretRangeFromPoint === 'function') {
        // Chrome, Edge
        return document.caretRangeFromPoint(x, y);
    }

    if (typeof document.caretPositionFromPoint === 'function') {
        // Firefox
        return caretPositionFromPoint(x, y);
    }

    // No support
    return null;
}

function caretPositionFromPoint(x: number, y: number) {
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
            // Elements with user-select: all will return the element
            // instead of a text point inside the element.
            if (isElementUserSelectAll(<HTMLElement>node)) {
                return caretPositionFromPointNormalizeStyles(x, y, <HTMLElement>node);
            }
            break;
    }

    try {
        const range = document.createRange();
        range.setStart(node, offset);
        range.setEnd(node, offset);
        return range;
    } catch (e) {
        // Firefox throws new DOMException("The operation is insecure.")
        // when trying to select a node from within a ShadowRoot.
        return null;
    }
}

function caretPositionFromPointNormalizeStyles(x, y, nextElement: HTMLElement) {
    const previousStyles = new Map<HTMLElement, string>();
    try {
        while (true) {
            recordPreviousStyle(previousStyles, nextElement);
            nextElement.style.setProperty('user-select', 'text', 'important');

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
                    // Elements with user-select: all will return the element
                    // instead of a text point inside the element.
                    if (isElementUserSelectAll(<HTMLElement>node)) {
                        if (previousStyles.has(<HTMLElement>node)) {
                            // Recursive
                            return null;
                        }
                        nextElement = <HTMLElement>node;
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
                // Firefox throws new DOMException("The operation is insecure.")
                // when trying to select a node from within a ShadowRoot.
                return null;
            }
        }
    } finally {
        revertStyles(previousStyles);
    }
}

function recordPreviousStyle(previousStyles: Map<HTMLElement, string>, element: HTMLElement) {
    if (previousStyles.has(element)) {
        return;
    }
    const style = element.hasAttribute('style') ? element.getAttribute('style') : null;
    previousStyles.set(element, style);
}

function isElementUserSelectAll(element: HTMLElement) {
    return getComputedStyle(element).userSelect === 'all';
}

function revertStyles(previousStyles) {
    for (const [element, style] of previousStyles.entries()) {
        if (style === null) {
            element.removeAttribute('style');
        } else {
            element.setAttribute('style', style);
        }
    }
}