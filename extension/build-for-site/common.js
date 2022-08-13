module.exports =
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
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : undefined
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = function anonymous(locals, escapeFn, include, rethrow
) {
"use strict";
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<div id=\"modalOuter\">\n    <a id=\"closeModal\"><span></span></a>\n    <div id=\"modalBody\">\n        \n    </div>\n</div>")
  return __output;

}

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = function anonymous(locals, escapeFn, include, rethrow
) {
"use strict";
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ;  if (locals.text) { 
    ; __append("\n<h3>")
    ; __append(escapeFn( locals.text ))
    ; __append("</h3>\n")
    ;  } 
  return __output;

}

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = function anonymous(locals, escapeFn, include, rethrow
) {
"use strict";
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ;  if (locals.response && locals.response.words) { 
    ; __append("\n<!--<div id=\"modal-translate-header\" style=\"display: flex; flex-flow: row nowrap; width: 100%; justify-content: space-between;\">\n</div>-->\n<div id=\"modal-translate-body\" class=\"response\" style=\"box-sizing: border-box; display: flex; flex-flow: column nowrap; width: 100%;\" lang=\"ja-JP\">\n    ")
    ;  for (let word of locals.response.words) { 
    ; __append("\n        <div class=\"word-variant\" data-word=\"")
    ; __append(escapeFn( JSON.stringify(word) ))
    ; __append("\">\n            ")
    ;  for (let [i, reading] of word.readings.entries()) { 
    ; __append("\n                <div class=\"reading-variant")
    ; __append(escapeFn( reading.common ? ' reading-variant-common' : ' reading-variant-uncommon' ))
    ; __append(escapeFn( reading.current ? ' reading-variant-current' : '' ))
    ; __append(escapeFn( reading.currentMain ? ' reading-variant-current-main' : '' ))
    ; __append("\">\n                    <ruby>\n                        ")
    ;  for (let f of reading.furigana) { 
    ; __append("\n                            ")
    ; __append(escapeFn( f.ruby ))
    ; __append("\n                            <rt>")
    ; __append(escapeFn( f.rt || '' ))
    ; __append("</rt>\n                        ")
    ;  } 
    ; __append("\n                    </ruby>\n                </div>\n            ")
    ;  } 
    ; __append("\n            \n            <div class=\"meanings\">\n                ")
    ;  for (let translation of word.meanings) { 
    ; __append("\n                <div class=\"meaning-variant\" data-meaning=\"")
    ; __append(escapeFn( JSON.stringify(translation) ))
    ; __append("\">")
    ; __append(escapeFn( translation.value ))
    ; __append("</div>\n                ")
    ;  } 
    ; __append("\n            </div>\n        </div>\n    ")
    ;  } 
    ; __append("\n</div>\n")
    ;  } 
  return __output;

}

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = function anonymous(locals, escapeFn, include, rethrow
) {
"use strict";
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<style>\n    :host {\n        all: initial;\n        font-size: 16px;\n        font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n    }\n\n    #modalOuter {\n        position: absolute;\n        \n        /* Dynamically changes in JS */\n        width: 400px;\n        height: auto;\n        max-height: 60vh;\n        \n        overflow-y: auto;\n        display: flex;\n        flex-flow: column;\n        /*background: rgb(255, 255, 255);\n        border-radius: 10px;\n        padding: 10px;\n        border: 1px solid rgb(0, 0, 0);*/\n\n        background: #FDFEFF;\n        padding: 12px 16px;\n        box-sizing: border-box;\n        box-shadow: 0 3px 3px -2px rgba(0, 0, 0, .2), 0 3px 4px 0 rgba(0, 0, 0, .14), 0 1px 8px 0 rgba(0, 0, 0, .12);\n        -moz-border-radius: 5px;\n        -webkit-border-radius: 5px;\n        border-radius: 5px;\n        z-index: 999999;\n    }\n\n    #closeModal {\n        cursor: pointer;\n        position: absolute;\n        right: 0;\n        top: 0;\n        border: none;\n        background: transparent;\n        padding: 8px 6px;\n        margin: 0px;\n        font-size: 20px;\n        font-weight: 700;\n        margin-left: auto;\n    }\n\n    #closeModal span {\n        background: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pjxzdmcgdmlld0JveD0iMCAwIDMyIDMyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxzdHlsZT4uY2xzLTF7ZmlsbDpub25lO3N0cm9rZTojMDAwO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utd2lkdGg6MnB4O308L3N0eWxlPjwvZGVmcz48dGl0bGUvPjxnIGlkPSJjcm9zcyI+PGxpbmUgY2xhc3M9ImNscy0xIiB4MT0iNyIgeDI9IjI1IiB5MT0iNyIgeTI9IjI1Ii8+PGxpbmUgY2xhc3M9ImNscy0xIiB4MT0iNyIgeDI9IjI1IiB5MT0iMjUiIHkyPSI3Ii8+PC9nPjwvc3ZnPg==') no-repeat;\n        display: block;\n        width: 20px;\n        height: 20px;\n    }\n\n    #closeModal:hover {\n        opacity: 0.8;\n    }\n\n    .word-variant {\n        margin-bottom: 20px;\n    }\n\n    .reading-variant {\n        font-size: 28px;\n        display: none;\n    }\n\n    .reading-variant-uncommon {\n        opacity: 0.5;\n    }\n\n    .reading-variant-current-main {\n        display: block;\n    }\n\n    /*.reading-variant-current {\n        color: green;\n    }*/\n\n    .meanings {\n        margin-top: 12px;\n        padding: 0.25rem 0;\n        background: #FDFEFF;\n        color: #515C66;\n        border: 1px solid #E4E5E5;\n        border-radius: 5px;\n    }\n\n    .meaning-variant {\n        cursor: pointer;\n        margin: 0;\n        padding: 0.5rem 1rem;\n        border: 0 none;\n        color: #515C66;\n        transition: box-shadow 0.2s;\n        border-radius: 0;\n    }\n\n    .meaning-variant:hover {\n        color: #515C66;\n        background: rgba(232, 241, 248, 0.7);\n    }\n</style>")
  return __output;

}

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = function anonymous(locals, escapeFn, include, rethrow
) {
"use strict";
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<div class=\"snackbar-container\">\n    ")
    ; __append(escapeFn( locals.text ))
    ; __append("\n</div>")
  return __output;

}

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = function anonymous(locals, escapeFn, include, rethrow
) {
"use strict";
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
    ; __append("<style>\n    :host {\n        all: initial;\n    }\n\n    .snackbar-container {\n        transition: all 500ms ease;\n        transition-property: top, right, bottom, left, opacity;\n        font-family: Roboto, sans-serif;\n        font-size: 14px;\n        min-height: 14px;\n        background-color: #070b0e;\n        position: fixed;\n        display: flex;\n        justify-content: space-between;\n        align-items: center;\n        color: white;\n        line-height: 22px;\n        padding: 18px 24px;\n        bottom: -100px;\n        top: -100px;\n        opacity: 0;\n        z-index: 9999;\n    }\n\n    .snackbar-container .action {\n        background: inherit;\n        display: inline-block;\n        border: none;\n        font-size: inherit;\n        text-transform: uppercase;\n        color: #4caf50;\n        margin: 0 0 0 24px;\n        padding: 0;\n        min-width: min-content;\n        cursor: pointer;\n    }\n\n    @media (min-width: 640px) {\n        .snackbar-container {\n            min-width: 288px;\n            max-width: 568px;\n            display: inline-flex;\n            border-radius: 2px;\n            margin: 24px;\n        }\n    }\n\n    @media (max-width: 640px) {\n        .snackbar-container {\n            left: 0;\n            right: 0;\n            width: 100%;\n        }\n    }\n\n    .snackbar-pos.bottom-center {\n        top: auto !important;\n        bottom: 0;\n        left: 50%;\n        transform: translate(-50%, 0);\n    }\n\n    .snackbar-pos.bottom-left {\n        top: auto !important;\n        bottom: 0;\n        left: 0;\n    }\n\n    .snackbar-pos.bottom-right {\n        top: auto !important;\n        bottom: 0;\n        right: 0;\n    }\n\n    .snackbar-pos.top-left {\n        bottom: auto !important;\n        top: 0;\n        left: 0;\n    }\n\n    .snackbar-pos.top-center {\n        bottom: auto !important;\n        top: 0;\n        left: 50%;\n        transform: translate(-50%, 0);\n    }\n\n    .snackbar-pos.top-right {\n        bottom: auto !important;\n        top: 0;\n        right: 0;\n    }\n\n    @media (max-width: 640px) {\n        .snackbar-pos.bottom-center,\n        .snackbar-pos.top-center {\n            left: 0;\n            transform: none;\n        }\n    }\n</style>")
  return __output;

}

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "caretRangeFromPoint", function() { return /* reexport */ caretRangeFromPoint; });
__webpack_require__.d(__webpack_exports__, "state", function() { return /* binding */ state; });
__webpack_require__.d(__webpack_exports__, "isStringContainsJapanese", function() { return /* binding */ isStringContainsJapanese; });
__webpack_require__.d(__webpack_exports__, "showForRange", function() { return /* binding */ showForRange; });

// EXTERNAL MODULE: ./node_modules/@babel/runtime/regenerator/index.js
var regenerator = __webpack_require__(0);
var regenerator_default = /*#__PURE__*/__webpack_require__.n(regenerator);

// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/typeof.js
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/defineProperty.js
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/objectSpread.js

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? Object(arguments[i]) : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/createClass.js
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js


function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/inherits.js

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
// CONCATENATED MODULE: ./node_modules/i18next/dist/esm/i18next.js









var consoleLogger = {
  type: 'logger',
  log: function log(args) {
    this.output('log', args);
  },
  warn: function warn(args) {
    this.output('warn', args);
  },
  error: function error(args) {
    this.output('error', args);
  },
  output: function output(type, args) {
    if (console && console[type]) console[type].apply(console, args);
  }
};

var i18next_Logger = function () {
  function Logger(concreteLogger) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Logger);

    this.init(concreteLogger, options);
  }

  _createClass(Logger, [{
    key: "init",
    value: function init(concreteLogger) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      this.prefix = options.prefix || 'i18next:';
      this.logger = concreteLogger || consoleLogger;
      this.options = options;
      this.debug = options.debug;
    }
  }, {
    key: "setDebug",
    value: function setDebug(bool) {
      this.debug = bool;
    }
  }, {
    key: "log",
    value: function log() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return this.forward(args, 'log', '', true);
    }
  }, {
    key: "warn",
    value: function warn() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return this.forward(args, 'warn', '', true);
    }
  }, {
    key: "error",
    value: function error() {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return this.forward(args, 'error', '');
    }
  }, {
    key: "deprecate",
    value: function deprecate() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      return this.forward(args, 'warn', 'WARNING DEPRECATED: ', true);
    }
  }, {
    key: "forward",
    value: function forward(args, lvl, prefix, debugOnly) {
      if (debugOnly && !this.debug) return null;
      if (typeof args[0] === 'string') args[0] = "".concat(prefix).concat(this.prefix, " ").concat(args[0]);
      return this.logger[lvl](args);
    }
  }, {
    key: "create",
    value: function create(moduleName) {
      return new Logger(this.logger, _objectSpread({}, {
        prefix: "".concat(this.prefix, ":").concat(moduleName, ":")
      }, this.options));
    }
  }]);

  return Logger;
}();

var baseLogger = new i18next_Logger();

var i18next_EventEmitter = function () {
  function EventEmitter() {
    _classCallCheck(this, EventEmitter);

    this.observers = {};
  }

  _createClass(EventEmitter, [{
    key: "on",
    value: function on(events, listener) {
      var _this = this;

      events.split(' ').forEach(function (event) {
        _this.observers[event] = _this.observers[event] || [];

        _this.observers[event].push(listener);
      });
      return this;
    }
  }, {
    key: "off",
    value: function off(event, listener) {
      if (!this.observers[event]) return;

      if (!listener) {
        delete this.observers[event];
        return;
      }

      this.observers[event] = this.observers[event].filter(function (l) {
        return l !== listener;
      });
    }
  }, {
    key: "emit",
    value: function emit(event) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (this.observers[event]) {
        var cloned = [].concat(this.observers[event]);
        cloned.forEach(function (observer) {
          observer.apply(void 0, args);
        });
      }

      if (this.observers['*']) {
        var _cloned = [].concat(this.observers['*']);

        _cloned.forEach(function (observer) {
          observer.apply(observer, [event].concat(args));
        });
      }
    }
  }]);

  return EventEmitter;
}();

function defer() {
  var res;
  var rej;
  var promise = new Promise(function (resolve, reject) {
    res = resolve;
    rej = reject;
  });
  promise.resolve = res;
  promise.reject = rej;
  return promise;
}
function makeString(object) {
  if (object == null) return '';
  return '' + object;
}
function i18next_copy(a, s, t) {
  a.forEach(function (m) {
    if (s[m]) t[m] = s[m];
  });
}

function getLastOfPath(object, path, Empty) {
  function cleanKey(key) {
    return key && key.indexOf('###') > -1 ? key.replace(/###/g, '.') : key;
  }

  function canNotTraverseDeeper() {
    return !object || typeof object === 'string';
  }

  var stack = typeof path !== 'string' ? [].concat(path) : path.split('.');

  while (stack.length > 1) {
    if (canNotTraverseDeeper()) return {};
    var key = cleanKey(stack.shift());
    if (!object[key] && Empty) object[key] = new Empty();

    if (Object.prototype.hasOwnProperty.call(object, key)) {
      object = object[key];
    } else {
      object = {};
    }
  }

  if (canNotTraverseDeeper()) return {};
  return {
    obj: object,
    k: cleanKey(stack.shift())
  };
}

function setPath(object, path, newValue) {
  var _getLastOfPath = getLastOfPath(object, path, Object),
      obj = _getLastOfPath.obj,
      k = _getLastOfPath.k;

  obj[k] = newValue;
}
function pushPath(object, path, newValue, concat) {
  var _getLastOfPath2 = getLastOfPath(object, path, Object),
      obj = _getLastOfPath2.obj,
      k = _getLastOfPath2.k;

  obj[k] = obj[k] || [];
  if (concat) obj[k] = obj[k].concat(newValue);
  if (!concat) obj[k].push(newValue);
}
function getPath(object, path) {
  var _getLastOfPath3 = getLastOfPath(object, path),
      obj = _getLastOfPath3.obj,
      k = _getLastOfPath3.k;

  if (!obj) return undefined;
  return obj[k];
}
function getPathWithDefaults(data, defaultData, key) {
  var value = getPath(data, key);

  if (value !== undefined) {
    return value;
  }

  return getPath(defaultData, key);
}
function deepExtend(target, source, overwrite) {
  for (var prop in source) {
    if (prop !== '__proto__' && prop !== 'constructor') {
      if (prop in target) {
        if (typeof target[prop] === 'string' || target[prop] instanceof String || typeof source[prop] === 'string' || source[prop] instanceof String) {
          if (overwrite) target[prop] = source[prop];
        } else {
          deepExtend(target[prop], source[prop], overwrite);
        }
      } else {
        target[prop] = source[prop];
      }
    }
  }

  return target;
}
function regexEscape(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}
var _entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;'
};
function i18next_escape(data) {
  if (typeof data === 'string') {
    return data.replace(/[&<>"'\/]/g, function (s) {
      return _entityMap[s];
    });
  }

  return data;
}
var isIE10 = typeof window !== 'undefined' && window.navigator && window.navigator.userAgent && window.navigator.userAgent.indexOf('MSIE') > -1;

