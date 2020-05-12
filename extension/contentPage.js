/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./chrome/src/contentPage.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./allParam.config.js":
/*!****************************!*\
  !*** ./allParam.config.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {
    URIApi: 'http://localhost:8090/',
    URIFront: 'http://localhost:4200'
};


/***/ }),

/***/ "./chrome/src/contentPage.ts":
/*!***********************************!*\
  !*** ./chrome/src/contentPage.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var config = __webpack_require__(/*! ./../../allParam.config */ "./allParam.config.js");
var token = '';
var user = '';
var extensionSetting = false;
var setting = '';
var statusModal = null;
var translateObj = {
    token: null,
    all_text: null,
    url: null,
    offset: null
};
var modal = document.createElement('div');
var mHeader = document.createElement('div');
var mBody = document.createElement('div');
var wordT = document.createElement('div');
window.onload = function (ev) {
    chrome.storage.local.get(['token', 'user'], function (result) {
        if (result.hasOwnProperty('token') && result.hasOwnProperty('user')) {
            token = result.token;
            extensionSetting = true;
            createButtonListener();
        }
        else {
            if (ev.target.baseURI === config.URIFront + '/') {
                token = localStorage.getItem('token');
                user = localStorage.getItem('user');
                if (token !== null && user !== null) {
                    chrome.runtime.sendMessage({ type: 'siteAuth', data: { token: token, user: user } });
                    extensionSetting = true;
                    createButtonListener();
                }
            }
        }
    });
};
window.addEventListener('message', function (event) {
    if (event.source != window) {
        return;
    }
    if (event.data.type && (event.data.type === 'LoginSuccess') && (event.origin === config.URIFront)) {
        token = localStorage.getItem('token');
        user = localStorage.getItem('user');
        chrome.runtime.sendMessage({ type: 'siteAuth', data: { token: token, user: user } });
    }
    if (event.data.type && (event.data.type === 'saveSettingExtension') && (event.origin === config.URIFront)) {
        var settingExtension = JSON.parse(localStorage.getItem(event.data.text));
        chrome.runtime.sendMessage({ type: 'saveSetting', data: {
                settingExtension: String(settingExtension.extensionShowTranslate)
            } });
        setting = String(settingExtension.extensionShowTranslate);
    }
    if (event.data.type && (event.data.type === 'Logout') && (event.origin === config.URIFront)) {
        chrome.runtime.sendMessage({ type: 'siteLogout' });
    }
});
function createButtonListener() {
    if (extensionSetting) {
        chrome.storage.local.get(['settingExtensionAction'], function (result) {
            if (result.hasOwnProperty('settingExtensionAction')) {
                setting = result.settingExtensionAction;
            }
            else {
                setting = 'extension.DoubleClick';
            }
        });
        document.addEventListener('dblclick', function (e) {
            if (setting === 'extension.DoubleClick') {
                if ((e.metaKey === false || e.ctrlKey === false) && e.shiftKey === false && e.altKey === false) {
                    statusModal = document.getElementById('modalTranslate');
                    if (statusModal === null) {
                        createModal();
                    }
                    innerTranslateObject(document.caretRangeFromPoint(e.x, e.y), token, e.pageX, e.pageY);
                }
            }
            if (setting === 'extension.DoubleClickCtrl') {
                if ((e.metaKey === true || e.ctrlKey === true) && e.shiftKey === false && e.altKey === false) {
                    statusModal = document.getElementById('modalTranslate');
                    if (statusModal === null) {
                        createModal();
                    }
                    innerTranslateObject(document.caretRangeFromPoint(e.x, e.y), token, e.pageX, e.pageY);
                }
            }
            if (setting === 'extension.DoubleClickShift') {
                if ((e.metaKey === false || e.ctrlKey === false) && e.shiftKey === true && e.altKey === false) {
                    statusModal = document.getElementById('modalTranslate');
                    if (statusModal === null) {
                        createModal();
                    }
                    innerTranslateObject(document.caretRangeFromPoint(e.x, e.y), token, e.pageX, e.pageY);
                }
            }
            if (setting === 'extension.DoubleClickAlt') {
                if ((e.metaKey === false || e.ctrlKey === false) && e.shiftKey === false && e.altKey === true) {
                    console.log(e);
                    statusModal = document.getElementById('modalTranslate');
                    if (statusModal === null) {
                        createModal();
                    }
                    innerTranslateObject(document.caretRangeFromPoint(e.x, e.y), token, e.pageX, e.pageY);
                }
            }
        });
    }
}
function createModal() {
    modal.setAttribute('id', 'modalTranslate');
    modal.style.position = 'absolute';
    modal.style.display = 'flex';
    modal.style.flexFlow = 'column';
    modal.style.zIndex = '9999999';
    modal.style.width = '300px';
    modal.style.height = 'auto';
    modal.style.maxHeight = '60vh';
    modal.style.background = '#fff';
    modal.style.borderRadius = '10px';
    modal.style.padding = '10px';
    document.body.appendChild(modal);
    modal.appendChild(mHeader);
    modal.appendChild(mBody);
    mHeader.setAttribute('id', 'modal-translate-header');
    mBody.setAttribute('id', 'modal-translate-body');
    mHeader.innerHTML = '<button type="button" class="close" id="closeModal"><span>&times;</span></button>';
    document.getElementById('closeModal').style.border = 'none';
    document.getElementById('closeModal').style.background = 'transparent';
    document.getElementById('closeModal').style.padding = '0.5rem 1rem';
    document.getElementById('closeModal').style.fontSize = '1.5rem';
    document.getElementById('closeModal').style.fontWeight = '700';
    document.getElementById('closeModal').style.marginLeft = 'auto';
    document.getElementById('closeModal').onclick = function () {
        modal.style.display = 'none';
    };
    mHeader.style.display = 'flex';
    mHeader.style.flexFlow = 'row nowrap';
    mHeader.style.width = '100%';
    mHeader.style.justifyContent = 'space-between';
    mHeader.style.height = '45px';
    mBody.style.boxSizing = 'border-box';
    mBody.style.display = 'flex';
    mBody.style.overflowY = 'scroll';
    mBody.style.flexFlow = 'column nowrap';
    mBody.style.width = '100%';
    mBody.style.padding = '0 15px';
    mBody.style.margin = '10px 0';
    mBody.innerHTML = '<ul id="list-translate"></ul>';
    document.getElementById('modalTranslate').onclick = function () {
        modal.style.display = 'none';
        mBody.innerHTML = '<ul id="list-translate"></ul>';
    };
}
function innerTranslateObject(range, token, offsetX, offsetY) {
    translateObj = null;
    translateObj = {
        token: token,
        all_text: range.startContainer.data,
        url: range.startContainer.ownerDocument.location.href,
        offset: range.startOffset
    };
    chrome.runtime.sendMessage({ type: 'sendBackground', data: translateObj }, function (response) {
        if (response.data.success) {
            console.log(response.data);
            wordT.setAttribute('class', 'word-translate');
            mHeader.insertBefore(wordT, document.getElementById('closeModal'));
            wordT.style.textAlign = 'center';
            if (response.data.res.length > 0) {
                mBody.innerHTML = '<ul id="list-translate"></ul>';
                wordT.innerHTML = '<span>' + JSON.parse(response.data.res[0].sourceData).kana[0].text + '</span>'
                    + '<h1 style="font-size:2em;text-align:center;">' + response.data.word + '</h1>';
                var listTranslate_1 = document.getElementById('list-translate');
                response.data.res.forEach(function (res) {
                    var transObj = JSON.parse(res.sourceData);
                    transObj.sense.forEach(function (sen) {
                        sen.gloss.forEach(function (gl) {
                            listTranslate_1.innerHTML += '<li style="padding-left:10px;border-bottom:1px solid #000;">'
                                + '<a data-text="' + gl.text + '">' + gl.text + '</a></li>';
                        });
                    });
                });
                document.getElementById('list-translate').style.border = '1px solid #000';
                document.getElementById('list-translate').style.borderRadius = '5px';
                document.getElementById('list-translate').style.listStyle = 'none';
                document.getElementById('list-translate').style.padding = '0';
                document.getElementById('list-translate').style.borderBottom = 'none';
            }
            else {
                wordT.innerHTML = '<span></span><h1 style="font-size:2em;text-align:center;">' + response.data.word + '</h1>';
                mBody.innerHTML = 'Перевод не найден... пока-что';
            }
            modal.style.top = parseInt(offsetY) + 15 + 'px';
            modal.style.left = '0';
            if (parseInt(offsetX) - 150 > 0) {
                modal.style.left = parseInt(offsetX) - 150 + 'px';
            }
            modal.style.display = 'flex';
        }
    });
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vYWxsUGFyYW0uY29uZmlnLmpzIiwid2VicGFjazovLy8uL2Nocm9tZS9zcmMvY29udGVudFBhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDSGE7QUFDYiw4Q0FBOEMsY0FBYztBQUM1RCxhQUFhLG1CQUFPLENBQUMscURBQXlCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRCwwQkFBMEIsMkJBQTJCLEVBQUU7QUFDdkc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLDBCQUEwQiwyQkFBMkIsRUFBRTtBQUMzRjtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0M7QUFDcEM7QUFDQSxhQUFhLEVBQUU7QUFDZjtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MscUJBQXFCO0FBQ3pEO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEZBQTBGO0FBQzFGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MsNkNBQTZDO0FBQzdFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0Qsa0JBQWtCO0FBQ2xFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1RkFBdUYsNkJBQTZCO0FBQ3BIO0FBQ0EseUJBQXlCO0FBQ3pCLHFCQUFxQjtBQUNyQixpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5RUFBeUUsa0JBQWtCO0FBQzNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCIsImZpbGUiOiJjb250ZW50UGFnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vY2hyb21lL3NyYy9jb250ZW50UGFnZS50c1wiKTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgVVJJQXBpOiAnaHR0cDovL2xvY2FsaG9zdDo4MDkwLycsXHJcbiAgICBVUklGcm9udDogJ2h0dHA6Ly9sb2NhbGhvc3Q6NDIwMCdcclxufTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGNvbmZpZyA9IHJlcXVpcmUoXCIuLy4uLy4uL2FsbFBhcmFtLmNvbmZpZ1wiKTtcclxudmFyIHRva2VuID0gJyc7XHJcbnZhciB1c2VyID0gJyc7XHJcbnZhciBleHRlbnNpb25TZXR0aW5nID0gZmFsc2U7XHJcbnZhciBzZXR0aW5nID0gJyc7XHJcbnZhciBzdGF0dXNNb2RhbCA9IG51bGw7XHJcbnZhciB0cmFuc2xhdGVPYmogPSB7XHJcbiAgICB0b2tlbjogbnVsbCxcclxuICAgIGFsbF90ZXh0OiBudWxsLFxyXG4gICAgdXJsOiBudWxsLFxyXG4gICAgb2Zmc2V0OiBudWxsXHJcbn07XHJcbnZhciBtb2RhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG52YXIgbUhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG52YXIgbUJvZHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxudmFyIHdvcmRUID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbiAoZXYpIHtcclxuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbJ3Rva2VuJywgJ3VzZXInXSwgZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgIGlmIChyZXN1bHQuaGFzT3duUHJvcGVydHkoJ3Rva2VuJykgJiYgcmVzdWx0Lmhhc093blByb3BlcnR5KCd1c2VyJykpIHtcclxuICAgICAgICAgICAgdG9rZW4gPSByZXN1bHQudG9rZW47XHJcbiAgICAgICAgICAgIGV4dGVuc2lvblNldHRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICBjcmVhdGVCdXR0b25MaXN0ZW5lcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKGV2LnRhcmdldC5iYXNlVVJJID09PSBjb25maWcuVVJJRnJvbnQgKyAnLycpIHtcclxuICAgICAgICAgICAgICAgIHRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Rva2VuJyk7XHJcbiAgICAgICAgICAgICAgICB1c2VyID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXInKTtcclxuICAgICAgICAgICAgICAgIGlmICh0b2tlbiAhPT0gbnVsbCAmJiB1c2VyICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoeyB0eXBlOiAnc2l0ZUF1dGgnLCBkYXRhOiB7IHRva2VuOiB0b2tlbiwgdXNlcjogdXNlciB9IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGV4dGVuc2lvblNldHRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZUJ1dHRvbkxpc3RlbmVyKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufTtcclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIGlmIChldmVudC5zb3VyY2UgIT0gd2luZG93KSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaWYgKGV2ZW50LmRhdGEudHlwZSAmJiAoZXZlbnQuZGF0YS50eXBlID09PSAnTG9naW5TdWNjZXNzJykgJiYgKGV2ZW50Lm9yaWdpbiA9PT0gY29uZmlnLlVSSUZyb250KSkge1xyXG4gICAgICAgIHRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Rva2VuJyk7XHJcbiAgICAgICAgdXNlciA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VyJyk7XHJcbiAgICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoeyB0eXBlOiAnc2l0ZUF1dGgnLCBkYXRhOiB7IHRva2VuOiB0b2tlbiwgdXNlcjogdXNlciB9IH0pO1xyXG4gICAgfVxyXG4gICAgaWYgKGV2ZW50LmRhdGEudHlwZSAmJiAoZXZlbnQuZGF0YS50eXBlID09PSAnc2F2ZVNldHRpbmdFeHRlbnNpb24nKSAmJiAoZXZlbnQub3JpZ2luID09PSBjb25maWcuVVJJRnJvbnQpKSB7XHJcbiAgICAgICAgdmFyIHNldHRpbmdFeHRlbnNpb24gPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGV2ZW50LmRhdGEudGV4dCkpO1xyXG4gICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHsgdHlwZTogJ3NhdmVTZXR0aW5nJywgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgc2V0dGluZ0V4dGVuc2lvbjogU3RyaW5nKHNldHRpbmdFeHRlbnNpb24uZXh0ZW5zaW9uU2hvd1RyYW5zbGF0ZSlcclxuICAgICAgICAgICAgfSB9KTtcclxuICAgICAgICBzZXR0aW5nID0gU3RyaW5nKHNldHRpbmdFeHRlbnNpb24uZXh0ZW5zaW9uU2hvd1RyYW5zbGF0ZSk7XHJcbiAgICB9XHJcbiAgICBpZiAoZXZlbnQuZGF0YS50eXBlICYmIChldmVudC5kYXRhLnR5cGUgPT09ICdMb2dvdXQnKSAmJiAoZXZlbnQub3JpZ2luID09PSBjb25maWcuVVJJRnJvbnQpKSB7XHJcbiAgICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoeyB0eXBlOiAnc2l0ZUxvZ291dCcgfSk7XHJcbiAgICB9XHJcbn0pO1xyXG5mdW5jdGlvbiBjcmVhdGVCdXR0b25MaXN0ZW5lcigpIHtcclxuICAgIGlmIChleHRlbnNpb25TZXR0aW5nKSB7XHJcbiAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFsnc2V0dGluZ0V4dGVuc2lvbkFjdGlvbiddLCBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQuaGFzT3duUHJvcGVydHkoJ3NldHRpbmdFeHRlbnNpb25BY3Rpb24nKSkge1xyXG4gICAgICAgICAgICAgICAgc2V0dGluZyA9IHJlc3VsdC5zZXR0aW5nRXh0ZW5zaW9uQWN0aW9uO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc2V0dGluZyA9ICdleHRlbnNpb24uRG91YmxlQ2xpY2snO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZGJsY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBpZiAoc2V0dGluZyA9PT0gJ2V4dGVuc2lvbi5Eb3VibGVDbGljaycpIHtcclxuICAgICAgICAgICAgICAgIGlmICgoZS5tZXRhS2V5ID09PSBmYWxzZSB8fCBlLmN0cmxLZXkgPT09IGZhbHNlKSAmJiBlLnNoaWZ0S2V5ID09PSBmYWxzZSAmJiBlLmFsdEtleSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBzdGF0dXNNb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbFRyYW5zbGF0ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGF0dXNNb2RhbCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVNb2RhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpbm5lclRyYW5zbGF0ZU9iamVjdChkb2N1bWVudC5jYXJldFJhbmdlRnJvbVBvaW50KGUueCwgZS55KSwgdG9rZW4sIGUucGFnZVgsIGUucGFnZVkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzZXR0aW5nID09PSAnZXh0ZW5zaW9uLkRvdWJsZUNsaWNrQ3RybCcpIHtcclxuICAgICAgICAgICAgICAgIGlmICgoZS5tZXRhS2V5ID09PSB0cnVlIHx8IGUuY3RybEtleSA9PT0gdHJ1ZSkgJiYgZS5zaGlmdEtleSA9PT0gZmFsc2UgJiYgZS5hbHRLZXkgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzTW9kYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWxUcmFuc2xhdGUnKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdHVzTW9kYWwgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlTW9kYWwoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaW5uZXJUcmFuc2xhdGVPYmplY3QoZG9jdW1lbnQuY2FyZXRSYW5nZUZyb21Qb2ludChlLngsIGUueSksIHRva2VuLCBlLnBhZ2VYLCBlLnBhZ2VZKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoc2V0dGluZyA9PT0gJ2V4dGVuc2lvbi5Eb3VibGVDbGlja1NoaWZ0Jykge1xyXG4gICAgICAgICAgICAgICAgaWYgKChlLm1ldGFLZXkgPT09IGZhbHNlIHx8IGUuY3RybEtleSA9PT0gZmFsc2UpICYmIGUuc2hpZnRLZXkgPT09IHRydWUgJiYgZS5hbHRLZXkgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzTW9kYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWxUcmFuc2xhdGUnKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdHVzTW9kYWwgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlTW9kYWwoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaW5uZXJUcmFuc2xhdGVPYmplY3QoZG9jdW1lbnQuY2FyZXRSYW5nZUZyb21Qb2ludChlLngsIGUueSksIHRva2VuLCBlLnBhZ2VYLCBlLnBhZ2VZKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoc2V0dGluZyA9PT0gJ2V4dGVuc2lvbi5Eb3VibGVDbGlja0FsdCcpIHtcclxuICAgICAgICAgICAgICAgIGlmICgoZS5tZXRhS2V5ID09PSBmYWxzZSB8fCBlLmN0cmxLZXkgPT09IGZhbHNlKSAmJiBlLnNoaWZ0S2V5ID09PSBmYWxzZSAmJiBlLmFsdEtleSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1c01vZGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsVHJhbnNsYXRlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXR1c01vZGFsID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZU1vZGFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlubmVyVHJhbnNsYXRlT2JqZWN0KGRvY3VtZW50LmNhcmV0UmFuZ2VGcm9tUG9pbnQoZS54LCBlLnkpLCB0b2tlbiwgZS5wYWdlWCwgZS5wYWdlWSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBjcmVhdGVNb2RhbCgpIHtcclxuICAgIG1vZGFsLnNldEF0dHJpYnV0ZSgnaWQnLCAnbW9kYWxUcmFuc2xhdGUnKTtcclxuICAgIG1vZGFsLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuICAgIG1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XHJcbiAgICBtb2RhbC5zdHlsZS5mbGV4RmxvdyA9ICdjb2x1bW4nO1xyXG4gICAgbW9kYWwuc3R5bGUuekluZGV4ID0gJzk5OTk5OTknO1xyXG4gICAgbW9kYWwuc3R5bGUud2lkdGggPSAnMzAwcHgnO1xyXG4gICAgbW9kYWwuc3R5bGUuaGVpZ2h0ID0gJ2F1dG8nO1xyXG4gICAgbW9kYWwuc3R5bGUubWF4SGVpZ2h0ID0gJzYwdmgnO1xyXG4gICAgbW9kYWwuc3R5bGUuYmFja2dyb3VuZCA9ICcjZmZmJztcclxuICAgIG1vZGFsLnN0eWxlLmJvcmRlclJhZGl1cyA9ICcxMHB4JztcclxuICAgIG1vZGFsLnN0eWxlLnBhZGRpbmcgPSAnMTBweCc7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG1vZGFsKTtcclxuICAgIG1vZGFsLmFwcGVuZENoaWxkKG1IZWFkZXIpO1xyXG4gICAgbW9kYWwuYXBwZW5kQ2hpbGQobUJvZHkpO1xyXG4gICAgbUhlYWRlci5zZXRBdHRyaWJ1dGUoJ2lkJywgJ21vZGFsLXRyYW5zbGF0ZS1oZWFkZXInKTtcclxuICAgIG1Cb2R5LnNldEF0dHJpYnV0ZSgnaWQnLCAnbW9kYWwtdHJhbnNsYXRlLWJvZHknKTtcclxuICAgIG1IZWFkZXIuaW5uZXJIVE1MID0gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBpZD1cImNsb3NlTW9kYWxcIj48c3Bhbj4mdGltZXM7PC9zcGFuPjwvYnV0dG9uPic7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xvc2VNb2RhbCcpLnN0eWxlLmJvcmRlciA9ICdub25lJztcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbG9zZU1vZGFsJykuc3R5bGUuYmFja2dyb3VuZCA9ICd0cmFuc3BhcmVudCc7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xvc2VNb2RhbCcpLnN0eWxlLnBhZGRpbmcgPSAnMC41cmVtIDFyZW0nO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nsb3NlTW9kYWwnKS5zdHlsZS5mb250U2l6ZSA9ICcxLjVyZW0nO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nsb3NlTW9kYWwnKS5zdHlsZS5mb250V2VpZ2h0ID0gJzcwMCc7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xvc2VNb2RhbCcpLnN0eWxlLm1hcmdpbkxlZnQgPSAnYXV0byc7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xvc2VNb2RhbCcpLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbW9kYWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgIH07XHJcbiAgICBtSGVhZGVyLnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XHJcbiAgICBtSGVhZGVyLnN0eWxlLmZsZXhGbG93ID0gJ3JvdyBub3dyYXAnO1xyXG4gICAgbUhlYWRlci5zdHlsZS53aWR0aCA9ICcxMDAlJztcclxuICAgIG1IZWFkZXIuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSAnc3BhY2UtYmV0d2Vlbic7XHJcbiAgICBtSGVhZGVyLnN0eWxlLmhlaWdodCA9ICc0NXB4JztcclxuICAgIG1Cb2R5LnN0eWxlLmJveFNpemluZyA9ICdib3JkZXItYm94JztcclxuICAgIG1Cb2R5LnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XHJcbiAgICBtQm9keS5zdHlsZS5vdmVyZmxvd1kgPSAnc2Nyb2xsJztcclxuICAgIG1Cb2R5LnN0eWxlLmZsZXhGbG93ID0gJ2NvbHVtbiBub3dyYXAnO1xyXG4gICAgbUJvZHkuc3R5bGUud2lkdGggPSAnMTAwJSc7XHJcbiAgICBtQm9keS5zdHlsZS5wYWRkaW5nID0gJzAgMTVweCc7XHJcbiAgICBtQm9keS5zdHlsZS5tYXJnaW4gPSAnMTBweCAwJztcclxuICAgIG1Cb2R5LmlubmVySFRNTCA9ICc8dWwgaWQ9XCJsaXN0LXRyYW5zbGF0ZVwiPjwvdWw+JztcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbFRyYW5zbGF0ZScpLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbW9kYWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICBtQm9keS5pbm5lckhUTUwgPSAnPHVsIGlkPVwibGlzdC10cmFuc2xhdGVcIj48L3VsPic7XHJcbiAgICB9O1xyXG59XHJcbmZ1bmN0aW9uIGlubmVyVHJhbnNsYXRlT2JqZWN0KHJhbmdlLCB0b2tlbiwgb2Zmc2V0WCwgb2Zmc2V0WSkge1xyXG4gICAgdHJhbnNsYXRlT2JqID0gbnVsbDtcclxuICAgIHRyYW5zbGF0ZU9iaiA9IHtcclxuICAgICAgICB0b2tlbjogdG9rZW4sXHJcbiAgICAgICAgYWxsX3RleHQ6IHJhbmdlLnN0YXJ0Q29udGFpbmVyLmRhdGEsXHJcbiAgICAgICAgdXJsOiByYW5nZS5zdGFydENvbnRhaW5lci5vd25lckRvY3VtZW50LmxvY2F0aW9uLmhyZWYsXHJcbiAgICAgICAgb2Zmc2V0OiByYW5nZS5zdGFydE9mZnNldFxyXG4gICAgfTtcclxuICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHsgdHlwZTogJ3NlbmRCYWNrZ3JvdW5kJywgZGF0YTogdHJhbnNsYXRlT2JqIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgIGlmIChyZXNwb25zZS5kYXRhLnN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgICAgIHdvcmRULnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnd29yZC10cmFuc2xhdGUnKTtcclxuICAgICAgICAgICAgbUhlYWRlci5pbnNlcnRCZWZvcmUod29yZFQsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbG9zZU1vZGFsJykpO1xyXG4gICAgICAgICAgICB3b3JkVC5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmRhdGEucmVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIG1Cb2R5LmlubmVySFRNTCA9ICc8dWwgaWQ9XCJsaXN0LXRyYW5zbGF0ZVwiPjwvdWw+JztcclxuICAgICAgICAgICAgICAgIHdvcmRULmlubmVySFRNTCA9ICc8c3Bhbj4nICsgSlNPTi5wYXJzZShyZXNwb25zZS5kYXRhLnJlc1swXS5zb3VyY2VEYXRhKS5rYW5hWzBdLnRleHQgKyAnPC9zcGFuPidcclxuICAgICAgICAgICAgICAgICAgICArICc8aDEgc3R5bGU9XCJmb250LXNpemU6MmVtO3RleHQtYWxpZ246Y2VudGVyO1wiPicgKyByZXNwb25zZS5kYXRhLndvcmQgKyAnPC9oMT4nO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxpc3RUcmFuc2xhdGVfMSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0LXRyYW5zbGF0ZScpO1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UuZGF0YS5yZXMuZm9yRWFjaChmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRyYW5zT2JqID0gSlNPTi5wYXJzZShyZXMuc291cmNlRGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNPYmouc2Vuc2UuZm9yRWFjaChmdW5jdGlvbiAoc2VuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbi5nbG9zcy5mb3JFYWNoKGZ1bmN0aW9uIChnbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdFRyYW5zbGF0ZV8xLmlubmVySFRNTCArPSAnPGxpIHN0eWxlPVwicGFkZGluZy1sZWZ0OjEwcHg7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgIzAwMDtcIj4nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAnPGEgZGF0YS10ZXh0PVwiJyArIGdsLnRleHQgKyAnXCI+JyArIGdsLnRleHQgKyAnPC9hPjwvbGk+JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0LXRyYW5zbGF0ZScpLnN0eWxlLmJvcmRlciA9ICcxcHggc29saWQgIzAwMCc7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdC10cmFuc2xhdGUnKS5zdHlsZS5ib3JkZXJSYWRpdXMgPSAnNXB4JztcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0LXRyYW5zbGF0ZScpLnN0eWxlLmxpc3RTdHlsZSA9ICdub25lJztcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0LXRyYW5zbGF0ZScpLnN0eWxlLnBhZGRpbmcgPSAnMCc7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdC10cmFuc2xhdGUnKS5zdHlsZS5ib3JkZXJCb3R0b20gPSAnbm9uZSc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB3b3JkVC5pbm5lckhUTUwgPSAnPHNwYW4+PC9zcGFuPjxoMSBzdHlsZT1cImZvbnQtc2l6ZToyZW07dGV4dC1hbGlnbjpjZW50ZXI7XCI+JyArIHJlc3BvbnNlLmRhdGEud29yZCArICc8L2gxPic7XHJcbiAgICAgICAgICAgICAgICBtQm9keS5pbm5lckhUTUwgPSAn0J/QtdGA0LXQstC+0LQg0L3QtSDQvdCw0LnQtNC10L0uLi4g0L/QvtC60LAt0YfRgtC+JztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtb2RhbC5zdHlsZS50b3AgPSBwYXJzZUludChvZmZzZXRZKSArIDE1ICsgJ3B4JztcclxuICAgICAgICAgICAgbW9kYWwuc3R5bGUubGVmdCA9ICcwJztcclxuICAgICAgICAgICAgaWYgKHBhcnNlSW50KG9mZnNldFgpIC0gMTUwID4gMCkge1xyXG4gICAgICAgICAgICAgICAgbW9kYWwuc3R5bGUubGVmdCA9IHBhcnNlSW50KG9mZnNldFgpIC0gMTUwICsgJ3B4JztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=