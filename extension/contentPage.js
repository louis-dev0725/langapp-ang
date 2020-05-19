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
var token = null;
var user = null;
var extensionSetting = false;
var setting = null;
var statusModal = null;
var translateObj = {
    token: null,
    all_text: null,
    url: null,
    offset: null
};
var selectedObj = {
    token: null,
    text: null,
    url: null,
};
var dictionaryWord = {
    token: null,
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
            token = result.token;
            user = result.user;
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
});
window.addEventListener('message', function (event) {
    if (event.source !== window) {
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
                    innerTranslateObject(document.caretRangeFromPoint(e.x, e.y), token, user, e.pageX, e.pageY);
                }
            }
            if (setting === 'extension.DoubleClickCtrl') {
                if ((e.metaKey === true || e.ctrlKey === true) && e.shiftKey === false && e.altKey === false) {
                    statusModal = document.getElementById('modalTranslate');
                    if (statusModal === null) {
                        createModal();
                    }
                    innerTranslateObject(document.caretRangeFromPoint(e.x, e.y), token, user, e.pageX, e.pageY);
                }
            }
            if (setting === 'extension.DoubleClickShift') {
                if ((e.metaKey === false || e.ctrlKey === false) && e.shiftKey === true && e.altKey === false) {
                    statusModal = document.getElementById('modalTranslate');
                    if (statusModal === null) {
                        createModal();
                    }
                    innerTranslateObject(document.caretRangeFromPoint(e.x, e.y), token, user, e.pageX, e.pageY);
                }
            }
            if (setting === 'extension.DoubleClickAlt') {
                if ((e.metaKey === false || e.ctrlKey === false) && e.shiftKey === false && e.altKey === true) {
                    statusModal = document.getElementById('modalTranslate');
                    if (statusModal === null) {
                        createModal();
                    }
                    innerTranslateObject(document.caretRangeFromPoint(e.x, e.y), token, user, e.pageX, e.pageY);
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
                    innerSelectedTranslateObject(selectedText, window.location, token, user, e.pageX, e.pageY);
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
function innerSelectedTranslateObject(selectedText, urlPage, token, user, offsetX, offsetY) {
    selectedObj = null;
    selectedObj = {
        token: token,
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
                        addToDictionary(translateObj.token, user, translateObj.url, translateObj.all_text, listDictionary_1[i].getAttribute('data-translate'), listDictionary_1[i].getAttribute('data-word'), listDictionary_1[i].getAttribute('data-id'));
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
function innerTranslateObject(range, token, user, offsetX, offsetY) {
    translateObj = null;
    translateObj = {
        token: token,
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
                        addToDictionary(translateObj.token, user, translateObj.url, translateObj.all_text, listDictionary_2[i].getAttribute('data-translate'), listDictionary_2[i].getAttribute('data-word'), listDictionary_2[i].getAttribute('data-id'));
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
            modal.style.top = parseInt(offsetY) + 15 + 'px';
            modal.style.left = '0';
            if (parseInt(offsetX) - 150 > 0) {
                modal.style.left = parseInt(offsetX) - 150 + 'px';
            }
            modal.style.display = 'flex';
        }
    });
}
function addToDictionary(token, user, url, allText, translate, word, dictionary_id) {
    dictionaryWord = null;
    dictionaryWord = {
        token: token,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vYWxsUGFyYW0uY29uZmlnLmpzIiwid2VicGFjazovLy8uL2Nocm9tZS9zcmMvY29udGVudFBhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDSGE7QUFDYiw4Q0FBOEMsY0FBYztBQUM1RCxhQUFhLG1CQUFPLENBQUMscURBQXlCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRCwwQkFBMEIsMkJBQTJCLEVBQUU7QUFDdkc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsMEJBQTBCLDJCQUEyQixFQUFFO0FBQzNGO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQztBQUNwQztBQUNBLGFBQWEsRUFBRTtBQUNmO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxxQkFBcUI7QUFDekQ7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwRkFBMEY7QUFDMUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyxvREFBb0Q7QUFDcEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0Qsa0JBQWtCO0FBQ2xFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1RkFBdUYsNkJBQTZCO0FBQ3BIO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekIscUJBQXFCO0FBQ3JCLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBLCtCQUErQiw2QkFBNkI7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUVBQXlFLGtCQUFrQjtBQUMzRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLDZDQUE2QztBQUM3RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRCxrQkFBa0I7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVGQUF1Riw2QkFBNkI7QUFDcEg7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QixxQkFBcUI7QUFDckIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0EsK0JBQStCLDZCQUE2QjtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5RUFBeUUsa0JBQWtCO0FBQzNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MsaURBQWlEO0FBQ2pGO0FBQ0EsS0FBSztBQUNMIiwiZmlsZSI6ImNvbnRlbnRQYWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9jaHJvbWUvc3JjL2NvbnRlbnRQYWdlLnRzXCIpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBVUklBcGk6ICdodHRwOi8vbG9jYWxob3N0OjgwOTAvJyxcclxuICAgIFVSSUZyb250OiAnaHR0cDovL2xvY2FsaG9zdDo0MjAwJ1xyXG59O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgY29uZmlnID0gcmVxdWlyZShcIi4vLi4vLi4vYWxsUGFyYW0uY29uZmlnXCIpO1xyXG52YXIgdG9rZW4gPSBudWxsO1xyXG52YXIgdXNlciA9IG51bGw7XHJcbnZhciBleHRlbnNpb25TZXR0aW5nID0gZmFsc2U7XHJcbnZhciBzZXR0aW5nID0gbnVsbDtcclxudmFyIHN0YXR1c01vZGFsID0gbnVsbDtcclxudmFyIHRyYW5zbGF0ZU9iaiA9IHtcclxuICAgIHRva2VuOiBudWxsLFxyXG4gICAgYWxsX3RleHQ6IG51bGwsXHJcbiAgICB1cmw6IG51bGwsXHJcbiAgICBvZmZzZXQ6IG51bGxcclxufTtcclxudmFyIHNlbGVjdGVkT2JqID0ge1xyXG4gICAgdG9rZW46IG51bGwsXHJcbiAgICB0ZXh0OiBudWxsLFxyXG4gICAgdXJsOiBudWxsLFxyXG59O1xyXG52YXIgZGljdGlvbmFyeVdvcmQgPSB7XHJcbiAgICB0b2tlbjogbnVsbCxcclxuICAgIHVzZXJfaWQ6IG51bGwsXHJcbiAgICB3b3JkOiBudWxsLFxyXG4gICAgdHJhbnNsYXRlOiBudWxsLFxyXG4gICAgZGljdGlvbmFyeV9pZDogbnVsbCxcclxuICAgIGNvbnRleHQ6IG51bGwsXHJcbiAgICB1cmw6IG51bGxcclxufTtcclxudmFyIG1vZGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbnZhciBtSGVhZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbnZhciBtQm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG52YXIgd29yZFQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxud2luZG93Lm9ubG9hZCA9IChmdW5jdGlvbiAoZXYpIHtcclxuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbJ3Rva2VuJywgJ3VzZXInXSwgZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgIGlmIChyZXN1bHQuaGFzT3duUHJvcGVydHkoJ3Rva2VuJykgJiYgcmVzdWx0Lmhhc093blByb3BlcnR5KCd1c2VyJykpIHtcclxuICAgICAgICAgICAgdG9rZW4gPSByZXN1bHQudG9rZW47XHJcbiAgICAgICAgICAgIHVzZXIgPSByZXN1bHQudXNlcjtcclxuICAgICAgICAgICAgZXh0ZW5zaW9uU2V0dGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIGNyZWF0ZUJ1dHRvbkxpc3RlbmVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoZXYudGFyZ2V0LmJhc2VVUkkgPT09IGNvbmZpZy5VUklGcm9udCArICcvJykge1xyXG4gICAgICAgICAgICAgICAgdG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9rZW4nKTtcclxuICAgICAgICAgICAgICAgIHVzZXIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcicpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRva2VuICE9PSBudWxsICYmIHVzZXIgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7IHR5cGU6ICdzaXRlQXV0aCcsIGRhdGE6IHsgdG9rZW46IHRva2VuLCB1c2VyOiB1c2VyIH0gfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZXh0ZW5zaW9uU2V0dGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlQnV0dG9uTGlzdGVuZXIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59KTtcclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIGlmIChldmVudC5zb3VyY2UgIT09IHdpbmRvdykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGlmIChldmVudC5kYXRhLnR5cGUgJiYgKGV2ZW50LmRhdGEudHlwZSA9PT0gJ0xvZ2luU3VjY2VzcycpICYmIChldmVudC5vcmlnaW4gPT09IGNvbmZpZy5VUklGcm9udCkpIHtcclxuICAgICAgICB0b2tlbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b2tlbicpO1xyXG4gICAgICAgIHVzZXIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcicpO1xyXG4gICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHsgdHlwZTogJ3NpdGVBdXRoJywgZGF0YTogeyB0b2tlbjogdG9rZW4sIHVzZXI6IHVzZXIgfSB9KTtcclxuICAgIH1cclxuICAgIGlmIChldmVudC5kYXRhLnR5cGUgJiYgKGV2ZW50LmRhdGEudHlwZSA9PT0gJ3NhdmVTZXR0aW5nRXh0ZW5zaW9uJykgJiYgKGV2ZW50Lm9yaWdpbiA9PT0gY29uZmlnLlVSSUZyb250KSkge1xyXG4gICAgICAgIHZhciBzZXR0aW5nRXh0ZW5zaW9uID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShldmVudC5kYXRhLnRleHQpKTtcclxuICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7IHR5cGU6ICdzYXZlU2V0dGluZycsIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgIHNldHRpbmdFeHRlbnNpb246IFN0cmluZyhzZXR0aW5nRXh0ZW5zaW9uLmV4dGVuc2lvblNob3dUcmFuc2xhdGUpXHJcbiAgICAgICAgICAgIH0gfSk7XHJcbiAgICAgICAgc2V0dGluZyA9IFN0cmluZyhzZXR0aW5nRXh0ZW5zaW9uLmV4dGVuc2lvblNob3dUcmFuc2xhdGUpO1xyXG4gICAgfVxyXG4gICAgaWYgKGV2ZW50LmRhdGEudHlwZSAmJiAoZXZlbnQuZGF0YS50eXBlID09PSAnTG9nb3V0JykgJiYgKGV2ZW50Lm9yaWdpbiA9PT0gY29uZmlnLlVSSUZyb250KSkge1xyXG4gICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHsgdHlwZTogJ3NpdGVMb2dvdXQnIH0pO1xyXG4gICAgfVxyXG59KTtcclxuZnVuY3Rpb24gY3JlYXRlQnV0dG9uTGlzdGVuZXIoKSB7XHJcbiAgICBpZiAoZXh0ZW5zaW9uU2V0dGluZykge1xyXG4gICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbJ3NldHRpbmdFeHRlbnNpb25BY3Rpb24nXSwgZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0Lmhhc093blByb3BlcnR5KCdzZXR0aW5nRXh0ZW5zaW9uQWN0aW9uJykpIHtcclxuICAgICAgICAgICAgICAgIHNldHRpbmcgPSByZXN1bHQuc2V0dGluZ0V4dGVuc2lvbkFjdGlvbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNldHRpbmcgPSAnZXh0ZW5zaW9uLkRvdWJsZUNsaWNrJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgaWYgKHNldHRpbmcgPT09ICdleHRlbnNpb24uRG91YmxlQ2xpY2snKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoKGUubWV0YUtleSA9PT0gZmFsc2UgfHwgZS5jdHJsS2V5ID09PSBmYWxzZSkgJiYgZS5zaGlmdEtleSA9PT0gZmFsc2UgJiYgZS5hbHRLZXkgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzTW9kYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWxUcmFuc2xhdGUnKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdHVzTW9kYWwgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlTW9kYWwoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaW5uZXJUcmFuc2xhdGVPYmplY3QoZG9jdW1lbnQuY2FyZXRSYW5nZUZyb21Qb2ludChlLngsIGUueSksIHRva2VuLCB1c2VyLCBlLnBhZ2VYLCBlLnBhZ2VZKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoc2V0dGluZyA9PT0gJ2V4dGVuc2lvbi5Eb3VibGVDbGlja0N0cmwnKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoKGUubWV0YUtleSA9PT0gdHJ1ZSB8fCBlLmN0cmxLZXkgPT09IHRydWUpICYmIGUuc2hpZnRLZXkgPT09IGZhbHNlICYmIGUuYWx0S2V5ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1c01vZGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsVHJhbnNsYXRlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXR1c01vZGFsID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZU1vZGFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlubmVyVHJhbnNsYXRlT2JqZWN0KGRvY3VtZW50LmNhcmV0UmFuZ2VGcm9tUG9pbnQoZS54LCBlLnkpLCB0b2tlbiwgdXNlciwgZS5wYWdlWCwgZS5wYWdlWSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHNldHRpbmcgPT09ICdleHRlbnNpb24uRG91YmxlQ2xpY2tTaGlmdCcpIHtcclxuICAgICAgICAgICAgICAgIGlmICgoZS5tZXRhS2V5ID09PSBmYWxzZSB8fCBlLmN0cmxLZXkgPT09IGZhbHNlKSAmJiBlLnNoaWZ0S2V5ID09PSB0cnVlICYmIGUuYWx0S2V5ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1c01vZGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsVHJhbnNsYXRlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXR1c01vZGFsID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZU1vZGFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlubmVyVHJhbnNsYXRlT2JqZWN0KGRvY3VtZW50LmNhcmV0UmFuZ2VGcm9tUG9pbnQoZS54LCBlLnkpLCB0b2tlbiwgdXNlciwgZS5wYWdlWCwgZS5wYWdlWSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHNldHRpbmcgPT09ICdleHRlbnNpb24uRG91YmxlQ2xpY2tBbHQnKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoKGUubWV0YUtleSA9PT0gZmFsc2UgfHwgZS5jdHJsS2V5ID09PSBmYWxzZSkgJiYgZS5zaGlmdEtleSA9PT0gZmFsc2UgJiYgZS5hbHRLZXkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBzdGF0dXNNb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbFRyYW5zbGF0ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGF0dXNNb2RhbCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVNb2RhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpbm5lclRyYW5zbGF0ZU9iamVjdChkb2N1bWVudC5jYXJldFJhbmdlRnJvbVBvaW50KGUueCwgZS55KSwgdG9rZW4sIHVzZXIsIGUucGFnZVgsIGUucGFnZVkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBpZiAoKGUubWV0YUtleSA9PT0gdHJ1ZSB8fCBlLmN0cmxLZXkgPT09IHRydWUpICYmIGUuc2hpZnRLZXkgPT09IGZhbHNlICYmIGUuYWx0S2V5ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdGVkVGV4dCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKS50b1N0cmluZygpLnJlcGxhY2UoXCJcXG5cIiwgJyAnKTtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZFRleHQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1c01vZGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsVHJhbnNsYXRlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXR1c01vZGFsID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZU1vZGFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlubmVyU2VsZWN0ZWRUcmFuc2xhdGVPYmplY3Qoc2VsZWN0ZWRUZXh0LCB3aW5kb3cubG9jYXRpb24sIHRva2VuLCB1c2VyLCBlLnBhZ2VYLCBlLnBhZ2VZKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGNyZWF0ZU1vZGFsKCkge1xyXG4gICAgbW9kYWwuc2V0QXR0cmlidXRlKCdpZCcsICdtb2RhbFRyYW5zbGF0ZScpO1xyXG4gICAgbW9kYWwuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xyXG4gICAgbW9kYWwuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcclxuICAgIG1vZGFsLnN0eWxlLmZsZXhGbG93ID0gJ2NvbHVtbic7XHJcbiAgICBtb2RhbC5zdHlsZS56SW5kZXggPSAnOTk5OTk5JztcclxuICAgIG1vZGFsLnN0eWxlLndpZHRoID0gJzMwMHB4JztcclxuICAgIG1vZGFsLnN0eWxlLmhlaWdodCA9ICdhdXRvJztcclxuICAgIG1vZGFsLnN0eWxlLm1heEhlaWdodCA9ICc2MHZoJztcclxuICAgIG1vZGFsLnN0eWxlLmJhY2tncm91bmQgPSAnI2ZmZic7XHJcbiAgICBtb2RhbC5zdHlsZS5ib3JkZXJSYWRpdXMgPSAnMTBweCc7XHJcbiAgICBtb2RhbC5zdHlsZS5wYWRkaW5nID0gJzEwcHgnO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChtb2RhbCk7XHJcbiAgICBtb2RhbC5hcHBlbmRDaGlsZChtSGVhZGVyKTtcclxuICAgIG1vZGFsLmFwcGVuZENoaWxkKG1Cb2R5KTtcclxuICAgIG1IZWFkZXIuc2V0QXR0cmlidXRlKCdpZCcsICdtb2RhbC10cmFuc2xhdGUtaGVhZGVyJyk7XHJcbiAgICBtQm9keS5zZXRBdHRyaWJ1dGUoJ2lkJywgJ21vZGFsLXRyYW5zbGF0ZS1ib2R5Jyk7XHJcbiAgICBtSGVhZGVyLmlubmVySFRNTCA9ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgaWQ9XCJjbG9zZU1vZGFsXCI+PHNwYW4+JnRpbWVzOzwvc3Bhbj48L2J1dHRvbj4nO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nsb3NlTW9kYWwnKS5zdHlsZS5ib3JkZXIgPSAnbm9uZSc7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xvc2VNb2RhbCcpLnN0eWxlLmJhY2tncm91bmQgPSAndHJhbnNwYXJlbnQnO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nsb3NlTW9kYWwnKS5zdHlsZS5wYWRkaW5nID0gJzAuNXJlbSAxcmVtJztcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbG9zZU1vZGFsJykuc3R5bGUuZm9udFNpemUgPSAnMS41cmVtJztcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbG9zZU1vZGFsJykuc3R5bGUuZm9udFdlaWdodCA9ICc3MDAnO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nsb3NlTW9kYWwnKS5zdHlsZS5tYXJnaW5MZWZ0ID0gJ2F1dG8nO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nsb3NlTW9kYWwnKS5vbmNsaWNrID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBtQm9keS5pbm5lckhUTUwgPSAnPHVsIGlkPVwibGlzdC10cmFuc2xhdGVcIj48L3VsPic7XHJcbiAgICAgICAgbW9kYWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgIH0pO1xyXG4gICAgbUhlYWRlci5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xyXG4gICAgbUhlYWRlci5zdHlsZS5mbGV4RmxvdyA9ICdyb3cgbm93cmFwJztcclxuICAgIG1IZWFkZXIuc3R5bGUud2lkdGggPSAnMTAwJSc7XHJcbiAgICBtSGVhZGVyLnN0eWxlLmp1c3RpZnlDb250ZW50ID0gJ3NwYWNlLWJldHdlZW4nO1xyXG4gICAgbUhlYWRlci5zdHlsZS5oZWlnaHQgPSAnNDVweCc7XHJcbiAgICBtQm9keS5zdHlsZS5ib3hTaXppbmcgPSAnYm9yZGVyLWJveCc7XHJcbiAgICBtQm9keS5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xyXG4gICAgbUJvZHkuc3R5bGUub3ZlcmZsb3dZID0gJ3Njcm9sbCc7XHJcbiAgICBtQm9keS5zdHlsZS5mbGV4RmxvdyA9ICdjb2x1bW4gbm93cmFwJztcclxuICAgIG1Cb2R5LnN0eWxlLndpZHRoID0gJzEwMCUnO1xyXG4gICAgbUJvZHkuc3R5bGUucGFkZGluZyA9ICcwIDE1cHgnO1xyXG4gICAgbUJvZHkuc3R5bGUubWFyZ2luID0gJzEwcHggMCc7XHJcbiAgICBtQm9keS5pbm5lckhUTUwgPSAnPHVsIGlkPVwibGlzdC10cmFuc2xhdGVcIj48L3VsPic7XHJcbn1cclxuZnVuY3Rpb24gaW5uZXJTZWxlY3RlZFRyYW5zbGF0ZU9iamVjdChzZWxlY3RlZFRleHQsIHVybFBhZ2UsIHRva2VuLCB1c2VyLCBvZmZzZXRYLCBvZmZzZXRZKSB7XHJcbiAgICBzZWxlY3RlZE9iaiA9IG51bGw7XHJcbiAgICBzZWxlY3RlZE9iaiA9IHtcclxuICAgICAgICB0b2tlbjogdG9rZW4sXHJcbiAgICAgICAgdGV4dDogc2VsZWN0ZWRUZXh0LFxyXG4gICAgICAgIHVybDogdXJsUGFnZS5ocmVmXHJcbiAgICB9O1xyXG4gICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoeyB0eXBlOiAnc2VuZFNlbGVjdGVkQmFja2dyb3VuZCcsIGRhdGE6IHNlbGVjdGVkT2JqIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgIGlmIChyZXNwb25zZS5kYXRhLnN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgd29yZFQuc2V0QXR0cmlidXRlKCdjbGFzcycsICd3b3JkLXRyYW5zbGF0ZScpO1xyXG4gICAgICAgICAgICBtSGVhZGVyLmluc2VydEJlZm9yZSh3b3JkVCwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nsb3NlTW9kYWwnKSk7XHJcbiAgICAgICAgICAgIHdvcmRULnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2UuZGF0YS5yZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgbUJvZHkuaW5uZXJIVE1MID0gJzx1bCBpZD1cImxpc3QtdHJhbnNsYXRlXCI+PC91bD4nO1xyXG4gICAgICAgICAgICAgICAgd29yZFQuaW5uZXJIVE1MID0gJzxzcGFuPicgKyBKU09OLnBhcnNlKHJlc3BvbnNlLmRhdGEucmVzWzBdLnNvdXJjZURhdGEpLmthbmFbMF0udGV4dCArICc8L3NwYW4+J1xyXG4gICAgICAgICAgICAgICAgICAgICsgJzxoMSBzdHlsZT1cImZvbnQtc2l6ZToyZW07dGV4dC1hbGlnbjpjZW50ZXI7XCI+JyArIHJlc3BvbnNlLmRhdGEud29yZCArICc8L2gxPic7XHJcbiAgICAgICAgICAgICAgICB2YXIgbGlzdFRyYW5zbGF0ZV8xID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3QtdHJhbnNsYXRlJyk7XHJcbiAgICAgICAgICAgICAgICByZXNwb25zZS5kYXRhLnJlcy5mb3JFYWNoKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdHJhbnNPYmogPSBKU09OLnBhcnNlKHJlcy5zb3VyY2VEYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICB0cmFuc09iai5zZW5zZS5mb3JFYWNoKGZ1bmN0aW9uIChzZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VuLmdsb3NzLmZvckVhY2goZnVuY3Rpb24gKGdsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0VHJhbnNsYXRlXzEuaW5uZXJIVE1MICs9ICc8bGkgc3R5bGU9XCJwYWRkaW5nLWxlZnQ6MTBweDtib3JkZXItYm90dG9tOjFweCBzb2xpZCAjMDAwO1wiPidcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArICc8YSBjbGFzcz1cInRleHREaWN0aW9uYXJ5XCIgZGF0YS13b3JkPVwiJyArIHJlc3BvbnNlLmRhdGEud29yZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgJ1wiIGRhdGEtaWQ9XCInICsgcmVzLmlkICsgJ1wiIGRhdGEtdHJhbnNsYXRlPVwiJyArIGdsLnRleHQgKyAnXCI+JyArIGdsLnRleHQgKyAnPC9hPjwvbGk+JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHZhciBsaXN0RGljdGlvbmFyeV8xID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndGV4dERpY3Rpb25hcnknKTtcclxuICAgICAgICAgICAgICAgIHZhciBfbG9vcF8xID0gZnVuY3Rpb24gKGkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0RGljdGlvbmFyeV8xW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRUb0RpY3Rpb25hcnkodHJhbnNsYXRlT2JqLnRva2VuLCB1c2VyLCB0cmFuc2xhdGVPYmoudXJsLCB0cmFuc2xhdGVPYmouYWxsX3RleHQsIGxpc3REaWN0aW9uYXJ5XzFbaV0uZ2V0QXR0cmlidXRlKCdkYXRhLXRyYW5zbGF0ZScpLCBsaXN0RGljdGlvbmFyeV8xW2ldLmdldEF0dHJpYnV0ZSgnZGF0YS13b3JkJyksIGxpc3REaWN0aW9uYXJ5XzFbaV0uZ2V0QXR0cmlidXRlKCdkYXRhLWlkJykpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdERpY3Rpb25hcnlfMS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIF9sb29wXzEoaSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdC10cmFuc2xhdGUnKS5zdHlsZS5ib3JkZXIgPSAnMXB4IHNvbGlkICMwMDAnO1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3QtdHJhbnNsYXRlJykuc3R5bGUuYm9yZGVyUmFkaXVzID0gJzVweCc7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdC10cmFuc2xhdGUnKS5zdHlsZS5saXN0U3R5bGUgPSAnbm9uZSc7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlzdC10cmFuc2xhdGUnKS5zdHlsZS5wYWRkaW5nID0gJzAnO1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3QtdHJhbnNsYXRlJykuc3R5bGUuYm9yZGVyQm90dG9tID0gJ25vbmUnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgd29yZFQuaW5uZXJIVE1MID0gJzxzcGFuPjwvc3Bhbj48aDEgc3R5bGU9XCJmb250LXNpemU6MmVtO3RleHQtYWxpZ246Y2VudGVyO1wiPicgKyByZXNwb25zZS5kYXRhLndvcmQgKyAnPC9oMT4nO1xyXG4gICAgICAgICAgICAgICAgbUJvZHkuaW5uZXJIVE1MID0gJzxoMz7Qn9C10YDQtdCy0L7QtCDQvdC1INC90LDQudC00LXQvS4uLiDQv9C+0LrQsC3Rh9GC0L48L2gzPic7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbW9kYWwuc3R5bGUudG9wID0gcGFyc2VJbnQob2Zmc2V0WSkgKyAxNSArICdweCc7XHJcbiAgICAgICAgICAgIG1vZGFsLnN0eWxlLmxlZnQgPSAnMCc7XHJcbiAgICAgICAgICAgIGlmIChwYXJzZUludChvZmZzZXRYKSAtIDE1MCA+IDApIHtcclxuICAgICAgICAgICAgICAgIG1vZGFsLnN0eWxlLmxlZnQgPSBwYXJzZUludChvZmZzZXRYKSAtIDE1MCArICdweCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbW9kYWwuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBpbm5lclRyYW5zbGF0ZU9iamVjdChyYW5nZSwgdG9rZW4sIHVzZXIsIG9mZnNldFgsIG9mZnNldFkpIHtcclxuICAgIHRyYW5zbGF0ZU9iaiA9IG51bGw7XHJcbiAgICB0cmFuc2xhdGVPYmogPSB7XHJcbiAgICAgICAgdG9rZW46IHRva2VuLFxyXG4gICAgICAgIGFsbF90ZXh0OiByYW5nZS5zdGFydENvbnRhaW5lci5kYXRhLFxyXG4gICAgICAgIHVybDogcmFuZ2Uuc3RhcnRDb250YWluZXIub3duZXJEb2N1bWVudC5sb2NhdGlvbi5ocmVmLFxyXG4gICAgICAgIG9mZnNldDogcmFuZ2Uuc3RhcnRPZmZzZXRcclxuICAgIH07XHJcbiAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7IHR5cGU6ICdzZW5kQmFja2dyb3VuZCcsIGRhdGE6IHRyYW5zbGF0ZU9iaiB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICBpZiAocmVzcG9uc2UuZGF0YS5zdWNjZXNzKSB7XHJcbiAgICAgICAgICAgIHdvcmRULnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnd29yZC10cmFuc2xhdGUnKTtcclxuICAgICAgICAgICAgbUhlYWRlci5pbnNlcnRCZWZvcmUod29yZFQsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbG9zZU1vZGFsJykpO1xyXG4gICAgICAgICAgICB3b3JkVC5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmRhdGEucmVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIG1Cb2R5LmlubmVySFRNTCA9ICc8dWwgaWQ9XCJsaXN0LXRyYW5zbGF0ZVwiPjwvdWw+JztcclxuICAgICAgICAgICAgICAgIHdvcmRULmlubmVySFRNTCA9ICc8c3Bhbj4nICsgSlNPTi5wYXJzZShyZXNwb25zZS5kYXRhLnJlc1swXS5zb3VyY2VEYXRhKS5rYW5hWzBdLnRleHQgKyAnPC9zcGFuPidcclxuICAgICAgICAgICAgICAgICAgICArICc8aDEgc3R5bGU9XCJmb250LXNpemU6MmVtO3RleHQtYWxpZ246Y2VudGVyO1wiPicgKyByZXNwb25zZS5kYXRhLndvcmQgKyAnPC9oMT4nO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxpc3RUcmFuc2xhdGVfMiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0LXRyYW5zbGF0ZScpO1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UuZGF0YS5yZXMuZm9yRWFjaChmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRyYW5zT2JqID0gSlNPTi5wYXJzZShyZXMuc291cmNlRGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNPYmouc2Vuc2UuZm9yRWFjaChmdW5jdGlvbiAoc2VuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbi5nbG9zcy5mb3JFYWNoKGZ1bmN0aW9uIChnbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdFRyYW5zbGF0ZV8yLmlubmVySFRNTCArPSAnPGxpIHN0eWxlPVwicGFkZGluZy1sZWZ0OjEwcHg7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgIzAwMDtcIj4nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAnPGEgY2xhc3M9XCJ0ZXh0RGljdGlvbmFyeVwiIGRhdGEtd29yZD1cIicgKyByZXNwb25zZS5kYXRhLndvcmRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArICdcIiBkYXRhLWlkPVwiJyArIHJlcy5pZCArICdcIiBkYXRhLXRyYW5zbGF0ZT1cIicgKyBnbC50ZXh0ICsgJ1wiPicgKyBnbC50ZXh0ICsgJzwvYT48L2xpPic7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgbGlzdERpY3Rpb25hcnlfMiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RleHREaWN0aW9uYXJ5Jyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgX2xvb3BfMiA9IGZ1bmN0aW9uIChpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdERpY3Rpb25hcnlfMltpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkVG9EaWN0aW9uYXJ5KHRyYW5zbGF0ZU9iai50b2tlbiwgdXNlciwgdHJhbnNsYXRlT2JqLnVybCwgdHJhbnNsYXRlT2JqLmFsbF90ZXh0LCBsaXN0RGljdGlvbmFyeV8yW2ldLmdldEF0dHJpYnV0ZSgnZGF0YS10cmFuc2xhdGUnKSwgbGlzdERpY3Rpb25hcnlfMltpXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtd29yZCcpLCBsaXN0RGljdGlvbmFyeV8yW2ldLmdldEF0dHJpYnV0ZSgnZGF0YS1pZCcpKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3REaWN0aW9uYXJ5XzIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBfbG9vcF8yKGkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3QtdHJhbnNsYXRlJykuc3R5bGUuYm9yZGVyID0gJzFweCBzb2xpZCAjMDAwJztcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0LXRyYW5zbGF0ZScpLnN0eWxlLmJvcmRlclJhZGl1cyA9ICc1cHgnO1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3QtdHJhbnNsYXRlJykuc3R5bGUubGlzdFN0eWxlID0gJ25vbmUnO1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpc3QtdHJhbnNsYXRlJykuc3R5bGUucGFkZGluZyA9ICcwJztcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaXN0LXRyYW5zbGF0ZScpLnN0eWxlLmJvcmRlckJvdHRvbSA9ICdub25lJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHdvcmRULmlubmVySFRNTCA9ICc8c3Bhbj48L3NwYW4+PGgxIHN0eWxlPVwiZm9udC1zaXplOjJlbTt0ZXh0LWFsaWduOmNlbnRlcjtcIj4nICsgcmVzcG9uc2UuZGF0YS53b3JkICsgJzwvaDE+JztcclxuICAgICAgICAgICAgICAgIG1Cb2R5LmlubmVySFRNTCA9ICc8aDM+0J/QtdGA0LXQstC+0LQg0L3QtSDQvdCw0LnQtNC10L0uLi4g0L/QvtC60LAt0YfRgtC+PC9oMz4nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1vZGFsLnN0eWxlLnRvcCA9IHBhcnNlSW50KG9mZnNldFkpICsgMTUgKyAncHgnO1xyXG4gICAgICAgICAgICBtb2RhbC5zdHlsZS5sZWZ0ID0gJzAnO1xyXG4gICAgICAgICAgICBpZiAocGFyc2VJbnQob2Zmc2V0WCkgLSAxNTAgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBtb2RhbC5zdHlsZS5sZWZ0ID0gcGFyc2VJbnQob2Zmc2V0WCkgLSAxNTAgKyAncHgnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuZnVuY3Rpb24gYWRkVG9EaWN0aW9uYXJ5KHRva2VuLCB1c2VyLCB1cmwsIGFsbFRleHQsIHRyYW5zbGF0ZSwgd29yZCwgZGljdGlvbmFyeV9pZCkge1xyXG4gICAgZGljdGlvbmFyeVdvcmQgPSBudWxsO1xyXG4gICAgZGljdGlvbmFyeVdvcmQgPSB7XHJcbiAgICAgICAgdG9rZW46IHRva2VuLFxyXG4gICAgICAgIHVzZXJfaWQ6IHVzZXIuaWQsXHJcbiAgICAgICAgd29yZDogd29yZCxcclxuICAgICAgICB0cmFuc2xhdGU6IHRyYW5zbGF0ZSxcclxuICAgICAgICBkaWN0aW9uYXJ5X2lkOiBwYXJzZUludChkaWN0aW9uYXJ5X2lkKSxcclxuICAgICAgICBjb250ZXh0OiBhbGxUZXh0LFxyXG4gICAgICAgIHVybDogdXJsXHJcbiAgICB9O1xyXG4gICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoeyB0eXBlOiAnc2VuZFRvRGljdGlvbmFyeScsIGRhdGE6IGRpY3Rpb25hcnlXb3JkIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgIGFsZXJ0KHJlc3BvbnNlLmRhdGEudGV4dCk7XHJcbiAgICB9KTtcclxufVxyXG4iXSwic291cmNlUm9vdCI6IiJ9