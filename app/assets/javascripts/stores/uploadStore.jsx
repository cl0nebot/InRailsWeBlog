'use strict';

import mix from '../mixins/mixin';
import Errors from '../mixins/errors';

import UploadActions from '../actions/uploadActions';

export default class UploadStore extends mix(Reflux.Store).with(Errors) {
    constructor() {
        super();

        this.listenables = UploadActions;
        this.url = '/uploads';
    }

    init() {
        // Will call handleParams
        return true;
    }

    // Called by handleErrors function of Errors mixin
    displayUnauthorizedMessage() {
        Notification.error(I18n.t('js.helpers.errors.not_authorized'));
    }

    // Called by handleErrors function of Errors mixin
    displayErrorsMessage(url, errorMessage) {
    }

    onAddUpload(upload, options) {
        if ($.isEmpty(upload)) {
            log.error('Tried to add a upload without data');
            return;
        }

        var requestParam = {};
        requestParam.upload = upload;

        $.ajax({
            url: this.url,
            dataType: 'json',
            type: 'POST',
            data: requestParam
        })
            .done((dataReceived, response, xhr) => {
                if (!$.isEmpty(dataReceived)) {
                    this.trigger({
                        type: 'addUpload',
                        upload: dataReceived.upload
                    });
                } else {
                    log.error('No data received from add upload');
                }
            })
            .fail((xhr, status, error) => {
                if (xhr && xhr.status === 403) {
                    this.trigger({
                        type: 'addUploadError',
                        uploadErrors: xhr.responseJSON
                    });
                } else {
                    this.handleErrors(this.url, xhr, status, error);
                }
            });
    }

    onUpdateUpload(upload, options) {
        if ($.isEmpty(upload) || $.isEmpty(upload.id)) {
            log.error('Tried to update a upload without data');
            return;
        }

        var requestParam = {};
        requestParam.upload = upload;
        requestParam._method = 'put';

        $.ajax({
            url: this.url + '/' + upload.id,
            dataType: 'json',
            type: 'POST',
            data: requestParam
        })
            .done((dataReceived, response, xhr) => {
                if (!$.isEmpty(dataReceived)) {
                    this.trigger({
                        type: 'updateUpload',
                        upload: dataReceived.upload
                    });
                } else {
                    log.error('No data received from update upload');
                }
            })
            .fail((xhr, status, error) => {
                if (xhr && xhr.status === 403) {
                    this.trigger({
                        type: 'updateUploadError',
                        uploadErrors: xhr.responseJSON
                    });
                } else {
                    this.handleErrors(this.url, xhr, status, error);
                }
            });
    }

    onDeleteUpload(uploadId, options) {
        if ($.isEmpty(uploadId)) {
            log.error('Tried to remove a upload without upload id');
            return;
        }

        let url = this.url + '/' + uploadId;

        let requestParam = {};
        requestParam._method = 'delete';

        if (options) {
            if (options.isPermanently) {
                requestParam.permanently = true
            }
        }

        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: requestParam
        })
            .done((dataReceived, response, xhr) => {
                if (!$.isEmpty(dataReceived)) {
                    this.trigger({
                        type: 'deleteUpload',
                        deletedUpload: dataReceived
                    });
                } else {
                    log.error('No data received from delete upload');
                }
            })
            .fail((xhr, status, error) => {
                if (xhr && xhr.status === 403) {
                    this.trigger({
                        type: 'deleteUploadError',
                        uploadErrors: xhr.responseJSON
                    });
                } else {
                    this.handleErrors(this.url, xhr, status, error);
                }
            });
    }
}