var i18next_ResourceStore = function (_EventEmitter) {
  _inherits(ResourceStore, _EventEmitter);

  function ResourceStore(data) {
    var _this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      ns: ['translation'],
      defaultNS: 'translation'
    };

    _classCallCheck(this, ResourceStore);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ResourceStore).call(this));

    if (isIE10) {
      i18next_EventEmitter.call(_assertThisInitialized(_this));
    }

    _this.data = data || {};
    _this.options = options;

    if (_this.options.keySeparator === undefined) {
      _this.options.keySeparator = '.';
    }

    return _this;
  }

  _createClass(ResourceStore, [{
    key: "addNamespaces",
    value: function addNamespaces(ns) {
      if (this.options.ns.indexOf(ns) < 0) {
        this.options.ns.push(ns);
      }
    }
  }, {
    key: "removeNamespaces",
    value: function removeNamespaces(ns) {
      var index = this.options.ns.indexOf(ns);

      if (index > -1) {
        this.options.ns.splice(index, 1);
      }
    }
  }, {
    key: "getResource",
    value: function getResource(lng, ns, key) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var keySeparator = options.keySeparator !== undefined ? options.keySeparator : this.options.keySeparator;
      var path = [lng, ns];
      if (key && typeof key !== 'string') path = path.concat(key);
      if (key && typeof key === 'string') path = path.concat(keySeparator ? key.split(keySeparator) : key);

      if (lng.indexOf('.') > -1) {
        path = lng.split('.');
      }

      return getPath(this.data, path);
    }
  }, {
    key: "addResource",
    value: function addResource(lng, ns, key, value) {
      var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {
        silent: false
      };
      var keySeparator = this.options.keySeparator;
      if (keySeparator === undefined) keySeparator = '.';
      var path = [lng, ns];
      if (key) path = path.concat(keySeparator ? key.split(keySeparator) : key);

      if (lng.indexOf('.') > -1) {
        path = lng.split('.');
        value = ns;
        ns = path[1];
      }

      this.addNamespaces(ns);
      setPath(this.data, path, value);
      if (!options.silent) this.emit('added', lng, ns, key, value);
    }
  }, {
    key: "addResources",
    value: function addResources(lng, ns, resources) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
        silent: false
      };

      for (var m in resources) {
        if (typeof resources[m] === 'string' || Object.prototype.toString.apply(resources[m]) === '[object Array]') this.addResource(lng, ns, m, resources[m], {
          silent: true
        });
      }

      if (!options.silent) this.emit('added', lng, ns, resources);
    }
  }, {
    key: "addResourceBundle",
    value: function addResourceBundle(lng, ns, resources, deep, overwrite) {
      var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {
        silent: false
      };
      var path = [lng, ns];

      if (lng.indexOf('.') > -1) {
        path = lng.split('.');
        deep = resources;
        resources = ns;
        ns = path[1];
      }

      this.addNamespaces(ns);
      var pack = getPath(this.data, path) || {};

      if (deep) {
        deepExtend(pack, resources, overwrite);
      } else {
        pack = _objectSpread({}, pack, resources);
      }

      setPath(this.data, path, pack);
      if (!options.silent) this.emit('added', lng, ns, resources);
    }
  }, {
    key: "removeResourceBundle",
    value: function removeResourceBundle(lng, ns) {
      if (this.hasResourceBundle(lng, ns)) {
        delete this.data[lng][ns];
      }

      this.removeNamespaces(ns);
      this.emit('removed', lng, ns);
    }
  }, {
    key: "hasResourceBundle",
    value: function hasResourceBundle(lng, ns) {
      return this.getResource(lng, ns) !== undefined;
    }
  }, {
    key: "getResourceBundle",
    value: function getResourceBundle(lng, ns) {
      if (!ns) ns = this.options.defaultNS;
      if (this.options.compatibilityAPI === 'v1') return _objectSpread({}, {}, this.getResource(lng, ns));
      return this.getResource(lng, ns);
    }
  }, {
    key: "getDataByLanguage",
    value: function getDataByLanguage(lng) {
      return this.data[lng];
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return this.data;
    }
  }]);

  return ResourceStore;
}(i18next_EventEmitter);

var postProcessor = {
  processors: {},
  addPostProcessor: function addPostProcessor(module) {
    this.processors[module.name] = module;
  },
  handle: function handle(processors, value, key, options, translator) {
    var _this = this;

    processors.forEach(function (processor) {
      if (_this.processors[processor]) value = _this.processors[processor].process(value, key, options, translator);
    });
    return value;
  }
};

var checkedLoadedFor = {};

var i18next_Translator = function (_EventEmitter) {
  _inherits(Translator, _EventEmitter);

  function Translator(services) {
    var _this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Translator);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Translator).call(this));

    if (isIE10) {
      i18next_EventEmitter.call(_assertThisInitialized(_this));
    }

    i18next_copy(['resourceStore', 'languageUtils', 'pluralResolver', 'interpolator', 'backendConnector', 'i18nFormat', 'utils'], services, _assertThisInitialized(_this));
    _this.options = options;

    if (_this.options.keySeparator === undefined) {
      _this.options.keySeparator = '.';
    }

    _this.logger = baseLogger.create('translator');
    return _this;
  }

  _createClass(Translator, [{
    key: "changeLanguage",
    value: function changeLanguage(lng) {
      if (lng) this.language = lng;
    }
  }, {
    key: "exists",
    value: function exists(key) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        interpolation: {}
      };
      var resolved = this.resolve(key, options);
      return resolved && resolved.res !== undefined;
    }
  }, {
    key: "extractFromKey",
    value: function extractFromKey(key, options) {
      var nsSeparator = options.nsSeparator !== undefined ? options.nsSeparator : this.options.nsSeparator;
      if (nsSeparator === undefined) nsSeparator = ':';
      var keySeparator = options.keySeparator !== undefined ? options.keySeparator : this.options.keySeparator;
      var namespaces = options.ns || this.options.defaultNS;

      if (nsSeparator && key.indexOf(nsSeparator) > -1) {
        var m = key.match(this.interpolator.nestingRegexp);

        if (m && m.length > 0) {
          return {
            key: key,
            namespaces: namespaces
          };
        }

        var parts = key.split(nsSeparator);
        if (nsSeparator !== keySeparator || nsSeparator === keySeparator && this.options.ns.indexOf(parts[0]) > -1) namespaces = parts.shift();
        key = parts.join(keySeparator);
      }

      if (typeof namespaces === 'string') namespaces = [namespaces];
      return {
        key: key,
        namespaces: namespaces
      };
    }
  }, {
    key: "translate",
    value: function translate(keys, options, lastKey) {
      var _this2 = this;

      if (_typeof(options) !== 'object' && this.options.overloadTranslationOptionHandler) {
        options = this.options.overloadTranslationOptionHandler(arguments);
      }

      if (!options) options = {};
      if (keys === undefined || keys === null) return '';
      if (!Array.isArray(keys)) keys = [String(keys)];
      var keySeparator = options.keySeparator !== undefined ? options.keySeparator : this.options.keySeparator;

      var _this$extractFromKey = this.extractFromKey(keys[keys.length - 1], options),
          key = _this$extractFromKey.key,
          namespaces = _this$extractFromKey.namespaces;

      var namespace = namespaces[namespaces.length - 1];
      var lng = options.lng || this.language;
      var appendNamespaceToCIMode = options.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;

      if (lng && lng.toLowerCase() === 'cimode') {
        if (appendNamespaceToCIMode) {
          var nsSeparator = options.nsSeparator || this.options.nsSeparator;
          return namespace + nsSeparator + key;
        }

        return key;
      }

      var resolved = this.resolve(keys, options);
      var res = resolved && resolved.res;
      var resUsedKey = resolved && resolved.usedKey || key;
      var resExactUsedKey = resolved && resolved.exactUsedKey || key;
      var resType = Object.prototype.toString.apply(res);
      var noObject = ['[object Number]', '[object Function]', '[object RegExp]'];
      var joinArrays = options.joinArrays !== undefined ? options.joinArrays : this.options.joinArrays;
      var handleAsObjectInI18nFormat = !this.i18nFormat || this.i18nFormat.handleAsObject;
      var handleAsObject = typeof res !== 'string' && typeof res !== 'boolean' && typeof res !== 'number';

      if (handleAsObjectInI18nFormat && res && handleAsObject && noObject.indexOf(resType) < 0 && !(typeof joinArrays === 'string' && resType === '[object Array]')) {
        if (!options.returnObjects && !this.options.returnObjects) {
          this.logger.warn('accessing an object - but returnObjects options is not enabled!');
          return this.options.returnedObjectHandler ? this.options.returnedObjectHandler(resUsedKey, res, options) : "key '".concat(key, " (").concat(this.language, ")' returned an object instead of string.");
        }

        if (keySeparator) {
          var resTypeIsArray = resType === '[object Array]';
          var copy = resTypeIsArray ? [] : {};
          var newKeyToUse = resTypeIsArray ? resExactUsedKey : resUsedKey;

          for (var m in res) {
            if (Object.prototype.hasOwnProperty.call(res, m)) {
              var deepKey = "".concat(newKeyToUse).concat(keySeparator).concat(m);
              copy[m] = this.translate(deepKey, _objectSpread({}, options, {
                joinArrays: false,
                ns: namespaces
              }));
              if (copy[m] === deepKey) copy[m] = res[m];
            }
          }

          res = copy;
        }
      } else if (handleAsObjectInI18nFormat && typeof joinArrays === 'string' && resType === '[object Array]') {
        res = res.join(joinArrays);
        if (res) res = this.extendTranslation(res, keys, options, lastKey);
      } else {
        var usedDefault = false;
        var usedKey = false;

        if (!this.isValidLookup(res) && options.defaultValue !== undefined) {
          usedDefault = true;

          if (options.count !== undefined) {
            var suffix = this.pluralResolver.getSuffix(lng, options.count);
            res = options["defaultValue".concat(suffix)];
          }

          if (!res) res = options.defaultValue;
        }

        if (!this.isValidLookup(res)) {
          usedKey = true;
          res = key;
        }

        var updateMissing = options.defaultValue && options.defaultValue !== res && this.options.updateMissing;

        if (usedKey || usedDefault || updateMissing) {
          this.logger.log(updateMissing ? 'updateKey' : 'missingKey', lng, namespace, key, updateMissing ? options.defaultValue : res);

          if (keySeparator) {
            var fk = this.resolve(key, _objectSpread({}, options, {
              keySeparator: false
            }));
            if (fk && fk.res) this.logger.warn('Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.');
          }

          var lngs = [];
          var fallbackLngs = this.languageUtils.getFallbackCodes(this.options.fallbackLng, options.lng || this.language);

          if (this.options.saveMissingTo === 'fallback' && fallbackLngs && fallbackLngs[0]) {
            for (var i = 0; i < fallbackLngs.length; i++) {
              lngs.push(fallbackLngs[i]);
            }
          } else if (this.options.saveMissingTo === 'all') {
            lngs = this.languageUtils.toResolveHierarchy(options.lng || this.language);
          } else {
            lngs.push(options.lng || this.language);
          }

          var send = function send(l, k) {
            if (_this2.options.missingKeyHandler) {
              _this2.options.missingKeyHandler(l, namespace, k, updateMissing ? options.defaultValue : res, updateMissing, options);
            } else if (_this2.backendConnector && _this2.backendConnector.saveMissing) {
              _this2.backendConnector.saveMissing(l, namespace, k, updateMissing ? options.defaultValue : res, updateMissing, options);
            }

            _this2.emit('missingKey', l, namespace, k, res);
          };

          if (this.options.saveMissing) {
            var needsPluralHandling = options.count !== undefined && typeof options.count !== 'string';

            if (this.options.saveMissingPlurals && needsPluralHandling) {
              lngs.forEach(function (l) {
                var plurals = _this2.pluralResolver.getPluralFormsOfKey(l, key);

                plurals.forEach(function (p) {
                  return send([l], p);
                });
              });
            } else {
              send(lngs, key);
            }
          }
        }

        res = this.extendTranslation(res, keys, options, resolved, lastKey);
        if (usedKey && res === key && this.options.appendNamespaceToMissingKey) res = "".concat(namespace, ":").concat(key);
        if (usedKey && this.options.parseMissingKeyHandler) res = this.options.parseMissingKeyHandler(res);
      }

      return res;
    }
  }, {
    key: "extendTranslation",
    value: function extendTranslation(res, key, options, resolved, lastKey) {
      var _this3 = this;

      if (this.i18nFormat && this.i18nFormat.parse) {
        res = this.i18nFormat.parse(res, options, resolved.usedLng, resolved.usedNS, resolved.usedKey, {
          resolved: resolved
        });
      } else if (!options.skipInterpolation) {
        if (options.interpolation) this.interpolator.init(_objectSpread({}, options, {
          interpolation: _objectSpread({}, this.options.interpolation, options.interpolation)
        }));
        var skipOnVariables = options.interpolation && options.interpolation.skipOnVariables || this.options.interpolation.skipOnVariables;
        var nestBef;

        if (skipOnVariables) {
          var nb = res.match(this.interpolator.nestingRegexp);
          nestBef = nb && nb.length;
        }

        var data = options.replace && typeof options.replace !== 'string' ? options.replace : options;
        if (this.options.interpolation.defaultVariables) data = _objectSpread({}, this.options.interpolation.defaultVariables, data);
        res = this.interpolator.interpolate(res, data, options.lng || this.language, options);

        if (skipOnVariables) {
          var na = res.match(this.interpolator.nestingRegexp);
          var nestAft = na && na.length;
          if (nestBef < nestAft) options.nest = false;
        }

        if (options.nest !== false) res = this.interpolator.nest(res, function () {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          if (lastKey && lastKey[0] === args[0] && !options.context) {
            _this3.logger.warn("It seems you are nesting recursively key: ".concat(args[0], " in key: ").concat(key[0]));

            return null;
          }

          return _this3.translate.apply(_this3, args.concat([key]));
        }, options);
        if (options.interpolation) this.interpolator.reset();
      }

      var postProcess = options.postProcess || this.options.postProcess;
      var postProcessorNames = typeof postProcess === 'string' ? [postProcess] : postProcess;

      if (res !== undefined && res !== null && postProcessorNames && postProcessorNames.length && options.applyPostProcessor !== false) {
        res = postProcessor.handle(postProcessorNames, res, key, this.options && this.options.postProcessPassResolved ? _objectSpread({
          i18nResolved: resolved
        }, options) : options, this);
      }

      return res;
    }
  }, {
    key: "resolve",
    value: function resolve(keys) {
      var _this4 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var found;
      var usedKey;
      var exactUsedKey;
      var usedLng;
      var usedNS;
      if (typeof keys === 'string') keys = [keys];
      keys.forEach(function (k) {
        if (_this4.isValidLookup(found)) return;

        var extracted = _this4.extractFromKey(k, options);

        var key = extracted.key;
        usedKey = key;
        var namespaces = extracted.namespaces;
        if (_this4.options.fallbackNS) namespaces = namespaces.concat(_this4.options.fallbackNS);
        var needsPluralHandling = options.count !== undefined && typeof options.count !== 'string';
        var needsContextHandling = options.context !== undefined && typeof options.context === 'string' && options.context !== '';
        var codes = options.lngs ? options.lngs : _this4.languageUtils.toResolveHierarchy(options.lng || _this4.language, options.fallbackLng);
        namespaces.forEach(function (ns) {
          if (_this4.isValidLookup(found)) return;
          usedNS = ns;

          if (!checkedLoadedFor["".concat(codes[0], "-").concat(ns)] && _this4.utils && _this4.utils.hasLoadedNamespace && !_this4.utils.hasLoadedNamespace(usedNS)) {
            checkedLoadedFor["".concat(codes[0], "-").concat(ns)] = true;

            _this4.logger.warn("key \"".concat(usedKey, "\" for languages \"").concat(codes.join(', '), "\" won't get resolved as namespace \"").concat(usedNS, "\" was not yet loaded"), 'This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!');
          }

          codes.forEach(function (code) {
            if (_this4.isValidLookup(found)) return;
            usedLng = code;
            var finalKey = key;
            var finalKeys = [finalKey];

            if (_this4.i18nFormat && _this4.i18nFormat.addLookupKeys) {
              _this4.i18nFormat.addLookupKeys(finalKeys, key, code, ns, options);
            } else {
              var pluralSuffix;
              if (needsPluralHandling) pluralSuffix = _this4.pluralResolver.getSuffix(code, options.count);
              if (needsPluralHandling && needsContextHandling) finalKeys.push(finalKey + pluralSuffix);
              if (needsContextHandling) finalKeys.push(finalKey += "".concat(_this4.options.contextSeparator).concat(options.context));
              if (needsPluralHandling) finalKeys.push(finalKey += pluralSuffix);
            }

            var possibleKey;

            while (possibleKey = finalKeys.pop()) {
              if (!_this4.isValidLookup(found)) {
                exactUsedKey = possibleKey;
                found = _this4.getResource(code, ns, possibleKey, options);
              }
            }
          });
        });
      });
      return {
        res: found,
        usedKey: usedKey,
        exactUsedKey: exactUsedKey,
        usedLng: usedLng,
        usedNS: usedNS
      };
    }
  }, {
    key: "isValidLookup",
    value: function isValidLookup(res) {
      return res !== undefined && !(!this.options.returnNull && res === null) && !(!this.options.returnEmptyString && res === '');
    }
  }, {
    key: "getResource",
    value: function getResource(code, ns, key) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      if (this.i18nFormat && this.i18nFormat.getResource) return this.i18nFormat.getResource(code, ns, key, options);
      return this.resourceStore.getResource(code, ns, key, options);
    }
  }]);

  return Translator;
}(i18next_EventEmitter);

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

