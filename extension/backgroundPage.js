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
/******/ 	return __webpack_require__(__webpack_require__.s = "./chrome/src/backgroundPage.ts");
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

/***/ "./chrome/src/backgroundPage.ts":
/*!**************************************!*\
  !*** ./chrome/src/backgroundPage.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var config = __webpack_require__(/*! ../../allParam.config */ "./allParam.config.js");
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    var objData = message.data;
    var result = '';
    var jwt_token = objData.token;
    delete objData.token;
    var objWord = JSON.stringify(objData);
    if (message.type === 'sendBackground') {
        var request_1 = new XMLHttpRequest();
        request_1.open('POST', config.URIApi + 'api/translates', true);
        request_1.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        request_1.setRequestHeader('Authorization', "Bearer " + jwt_token);
        request_1.send(objWord);
        request_1.onload = (function () {
            if (request_1.readyState === 4 && request_1.status === 200) {
                result = JSON.parse(request_1.responseText);
                sendResponse({ type: 'sendTranslateModal', data: result });
            }
        });
        return true;
    }
    else if (message.type === 'sendSelectedBackground') {
        var request_2 = new XMLHttpRequest();
        request_2.open('POST', config.URIApi + 'api/translates/select', true);
        request_2.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        request_2.setRequestHeader('Authorization', "Bearer " + jwt_token);
        request_2.send(objWord);
        request_2.onload = (function () {
            if (request_2.readyState === 4 && request_2.status === 200) {
                result = JSON.parse(request_2.responseText);
                sendResponse({ type: 'sendTranslateModal', data: result });
            }
        });
        return true;
    }
    else if (message.type === 'sendToDictionary') {
        var request_3 = new XMLHttpRequest();
        request_3.open('POST', config.URIApi + 'api/dictionaries', true);
        request_3.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        request_3.setRequestHeader('Authorization', "Bearer " + jwt_token);
        request_3.send(objWord);
        request_3.onload = (function () {
            if (request_3.readyState === 4 && request_3.status === 200) {
                result = JSON.parse(request_3.responseText);
                sendResponse({ type: 'sendResultDictionary', data: result });
            }
        });
        return true;
    }
    else if (message.type === 'siteAuth') {
        _this.user = JSON.parse(objData.user);
        _this.token = objData.token;
        chrome.storage.local.set({ token: objData.token, user: objData.user }, function () {
            console.log('Set token and user');
        });
    }
    else if (message.type === 'saveSetting') {
        chrome.storage.local.set({ settingExtensionAction: objData.settingExtension }, function () {
            console.log('Set setting extension');
        });
    }
    else if (message.type === 'siteLogout') {
        chrome.storage.local.remove(['token', 'user', 'settingExtension']);
    }
});
setInterval(function () {
    chrome.storage.local.get(['token', 'user'], function (result) {
        if (result.hasOwnProperty('token') && result.hasOwnProperty('user')) {
            var requestSettingsPlugin_1 = new XMLHttpRequest();
            requestSettingsPlugin_1.open('GET', config.URIApi + 'api/plugins/' + result.user.id, true);
            requestSettingsPlugin_1.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            requestSettingsPlugin_1.setRequestHeader('Authorization', "Bearer " + result.token);
            requestSettingsPlugin_1.send();
            requestSettingsPlugin_1.onload = (function () {
                if (requestSettingsPlugin_1.readyState === 4 && requestSettingsPlugin_1.status === 200) {
                    var settingPlugin = JSON.parse(requestSettingsPlugin_1.responseText);
                    chrome.storage.local.set({ settingExtensionAction: String(settingPlugin.extensionShowTranslate),
                        user: settingPlugin.user }, function () {
                        console.log('Set new setting extension and user data');
                    });
                }
            });
        }
    });
}, 3600000);


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vYWxsUGFyYW0uY29uZmlnLmpzIiwid2VicGFjazovLy8uL2Nocm9tZS9zcmMvYmFja2dyb3VuZFBhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDSGE7QUFDYjtBQUNBLDhDQUE4QyxjQUFjO0FBQzVELGFBQWEsbUJBQU8sQ0FBQyxtREFBdUI7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUVBQXFFO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsMkNBQTJDO0FBQ3pFO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxRUFBcUU7QUFDckU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QiwyQ0FBMkM7QUFDekU7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFFQUFxRTtBQUNyRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLDZDQUE2QztBQUMzRTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLDJDQUEyQztBQUM3RTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0Esa0NBQWtDLG1EQUFtRDtBQUNyRjtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUZBQXVGO0FBQ3ZGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEM7QUFDOUMsa0RBQWtEO0FBQ2xEO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsS0FBSztBQUNMLENBQUMiLCJmaWxlIjoiYmFja2dyb3VuZFBhZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL2Nocm9tZS9zcmMvYmFja2dyb3VuZFBhZ2UudHNcIik7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIFVSSUFwaTogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA5MC8nLFxyXG4gICAgVVJJRnJvbnQ6ICdodHRwOi8vbG9jYWxob3N0OjQyMDAnXHJcbn07XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX3RoaXMgPSB0aGlzO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBjb25maWcgPSByZXF1aXJlKFwiLi4vLi4vYWxsUGFyYW0uY29uZmlnXCIpO1xyXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoZnVuY3Rpb24gKG1lc3NhZ2UsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSB7XHJcbiAgICB2YXIgb2JqRGF0YSA9IG1lc3NhZ2UuZGF0YTtcclxuICAgIHZhciByZXN1bHQgPSAnJztcclxuICAgIHZhciBqd3RfdG9rZW4gPSBvYmpEYXRhLnRva2VuO1xyXG4gICAgZGVsZXRlIG9iakRhdGEudG9rZW47XHJcbiAgICB2YXIgb2JqV29yZCA9IEpTT04uc3RyaW5naWZ5KG9iakRhdGEpO1xyXG4gICAgaWYgKG1lc3NhZ2UudHlwZSA9PT0gJ3NlbmRCYWNrZ3JvdW5kJykge1xyXG4gICAgICAgIHZhciByZXF1ZXN0XzEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICByZXF1ZXN0XzEub3BlbignUE9TVCcsIGNvbmZpZy5VUklBcGkgKyAnYXBpL3RyYW5zbGF0ZXMnLCB0cnVlKTtcclxuICAgICAgICByZXF1ZXN0XzEuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTtcclxuICAgICAgICByZXF1ZXN0XzEuc2V0UmVxdWVzdEhlYWRlcignQXV0aG9yaXphdGlvbicsIFwiQmVhcmVyIFwiICsgand0X3Rva2VuKTtcclxuICAgICAgICByZXF1ZXN0XzEuc2VuZChvYmpXb3JkKTtcclxuICAgICAgICByZXF1ZXN0XzEub25sb2FkID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHJlcXVlc3RfMS5yZWFkeVN0YXRlID09PSA0ICYmIHJlcXVlc3RfMS5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZShyZXF1ZXN0XzEucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHR5cGU6ICdzZW5kVHJhbnNsYXRlTW9kYWwnLCBkYXRhOiByZXN1bHQgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKG1lc3NhZ2UudHlwZSA9PT0gJ3NlbmRTZWxlY3RlZEJhY2tncm91bmQnKSB7XHJcbiAgICAgICAgdmFyIHJlcXVlc3RfMiA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHJlcXVlc3RfMi5vcGVuKCdQT1NUJywgY29uZmlnLlVSSUFwaSArICdhcGkvdHJhbnNsYXRlcy9zZWxlY3QnLCB0cnVlKTtcclxuICAgICAgICByZXF1ZXN0XzIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTtcclxuICAgICAgICByZXF1ZXN0XzIuc2V0UmVxdWVzdEhlYWRlcignQXV0aG9yaXphdGlvbicsIFwiQmVhcmVyIFwiICsgand0X3Rva2VuKTtcclxuICAgICAgICByZXF1ZXN0XzIuc2VuZChvYmpXb3JkKTtcclxuICAgICAgICByZXF1ZXN0XzIub25sb2FkID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHJlcXVlc3RfMi5yZWFkeVN0YXRlID09PSA0ICYmIHJlcXVlc3RfMi5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZShyZXF1ZXN0XzIucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHR5cGU6ICdzZW5kVHJhbnNsYXRlTW9kYWwnLCBkYXRhOiByZXN1bHQgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKG1lc3NhZ2UudHlwZSA9PT0gJ3NlbmRUb0RpY3Rpb25hcnknKSB7XHJcbiAgICAgICAgdmFyIHJlcXVlc3RfMyA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHJlcXVlc3RfMy5vcGVuKCdQT1NUJywgY29uZmlnLlVSSUFwaSArICdhcGkvZGljdGlvbmFyaWVzJywgdHJ1ZSk7XHJcbiAgICAgICAgcmVxdWVzdF8zLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7XHJcbiAgICAgICAgcmVxdWVzdF8zLnNldFJlcXVlc3RIZWFkZXIoJ0F1dGhvcml6YXRpb24nLCBcIkJlYXJlciBcIiArIGp3dF90b2tlbik7XHJcbiAgICAgICAgcmVxdWVzdF8zLnNlbmQob2JqV29yZCk7XHJcbiAgICAgICAgcmVxdWVzdF8zLm9ubG9hZCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChyZXF1ZXN0XzMucmVhZHlTdGF0ZSA9PT0gNCAmJiByZXF1ZXN0XzMuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UocmVxdWVzdF8zLnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyB0eXBlOiAnc2VuZFJlc3VsdERpY3Rpb25hcnknLCBkYXRhOiByZXN1bHQgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKG1lc3NhZ2UudHlwZSA9PT0gJ3NpdGVBdXRoJykge1xyXG4gICAgICAgIF90aGlzLnVzZXIgPSBKU09OLnBhcnNlKG9iakRhdGEudXNlcik7XHJcbiAgICAgICAgX3RoaXMudG9rZW4gPSBvYmpEYXRhLnRva2VuO1xyXG4gICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHRva2VuOiBvYmpEYXRhLnRva2VuLCB1c2VyOiBvYmpEYXRhLnVzZXIgfSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnU2V0IHRva2VuIGFuZCB1c2VyJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChtZXNzYWdlLnR5cGUgPT09ICdzYXZlU2V0dGluZycpIHtcclxuICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBzZXR0aW5nRXh0ZW5zaW9uQWN0aW9uOiBvYmpEYXRhLnNldHRpbmdFeHRlbnNpb24gfSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnU2V0IHNldHRpbmcgZXh0ZW5zaW9uJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChtZXNzYWdlLnR5cGUgPT09ICdzaXRlTG9nb3V0Jykge1xyXG4gICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnJlbW92ZShbJ3Rva2VuJywgJ3VzZXInLCAnc2V0dGluZ0V4dGVuc2lvbiddKTtcclxuICAgIH1cclxufSk7XHJcbnNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcclxuICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbJ3Rva2VuJywgJ3VzZXInXSwgZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgIGlmIChyZXN1bHQuaGFzT3duUHJvcGVydHkoJ3Rva2VuJykgJiYgcmVzdWx0Lmhhc093blByb3BlcnR5KCd1c2VyJykpIHtcclxuICAgICAgICAgICAgdmFyIHJlcXVlc3RTZXR0aW5nc1BsdWdpbl8xID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgIHJlcXVlc3RTZXR0aW5nc1BsdWdpbl8xLm9wZW4oJ0dFVCcsIGNvbmZpZy5VUklBcGkgKyAnYXBpL3BsdWdpbnMvJyArIHJlc3VsdC51c2VyLmlkLCB0cnVlKTtcclxuICAgICAgICAgICAgcmVxdWVzdFNldHRpbmdzUGx1Z2luXzEuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTtcclxuICAgICAgICAgICAgcmVxdWVzdFNldHRpbmdzUGx1Z2luXzEuc2V0UmVxdWVzdEhlYWRlcignQXV0aG9yaXphdGlvbicsIFwiQmVhcmVyIFwiICsgcmVzdWx0LnRva2VuKTtcclxuICAgICAgICAgICAgcmVxdWVzdFNldHRpbmdzUGx1Z2luXzEuc2VuZCgpO1xyXG4gICAgICAgICAgICByZXF1ZXN0U2V0dGluZ3NQbHVnaW5fMS5vbmxvYWQgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlcXVlc3RTZXR0aW5nc1BsdWdpbl8xLnJlYWR5U3RhdGUgPT09IDQgJiYgcmVxdWVzdFNldHRpbmdzUGx1Z2luXzEuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc2V0dGluZ1BsdWdpbiA9IEpTT04ucGFyc2UocmVxdWVzdFNldHRpbmdzUGx1Z2luXzEucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBzZXR0aW5nRXh0ZW5zaW9uQWN0aW9uOiBTdHJpbmcoc2V0dGluZ1BsdWdpbi5leHRlbnNpb25TaG93VHJhbnNsYXRlKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcjogc2V0dGluZ1BsdWdpbi51c2VyIH0sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1NldCBuZXcgc2V0dGluZyBleHRlbnNpb24gYW5kIHVzZXIgZGF0YScpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufSwgMzYwMDAwMCk7XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=