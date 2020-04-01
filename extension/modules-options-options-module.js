(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["modules-options-options-module"],{

/***/ "./src/app/modules/options/options-routing.module.ts":
/*!***********************************************************!*\
  !*** ./src/app/modules/options/options-routing.module.ts ***!
  \***********************************************************/
/*! exports provided: OptionsRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OptionsRoutingModule", function() { return OptionsRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../node_modules/@angular/core/__ivy_ngcc__/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "../node_modules/@angular/router/__ivy_ngcc__/fesm5/router.js");
/* harmony import */ var _pages_options_options_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pages/options/options.component */ "./src/app/modules/options/pages/options/options.component.ts");





var routes = [
    {
        path: '',
        component: _pages_options_options_component__WEBPACK_IMPORTED_MODULE_2__["OptionsComponent"]
    }
];
var OptionsRoutingModule = /** @class */ (function () {
    function OptionsRoutingModule() {
    }
    OptionsRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: OptionsRoutingModule });
    OptionsRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function OptionsRoutingModule_Factory(t) { return new (t || OptionsRoutingModule)(); }, imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]] });
    return OptionsRoutingModule;
}());

(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](OptionsRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](OptionsRoutingModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
                exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
            }]
    }], null, null); })();


/***/ }),

/***/ "./src/app/modules/options/options.module.ts":
/*!***************************************************!*\
  !*** ./src/app/modules/options/options.module.ts ***!
  \***************************************************/
/*! exports provided: OptionsModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OptionsModule", function() { return OptionsModule; });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ "../node_modules/@angular/common/__ivy_ngcc__/fesm5/common.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../node_modules/@angular/core/__ivy_ngcc__/fesm5/core.js");
/* harmony import */ var _options_routing_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./options-routing.module */ "./src/app/modules/options/options-routing.module.ts");
/* harmony import */ var _pages_options_options_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pages/options/options.component */ "./src/app/modules/options/pages/options/options.component.ts");





var OptionsModule = /** @class */ (function () {
    function OptionsModule() {
    }
    OptionsModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineNgModule"]({ type: OptionsModule });
    OptionsModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjector"]({ factory: function OptionsModule_Factory(t) { return new (t || OptionsModule)(); }, imports: [[_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"], _options_routing_module__WEBPACK_IMPORTED_MODULE_2__["OptionsRoutingModule"]]] });
    return OptionsModule;
}());

(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsetNgModuleScope"](OptionsModule, { declarations: [_pages_options_options_component__WEBPACK_IMPORTED_MODULE_3__["OptionsComponent"]], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"], _options_routing_module__WEBPACK_IMPORTED_MODULE_2__["OptionsRoutingModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](OptionsModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"],
        args: [{
                declarations: [_pages_options_options_component__WEBPACK_IMPORTED_MODULE_3__["OptionsComponent"]],
                imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"], _options_routing_module__WEBPACK_IMPORTED_MODULE_2__["OptionsRoutingModule"]]
            }]
    }], null, null); })();


/***/ }),

/***/ "./src/app/modules/options/pages/options/options.component.ts":
/*!********************************************************************!*\
  !*** ./src/app/modules/options/pages/options/options.component.ts ***!
  \********************************************************************/
/*! exports provided: OptionsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OptionsComponent", function() { return OptionsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../node_modules/@angular/core/__ivy_ngcc__/fesm5/core.js");


var OptionsComponent = /** @class */ (function () {
    function OptionsComponent() {
    }
    OptionsComponent.ɵfac = function OptionsComponent_Factory(t) { return new (t || OptionsComponent)(); };
    OptionsComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: OptionsComponent, selectors: [["app-options"]], decls: 4, vars: 0, consts: [[2, "text-align", "center"]], template: function OptionsComponent_Template(rf, ctx) { if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "h1", 0);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Options");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "p", 0);
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "You are now on the options page!");
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        } }, styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJhbmd1bGFyL3NyYy9hcHAvbW9kdWxlcy9vcHRpb25zL3BhZ2VzL29wdGlvbnMvb3B0aW9ucy5jb21wb25lbnQuc2NzcyJ9 */"] });
    return OptionsComponent;
}());

/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](OptionsComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-options',
                templateUrl: 'options.component.html',
                styleUrls: ['options.component.scss']
            }]
    }], null, null); })();


/***/ })

}]);
//# sourceMappingURL=modules-options-options-module.js.map