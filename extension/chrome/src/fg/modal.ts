import * as templates from '../templates';

export class Modal {
    protected shadowElement: HTMLDivElement;
    protected shadowRoot: ShadowRoot;
    protected modalOuter: HTMLDivElement;
    protected modalBody: HTMLDivElement;

    Modal() {
    }

    protected create() {
        if (this.shadowElement) {
            return;
        }
        this.shadowElement = document.createElement('div');
        document.body.appendChild(this.shadowElement);
        this.shadowRoot = this.shadowElement.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = templates.styles({}) + templates.modal({});
        this.modalOuter = <HTMLDivElement>this.shadowRoot.getElementById('modalTranslate')
        this.modalBody = this.modalOuter.querySelector('#modalBody');

        this.modalOuter.querySelector('#closeModal').addEventListener('click', e => this.hide());

        document.body.addEventListener('click', e => this.hide());
    }

    updatePosition(x?: number, y?: number) {
        if (x !== undefined) {
            this.modalOuter.style.left = x + 'px';
        }
        if (y !== undefined) {
            this.modalOuter.style.top = y + 'px';
        }
        this.modalOuter.style.display = 'flex';
    }

    showRawHtml(content) {
        this.create();
        this.modalBody.innerHTML = content;
    }

    showText(text) {
        this.showRawHtml(templates.modalText({ text: text }));
    }

    hide() {
        if (this.modalBody) {
            this.modalBody.innerHTML = '';
            this.modalOuter.style.display = 'none';
        }
    }
}