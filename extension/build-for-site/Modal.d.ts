import { ProcessTextResponse } from './interfaces/ProcessTextResponse';
import { ProcessTextRequest } from './interfaces/ProcessTextRequest';
export declare class Modal {
    protected shadowElement: HTMLDivElement;
    protected shadowRoot: ShadowRoot;
    protected modalOuter: HTMLDivElement;
    protected modalBody: HTMLDivElement;
    protected bodyClickCallback: (this: Element, ev: MouseEvent) => any;
    protected modalClickCallback: (this: Element, ev: MouseEvent) => any;
    protected currentProcessTextRequest: ProcessTextRequest;
    protected currentProcessTextResponse: ProcessTextResponse;
    protected width: number;
    protected height: number;
    protected create(): void;
    updatePosition(range: Range): void;
    showRawHtml(content: any): void;
    showText(text: any): void;
    showTranslations(request: ProcessTextRequest, response: ProcessTextResponse): void;
    protected modalClick(e: MouseEvent): void;
    protected clickOnMeaning(el: HTMLElement): Promise<void>;
    protected bodyClick(e: MouseEvent): void;
    hide(): void;
    dispose(): void;
}
