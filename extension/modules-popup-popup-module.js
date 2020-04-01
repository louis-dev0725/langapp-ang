(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["modules-popup-popup-module"],{

/***/ "./src/app/modules/popup/pages/popup/popup.component.ts":
/*!**************************************************************!*\
  !*** ./src/app/modules/popup/pages/popup/popup.component.ts ***!
  \**************************************************************/
/*! exports provided: PopupComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PopupComponent", function() { return PopupComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../node_modules/@angular/core/__ivy_ngcc__/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _providers_tab_id_provider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../providers/tab-id.provider */ "./src/app/providers/tab-id.provider.ts");






var PopupComponent = /** @class */ (function () {
    function PopupComponent(tabId) {
        this.tabId = tabId;
    }
    PopupComponent.prototype.onClick = function () {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function () {
            var _a;
            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"])(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["bindCallback"])(chrome.tabs.sendMessage.bind(this, this.tabId, 'request'))()
                                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(function (msg) {
                                return chrome.runtime.lastError
                                    ? 'The current page is protected by the browser, goto: https://www.google.nl and try again.'
                                    : msg;
                            }))
                                .toPromise()];
                    case 1:
                        _a.message = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PopupComponent.ɵfac = function PopupComponent_Factory(t) { return new (t || PopupComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_providers_tab_id_provider__WEBPACK_IMPORTED_MODULE_4__["TAB_ID"])); };
    PopupComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: PopupComponent, selectors: [["app-popup"]], decls: 12, vars: 2, consts: [[3, "click"]], template: function PopupComponent_Template(rf, ctx) { if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "h1");
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Popup");
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "p");
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "You can easily send messages from the popup to the content page with the provided Tab ID! (tabId=");
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "strong");
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5);
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, ")");
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "button", 0);
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function PopupComponent_Template_button_click_7_listener() { return ctx.onClick(); });
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8, "Click me to test");
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "p");
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "strong");
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](11);
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        } if (rf & 2) {
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.tabId);
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](6);
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.message);
        } }, styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJhbmd1bGFyL3NyYy9hcHAvbW9kdWxlcy9wb3B1cC9wYWdlcy9wb3B1cC9wb3B1cC5jb21wb25lbnQuc2NzcyJ9 */"] });
    return PopupComponent;
}());

/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](PopupComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"],
        args: [{
                selector: 'app-popup',
                templateUrl: 'popup.component.html',
                styleUrls: ['popup.component.scss']
            }]
    }], function () { return [{ type: undefined, decorators: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"],
                args: [_providers_tab_id_provider__WEBPACK_IMPORTED_MODULE_4__["TAB_ID"]]
            }] }]; }, null); })();


/***/ }),

/***/ "./src/app/modules/popup/popup-routing.module.ts":
/*!*******************************************************!*\
  !*** ./src/app/modules/popup/popup-routing.module.ts ***!
  \*******************************************************/
/*! exports provided: PopupRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PopupRoutingModule", function() { return PopupRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../node_modules/@angular/core/__ivy_ngcc__/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "../node_modules/@angular/router/__ivy_ngcc__/fesm5/router.js");
/* harmony import */ var _pages_popup_popup_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pages/popup/popup.component */ "./src/app/modules/popup/pages/popup/popup.component.ts");





var routes = [
    {
        path: '',
        component: _pages_popup_popup_component__WEBPACK_IMPORTED_MODULE_2__["PopupComponent"]
    }
];
var PopupRoutingModule = /** @class */ (function () {
    function PopupRoutingModule() {
    }
    PopupRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: PopupRoutingModule });
    PopupRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function PopupRoutingModule_Factory(t) { return new (t || PopupRoutingModule)(); }, imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]] });
    return PopupRoutingModule;
}());

(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](PopupRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](PopupRoutingModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
                exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
            }]
    }], null, null); })();


/***/ }),

/***/ "./src/app/modules/popup/popup.module.ts":
/*!***********************************************!*\
  !*** ./src/app/modules/popup/popup.module.ts ***!
  \***********************************************/
/*! exports provided: PopupModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PopupModule", function() { return PopupModule; });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ "../node_modules/@angular/common/__ivy_ngcc__/fesm5/common.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../node_modules/@angular/core/__ivy_ngcc__/fesm5/core.js");
/* harmony import */ var _pages_popup_popup_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pages/popup/popup.component */ "./src/app/modules/popup/pages/popup/popup.component.ts");
/* harmony import */ var _popup_routing_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./popup-routing.module */ "./src/app/modules/popup/popup-routing.module.ts");





var PopupModule = /** @class */ (function () {
    function PopupModule() {
    }
    PopupModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineNgModule"]({ type: PopupModule });
    PopupModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjector"]({ factory: function PopupModule_Factory(t) { return new (t || PopupModule)(); }, imports: [[_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"], _popup_routing_module__WEBPACK_IMPORTED_MODULE_3__["PopupRoutingModule"]]] });
    return PopupModule;
}());

(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsetNgModuleScope"](PopupModule, { declarations: [_pages_popup_popup_component__WEBPACK_IMPORTED_MODULE_2__["PopupComponent"]], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"], _popup_routing_module__WEBPACK_IMPORTED_MODULE_3__["PopupRoutingModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](PopupModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"],
        args: [{
                declarations: [_pages_popup_popup_component__WEBPACK_IMPORTED_MODULE_2__["PopupComponent"]],
                imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"], _popup_routing_module__WEBPACK_IMPORTED_MODULE_3__["PopupRoutingModule"]]
            }]
    }], null, null); })();


/***/ })

}]);
//# sourceMappingURL=modules-popup-popup-module.js.map