import { ActivatedRoute, ParamMap } from "@angular/router";
import { combineLatest, Observable } from "rxjs";
import { map } from "rxjs/operators";

export function randomFromRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max * 1000 - min * 1000 + 1) + min * 1000);
}

export type Dictionary<T> = { [key: string]: T; };

export function paramMapToParams(paramMap: ParamMap): Dictionary<string> {
    return (<any>paramMap).params;
}

export function allParams(route: ActivatedRoute): Observable<any> {
    return combineLatest([route.paramMap, route.queryParamMap]).pipe(map(([routeParams, queryParams]) => {
        return { ...queryParamsToObject(paramMapToParams(routeParams)), ...queryParamsToObject(paramMapToParams(queryParams)) };
    }))
}

export function toQueryString(obj: any, prefix: string = '') {
    let str = [];
    for (let [key, value] of obj.entries()) {
        if (prefix) {
            key = prefix + "[" + key + "]";
        }
        str.push((value !== null && typeof value === "object") ? toQueryString(value, key) : encodeURIComponent(key) + "=" + encodeURIComponent(value));
    }
    return str.join("&");
}

export function toQueryParams(obj: any, prefix: string = '', result: Dictionary<string> = {}) {
    for (let [key, value] of Object.entries(obj)) {
        if (value) {
            if (prefix) {
                key = prefix + "[" + key + "]";
            }
            if (typeof value === "object") {
                toQueryParams(value, key, result);
            }
            else {
                result[key] = String(value);
            }
        }
    }
    return result;
}

export function queryParamsToObject(params: Dictionary<string>) {
    let result: any = {};
    for (let [key, value] of Object.entries(params)) {
        let keys = [...key.matchAll(/(?:^([^\[\]]+)|\[([^\[\]]*)\])/g)].map(m => m[1] ?? m[2]);
        let prev = result;
        for (let i = 0; i < keys.length; i++) {
            let isLast = (i + 1) == keys.length;
            if (isLast) {
                if (Array.isArray(prev)) {
                    if (keys[i] === "" || !isFinite(Number(keys[i]))) {
                        prev.push(value);
                    }
                    else {
                        prev[keys[i]] = value;
                    }
                }
                else {
                    prev[keys[i]] = value;
                }
            }
            else {
                if (!prev[keys[i]]) {
                    let nextIsArrayIndex = (i + 1) < keys.length && (keys[i + 1] === "" || isFinite(Number(keys[i + 1])));
                    prev[keys[i]] = nextIsArrayIndex ? [] : {};
                }
                prev = prev[keys[i]];
            }
        }
    }

    return result;
}