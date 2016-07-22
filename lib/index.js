'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.crashReporter = exports.errorReporter = undefined;

var _fluxStandardAction = require('flux-standard-action');

var defaultSelect = function defaultSelect(_ref) {
    var _ref$meta = _ref.meta;
    var meta = _ref$meta === undefined ? {} : _ref$meta;
    return meta.report;
};

var reporter = function reporter(handler) {
    var select = arguments.length <= 1 || arguments[1] === undefined ? defaultSelect : arguments[1];
    return function (_ref2) {
        var getState = _ref2.getState;
        return function (next) {
            return function (action) {

                var returnValue = next(action);

                if (typeof action === 'function') {
                    return returnValue;
                }

                if (!(0, _fluxStandardAction.isFSA)(action)) {
                    throw Error('Action must be a Flux Standard Action - https://github.com/acdlite/flux-standard-action');
                }

                var report = select(action);

                if (!report) {
                    return returnValue;
                }

                handler(report, getState);

                return returnValue;
            };
        };
    };
};

var errorSelect = function errorSelect(_ref3) {
    var _ref3$error = _ref3.error;
    var error = _ref3$error === undefined ? false : _ref3$error;
    var payload = _ref3.payload;


    if (!error) {
        return null;
    }

    if (!payload) {
        console.warn('Actions that represent errors should have an error object as payload, generic error used');
        return new Error(type);
    }

    return payload;
};

var errorReporter = exports.errorReporter = function errorReporter(handler) {
    return reporter(handler, errorSelect);
};

var crashReporter = exports.crashReporter = function crashReporter(handler) {
    return function (_ref4) {
        var getState = _ref4.getState;
        return function (next) {
            return function (action) {
                var returnValue = void 0;

                try {
                    returnValue = next(action);
                } catch (err) {
                    handler(err, getState);
                    console.error(err);
                }

                return returnValue;
            };
        };
    };
};

exports.default = reporter;