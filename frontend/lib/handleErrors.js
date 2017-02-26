const notify = require('gulp-notify');

module.exports = (errorObject, callback) => {
    notify.onError(errorObject.toString()).apply(this, arguments);
    // Keep gulp from hanging on this task
    if (typeof this.emit === 'function') {
        this.emit('end');
    }
};
