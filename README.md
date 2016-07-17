# redux-reporter
Redux middleware for reporting actions to third party APIs.  Extremely useful for analytics and error handling.

## Installation

```js
npm install --save redux-reporter
```

## Usage
```js
// todo
```

### Analytics reporting

#### Generic Reporting

```js
import reporter from './reporter';

export default reporter(({ type, payload }, getState) => {

    try {
        // report to external API
    } catch (err) {
        console.error(err);
    }

});


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
#### Adobe DTM (Analytics)
```js
import reporter from './reporter';

const select = ({ meta = {} }) => meta.analytics;

export default reporter(({ type, payload }) => {

    try {
        window._satellite.setVar('payload', payload);
        window._satellite.track(type);
    } catch (err) {
        console.error(err);
    }

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

#### Optimizely Goal Tracking
```js
import reporter from './reporter';

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

#### Report to Multiple Analytics APIs
```js

// /actions/MyActions.js
export function myAction() {
    let type = 'MY_ACTION';

    let report =

    return {
        type,
        meta: {
            adobedtm: {
                type,
                payload: {
                    userType: 'xyz',
                    region: 'xyz'
                }
            },
            newrelic: {
                type,
                payload: 'example payload'
            }
        }
    };
}

```

#### Extending with global state
```js
// todo
```

### Error reporting
```js
// todo
```

#### New relic
```js
// todo
```

#### Sentry
```js
// todo
```

### Crash reporting

#### New relic
```js
// todo
```

#### Sentry
```js
// todo
```
