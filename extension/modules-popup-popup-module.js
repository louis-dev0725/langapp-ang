(window["webpackJsonpExtension"] = window["webpackJsonpExtension"] || []).push([["modules-popup-popup-module"],{

/***/ "../allParam.config.js":
/*!*****************************!*\
  !*** ../allParam.config.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {
    URIApi: 'http://localhost:8090/',
    URIFront: 'http://localhost:4200'
};


/***/ }),

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
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngx-translate/core */ "../node_modules/@ngx-translate/core/__ivy_ngcc__/fesm5/ngx-translate-core.js");
/* harmony import */ var _allParam_config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../../../../../../../allParam.config */ "../allParam.config.js");
/* harmony import */ var _allParam_config__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_allParam_config__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ "../node_modules/@angular/common/__ivy_ngcc__/fesm5/common.js");






function PopupComponent_div_0_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "a", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](6, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, ". ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    var ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](3, 3, "TextNoAuth"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("href", ctx_r0.siteUri + "/#/", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](6, 5, "Site"));
} }
function PopupComponent_div_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](6, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "a", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](11, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    var ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate2"]("", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](3, 7, "Id"), ": ", ctx_r1.user.id, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate2"]("", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](6, 9, "Name"), ": ", ctx_r1.user.name, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("E-mail: ", ctx_r1.user.email, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("href", ctx_r1.siteUri + "/#/settings/plugin", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](11, 11, "Setting"));
} }
var PopupComponent = /** @class */ (function () {
    function PopupComponent(translate, zone) {
        this.translate = translate;
        this.zone = zone;
        this.token = '';
        this.user = {};
        this.siteUri = _allParam_config__WEBPACK_IMPORTED_MODULE_2__["URIFront"];
    }
    PopupComponent.prototype.ngOnInit = function () {
        var _this = this;
        chrome.storage.local.get(['token', 'user'], function (result) {
            if (result.hasOwnProperty('token') && result.hasOwnProperty('user')) {
                _this.token = result.token;
                _this.user = result.user;
                _this.zone.run(function () {
                    _this.translate.setDefaultLang(_this.user.homeLanguage.code);
                    _this.siteAuthContent = _this.token !== '' && _this.user !== '';
                    console.log('this.siteAuthContent', _this.siteAuthContent);
                });
            }
            else {
                _this.zone.run(function () {
                    _this.translate.setDefaultLang('en');
                    _this.siteAuthContent = false;
                    console.log('this.siteAuthContent', _this.siteAuthContent);
                });
            }
        });
    };
    PopupComponent.ɵfac = function PopupComponent_Factory(t) { return new (t || PopupComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_ngx_translate_core__WEBPACK_IMPORTED_MODULE_1__["TranslateService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"])); };
    PopupComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: PopupComponent, selectors: [["app-popup"]], decls: 2, vars: 2, consts: [["class", "content", 4, "ngIf"], [1, "content"], ["target", "_blank", 3, "href"], ["target", "_blank", 1, "setting_button", 3, "href"]], template: function PopupComponent_Template(rf, ctx) { if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](0, PopupComponent_div_0_Template, 8, 7, "div", 0);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, PopupComponent_div_1_Template, 12, 13, "div", 0);
        } if (rf & 2) {
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx.siteAuthContent);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.siteAuthContent);
        } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_3__["NgIf"]], pipes: [_ngx_translate_core__WEBPACK_IMPORTED_MODULE_1__["TranslatePipe"]], styles: [".content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-flow: column wrap;\n  padding: 20px;\n}\n\n.setting_button[_ngcontent-%COMP%] {\n  margin-top: 20px;\n  font-size: 14px;\n  color: #000;\n  text-align: center;\n  background: transparent;\n  border: 1px solid #000;\n  border-radius: 10px;\n  cursor: pointer;\n  text-decoration: none;\n}\n\n.setting_button[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvc3JjL2FwcC9tb2R1bGVzL3BvcHVwL3BhZ2VzL3BvcHVwL0Q6XFxPcGVuU2VydmVyXFxkb21haW5zXFxpcF9MVlNcXGxhbmdhcHBcXGxhbmdhcHAtZXh0ZW5zaW9uXFxhcHAtZXh0L2FuZ3VsYXJcXHNyY1xcYXBwXFxtb2R1bGVzXFxwb3B1cFxccGFnZXNcXHBvcHVwXFxwb3B1cC5jb21wb25lbnQuc2NzcyIsImFuZ3VsYXIvc3JjL2FwcC9tb2R1bGVzL3BvcHVwL3BhZ2VzL3BvcHVwL3BvcHVwLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsYUFBQTtBQ0NGOztBREVBO0VBQ0UsZ0JBQUE7RUFDQSxlQUFBO0VBQ0EsV0FBQTtFQUNBLGtCQUFBO0VBQ0EsdUJBQUE7RUFDQSxzQkFBQTtFQUNBLG1CQUFBO0VBQ0EsZUFBQTtFQUNBLHFCQUFBO0FDQ0Y7O0FERUE7RUFDRSwwQkFBQTtBQ0NGIiwiZmlsZSI6ImFuZ3VsYXIvc3JjL2FwcC9tb2R1bGVzL3BvcHVwL3BhZ2VzL3BvcHVwL3BvcHVwLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmNvbnRlbnQge1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgZmxleC1mbG93OiBjb2x1bW4gd3JhcDtcclxuICBwYWRkaW5nOiAyMHB4O1xyXG59XHJcblxyXG4uc2V0dGluZ19idXR0b24ge1xyXG4gIG1hcmdpbi10b3A6IDIwcHg7XHJcbiAgZm9udC1zaXplOiAxNHB4O1xyXG4gIGNvbG9yOiAjMDAwO1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcclxuICBib3JkZXI6IDFweCBzb2xpZCAjMDAwO1xyXG4gIGJvcmRlci1yYWRpdXM6IDEwcHg7XHJcbiAgY3Vyc29yOiBwb2ludGVyO1xyXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcclxufVxyXG5cclxuLnNldHRpbmdfYnV0dG9uOmhvdmVyIHtcclxuICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcclxufVxyXG4iLCIuY29udGVudCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZmxvdzogY29sdW1uIHdyYXA7XG4gIHBhZGRpbmc6IDIwcHg7XG59XG5cbi5zZXR0aW5nX2J1dHRvbiB7XG4gIG1hcmdpbi10b3A6IDIwcHg7XG4gIGZvbnQtc2l6ZTogMTRweDtcbiAgY29sb3I6ICMwMDA7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gIGJvcmRlcjogMXB4IHNvbGlkICMwMDA7XG4gIGJvcmRlci1yYWRpdXM6IDEwcHg7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xufVxuXG4uc2V0dGluZ19idXR0b246aG92ZXIge1xuICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcbn0iXX0= */"] });
    return PopupComponent;
}());

