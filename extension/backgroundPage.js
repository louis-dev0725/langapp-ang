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

Object.defineProperty(exports, "__esModule", { value: true });
var config = __webpack_require__(/*! ../../allParam.config */ "./allParam.config.js");
var token = '';
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    var objData = message.data;
    var result = '';
    if (message.type === 'sendBackground') {
        var objWord = JSON.stringify(objData);
        var request_1 = new XMLHttpRequest();
        request_1.open('POST', config.URIApi + 'api/translates', true);
        request_1.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        request_1.setRequestHeader('Authorization', "Bearer " + token);
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
        var objWord = JSON.stringify(objData);
        var request_2 = new XMLHttpRequest();
        request_2.open('POST', config.URIApi + 'api/translates/select', true);
        request_2.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        request_2.setRequestHeader('Authorization', "Bearer " + token);
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
        var objWord = JSON.stringify(objData);
        var request_3 = new XMLHttpRequest();
        request_3.open('POST', config.URIApi + 'api/dictionaries', true);
        request_3.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        request_3.setRequestHeader('Authorization', "Bearer " + token);
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
        var user = JSON.parse(objData.user);
        token = objData.token;
        chrome.storage.local.set({ token: token, user: user }, function () {
            console.log('Set token and user');
        });
    }
    else if (message.type === 'saveSetting') {
        chrome.storage.local.set({ settingExtensionAction: objData.settingExtension }, function () {
            console.log('Set setting extension');
        });
    }
    else if (message.type === 'siteLogout') {
        token = '';
        chrome.storage.local.clear(function () {
            console.log('Remove extension, token, user');
        });
    }
    else if (message.type === 'setToToken') {
        chrome.storage.local.get(['token'], function (result) {
            if (result.hasOwnProperty('token')) {
                token = result.token;
                console.log('Writing a token into a variable');
            }
        });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vYWxsUGFyYW0uY29uZmlnLmpzIiwid2VicGFjazovLy8uL2Nocm9tZS9zcmMvYmFja2dyb3VuZFBhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDSGE7QUFDYiw4Q0FBOEMsY0FBYztBQUM1RCxhQUFhLG1CQUFPLENBQUMsbURBQXVCO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxRUFBcUU7QUFDckU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QiwyQ0FBMkM7QUFDekU7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUVBQXFFO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsMkNBQTJDO0FBQ3pFO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFFQUFxRTtBQUNyRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLDZDQUE2QztBQUMzRTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLDJCQUEyQjtBQUM3RDtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0Esa0NBQWtDLG1EQUFtRDtBQUNyRjtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1RkFBdUY7QUFDdkY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QztBQUM5QyxrREFBa0Q7QUFDbEQ7QUFDQSxxQkFBcUI7QUFDckI7QUFDQSxhQUFhO0FBQ2I7QUFDQSxLQUFLO0FBQ0wsQ0FBQyIsImZpbGUiOiJiYWNrZ3JvdW5kUGFnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vY2hyb21lL3NyYy9iYWNrZ3JvdW5kUGFnZS50c1wiKTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgVVJJQXBpOiAnaHR0cDovL2xvY2FsaG9zdDo4MDkwLycsXHJcbiAgICBVUklGcm9udDogJ2h0dHA6Ly9sb2NhbGhvc3Q6NDIwMCdcclxufTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGNvbmZpZyA9IHJlcXVpcmUoXCIuLi8uLi9hbGxQYXJhbS5jb25maWdcIik7XHJcbnZhciB0b2tlbiA9ICcnO1xyXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoZnVuY3Rpb24gKG1lc3NhZ2UsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSB7XHJcbiAgICB2YXIgb2JqRGF0YSA9IG1lc3NhZ2UuZGF0YTtcclxuICAgIHZhciByZXN1bHQgPSAnJztcclxuICAgIGlmIChtZXNzYWdlLnR5cGUgPT09ICdzZW5kQmFja2dyb3VuZCcpIHtcclxuICAgICAgICB2YXIgb2JqV29yZCA9IEpTT04uc3RyaW5naWZ5KG9iakRhdGEpO1xyXG4gICAgICAgIHZhciByZXF1ZXN0XzEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICByZXF1ZXN0XzEub3BlbignUE9TVCcsIGNvbmZpZy5VUklBcGkgKyAnYXBpL3RyYW5zbGF0ZXMnLCB0cnVlKTtcclxuICAgICAgICByZXF1ZXN0XzEuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTtcclxuICAgICAgICByZXF1ZXN0XzEuc2V0UmVxdWVzdEhlYWRlcignQXV0aG9yaXphdGlvbicsIFwiQmVhcmVyIFwiICsgdG9rZW4pO1xyXG4gICAgICAgIHJlcXVlc3RfMS5zZW5kKG9ialdvcmQpO1xyXG4gICAgICAgIHJlcXVlc3RfMS5vbmxvYWQgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAocmVxdWVzdF8xLnJlYWR5U3RhdGUgPT09IDQgJiYgcmVxdWVzdF8xLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKHJlcXVlc3RfMS5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHsgdHlwZTogJ3NlbmRUcmFuc2xhdGVNb2RhbCcsIGRhdGE6IHJlc3VsdCB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAobWVzc2FnZS50eXBlID09PSAnc2VuZFNlbGVjdGVkQmFja2dyb3VuZCcpIHtcclxuICAgICAgICB2YXIgb2JqV29yZCA9IEpTT04uc3RyaW5naWZ5KG9iakRhdGEpO1xyXG4gICAgICAgIHZhciByZXF1ZXN0XzIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICByZXF1ZXN0XzIub3BlbignUE9TVCcsIGNvbmZpZy5VUklBcGkgKyAnYXBpL3RyYW5zbGF0ZXMvc2VsZWN0JywgdHJ1ZSk7XHJcbiAgICAgICAgcmVxdWVzdF8yLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7XHJcbiAgICAgICAgcmVxdWVzdF8yLnNldFJlcXVlc3RIZWFkZXIoJ0F1dGhvcml6YXRpb24nLCBcIkJlYXJlciBcIiArIHRva2VuKTtcclxuICAgICAgICByZXF1ZXN0XzIuc2VuZChvYmpXb3JkKTtcclxuICAgICAgICByZXF1ZXN0XzIub25sb2FkID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHJlcXVlc3RfMi5yZWFkeVN0YXRlID09PSA0ICYmIHJlcXVlc3RfMi5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZShyZXF1ZXN0XzIucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHR5cGU6ICdzZW5kVHJhbnNsYXRlTW9kYWwnLCBkYXRhOiByZXN1bHQgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKG1lc3NhZ2UudHlwZSA9PT0gJ3NlbmRUb0RpY3Rpb25hcnknKSB7XHJcbiAgICAgICAgdmFyIG9ialdvcmQgPSBKU09OLnN0cmluZ2lmeShvYmpEYXRhKTtcclxuICAgICAgICB2YXIgcmVxdWVzdF8zID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgcmVxdWVzdF8zLm9wZW4oJ1BPU1QnLCBjb25maWcuVVJJQXBpICsgJ2FwaS9kaWN0aW9uYXJpZXMnLCB0cnVlKTtcclxuICAgICAgICByZXF1ZXN0XzMuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTtcclxuICAgICAgICByZXF1ZXN0XzMuc2V0UmVxdWVzdEhlYWRlcignQXV0aG9yaXphdGlvbicsIFwiQmVhcmVyIFwiICsgdG9rZW4pO1xyXG4gICAgICAgIHJlcXVlc3RfMy5zZW5kKG9ialdvcmQpO1xyXG4gICAgICAgIHJlcXVlc3RfMy5vbmxvYWQgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAocmVxdWVzdF8zLnJlYWR5U3RhdGUgPT09IDQgJiYgcmVxdWVzdF8zLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKHJlcXVlc3RfMy5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHsgdHlwZTogJ3NlbmRSZXN1bHREaWN0aW9uYXJ5JywgZGF0YTogcmVzdWx0IH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChtZXNzYWdlLnR5cGUgPT09ICdzaXRlQXV0aCcpIHtcclxuICAgICAgICB2YXIgdXNlciA9IEpTT04ucGFyc2Uob2JqRGF0YS51c2VyKTtcclxuICAgICAgICB0b2tlbiA9IG9iakRhdGEudG9rZW47XHJcbiAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgdG9rZW46IHRva2VuLCB1c2VyOiB1c2VyIH0sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1NldCB0b2tlbiBhbmQgdXNlcicpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAobWVzc2FnZS50eXBlID09PSAnc2F2ZVNldHRpbmcnKSB7XHJcbiAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgc2V0dGluZ0V4dGVuc2lvbkFjdGlvbjogb2JqRGF0YS5zZXR0aW5nRXh0ZW5zaW9uIH0sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1NldCBzZXR0aW5nIGV4dGVuc2lvbicpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAobWVzc2FnZS50eXBlID09PSAnc2l0ZUxvZ291dCcpIHtcclxuICAgICAgICB0b2tlbiA9ICcnO1xyXG4gICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmNsZWFyKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1JlbW92ZSBleHRlbnNpb24sIHRva2VuLCB1c2VyJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChtZXNzYWdlLnR5cGUgPT09ICdzZXRUb1Rva2VuJykge1xyXG4gICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbJ3Rva2VuJ10sIGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdC5oYXNPd25Qcm9wZXJ0eSgndG9rZW4nKSkge1xyXG4gICAgICAgICAgICAgICAgdG9rZW4gPSByZXN1bHQudG9rZW47XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnV3JpdGluZyBhIHRva2VuIGludG8gYSB2YXJpYWJsZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0pO1xyXG5zZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XHJcbiAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoWyd0b2tlbicsICd1c2VyJ10sIGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICBpZiAocmVzdWx0Lmhhc093blByb3BlcnR5KCd0b2tlbicpICYmIHJlc3VsdC5oYXNPd25Qcm9wZXJ0eSgndXNlcicpKSB7XHJcbiAgICAgICAgICAgIHZhciByZXF1ZXN0U2V0dGluZ3NQbHVnaW5fMSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICByZXF1ZXN0U2V0dGluZ3NQbHVnaW5fMS5vcGVuKCdHRVQnLCBjb25maWcuVVJJQXBpICsgJ2FwaS9wbHVnaW5zLycgKyByZXN1bHQudXNlci5pZCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHJlcXVlc3RTZXR0aW5nc1BsdWdpbl8xLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7XHJcbiAgICAgICAgICAgIHJlcXVlc3RTZXR0aW5nc1BsdWdpbl8xLnNldFJlcXVlc3RIZWFkZXIoJ0F1dGhvcml6YXRpb24nLCBcIkJlYXJlciBcIiArIHJlc3VsdC50b2tlbik7XHJcbiAgICAgICAgICAgIHJlcXVlc3RTZXR0aW5nc1BsdWdpbl8xLnNlbmQoKTtcclxuICAgICAgICAgICAgcmVxdWVzdFNldHRpbmdzUGx1Z2luXzEub25sb2FkID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXF1ZXN0U2V0dGluZ3NQbHVnaW5fMS5yZWFkeVN0YXRlID09PSA0ICYmIHJlcXVlc3RTZXR0aW5nc1BsdWdpbl8xLnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNldHRpbmdQbHVnaW4gPSBKU09OLnBhcnNlKHJlcXVlc3RTZXR0aW5nc1BsdWdpbl8xLnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgc2V0dGluZ0V4dGVuc2lvbkFjdGlvbjogU3RyaW5nKHNldHRpbmdQbHVnaW4uZXh0ZW5zaW9uU2hvd1RyYW5zbGF0ZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXI6IHNldHRpbmdQbHVnaW4udXNlciB9LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTZXQgbmV3IHNldHRpbmcgZXh0ZW5zaW9uIGFuZCB1c2VyIGRhdGEnKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn0sIDM2MDAwMDApO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9