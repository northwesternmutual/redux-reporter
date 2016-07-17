import { errorReporter, crashReporter } from './../index';

export const newrelicCrashReporter = crashReporter(error => window.NREUM.noticeError(error));

export default errorReporter(error => {
    try {
        window.NREUM.noticeError(error);
    } catch (err) {
        console.error(err); // darn!
    }
});