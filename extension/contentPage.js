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
                    createButtonListener();
                }
            }
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
        modal.style.margin = ' 0 auto';
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
        modal.style.margin = ' 0 auto';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vYWxsUGFyYW0uY29uZmlnLmpzIiwid2VicGFjazovLy8uL2Nocm9tZS9zcmMvY29udGVudFBhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDSGE7QUFDYiw4Q0FBOEMsY0FBYztBQUM1RCxhQUFhLG1CQUFPLENBQUMscURBQXlCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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bnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9jaHJvbWUvc3JjL2NvbnRlbnRQYWdlLnRzXCIpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBVUklBcGk6ICdodHRwOi8vbG9jYWxob3N0OjgwOTAvJyxcclxuICAgIFVSSUZyb250OiAnaHR0cDovL2xvY2FsaG9zdDo0MjAwJ1xyXG59O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgY29uZmlnID0gcmVxdWlyZShcIi4vLi4vLi4vYWxsUGFyYW0uY29uZmlnXCIpO1xyXG52YXIgdXNlciA9IG51bGw7XHJcbnZhciBleHRlbnNpb25TZXR0aW5nID0gZmFsc2U7XHJcbnZhciBzZXR0aW5nID0gbnVsbDtcclxudmFyIHN0YXR1c01vZGFsID0gbnVsbDtcclxudmFyIHRyYW5zbGF0ZU9iaiA9IHtcclxuICAgIGFsbF90ZXh0OiBudWxsLFxyXG4gICAgdXJsOiBudWxsLFxyXG4gICAgb2Zmc2V0OiBudWxsXHJcbn07XHJcbnZhciBzZWxlY3RlZE9iaiA9IHtcclxuICAgIHRleHQ6IG51bGwsXHJcbiAgICB1cmw6IG51bGwsXHJcbn07XHJcbnZhciBkaWN0aW9uYXJ5V29yZCA9IHtcclxuICAgIHVzZXJfaWQ6IG51bGwsXHJcbiAgICB3b3JkOiBudWxsLFxyXG4gICAgdHJhbnNsYXRlOiBudWxsLFxyXG4gICAgZGljdGlvbmFyeV9pZDogbnVsbCxcclxuICAgIGNvbnRleHQ6IG51bGwsXHJcbiAgICB1cmw6IG51bGxcclxufTtcclxudmFyIG1vZGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbnZhciBtSGVhZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbnZhciBtQm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG52YXIgd29yZFQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxud2luZG93Lm9ubG9hZCA9IChmdW5jdGlvbiAoZXYpIHtcclxuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbJ3Rva2VuJywgJ3VzZXInXSwgZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgIGlmIChyZXN1bHQuaGFzT3duUHJvcGVydHkoJ3Rva2VuJykgJiYgcmVzdWx0Lmhhc093blByb3BlcnR5KCd1c2VyJykpIHtcclxuICAgICAgICAgICAgdXNlciA9IHJlc3VsdC51c2VyO1xyXG4gICAgICAgICAgICBleHRlbnNpb25TZXR0aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgY3JlYXRlQnV0dG9uTGlzdGVuZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChldi50YXJnZXQuYmFzZVVSSSA9PT0gY29uZmlnLlVSSUZyb250ICsgJy8nKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9rZW4nKTtcclxuICAgICAgICAgICAgICAgIHVzZXIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcicpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRva2VuICE9PSBudWxsICYmIHVzZXIgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7IHR5cGU6ICdzaXRlQXV0aCcsIGRhdGE6IHsgdG9rZW46IHRva2VuLCB1c2VyOiB1c2VyIH0gfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZXh0ZW5zaW9uU2V0dGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlQnV0dG9uTGlzdGVuZXIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59KTtcclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIGlmIChldmVudC5zb3VyY2UgIT09IHdpbmRvdykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGlmIChldmVudC5kYXRhLnR5cGUgJiYgKGV2ZW50LmRhdGEudHlwZSA9PT0gJ0xvZ2luU3VjY2VzcycpICYmIChldmVudC5vcmlnaW4gPT09IGNvbmZpZy5VUklGcm9udCkpIHtcclxuICAgICAgICB2YXIgdG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9rZW4nKTtcclxuICAgICAgICB1c2VyID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXInKTtcclxuICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7IHR5cGU6ICdzaXRlQXV0aCcsIGRhdGE6IHsgdG9rZW46IHRva2VuLCB1c2VyOiB1c2VyIH0gfSk7XHJcbiAgICAgICAgZXh0ZW5zaW9uU2V0dGluZyA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBpZiAoZXZlbnQuZGF0YS50eXBlICYmIChldmVudC5kYXRhLnR5cGUgPT09ICdzYXZlU2V0dGluZ0V4dGVuc2lvbicpICYmIChldmVudC5vcmlnaW4gPT09IGNvbmZpZy5VUklGcm9udCkpIHtcclxuICAgICAgICB2YXIgc2V0dGluZ0V4dGVuc2lvbiA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oZXZlbnQuZGF0YS50ZXh0KSk7XHJcbiAgICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoeyB0eXBlOiAnc2F2ZVNldHRpbmcnLCBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICBzZXR0aW5nRXh0ZW5zaW9uOiBTdHJpbmcoc2V0dGluZ0V4dGVuc2lvbi5leHRlbnNpb25TaG93VHJhbnNsYXRlKVxyXG4gICAgICAgICAgICB9IH0pO1xyXG4gICAgICAgIHNldHRpbmcgPSBTdHJpbmcoc2V0dGluZ0V4dGVuc2lvbi5leHRlbnNpb25TaG93VHJhbnNsYXRlKTtcclxuICAgIH1cclxuICAgIGlmIChldmVudC5kYXRhLnR5cGUgJiYgKGV2ZW50LmRhdGEudHlwZSA9PT0gJ0xvZ291dCcpICYmIChldmVudC5vcmlnaW4gPT09IGNvbmZpZy5VUklGcm9udCkpIHtcclxuICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7IHR5cGU6ICdzaXRlTG9nb3V0JyB9KTtcclxuICAgICAgICBleHRlbnNpb25TZXR0aW5nID0gZmFsc2U7XHJcbiAgICB9XHJcbn0pO1xyXG5mdW5jdGlvbiBjcmVhdGVCdXR0b25MaXN0ZW5lcigpIHtcclxuICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHsgdHlwZTogJ3NldFRvVG9rZW4nLCBkYXRhOiAnJyB9LCBmdW5jdGlvbiAoKSB7IH0pO1xyXG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFsnc2V0dGluZ0V4dGVuc2lvbkFjdGlvbiddLCBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdC5oYXNPd25Qcm9wZXJ0eSgnc2V0dGluZ0V4dGVuc2lvbkFjdGlvbicpKSB7XHJcbiAgICAgICAgICAgIHNldHRpbmcgPSByZXN1bHQuc2V0dGluZ0V4dGVuc2lvbkFjdGlvbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHNldHRpbmcgPSAnZXh0ZW5zaW9uLkRvdWJsZUNsaWNrJztcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBpZiAoc2V0dGluZyA9PT0gJ2V4dGVuc2lvbi5Eb3VibGVDbGljaycpIHtcclxuICAgICAgICAgICAgaWYgKChlLm1ldGFLZXkgPT09IGZhbHNlIHx8IGUuY3RybEtleSA9PT0gZmFsc2UpICYmIGUuc2hpZnRLZXkgPT09IGZhbHNlICYmIGUuYWx0S2V5ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgc3RhdHVzTW9kYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWxUcmFuc2xhdGUnKTtcclxuICAgICAgICAgICAgICAgIGlmIChzdGF0dXNNb2RhbCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZU1vZGFsKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpbm5lclRyYW5zbGF0ZU9iamVjdChkb2N1bWVudC5jYXJldFJhbmdlRnJvbVBvaW50KGUueCwgZS55KSwgdXNlciwgZS5wYWdlWCwgZS5wYWdlWSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHNldHRpbmcgPT09ICdleHRlbnNpb24uRG91YmxlQ2xpY2tDdHJsJykge1xyXG4gICAgICAgICAgICBpZiAoKGUubWV0YUtleSA9PT0gdHJ1ZSB8fCBlLmN0cmxLZXkgPT09IHRydWUpICYmIGUuc2hpZnRLZXkgPT09IGZhbHNlICYmIGUuYWx0S2V5ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgc3RhdHVzTW9kYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWxUcmFuc2xhdGUnKTtcclxuICAgICAgICAgICAgICAgIGlmIChzdGF0dXNNb2RhbCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZU1vZGFsKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpbm5lclRyYW5zbGF0ZU9iamVjdChkb2N1bWVudC5jYXJldFJhbmdlRnJvbVBvaW50KGUueCwgZS55KSwgdXNlciwgZS5wYWdlWCwgZS5wYWdlWSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHNldHRpbmcgPT09ICdleHRlbnNpb24uRG91YmxlQ2xpY2tTaGlmdCcpIHtcclxuICAgICAgICAgICAgaWYgKChlLm1ldGFLZXkgPT09IGZhbHNlIHx8IGUuY3RybEtleSA9PT0gZmFsc2UpICYmIGUuc2hpZnRLZXkgPT09IHRydWUgJiYgZS5hbHRLZXkgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICBzdGF0dXNNb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbFRyYW5zbGF0ZScpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXR1c01vZGFsID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlTW9kYWwoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlubmVyVHJhbnNsYXRlT2JqZWN0KGRvY3VtZW50LmNhcmV0UmFuZ2VGcm9tUG9pbnQoZS54LCBlLnkpLCB1c2VyLCBlLnBhZ2VYLCBlLnBhZ2VZKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc2V0dGluZyA9PT0gJ2V4dGVuc2lvbi5Eb3VibGVDbGlja0FsdCcpIHtcclxuICAgICAgICAgICAgaWYgKChlLm1ldGFLZXkgPT09IGZhbHNlIHx8IGUuY3RybEtleSA9PT0gZmFsc2UpICYmIGUuc2hpZnRLZXkgPT09IGZhbHNlICYmIGUuYWx0S2V5ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBzdGF0dXNNb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbFRyYW5zbGF0ZScpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXR1c01vZGFsID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlTW9kYWwoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlubmVyVHJhbnNsYXRlT2JqZWN0KGRvY3VtZW50LmNhcmV0UmFuZ2VGcm9tUG9pbnQoZS54LCBlLnkpLCB1c2VyLCBlLnBhZ2VYLCBlLnBhZ2VZKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGlmICgoZS5tZXRhS2V5ID09PSB0cnVlIHx8IGUuY3RybEtleSA9PT0gdHJ1ZSkgJiYgZS5zaGlmdEtleSA9PT0gZmFsc2UgJiYgZS5hbHRLZXkgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxlY3RlZFRleHQgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCkudG9TdHJpbmcoKS5yZXBsYWNlKFwiXFxuXCIsICcgJyk7XHJcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZFRleHQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgc3RhdHVzTW9kYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWxUcmFuc2xhdGUnKTtcclxuICAgICAgICAgICAgICAgIGlmIChzdGF0dXNNb2RhbCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZU1vZGFsKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpbm5lclNlbGVjdGVkVHJhbnNsYXRlT2JqZWN0KHNlbGVjdGVkVGV4dCwgd2luZG93LmxvY2F0aW9uLCB1c2VyLCBlLnBhZ2VYLCBlLnBhZ2VZKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIGNyZWF0ZU1vZGFsKCkge1xyXG4gICAgbW9kYWwuc2V0QXR0cmlidXRlKCdpZCcsICdtb2RhbFRyYW5zbGF0ZScpO1xyXG4gICAgbW9kYWwuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xyXG4gICAgbW9kYWwuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcclxuICAgIG1vZGFsLnN0eWxlLmZsZXhGbG93ID0gJ2NvbHVtbic7XHJcbiAgICBtb2RhbC5zdHlsZS56SW5kZXggPSAnOTk5OTk5JztcclxuICAgIG1vZGFsLnN0eWxlLndpZHRoID0gJzMwMHB4JztcclxuICAgIG1vZGFsLnN0eWxlLmhlaWdodCA9ICdhdXRvJztcclxuICAgIG1vZGFsLnN0eWxlLm1heEhlaWdodCA9ICc2MHZoJztcclxuICAgIG1vZGFsLnN0eWxlLmJhY2tncm91bmQgPSAnI2ZmZic7XHJcbiAgICBtb2RhbC5zdHlsZS5ib3JkZXJSYWRpdXMgPSAnMTBweCc7XHJcbiAgICBtb2RhbC5zdHlsZS5wYWRkaW5nID0gJzEwcHgnO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChtb2RhbCk7XHJcbiAgICBtb2RhbC5hcHBlbmRDaGlsZChtSGVhZGVyKTtcclxuICAgIG1vZGFsLmFwcGVuZENoaWxkKG1Cb2R5KTtcclxuICAgIG1IZWFkZXIuc2V0QXR0cmlidXRlKCdpZCcsICdtb2RhbC10cmFuc2xhdGUtaGVhZGVyJyk7XHJcbiAgICBtQm9keS5zZXRBdHRyaWJ1dGUoJ2lkJywgJ21vZGFsLXRyYW5zbGF0ZS1ib2R5Jyk7XHJcbiAgICBtSGVhZGVyLmlubmVySFRNTCA9ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgaWQ9XCJjbG9zZU1vZGFsXCI+PHNwYW4+JnRpbWVzOzwvc3Bhbj48L2J1dHRvbj4nO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nsb3NlTW9kYWwnKS5zdHlsZS5ib3JkZXIgPSAnbm9uZSc7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xvc2VNb2RhbCcpLnN0eWxlLmJhY2tncm91bmQgPSAndHJhbnNwYXJlbnQnO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nsb3NlTW9kYWwnKS5zdHlsZS5wYWRkaW5nID0gJzAuNXJlbSAxcmVtJztcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbG9zZU1vZGFsJykuc3R5bGUuZm9udFNpemUgPSAnMS41cmVtJztcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbG9zZU1vZGFsJykuc3R5bGUuZm9udFdlaWdodCA9ICc3MDAnO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nsb3NlTW9kYWwnKS5zdHlsZS5tYXJnaW5MZWZ0ID0gJ2F1dG8nO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nsb3NlTW9kYWwnKS5vbmNsaWNrID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBtQm9keS5pbm5lckhUTUwgPSAnPHVsIGlkPVwibGlzdC10cmFuc2xhdGVcIj48L3VsPic7XHJcbiAgICAgICAgbW9kYWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgIH0pO1xyXG4gICAgbUhlYWRlci5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xyXG4gICAgbUhlYWRlci5zdHlsZS5mbGV4RmxvdyA9ICdyb3cgbm93cmFwJztcclxuICAgIG1IZWFkZXIuc3R5bGUud2lkdGggPSAnMTAwJSc7XHJcbiAgICBtSGVhZGVyLnN0eWxlLmp1c3RpZnlDb250ZW50ID0gJ3NwYWNlLWJldHdlZW4nO1xyXG4gICAgbUhlYWRlci5zdHlsZS5oZWlnaHQgPSAnNDVweCc7XHJcbiAgICBtQm9keS5zdHlsZS5ib3hTaXppbmcgPSAnYm9yZGVyLWJveCc7XHJcbiAgICBtQm9keS5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xyXG4gICAgbUJvZHkuc3R5bGUub3ZlcmZsb3dZID0gJ3Njcm9sbCc7XHJcbiAgICBtQm9keS5zdHlsZS5mbGV4RmxvdyA9ICdjb2x1bW4gbm93cmFwJztcclxuICAgIG1Cb2R5LnN0eWxlLndpZHRoID0gJzEwMCUnO1xyXG4gICAgbUJvZHkuc3R5bGUucGFkZGluZyA9ICcwIDE1cHgnO1xyXG4gICAgbUJvZHkuc3R5bGUubWFyZ2luID0gJzEwcHggMCc7XHJcbiAgICBtQm9keS5pbm5lckhUTUwgPSAnPHVsIGlkPVwibGlzdC10cmFuc2xhdGVcIj48L3VsPic7XHJcbn1cclxuZnVuY3Rpb24gaW5uZXJTZWxlY3RlZFRyYW5zbGF0ZU9iamVjdChzZWxlY3RlZFRleHQsIHVybFBhZ2UsIHVzZXIsIG9mZnNldFgsIG9mZnNldFkpIHtcclxuICAgIHNlbGVjdGVkT2JqID0gbnVsbDtcclxuICAgIGlmIChleHRlbnNpb25TZXR0aW5nKSB7XHJcbiAgICAgICAgc2VsZWN0ZWRPYmogPSB7XHJcbiAgICAgICAgICAgIHRleHQ6IHNlbGVjdGVkVGV4dCxcclxuICAgICAgICAgICAgdXJsOiB1cmxQYWdlLmhyZWZcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHsgdHlwZTogJ3NlbmRTZWxlY3RlZEJhY2tncm91bmQnLCBkYXRhOiBzZWxlY3RlZE9iaiB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmRhdGEuc3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgd29yZFQuc2V0QXR0cmlidXRlKCdjbGFzcycsICd3b3JkLXRyYW5zbGF0ZScpO1xyXG4gICAgICAgICAgICAgICAgbUhlYWRlci5pbnNlcnRCZWZvcmUod29yZFQsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbG9zZU1vZGFsJykpO1xyXG4gICAgICAgICAgICAgICAgd29yZFQuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuZGF0YS5yZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1Cb2R5LmlubmVySFRNTCA9ICc8dWwgaWQ9XCJsaXN0LXRyYW5zbGF0ZVwiPjwvdWw+JztcclxuICAgICAgICAgICAgICAgICAgICB3b3JkVC5pbm5lckhUTUwgPSAnPHNwYW4+JyArIEpTT04ucGFyc2UocmVzcG9uc2UuZGF0YS5yZXNbMF0uc291cmNlRGF0YSkua2FuYVswXS50ZXh0ICsgJzwvc3Bhbj4nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICsgJzxoMSBzdHlsZT1cImZvbnQtc2l6ZToyZW07dGV4dC1hbGlnbjpjZW50ZXI7XCI+JyArIHJlc3BvbnNlLmRhdGEud29yZCArICc8L2gxPic7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxpc3RUcmFuc2xhdGVfMSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0LXRyYW5zbGF0ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLmRhdGEucmVzLmZvckVhY2goZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdHJhbnNPYmogPSBKU09OLnBhcnNlKHJlcy5zb3VyY2VEYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNPYmouc2Vuc2UuZm9yRWFjaChmdW5jdGlvbiAoc2VuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZW4uZ2xvc3MuZm9yRWFjaChmdW5jdGlvbiAoZ2wpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0VHJhbnNsYXRlXzEuaW5uZXJIVE1MICs9ICc8bGkgc3R5bGU9XCJwYWRkaW5nLWxlZnQ6MTBweDtib3JkZXItYm90dG9tOjFweCBzb2xpZCAjMDAwO1wiPidcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAnPGEgY2xhc3M9XCJ0ZXh0RGljdGlvbmFyeVwiIGRhdGEtd29yZD1cIicgKyByZXNwb25zZS5kYXRhLndvcmRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAnXCIgZGF0YS1pZD1cIicgKyByZXMuaWQgKyAnXCIgZGF0YS10cmFuc2xhdGU9XCInICsgZ2wudGV4dCArICdcIj4nICsgZ2wudGV4dCArICc8L2E+PC9saT4nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBsaXN0RGljdGlvbmFyeV8xID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndGV4dERpY3Rpb25hcnknKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgX2xvb3BfMSA9IGZ1bmN0aW9uIChpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3REaWN0aW9uYXJ5XzFbaV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRUb0RpY3Rpb25hcnkodXNlciwgdHJhbnNsYXRlT2JqLnVybCwgdHJhbnNsYXRlT2JqLmFsbF90ZXh0LCBsaXN0RGljdGlvbmFyeV8xW2ldLmdldEF0dHJpYnV0ZSgnZGF0YS10cmFuc2xhdGUnKSwgbGlzdERpY3Rpb25hcnlfMVtpXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtd29yZCcpLCBsaXN0RGljdGlvbmFyeV8xW2ldLmdldEF0dHJpYnV0ZSgnZGF0YS1pZCcpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3REaWN0aW9uYXJ5XzEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2xvb3BfMShpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3QtdHJhbnNsYXRlJykuc3R5bGUuYm9yZGVyID0gJzFweCBzb2xpZCAjMDAwJztcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdC10cmFuc2xhdGUnKS5zdHlsZS5ib3JkZXJSYWRpdXMgPSAnNXB4JztcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdC10cmFuc2xhdGUnKS5zdHlsZS5saXN0U3R5bGUgPSAnbm9uZSc7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3QtdHJhbnNsYXRlJykuc3R5bGUucGFkZGluZyA9ICcwJztcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdC10cmFuc2xhdGUnKS5zdHlsZS5ib3JkZXJCb3R0b20gPSAnbm9uZSc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB3b3JkVC5pbm5lckhUTUwgPSAnPHNwYW4+PC9zcGFuPjxoMSBzdHlsZT1cImZvbnQtc2l6ZToyZW07dGV4dC1hbGlnbjpjZW50ZXI7XCI+JyArIHJlc3BvbnNlLmRhdGEud29yZCArICc8L2gxPic7XHJcbiAgICAgICAgICAgICAgICAgICAgbUJvZHkuaW5uZXJIVE1MID0gJzxoMz7Qn9C10YDQtdCy0L7QtCDQvdC1INC90LDQudC00LXQvS4uLiDQv9C+0LrQsC3Rh9GC0L48L2gzPic7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBtb2RhbC5zdHlsZS50b3AgPSBwYXJzZUludChvZmZzZXRZKSArIDE1ICsgJ3B4JztcclxuICAgICAgICAgICAgICAgIG1vZGFsLnN0eWxlLmxlZnQgPSAnMCc7XHJcbiAgICAgICAgICAgICAgICBpZiAocGFyc2VJbnQob2Zmc2V0WCkgLSAxNTAgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbW9kYWwuc3R5bGUubGVmdCA9IHBhcnNlSW50KG9mZnNldFgpIC0gMTUwICsgJ3B4JztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIG1Cb2R5LmlubmVySFRNTCA9ICc8aDM+0JTQu9GPINC40YHQv9C+0LvRjNC30L7QstCw0L3QuNGPINGA0LDRgdGI0LjRgNC10L3QuNGPINC90YPQttC90L4g0LDQstGC0L7RgNC40LfQvtCy0LDRgtGM0YHRjyDQsiDRgdC10YDQstC40YHQtS48L2gzPic7XHJcbiAgICAgICAgbW9kYWwuc3R5bGUubWFyZ2luID0gJyAwIGF1dG8nO1xyXG4gICAgICAgIG1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gaW5uZXJUcmFuc2xhdGVPYmplY3QocmFuZ2UsIHVzZXIsIG9mZnNldFgsIG9mZnNldFkpIHtcclxuICAgIHRyYW5zbGF0ZU9iaiA9IG51bGw7XHJcbiAgICBpZiAoZXh0ZW5zaW9uU2V0dGluZykge1xyXG4gICAgICAgIHRyYW5zbGF0ZU9iaiA9IHtcclxuICAgICAgICAgICAgYWxsX3RleHQ6IHJhbmdlLnN0YXJ0Q29udGFpbmVyLmRhdGEsXHJcbiAgICAgICAgICAgIHVybDogcmFuZ2Uuc3RhcnRDb250YWluZXIub3duZXJEb2N1bWVudC5sb2NhdGlvbi5ocmVmLFxyXG4gICAgICAgICAgICBvZmZzZXQ6IHJhbmdlLnN0YXJ0T2Zmc2V0XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7IHR5cGU6ICdzZW5kQmFja2dyb3VuZCcsIGRhdGE6IHRyYW5zbGF0ZU9iaiB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmRhdGEuc3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgd29yZFQuc2V0QXR0cmlidXRlKCdjbGFzcycsICd3b3JkLXRyYW5zbGF0ZScpO1xyXG4gICAgICAgICAgICAgICAgbUhlYWRlci5pbnNlcnRCZWZvcmUod29yZFQsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbG9zZU1vZGFsJykpO1xyXG4gICAgICAgICAgICAgICAgd29yZFQuc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuZGF0YS5yZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1Cb2R5LmlubmVySFRNTCA9ICc8dWwgaWQ9XCJsaXN0LXRyYW5zbGF0ZVwiPjwvdWw+JztcclxuICAgICAgICAgICAgICAgICAgICB3b3JkVC5pbm5lckhUTUwgPSAnPHNwYW4+JyArIEpTT04ucGFyc2UocmVzcG9uc2UuZGF0YS5yZXNbMF0uc291cmNlRGF0YSkua2FuYVswXS50ZXh0ICsgJzwvc3Bhbj4nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICsgJzxoMSBzdHlsZT1cImZvbnQtc2l6ZToyZW07dGV4dC1hbGlnbjpjZW50ZXI7XCI+JyArIHJlc3BvbnNlLmRhdGEud29yZCArICc8L2gxPic7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxpc3RUcmFuc2xhdGVfMiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0LXRyYW5zbGF0ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLmRhdGEucmVzLmZvckVhY2goZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdHJhbnNPYmogPSBKU09OLnBhcnNlKHJlcy5zb3VyY2VEYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNPYmouc2Vuc2UuZm9yRWFjaChmdW5jdGlvbiAoc2VuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZW4uZ2xvc3MuZm9yRWFjaChmdW5jdGlvbiAoZ2wpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0VHJhbnNsYXRlXzIuaW5uZXJIVE1MICs9ICc8bGkgc3R5bGU9XCJwYWRkaW5nLWxlZnQ6MTBweDtib3JkZXItYm90dG9tOjFweCBzb2xpZCAjMDAwO1wiPidcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAnPGEgY2xhc3M9XCJ0ZXh0RGljdGlvbmFyeVwiIGRhdGEtd29yZD1cIicgKyByZXNwb25zZS5kYXRhLndvcmRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAnXCIgZGF0YS1pZD1cIicgKyByZXMuaWQgKyAnXCIgZGF0YS10cmFuc2xhdGU9XCInICsgZ2wudGV4dCArICdcIj4nICsgZ2wudGV4dCArICc8L2E+PC9saT4nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBsaXN0RGljdGlvbmFyeV8yID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndGV4dERpY3Rpb25hcnknKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgX2xvb3BfMiA9IGZ1bmN0aW9uIChpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3REaWN0aW9uYXJ5XzJbaV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRUb0RpY3Rpb25hcnkodXNlciwgdHJhbnNsYXRlT2JqLnVybCwgdHJhbnNsYXRlT2JqLmFsbF90ZXh0LCBsaXN0RGljdGlvbmFyeV8yW2ldLmdldEF0dHJpYnV0ZSgnZGF0YS10cmFuc2xhdGUnKSwgbGlzdERpY3Rpb25hcnlfMltpXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtd29yZCcpLCBsaXN0RGljdGlvbmFyeV8yW2ldLmdldEF0dHJpYnV0ZSgnZGF0YS1pZCcpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3REaWN0aW9uYXJ5XzIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2xvb3BfMihpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3QtdHJhbnNsYXRlJykuc3R5bGUuYm9yZGVyID0gJzFweCBzb2xpZCAjMDAwJztcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdC10cmFuc2xhdGUnKS5zdHlsZS5ib3JkZXJSYWRpdXMgPSAnNXB4JztcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdC10cmFuc2xhdGUnKS5zdHlsZS5saXN0U3R5bGUgPSAnbm9uZSc7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3QtdHJhbnNsYXRlJykuc3R5bGUucGFkZGluZyA9ICcwJztcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdC10cmFuc2xhdGUnKS5zdHlsZS5ib3JkZXJCb3R0b20gPSAnbm9uZSc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB3b3JkVC5pbm5lckhUTUwgPSAnPHNwYW4+PC9zcGFuPjxoMSBzdHlsZT1cImZvbnQtc2l6ZToyZW07dGV4dC1hbGlnbjpjZW50ZXI7XCI+JyArIHJlc3BvbnNlLmRhdGEud29yZCArICc8L2gxPic7XHJcbiAgICAgICAgICAgICAgICAgICAgbUJvZHkuaW5uZXJIVE1MID0gJzxoMz7Qn9C10YDQtdCy0L7QtCDQvdC1INC90LDQudC00LXQvS4uLiDQv9C+0LrQsC3Rh9GC0L48L2gzPic7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBtb2RhbC5zdHlsZS5sZWZ0ID0gJzAnO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhcnNlSW50KG9mZnNldFgpIC0gMTUwID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1vZGFsLnN0eWxlLmxlZnQgPSBwYXJzZUludChvZmZzZXRYKSAtIDE1MCArICdweCc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBtb2RhbC5zdHlsZS50b3AgPSBwYXJzZUludChvZmZzZXRZKSArIDE1ICsgJ3B4JztcclxuICAgICAgICAgICAgICAgIG1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIG1Cb2R5LmlubmVySFRNTCA9ICc8aDM+0JTQu9GPINC40YHQv9C+0LvRjNC30L7QstCw0L3QuNGPINGA0LDRgdGI0LjRgNC10L3QuNGPINC90YPQttC90L4g0LDQstGC0L7RgNC40LfQvtCy0LDRgtGM0YHRjyDQsiDRgdC10YDQstC40YHQtS48L2gzPic7XHJcbiAgICAgICAgbW9kYWwuc3R5bGUubWFyZ2luID0gJyAwIGF1dG8nO1xyXG4gICAgICAgIG1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gYWRkVG9EaWN0aW9uYXJ5KHVzZXIsIHVybCwgYWxsVGV4dCwgdHJhbnNsYXRlLCB3b3JkLCBkaWN0aW9uYXJ5X2lkKSB7XHJcbiAgICBkaWN0aW9uYXJ5V29yZCA9IG51bGw7XHJcbiAgICBkaWN0aW9uYXJ5V29yZCA9IHtcclxuICAgICAgICB1c2VyX2lkOiB1c2VyLmlkLFxyXG4gICAgICAgIHdvcmQ6IHdvcmQsXHJcbiAgICAgICAgdHJhbnNsYXRlOiB0cmFuc2xhdGUsXHJcbiAgICAgICAgZGljdGlvbmFyeV9pZDogcGFyc2VJbnQoZGljdGlvbmFyeV9pZCksXHJcbiAgICAgICAgY29udGV4dDogYWxsVGV4dCxcclxuICAgICAgICB1cmw6IHVybFxyXG4gICAgfTtcclxuICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHsgdHlwZTogJ3NlbmRUb0RpY3Rpb25hcnknLCBkYXRhOiBkaWN0aW9uYXJ5V29yZCB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICBhbGVydChyZXNwb25zZS5kYXRhLnRleHQpO1xyXG4gICAgfSk7XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==