var i18next_LanguageUtil = function () {
  function LanguageUtil(options) {
    _classCallCheck(this, LanguageUtil);

    this.options = options;
    this.whitelist = this.options.supportedLngs || false;
    this.supportedLngs = this.options.supportedLngs || false;
    this.logger = baseLogger.create('languageUtils');
  }

  _createClass(LanguageUtil, [{
    key: "getScriptPartFromCode",
    value: function getScriptPartFromCode(code) {
      if (!code || code.indexOf('-') < 0) return null;
      var p = code.split('-');
      if (p.length === 2) return null;
      p.pop();
      if (p[p.length - 1].toLowerCase() === 'x') return null;
      return this.formatLanguageCode(p.join('-'));
    }
  }, {
    key: "getLanguagePartFromCode",
    value: function getLanguagePartFromCode(code) {
      if (!code || code.indexOf('-') < 0) return code;
      var p = code.split('-');
      return this.formatLanguageCode(p[0]);
    }
  }, {
    key: "formatLanguageCode",
    value: function formatLanguageCode(code) {
      if (typeof code === 'string' && code.indexOf('-') > -1) {
        var specialCases = ['hans', 'hant', 'latn', 'cyrl', 'cans', 'mong', 'arab'];
        var p = code.split('-');

        if (this.options.lowerCaseLng) {
          p = p.map(function (part) {
            return part.toLowerCase();
          });
        } else if (p.length === 2) {
          p[0] = p[0].toLowerCase();
          p[1] = p[1].toUpperCase();
          if (specialCases.indexOf(p[1].toLowerCase()) > -1) p[1] = capitalize(p[1].toLowerCase());
        } else if (p.length === 3) {
          p[0] = p[0].toLowerCase();
          if (p[1].length === 2) p[1] = p[1].toUpperCase();
          if (p[0] !== 'sgn' && p[2].length === 2) p[2] = p[2].toUpperCase();
          if (specialCases.indexOf(p[1].toLowerCase()) > -1) p[1] = capitalize(p[1].toLowerCase());
          if (specialCases.indexOf(p[2].toLowerCase()) > -1) p[2] = capitalize(p[2].toLowerCase());
        }

        return p.join('-');
      }

      return this.options.cleanCode || this.options.lowerCaseLng ? code.toLowerCase() : code;
    }
  }, {
    key: "isWhitelisted",
    value: function isWhitelisted(code) {
      this.logger.deprecate('languageUtils.isWhitelisted', 'function "isWhitelisted" will be renamed to "isSupportedCode" in the next major - please make sure to rename it\'s usage asap.');
      return this.isSupportedCode(code);
    }
  }, {
    key: "isSupportedCode",
    value: function isSupportedCode(code) {
      if (this.options.load === 'languageOnly' || this.options.nonExplicitSupportedLngs) {
        code = this.getLanguagePartFromCode(code);
      }

      return !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.indexOf(code) > -1;
    }
  }, {
    key: "getBestMatchFromCodes",
    value: function getBestMatchFromCodes(codes) {
      var _this = this;

      if (!codes) return null;
      var found;
      codes.forEach(function (code) {
        if (found) return;

        var cleanedLng = _this.formatLanguageCode(code);

        if (!_this.options.supportedLngs || _this.isSupportedCode(cleanedLng)) found = cleanedLng;
      });

      if (!found && this.options.supportedLngs) {
        codes.forEach(function (code) {
          if (found) return;

          var lngOnly = _this.getLanguagePartFromCode(code);

          if (_this.isSupportedCode(lngOnly)) return found = lngOnly;
          found = _this.options.supportedLngs.find(function (supportedLng) {
            if (supportedLng.indexOf(lngOnly) === 0) return supportedLng;
          });
        });
      }

      if (!found) found = this.getFallbackCodes(this.options.fallbackLng)[0];
      return found;
    }
  }, {
    key: "getFallbackCodes",
    value: function getFallbackCodes(fallbacks, code) {
      if (!fallbacks) return [];
      if (typeof fallbacks === 'function') fallbacks = fallbacks(code);
      if (typeof fallbacks === 'string') fallbacks = [fallbacks];
      if (Object.prototype.toString.apply(fallbacks) === '[object Array]') return fallbacks;
      if (!code) return fallbacks["default"] || [];
      var found = fallbacks[code];
      if (!found) found = fallbacks[this.getScriptPartFromCode(code)];
      if (!found) found = fallbacks[this.formatLanguageCode(code)];
      if (!found) found = fallbacks[this.getLanguagePartFromCode(code)];
      if (!found) found = fallbacks["default"];
      return found || [];
    }
  }, {
    key: "toResolveHierarchy",
    value: function toResolveHierarchy(code, fallbackCode) {
      var _this2 = this;

      var fallbackCodes = this.getFallbackCodes(fallbackCode || this.options.fallbackLng || [], code);
      var codes = [];

      var addCode = function addCode(c) {
        if (!c) return;

        if (_this2.isSupportedCode(c)) {
          codes.push(c);
        } else {
          _this2.logger.warn("rejecting language code not found in supportedLngs: ".concat(c));
        }
      };

      if (typeof code === 'string' && code.indexOf('-') > -1) {
        if (this.options.load !== 'languageOnly') addCode(this.formatLanguageCode(code));
        if (this.options.load !== 'languageOnly' && this.options.load !== 'currentOnly') addCode(this.getScriptPartFromCode(code));
        if (this.options.load !== 'currentOnly') addCode(this.getLanguagePartFromCode(code));
      } else if (typeof code === 'string') {
        addCode(this.formatLanguageCode(code));
      }

      fallbackCodes.forEach(function (fc) {
        if (codes.indexOf(fc) < 0) addCode(_this2.formatLanguageCode(fc));
      });
      return codes;
    }
  }]);

  return LanguageUtil;
}();

var sets = [{
  lngs: ['ach', 'ak', 'am', 'arn', 'br', 'fil', 'gun', 'ln', 'mfe', 'mg', 'mi', 'oc', 'pt', 'pt-BR', 'tg', 'ti', 'tr', 'uz', 'wa'],
  nr: [1, 2],
  fc: 1
}, {
  lngs: ['af', 'an', 'ast', 'az', 'bg', 'bn', 'ca', 'da', 'de', 'dev', 'el', 'en', 'eo', 'es', 'et', 'eu', 'fi', 'fo', 'fur', 'fy', 'gl', 'gu', 'ha', 'hi', 'hu', 'hy', 'ia', 'it', 'kn', 'ku', 'lb', 'mai', 'ml', 'mn', 'mr', 'nah', 'nap', 'nb', 'ne', 'nl', 'nn', 'no', 'nso', 'pa', 'pap', 'pms', 'ps', 'pt-PT', 'rm', 'sco', 'se', 'si', 'so', 'son', 'sq', 'sv', 'sw', 'ta', 'te', 'tk', 'ur', 'yo'],
  nr: [1, 2],
  fc: 2
}, {
  lngs: ['ay', 'bo', 'cgg', 'fa', 'ht', 'id', 'ja', 'jbo', 'ka', 'kk', 'km', 'ko', 'ky', 'lo', 'ms', 'sah', 'su', 'th', 'tt', 'ug', 'vi', 'wo', 'zh'],
  nr: [1],
  fc: 3
}, {
  lngs: ['be', 'bs', 'cnr', 'dz', 'hr', 'ru', 'sr', 'uk'],
  nr: [1, 2, 5],
  fc: 4
}, {
  lngs: ['ar'],
  nr: [0, 1, 2, 3, 11, 100],
  fc: 5
}, {
  lngs: ['cs', 'sk'],
  nr: [1, 2, 5],
  fc: 6
}, {
  lngs: ['csb', 'pl'],
  nr: [1, 2, 5],
  fc: 7
}, {
  lngs: ['cy'],
  nr: [1, 2, 3, 8],
  fc: 8
}, {
  lngs: ['fr'],
  nr: [1, 2],
  fc: 9
}, {
  lngs: ['ga'],
  nr: [1, 2, 3, 7, 11],
  fc: 10
}, {
  lngs: ['gd'],
  nr: [1, 2, 3, 20],
  fc: 11
}, {
  lngs: ['is'],
  nr: [1, 2],
  fc: 12
}, {
  lngs: ['jv'],
  nr: [0, 1],
  fc: 13
}, {
  lngs: ['kw'],
  nr: [1, 2, 3, 4],
  fc: 14
}, {
  lngs: ['lt'],
  nr: [1, 2, 10],
  fc: 15
}, {
  lngs: ['lv'],
  nr: [1, 2, 0],
  fc: 16
}, {
  lngs: ['mk'],
  nr: [1, 2],
  fc: 17
}, {
  lngs: ['mnk'],
  nr: [0, 1, 2],
  fc: 18
}, {
  lngs: ['mt'],
  nr: [1, 2, 11, 20],
  fc: 19
}, {
  lngs: ['or'],
  nr: [2, 1],
  fc: 2
}, {
  lngs: ['ro'],
  nr: [1, 2, 20],
  fc: 20
}, {
  lngs: ['sl'],
  nr: [5, 1, 2, 3],
  fc: 21
}, {
  lngs: ['he', 'iw'],
  nr: [1, 2, 20, 21],
  fc: 22
}];
var _rulesPluralsTypes = {
  1: function _(n) {
    return Number(n > 1);
  },
  2: function _(n) {
    return Number(n != 1);
  },
  3: function _(n) {
    return 0;
  },
  4: function _(n) {
    return Number(n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
  },
  5: function _(n) {
    return Number(n == 0 ? 0 : n == 1 ? 1 : n == 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5);
  },
  6: function _(n) {
    return Number(n == 1 ? 0 : n >= 2 && n <= 4 ? 1 : 2);
  },
  7: function _(n) {
    return Number(n == 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
  },
  8: function _(n) {
    return Number(n == 1 ? 0 : n == 2 ? 1 : n != 8 && n != 11 ? 2 : 3);
  },
  9: function _(n) {
    return Number(n >= 2);
  },
  10: function _(n) {
    return Number(n == 1 ? 0 : n == 2 ? 1 : n < 7 ? 2 : n < 11 ? 3 : 4);
  },
  11: function _(n) {
    return Number(n == 1 || n == 11 ? 0 : n == 2 || n == 12 ? 1 : n > 2 && n < 20 ? 2 : 3);
  },
  12: function _(n) {
    return Number(n % 10 != 1 || n % 100 == 11);
  },
  13: function _(n) {
    return Number(n !== 0);
  },
  14: function _(n) {
    return Number(n == 1 ? 0 : n == 2 ? 1 : n == 3 ? 2 : 3);
  },
  15: function _(n) {
    return Number(n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
  },
  16: function _(n) {
    return Number(n % 10 == 1 && n % 100 != 11 ? 0 : n !== 0 ? 1 : 2);
  },
  17: function _(n) {
    return Number(n == 1 || n % 10 == 1 && n % 100 != 11 ? 0 : 1);
  },
  18: function _(n) {
    return Number(n == 0 ? 0 : n == 1 ? 1 : 2);
  },
  19: function _(n) {
    return Number(n == 1 ? 0 : n == 0 || n % 100 > 1 && n % 100 < 11 ? 1 : n % 100 > 10 && n % 100 < 20 ? 2 : 3);
  },
  20: function _(n) {
    return Number(n == 1 ? 0 : n == 0 || n % 100 > 0 && n % 100 < 20 ? 1 : 2);
  },
  21: function _(n) {
    return Number(n % 100 == 1 ? 1 : n % 100 == 2 ? 2 : n % 100 == 3 || n % 100 == 4 ? 3 : 0);
  },
  22: function _(n) {
    return Number(n == 1 ? 0 : n == 2 ? 1 : (n < 0 || n > 10) && n % 10 == 0 ? 2 : 3);
  }
};

function createRules() {
  var rules = {};
  sets.forEach(function (set) {
    set.lngs.forEach(function (l) {
      rules[l] = {
        numbers: set.nr,
        plurals: _rulesPluralsTypes[set.fc]
      };
    });
  });
  return rules;
}

var i18next_PluralResolver = function () {
  function PluralResolver(languageUtils) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, PluralResolver);

    this.languageUtils = languageUtils;
    this.options = options;
    this.logger = baseLogger.create('pluralResolver');
    this.rules = createRules();
  }

  _createClass(PluralResolver, [{
    key: "addRule",
    value: function addRule(lng, obj) {
      this.rules[lng] = obj;
    }
  }, {
    key: "getRule",
    value: function getRule(code) {
      return this.rules[code] || this.rules[this.languageUtils.getLanguagePartFromCode(code)];
    }
  }, {
    key: "needsPlural",
    value: function needsPlural(code) {
      var rule = this.getRule(code);
      return rule && rule.numbers.length > 1;
    }
  }, {
    key: "getPluralFormsOfKey",
    value: function getPluralFormsOfKey(code, key) {
      var _this = this;

      var ret = [];
      var rule = this.getRule(code);
      if (!rule) return ret;
      rule.numbers.forEach(function (n) {
        var suffix = _this.getSuffix(code, n);

        ret.push("".concat(key).concat(suffix));
      });
      return ret;
    }
  }, {
    key: "getSuffix",
    value: function getSuffix(code, count) {
      var _this2 = this;

      var rule = this.getRule(code);

      if (rule) {
        var idx = rule.noAbs ? rule.plurals(count) : rule.plurals(Math.abs(count));
        var suffix = rule.numbers[idx];

        if (this.options.simplifyPluralSuffix && rule.numbers.length === 2 && rule.numbers[0] === 1) {
          if (suffix === 2) {
            suffix = 'plural';
          } else if (suffix === 1) {
            suffix = '';
          }
        }

        var returnSuffix = function returnSuffix() {
          return _this2.options.prepend && suffix.toString() ? _this2.options.prepend + suffix.toString() : suffix.toString();
        };

        if (this.options.compatibilityJSON === 'v1') {
          if (suffix === 1) return '';
          if (typeof suffix === 'number') return "_plural_".concat(suffix.toString());
          return returnSuffix();
        } else if (this.options.compatibilityJSON === 'v2') {
          return returnSuffix();
        } else if (this.options.simplifyPluralSuffix && rule.numbers.length === 2 && rule.numbers[0] === 1) {
          return returnSuffix();
        }

        return this.options.prepend && idx.toString() ? this.options.prepend + idx.toString() : idx.toString();
      }

      this.logger.warn("no plural rule found for: ".concat(code));
      return '';
    }
  }]);

  return PluralResolver;
}();

var i18next_Interpolator = function () {
  function Interpolator() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Interpolator);

    this.logger = baseLogger.create('interpolator');
    this.options = options;

    this.format = options.interpolation && options.interpolation.format || function (value) {
      return value;
    };

    this.init(options);
  }

  _createClass(Interpolator, [{
    key: "init",
    value: function init() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      if (!options.interpolation) options.interpolation = {
        escapeValue: true
      };
      var iOpts = options.interpolation;
      this.escape = iOpts.escape !== undefined ? iOpts.escape : i18next_escape;
      this.escapeValue = iOpts.escapeValue !== undefined ? iOpts.escapeValue : true;
      this.useRawValueToEscape = iOpts.useRawValueToEscape !== undefined ? iOpts.useRawValueToEscape : false;
      this.prefix = iOpts.prefix ? regexEscape(iOpts.prefix) : iOpts.prefixEscaped || '{{';
      this.suffix = iOpts.suffix ? regexEscape(iOpts.suffix) : iOpts.suffixEscaped || '}}';
      this.formatSeparator = iOpts.formatSeparator ? iOpts.formatSeparator : iOpts.formatSeparator || ',';
      this.unescapePrefix = iOpts.unescapeSuffix ? '' : iOpts.unescapePrefix || '-';
      this.unescapeSuffix = this.unescapePrefix ? '' : iOpts.unescapeSuffix || '';
      this.nestingPrefix = iOpts.nestingPrefix ? regexEscape(iOpts.nestingPrefix) : iOpts.nestingPrefixEscaped || regexEscape('$t(');
      this.nestingSuffix = iOpts.nestingSuffix ? regexEscape(iOpts.nestingSuffix) : iOpts.nestingSuffixEscaped || regexEscape(')');
      this.nestingOptionsSeparator = iOpts.nestingOptionsSeparator ? iOpts.nestingOptionsSeparator : iOpts.nestingOptionsSeparator || ',';
      this.maxReplaces = iOpts.maxReplaces ? iOpts.maxReplaces : 1000;
      this.alwaysFormat = iOpts.alwaysFormat !== undefined ? iOpts.alwaysFormat : false;
      this.resetRegExp();
    }
  }, {
    key: "reset",
    value: function reset() {
      if (this.options) this.init(this.options);
    }
  }, {
    key: "resetRegExp",
    value: function resetRegExp() {
      var regexpStr = "".concat(this.prefix, "(.+?)").concat(this.suffix);
      this.regexp = new RegExp(regexpStr, 'g');
      var regexpUnescapeStr = "".concat(this.prefix).concat(this.unescapePrefix, "(.+?)").concat(this.unescapeSuffix).concat(this.suffix);
      this.regexpUnescape = new RegExp(regexpUnescapeStr, 'g');
      var nestingRegexpStr = "".concat(this.nestingPrefix, "(.+?)").concat(this.nestingSuffix);
      this.nestingRegexp = new RegExp(nestingRegexpStr, 'g');
    }
  }, {
    key: "interpolate",
    value: function interpolate(str, data, lng, options) {
      var _this = this;

      var match;
      var value;
      var replaces;
      var defaultData = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {};

      function regexSafe(val) {
        return val.replace(/\$/g, '$$$$');
      }

      var handleFormat = function handleFormat(key) {
        if (key.indexOf(_this.formatSeparator) < 0) {
          var path = getPathWithDefaults(data, defaultData, key);
          return _this.alwaysFormat ? _this.format(path, undefined, lng) : path;
        }

        var p = key.split(_this.formatSeparator);
        var k = p.shift().trim();
        var f = p.join(_this.formatSeparator).trim();
        return _this.format(getPathWithDefaults(data, defaultData, k), f, lng, options);
      };

      this.resetRegExp();
      var missingInterpolationHandler = options && options.missingInterpolationHandler || this.options.missingInterpolationHandler;
      var skipOnVariables = options && options.interpolation && options.interpolation.skipOnVariables || this.options.interpolation.skipOnVariables;
      var todos = [{
        regex: this.regexpUnescape,
        safeValue: function safeValue(val) {
          return regexSafe(val);
        }
      }, {
        regex: this.regexp,
        safeValue: function safeValue(val) {
          return _this.escapeValue ? regexSafe(_this.escape(val)) : regexSafe(val);
        }
      }];
      todos.forEach(function (todo) {
        replaces = 0;

        while (match = todo.regex.exec(str)) {
          value = handleFormat(match[1].trim());

          if (value === undefined) {
            if (typeof missingInterpolationHandler === 'function') {
              var temp = missingInterpolationHandler(str, match, options);
              value = typeof temp === 'string' ? temp : '';
            } else if (skipOnVariables) {
              value = match[0];
              continue;
            } else {
              _this.logger.warn("missed to pass in variable ".concat(match[1], " for interpolating ").concat(str));

              value = '';
            }
          } else if (typeof value !== 'string' && !_this.useRawValueToEscape) {
            value = makeString(value);
          }

          str = str.replace(match[0], todo.safeValue(value));
          todo.regex.lastIndex = 0;
          replaces++;

          if (replaces >= _this.maxReplaces) {
            break;
          }
        }
      });
      return str;
    }
  }, {
    key: "nest",
    value: function nest(str, fc) {
      var _this2 = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var match;
      var value;

      var clonedOptions = _objectSpread({}, options);

      clonedOptions.applyPostProcessor = false;
      delete clonedOptions.defaultValue;

      function handleHasOptions(key, inheritedOptions) {
        var sep = this.nestingOptionsSeparator;
        if (key.indexOf(sep) < 0) return key;
        var c = key.split(new RegExp("".concat(sep, "[ ]*{")));
        var optionsString = "{".concat(c[1]);
        key = c[0];
        optionsString = this.interpolate(optionsString, clonedOptions);
        optionsString = optionsString.replace(/'/g, '"');

        try {
          clonedOptions = JSON.parse(optionsString);
          if (inheritedOptions) clonedOptions = _objectSpread({}, inheritedOptions, clonedOptions);
        } catch (e) {
          this.logger.warn("failed parsing options string in nesting for key ".concat(key), e);
          return "".concat(key).concat(sep).concat(optionsString);
        }

        delete clonedOptions.defaultValue;
        return key;
      }

      while (match = this.nestingRegexp.exec(str)) {
        var formatters = [];
        var doReduce = false;

        if (match[0].includes(this.formatSeparator) && !/{.*}/.test(match[1])) {
          var r = match[1].split(this.formatSeparator).map(function (elem) {
            return elem.trim();
          });
          match[1] = r.shift();
          formatters = r;
          doReduce = true;
        }

        value = fc(handleHasOptions.call(this, match[1].trim(), clonedOptions), clonedOptions);
        if (value && match[0] === str && typeof value !== 'string') return value;
        if (typeof value !== 'string') value = makeString(value);

        if (!value) {
          this.logger.warn("missed to resolve ".concat(match[1], " for nesting ").concat(str));
          value = '';
        }

        if (doReduce) {
          value = formatters.reduce(function (v, f) {
            return _this2.format(v, f, options.lng, options);
          }, value.trim());
        }

        str = str.replace(match[0], value);
        this.regexp.lastIndex = 0;
      }

      return str;
    }
  }]);

  return Interpolator;
}();

