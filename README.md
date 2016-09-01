# redux-reporter

[![Build Status](https://travis-ci.org/ezekielchentnik/redux-reporter.svg)](https://travis-ci.org/ezekielchentnik/redux-reporter)
[![npm version](https://img.shields.io/npm/v/redux-reporter.svg?style=flat-square)](https://www.npmjs.com/package/redux-reporter)

Redux middleware for reporting actions to third party APIs.  Extremely useful for analytics and error handling.  Can be used with various APIs such as New Relic, Sentry, Adobe DTM, Keen

## Installation

```js
npm install --save redux-reporter
```
## Usage

#### Generic Reporting
Create your reporting middleware
```js
// /middleware/myReporter.js
import reporter from 'redux-reporter';

export default reporter(({ type, payload }, getState) => {

    try {
        // report to external API
    } catch (err) {}

});
```
Attach meta data to your actions
```js
// /actions/MyActions.js
export function myAction() {
    let type = 'MY_ACTION';
    return {
        type,
        meta: {
            report: {
                type,
                payload: 'example payload'
            }
        }
    };
}

```
Configure your store with middleware
```js
// /store/configureStore.js
import { compose, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';
import myReporter from './middleware/myReporter';
const isBrowser = (typeof window !== 'undefined');
const enhancer = compose(
    applyMiddleware(...[thunk, myReporter]),
    isBrowser && window.devToolsExtension) ? window.devToolsExtension() : (f) => f
);

export default (initialState = {}) => {
  return createStore(rootReducer, initialState, enhancer);
}

```

#### Analytics
This example uses Adobe DTM, but this pattern will work for other APIs (keen, segment, etc.)
```js
// /middleware/adobedtm.js
import reporter from 'redux-reporter';

const select = ({ meta = {} }) => meta.analytics;

export default reporter(({ type, payload }) => {

    try {
        window._satellite.setVar('payload', payload);
        window._satellite.track(type);
    } catch (err) {}

}, select);


// /actions/MyActions.js
export function myAction() {
    let type = 'MY_ACTION';
    return {
        type,
        meta: {
            analytics: {
                type,
                payload: 'example payload'
            }
        }
    };
}

```

## Optimizely - Goal Tracking
```js
// /middleware/optimizely.js
import reporter from 'redux-reporter';

export default reporter(({ type, payload }) => {

    window.optimizely = window.optimizely || [];
    window.optimizely.push(['trackEvent', type, payload]);

}, ({ meta = {} }) => meta.experiments);


// /actions/MyActions.js
export function myAction() {
    let type = 'MY_ACTION';
    return {
        type,
        meta: {
            experiments: {
                type,
                payload: 'example payload'
            }
        }
    };
}

```

## Reporting to Multiple APIs
You can report to multiple APIs by configuring multiple middlewares and attaching multiple attributes to your actions
```js

// /actions/MyActions.js
export function myAction() {
    let type = 'MY_ACTION';
    return {
        type,
        meta: {
          analytics: {
              type,
              payload: 'example payload'
          },
          experiments: {
              type,
              payload: 'example payload'
          }
        }
    };
}

```

## New Relic

#### error reporting

```js

// /actions/MyActions.js
export function myAction() {
    let type = 'MY_ERROR_ACTION';
    return {
        type,
        error: true
        payload: new Error('My Handled Error')
    };
}


import { errorReporter as newrelicErrorReporter, crashReporter as newrelicCrashReporter } from 'redux-reporter';

const report = (error) => {
  try {
    window.newrelic.noticeError(error);
  } catch (err) {}
};

export const crashReporter = newrelicCrashReporter(report);
export const errorReporter = newrelicErrorReporter(report);

```

#### analytics reporting

```js
// /actions/MyActions.js
export function myAction() {
    let type = 'MY_ACTION';
    return {
        type,
        meta: {
          analytics: {
              type,
              payload: 'example payload'
          }
        }
    };
}

import reporter from 'redux-reporter';

export const analyticsReporter = reporter(({ type, payload }) => {
  try {
    window.newrelic.addPageAction(type, payload);
  } catch (err) {}
}, ({ meta = {} }) => meta.analytics);
```

## Todo
- Add example:  using global state
- Add example:  Error reporting
- Add example:  New Relic
- Add example:  Sentry
- Add example:  Crash Reporting
