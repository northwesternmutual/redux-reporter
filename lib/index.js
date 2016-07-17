import { isFSA } from 'flux-standard-action';

const defaultSelect = ({ meta = {} }) => meta.report;

const reporter = (handler, select = defaultSelect) => ({ getState }) => next => action => {

    const returnValue = next(action);

    if (typeof action === 'function') {
        return returnValue;
    }

    if (!isFSA(action)) {
        throw Error('Action must be a Flux Standard Action - https://github.com/acdlite/flux-standard-action');
    }

    const report = select(action);

    if (!report) {
        return returnValue;
    }

    handler(report, getState);

    return returnValue;
};

export const errorReporter = handler => reporter(handler, ({ error, payload }, getState) => {
    if (!error) {
        return null;
    }
    if (!payload) {
        throw Error('Actions that represent errors need an error object as payload');
    }

    handler(payload, getState);

    return payload;
});

export const crashReporter = handler => ({ getState }) => next => action => {
    let returnValue;

    try {
        returnValue = next(action);
    } catch (err) {
        handler(err, getState);
        console.error(err);
    }

    return returnValue;
};

export default reporter;