function remove(arr, what) {
  var found = arr.indexOf(what);

  while (found !== -1) {
    arr.splice(found, 1);
    found = arr.indexOf(what);
  }
}

var i18next_Connector = function (_EventEmitter) {
  _inherits(Connector, _EventEmitter);

  function Connector(backend, store, services) {
    var _this;

    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    _classCallCheck(this, Connector);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Connector).call(this));

    if (isIE10) {
      i18next_EventEmitter.call(_assertThisInitialized(_this));
    }

    _this.backend = backend;
    _this.store = store;
    _this.services = services;
    _this.languageUtils = services.languageUtils;
    _this.options = options;
    _this.logger = baseLogger.create('backendConnector');
    _this.state = {};
    _this.queue = [];

    if (_this.backend && _this.backend.init) {
      _this.backend.init(services, options.backend, options);
    }

    return _this;
  }

  _createClass(Connector, [{
    key: "queueLoad",
    value: function queueLoad(languages, namespaces, options, callback) {
      var _this2 = this;

      var toLoad = [];
      var pending = [];
      var toLoadLanguages = [];
      var toLoadNamespaces = [];
      languages.forEach(function (lng) {
        var hasAllNamespaces = true;
        namespaces.forEach(function (ns) {
          var name = "".concat(lng, "|").concat(ns);

          if (!options.reload && _this2.store.hasResourceBundle(lng, ns)) {
            _this2.state[name] = 2;
          } else if (_this2.state[name] < 0) ; else if (_this2.state[name] === 1) {
            if (pending.indexOf(name) < 0) pending.push(name);
          } else {
            _this2.state[name] = 1;
            hasAllNamespaces = false;
            if (pending.indexOf(name) < 0) pending.push(name);
            if (toLoad.indexOf(name) < 0) toLoad.push(name);
            if (toLoadNamespaces.indexOf(ns) < 0) toLoadNamespaces.push(ns);
          }
        });
        if (!hasAllNamespaces) toLoadLanguages.push(lng);
      });

      if (toLoad.length || pending.length) {
        this.queue.push({
          pending: pending,
          loaded: {},
          errors: [],
          callback: callback
        });
      }

      return {
        toLoad: toLoad,
        pending: pending,
        toLoadLanguages: toLoadLanguages,
        toLoadNamespaces: toLoadNamespaces
      };
    }
  }, {
    key: "loaded",
    value: function loaded(name, err, data) {
      var s = name.split('|');
      var lng = s[0];
      var ns = s[1];
      if (err) this.emit('failedLoading', lng, ns, err);

      if (data) {
        this.store.addResourceBundle(lng, ns, data);
      }

      this.state[name] = err ? -1 : 2;
      var loaded = {};
      this.queue.forEach(function (q) {
        pushPath(q.loaded, [lng], ns);
        remove(q.pending, name);
        if (err) q.errors.push(err);

        if (q.pending.length === 0 && !q.done) {
          Object.keys(q.loaded).forEach(function (l) {
            if (!loaded[l]) loaded[l] = [];

            if (q.loaded[l].length) {
              q.loaded[l].forEach(function (ns) {
                if (loaded[l].indexOf(ns) < 0) loaded[l].push(ns);
              });
            }
          });
          q.done = true;

          if (q.errors.length) {
            q.callback(q.errors);
          } else {
            q.callback();
          }
        }
      });
      this.emit('loaded', loaded);
      this.queue = this.queue.filter(function (q) {
        return !q.done;
      });
    }
  }, {
    key: "read",
    value: function read(lng, ns, fcName) {
      var _this3 = this;

      var tried = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var wait = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 350;
      var callback = arguments.length > 5 ? arguments[5] : undefined;
      if (!lng.length) return callback(null, {});
      return this.backend[fcName](lng, ns, function (err, data) {
        if (err && data && tried < 5) {
          setTimeout(function () {
            _this3.read.call(_this3, lng, ns, fcName, tried + 1, wait * 2, callback);
          }, wait);
          return;
        }

        callback(err, data);
      });
    }
  }, {
    key: "prepareLoading",
    value: function prepareLoading(languages, namespaces) {
      var _this4 = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var callback = arguments.length > 3 ? arguments[3] : undefined;

      if (!this.backend) {
        this.logger.warn('No backend was added via i18next.use. Will not load resources.');
        return callback && callback();
      }

      if (typeof languages === 'string') languages = this.languageUtils.toResolveHierarchy(languages);
      if (typeof namespaces === 'string') namespaces = [namespaces];
      var toLoad = this.queueLoad(languages, namespaces, options, callback);

      if (!toLoad.toLoad.length) {
        if (!toLoad.pending.length) callback();
        return null;
      }

      toLoad.toLoad.forEach(function (name) {
        _this4.loadOne(name);
      });
    }
  }, {
    key: "load",
    value: function load(languages, namespaces, callback) {
      this.prepareLoading(languages, namespaces, {}, callback);
    }
  }, {
    key: "reload",
    value: function reload(languages, namespaces, callback) {
      this.prepareLoading(languages, namespaces, {
        reload: true
      }, callback);
    }
  }, {
    key: "loadOne",
    value: function loadOne(name) {
      var _this5 = this;

      var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var s = name.split('|');
      var lng = s[0];
      var ns = s[1];
      this.read(lng, ns, 'read', undefined, undefined, function (err, data) {
        if (err) _this5.logger.warn("".concat(prefix, "loading namespace ").concat(ns, " for language ").concat(lng, " failed"), err);
        if (!err && data) _this5.logger.log("".concat(prefix, "loaded namespace ").concat(ns, " for language ").concat(lng), data);

        _this5.loaded(name, err, data);
      });
    }
  }, {
    key: "saveMissing",
    value: function saveMissing(languages, namespace, key, fallbackValue, isUpdate) {
      var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};

      if (this.services.utils && this.services.utils.hasLoadedNamespace && !this.services.utils.hasLoadedNamespace(namespace)) {
        this.logger.warn("did not save key \"".concat(key, "\" as the namespace \"").concat(namespace, "\" was not yet loaded"), 'This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!');
        return;
      }

      if (key === undefined || key === null || key === '') return;

      if (this.backend && this.backend.create) {
        this.backend.create(languages, namespace, key, fallbackValue, null, _objectSpread({}, options, {
          isUpdate: isUpdate
        }));
      }

      if (!languages || !languages[0]) return;
      this.store.addResource(languages[0], namespace, key, fallbackValue);
    }
  }]);

  return Connector;
}(i18next_EventEmitter);

function get() {
  return {
    debug: false,
    initImmediate: true,
    ns: ['translation'],
    defaultNS: ['translation'],
    fallbackLng: ['dev'],
    fallbackNS: false,
    whitelist: false,
    nonExplicitWhitelist: false,
    supportedLngs: false,
    nonExplicitSupportedLngs: false,
    load: 'all',
    preload: false,
    simplifyPluralSuffix: true,
    keySeparator: '.',
    nsSeparator: ':',
    pluralSeparator: '_',
    contextSeparator: '_',
    partialBundledLanguages: false,
    saveMissing: false,
    updateMissing: false,
    saveMissingTo: 'fallback',
    saveMissingPlurals: true,
    missingKeyHandler: false,
    missingInterpolationHandler: false,
    postProcess: false,
    postProcessPassResolved: false,
    returnNull: true,
    returnEmptyString: true,
    returnObjects: false,
    joinArrays: false,
    returnedObjectHandler: false,
    parseMissingKeyHandler: false,
    appendNamespaceToMissingKey: false,
    appendNamespaceToCIMode: false,
    overloadTranslationOptionHandler: function handle(args) {
      var ret = {};
      if (_typeof(args[1]) === 'object') ret = args[1];
      if (typeof args[1] === 'string') ret.defaultValue = args[1];
      if (typeof args[2] === 'string') ret.tDescription = args[2];

      if (_typeof(args[2]) === 'object' || _typeof(args[3]) === 'object') {
        var options = args[3] || args[2];
        Object.keys(options).forEach(function (key) {
          ret[key] = options[key];
        });
      }

      return ret;
    },
    interpolation: {
      escapeValue: true,
      format: function format(value, _format, lng, options) {
        return value;
      },
      prefix: '{{',
      suffix: '}}',
      formatSeparator: ',',
      unescapePrefix: '-',
      nestingPrefix: '$t(',
      nestingSuffix: ')',
      nestingOptionsSeparator: ',',
      maxReplaces: 1000,
      skipOnVariables: false
    }
  };
}
function transformOptions(options) {
  if (typeof options.ns === 'string') options.ns = [options.ns];
  if (typeof options.fallbackLng === 'string') options.fallbackLng = [options.fallbackLng];
  if (typeof options.fallbackNS === 'string') options.fallbackNS = [options.fallbackNS];

  if (options.whitelist) {
    if (options.whitelist && options.whitelist.indexOf('cimode') < 0) {
      options.whitelist = options.whitelist.concat(['cimode']);
    }

    options.supportedLngs = options.whitelist;
  }

  if (options.nonExplicitWhitelist) {
    options.nonExplicitSupportedLngs = options.nonExplicitWhitelist;
  }

  if (options.supportedLngs && options.supportedLngs.indexOf('cimode') < 0) {
    options.supportedLngs = options.supportedLngs.concat(['cimode']);
  }

  return options;
}

function noop() {}

