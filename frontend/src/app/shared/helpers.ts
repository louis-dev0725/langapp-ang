import { ActivatedRoute, ParamMap } from "@angular/router";
import { combineLatest, Observable } from "rxjs";
import { map } from "rxjs/operators";

export function randomFromRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max * 1000 - min * 1000 + 1) + min * 1000);
}

export type Dictionary<T> = { [key: string]: T; };

export function allParams(route: ActivatedRoute): Observable<any> {
    return combineLatest([route.params, route.queryParams]).pipe(map(([routeParams, queryParams]) => {
        return { ...routeParams, ...queryParams };
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