/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](PopupComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-popup',
                templateUrl: 'popup.component.html',
                styleUrls: ['popup.component.scss'],
            }]
    }], function () { return [{ type: _ngx_translate_core__WEBPACK_IMPORTED_MODULE_1__["TranslateService"] }, { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"] }]; }, null); })();


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
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngx-translate/core */ "../node_modules/@ngx-translate/core/__ivy_ngcc__/fesm5/ngx-translate-core.js");
/* harmony import */ var _pages_popup_popup_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pages/popup/popup.component */ "./src/app/modules/popup/pages/popup/popup.component.ts");
/* harmony import */ var _popup_routing_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./popup-routing.module */ "./src/app/modules/popup/popup-routing.module.ts");






var PopupModule = /** @class */ (function () {
    function PopupModule() {
    }
    PopupModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineNgModule"]({ type: PopupModule });
    PopupModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjector"]({ factory: function PopupModule_Factory(t) { return new (t || PopupModule)(); }, imports: [[_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"], _popup_routing_module__WEBPACK_IMPORTED_MODULE_4__["PopupRoutingModule"], _ngx_translate_core__WEBPACK_IMPORTED_MODULE_2__["TranslateModule"]]] });
    return PopupModule;
}());

(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsetNgModuleScope"](PopupModule, { declarations: [_pages_popup_popup_component__WEBPACK_IMPORTED_MODULE_3__["PopupComponent"]], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"], _popup_routing_module__WEBPACK_IMPORTED_MODULE_4__["PopupRoutingModule"], _ngx_translate_core__WEBPACK_IMPORTED_MODULE_2__["TranslateModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](PopupModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"],
        args: [{
                declarations: [_pages_popup_popup_component__WEBPACK_IMPORTED_MODULE_3__["PopupComponent"]],
                imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"], _popup_routing_module__WEBPACK_IMPORTED_MODULE_4__["PopupRoutingModule"], _ngx_translate_core__WEBPACK_IMPORTED_MODULE_2__["TranslateModule"]]
            }]
    }], null, null); })();


/***/ })

}]);
//# sourceMappingURL=modules-popup-popup-module.js.map