var i18next_I18n = function (_EventEmitter) {
  _inherits(I18n, _EventEmitter);

  function I18n() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var callback = arguments.length > 1 ? arguments[1] : undefined;

    _classCallCheck(this, I18n);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(I18n).call(this));

    if (isIE10) {
      i18next_EventEmitter.call(_assertThisInitialized(_this));
    }

    _this.options = transformOptions(options);
    _this.services = {};
    _this.logger = baseLogger;
    _this.modules = {
      external: []
    };

    if (callback && !_this.isInitialized && !options.isClone) {
      if (!_this.options.initImmediate) {
        _this.init(options, callback);

        return _possibleConstructorReturn(_this, _assertThisInitialized(_this));
      }

      setTimeout(function () {
        _this.init(options, callback);
      }, 0);
    }

    return _this;
  }

  _createClass(I18n, [{
    key: "init",
    value: function init() {
      var _this2 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var callback = arguments.length > 1 ? arguments[1] : undefined;

      if (typeof options === 'function') {
        callback = options;
        options = {};
      }

      if (options.whitelist && !options.supportedLngs) {
        this.logger.deprecate('whitelist', 'option "whitelist" will be renamed to "supportedLngs" in the next major - please make sure to rename this option asap.');
      }

      if (options.nonExplicitWhitelist && !options.nonExplicitSupportedLngs) {
        this.logger.deprecate('whitelist', 'options "nonExplicitWhitelist" will be renamed to "nonExplicitSupportedLngs" in the next major - please make sure to rename this option asap.');
      }

      this.options = _objectSpread({}, get(), this.options, transformOptions(options));
      this.format = this.options.interpolation.format;
      if (!callback) callback = noop;

      function createClassOnDemand(ClassOrObject) {
        if (!ClassOrObject) return null;
        if (typeof ClassOrObject === 'function') return new ClassOrObject();
        return ClassOrObject;
      }

      if (!this.options.isClone) {
        if (this.modules.logger) {
          baseLogger.init(createClassOnDemand(this.modules.logger), this.options);
        } else {
          baseLogger.init(null, this.options);
        }

        var lu = new i18next_LanguageUtil(this.options);
        this.store = new i18next_ResourceStore(this.options.resources, this.options);
        var s = this.services;
        s.logger = baseLogger;
        s.resourceStore = this.store;
        s.languageUtils = lu;
        s.pluralResolver = new i18next_PluralResolver(lu, {
          prepend: this.options.pluralSeparator,
          compatibilityJSON: this.options.compatibilityJSON,
          simplifyPluralSuffix: this.options.simplifyPluralSuffix
        });
        s.interpolator = new i18next_Interpolator(this.options);
        s.utils = {
          hasLoadedNamespace: this.hasLoadedNamespace.bind(this)
        };
        s.backendConnector = new i18next_Connector(createClassOnDemand(this.modules.backend), s.resourceStore, s, this.options);
        s.backendConnector.on('*', function (event) {
          for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          _this2.emit.apply(_this2, [event].concat(args));
        });

        if (this.modules.languageDetector) {
          s.languageDetector = createClassOnDemand(this.modules.languageDetector);
          s.languageDetector.init(s, this.options.detection, this.options);
        }

        if (this.modules.i18nFormat) {
          s.i18nFormat = createClassOnDemand(this.modules.i18nFormat);
          if (s.i18nFormat.init) s.i18nFormat.init(this);
        }

        this.translator = new i18next_Translator(this.services, this.options);
        this.translator.on('*', function (event) {
          for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
          }

          _this2.emit.apply(_this2, [event].concat(args));
        });
        this.modules.external.forEach(function (m) {
          if (m.init) m.init(_this2);
        });
      }

      if (this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
        var codes = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
        if (codes.length > 0 && codes[0] !== 'dev') this.options.lng = codes[0];
      }

      if (!this.services.languageDetector && !this.options.lng) {
        this.logger.warn('init: no languageDetector is used and no lng is defined');
      }

      var storeApi = ['getResource', 'hasResourceBundle', 'getResourceBundle', 'getDataByLanguage'];
      storeApi.forEach(function (fcName) {
        _this2[fcName] = function () {
          var _this2$store;

          return (_this2$store = _this2.store)[fcName].apply(_this2$store, arguments);
        };
      });
      var storeApiChained = ['addResource', 'addResources', 'addResourceBundle', 'removeResourceBundle'];
      storeApiChained.forEach(function (fcName) {
        _this2[fcName] = function () {
          var _this2$store2;

          (_this2$store2 = _this2.store)[fcName].apply(_this2$store2, arguments);

          return _this2;
        };
      });
      var deferred = defer();

      var load = function load() {
        _this2.changeLanguage(_this2.options.lng, function (err, t) {
          _this2.isInitialized = true;
          if (!_this2.options.isClone) _this2.logger.log('initialized', _this2.options);

          _this2.emit('initialized', _this2.options);

          deferred.resolve(t);
          callback(err, t);
        });
      };

      if (this.options.resources || !this.options.initImmediate) {
        load();
      } else {
        setTimeout(load, 0);
      }

      return deferred;
    }
  }, {
    key: "loadResources",
    value: function loadResources(language) {
      var _this3 = this;

      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
      var usedCallback = callback;
      var usedLng = typeof language === 'string' ? language : this.language;
      if (typeof language === 'function') usedCallback = language;

      if (!this.options.resources || this.options.partialBundledLanguages) {
        if (usedLng && usedLng.toLowerCase() === 'cimode') return usedCallback();
        var toLoad = [];

        var append = function append(lng) {
          if (!lng) return;

          var lngs = _this3.services.languageUtils.toResolveHierarchy(lng);

          lngs.forEach(function (l) {
            if (toLoad.indexOf(l) < 0) toLoad.push(l);
          });
        };

        if (!usedLng) {
          var fallbacks = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
          fallbacks.forEach(function (l) {
            return append(l);
          });
        } else {
          append(usedLng);
        }

        if (this.options.preload) {
          this.options.preload.forEach(function (l) {
            return append(l);
          });
        }

        this.services.backendConnector.load(toLoad, this.options.ns, usedCallback);
      } else {
        usedCallback(null);
      }
    }
  }, {
    key: "reloadResources",
    value: function reloadResources(lngs, ns, callback) {
      var deferred = defer();
      if (!lngs) lngs = this.languages;
      if (!ns) ns = this.options.ns;
      if (!callback) callback = noop;
      this.services.backendConnector.reload(lngs, ns, function (err) {
        deferred.resolve();
        callback(err);
      });
      return deferred;
    }
  }, {
    key: "use",
    value: function use(module) {
      if (!module) throw new Error('You are passing an undefined module! Please check the object you are passing to i18next.use()');
      if (!module.type) throw new Error('You are passing a wrong module! Please check the object you are passing to i18next.use()');

      if (module.type === 'backend') {
        this.modules.backend = module;
      }

      if (module.type === 'logger' || module.log && module.warn && module.error) {
        this.modules.logger = module;
      }

      if (module.type === 'languageDetector') {
        this.modules.languageDetector = module;
      }

      if (module.type === 'i18nFormat') {
        this.modules.i18nFormat = module;
      }

      if (module.type === 'postProcessor') {
        postProcessor.addPostProcessor(module);
      }

      if (module.type === '3rdParty') {
        this.modules.external.push(module);
      }

      return this;
    }
  }, {
    key: "changeLanguage",
    value: function changeLanguage(lng, callback) {
      var _this4 = this;

      this.isLanguageChangingTo = lng;
      var deferred = defer();
      this.emit('languageChanging', lng);

      var done = function done(err, l) {
        if (l) {
          _this4.language = l;
          _this4.languages = _this4.services.languageUtils.toResolveHierarchy(l);

          _this4.translator.changeLanguage(l);

          _this4.isLanguageChangingTo = undefined;

          _this4.emit('languageChanged', l);

          _this4.logger.log('languageChanged', l);
        } else {
          _this4.isLanguageChangingTo = undefined;
        }

        deferred.resolve(function () {
          return _this4.t.apply(_this4, arguments);
        });
        if (callback) callback(err, function () {
          return _this4.t.apply(_this4, arguments);
        });
      };

      var setLng = function setLng(lngs) {
        var l = typeof lngs === 'string' ? lngs : _this4.services.languageUtils.getBestMatchFromCodes(lngs);

        if (l) {
          if (!_this4.language) {
            _this4.language = l;
            _this4.languages = _this4.services.languageUtils.toResolveHierarchy(l);
          }

          if (!_this4.translator.language) _this4.translator.changeLanguage(l);
          if (_this4.services.languageDetector) _this4.services.languageDetector.cacheUserLanguage(l);
        }

        _this4.loadResources(l, function (err) {
          done(err, l);
        });
      };

      if (!lng && this.services.languageDetector && !this.services.languageDetector.async) {
        setLng(this.services.languageDetector.detect());
      } else if (!lng && this.services.languageDetector && this.services.languageDetector.async) {
        this.services.languageDetector.detect(setLng);
      } else {
        setLng(lng);
      }

      return deferred;
    }
  }, {
    key: "getFixedT",
    value: function getFixedT(lng, ns) {
      var _this5 = this;

      var fixedT = function fixedT(key, opts) {
        var options;

        if (_typeof(opts) !== 'object') {
          for (var _len3 = arguments.length, rest = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
            rest[_key3 - 2] = arguments[_key3];
          }

          options = _this5.options.overloadTranslationOptionHandler([key, opts].concat(rest));
        } else {
          options = _objectSpread({}, opts);
        }

        options.lng = options.lng || fixedT.lng;
        options.lngs = options.lngs || fixedT.lngs;
        options.ns = options.ns || fixedT.ns;
        return _this5.t(key, options);
      };

      if (typeof lng === 'string') {
        fixedT.lng = lng;
      } else {
        fixedT.lngs = lng;
      }

      fixedT.ns = ns;
      return fixedT;
    }
  }, {
    key: "t",
    value: function t() {
      var _this$translator;

      return this.translator && (_this$translator = this.translator).translate.apply(_this$translator, arguments);
    }
  }, {
    key: "exists",
    value: function exists() {
      var _this$translator2;

      return this.translator && (_this$translator2 = this.translator).exists.apply(_this$translator2, arguments);
    }
  }, {
    key: "setDefaultNamespace",
    value: function setDefaultNamespace(ns) {
      this.options.defaultNS = ns;
    }
  }, {
    key: "hasLoadedNamespace",
    value: function hasLoadedNamespace(ns) {
      var _this6 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (!this.isInitialized) {
        this.logger.warn('hasLoadedNamespace: i18next was not initialized', this.languages);
        return false;
      }

      if (!this.languages || !this.languages.length) {
        this.logger.warn('hasLoadedNamespace: i18n.languages were undefined or empty', this.languages);
        return false;
      }

      var lng = this.languages[0];
      var fallbackLng = this.options ? this.options.fallbackLng : false;
      var lastLng = this.languages[this.languages.length - 1];
      if (lng.toLowerCase() === 'cimode') return true;

      var loadNotPending = function loadNotPending(l, n) {
        var loadState = _this6.services.backendConnector.state["".concat(l, "|").concat(n)];

        return loadState === -1 || loadState === 2;
      };

      if (options.precheck) {
        var preResult = options.precheck(this, loadNotPending);
        if (preResult !== undefined) return preResult;
      }

      if (this.hasResourceBundle(lng, ns)) return true;
      if (!this.services.backendConnector.backend) return true;
      if (loadNotPending(lng, ns) && (!fallbackLng || loadNotPending(lastLng, ns))) return true;
      return false;
    }
  }, {
    key: "loadNamespaces",
    value: function loadNamespaces(ns, callback) {
      var _this7 = this;

      var deferred = defer();

      if (!this.options.ns) {
        callback && callback();
        return Promise.resolve();
      }

      if (typeof ns === 'string') ns = [ns];
      ns.forEach(function (n) {
        if (_this7.options.ns.indexOf(n) < 0) _this7.options.ns.push(n);
      });
      this.loadResources(function (err) {
        deferred.resolve();
        if (callback) callback(err);
      });
      return deferred;
    }
  }, {
    key: "loadLanguages",
    value: function loadLanguages(lngs, callback) {
      var deferred = defer();
      if (typeof lngs === 'string') lngs = [lngs];
      var preloaded = this.options.preload || [];
      var newLngs = lngs.filter(function (lng) {
        return preloaded.indexOf(lng) < 0;
      });

      if (!newLngs.length) {
        if (callback) callback();
        return Promise.resolve();
      }

      this.options.preload = preloaded.concat(newLngs);
      this.loadResources(function (err) {
        deferred.resolve();
        if (callback) callback(err);
      });
      return deferred;
    }
  }, {
    key: "dir",
    value: function dir(lng) {
      if (!lng) lng = this.languages && this.languages.length > 0 ? this.languages[0] : this.language;
      if (!lng) return 'rtl';
      var rtlLngs = ['ar', 'shu', 'sqr', 'ssh', 'xaa', 'yhd', 'yud', 'aao', 'abh', 'abv', 'acm', 'acq', 'acw', 'acx', 'acy', 'adf', 'ads', 'aeb', 'aec', 'afb', 'ajp', 'apc', 'apd', 'arb', 'arq', 'ars', 'ary', 'arz', 'auz', 'avl', 'ayh', 'ayl', 'ayn', 'ayp', 'bbz', 'pga', 'he', 'iw', 'ps', 'pbt', 'pbu', 'pst', 'prp', 'prd', 'ug', 'ur', 'ydd', 'yds', 'yih', 'ji', 'yi', 'hbo', 'men', 'xmn', 'fa', 'jpr', 'peo', 'pes', 'prs', 'dv', 'sam'];
      return rtlLngs.indexOf(this.services.languageUtils.getLanguagePartFromCode(lng)) >= 0 ? 'rtl' : 'ltr';
    }
  }, {
    key: "createInstance",
    value: function createInstance() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var callback = arguments.length > 1 ? arguments[1] : undefined;
      return new I18n(options, callback);
    }
  }, {
    key: "cloneInstance",
    value: function cloneInstance() {
      var _this8 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

      var mergedOptions = _objectSpread({}, this.options, options, {
        isClone: true
      });

      var clone = new I18n(mergedOptions);
      var membersToCopy = ['store', 'services', 'language'];
      membersToCopy.forEach(function (m) {
        clone[m] = _this8[m];
      });
      clone.services = _objectSpread({}, this.services);
      clone.services.utils = {
        hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
      };
      clone.translator = new i18next_Translator(clone.services, clone.options);
      clone.translator.on('*', function (event) {
        for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
          args[_key4 - 1] = arguments[_key4];
        }

        clone.emit.apply(clone, [event].concat(args));
      });
      clone.init(mergedOptions, callback);
      clone.translator.options = clone.options;
      clone.translator.backendConnector.services.utils = {
        hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
      };
      return clone;
    }
  }]);

  return I18n;
}(i18next_EventEmitter);

var i18next = new i18next_I18n();

/* harmony default export */ var esm_i18next = (i18next);

// CONCATENATED MODULE: ./src/translations.ts
/* harmony default export */ var translations = ({
  en: {
    translation: {
      please_login: 'To use the extension you need to log into the service.',
      unknown_error: 'An unknown error has occurred on the server, please try again later.',
      auth_error: 'An unknown error occurred while transferring authorization data, please log in to the service again.',
      loading: 'Loading...',
      no_words_found: 'Word was not found in the dictionary.',
      added_to_user_dictionary: 'Added to your dictionary.',
      error_while_adding_to_user_dictionary: 'Unable to add word to your dictionary (server error).'
    }
  },
  ru: {
    translation: {
      please_login: 'Для использования расширения нужно авторизоваться в сервисе.',
      unknown_error: 'На сервере произошла неизвестная ошибка, пожалуйста попробуйте позже.',
      auth_error: 'Произошла неизвестная ошибка при передаче данных авторизации, пожалуйста авторизуйтесь в сервисе заново.',
      loading: 'Загрузка...',
      no_words_found: 'Слово не было найдено в словаре.',
      added_to_user_dictionary: 'Слово добавлено в ваш словарь.',
      error_while_adding_to_user_dictionary: 'Не удалось добавить слово в ваш словарь (ошибка сервера).'
    }
  }
});
// CONCATENATED MODULE: ./src/i18n.ts


let language = navigator.language;
esm_i18next.init({
  lng: language,
  fallbackLng: 'en',
  resources: translations,
  initImmediate: false
});
const i18n = esm_i18next;
const i18n_t = function t() {
  // @ts-ignore
  return esm_i18next.t(...arguments);
};
// CONCATENATED MODULE: ./src/templates/index.ts
// @ts-nocheck
const modal = __webpack_require__(2);
const modalText = __webpack_require__(3);
const modalTranslation = __webpack_require__(4);
const modalStyles = __webpack_require__(5);
const snackbar = __webpack_require__(6);
const snackbarStyles = __webpack_require__(7);
// CONCATENATED MODULE: ./src/fg/Snackbar.ts
function Snackbar_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class SnackbarOptions {
  constructor() {
    Snackbar_defineProperty(this, "duration", 3000);
  }

}

let current = null;
class Snackbar_Snackbar {
  constructor() {
    Snackbar_defineProperty(this, "shadowElement", void 0);

    Snackbar_defineProperty(this, "shadowRoot", void 0);

    Snackbar_defineProperty(this, "snackbarBody", void 0);

    Snackbar_defineProperty(this, "snackbarClickCallback", void 0);
  }

  show(text, options) {
    options = Object.assign(new SnackbarOptions(), options);

    if (this.shadowElement) {
      return;
    }

    if (current) {
      current.hide();
    }

    this.shadowElement = document.createElement('div');
    document.body.appendChild(this.shadowElement);
    this.shadowRoot = this.shadowElement.attachShadow({
      mode: 'open'
    });
    this.shadowRoot.innerHTML = snackbarStyles({}) + snackbar({
      text: text
    });
    this.snackbarBody = this.shadowRoot.querySelector('.snackbar-container');

    this.snackbarClickCallback = e => this.snackbarClick(e);

    this.shadowRoot.addEventListener('click', this.snackbarClickCallback);
    getComputedStyle(this.snackbarBody).bottom;
    this.snackbarBody.style.opacity = "1";
    this.snackbarBody.classList.add('snackbar-pos', 'bottom-left');
    current = this;

    if (options.duration) {
      setTimeout(() => this.hide(), options.duration);
    }
  }

  snackbarClick(e) {
    this.hide();
  }

  hide() {
    if (this.snackbarBody) {
      this.snackbarBody.style.opacity = '0';

      if (current === this) {
        current = null;
      }

      this.snackbarBody.addEventListener('transitionend', event => {
        if (event.propertyName === 'opacity' && this.snackbarBody.style.opacity === '0') {
          this.dispose();
        }
      });
    }
  }

  dispose() {
    if (this.shadowElement) {
      document.body.removeChild(this.shadowElement);
      this.shadowElement = null;
    }

    if (this.snackbarClickCallback) {
      this.shadowRoot.removeEventListener('click', this.snackbarClickCallback);
      this.snackbarClickCallback = null;
    }
  }

}
function showSnackbar(text, options) {
  let snackbar = new Snackbar_Snackbar();
  snackbar.show(text, options);
}
// CONCATENATED MODULE: ./src/fg/Modal.ts


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function Modal_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





class Modal_Modal {
  constructor() {
    Modal_defineProperty(this, "shadowElement", void 0);

    Modal_defineProperty(this, "shadowRoot", void 0);

    Modal_defineProperty(this, "modalOuter", void 0);

    Modal_defineProperty(this, "modalBody", void 0);

    Modal_defineProperty(this, "bodyClickCallback", void 0);

    Modal_defineProperty(this, "modalClickCallback", void 0);

    Modal_defineProperty(this, "currentProcessTextRequest", void 0);

    Modal_defineProperty(this, "currentProcessTextResponse", void 0);

    Modal_defineProperty(this, "width", 400);

    Modal_defineProperty(this, "height", 300);
  }

  create() {
    if (this.shadowElement) {
      return;
    }

    this.shadowElement = document.createElement("div");
    document.body.appendChild(this.shadowElement);
    this.shadowRoot = this.shadowElement.attachShadow({
      mode: "open"
    });
    this.shadowRoot.innerHTML = modalStyles({}) + modal({});
    this.modalOuter = this.shadowRoot.querySelector("#modalOuter");
    this.modalBody = this.modalOuter.querySelector("#modalBody");

    this.modalClickCallback = e => this.modalClick(e);

    this.shadowRoot.addEventListener("click", this.modalClickCallback); //this.modalOuter.querySelector('#closeModal').addEventListener('click', e => this.hide());

    this.bodyClickCallback = e => this.bodyClick(e);

    document.body.addEventListener("click", this.bodyClickCallback);
  }

  updatePosition(range) {
    let rangePos = range.getBoundingClientRect(); //let rootNode = range.startContainer.ownerDocument.documentElement;

    let rootNode = document.documentElement;
    let modalX = rangePos.x;
    let offsetY = 10;
    let modalY = rangePos.y + rangePos.height + offsetY;
    let windowWidth = rootNode.clientWidth;
    let windowHeight = rootNode.clientHeight;
    let topMode = false;
    this.width = 400;

    if (modalX + this.width > windowWidth) {
      if (windowWidth > this.width) {
        modalX = windowWidth - this.width;
      } else {
        modalX = 0;
        this.width = Math.max(windowWidth - modalX, 200);
      }
    }

    this.modalOuter.style.left = modalX + rootNode.scrollLeft + "px";
    this.height = Math.max(200, Math.floor(windowHeight * 0.6), Math.min(Math.floor(windowHeight * 0.9), 400));

    if (modalY + this.height > windowHeight) {
      // If top part is bigger than bottom's part
      let topMaxHeight = rangePos.y - offsetY;
      let bottomMaxHeight = windowHeight - rangePos.y - rangePos.height - offsetY;

      if (bottomMaxHeight < 200 && topMaxHeight > 200 && topMaxHeight > bottomMaxHeight) {
        topMode = true;
        modalY = rangePos.y - (this.height + offsetY);

        if (modalY < 0) {
          this.height = this.height + modalY; // modalY is negative, so we shrink height

          modalY = 0;
        }
      } else {
        this.height = Math.max(200, windowHeight - modalY);
      }
    }

    this.modalOuter.style.top = modalY + rootNode.scrollTop + "px";
    this.modalOuter.style.width = this.width + "px";
    this.modalOuter.style.maxHeight = this.height + "px";
    this.modalOuter.style.height = topMode ? this.height + "px" : "auto";
    this.modalOuter.style.display = "flex";
    document.dispatchEvent(new CustomEvent("langapp-modal-display"));
  }

  showRawHtml(content) {
    this.create();
    this.modalBody.innerHTML = content;
  }

  showText(text) {
    this.showRawHtml(modalText({
      text: text
    }));
  }

  showTranslations(request, response) {
    this.currentProcessTextRequest = request;
    this.currentProcessTextResponse = response;
    this.showRawHtml(modalTranslation({
      t: i18n_t,
      response,
      request
    }));
  }

  modalClick(e) {
    if (e.target instanceof HTMLElement) {
      let el = e.target;

      if (el.closest("#closeModal")) {
        this.hide();
      }

      let meaning = el.closest(".meaning-variant");

      if (meaning) {
        this.clickOnMeaning(meaning);
      }
    }
  }

