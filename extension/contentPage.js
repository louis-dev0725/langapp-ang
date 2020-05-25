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
var user = null;
var extensionSetting = false;
var setting = null;
var statusModal = null;
var translateObj = {
    all_text: null,
    url: null,
    offset: null
};
var selectedObj = {
    text: null,
    url: null,
};
var dictionaryWord = {
    user_id: null,
    word: null,
    translate: null,
    dictionary_id: null,
    context: null,
    url: null
};
var modal = document.createElement('div');
var mHeader = document.createElement('div');
var mBody = document.createElement('div');
var wordT = document.createElement('div');
window.onload = (function (ev) {
    chrome.storage.local.get(['token', 'user'], function (result) {
        if (result.hasOwnProperty('token') && result.hasOwnProperty('user')) {
            user = result.user;
            extensionSetting = true;
            createButtonListener();
        }
        else {
            if (ev.target.baseURI === config.URIFront + '/') {
                var token = localStorage.getItem('token');
                user = localStorage.getItem('user');
                if (token !== null && user !== null) {
                    chrome.runtime.sendMessage({ type: 'siteAuth', data: { token: token, user: user } });
                    extensionSetting = true;
                }
            }
            createButtonListener();
        }
    });
});
window.addEventListener('message', function (event) {
    if (event.source !== window) {
        return;
    }
    if (event.data.type && (event.data.type === 'LoginSuccess') && (event.origin === config.URIFront)) {
        var token = localStorage.getItem('token');
        user = localStorage.getItem('user');
        chrome.runtime.sendMessage({ type: 'siteAuth', data: { token: token, user: user } });
        extensionSetting = true;
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
        extensionSetting = false;
    }
});
function createButtonListener() {
    chrome.runtime.sendMessage({ type: 'setToToken', data: '' }, function () { });
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
                innerTranslateObject(document.caretRangeFromPoint(e.x, e.y), user, e.pageX, e.pageY);
            }
        }
        if (setting === 'extension.DoubleClickCtrl') {
            if ((e.metaKey === true || e.ctrlKey === true) && e.shiftKey === false && e.altKey === false) {
                statusModal = document.getElementById('modalTranslate');
                if (statusModal === null) {
                    createModal();
                }
                innerTranslateObject(document.caretRangeFromPoint(e.x, e.y), user, e.pageX, e.pageY);
            }
        }
        if (setting === 'extension.DoubleClickShift') {
            if ((e.metaKey === false || e.ctrlKey === false) && e.shiftKey === true && e.altKey === false) {
                statusModal = document.getElementById('modalTranslate');
                if (statusModal === null) {
                    createModal();
                }
                innerTranslateObject(document.caretRangeFromPoint(e.x, e.y), user, e.pageX, e.pageY);
            }
        }
        if (setting === 'extension.DoubleClickAlt') {
            if ((e.metaKey === false || e.ctrlKey === false) && e.shiftKey === false && e.altKey === true) {
                statusModal = document.getElementById('modalTranslate');
                if (statusModal === null) {
                    createModal();
                }
                innerTranslateObject(document.caretRangeFromPoint(e.x, e.y), user, e.pageX, e.pageY);
            }
        }
    });
    document.addEventListener('click', function (e) {
        if ((e.metaKey === true || e.ctrlKey === true) && e.shiftKey === false && e.altKey === false) {
            var selectedText = window.getSelection().toString().replace("\n", ' ');
            if (selectedText.length > 0) {
                statusModal = document.getElementById('modalTranslate');
                if (statusModal === null) {
                    createModal();
                }
                innerSelectedTranslateObject(selectedText, window.location, user, e.pageX, e.pageY);
            }
        }
    });
}
function createModal() {
    modal.setAttribute('id', 'modalTranslate');
    modal.style.position = 'absolute';
    modal.style.display = 'flex';
    modal.style.flexFlow = 'column';
    modal.style.zIndex = '999999';
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
    document.getElementById('closeModal').onclick = (function () {
        mBody.innerHTML = '<ul id="list-translate"></ul>';
        modal.style.display = 'none';
    });
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
}
function innerSelectedTranslateObject(selectedText, urlPage, user, offsetX, offsetY) {
    selectedObj = null;
    if (extensionSetting) {
        selectedObj = {
            text: selectedText,
            url: urlPage.href
        };
        chrome.runtime.sendMessage({ type: 'sendSelectedBackground', data: selectedObj }, function (response) {
            if (response.data.success) {
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
                                    + '<a class="textDictionary" data-word="' + response.data.word
                                    + '" data-id="' + res.id + '" data-translate="' + gl.text + '">' + gl.text + '</a></li>';
                            });
                        });
                    });
                    var listDictionary_1 = document.getElementsByClassName('textDictionary');
                    var _loop_1 = function (i) {
                        listDictionary_1[i].addEventListener('click', function () {
                            addToDictionary(user, translateObj.url, translateObj.all_text, listDictionary_1[i].getAttribute('data-translate'), listDictionary_1[i].getAttribute('data-word'), listDictionary_1[i].getAttribute('data-id'));
                        });
                    };
                    for (var i = 0; i < listDictionary_1.length; i++) {
                        _loop_1(i);
                    }
                    document.getElementById('list-translate').style.border = '1px solid #000';
                    document.getElementById('list-translate').style.borderRadius = '5px';
                    document.getElementById('list-translate').style.listStyle = 'none';
                    document.getElementById('list-translate').style.padding = '0';
                    document.getElementById('list-translate').style.borderBottom = 'none';
                }
                else {
                    wordT.innerHTML = '<span></span><h1 style="font-size:2em;text-align:center;">' + response.data.word + '</h1>';
                    mBody.innerHTML = '<h3>Перевод не найден... пока-что</h3>';
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
    else {
        mBody.innerHTML = '<h3>Для использования расширения нужно авторизоваться в сервисе.</h3>';
        modal.style.left = (window.innerWidth / 2 - 150) + 'px';
        modal.style.top = '200px';
        modal.style.display = 'flex';
    }
}
function innerTranslateObject(range, user, offsetX, offsetY) {
    translateObj = null;
    if (extensionSetting) {
        translateObj = {
            all_text: range.startContainer.data,
            url: range.startContainer.ownerDocument.location.href,
            offset: range.startOffset
        };
        chrome.runtime.sendMessage({ type: 'sendBackground', data: translateObj }, function (response) {
            if (response.data.success) {
                wordT.setAttribute('class', 'word-translate');
                mHeader.insertBefore(wordT, document.getElementById('closeModal'));
                wordT.style.textAlign = 'center';
                if (response.data.res.length > 0) {
                    mBody.innerHTML = '<ul id="list-translate"></ul>';
                    wordT.innerHTML = '<span>' + JSON.parse(response.data.res[0].sourceData).kana[0].text + '</span>'
                        + '<h1 style="font-size:2em;text-align:center;">' + response.data.word + '</h1>';
                    var listTranslate_2 = document.getElementById('list-translate');
                    response.data.res.forEach(function (res) {
                        var transObj = JSON.parse(res.sourceData);
                        transObj.sense.forEach(function (sen) {
                            sen.gloss.forEach(function (gl) {
                                listTranslate_2.innerHTML += '<li style="padding-left:10px;border-bottom:1px solid #000;">'
                                    + '<a class="textDictionary" data-word="' + response.data.word
                                    + '" data-id="' + res.id + '" data-translate="' + gl.text + '">' + gl.text + '</a></li>';
                            });
                        });
                    });
                    var listDictionary_2 = document.getElementsByClassName('textDictionary');
                    var _loop_2 = function (i) {
                        listDictionary_2[i].addEventListener('click', function () {
                            addToDictionary(user, translateObj.url, translateObj.all_text, listDictionary_2[i].getAttribute('data-translate'), listDictionary_2[i].getAttribute('data-word'), listDictionary_2[i].getAttribute('data-id'));
                        });
                    };
                    for (var i = 0; i < listDictionary_2.length; i++) {
                        _loop_2(i);
                    }
                    document.getElementById('list-translate').style.border = '1px solid #000';
                    document.getElementById('list-translate').style.borderRadius = '5px';
                    document.getElementById('list-translate').style.listStyle = 'none';
                    document.getElementById('list-translate').style.padding = '0';
                    document.getElementById('list-translate').style.borderBottom = 'none';
                }
                else {
                    wordT.innerHTML = '<span></span><h1 style="font-size:2em;text-align:center;">' + response.data.word + '</h1>';
                    mBody.innerHTML = '<h3>Перевод не найден... пока-что</h3>';
                }
                modal.style.left = '0';
                if (parseInt(offsetX) - 150 > 0) {
                    modal.style.left = parseInt(offsetX) - 150 + 'px';
                }
                modal.style.top = parseInt(offsetY) + 15 + 'px';
                modal.style.display = 'flex';
            }
        });
    }
    else {
        mBody.innerHTML = '<h3>Для использования расширения нужно авторизоваться в сервисе.</h3>';
        modal.style.left = (window.innerWidth / 2 - 150) + 'px';
        modal.style.top = '200px';
        modal.style.display = 'flex';
    }
}
function addToDictionary(user, url, allText, translate, word, dictionary_id) {
    dictionaryWord = null;
    dictionaryWord = {
        user_id: user.id,
        word: word,
        translate: translate,
        dictionary_id: parseInt(dictionary_id),
        context: allText,
        url: url
    };
    chrome.runtime.sendMessage({ type: 'sendToDictionary', data: dictionaryWord }, function (response) {
        alert(response.data.text);
    });
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vYWxsUGFyYW0uY29uZmlnLmpzIiwid2VicGFjazovLy8uL2Nocm9tZS9zcmMvY29udGVudFBhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDSGE7QUFDYiw4Q0FBOEMsY0FBYztBQUM1RCxhQUFhLG1CQUFPLENBQUMscURBQXlCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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dXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vY2hyb21lL3NyYy9jb250ZW50UGFnZS50c1wiKTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgVVJJQXBpOiAnaHR0cDovL2xvY2FsaG9zdDo4MDkwLycsXHJcbiAgICBVUklGcm9udDogJ2h0dHA6Ly9sb2NhbGhvc3Q6NDIwMCdcclxufTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGNvbmZpZyA9IHJlcXVpcmUoXCIuLy4uLy4uL2FsbFBhcmFtLmNvbmZpZ1wiKTtcclxudmFyIHVzZXIgPSBudWxsO1xyXG52YXIgZXh0ZW5zaW9uU2V0dGluZyA9IGZhbHNlO1xyXG52YXIgc2V0dGluZyA9IG51bGw7XHJcbnZhciBzdGF0dXNNb2RhbCA9IG51bGw7XHJcbnZhciB0cmFuc2xhdGVPYmogPSB7XHJcbiAgICBhbGxfdGV4dDogbnVsbCxcclxuICAgIHVybDogbnVsbCxcclxuICAgIG9mZnNldDogbnVsbFxyXG59O1xyXG52YXIgc2VsZWN0ZWRPYmogPSB7XHJcbiAgICB0ZXh0OiBudWxsLFxyXG4gICAgdXJsOiBudWxsLFxyXG59O1xyXG52YXIgZGljdGlvbmFyeVdvcmQgPSB7XHJcbiAgICB1c2VyX2lkOiBudWxsLFxyXG4gICAgd29yZDogbnVsbCxcclxuICAgIHRyYW5zbGF0ZTogbnVsbCxcclxuICAgIGRpY3Rpb25hcnlfaWQ6IG51bGwsXHJcbiAgICBjb250ZXh0OiBudWxsLFxyXG4gICAgdXJsOiBudWxsXHJcbn07XHJcbnZhciBtb2RhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG52YXIgbUhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG52YXIgbUJvZHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxudmFyIHdvcmRUID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbndpbmRvdy5vbmxvYWQgPSAoZnVuY3Rpb24gKGV2KSB7XHJcbiAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoWyd0b2tlbicsICd1c2VyJ10sIGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICBpZiAocmVzdWx0Lmhhc093blByb3BlcnR5KCd0b2tlbicpICYmIHJlc3VsdC5oYXNPd25Qcm9wZXJ0eSgndXNlcicpKSB7XHJcbiAgICAgICAgICAgIHVzZXIgPSByZXN1bHQudXNlcjtcclxuICAgICAgICAgICAgZXh0ZW5zaW9uU2V0dGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIGNyZWF0ZUJ1dHRvbkxpc3RlbmVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoZXYudGFyZ2V0LmJhc2VVUkkgPT09IGNvbmZpZy5VUklGcm9udCArICcvJykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Rva2VuJyk7XHJcbiAgICAgICAgICAgICAgICB1c2VyID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXInKTtcclxuICAgICAgICAgICAgICAgIGlmICh0b2tlbiAhPT0gbnVsbCAmJiB1c2VyICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoeyB0eXBlOiAnc2l0ZUF1dGgnLCBkYXRhOiB7IHRva2VuOiB0b2tlbiwgdXNlcjogdXNlciB9IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGV4dGVuc2lvblNldHRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNyZWF0ZUJ1dHRvbkxpc3RlbmVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn0pO1xyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgaWYgKGV2ZW50LnNvdXJjZSAhPT0gd2luZG93KSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaWYgKGV2ZW50LmRhdGEudHlwZSAmJiAoZXZlbnQuZGF0YS50eXBlID09PSAnTG9naW5TdWNjZXNzJykgJiYgKGV2ZW50Lm9yaWdpbiA9PT0gY29uZmlnLlVSSUZyb250KSkge1xyXG4gICAgICAgIHZhciB0b2tlbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b2tlbicpO1xyXG4gICAgICAgIHVzZXIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcicpO1xyXG4gICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHsgdHlwZTogJ3NpdGVBdXRoJywgZGF0YTogeyB0b2tlbjogdG9rZW4sIHVzZXI6IHVzZXIgfSB9KTtcclxuICAgICAgICBleHRlbnNpb25TZXR0aW5nID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIGlmIChldmVudC5kYXRhLnR5cGUgJiYgKGV2ZW50LmRhdGEudHlwZSA9PT0gJ3NhdmVTZXR0aW5nRXh0ZW5zaW9uJykgJiYgKGV2ZW50Lm9yaWdpbiA9PT0gY29uZmlnLlVSSUZyb250KSkge1xyXG4gICAgICAgIHZhciBzZXR0aW5nRXh0ZW5zaW9uID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShldmVudC5kYXRhLnRleHQpKTtcclxuICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7IHR5cGU6ICdzYXZlU2V0dGluZycsIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgIHNldHRpbmdFeHRlbnNpb246IFN0cmluZyhzZXR0aW5nRXh0ZW5zaW9uLmV4dGVuc2lvblNob3dUcmFuc2xhdGUpXHJcbiAgICAgICAgICAgIH0gfSk7XHJcbiAgICAgICAgc2V0dGluZyA9IFN0cmluZyhzZXR0aW5nRXh0ZW5zaW9uLmV4dGVuc2lvblNob3dUcmFuc2xhdGUpO1xyXG4gICAgfVxyXG4gICAgaWYgKGV2ZW50LmRhdGEudHlwZSAmJiAoZXZlbnQuZGF0YS50eXBlID09PSAnTG9nb3V0JykgJiYgKGV2ZW50Lm9yaWdpbiA9PT0gY29uZmlnLlVSSUZyb250KSkge1xyXG4gICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHsgdHlwZTogJ3NpdGVMb2dvdXQnIH0pO1xyXG4gICAgICAgIGV4dGVuc2lvblNldHRpbmcgPSBmYWxzZTtcclxuICAgIH1cclxufSk7XHJcbmZ1bmN0aW9uIGNyZWF0ZUJ1dHRvbkxpc3RlbmVyKCkge1xyXG4gICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoeyB0eXBlOiAnc2V0VG9Ub2tlbicsIGRhdGE6ICcnIH0sIGZ1bmN0aW9uICgpIHsgfSk7XHJcbiAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoWydzZXR0aW5nRXh0ZW5zaW9uQWN0aW9uJ10sIGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICBpZiAocmVzdWx0Lmhhc093blByb3BlcnR5KCdzZXR0aW5nRXh0ZW5zaW9uQWN0aW9uJykpIHtcclxuICAgICAgICAgICAgc2V0dGluZyA9IHJlc3VsdC5zZXR0aW5nRXh0ZW5zaW9uQWN0aW9uO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgc2V0dGluZyA9ICdleHRlbnNpb24uRG91YmxlQ2xpY2snO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZGJsY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGlmIChzZXR0aW5nID09PSAnZXh0ZW5zaW9uLkRvdWJsZUNsaWNrJykge1xyXG4gICAgICAgICAgICBpZiAoKGUubWV0YUtleSA9PT0gZmFsc2UgfHwgZS5jdHJsS2V5ID09PSBmYWxzZSkgJiYgZS5zaGlmdEtleSA9PT0gZmFsc2UgJiYgZS5hbHRLZXkgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICBzdGF0dXNNb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbFRyYW5zbGF0ZScpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXR1c01vZGFsID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlTW9kYWwoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlubmVyVHJhbnNsYXRlT2JqZWN0KGRvY3VtZW50LmNhcmV0UmFuZ2VGcm9tUG9pbnQoZS54LCBlLnkpLCB1c2VyLCBlLnBhZ2VYLCBlLnBhZ2VZKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc2V0dGluZyA9PT0gJ2V4dGVuc2lvbi5Eb3VibGVDbGlja0N0cmwnKSB7XHJcbiAgICAgICAgICAgIGlmICgoZS5tZXRhS2V5ID09PSB0cnVlIHx8IGUuY3RybEtleSA9PT0gdHJ1ZSkgJiYgZS5zaGlmdEtleSA9PT0gZmFsc2UgJiYgZS5hbHRLZXkgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICBzdGF0dXNNb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbFRyYW5zbGF0ZScpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXR1c01vZGFsID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlTW9kYWwoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlubmVyVHJhbnNsYXRlT2JqZWN0KGRvY3VtZW50LmNhcmV0UmFuZ2VGcm9tUG9pbnQoZS54LCBlLnkpLCB1c2VyLCBlLnBhZ2VYLCBlLnBhZ2VZKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc2V0dGluZyA9PT0gJ2V4dGVuc2lvbi5Eb3VibGVDbGlja1NoaWZ0Jykge1xyXG4gICAgICAgICAgICBpZiAoKGUubWV0YUtleSA9PT0gZmFsc2UgfHwgZS5jdHJsS2V5ID09PSBmYWxzZSkgJiYgZS5zaGlmdEtleSA9PT0gdHJ1ZSAmJiBlLmFsdEtleSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIHN0YXR1c01vZGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsVHJhbnNsYXRlJyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhdHVzTW9kYWwgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVNb2RhbCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaW5uZXJUcmFuc2xhdGVPYmplY3QoZG9jdW1lbnQuY2FyZXRSYW5nZUZyb21Qb2ludChlLngsIGUueSksIHVzZXIsIGUucGFnZVgsIGUucGFnZVkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzZXR0aW5nID09PSAnZXh0ZW5zaW9uLkRvdWJsZUNsaWNrQWx0Jykge1xyXG4gICAgICAgICAgICBpZiAoKGUubWV0YUtleSA9PT0gZmFsc2UgfHwgZS5jdHJsS2V5ID09PSBmYWxzZSkgJiYgZS5zaGlmdEtleSA9PT0gZmFsc2UgJiYgZS5hbHRLZXkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHN0YXR1c01vZGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsVHJhbnNsYXRlJyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhdHVzTW9kYWwgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVNb2RhbCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaW5uZXJUcmFuc2xhdGVPYmplY3QoZG9jdW1lbnQuY2FyZXRSYW5nZUZyb21Qb2ludChlLngsIGUueSksIHVzZXIsIGUucGFnZVgsIGUucGFnZVkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgaWYgKChlLm1ldGFLZXkgPT09IHRydWUgfHwgZS5jdHJsS2V5ID09PSB0cnVlKSAmJiBlLnNoaWZ0S2V5ID09PSBmYWxzZSAmJiBlLmFsdEtleSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGVjdGVkVGV4dCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKS50b1N0cmluZygpLnJlcGxhY2UoXCJcXG5cIiwgJyAnKTtcclxuICAgICAgICAgICAgaWYgKHNlbGVjdGVkVGV4dC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBzdGF0dXNNb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbFRyYW5zbGF0ZScpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXR1c01vZGFsID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlTW9kYWwoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlubmVyU2VsZWN0ZWRUcmFuc2xhdGVPYmplY3Qoc2VsZWN0ZWRUZXh0LCB3aW5kb3cubG9jYXRpb24sIHVzZXIsIGUucGFnZVgsIGUucGFnZVkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuZnVuY3Rpb24gY3JlYXRlTW9kYWwoKSB7XHJcbiAgICBtb2RhbC5zZXRBdHRyaWJ1dGUoJ2lkJywgJ21vZGFsVHJhbnNsYXRlJyk7XHJcbiAgICBtb2RhbC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XHJcbiAgICBtb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xyXG4gICAgbW9kYWwuc3R5bGUuZmxleEZsb3cgPSAnY29sdW1uJztcclxuICAgIG1vZGFsLnN0eWxlLnpJbmRleCA9ICc5OTk5OTknO1xyXG4gICAgbW9kYWwuc3R5bGUud2lkdGggPSAnMzAwcHgnO1xyXG4gICAgbW9kYWwuc3R5bGUuaGVpZ2h0ID0gJ2F1dG8nO1xyXG4gICAgbW9kYWwuc3R5bGUubWF4SGVpZ2h0ID0gJzYwdmgnO1xyXG4gICAgbW9kYWwuc3R5bGUuYmFja2dyb3VuZCA9ICcjZmZmJztcclxuICAgIG1vZGFsLnN0eWxlLmJvcmRlclJhZGl1cyA9ICcxMHB4JztcclxuICAgIG1vZGFsLnN0eWxlLnBhZGRpbmcgPSAnMTBweCc7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG1vZGFsKTtcclxuICAgIG1vZGFsLmFwcGVuZENoaWxkKG1IZWFkZXIpO1xyXG4gICAgbW9kYWwuYXBwZW5kQ2hpbGQobUJvZHkpO1xyXG4gICAgbUhlYWRlci5zZXRBdHRyaWJ1dGUoJ2lkJywgJ21vZGFsLXRyYW5zbGF0ZS1oZWFkZXInKTtcclxuICAgIG1Cb2R5LnNldEF0dHJpYnV0ZSgnaWQnLCAnbW9kYWwtdHJhbnNsYXRlLWJvZHknKTtcclxuICAgIG1IZWFkZXIuaW5uZXJIVE1MID0gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBpZD1cImNsb3NlTW9kYWxcIj48c3Bhbj4mdGltZXM7PC9zcGFuPjwvYnV0dG9uPic7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xvc2VNb2RhbCcpLnN0eWxlLmJvcmRlciA9ICdub25lJztcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbG9zZU1vZGFsJykuc3R5bGUuYmFja2dyb3VuZCA9ICd0cmFuc3BhcmVudCc7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xvc2VNb2RhbCcpLnN0eWxlLnBhZGRpbmcgPSAnMC41cmVtIDFyZW0nO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nsb3NlTW9kYWwnKS5zdHlsZS5mb250U2l6ZSA9ICcxLjVyZW0nO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nsb3NlTW9kYWwnKS5zdHlsZS5mb250V2VpZ2h0ID0gJzcwMCc7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xvc2VNb2RhbCcpLnN0eWxlLm1hcmdpbkxlZnQgPSAnYXV0byc7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xvc2VNb2RhbCcpLm9uY2xpY2sgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIG1Cb2R5LmlubmVySFRNTCA9ICc8dWwgaWQ9XCJsaXN0LXRyYW5zbGF0ZVwiPjwvdWw+JztcclxuICAgICAgICBtb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgfSk7XHJcbiAgICBtSGVhZGVyLnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XHJcbiAgICBtSGVhZGVyLnN0eWxlLmZsZXhGbG93ID0gJ3JvdyBub3dyYXAnO1xyXG4gICAgbUhlYWRlci5zdHlsZS53aWR0aCA9ICcxMDAlJztcclxuICAgIG1IZWFkZXIuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSAnc3BhY2UtYmV0d2Vlbic7XHJcbiAgICBtSGVhZGVyLnN0eWxlLmhlaWdodCA9ICc0NXB4JztcclxuICAgIG1Cb2R5LnN0eWxlLmJveFNpemluZyA9ICdib3JkZXItYm94JztcclxuICAgIG1Cb2R5LnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XHJcbiAgICBtQm9keS5zdHlsZS5vdmVyZmxvd1kgPSAnc2Nyb2xsJztcclxuICAgIG1Cb2R5LnN0eWxlLmZsZXhGbG93ID0gJ2NvbHVtbiBub3dyYXAnO1xyXG4gICAgbUJvZHkuc3R5bGUud2lkdGggPSAnMTAwJSc7XHJcbiAgICBtQm9keS5zdHlsZS5wYWRkaW5nID0gJzAgMTVweCc7XHJcbiAgICBtQm9keS5zdHlsZS5tYXJnaW4gPSAnMTBweCAwJztcclxuICAgIG1Cb2R5LmlubmVySFRNTCA9ICc8dWwgaWQ9XCJsaXN0LXRyYW5zbGF0ZVwiPjwvdWw+JztcclxufVxyXG5mdW5jdGlvbiBpbm5lclNlbGVjdGVkVHJhbnNsYXRlT2JqZWN0KHNlbGVjdGVkVGV4dCwgdXJsUGFnZSwgdXNlciwgb2Zmc2V0WCwgb2Zmc2V0WSkge1xyXG4gICAgc2VsZWN0ZWRPYmogPSBudWxsO1xyXG4gICAgaWYgKGV4dGVuc2lvblNldHRpbmcpIHtcclxuICAgICAgICBzZWxlY3RlZE9iaiA9IHtcclxuICAgICAgICAgICAgdGV4dDogc2VsZWN0ZWRUZXh0LFxyXG4gICAgICAgICAgICB1cmw6IHVybFBhZ2UuaHJlZlxyXG4gICAgICAgIH07XHJcbiAgICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoeyB0eXBlOiAnc2VuZFNlbGVjdGVkQmFja2dyb3VuZCcsIGRhdGE6IHNlbGVjdGVkT2JqIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2UuZGF0YS5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICB3b3JkVC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3dvcmQtdHJhbnNsYXRlJyk7XHJcbiAgICAgICAgICAgICAgICBtSGVhZGVyLmluc2VydEJlZm9yZSh3b3JkVCwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nsb3NlTW9kYWwnKSk7XHJcbiAgICAgICAgICAgICAgICB3b3JkVC5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcclxuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5kYXRhLnJlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbUJvZHkuaW5uZXJIVE1MID0gJzx1bCBpZD1cImxpc3QtdHJhbnNsYXRlXCI+PC91bD4nO1xyXG4gICAgICAgICAgICAgICAgICAgIHdvcmRULmlubmVySFRNTCA9ICc8c3Bhbj4nICsgSlNPTi5wYXJzZShyZXNwb25zZS5kYXRhLnJlc1swXS5zb3VyY2VEYXRhKS5rYW5hWzBdLnRleHQgKyAnPC9zcGFuPidcclxuICAgICAgICAgICAgICAgICAgICAgICAgKyAnPGgxIHN0eWxlPVwiZm9udC1zaXplOjJlbTt0ZXh0LWFsaWduOmNlbnRlcjtcIj4nICsgcmVzcG9uc2UuZGF0YS53b3JkICsgJzwvaDE+JztcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbGlzdFRyYW5zbGF0ZV8xID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3QtdHJhbnNsYXRlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UuZGF0YS5yZXMuZm9yRWFjaChmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0cmFuc09iaiA9IEpTT04ucGFyc2UocmVzLnNvdXJjZURhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc09iai5zZW5zZS5mb3JFYWNoKGZ1bmN0aW9uIChzZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbi5nbG9zcy5mb3JFYWNoKGZ1bmN0aW9uIChnbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3RUcmFuc2xhdGVfMS5pbm5lckhUTUwgKz0gJzxsaSBzdHlsZT1cInBhZGRpbmctbGVmdDoxMHB4O2JvcmRlci1ib3R0b206MXB4IHNvbGlkICMwMDA7XCI+J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArICc8YSBjbGFzcz1cInRleHREaWN0aW9uYXJ5XCIgZGF0YS13b3JkPVwiJyArIHJlc3BvbnNlLmRhdGEud29yZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArICdcIiBkYXRhLWlkPVwiJyArIHJlcy5pZCArICdcIiBkYXRhLXRyYW5zbGF0ZT1cIicgKyBnbC50ZXh0ICsgJ1wiPicgKyBnbC50ZXh0ICsgJzwvYT48L2xpPic7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxpc3REaWN0aW9uYXJ5XzEgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0ZXh0RGljdGlvbmFyeScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBfbG9vcF8xID0gZnVuY3Rpb24gKGkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdERpY3Rpb25hcnlfMVtpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZFRvRGljdGlvbmFyeSh1c2VyLCB0cmFuc2xhdGVPYmoudXJsLCB0cmFuc2xhdGVPYmouYWxsX3RleHQsIGxpc3REaWN0aW9uYXJ5XzFbaV0uZ2V0QXR0cmlidXRlKCdkYXRhLXRyYW5zbGF0ZScpLCBsaXN0RGljdGlvbmFyeV8xW2ldLmdldEF0dHJpYnV0ZSgnZGF0YS13b3JkJyksIGxpc3REaWN0aW9uYXJ5XzFbaV0uZ2V0QXR0cmlidXRlKCdkYXRhLWlkJykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdERpY3Rpb25hcnlfMS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfbG9vcF8xKGkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdC10cmFuc2xhdGUnKS5zdHlsZS5ib3JkZXIgPSAnMXB4IHNvbGlkICMwMDAnO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0LXRyYW5zbGF0ZScpLnN0eWxlLmJvcmRlclJhZGl1cyA9ICc1cHgnO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0LXRyYW5zbGF0ZScpLnN0eWxlLmxpc3RTdHlsZSA9ICdub25lJztcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdC10cmFuc2xhdGUnKS5zdHlsZS5wYWRkaW5nID0gJzAnO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0LXRyYW5zbGF0ZScpLnN0eWxlLmJvcmRlckJvdHRvbSA9ICdub25lJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHdvcmRULmlubmVySFRNTCA9ICc8c3Bhbj48L3NwYW4+PGgxIHN0eWxlPVwiZm9udC1zaXplOjJlbTt0ZXh0LWFsaWduOmNlbnRlcjtcIj4nICsgcmVzcG9uc2UuZGF0YS53b3JkICsgJzwvaDE+JztcclxuICAgICAgICAgICAgICAgICAgICBtQm9keS5pbm5lckhUTUwgPSAnPGgzPtCf0LXRgNC10LLQvtC0INC90LUg0L3QsNC50LTQtdC9Li4uINC/0L7QutCwLdGH0YLQvjwvaDM+JztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG1vZGFsLnN0eWxlLnRvcCA9IHBhcnNlSW50KG9mZnNldFkpICsgMTUgKyAncHgnO1xyXG4gICAgICAgICAgICAgICAgbW9kYWwuc3R5bGUubGVmdCA9ICcwJztcclxuICAgICAgICAgICAgICAgIGlmIChwYXJzZUludChvZmZzZXRYKSAtIDE1MCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBtb2RhbC5zdHlsZS5sZWZ0ID0gcGFyc2VJbnQob2Zmc2V0WCkgLSAxNTAgKyAncHgnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbW9kYWwuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgbUJvZHkuaW5uZXJIVE1MID0gJzxoMz7QlNC70Y8g0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdC40Y8g0YDQsNGB0YjQuNGA0LXQvdC40Y8g0L3Rg9C20L3QviDQsNCy0YLQvtGA0LjQt9C+0LLQsNGC0YzRgdGPINCyINGB0LXRgNCy0LjRgdC1LjwvaDM+JztcclxuICAgICAgICBtb2RhbC5zdHlsZS5sZWZ0ID0gKHdpbmRvdy5pbm5lcldpZHRoIC8gMiAtIDE1MCkgKyAncHgnO1xyXG4gICAgICAgIG1vZGFsLnN0eWxlLnRvcCA9ICcyMDBweCc7XHJcbiAgICAgICAgbW9kYWwuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBpbm5lclRyYW5zbGF0ZU9iamVjdChyYW5nZSwgdXNlciwgb2Zmc2V0WCwgb2Zmc2V0WSkge1xyXG4gICAgdHJhbnNsYXRlT2JqID0gbnVsbDtcclxuICAgIGlmIChleHRlbnNpb25TZXR0aW5nKSB7XHJcbiAgICAgICAgdHJhbnNsYXRlT2JqID0ge1xyXG4gICAgICAgICAgICBhbGxfdGV4dDogcmFuZ2Uuc3RhcnRDb250YWluZXIuZGF0YSxcclxuICAgICAgICAgICAgdXJsOiByYW5nZS5zdGFydENvbnRhaW5lci5vd25lckRvY3VtZW50LmxvY2F0aW9uLmhyZWYsXHJcbiAgICAgICAgICAgIG9mZnNldDogcmFuZ2Uuc3RhcnRPZmZzZXRcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHsgdHlwZTogJ3NlbmRCYWNrZ3JvdW5kJywgZGF0YTogdHJhbnNsYXRlT2JqIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2UuZGF0YS5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICB3b3JkVC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3dvcmQtdHJhbnNsYXRlJyk7XHJcbiAgICAgICAgICAgICAgICBtSGVhZGVyLmluc2VydEJlZm9yZSh3b3JkVCwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nsb3NlTW9kYWwnKSk7XHJcbiAgICAgICAgICAgICAgICB3b3JkVC5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcclxuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5kYXRhLnJlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbUJvZHkuaW5uZXJIVE1MID0gJzx1bCBpZD1cImxpc3QtdHJhbnNsYXRlXCI+PC91bD4nO1xyXG4gICAgICAgICAgICAgICAgICAgIHdvcmRULmlubmVySFRNTCA9ICc8c3Bhbj4nICsgSlNPTi5wYXJzZShyZXNwb25zZS5kYXRhLnJlc1swXS5zb3VyY2VEYXRhKS5rYW5hWzBdLnRleHQgKyAnPC9zcGFuPidcclxuICAgICAgICAgICAgICAgICAgICAgICAgKyAnPGgxIHN0eWxlPVwiZm9udC1zaXplOjJlbTt0ZXh0LWFsaWduOmNlbnRlcjtcIj4nICsgcmVzcG9uc2UuZGF0YS53b3JkICsgJzwvaDE+JztcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbGlzdFRyYW5zbGF0ZV8yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3QtdHJhbnNsYXRlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UuZGF0YS5yZXMuZm9yRWFjaChmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0cmFuc09iaiA9IEpTT04ucGFyc2UocmVzLnNvdXJjZURhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc09iai5zZW5zZS5mb3JFYWNoKGZ1bmN0aW9uIChzZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbi5nbG9zcy5mb3JFYWNoKGZ1bmN0aW9uIChnbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3RUcmFuc2xhdGVfMi5pbm5lckhUTUwgKz0gJzxsaSBzdHlsZT1cInBhZGRpbmctbGVmdDoxMHB4O2JvcmRlci1ib3R0b206MXB4IHNvbGlkICMwMDA7XCI+J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArICc8YSBjbGFzcz1cInRleHREaWN0aW9uYXJ5XCIgZGF0YS13b3JkPVwiJyArIHJlc3BvbnNlLmRhdGEud29yZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArICdcIiBkYXRhLWlkPVwiJyArIHJlcy5pZCArICdcIiBkYXRhLXRyYW5zbGF0ZT1cIicgKyBnbC50ZXh0ICsgJ1wiPicgKyBnbC50ZXh0ICsgJzwvYT48L2xpPic7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxpc3REaWN0aW9uYXJ5XzIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0ZXh0RGljdGlvbmFyeScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBfbG9vcF8yID0gZnVuY3Rpb24gKGkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdERpY3Rpb25hcnlfMltpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZFRvRGljdGlvbmFyeSh1c2VyLCB0cmFuc2xhdGVPYmoudXJsLCB0cmFuc2xhdGVPYmouYWxsX3RleHQsIGxpc3REaWN0aW9uYXJ5XzJbaV0uZ2V0QXR0cmlidXRlKCdkYXRhLXRyYW5zbGF0ZScpLCBsaXN0RGljdGlvbmFyeV8yW2ldLmdldEF0dHJpYnV0ZSgnZGF0YS13b3JkJyksIGxpc3REaWN0aW9uYXJ5XzJbaV0uZ2V0QXR0cmlidXRlKCdkYXRhLWlkJykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdERpY3Rpb25hcnlfMi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfbG9vcF8yKGkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdC10cmFuc2xhdGUnKS5zdHlsZS5ib3JkZXIgPSAnMXB4IHNvbGlkICMwMDAnO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0LXRyYW5zbGF0ZScpLnN0eWxlLmJvcmRlclJhZGl1cyA9ICc1cHgnO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0LXRyYW5zbGF0ZScpLnN0eWxlLmxpc3RTdHlsZSA9ICdub25lJztcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdC10cmFuc2xhdGUnKS5zdHlsZS5wYWRkaW5nID0gJzAnO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0LXRyYW5zbGF0ZScpLnN0eWxlLmJvcmRlckJvdHRvbSA9ICdub25lJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHdvcmRULmlubmVySFRNTCA9ICc8c3Bhbj48L3NwYW4+PGgxIHN0eWxlPVwiZm9udC1zaXplOjJlbTt0ZXh0LWFsaWduOmNlbnRlcjtcIj4nICsgcmVzcG9uc2UuZGF0YS53b3JkICsgJzwvaDE+JztcclxuICAgICAgICAgICAgICAgICAgICBtQm9keS5pbm5lckhUTUwgPSAnPGgzPtCf0LXRgNC10LLQvtC0INC90LUg0L3QsNC50LTQtdC9Li4uINC/0L7QutCwLdGH0YLQvjwvaDM+JztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG1vZGFsLnN0eWxlLmxlZnQgPSAnMCc7XHJcbiAgICAgICAgICAgICAgICBpZiAocGFyc2VJbnQob2Zmc2V0WCkgLSAxNTAgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbW9kYWwuc3R5bGUubGVmdCA9IHBhcnNlSW50KG9mZnNldFgpIC0gMTUwICsgJ3B4JztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG1vZGFsLnN0eWxlLnRvcCA9IHBhcnNlSW50KG9mZnNldFkpICsgMTUgKyAncHgnO1xyXG4gICAgICAgICAgICAgICAgbW9kYWwuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgbUJvZHkuaW5uZXJIVE1MID0gJzxoMz7QlNC70Y8g0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdC40Y8g0YDQsNGB0YjQuNGA0LXQvdC40Y8g0L3Rg9C20L3QviDQsNCy0YLQvtGA0LjQt9C+0LLQsNGC0YzRgdGPINCyINGB0LXRgNCy0LjRgdC1LjwvaDM+JztcclxuICAgICAgICBtb2RhbC5zdHlsZS5sZWZ0ID0gKHdpbmRvdy5pbm5lcldpZHRoIC8gMiAtIDE1MCkgKyAncHgnO1xyXG4gICAgICAgIG1vZGFsLnN0eWxlLnRvcCA9ICcyMDBweCc7XHJcbiAgICAgICAgbW9kYWwuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBhZGRUb0RpY3Rpb25hcnkodXNlciwgdXJsLCBhbGxUZXh0LCB0cmFuc2xhdGUsIHdvcmQsIGRpY3Rpb25hcnlfaWQpIHtcclxuICAgIGRpY3Rpb25hcnlXb3JkID0gbnVsbDtcclxuICAgIGRpY3Rpb25hcnlXb3JkID0ge1xyXG4gICAgICAgIHVzZXJfaWQ6IHVzZXIuaWQsXHJcbiAgICAgICAgd29yZDogd29yZCxcclxuICAgICAgICB0cmFuc2xhdGU6IHRyYW5zbGF0ZSxcclxuICAgICAgICBkaWN0aW9uYXJ5X2lkOiBwYXJzZUludChkaWN0aW9uYXJ5X2lkKSxcclxuICAgICAgICBjb250ZXh0OiBhbGxUZXh0LFxyXG4gICAgICAgIHVybDogdXJsXHJcbiAgICB9O1xyXG4gICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoeyB0eXBlOiAnc2VuZFRvRGljdGlvbmFyeScsIGRhdGE6IGRpY3Rpb25hcnlXb3JkIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgIGFsZXJ0KHJlc3BvbnNlLmRhdGEudGV4dCk7XHJcbiAgICB9KTtcclxufVxyXG4iXSwic291cmNlUm9vdCI6IiJ9