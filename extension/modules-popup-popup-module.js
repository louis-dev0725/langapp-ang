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
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../node_modules/@angular/core/__ivy_ngcc__/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "../node_modules/@angular/common/__ivy_ngcc__/fesm5/common.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "../node_modules/@angular/router/__ivy_ngcc__/fesm5/router.js");




function PopupComponent_div_0_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "\u0414\u043B\u044F \u0440\u0430\u0431\u043E\u0442\u044B \u0441 \u043F\u043B\u0430\u0433\u0438\u043D\u0430\u043C \u0438 \u0434\u043E\u0441\u0442\u0443\u043F\u0430 \u043A \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u043C \u0432\u0430\u043C \u043D\u0435 \u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F \u043D\u0430 ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "a", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, "\u0441\u0430\u0439\u0442\u0435");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, ". ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
var _c0 = function () { return ["http://localhost:4200/settings/plugin"]; };
function PopupComponent_div_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "button", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043F\u043B\u0430\u0433\u0438\u043D\u0430");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    var ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("Id: ", ctx_r1.user.id, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("\u0418\u043C\u044F: ", ctx_r1.user.name, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("E-mail: ", ctx_r1.user.email, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](4, _c0));
} }
var PopupComponent = /** @class */ (function () {
    function PopupComponent() {
        var _this = this;
        this.token = '';
        this.user = {};
        chrome.runtime.onMessage.addListener(function (message) {
            if (message.type === 'siteAuth') {
                _this.siteAction('auth', message.data);
            }
            if (message.type === 'siteLogout') {
                _this.siteAction('logout');
            }
        });
    }
    PopupComponent.prototype.ngOnInit = function () {
        var _this = this;
        chrome.storage.sync.get(['token'], function (result) {
            if (result.hasOwnProperty('token')) {
                _this.token = result.token;
            }
        });
        chrome.storage.sync.get(['user'], function (result) {
            if (result.hasOwnProperty('user')) {
                _this.user = JSON.parse(result.user);
            }
        });
        this.siteAuthContent = this.token !== '' && this.user !== '';
    };
    PopupComponent.prototype.siteAction = function (action, data) {
        if (data === void 0) { data = {}; }
        if (action === 'auth') {
            this.user = JSON.parse(data.user);
            this.token = data.token;
            this.siteAuthContent = true;
            chrome.storage.sync.set({ token: data.token }, function () {
                console.log('Set token');
            });
            chrome.storage.sync.set({ user: data.user }, function () {
                console.log('Set user');
            });
        }
        if (action === 'logout') {
            this.siteAuthContent = false;
            chrome.storage.sync.remove(['token', 'user', 'settingExtension']);
        }
    };
    PopupComponent.ɵfac = function PopupComponent_Factory(t) { return new (t || PopupComponent)(); };
    PopupComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: PopupComponent, selectors: [["app-popup"]], decls: 2, vars: 2, consts: [["class", "content", 4, "ngIf"], [1, "content"], ["href", "http://localhost:4200"], [1, "setting_button", 3, "routerLink"]], template: function PopupComponent_Template(rf, ctx) { if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](0, PopupComponent_div_0_Template, 6, 0, "div", 0);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, PopupComponent_div_1_Template, 9, 5, "div", 0);
        } if (rf & 2) {
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx.siteAuthContent);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.siteAuthContent);
        } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["NgIf"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterLink"]], styles: [".content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-flow: column wrap;\n  padding: 20px;\n}\n\n.get_token_button[_ngcontent-%COMP%], .setting_button[_ngcontent-%COMP%] {\n  background: transparent;\n  border: 1px solid #000;\n  border-radius: 10px;\n  cursor: pointer;\n  text-decoration: none;\n}\n\n.get_token_button[_ngcontent-%COMP%]:hover, .setting_button[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n\n.setting_button[_ngcontent-%COMP%] {\n  margin-top: 20px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvc3JjL2FwcC9tb2R1bGVzL3BvcHVwL3BhZ2VzL3BvcHVwL0Q6XFxPcGVuU2VydmVyXFxkb21haW5zXFxpcF9MVlNcXGxhbmdhcHBcXGxhbmdhcHAtZXh0ZW5zaW9uXFxhcHAtZXh0L2FuZ3VsYXJcXHNyY1xcYXBwXFxtb2R1bGVzXFxwb3B1cFxccGFnZXNcXHBvcHVwXFxwb3B1cC5jb21wb25lbnQuc2NzcyIsImFuZ3VsYXIvc3JjL2FwcC9tb2R1bGVzL3BvcHVwL3BhZ2VzL3BvcHVwL3BvcHVwLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsYUFBQTtBQ0NGOztBREVBOztFQUVFLHVCQUFBO0VBQ0Esc0JBQUE7RUFDQSxtQkFBQTtFQUNBLGVBQUE7RUFDQSxxQkFBQTtBQ0NGOztBREVBOztFQUVFLDBCQUFBO0FDQ0Y7O0FERUE7RUFDRSxnQkFBQTtBQ0NGIiwiZmlsZSI6ImFuZ3VsYXIvc3JjL2FwcC9tb2R1bGVzL3BvcHVwL3BhZ2VzL3BvcHVwL3BvcHVwLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmNvbnRlbnQge1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgZmxleC1mbG93OiBjb2x1bW4gd3JhcDtcclxuICBwYWRkaW5nOiAyMHB4O1xyXG59XHJcblxyXG4uZ2V0X3Rva2VuX2J1dHRvbixcclxuLnNldHRpbmdfYnV0dG9uIHtcclxuICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcclxuICBib3JkZXI6IDFweCBzb2xpZCAjMDAwO1xyXG4gIGJvcmRlci1yYWRpdXM6IDEwcHg7XHJcbiAgY3Vyc29yOiBwb2ludGVyO1xyXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcclxufVxyXG5cclxuLmdldF90b2tlbl9idXR0b246aG92ZXIsXHJcbi5zZXR0aW5nX2J1dHRvbjpob3ZlciB7XHJcbiAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XHJcbn1cclxuXHJcbi5zZXR0aW5nX2J1dHRvbiB7XHJcbiAgbWFyZ2luLXRvcDogMjBweDtcclxufVxyXG4iLCIuY29udGVudCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZmxvdzogY29sdW1uIHdyYXA7XG4gIHBhZGRpbmc6IDIwcHg7XG59XG5cbi5nZXRfdG9rZW5fYnV0dG9uLFxuLnNldHRpbmdfYnV0dG9uIHtcbiAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gIGJvcmRlcjogMXB4IHNvbGlkICMwMDA7XG4gIGJvcmRlci1yYWRpdXM6IDEwcHg7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xufVxuXG4uZ2V0X3Rva2VuX2J1dHRvbjpob3Zlcixcbi5zZXR0aW5nX2J1dHRvbjpob3ZlciB7XG4gIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xufVxuXG4uc2V0dGluZ19idXR0b24ge1xuICBtYXJnaW4tdG9wOiAyMHB4O1xufSJdfQ== */"] });
    return PopupComponent;
}());

/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](PopupComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-popup',
                templateUrl: 'popup.component.html',
                styleUrls: ['popup.component.scss'],
            }]
    }], function () { return []; }, null); })();


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