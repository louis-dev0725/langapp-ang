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
        setting = localStorage.getItem(event.data.message);
        chrome.storage.sync.set({ settingExtension: setting }, function () {
            console.log('Set setting extension');
        });
        console.log(setting);
    }
    if (event.data.type && (event.data.type == 'Logout') && (event.origin == 'http://localhost:4200')) {
        chrome.runtime.sendMessage({ type: 'siteLogout' });
    }
});
chrome.storage.sync.get(['settingExtension'], function (result) {
    if (result.hasOwnProperty('settingExtension')) {
        setting = JSON.parse(result.settingExtension);
        console.log(setting);
    }
});
chrome.storage.sync.get(['token'], function (result) {
    if (result.hasOwnProperty('token')) {
        token = result.token;
        extensionSetting = true;
    }
});
if (extensionSetting) {
    if (setting === '') {
        setting = 'extension.DoubleClick';
    }
    console.log('Есть доступ к настройкам плагина и функционалу');
    document.addEventListener("dblclick", function (e) {
        //if (setting === 'extension.DoubleClick') {
        if ((e.metaKey === false || e.ctrlKey === false) && e.shiftKey === false && e.altKey === false) {
            console.log('Двойной клик');
        }
        //}
        //if (setting === 'extension.DoubleClickCtrl') {
        if ((e.metaKey === true || e.ctrlKey === true) && e.shiftKey === false && e.altKey === false) {
            console.log('Двойной клик + Ctrl');
        }
        //}
        //if (setting === 'extension.DoubleClickShift') {
        if ((e.metaKey === false || e.ctrlKey === false) && e.shiftKey === true && e.altKey === false) {
            console.log('Двойной клик + Shift');
        }
        //}
        //if (setting === 'extension.DoubleClickAlt') {
        if ((e.metaKey === false || e.ctrlKey === false) && e.shiftKey === false && e.altKey === true) {
            console.log('Двойной клик + Alt');
        }
        //}
        var selection = window.getSelection();
        console.log(selection.toString());
        console.log(e);
    });
}
// Послыаем данные куда-то в расширение
// chrome.extension.sendMessage();
// Принимаем данные от расширения
// chrome.extension.onMessage.addListener((request, sender, respond) => {});


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY2hyb21lL3NyYy9jb250ZW50UGFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQywwQkFBMEIsMkJBQTJCLEVBQUU7QUFDM0Y7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLDRCQUE0QjtBQUM3RDtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MscUJBQXFCO0FBQ3pEO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEVBQTBFIiwiZmlsZSI6ImNvbnRlbnRQYWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9jaHJvbWUvc3JjL2NvbnRlbnRQYWdlLnRzXCIpO1xuIiwidmFyIHRva2VuID0gJyc7XHJcbnZhciB1c2VyID0gJyc7XHJcbnZhciBleHRlbnNpb25TZXR0aW5nID0gZmFsc2U7XHJcbnZhciBzZXR0aW5nID0gJyc7XHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICBpZiAoZXZlbnQuc291cmNlICE9IHdpbmRvdykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGlmIChldmVudC5kYXRhLnR5cGUgJiYgKGV2ZW50LmRhdGEudHlwZSA9PSAnTG9naW5TdWNjZXNzJykgJiYgKGV2ZW50Lm9yaWdpbiA9PSAnaHR0cDovL2xvY2FsaG9zdDo0MjAwJykpIHtcclxuICAgICAgICB0b2tlbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b2tlbicpO1xyXG4gICAgICAgIHVzZXIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcicpO1xyXG4gICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHsgdHlwZTogJ3NpdGVBdXRoJywgZGF0YTogeyB0b2tlbjogdG9rZW4sIHVzZXI6IHVzZXIgfSB9KTtcclxuICAgIH1cclxuICAgIGlmIChldmVudC5kYXRhLnR5cGUgJiYgKGV2ZW50LmRhdGEudHlwZSA9PSAnc2F2ZVNldHRpbmdFeHRlbnNpb24nKSAmJiAoZXZlbnQub3JpZ2luID09ICdodHRwOi8vbG9jYWxob3N0OjQyMDAnKSkge1xyXG4gICAgICAgIHNldHRpbmcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShldmVudC5kYXRhLm1lc3NhZ2UpO1xyXG4gICAgICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHsgc2V0dGluZ0V4dGVuc2lvbjogc2V0dGluZyB9LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTZXQgc2V0dGluZyBleHRlbnNpb24nKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zb2xlLmxvZyhzZXR0aW5nKTtcclxuICAgIH1cclxuICAgIGlmIChldmVudC5kYXRhLnR5cGUgJiYgKGV2ZW50LmRhdGEudHlwZSA9PSAnTG9nb3V0JykgJiYgKGV2ZW50Lm9yaWdpbiA9PSAnaHR0cDovL2xvY2FsaG9zdDo0MjAwJykpIHtcclxuICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7IHR5cGU6ICdzaXRlTG9nb3V0JyB9KTtcclxuICAgIH1cclxufSk7XHJcbmNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KFsnc2V0dGluZ0V4dGVuc2lvbiddLCBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICBpZiAocmVzdWx0Lmhhc093blByb3BlcnR5KCdzZXR0aW5nRXh0ZW5zaW9uJykpIHtcclxuICAgICAgICBzZXR0aW5nID0gSlNPTi5wYXJzZShyZXN1bHQuc2V0dGluZ0V4dGVuc2lvbik7XHJcbiAgICAgICAgY29uc29sZS5sb2coc2V0dGluZyk7XHJcbiAgICB9XHJcbn0pO1xyXG5jaHJvbWUuc3RvcmFnZS5zeW5jLmdldChbJ3Rva2VuJ10sIGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgIGlmIChyZXN1bHQuaGFzT3duUHJvcGVydHkoJ3Rva2VuJykpIHtcclxuICAgICAgICB0b2tlbiA9IHJlc3VsdC50b2tlbjtcclxuICAgICAgICBleHRlbnNpb25TZXR0aW5nID0gdHJ1ZTtcclxuICAgIH1cclxufSk7XHJcbmlmIChleHRlbnNpb25TZXR0aW5nKSB7XHJcbiAgICBpZiAoc2V0dGluZyA9PT0gJycpIHtcclxuICAgICAgICBzZXR0aW5nID0gJ2V4dGVuc2lvbi5Eb3VibGVDbGljayc7XHJcbiAgICB9XHJcbiAgICBjb25zb2xlLmxvZygn0JXRgdGC0Ywg0LTQvtGB0YLRg9C/INC6INC90LDRgdGC0YDQvtC50LrQsNC8INC/0LvQsNCz0LjQvdCwINC4INGE0YPQvdC60YbQuNC+0L3QsNC70YMnKTtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkYmxjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIC8vaWYgKHNldHRpbmcgPT09ICdleHRlbnNpb24uRG91YmxlQ2xpY2snKSB7XHJcbiAgICAgICAgaWYgKChlLm1ldGFLZXkgPT09IGZhbHNlIHx8IGUuY3RybEtleSA9PT0gZmFsc2UpICYmIGUuc2hpZnRLZXkgPT09IGZhbHNlICYmIGUuYWx0S2V5ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygn0JTQstC+0LnQvdC+0Lkg0LrQu9C40LonKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy99XHJcbiAgICAgICAgLy9pZiAoc2V0dGluZyA9PT0gJ2V4dGVuc2lvbi5Eb3VibGVDbGlja0N0cmwnKSB7XHJcbiAgICAgICAgaWYgKChlLm1ldGFLZXkgPT09IHRydWUgfHwgZS5jdHJsS2V5ID09PSB0cnVlKSAmJiBlLnNoaWZ0S2V5ID09PSBmYWxzZSAmJiBlLmFsdEtleSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ9CU0LLQvtC50L3QvtC5INC60LvQuNC6ICsgQ3RybCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL31cclxuICAgICAgICAvL2lmIChzZXR0aW5nID09PSAnZXh0ZW5zaW9uLkRvdWJsZUNsaWNrU2hpZnQnKSB7XHJcbiAgICAgICAgaWYgKChlLm1ldGFLZXkgPT09IGZhbHNlIHx8IGUuY3RybEtleSA9PT0gZmFsc2UpICYmIGUuc2hpZnRLZXkgPT09IHRydWUgJiYgZS5hbHRLZXkgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCfQlNCy0L7QudC90L7QuSDQutC70LjQuiArIFNoaWZ0Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vfVxyXG4gICAgICAgIC8vaWYgKHNldHRpbmcgPT09ICdleHRlbnNpb24uRG91YmxlQ2xpY2tBbHQnKSB7XHJcbiAgICAgICAgaWYgKChlLm1ldGFLZXkgPT09IGZhbHNlIHx8IGUuY3RybEtleSA9PT0gZmFsc2UpICYmIGUuc2hpZnRLZXkgPT09IGZhbHNlICYmIGUuYWx0S2V5ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCfQlNCy0L7QudC90L7QuSDQutC70LjQuiArIEFsdCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL31cclxuICAgICAgICB2YXIgc2VsZWN0aW9uID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHNlbGVjdGlvbi50b1N0cmluZygpKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgIH0pO1xyXG59XHJcbi8vINCf0L7RgdC70YvQsNC10Lwg0LTQsNC90L3Ri9C1INC60YPQtNCwLdGC0L4g0LIg0YDQsNGB0YjQuNGA0LXQvdC40LVcclxuLy8gY2hyb21lLmV4dGVuc2lvbi5zZW5kTWVzc2FnZSgpO1xyXG4vLyDQn9GA0LjQvdC40LzQsNC10Lwg0LTQsNC90L3Ri9C1INC+0YIg0YDQsNGB0YjQuNGA0LXQvdC40Y9cclxuLy8gY2hyb21lLmV4dGVuc2lvbi5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKHJlcXVlc3QsIHNlbmRlciwgcmVzcG9uZCkgPT4ge30pO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9