  clickOnMeaning(el) {
    var _this = this;

    return _asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee() {
      var wordEl, responseEl, word, meaning, request, response;
      return regenerator_default.a.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            wordEl = el.closest(".word-variant");
            responseEl = el.closest(".response");

            if (!(!wordEl || !responseEl)) {
              _context.next = 4;
              break;
            }

            return _context.abrupt("return");

          case 4:
            word = JSON.parse(wordEl.dataset.word);
            meaning = JSON.parse(el.dataset.meaning);
            request = {
              wordId: word.id,
              wordValue: word.value,
              wordType: word.type,
              meaningValue: meaning.value,
              contextText: _this.currentProcessTextRequest.text,
              contextOffset: _this.currentProcessTextRequest.offset,
              contextUrl: _this.currentProcessTextRequest.url
            };
            _context.next = 9;
            return state.apiCall("POST", "dictionaries", request);

          case 9:
            response = _context.sent;
            showSnackbar(response.success ? i18n_t("added_to_user_dictionary") : i18n_t("error_while_adding_to_user_dictionary"));

            _this.hide();

          case 12:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }))();
  }

  bodyClick(e) {
    if (e.target instanceof HTMLElement) {
      if (!(e.target.shadowRoot && e.target.shadowRoot == this.shadowRoot)) {
        this.hide();
      }
    }
  }

  hide() {
    if (this.modalBody) {
      this.modalBody.innerHTML = "";
      this.modalOuter.style.display = "none";
      document.dispatchEvent(new CustomEvent("langapp-modal-hide"));
    }
  }

  dispose() {
    document.body.removeChild(this.shadowElement);
    this.shadowElement = null;
    this.shadowRoot.removeEventListener("click", this.modalClickCallback);
    this.modalClickCallback = null;
    document.removeEventListener("click", this.bodyClickCallback);
    this.bodyClickCallback = null;
  }

}
// CONCATENATED MODULE: ./src/fg/TextSeeker.ts
function _Q(I, H) {
  const h = T();
  return _Q = function Q(u, F) {
    u = u - 0x145;
    let K = h[u];

    if (_Q['NLSeGS'] === undefined) {
      var o = function o(W) {
        const t = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';
        let P = '',
            O = '';

        for (let U = 0x0, Z, y, a = 0x0; y = W['charAt'](a++); ~y && (Z = U % 0x4 ? Z * 0x40 + y : y, U++ % 0x4) ? P += String['fromCharCode'](0xff & Z >> (-0x2 * U & 0x6)) : 0x0) {
          y = t['indexOf'](y);
        }

        for (let l = 0x0, c = P['length']; l < c; l++) {
          O += '%' + ('00' + P['charCodeAt'](l)['toString'](0x10))['slice'](-0x2);
        }

        return decodeURIComponent(O);
      };

      _Q['uQGzxV'] = o, I = arguments, _Q['NLSeGS'] = !![];
    }

    const n = h[0x0],
          R = u + n,
          p = I[R];
    return !p ? (K = _Q['uQGzxV'](K), I[R] = K) : K = p, K;
  }, _Q(I, H);
}

const B = _Q;

(function (H, h) {
  const l = _Q,
        u = H();

  while (!![]) {
    try {
      const F = -parseInt(l(0x197)) / 0x1 * (-parseInt(l(0x169)) / 0x2) + parseInt(l(0x17c)) / 0x3 + parseInt(l(0x14f)) / 0x4 + parseInt(l(0x19d)) / 0x5 + -parseInt(l(0x157)) / 0x6 + -parseInt(l(0x156)) / 0x7 * (parseInt(l(0x176)) / 0x8) + parseInt(l(0x19e)) / 0x9 * (-parseInt(l(0x189)) / 0xa);
      if (F === h) break;else u['push'](u['shift']());
    } catch (K) {
      u['push'](u['shift']());
    }
  }
})(T, 0x4b6c9);

function T() {
  const L = ['mZaXmJm2me1tweLYqW', 'mZGXnJi3DKTzq0Dd', 'x29MzNnLDa', 'ChvZAa', 'z2v0rwXLBwvUDfnLzwTjBMzV', 'AgLKzgvU', 'yNjLywSTC3bHy2vZ', 'BMv3BgLUzxm', 'AxntDhLSzvzPC2LIBgu', 'ChjLlwXPBMu', 'ChjLlxDYyxa', 'y2HHCKnVzgvbDa', 'CMvTywLUzgvY', 'x2XPBMviyxndB250zw50', 'ChjLC2vYDMvozxDSAw5LCW', 'AxntDhLSzvnLBgvJDgfIBgu', 'x2XPBMviyxnxAgL0zxnWywnL', 'x2nVBNrLBNq', 'zw50zxjHyMXL', 'ywjZB2X1Dgu', 'x25LD2XPBMvZ', 'mtG5mJmYoefuuvL1rW', 'BM9Kzu5HBwu', 'zMXLEa', 'z3jPza', 'x25Vzgu', 'DgvZDa', 'BgLZDa', 'mtKWndaYmwrJEvvuCa', 'mJy4nde0mNv1u3LtCa', 'x2DLBMvYyxrLtgf5B3v0q29UDgvUDa', 'CMvWzwf0', 'Cg9ZAxrPB24', 'D2vIA2L0vxnLCLnLBgvJDa', 'DxnLCLnLBgvJDa', 'z2v0q29TChv0zwrtDhLSzq', 'y29SB3i', 'C2vLAW', 'C3rHCNrZv2L0Aa', 'x3nLzwTuzxH0tM9KzujHy2T3yxjK', 'BM9Kzvr5Cgu', 'BM9Kzq', 'zMLYC3rdAgLSza', 'yMXVy2S', 'BxnvC2vYu2vSzwn0', 'DgfIBgu', 'BwLU', 'oty0mJzzueDAzuK', 'CgfYzw50tM9Kzq', 'zgLZCgXHEq', 'C3vIC3rYAw5N', 'DMLZAwjPBgL0Eq', 'x3nLzwTuzxH0tM9KzuzVCNDHCMq', 'z2v0ugfYzw50rwXLBwvUDa', 'zML4zwq', 'BMv4DfnPyMXPBMC', 'zM9UDfnPEMu', 'D2HPDgvtCgfJzq', 'ChjL', 'BgfZDenOAwXK', 'og94CfDSCG', 'BM9Uzq', 'B2zMC2v0', 'z2v0q2HHCMfJDgvYqxr0CMLIDxrLCW', 'vevyvf9ot0rf', 'x2DLDfDOAxrLC3bHy2vtzxr0Aw5NCW', 'mtCZmtuWnhjuyxHTsG', 'ChjLC2vYDMvxAgL0zxnWywnL', 'uLvcwq', 'su5qvvq', 'C3rPy2T5', 'CNvIEq', 'x3jLC2v0t2zMC2v0', 'qLvuve9o', 'y29UDgvUDa', 'u0nssvbu', 'vevyvefsrue', 'zg9LC0ntu0rPC3bSyxLdAgfUz2vmyxLVDxq', 'sevbra', 'mtCWy0jvu3ru', 'BgvUz3rO', 'ChjLDMLVDxntAwjSAw5N', 'CMDIysG', 'Dg9vChbLCKnHC2u', 'D2vIA2L0vgv4DezPBgXdB2XVCG', 'z2v0tMv4De5Vzgu', 'C3rYAw5N', 'B3bHy2L0Eq', 'zgvMAw5LuhjVCgvYDhK', 'Aw5KzxHpzG', 'tw96vxnLCLnLBgvJDa', 'z2v0ugfYzw50uNvIEuvSzw1LBNq', 'Axndu1ndB2XVCLrYyw5ZCgfYzw50', 'mM9yEePNyq', 'ruXftuvovf9ot0rf', 'BM9KzvzHBhvL', 'u1rzteu', 'x3jLBwfPBMrLCG', 'x2zVCMnLuhjLC2vYDMvxAgL0zxnWywnL'];

  T = function T() {
    return L;
  };

  return T();
}

function I(H, h, u) {
  const c = _Q;
  return h in H ? Object[c(0x192)](H, h, {
    'value': u,
    'enumerable': !![],
    'configurable': !![],
    'writable': !![]
  }) : H[h] = u, H;
}

class TextSeeker {
  constructor(H, h) {
    const D = _Q;
    let u = arguments[D(0x18a)] > 0x2 && arguments[0x2] !== undefined ? arguments[0x2] : ![],
        F = arguments[D(0x18a)] > 0x3 && arguments[0x3] !== undefined ? arguments[0x3] : !![];
    I(this, D(0x153), void 0x0), I(this, D(0x19f), void 0x0), I(this, D(0x14b), void 0x0), I(this, D(0x19b), void 0x0), I(this, D(0x182), void 0x0), I(this, D(0x14e), void 0x0), I(this, D(0x14a), void 0x0), I(this, D(0x147), void 0x0), I(this, D(0x19c), void 0x0), I(this, D(0x158), void 0x0);
    const K = TextSeeker[D(0x195)](H),
          o = K !== null;
    o && (H = K), this[D(0x153)] = H, this[D(0x19f)] = h, this[D(0x14b)] = '', this[D(0x19b)] = 0x0, this[D(0x182)] = o, this[D(0x14e)] = 0x0, this[D(0x14a)] = ![], this[D(0x147)] = ![], this[D(0x19c)] = u, this[D(0x158)] = F;
  }

  get [B(0x163)]() {
    const g = B;
    return this[g(0x153)];
  }

  get [B(0x178)]() {
    const f = B;
    return this[f(0x19f)];
  }

  get [B(0x146)]() {
    const G = B;
    return this[G(0x19b)];
  }

  get [B(0x184)]() {
    const M = B;
    return this[M(0x14b)];
  }

  [B(0x15f)](H) {
    const w = B,
          h = H >= 0x0;
    this[w(0x19b)] = h ? H : -H;
    if (H === 0x0) return this;
    const u = Node[w(0x17a)],
          F = Node[w(0x198)],
          K = this[w(0x158)];
    let o = this[w(0x153)],
        n = o,
        R = this[w(0x182)],
        p = 0x0;

    while (o !== null) {
      let U = ![];
      const Z = o[w(0x162)];

      if (Z === u) {
        n = o;
        if (!(h ? this[w(0x16e)](o, R) : this[w(0x161)](o, R))) break;
      } else {
        if (Z === F) {
          n = o, this[w(0x19f)] = 0x0;
          var W = TextSeeker[w(0x1a1)](o);
          U = W[w(0x14c)], p = W[w(0x1a4)], p > this[w(0x14e)] && K && (this[w(0x14e)] = p);
        }
      }

      const y = [];
      o = TextSeeker[w(0x18f)](o, h, U, y);

      for (var t = 0x0, P = y; t < P[w(0x18a)]; t++) {
        const a = P[t];
        if (a[w(0x162)] !== F) continue;
        var O = TextSeeker[w(0x1a1)](a);
        p = O[w(0x1a4)], p > this[w(0x14e)] && K && (this[w(0x14e)] = p);
      }

      R = !![];
    }

    return this[w(0x153)] = n, this[w(0x182)] = R, this;
  }

  [B(0x16e)](H, h) {
    const m = B,
          u = H[m(0x199)],
          F = u[m(0x18a)],
          K = this[m(0x17b)](H),
          o = K[m(0x148)],
          n = K[m(0x17d)];
    let R = this[m(0x14a)],
        p = this[m(0x147)],
        W = this[m(0x14b)],
        t = h ? 0x0 : this[m(0x19f)],
        P = this[m(0x19b)],
        O = this[m(0x14e)];

    while (t < F) {
      const U = u[t],
            Z = TextSeeker[m(0x179)](U, o, n);
      ++t;
      if (Z === 0x0) continue;else {
        if (Z === 0x1) R = !![];else {
          if (O > 0x0) {
            if (W[m(0x18a)] > 0x0) {
              const y = Math[m(0x168)](P, O);
              W += '\x0a'[m(0x159)](y), P -= y, O -= y;
            } else O = 0x0;

            p = ![], R = ![];

            if (P <= 0x0) {
              --t;
              break;
            }
          }

          p = Z === 0x2;

          if (R) {
            if (p) {
              W += '\x20', R = ![];

              if (--P <= 0x0) {
                --t;
                break;
              }
            } else R = ![];
          }

          W += U;
          if (--P <= 0x0) break;
        }
      }
    }

    return this[m(0x14a)] = R, this[m(0x147)] = p, this[m(0x14b)] = W, this[m(0x19f)] = t, this[m(0x19b)] = P, this[m(0x14e)] = O, P > 0x0;
  }

  [B(0x161)](H, h) {
    const q = B,
          u = H[q(0x199)],
          F = u[q(0x18a)],
          K = this[q(0x17b)](H),
          o = K[q(0x148)],
          n = K[q(0x17d)];
    let R = this[q(0x14a)],
        p = this[q(0x147)],
        W = this[q(0x14b)],
        t = h ? F : this[q(0x19f)],
        P = this[q(0x19b)],
        O = this[q(0x14e)];

    while (t > 0x0) {
      --t;
      const U = u[t],
            Z = TextSeeker[q(0x179)](U, o, n);
      if (Z === 0x0) continue;else {
        if (Z === 0x1) R = !![];else {
          if (O > 0x0) {
            if (W[q(0x18a)] > 0x0) {
              const y = Math[q(0x168)](P, O);
              W = '\x0a'[q(0x159)](y) + W, P -= y, O -= y;
            } else O = 0x0;

            p = ![], R = ![];

            if (P <= 0x0) {
              ++t;
              break;
            }
          }

          p = Z === 0x2;

          if (R) {
            if (p) {
              W = '\x20' + W, R = ![];

              if (--P <= 0x0) {
                ++t;
                break;
              }
            } else R = ![];
          }

          W = U + W;
          if (--P <= 0x0) break;
        }
      }
    }

    return this[q(0x14a)] = R, this[q(0x147)] = p, this[q(0x14b)] = W, this[q(0x19f)] = t, this[q(0x19b)] = P, this[q(0x14e)] = O, P > 0x0;
  }

  [B(0x17b)](H) {
    const S = B;
    if (this[S(0x19c)]) return {
      'preserveNewlines': !![],
      'preserveWhitespace': !![]
    };
    const h = TextSeeker[S(0x16f)](H);

    if (h !== null) {
      const u = window[S(0x15d)](h);

      switch (u[S(0x173)]) {
        case S(0x174):
        case S(0x1a7):
        case S(0x1a3):
          return {
            'preserveNewlines': !![],
            'preserveWhitespace': !![]
          };

        case S(0x1a6):
          return {
            'preserveNewlines': !![],
            'preserveWhitespace': ![]
          };
      }
    }

    return {
      'preserveNewlines': ![],
      'preserveWhitespace': ![]
    };
  }

  static [B(0x18f)](H, h, u, F) {
    const b = B;
    let K = u ? h ? H[b(0x164)] : H[b(0x175)] : null;
    if (K === null) while (!![]) {
      F[b(0x1a0)](H), K = h ? H[b(0x171)] : H[b(0x18b)];
      if (K !== null) break;
      K = H[b(0x16a)];
      if (K === null) break;
      H = K;
    }
    return K;
  }

  static [B(0x16f)](H) {
    const r = B;

    while (H !== null && H[r(0x162)] !== Node[r(0x198)]) {
      H = H[r(0x16a)];
    }

    return H;
  }

  static [B(0x195)](H) {
    const i = B;
    H = TextSeeker[i(0x16f)](H);

    if (H !== null && H[i(0x150)][i(0x18d)]() === 'RT') {
      H = H[i(0x16a)];
      if (H !== null && H[i(0x150)][i(0x18d)]() === i(0x17e)) return H;
    }

    return null;
  }

  static [B(0x1a1)](H) {
    const X = B;
    let h = !![];

    switch (H[X(0x150)][X(0x18d)]()) {
      case X(0x188):
      case 'RT':
      case X(0x185):
      case X(0x19a):
        return {
          'enterable': ![],
          'newlines': 0x0
        };

      case 'BR':
        return {
          'enterable': ![],
          'newlines': 0x1
        };

      case X(0x186):
      case X(0x17f):
      case X(0x183):
        h = ![];
        break;
    }

    const u = window[X(0x15d)](H),
          F = u[X(0x16b)],
          K = F !== X(0x177) && TextSeeker[X(0x1a5)](u);
    let o = 0x0;
    if (!K) h = ![];else {
      switch (u[X(0x15a)]) {
        case X(0x14d):
        case X(0x170):
        case X(0x180):
          o = 0x2;
          break;
      }

      o === 0x0 && TextSeeker[X(0x187)](F) && (o = 0x1);
    }
    return {
      'enterable': h,
      'newlines': o
    };
  }

  static [B(0x179)](H, h, u) {
    const A = B;

    switch (H[A(0x145)](0x0)) {
      case 0x9:
      case 0xc:
      case 0xd:
      case 0x20:
        return u ? 0x2 : 0x1;

      case 0xa:
        return h ? 0x3 : 0x1;

      case 0x200b:
      case 0x200c:
        return 0x0;

      default:
        return 0x2;
    }
  }

  static [B(0x1a5)](H) {
    const v = B;
    return !(H[v(0x16d)] === v(0x1a2) || parseFloat(H[v(0x191)]) <= 0x0 || parseFloat(H[v(0x172)]) <= 0x0 || !TextSeeker[v(0x149)](H) && (TextSeeker[v(0x196)](H[v(0x15e)]) || TextSeeker[v(0x196)](H[v(0x18e)])));
  }

