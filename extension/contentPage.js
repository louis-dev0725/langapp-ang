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

/***/ "./chrome/src/contentPage.ts":
/*!***********************************!*\
  !*** ./chrome/src/contentPage.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var token = '';
var user = '';
var extensionSetting = false;
var setting = '';
var range = '';
var translateObj = {
    token: null,
    all_text: null,
    url: null,
    offset: null
};
var overview = document.createElement('div');
var modal = document.createElement('div');
var mHeader = document.createElement('div');
var mBody = document.createElement('div');
window.onload = function (ev) {
    console.log('Загрузилась вся страница, включая стили, картинки и другие ресурсы.');
    console.log('Проверяем токен');
    chrome.storage.sync.get(['token'], function (result) {
        if (result.hasOwnProperty('token')) {
            token = result.token;
            extensionSetting = true;
            console.log('Токен получен');
        }
        else {
            console.log('Токена нет');
            if (ev.target.location.origin == 'http://localhost:4200') {
                console.log('Мы на своём сайте.');
                token = localStorage.getItem('token');
                user = localStorage.getItem('user');
                if (token != '' && user != '') {
                    chrome.runtime.sendMessage({ type: 'siteAuth', data: { token: token, user: user } });
                    extensionSetting = true;
                    console.log('Отпрвляем данные для сохранения');
                }
            }
        }
    });
    setTimeout(function () {
        if (extensionSetting) {
            console.log('Данные авторизации есть, определяем слушатель кнопок');
            chrome.storage.sync.get(['settingExtensionAction'], function (result) {
                if (result.hasOwnProperty('settingExtensionAction')) {
                    setting = result.settingExtensionAction;
                    console.log('Взяли настройки');
                }
                else {
                    setting = 'extension.DoubleClick';
                }
            });
            createModal();
            document.addEventListener('dblclick', function (e) {
                if (setting == 'extension.DoubleClick') {
                    if ((e.metaKey == false || e.ctrlKey == false) && e.shiftKey == false && e.altKey == false) {
                        console.log('Двойной клик');
                        innerTranslateObject(document.caretRangeFromPoint(e.x, e.y), token);
                    }
                }
                if (setting == 'extension.DoubleClickCtrl') {
                    if ((e.metaKey == true || e.ctrlKey == true) && e.shiftKey == false && e.altKey == false) {
                        console.log('Двойной клик + Ctrl');
                        innerTranslateObject(document.caretRangeFromPoint(e.x, e.y), token);
                    }
                }
                if (setting == 'extension.DoubleClickShift') {
                    if ((e.metaKey == false || e.ctrlKey == false) && e.shiftKey == true && e.altKey == false) {
                        console.log('Двойной клик + Shift');
                        innerTranslateObject(document.caretRangeFromPoint(e.x, e.y), token);
                    }
                }
                if (setting == 'extension.DoubleClickAlt') {
                    if ((e.metaKey == false || e.ctrlKey == false) && e.shiftKey == false && e.altKey == true) {
                        console.log('Двойной клик + Alt');
                        innerTranslateObject(document.caretRangeFromPoint(e.x, e.y), token);
                    }
                }
            });
        }
    }, 1000);
};
window.addEventListener('message', function (event) {
    if (event.source != window) {
        return;
    }
    if (event.data.type && (event.data.type == 'LoginSuccess') && (event.origin == 'http://localhost:4200')) {
        token = localStorage.getItem('token');
        user = localStorage.getItem('user');
        chrome.runtime.sendMessage({ type: 'siteAuth', data: { token: token, user: user } });
    }
    if (event.data.type && (event.data.type == 'saveSettingExtension') && (event.origin == 'http://localhost:4200')) {
        var settingExtension = JSON.parse(localStorage.getItem(event.data.text));
        chrome.runtime.sendMessage({ type: 'saveSetting', data: { settingExtension: String(settingExtension.extensionShowTranslate) } });
        setting = String(settingExtension.extensionShowTranslate);
    }
    if (event.data.type && (event.data.type == 'Logout') && (event.origin == 'http://localhost:4200')) {
        chrome.runtime.sendMessage({ type: 'siteLogout' });
    }
});
function innerTranslateObject(range, token) {
    translateObj = null;
    //translateObj = {
    //  token: token,
    //  all_text: range.startContainer.data,
    //  url: range.startContainer.ownerDocument.location.href,
    //  offset: range.startOffset
    //};
    translateObj = {
        token: token,
        all_text: 'これは日本語の形態素解析のテストです。動詞の形も一般化できるようになっています。',
        url: range.startContainer.ownerDocument.location.href,
        offset: 3
    };
    chrome.runtime.sendMessage({ text: 'sendBackground', data: translateObj }, function (response) {
        if (response.data.success) {
            overview.style.display = 'flex';
            mBody.innerHTML = '';
            response.data.res.forEach(function (res) {
                var transObj = JSON.parse(res.sourceData);
                var kanjiCounter = 0;
                var senseCounter = 0;
                transObj.kanji.forEach(function (trans) {
                    if (kanjiCounter == 0) {
                        mBody.innerHTML += 'Kanji text: ';
                    }
                    if (kanjiCounter == transObj.kanji.length - 1) {
                        mBody.innerHTML += trans.text + '; ';
                    }
                    else {
                        mBody.innerHTML += trans.text + ', ';
                    }
                    kanjiCounter++;
                });
                transObj.sense.forEach(function (sen) {
                    if (senseCounter == 0) {
                        mBody.innerHTML += 'Sense, gloss text: ';
                    }
                    if (senseCounter == transObj.sense.length - 1) {
                        var glCounter_1 = 0;
                        sen.gloss.forEach(function (gl) {
                            if (glCounter_1 == sen.gloss.length - 1) {
                                mBody.innerHTML += gl.text;
                            }
                            else {
                                mBody.innerHTML += gl.text + ', ';
                            }
                        });
                    }
                    else {
                        sen.gloss.forEach(function (gl) {
                            mBody.innerHTML += gl.text + ', ';
                        });
                    }
                    senseCounter++;
                });
                mBody.innerHTML += '<br>';
            });
        }
    });
}
function createModal() {
    modal.setAttribute('id', 'modalTranslate');
    modal.style.display = 'flex';
    modal.style.flexFlow = 'column nowrap';
    modal.style.zIndex = '9999999';
    modal.style.width = '600px';
    modal.style.background = 'rgba(255, 255, 255, 1)';
    modal.style.borderRadius = '10px';
    overview.setAttribute('id', 'overviewTranslate');
    overview.style.position = 'fixed';
    overview.style.top = '0';
    overview.style.left = '0';
    overview.style.zIndex = '999999';
    overview.style.display = 'none';
    overview.style.width = '100vw';
    overview.style.height = '100vh';
    overview.style.alignItems = 'center';
    overview.style.justifyContent = 'center';
    overview.style.background = 'rgba(0, 0, 0, .7)';
    document.body.appendChild(overview);
    overview.appendChild(modal);
    modal.appendChild(mHeader);
    modal.appendChild(mBody);
    mHeader.setAttribute('id', 'modal-translate-header');
    mBody.setAttribute('id', 'modal-translate-body');
    document.getElementById('modal-translate-header').style.display = 'flex';
    document.getElementById('modal-translate-header').style.flexFlow = 'row nowrap';
    document.getElementById('modal-translate-header').style.width = '100%';
    document.getElementById('modal-translate-header').style.justifyContent = 'flex-end';
    document.getElementById('modal-translate-header').style.height = '45px';
    document.getElementById('modal-translate-body').style.boxSizing = 'border-box';
    document.getElementById('modal-translate-body').style.display = 'flex';
    document.getElementById('modal-translate-body').style.flexFlow = 'column nowrap';
    document.getElementById('modal-translate-body').style.width = '100%';
    document.getElementById('modal-translate-body').style.padding = '20px';
    mHeader.innerHTML = '<button type="button" class="close" id="closeModal"><span>&times;</span></button>';
    document.getElementById('closeModal').style.border = 'none';
    document.getElementById('closeModal').style.background = 'transparent';
    document.getElementById('closeModal').style.padding = '1rem 2rem';
    document.getElementById('closeModal').style.fontSize = '2rem';
    document.getElementById('closeModal').style.fontWeight = '700';
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY2hyb21lL3NyYy9jb250ZW50UGFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0QsMEJBQTBCLDJCQUEyQixFQUFFO0FBQ3ZHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsMEJBQTBCLDJCQUEyQixFQUFFO0FBQzNGO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyw2QkFBNkIsb0VBQW9FLEVBQUU7QUFDdkk7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLHFCQUFxQjtBQUN6RDtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLDZDQUE2QztBQUM3RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwREFBMEQ7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBGQUEwRjtBQUMxRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiY29udGVudFBhZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL2Nocm9tZS9zcmMvY29udGVudFBhZ2UudHNcIik7XG4iLCJ2YXIgdG9rZW4gPSAnJztcclxudmFyIHVzZXIgPSAnJztcclxudmFyIGV4dGVuc2lvblNldHRpbmcgPSBmYWxzZTtcclxudmFyIHNldHRpbmcgPSAnJztcclxudmFyIHJhbmdlID0gJyc7XHJcbnZhciB0cmFuc2xhdGVPYmogPSB7XHJcbiAgICB0b2tlbjogbnVsbCxcclxuICAgIGFsbF90ZXh0OiBudWxsLFxyXG4gICAgdXJsOiBudWxsLFxyXG4gICAgb2Zmc2V0OiBudWxsXHJcbn07XHJcbnZhciBvdmVydmlldyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG52YXIgbW9kYWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxudmFyIG1IZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxudmFyIG1Cb2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbiAoZXYpIHtcclxuICAgIGNvbnNvbGUubG9nKCfQl9Cw0LPRgNGD0LfQuNC70LDRgdGMINCy0YHRjyDRgdGC0YDQsNC90LjRhtCwLCDQstC60LvRjtGH0LDRjyDRgdGC0LjQu9C4LCDQutCw0YDRgtC40L3QutC4INC4INC00YDRg9Cz0LjQtSDRgNC10YHRg9GA0YHRiy4nKTtcclxuICAgIGNvbnNvbGUubG9nKCfQn9GA0L7QstC10YDRj9C10Lwg0YLQvtC60LXQvScpO1xyXG4gICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoWyd0b2tlbiddLCBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdC5oYXNPd25Qcm9wZXJ0eSgndG9rZW4nKSkge1xyXG4gICAgICAgICAgICB0b2tlbiA9IHJlc3VsdC50b2tlbjtcclxuICAgICAgICAgICAgZXh0ZW5zaW9uU2V0dGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCfQotC+0LrQtdC9INC/0L7Qu9GD0YfQtdC9Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygn0KLQvtC60LXQvdCwINC90LXRgicpO1xyXG4gICAgICAgICAgICBpZiAoZXYudGFyZ2V0LmxvY2F0aW9uLm9yaWdpbiA9PSAnaHR0cDovL2xvY2FsaG9zdDo0MjAwJykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ9Cc0Ysg0L3QsCDRgdCy0L7RkdC8INGB0LDQudGC0LUuJyk7XHJcbiAgICAgICAgICAgICAgICB0b2tlbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b2tlbicpO1xyXG4gICAgICAgICAgICAgICAgdXNlciA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VyJyk7XHJcbiAgICAgICAgICAgICAgICBpZiAodG9rZW4gIT0gJycgJiYgdXNlciAhPSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHsgdHlwZTogJ3NpdGVBdXRoJywgZGF0YTogeyB0b2tlbjogdG9rZW4sIHVzZXI6IHVzZXIgfSB9KTtcclxuICAgICAgICAgICAgICAgICAgICBleHRlbnNpb25TZXR0aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn0J7RgtC/0YDQstC70Y/QtdC8INC00LDQvdC90YvQtSDQtNC70Y8g0YHQvtGF0YDQsNC90LXQvdC40Y8nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKGV4dGVuc2lvblNldHRpbmcpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ9CU0LDQvdC90YvQtSDQsNCy0YLQvtGA0LjQt9Cw0YbQuNC4INC10YHRgtGMLCDQvtC/0YDQtdC00LXQu9GP0LXQvCDRgdC70YPRiNCw0YLQtdC70Ywg0LrQvdC+0L/QvtC6Jyk7XHJcbiAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KFsnc2V0dGluZ0V4dGVuc2lvbkFjdGlvbiddLCBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0Lmhhc093blByb3BlcnR5KCdzZXR0aW5nRXh0ZW5zaW9uQWN0aW9uJykpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXR0aW5nID0gcmVzdWx0LnNldHRpbmdFeHRlbnNpb25BY3Rpb247XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ9CS0LfRj9C70Lgg0L3QsNGB0YLRgNC+0LnQutC4Jyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXR0aW5nID0gJ2V4dGVuc2lvbi5Eb3VibGVDbGljayc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjcmVhdGVNb2RhbCgpO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkYmxjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2V0dGluZyA9PSAnZXh0ZW5zaW9uLkRvdWJsZUNsaWNrJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgoZS5tZXRhS2V5ID09IGZhbHNlIHx8IGUuY3RybEtleSA9PSBmYWxzZSkgJiYgZS5zaGlmdEtleSA9PSBmYWxzZSAmJiBlLmFsdEtleSA9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn0JTQstC+0LnQvdC+0Lkg0LrQu9C40LonKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5uZXJUcmFuc2xhdGVPYmplY3QoZG9jdW1lbnQuY2FyZXRSYW5nZUZyb21Qb2ludChlLngsIGUueSksIHRva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoc2V0dGluZyA9PSAnZXh0ZW5zaW9uLkRvdWJsZUNsaWNrQ3RybCcpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoKGUubWV0YUtleSA9PSB0cnVlIHx8IGUuY3RybEtleSA9PSB0cnVlKSAmJiBlLnNoaWZ0S2V5ID09IGZhbHNlICYmIGUuYWx0S2V5ID09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfQlNCy0L7QudC90L7QuSDQutC70LjQuiArIEN0cmwnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5uZXJUcmFuc2xhdGVPYmplY3QoZG9jdW1lbnQuY2FyZXRSYW5nZUZyb21Qb2ludChlLngsIGUueSksIHRva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoc2V0dGluZyA9PSAnZXh0ZW5zaW9uLkRvdWJsZUNsaWNrU2hpZnQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKChlLm1ldGFLZXkgPT0gZmFsc2UgfHwgZS5jdHJsS2V5ID09IGZhbHNlKSAmJiBlLnNoaWZ0S2V5ID09IHRydWUgJiYgZS5hbHRLZXkgPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ9CU0LLQvtC50L3QvtC5INC60LvQuNC6ICsgU2hpZnQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5uZXJUcmFuc2xhdGVPYmplY3QoZG9jdW1lbnQuY2FyZXRSYW5nZUZyb21Qb2ludChlLngsIGUueSksIHRva2VuKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoc2V0dGluZyA9PSAnZXh0ZW5zaW9uLkRvdWJsZUNsaWNrQWx0Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgoZS5tZXRhS2V5ID09IGZhbHNlIHx8IGUuY3RybEtleSA9PSBmYWxzZSkgJiYgZS5zaGlmdEtleSA9PSBmYWxzZSAmJiBlLmFsdEtleSA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfQlNCy0L7QudC90L7QuSDQutC70LjQuiArIEFsdCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbm5lclRyYW5zbGF0ZU9iamVjdChkb2N1bWVudC5jYXJldFJhbmdlRnJvbVBvaW50KGUueCwgZS55KSwgdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSwgMTAwMCk7XHJcbn07XHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICBpZiAoZXZlbnQuc291cmNlICE9IHdpbmRvdykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGlmIChldmVudC5kYXRhLnR5cGUgJiYgKGV2ZW50LmRhdGEudHlwZSA9PSAnTG9naW5TdWNjZXNzJykgJiYgKGV2ZW50Lm9yaWdpbiA9PSAnaHR0cDovL2xvY2FsaG9zdDo0MjAwJykpIHtcclxuICAgICAgICB0b2tlbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b2tlbicpO1xyXG4gICAgICAgIHVzZXIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcicpO1xyXG4gICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHsgdHlwZTogJ3NpdGVBdXRoJywgZGF0YTogeyB0b2tlbjogdG9rZW4sIHVzZXI6IHVzZXIgfSB9KTtcclxuICAgIH1cclxuICAgIGlmIChldmVudC5kYXRhLnR5cGUgJiYgKGV2ZW50LmRhdGEudHlwZSA9PSAnc2F2ZVNldHRpbmdFeHRlbnNpb24nKSAmJiAoZXZlbnQub3JpZ2luID09ICdodHRwOi8vbG9jYWxob3N0OjQyMDAnKSkge1xyXG4gICAgICAgIHZhciBzZXR0aW5nRXh0ZW5zaW9uID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShldmVudC5kYXRhLnRleHQpKTtcclxuICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7IHR5cGU6ICdzYXZlU2V0dGluZycsIGRhdGE6IHsgc2V0dGluZ0V4dGVuc2lvbjogU3RyaW5nKHNldHRpbmdFeHRlbnNpb24uZXh0ZW5zaW9uU2hvd1RyYW5zbGF0ZSkgfSB9KTtcclxuICAgICAgICBzZXR0aW5nID0gU3RyaW5nKHNldHRpbmdFeHRlbnNpb24uZXh0ZW5zaW9uU2hvd1RyYW5zbGF0ZSk7XHJcbiAgICB9XHJcbiAgICBpZiAoZXZlbnQuZGF0YS50eXBlICYmIChldmVudC5kYXRhLnR5cGUgPT0gJ0xvZ291dCcpICYmIChldmVudC5vcmlnaW4gPT0gJ2h0dHA6Ly9sb2NhbGhvc3Q6NDIwMCcpKSB7XHJcbiAgICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoeyB0eXBlOiAnc2l0ZUxvZ291dCcgfSk7XHJcbiAgICB9XHJcbn0pO1xyXG5mdW5jdGlvbiBpbm5lclRyYW5zbGF0ZU9iamVjdChyYW5nZSwgdG9rZW4pIHtcclxuICAgIHRyYW5zbGF0ZU9iaiA9IG51bGw7XHJcbiAgICAvL3RyYW5zbGF0ZU9iaiA9IHtcclxuICAgIC8vICB0b2tlbjogdG9rZW4sXHJcbiAgICAvLyAgYWxsX3RleHQ6IHJhbmdlLnN0YXJ0Q29udGFpbmVyLmRhdGEsXHJcbiAgICAvLyAgdXJsOiByYW5nZS5zdGFydENvbnRhaW5lci5vd25lckRvY3VtZW50LmxvY2F0aW9uLmhyZWYsXHJcbiAgICAvLyAgb2Zmc2V0OiByYW5nZS5zdGFydE9mZnNldFxyXG4gICAgLy99O1xyXG4gICAgdHJhbnNsYXRlT2JqID0ge1xyXG4gICAgICAgIHRva2VuOiB0b2tlbixcclxuICAgICAgICBhbGxfdGV4dDogJ+OBk+OCjOOBr+aXpeacrOiqnuOBruW9ouaFi+e0oOino+aekOOBruODhuOCueODiOOBp+OBmeOAguWLleipnuOBruW9ouOCguS4gOiIrOWMluOBp+OBjeOCi+OCiOOBhuOBq+OBquOBo+OBpuOBhOOBvuOBmeOAgicsXHJcbiAgICAgICAgdXJsOiByYW5nZS5zdGFydENvbnRhaW5lci5vd25lckRvY3VtZW50LmxvY2F0aW9uLmhyZWYsXHJcbiAgICAgICAgb2Zmc2V0OiAzXHJcbiAgICB9O1xyXG4gICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoeyB0ZXh0OiAnc2VuZEJhY2tncm91bmQnLCBkYXRhOiB0cmFuc2xhdGVPYmogfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgaWYgKHJlc3BvbnNlLmRhdGEuc3VjY2Vzcykge1xyXG4gICAgICAgICAgICBvdmVydmlldy5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xyXG4gICAgICAgICAgICBtQm9keS5pbm5lckhUTUwgPSAnJztcclxuICAgICAgICAgICAgcmVzcG9uc2UuZGF0YS5yZXMuZm9yRWFjaChmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdHJhbnNPYmogPSBKU09OLnBhcnNlKHJlcy5zb3VyY2VEYXRhKTtcclxuICAgICAgICAgICAgICAgIHZhciBrYW5qaUNvdW50ZXIgPSAwO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNlbnNlQ291bnRlciA9IDA7XHJcbiAgICAgICAgICAgICAgICB0cmFuc09iai5rYW5qaS5mb3JFYWNoKGZ1bmN0aW9uICh0cmFucykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChrYW5qaUNvdW50ZXIgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtQm9keS5pbm5lckhUTUwgKz0gJ0thbmppIHRleHQ6ICc7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChrYW5qaUNvdW50ZXIgPT0gdHJhbnNPYmoua2FuamkubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtQm9keS5pbm5lckhUTUwgKz0gdHJhbnMudGV4dCArICc7ICc7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtQm9keS5pbm5lckhUTUwgKz0gdHJhbnMudGV4dCArICcsICc7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGthbmppQ291bnRlcisrO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB0cmFuc09iai5zZW5zZS5mb3JFYWNoKGZ1bmN0aW9uIChzZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2Vuc2VDb3VudGVyID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbUJvZHkuaW5uZXJIVE1MICs9ICdTZW5zZSwgZ2xvc3MgdGV4dDogJztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbnNlQ291bnRlciA9PSB0cmFuc09iai5zZW5zZS5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBnbENvdW50ZXJfMSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbi5nbG9zcy5mb3JFYWNoKGZ1bmN0aW9uIChnbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdsQ291bnRlcl8xID09IHNlbi5nbG9zcy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbUJvZHkuaW5uZXJIVE1MICs9IGdsLnRleHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtQm9keS5pbm5lckhUTUwgKz0gZ2wudGV4dCArICcsICc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VuLmdsb3NzLmZvckVhY2goZnVuY3Rpb24gKGdsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtQm9keS5pbm5lckhUTUwgKz0gZ2wudGV4dCArICcsICc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBzZW5zZUNvdW50ZXIrKztcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgbUJvZHkuaW5uZXJIVE1MICs9ICc8YnI+JztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuZnVuY3Rpb24gY3JlYXRlTW9kYWwoKSB7XHJcbiAgICBtb2RhbC5zZXRBdHRyaWJ1dGUoJ2lkJywgJ21vZGFsVHJhbnNsYXRlJyk7XHJcbiAgICBtb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xyXG4gICAgbW9kYWwuc3R5bGUuZmxleEZsb3cgPSAnY29sdW1uIG5vd3JhcCc7XHJcbiAgICBtb2RhbC5zdHlsZS56SW5kZXggPSAnOTk5OTk5OSc7XHJcbiAgICBtb2RhbC5zdHlsZS53aWR0aCA9ICc2MDBweCc7XHJcbiAgICBtb2RhbC5zdHlsZS5iYWNrZ3JvdW5kID0gJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMSknO1xyXG4gICAgbW9kYWwuc3R5bGUuYm9yZGVyUmFkaXVzID0gJzEwcHgnO1xyXG4gICAgb3ZlcnZpZXcuc2V0QXR0cmlidXRlKCdpZCcsICdvdmVydmlld1RyYW5zbGF0ZScpO1xyXG4gICAgb3ZlcnZpZXcuc3R5bGUucG9zaXRpb24gPSAnZml4ZWQnO1xyXG4gICAgb3ZlcnZpZXcuc3R5bGUudG9wID0gJzAnO1xyXG4gICAgb3ZlcnZpZXcuc3R5bGUubGVmdCA9ICcwJztcclxuICAgIG92ZXJ2aWV3LnN0eWxlLnpJbmRleCA9ICc5OTk5OTknO1xyXG4gICAgb3ZlcnZpZXcuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgIG92ZXJ2aWV3LnN0eWxlLndpZHRoID0gJzEwMHZ3JztcclxuICAgIG92ZXJ2aWV3LnN0eWxlLmhlaWdodCA9ICcxMDB2aCc7XHJcbiAgICBvdmVydmlldy5zdHlsZS5hbGlnbkl0ZW1zID0gJ2NlbnRlcic7XHJcbiAgICBvdmVydmlldy5zdHlsZS5qdXN0aWZ5Q29udGVudCA9ICdjZW50ZXInO1xyXG4gICAgb3ZlcnZpZXcuc3R5bGUuYmFja2dyb3VuZCA9ICdyZ2JhKDAsIDAsIDAsIC43KSc7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG92ZXJ2aWV3KTtcclxuICAgIG92ZXJ2aWV3LmFwcGVuZENoaWxkKG1vZGFsKTtcclxuICAgIG1vZGFsLmFwcGVuZENoaWxkKG1IZWFkZXIpO1xyXG4gICAgbW9kYWwuYXBwZW5kQ2hpbGQobUJvZHkpO1xyXG4gICAgbUhlYWRlci5zZXRBdHRyaWJ1dGUoJ2lkJywgJ21vZGFsLXRyYW5zbGF0ZS1oZWFkZXInKTtcclxuICAgIG1Cb2R5LnNldEF0dHJpYnV0ZSgnaWQnLCAnbW9kYWwtdHJhbnNsYXRlLWJvZHknKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbC10cmFuc2xhdGUtaGVhZGVyJykuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbC10cmFuc2xhdGUtaGVhZGVyJykuc3R5bGUuZmxleEZsb3cgPSAncm93IG5vd3JhcCc7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtdHJhbnNsYXRlLWhlYWRlcicpLnN0eWxlLndpZHRoID0gJzEwMCUnO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsLXRyYW5zbGF0ZS1oZWFkZXInKS5zdHlsZS5qdXN0aWZ5Q29udGVudCA9ICdmbGV4LWVuZCc7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtdHJhbnNsYXRlLWhlYWRlcicpLnN0eWxlLmhlaWdodCA9ICc0NXB4JztcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbC10cmFuc2xhdGUtYm9keScpLnN0eWxlLmJveFNpemluZyA9ICdib3JkZXItYm94JztcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbC10cmFuc2xhdGUtYm9keScpLnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kYWwtdHJhbnNsYXRlLWJvZHknKS5zdHlsZS5mbGV4RmxvdyA9ICdjb2x1bW4gbm93cmFwJztcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbC10cmFuc2xhdGUtYm9keScpLnN0eWxlLndpZHRoID0gJzEwMCUnO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGFsLXRyYW5zbGF0ZS1ib2R5Jykuc3R5bGUucGFkZGluZyA9ICcyMHB4JztcclxuICAgIG1IZWFkZXIuaW5uZXJIVE1MID0gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBpZD1cImNsb3NlTW9kYWxcIj48c3Bhbj4mdGltZXM7PC9zcGFuPjwvYnV0dG9uPic7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xvc2VNb2RhbCcpLnN0eWxlLmJvcmRlciA9ICdub25lJztcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbG9zZU1vZGFsJykuc3R5bGUuYmFja2dyb3VuZCA9ICd0cmFuc3BhcmVudCc7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xvc2VNb2RhbCcpLnN0eWxlLnBhZGRpbmcgPSAnMXJlbSAycmVtJztcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbG9zZU1vZGFsJykuc3R5bGUuZm9udFNpemUgPSAnMnJlbSc7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xvc2VNb2RhbCcpLnN0eWxlLmZvbnRXZWlnaHQgPSAnNzAwJztcclxufVxyXG4iXSwic291cmNlUm9vdCI6IiJ9