import User from "./interfaces/User";
import { Modal } from "./Modal";
declare class State {
    user: User;
    modal: Modal;
    apiCall: (httpMethod: string, apiMethod: string, body: any) => Promise<any>;
}
export declare const state: State;
export declare function isStringContainsJapanese(string: string): boolean;
export declare function showForRange(range: Range, exactMatch?: boolean): Promise<void>;
export declare function caretRangeFromPoint(x: number, y: number) : Range;
export { };