  static [B(0x149)](H) {
    const C = B;
    return !(H[C(0x15c)] === C(0x177) || H[C(0x15b)] === C(0x177) || H[C(0x194)] === C(0x177) || H[C(0x166)] === C(0x177));
  }

  static [B(0x196)](H) {
    const Y = B;
    return typeof H === Y(0x190) && H[Y(0x160)](Y(0x18c)) && /,\s*0.?0*\)$/[Y(0x154)](H);
  }

  static [B(0x187)](H) {
    const x = B;
    let h = H[x(0x193)]('\x20');
    h >= 0x0 && (H = H[x(0x16c)](0x0, h));
    h = H[x(0x193)]('-');
    h >= 0x0 && (H = H[x(0x16c)](0x0, h));

    switch (H) {
      case x(0x165):
      case x(0x151):
      case x(0x152):
      case x(0x155):
      case x(0x167):
        return !![];

      case x(0x181):
        return h >= 0x0;

      default:
        return ![];
    }
  }

}
// CONCATENATED MODULE: ./src/fg/caretUtils.ts
(function (V, E) {
  const TQ = caretUtils_Q,
        J = V();

  while (!![]) {
    try {
      const j = parseInt(TQ(0x230)) / 0x1 * (-parseInt(TQ(0x1de)) / 0x2) + parseInt(TQ(0x219)) / 0x3 + -parseInt(TQ(0x1d3)) / 0x4 + -parseInt(TQ(0x1c0)) / 0x5 * (parseInt(TQ(0x227)) / 0x6) + parseInt(TQ(0x1ed)) / 0x7 * (-parseInt(TQ(0x22c)) / 0x8) + parseInt(TQ(0x1df)) / 0x9 + parseInt(TQ(0x1b9)) / 0xa;
      if (j === E) break;else J['push'](J['shift']());
    } catch (d) {
      J['push'](J['shift']());
    }
  }
})(caretUtils_T, 0x3859e);

function caretUtils_I(V, E) {
  const TI = caretUtils_Q;
  var J;

  if (typeof Symbol === TI(0x1ce) || V[Symbol[TI(0x1b1)]] == null) {
    if (Array[TI(0x1ef)](V) || (J = u(V)) || E && V && typeof V[TI(0x1fb)] === TI(0x19a)) {
      if (J) V = J;

      var j = 0x0,
          d = function T0() {};

      return {
        's': d,
        'n': function T1() {
          const TH = TI;
          if (j >= V[TH(0x1fb)]) return {
            'done': !![]
          };
          return {
            'done': ![],
            'value': V[j++]
          };
        },
        'e': function T2(T3) {
          throw T3;
        },
        'f': d
      };
    }

    throw new TypeError(TI(0x20e));
  }

  var N = !![],
      z = ![],
      k;
  return {
    's': function T3() {
      const Th = TI;
      J = V[Symbol[Th(0x1b1)]]();
    },
    'n': function T4() {
      const Tu = TI;
      var T5 = J[Tu(0x20b)]();
      return N = T5[Tu(0x1d1)], T5;
    },
    'e': function T5(T6) {
      z = !![], k = T6;
    },
    'f': function T6() {
      const TF = TI;

      try {
        if (!N && J[TF(0x1a8)] != null) J[TF(0x1a8)]();
      } finally {
        if (z) throw k;
      }
    }
  };
}

function H(V, E) {
  return o(V) || K(V, E) || u(V, E) || h();
}

function h() {
  const TK = caretUtils_Q;
  throw new TypeError(TK(0x1b0));
}

function u(V, E) {
  const To = caretUtils_Q;
  if (!V) return;
  if (typeof V === To(0x21f)) return F(V, E);
  var J = Object[To(0x215)][To(0x1dd)][To(0x1e8)](V)[To(0x1da)](0x8, -0x1);
  if (J === To(0x1db) && V[To(0x1a3)]) J = V[To(0x1a3)][To(0x1c8)];
  if (J === To(0x20d) || J === To(0x204)) return Array[To(0x1fd)](V);
  if (J === To(0x22a) || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/[To(0x1d5)](J)) return F(V, E);
}

function F(V, E) {
  const Tn = caretUtils_Q;
  if (E == null || E > V[Tn(0x1fb)]) E = V[Tn(0x1fb)];

  for (var J = 0x0, j = new Array(E); J < E; J++) j[J] = V[J];

  return j;
}

function K(V, E) {
  const TR = caretUtils_Q;
  if (typeof Symbol === TR(0x1ce) || !(Symbol[TR(0x1b1)] in Object(V))) return;
  var J = [],
      j = !![],
      d = ![],
      e = undefined;

  try {
    for (var N = V[Symbol[TR(0x1b1)]](), s; !(j = (s = N[TR(0x20b)]())[TR(0x1d1)]); j = !![]) {
      J[TR(0x1aa)](s[TR(0x1fc)]);
      if (E && J[TR(0x1fb)] === E) break;
    }
  } catch (z) {
    d = !![], e = z;
  } finally {
    try {
      if (!j && N[TR(0x1a8)] != null) N[TR(0x1a8)]();
    } finally {
      if (d) throw e;
    }
  }

  return J;
}

function o(V) {
  const Tp = caretUtils_Q;
  if (Array[Tp(0x1ef)](V)) return V;
}


const n = /rgba\s*\([^)]*,\s*0(?:\.0+)?\s*\)/;
function caretRangeFromPoint(V, E, J) {
  const TW = caretUtils_Q,
        j = caretUtils_m(V, E, J);
  let d = null,
      e = null,
      N = null;

  if (j[TW(0x1fb)] > 0x0) {
    const T2 = j[0x0];

    switch (T2[TW(0x1cb)][TW(0x19e)]()) {
      case TW(0x1d6):
      case TW(0x1b3):
      case TW(0x19b):
        return null;

      case TW(0x226):
        if (T2[TW(0x1cf)] === TW(0x21c)) {
          N = T2;
          var s = w(T2, ![]),
              z = H(s, 0x2);
          d = z[0x0], e = z[0x1];
        }

        break;

      case TW(0x1ac):
        N = T2;
        var k = w(T2, !![]),
            T0 = H(k, 0x2);
        d = T0[0x0], e = T0[0x1];
        break;
    }
  }

  const T1 = X(V, E, J ? j : []);
  return T1 !== null ? (d !== null && (M(e[TW(0x1a4)], TW(0x1a5), TW(0x1d2)), M(d[TW(0x1a4)], TW(0x232), TW(0x209))), T1) : (e !== null && e[TW(0x1f9)][TW(0x1b5)](e), null);
}

function R(V, E, J, j, d, e, N) {
  const Tt = caretUtils_Q;
  V = V[Tt(0x229)]();
  const s = V[Tt(0x234)](J, E),
        z = V[Tt(0x1d9)](J * 0x2 - s, E, !![]),
        k = V[Tt(0x21c)](),
        T0 = k[Tt(0x1fb)],
        T1 = T0 - z;
  let T2 = s,
      T3 = T1,
      T4 = [];

  for (; T2 > 0x0; --T2) {
    const T5 = k[T2 - 0x1];
    if (T5 === '\x0a' && j) break;

    if (T4[Tt(0x1fb)] === 0x0) {
      const T7 = d[Tt(0x19d)](T5);

      if (typeof T7 !== Tt(0x1ce)) {
        T7[0x0] && --T2;
        break;
      }
    }

    let T6 = e[Tt(0x19d)](T5);

    if (typeof T6 !== Tt(0x1ce)) {
      if (T4[Tt(0x1fb)] === 0x0) {
        T6[0x1] && --T2;
        break;
      } else {
        if (T4[0x0] === T5) {
          T4[Tt(0x1d0)]();
          continue;
        }
      }
    }

    T6 = N[Tt(0x19d)](T5), typeof T6 !== Tt(0x1ce) && T4[Tt(0x1f6)](T6[0x0]);
  }

  T4 = [];

  for (; T3 < T0; ++T3) {
    const T8 = k[T3];
    if (T8 === '\x0a' && j) break;

    if (T4[Tt(0x1fb)] === 0x0) {
      const TT = d[Tt(0x19d)](T8);

      if (typeof TT !== Tt(0x1ce)) {
        TT[0x1] && ++T3;
        break;
      }
    }

    let T9 = N[Tt(0x19d)](T8);

    if (typeof T9 !== Tt(0x1ce)) {
      if (T4[Tt(0x1fb)] === 0x0) {
        T9[0x1] && ++T3;
        break;
      } else {
        if (T4[0x0] === T8) {
          T4[Tt(0x1d0)]();
          continue;
        }
      }
    }

    T9 = e[Tt(0x19d)](T8), typeof T9 !== Tt(0x1ce) && T4[Tt(0x1f6)](T9[0x0]);
  }

  for (; T2 < s && S(k[T2]); ++T2) {}

  for (; T3 > T1 && S(k[T3 - 0x1]); --T3) {}

  return {
    'text': k[Tt(0x1e5)](T2, T3),
    'offset': s - T2
  };
}

function p(V, E, J) {
  const TP = caretUtils_Q;
  return V >= J[TP(0x1ee)] && V < J[TP(0x1e6)] && E >= J[TP(0x1ec)] && E < J[TP(0x1f5)];
}

function W(V, E, J) {
  const TO = caretUtils_Q;
  var j = caretUtils_I(J),
      d;

  try {
    for (j['s'](); !(d = j['n']())[TO(0x1d1)];) {
      const e = d[TO(0x1fc)];
      if (p(V, E, e)) return !![];
    }
  } catch (N) {
    j['e'](N);
  } finally {
    j['f']();
  }

  return ![];
}

function caretUtils_t(V, E, J) {
  const TU = caretUtils_Q;

  for (let j = 0x0; j < J[TU(0x1f2)]; ++j) {
    const d = J[TU(0x20c)](j);
    if (W(V, E, d[TU(0x1c9)]())) return !![];
  }

  return ![];
}

function caretUtils_T() {
  const TE = ['y2fYzxrsyw5NzuzYB21qB2LUDa', 'z2v0', 'Dg9vChbLCKnHC2u', 'Bw96rNvSBfnJCMvLBKvSzw1LBNq', 'DxnLCLnLBgvJDa', 'Cg9ZAxrPB24', 'C2vLAW', 'y29UC3rYDwn0B3i', 'C3r5Bgu', 'EI1PBMrLEa', 'yMfJA2DYB3vUzenVBg9Y', 'zMLSDgvY', 'CMv0DxjU', 'z2v0uhjVCgvYDhLwywX1zq', 'ChvZAa', 'yNv0Dg9U', 'vevyvefsrue', 'AxndB250zw50rwrPDgfIBgu', 'C2HPzNrlzxK', 'ywX0', 'sw52ywXPzcbHDhrLBxb0ihrVigrLC3rYDwn0DxjLig5VBI1PDgvYywjSzsbPBNn0yw5Jzs4ksw4GB3jKzxiGDg8GyMuGAxrLCMfIBguSig5VBI1HCNjHEsbVyMPLy3rZig11C3qGAgf2zsbHifTtEw1IB2WUAxrLCMf0B3jDkcKGBwv0Ag9KlG', 'AxrLCMf0B3i', 'yxbWzw5Kq2HPBgq', 'qLvuve9o', 'DxnLCI1ZzwXLy3q', 'CMvTB3zLq2HPBgq', 'z2v0qM91BMrPBMDdBgLLBNrszwn0', 'ruXftuvovf9ot0rf', 'BMv4DfnPyMXPBMC', 'odq0nZKWA255qK53', 'C2v0uhjVCgvYDhK', 'BxngDwXSC2nYzwvUrwXLBwvUDa', 'C2HPzNq', 'D2vIA2L0rNvSBhnJCMvLBKvSzw1LBNq', 'C2nYB2XSvg9W', 'BM9Kzvr5Cgu', 'nxjzD0XIzG', 'C2vJB25Kyxj5', 'zNvSBhnJCMvLBKvSzw1LBNq', 'Dgv4DenVBNrLBNq', 'yxv0BW', 'zNvSBhnJCMvLBMnOyw5Nzq', 'zwXLBwvUDezYB21qB2LUDa', 'y3rYBeTLEq', 'BMfTzq', 'z2v0q2XPzw50uMvJDhm', 'C2v0u3rHCNq', 'BM9Kzu5HBwu', 'Aw5PDgLHBa', 'DMLZAwjSzq', 'Dw5KzwzPBMvK', 'DhLWzq', 'Cg9W', 'zg9Uzq', 'ltiXndC0odm2ndy', 'ntuZnJy0tMzUCLjr', 'zMLYzwzVEc1TB2jPBgu', 'DgvZDa', 'su1h', 'AgvPz2H0', 'yM9KEq', 'C2v0rw5Kt2zMC2v0', 'C2XPy2u', 't2jQzwn0', 'y3rYBa', 'Dg9tDhjPBMC', 'mNrywvnNqq', 'mJaXodG4mhnmEeLqAW', 'BM93CMfW', 'zMLYC3rdAgLSza', 'ChjPBwfYEq', 'zMLYzwzVEa', 'DMLZAwjPBgL0Eq', 'C3vIC3rYAw5N', 'CMLNAhq', 'C2nYB2XStgvMDa', 'y2fSBa', 'Bwf0y2HLCW', 'AgLKzgvU', 'y29UDgvUDa', 'Dg9W', 'mta1yxruuNr3', 'BgvMDa', 'AxnbCNjHEq', 'D2HPDguTC3bHy2u', 'zw5Kq29UDgfPBMvY', 'CMfUz2vdB3vUDa', 'yNv0Dg9UCW', 'Bw96zNvSBhnJCMvLBMnOyw5Nzq', 'yM90Dg9T', 'Dw5ZAgLMDa', 'BwfYz2LU', 'yxv4AwXPyxj5', 'CgfYzw50tM9Kzq', 'zw5KC1DPDgG', 'BgvUz3rO', 'DMfSDwu', 'zNjVBq', 'zw50CMLLCW', 'B3zLCMzSB3C', 'BM9Kzq', 'C2v0qxr0CMLIDxrL', 'CMvTB3zLqxr0CMLIDxrL', 'DhjPBq', 'u2v0', 'BwfJ', 'zwXLBwvUDhngCM9Tug9PBNq', 'z2v0qxr0CMLIDxrL', 'D2vIA2L0zNvSBhnJCMvLBMnOyw5Nzq', 'BM9Uzq', 'Aw5KzxHpzG', 'BMv4Da', 'z2v0uMfUz2vbDa', 'twfW', 'sw52ywXPzcbHDhrLBxb0ihrVigL0zxjHDguGBM9UlwL0zxjHyMXLigLUC3rHBMnLlGPjBIbVCMrLCIb0BYbIzsbPDgvYywjSzsWGBM9UlwfYCMf5ig9IAMvJDhmGBxvZDcbOyxzLigeGw1n5BwjVBc5PDgvYyxrVCL0OksbTzxrOB2qU', 'ywn0AxzLrwXLBwvUDa', 'ywX0s2v5', 'mJe0nZq4mZy0nG', 'C3rHCNrdB250ywLUzxi', 'ywrKrxzLBNrmAxn0zw5LCG', 'Bwv0yuTLEq', 'ChjVDg90ExbL', 'y3jLyxrLrwXLBwvUDa', 'C3rHCNrpzMzZzxq', 'BgLUzs1OzwLNAhq', 'mti2mZK0mKzYDNjxtq', 'AgfZ', 'B3bHy2L0Eq', 'Dgv4Da', 'zw5Kt2zMC2v0', 'ywXS', 'C3rYAw5N', 'z2v0q29TChv0zwrtDhLSzq', 'B2zMC2v0tM9Kzq', 'Aw1WB3j0yw50', 'D2LKDgG', 'yMfJA2DYB3vUzeLTywDL', 'C2v0', 'su5qvvq', 'odG0mdiYv3HNwfP6', 'Bw91C2u', 'y2XVBMu', 'qxjNDw1LBNrZ', 'y3jLyxrLuMfUz2u', 'mZyWmdHHEw9HAhm', 'vevyvf9ot0rf', 'zgL2', 'zg9JDw1LBNrfBgvTzw50', 'mtq2mdmXtwfWC1bn', 'tvngDwXSC2nYzwvUq2HHBMDL', 'Cg9PBNrLCI1LDMvUDhm', 'Bwv0yq', 'C2v0u3rHCNrpzMzZzxq', 'B2zMC2v0', 'zNvUy3rPB24', 'y2fYzxrqB3nPDgLVBKzYB21qB2LUDa', 'C2v0rw5K', 'ywjZB2X1Dgu', 'AgfZqxr0CMLIDxrL', 'C2L6zq', 'BNvTyMvY', 'u0vmrunu'];

  caretUtils_T = function T() {
    return TE;
  };

  return caretUtils_T();
}

function P(V, E) {
  const TZ = caretUtils_Q,
        J = V[TZ(0x1ab)];

  switch (E) {
    case TZ(0x1e2):
      return J === 0x0;

    case TZ(0x1c1):
      return J === 0x2;

    case TZ(0x1f8):
      return J === 0x1;

    default:
      return ![];
  }
}

function O(V) {
  const Ty = caretUtils_Q,
        E = [];
  return V[Ty(0x210)] && E[Ty(0x1aa)](Ty(0x1af)), V[Ty(0x1c7)] && E[Ty(0x1aa)](Ty(0x1dc)), V[Ty(0x214)] && E[Ty(0x1aa)](Ty(0x233)), V[Ty(0x1ae)] && E[Ty(0x1aa)](Ty(0x1bc)), E;
}

