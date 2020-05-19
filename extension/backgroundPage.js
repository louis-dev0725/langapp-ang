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
    if (message.type === 'sendBackground') {
        var result_1 = '';
        var jwt_token = objData.token;
        delete objData.token;
        var filter = JSON.stringify(objData);
        var request_1 = new XMLHttpRequest();
        request_1.open('POST', config.URIApi + 'api/translates', true);
        request_1.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        request_1.setRequestHeader('Authorization', "Bearer " + jwt_token);
        request_1.send(filter);
        request_1.onload = (function () {
            if (request_1.readyState === 4 && request_1.status === 200) {
                result_1 = JSON.parse(request_1.responseText);
                sendResponse({ type: 'sendTranslateModal', data: result_1 });
            }
        });
        return true;
    }
    else if (message.type === 'sendToDictionary') {
        var result_2 = '';
        var jwt_token = objData.token;
        delete objData.token;
        var objWord = JSON.stringify(objData);
        var request_2 = new XMLHttpRequest();
        request_2.open('POST', config.URIApi + 'api/dictionaries', true);
        request_2.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        request_2.setRequestHeader('Authorization', "Bearer " + jwt_token);
        request_2.send(objWord);
        request_2.onload = (function () {
            if (request_2.readyState === 4 && request_2.status === 200) {
                result_2 = JSON.parse(request_2.responseText);
                sendResponse({ type: 'sendResultDictionary', data: result_2 });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vYWxsUGFyYW0uY29uZmlnLmpzIiwid2VicGFjazovLy8uL2Nocm9tZS9zcmMvYmFja2dyb3VuZFBhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDSGE7QUFDYjtBQUNBLDhDQUE4QyxjQUFjO0FBQzVELGFBQWEsbUJBQU8sQ0FBQyxtREFBdUI7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUVBQXFFO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsNkNBQTZDO0FBQzNFO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFFQUFxRTtBQUNyRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLCtDQUErQztBQUM3RTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLDJDQUEyQztBQUM3RTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0Esa0NBQWtDLG1EQUFtRDtBQUNyRjtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUZBQXVGO0FBQ3ZGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEM7QUFDOUMsa0RBQWtEO0FBQ2xEO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsS0FBSztBQUNMLENBQUMiLCJmaWxlIjoiYmFja2dyb3VuZFBhZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL2Nocm9tZS9zcmMvYmFja2dyb3VuZFBhZ2UudHNcIik7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIFVSSUFwaTogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA5MC8nLFxyXG4gICAgVVJJRnJvbnQ6ICdodHRwOi8vbG9jYWxob3N0OjQyMDAnXHJcbn07XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX3RoaXMgPSB0aGlzO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBjb25maWcgPSByZXF1aXJlKFwiLi4vLi4vYWxsUGFyYW0uY29uZmlnXCIpO1xyXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoZnVuY3Rpb24gKG1lc3NhZ2UsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSB7XHJcbiAgICB2YXIgb2JqRGF0YSA9IG1lc3NhZ2UuZGF0YTtcclxuICAgIGlmIChtZXNzYWdlLnR5cGUgPT09ICdzZW5kQmFja2dyb3VuZCcpIHtcclxuICAgICAgICB2YXIgcmVzdWx0XzEgPSAnJztcclxuICAgICAgICB2YXIgand0X3Rva2VuID0gb2JqRGF0YS50b2tlbjtcclxuICAgICAgICBkZWxldGUgb2JqRGF0YS50b2tlbjtcclxuICAgICAgICB2YXIgZmlsdGVyID0gSlNPTi5zdHJpbmdpZnkob2JqRGF0YSk7XHJcbiAgICAgICAgdmFyIHJlcXVlc3RfMSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHJlcXVlc3RfMS5vcGVuKCdQT1NUJywgY29uZmlnLlVSSUFwaSArICdhcGkvdHJhbnNsYXRlcycsIHRydWUpO1xyXG4gICAgICAgIHJlcXVlc3RfMS5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpO1xyXG4gICAgICAgIHJlcXVlc3RfMS5zZXRSZXF1ZXN0SGVhZGVyKCdBdXRob3JpemF0aW9uJywgXCJCZWFyZXIgXCIgKyBqd3RfdG9rZW4pO1xyXG4gICAgICAgIHJlcXVlc3RfMS5zZW5kKGZpbHRlcik7XHJcbiAgICAgICAgcmVxdWVzdF8xLm9ubG9hZCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChyZXF1ZXN0XzEucmVhZHlTdGF0ZSA9PT0gNCAmJiByZXF1ZXN0XzEuc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdF8xID0gSlNPTi5wYXJzZShyZXF1ZXN0XzEucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHR5cGU6ICdzZW5kVHJhbnNsYXRlTW9kYWwnLCBkYXRhOiByZXN1bHRfMSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAobWVzc2FnZS50eXBlID09PSAnc2VuZFRvRGljdGlvbmFyeScpIHtcclxuICAgICAgICB2YXIgcmVzdWx0XzIgPSAnJztcclxuICAgICAgICB2YXIgand0X3Rva2VuID0gb2JqRGF0YS50b2tlbjtcclxuICAgICAgICBkZWxldGUgb2JqRGF0YS50b2tlbjtcclxuICAgICAgICB2YXIgb2JqV29yZCA9IEpTT04uc3RyaW5naWZ5KG9iakRhdGEpO1xyXG4gICAgICAgIHZhciByZXF1ZXN0XzIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICByZXF1ZXN0XzIub3BlbignUE9TVCcsIGNvbmZpZy5VUklBcGkgKyAnYXBpL2RpY3Rpb25hcmllcycsIHRydWUpO1xyXG4gICAgICAgIHJlcXVlc3RfMi5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpO1xyXG4gICAgICAgIHJlcXVlc3RfMi5zZXRSZXF1ZXN0SGVhZGVyKCdBdXRob3JpemF0aW9uJywgXCJCZWFyZXIgXCIgKyBqd3RfdG9rZW4pO1xyXG4gICAgICAgIHJlcXVlc3RfMi5zZW5kKG9ialdvcmQpO1xyXG4gICAgICAgIHJlcXVlc3RfMi5vbmxvYWQgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAocmVxdWVzdF8yLnJlYWR5U3RhdGUgPT09IDQgJiYgcmVxdWVzdF8yLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRfMiA9IEpTT04ucGFyc2UocmVxdWVzdF8yLnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyB0eXBlOiAnc2VuZFJlc3VsdERpY3Rpb25hcnknLCBkYXRhOiByZXN1bHRfMiB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAobWVzc2FnZS50eXBlID09PSAnc2l0ZUF1dGgnKSB7XHJcbiAgICAgICAgX3RoaXMudXNlciA9IEpTT04ucGFyc2Uob2JqRGF0YS51c2VyKTtcclxuICAgICAgICBfdGhpcy50b2tlbiA9IG9iakRhdGEudG9rZW47XHJcbiAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgdG9rZW46IG9iakRhdGEudG9rZW4sIHVzZXI6IG9iakRhdGEudXNlciB9LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTZXQgdG9rZW4gYW5kIHVzZXInKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKG1lc3NhZ2UudHlwZSA9PT0gJ3NhdmVTZXR0aW5nJykge1xyXG4gICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHNldHRpbmdFeHRlbnNpb25BY3Rpb246IG9iakRhdGEuc2V0dGluZ0V4dGVuc2lvbiB9LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTZXQgc2V0dGluZyBleHRlbnNpb24nKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKG1lc3NhZ2UudHlwZSA9PT0gJ3NpdGVMb2dvdXQnKSB7XHJcbiAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwucmVtb3ZlKFsndG9rZW4nLCAndXNlcicsICdzZXR0aW5nRXh0ZW5zaW9uJ10pO1xyXG4gICAgfVxyXG59KTtcclxuc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xyXG4gICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFsndG9rZW4nLCAndXNlciddLCBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdC5oYXNPd25Qcm9wZXJ0eSgndG9rZW4nKSAmJiByZXN1bHQuaGFzT3duUHJvcGVydHkoJ3VzZXInKSkge1xyXG4gICAgICAgICAgICB2YXIgcmVxdWVzdFNldHRpbmdzUGx1Z2luXzEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgcmVxdWVzdFNldHRpbmdzUGx1Z2luXzEub3BlbignR0VUJywgY29uZmlnLlVSSUFwaSArICdhcGkvcGx1Z2lucy8nICsgcmVzdWx0LnVzZXIuaWQsIHRydWUpO1xyXG4gICAgICAgICAgICByZXF1ZXN0U2V0dGluZ3NQbHVnaW5fMS5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpO1xyXG4gICAgICAgICAgICByZXF1ZXN0U2V0dGluZ3NQbHVnaW5fMS5zZXRSZXF1ZXN0SGVhZGVyKCdBdXRob3JpemF0aW9uJywgXCJCZWFyZXIgXCIgKyByZXN1bHQudG9rZW4pO1xyXG4gICAgICAgICAgICByZXF1ZXN0U2V0dGluZ3NQbHVnaW5fMS5zZW5kKCk7XHJcbiAgICAgICAgICAgIHJlcXVlc3RTZXR0aW5nc1BsdWdpbl8xLm9ubG9hZCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVxdWVzdFNldHRpbmdzUGx1Z2luXzEucmVhZHlTdGF0ZSA9PT0gNCAmJiByZXF1ZXN0U2V0dGluZ3NQbHVnaW5fMS5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzZXR0aW5nUGx1Z2luID0gSlNPTi5wYXJzZShyZXF1ZXN0U2V0dGluZ3NQbHVnaW5fMS5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7IHNldHRpbmdFeHRlbnNpb25BY3Rpb246IFN0cmluZyhzZXR0aW5nUGx1Z2luLmV4dGVuc2lvblNob3dUcmFuc2xhdGUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VyOiBzZXR0aW5nUGx1Z2luLnVzZXIgfSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU2V0IG5ldyBzZXR0aW5nIGV4dGVuc2lvbiBhbmQgdXNlciBkYXRhJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59LCAzNjAwMDAwKTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==