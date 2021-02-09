import * as templates from '../templates';

class SnackbarOptions {
    duration: number = 3000;
}

let current = null;

export class Snackbar {
    protected shadowElement: HTMLDivElement;
    protected shadowRoot: ShadowRoot;
    protected snackbarBody: HTMLDivElement;

    protected snackbarClickCallback: (this: Element, ev: MouseEvent) => any;

    show(text: string, options?: Partial<SnackbarOptions>) {
        options = Object.assign(new SnackbarOptions(), options);
        if (this.shadowElement) {
            return;
        }

        if (current) {
            current.hide();
        }

        this.shadowElement = document.createElement('div');
        document.body.appendChild(this.shadowElement);
        this.shadowRoot = this.shadowElement.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = templates.snackbarStyles({}) + templates.snackbar({ text: text });
        this.snackbarBody = <HTMLDivElement>this.shadowRoot.querySelector('.snackbar-container');

        this.snackbarClickCallback = e => this.snackbarClick(e);
        this.shadowRoot.addEventListener('click', this.snackbarClickCallback);

        getComputedStyle(this.snackbarBody).bottom;

        this.snackbarBody.style.opacity = "1";
        this.snackbarBody.classList.add('snackbar-pos', 'bottom-left');

        current = this;

        if (options.duration) {
            setTimeout(() => this.hide(), options.duration);
        }
    }

    snackbarClick(e: MouseEvent) {
        this.hide();
    }

    hide() {
        if (this.snackbarBody) {
            this.snackbarBody.style.opacity = '0';

            if (current === this) {
                current = null;
            }

            this.snackbarBody.addEventListener('transitionend', (event) => {
                if (event.propertyName === 'opacity' && this.snackbarBody.style.opacity === '0') {
                    this.dispose();
                }
            });
        }
    }

    dispose() {
        if (this.shadowElement) {
            document.body.removeChild(this.shadowElement);
            this.shadowElement = null;
        }
        if (this.snackbarClickCallback) {
            this.shadowRoot.removeEventListener('click', this.snackbarClickCallback);
            this.snackbarClickCallback = null;
        }
    }
}

export function showSnackbar(text: string, options?: SnackbarOptions) {
    let snackbar = new Snackbar();
    snackbar.show(text, options);
}