function U(V) {
  const E = O(V);
  return G(V, E), E;
}

function Z(V) {
  const E = [];
  return G(V, E), E;
}

function y(V) {
  const Ta = caretUtils_Q;
  let E = arguments[Ta(0x1fb)] > 0x1 && arguments[0x1] !== undefined ? arguments[0x1] : null;
  const J = document,
        j = ![],
        d = [Ta(0x1c5), Ta(0x231), Ta(0x1f4), Ta(0x208)];

  for (var e = 0x0, N = d; e < N[Ta(0x1fb)]; e++) {
    const s = N[e];
    E === null ? J[Ta(0x213)](s, V, j) : E[Ta(0x213)](J, s, V, j);
  }
}

function a() {
  const Tl = caretUtils_Q;
  return document[Tl(0x1c2)] || document[Tl(0x1bb)] || document[Tl(0x19f)] || document[Tl(0x1bd)] || null;
}

function l(V) {
  const Tc = caretUtils_Q,
        E = V[Tc(0x1f1)],
        J = [];

  for (let j = V[Tc(0x212)]; j !== null; j = caretUtils_c(j)) {
    J[Tc(0x1aa)](j);
    if (j === E) break;
  }

  return J;
}

function caretUtils_c(V) {
  const TD = caretUtils_Q;
  let E = V[TD(0x1e1)];
  if (E === null) while (!![]) {
    E = V[TD(0x1b8)];
    if (E !== null) break;
    E = V[TD(0x1f9)];
    if (E === null) break;
    V = E;
  }
  return E;
}

function D(V, E) {
  const TB = caretUtils_Q,
        J = Node[TB(0x1b7)];
  var j = caretUtils_I(V),
      d;

  try {
    for (j['s'](); !(d = j['n']())[TB(0x1d1)];) {
      let e = d[TB(0x1fc)];

      for (; e !== null; e = e[TB(0x1f9)]) {
        if (e[TB(0x1bf)] !== J) continue;
        if (e[TB(0x1e9)](E)) return !![];
        break;
      }
    }
  } catch (N) {
    j['e'](N);
  } finally {
    j['f']();
  }

  return ![];
}

function caretUtils_B(V, E) {
  const Tg = caretUtils_Q,
        J = Node[Tg(0x1b7)];
  var j = caretUtils_I(V),
      d;

  try {
    for (j['s'](); !(d = j['n']())[Tg(0x1d1)];) {
      let e = d[Tg(0x1fc)];

      while (!![]) {
        if (e === null) return ![];
        if (e[Tg(0x1bf)] === J && e[Tg(0x1e9)](E)) break;
        e = e[Tg(0x1f9)];
      }
    }
  } catch (N) {
    j['e'](N);
  } finally {
    j['f']();
  }

  return !![];
}

function g(V, E) {
  const Tf = caretUtils_Q;
  return !(E === Tf(0x1e3) || E === Tf(0x1d4)) || V === Tf(0x205);
}

function f() {
  const TG = caretUtils_Q,
        V = document[TG(0x20f)];
  if (V === null) return ![];
  const E = V[TG(0x1cb)][TG(0x19e)]();

  switch (E) {
    case TG(0x226):
    case TG(0x1ac):
    case TG(0x19b):
      return !![];

    default:
      return V[TG(0x1ad)];
  }
}

function G(V, E) {
  const TM = caretUtils_Q;
  let J = V[TM(0x1f3)];
  if (typeof J === TM(0x19a) && J > 0x0) for (let j = 0x0; j < 0x6; ++j) {
    const d = 0x1 << j;

    if ((J & d) !== 0x0) {
      E[TM(0x1aa)](TM(0x228) + j), J &= ~d;
      if (J === 0x0) break;
    }
  }
}

function M(V, E, J) {
  const Tw = caretUtils_Q;
  V[Tw(0x1ba)](E, J, Tw(0x222));
}

function w(V, E) {
  const Tm = caretUtils_Q,
        J = document[Tm(0x1d8)];
  if (J === null) return [null, null];
  const j = window[Tm(0x220)](V),
        d = V[Tm(0x1b6)](),
        e = document[Tm(0x22f)][Tm(0x1b6)]();
  let N = d[Tm(0x1ee)] - e[Tm(0x1ee)],
      s = d[Tm(0x1ec)] - e[Tm(0x1ec)];
  const z = document[Tm(0x216)](Tm(0x22e)),
        k = z[Tm(0x1a4)];
  M(k, Tm(0x21e), Tm(0x1cc)), M(k, Tm(0x1a1), Tm(0x197)), M(k, Tm(0x1ee), '0'), M(k, Tm(0x1ec), '0'), M(k, Tm(0x223), e[Tm(0x223)] + 'px'), M(k, Tm(0x1d7), e[Tm(0x1d7)] + 'px'), M(k, Tm(0x1ff), Tm(0x1ea)), M(k, Tm(0x21b), '0'), M(k, Tm(0x232), Tm(0x209)), M(k, Tm(0x1a5), Tm(0x211));
  const T0 = document[Tm(0x216)](Tm(0x22e)),
        T1 = T0[Tm(0x1a4)];
  let T2 = V[Tm(0x1fc)];
  T2[Tm(0x1fa)]('\x0a') && (T2 += '\x0a');
  T0[Tm(0x1c3)] = T2;

  for (let T4 = 0x0, T5 = j[Tm(0x1fb)]; T4 < T5; ++T4) {
    const T6 = j[T4];
    M(T1, T6, j[Tm(0x1a9)](T6));
  }

  M(T1, Tm(0x1a1), Tm(0x197)), M(T1, Tm(0x1ec), s + 'px'), M(T1, Tm(0x1ee), N + 'px'), M(T1, Tm(0x1f7), '0'), M(T1, Tm(0x232), Tm(0x1c4));
  E ? j[Tm(0x1ff)] === Tm(0x1cd) && M(T1, Tm(0x1ff), Tm(0x1c4)) : (M(T1, Tm(0x1ff), Tm(0x1ea)), M(T1, Tm(0x1f0), Tm(0x1e0)), M(T1, Tm(0x218), j[Tm(0x1d7)]));
  z[Tm(0x1b2)](T0), J[Tm(0x1b2)](z);
  const T3 = T0[Tm(0x1b6)]();

  if (T3[Tm(0x223)] !== d[Tm(0x223)] || T3[Tm(0x1d7)] !== d[Tm(0x1d7)]) {
    const T7 = parseFloat(j[Tm(0x223)]) + (d[Tm(0x223)] - T3[Tm(0x223)]),
          T8 = parseFloat(j[Tm(0x1d7)]) + (d[Tm(0x1d7)] - T3[Tm(0x1d7)]);
    M(T1, Tm(0x223), T7 + 'px'), M(T1, Tm(0x1d7), T8 + 'px');
  }

  return (T3[Tm(0x1ee)] !== d[Tm(0x1ee)] || T3[Tm(0x1ec)] !== d[Tm(0x1ec)]) && (N += d[Tm(0x1ee)] - T3[Tm(0x1ee)], s += d[Tm(0x1ec)] - T3[Tm(0x1ec)], M(T1, Tm(0x1ee), N + 'px'), M(T1, Tm(0x1ec), s + 'px')), T0[Tm(0x1be)] = V[Tm(0x1be)], T0[Tm(0x1e7)] = V[Tm(0x1e7)], [T0, z];
}

function caretUtils_m(V, E, J) {
  const Tq = caretUtils_Q;

  if (J) {
    const d = document[Tq(0x206)](V, E);
    return d[Tq(0x1a7)]((N, s) => d[Tq(0x20a)](N) === s);
  }

  const j = document[Tq(0x1c6)](V, E);
  return j !== null ? [j] : [];
}

function q(V, E, J) {
  const TS = caretUtils_Q;
  if (J[TS(0x212)][TS(0x1bf)] !== Node[TS(0x22d)]) return ![];
  const j = J[TS(0x1f1)],
        d = J[TS(0x21d)];

  try {
    const k = new TextSeeker(J[TS(0x1f1)], J[TS(0x21d)], !![], ![])[TS(0x1a2)](0x1),
          T0 = k[TS(0x200)],
          T1 = k[TS(0x235)],
          T2 = k[TS(0x1eb)];
    J[TS(0x196)](T0, T1);
    if (!S(T2) && W(V, E, J[TS(0x1c9)]())) return !![];
  } finally {
    J[TS(0x196)](j, d);
  }

  const e = new TextSeeker(J[TS(0x212)], J[TS(0x217)], !![], ![])[TS(0x1a2)](-0x1),
        N = e[TS(0x200)],
        s = e[TS(0x235)],
        z = e[TS(0x1eb)];
  J[TS(0x1ca)](N, s);
  if (!S(z) && W(V, E, J[TS(0x1c9)]())) return J[TS(0x196)](N, s), !![];
  return ![];
}

function S(V) {
  const Tb = caretUtils_Q;
  return V[Tb(0x203)]()[Tb(0x1fb)] === 0x0;
}

function b(V, E) {
  const Tr = caretUtils_Q;
  if (typeof document[Tr(0x19c)] === Tr(0x236)) return document[Tr(0x19c)](V, E);
  if (typeof document[Tr(0x237)] === Tr(0x236)) return caretUtils_r(V, E);
  return null;
}

function caretUtils_r(V, E) {
  const Ti = caretUtils_Q,
        J = document[Ti(0x237)](V, E);
  if (J === null) return null;
  const j = J[Ti(0x221)];
  if (j === null) return null;
  let d = 0x0;
  const N = j[Ti(0x1bf)];

  switch (N) {
    case Node[Ti(0x22d)]:
      d = J[Ti(0x235)];
      break;

    case Node[Ti(0x1b7)]:
      if (L(j)) return caretUtils_i(V, E, j);
      break;
  }

  try {
    const s = document[Ti(0x22b)]();
    return s[Ti(0x1ca)](j, d), s[Ti(0x196)](j, d), s;
  } catch (z) {
    return null;
  }
}

function caretUtils_Q(I, H) {
  const h = caretUtils_T();
  return caretUtils_Q = function Q(u, F) {
    u = u - 0x196;
    let K = h[u];

    if (caretUtils_Q['MyBGcS'] === undefined) {
      var o = function o(W) {
        const t = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';
        let P = '',
            O = '';

        for (let U = 0x0, Z, y, a = 0x0; y = W['charAt'](a++); ~y && (Z = U % 0x4 ? Z * 0x40 + y : y, U++ % 0x4) ? P += String['fromCharCode'](0xff & Z >> (-0x2 * U & 0x6)) : 0x0) {
          y = t['indexOf'](y);
        }

        for (let l = 0x0, c = P['length']; l < c; l++) {
          O += '%' + ('00' + P['charCodeAt'](l)['toString'](0x10))['slice'](-0x2);
        }

        return decodeURIComponent(O);
      };

      caretUtils_Q['kcHKoq'] = o, I = arguments, caretUtils_Q['MyBGcS'] = !![];
    }

    const n = h[0x0],
          R = u + n,
          p = I[R];
    return !p ? (K = caretUtils_Q['kcHKoq'](K), I[R] = K) : K = p, K;
  }, caretUtils_Q(I, H);
}

function caretUtils_i(V, E, J) {
  const TX = caretUtils_Q,
        j = new Map();

  try {
    while (!![]) {
      v(j, J), J[TX(0x1a4)][TX(0x1ba)](TX(0x1b4), TX(0x21c), TX(0x222));
      const d = document[TX(0x237)](V, E);
      if (d === null) return null;
      const N = d[TX(0x221)];
      if (N === null) return null;
      let s = 0x0;
      const z = N[TX(0x1bf)];

      switch (z) {
        case Node[TX(0x22d)]:
          s = d[TX(0x235)];
          break;

        case Node[TX(0x1b7)]:
          if (L(N)) {
            if (j[TX(0x21a)](N)) return null;
            J = N;
            continue;
          }

          break;
      }

      try {
        const k = document[TX(0x22b)]();
        return k[TX(0x1ca)](N, s), k[TX(0x196)](N, s), k;
      } catch (T0) {
        return null;
      }
    }
  } finally {
    C(j);
  }
}

function X(V, E, J) {
  const TA = caretUtils_Q;
  let j = null;

  try {
    let d = 0x0,
        e = null;

    while (!![]) {
      const N = b(V, E);
      if (N === null) return null;
      const s = N[TA(0x212)];

      if (e !== s) {
        if (q(V, E, N)) return N;
        e = s;
      }

      j === null && (j = new Map());
      d = A(J, d, j);
      if (d < 0x0) return null;
    }
  } finally {
    j !== null && j[TA(0x199)] > 0x0 && C(j);
  }
}

function A(V, E, J) {
  const Tv = caretUtils_Q;

  while (!![]) {
    if (E >= V[Tv(0x1fb)]) return -0x1;
    const j = V[E++];
    if (Y(j)) return v(J, j), j[Tv(0x1a4)][Tv(0x1ba)](Tv(0x232), Tv(0x209), Tv(0x222)), E;
  }
}

function v(V, E) {
  const TC = caretUtils_Q;
  if (V[TC(0x21a)](E)) return;
  const J = E[TC(0x198)](TC(0x1a4)) ? E[TC(0x207)](TC(0x1a4)) : null;
  V[TC(0x225)](E, J);
}

function C(V) {
  const TY = caretUtils_Q;
  var E = caretUtils_I(V[TY(0x1fe)]()),
      J;

  try {
    for (E['s'](); !(J = E['n']())[TY(0x1d1)];) {
      const d = J[TY(0x1fc)];
      var j = H(d, 0x2);
      const e = j[0x0],
            N = j[0x1];
      N === null ? e[TY(0x202)](TY(0x1a4)) : e[TY(0x201)](TY(0x1a4), N);
    }
  } catch (s) {
    E['e'](s);
  } finally {
    E['f']();
  }
}

function Y(V) {
  const Tx = caretUtils_Q;
  if (V === document[Tx(0x1d8)] || V === document[Tx(0x22f)]) return ![];
  const E = window[Tx(0x220)](V);
  return parseFloat(E[Tx(0x21b)]) <= 0x0 || E[Tx(0x1e4)] === Tx(0x1ea) || E[Tx(0x224)] === Tx(0x209) && x(E[Tx(0x1a6)]);
}

function x(V) {
  const TL = caretUtils_Q;
  return n[TL(0x1d5)](V);
}

function L(V) {
  const TV = caretUtils_Q;
  return getComputedStyle(V)[TV(0x1a0)] === TV(0x21e);
}
// CONCATENATED MODULE: ./src/fg/common.ts


function common_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function common_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { common_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { common_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function common_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






const japaneseRegex = /[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]/;

class common_State {
  constructor() {
    common_defineProperty(this, "user", null);

    common_defineProperty(this, "modal", new Modal_Modal());

    common_defineProperty(this, "apiCall", void 0);
  }

}

const state = new common_State();
function isStringContainsJapanese(string) {
  return japaneseRegex.test(string);
}
function showForRange(_x) {
  return _showForRange.apply(this, arguments);
}

function _showForRange() {
  _showForRange = common_asyncToGenerator( /*#__PURE__*/regenerator_default.a.mark(function _callee(range) {
    var _state$user$languages;

    var exactMatch,
        prevLength,
        context,
        seekPrev,
        seekNext,
        langauges,
        request,
        firstSymbolRange,
        response,
        newSelectionRange,
        newSelectionStart,
        start,
        newSelectionEnd,
        end,
        sel,
        _args = arguments;
    return regenerator_default.a.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          exactMatch = _args.length > 1 && _args[1] !== undefined ? _args[1] : false;

          if (range) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return");

        case 3:
          prevLength = 0;

          if (exactMatch) {
            context = range.toString();
          } else {
            seekPrev = new TextSeeker(range.startContainer, range.startOffset).seek(-100);
            seekNext = new TextSeeker(range.startContainer, range.startOffset).seek(100);
            prevLength = seekPrev.content.length;
            context = seekPrev.content + seekNext.content;
          }

          if (isStringContainsJapanese(context)) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return");

        case 7:
          langauges = (_state$user$languages = state.user.languages) !== null && _state$user$languages !== void 0 ? _state$user$languages : ["en"];
          request = {
            text: context,
            url: range.startContainer.ownerDocument.location.href,
            offset: prevLength,
            languages: langauges,
            exactMatch: exactMatch
          };
          firstSymbolRange = new Range();
          firstSymbolRange.setStart(range.startContainer, range.startOffset);
          state.modal.showText(i18n_t("loading"));
          state.modal.updatePosition(firstSymbolRange);
          _context.next = 15;
          return state.apiCall("POST", "processText", request);

        case 15:
          response = _context.sent;

          if (!response.success) {
            showSnackbar(i18n_t("no_words_found"));
            state.modal.hide();
          } else {
            state.modal.showTranslations(request, response);
          }

          newSelectionRange = new Range();
          newSelectionStart = response.offsetStart - prevLength;
          start = new TextSeeker(range.startContainer, range.startOffset, true, false).seek(newSelectionStart);
          newSelectionRange.setStart(start.node, start.offset);
          newSelectionEnd = response.offsetEnd - prevLength;
          end = new TextSeeker(range.startContainer, range.startOffset, true, false).seek(newSelectionEnd);
          newSelectionRange.setEnd(end.node, end.offset);

          if (newSelectionRange.toString().length > 0) {
            sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(newSelectionRange);
            state.modal.updatePosition(newSelectionRange);
          }

        case 25:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _showForRange.apply(this, arguments);
}

/***/ })
/******/ ]);