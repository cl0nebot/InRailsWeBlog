'use strict';

import 'summernote/dist/summernote-lite';
import 'summernote/dist/lang/summernote-fr-FR';

import SanitizePaste from './sanitizePaste';

$.extend($.summernote.options, {
    cleanParseContent: true,
    advice: true,
    secret: true,
    // icons: {
    //     'bold': 'format_bold'
    // }
});

// const ui = $.summernote.ui;
// ui.icon = function (iconClassName, tagName) {
//     return '<span class="material-icons">' + iconClassName + '</span>';
// };

const applyFormat = (context, formatName) => {
    let $node = $(context.invoke('restoreTarget'));
    if ($node.length === 0) {
        $node = $(document.getSelection().focusNode.parentElement, '.note-editable');
    }

    if ($node.hasClass('note-editable') || $node.hasClass('note-editing-area')) {
        return;
    }

    $node.toggleClass(formatName);
};

$.extend($.summernote.plugins, {
    'cleaner': function (context) {
        const ui = $.summernote.ui;
        const $note = context.layoutInfo.note;
        const options = context.options;

        if (options.cleanParseContent) {
            context.memo('button.cleaner', function () {
                const button = ui.button({
                    contents: '<i class="material-icons">format_clear</i>',
                    tooltip: 'clean content',
                    click: function () {
                        if ($note.summernote('createRange').toString()) {
                            $note.summernote('pasteHTML', $note.summernote('createRange').toString());
                        } else {
                            $note.summernote('code', SanitizePaste.parse($note.summernote('code')));
                        }
                    }
                });

                return button.render();
            });
        }

        this.events = {
            'summernote.paste': function (we, event) {
                event.preventDefault();

                const userAgent = window.navigator.userAgent;
                let msIE = userAgent.indexOf('MSIE ');
                msIE = msIE > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./);
                const firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
                let text;
                if (msIE) {
                    text = window.clipboardData.getData('Text');
                } else {
                    text = event.originalEvent.clipboardData.getData('text/html') || event.originalEvent.clipboardData.getData('text/plain');
                }

                if (text) {
                    if (msIE || firefox) {
                        setTimeout($note.summernote('pasteHTML', SanitizePaste.parse(text)), 1);
                    } else {
                        $note.summernote('pasteHTML', SanitizePaste.parse(text));
                    }
                }
            }
        }
    }
});

$.extend($.summernote.plugins, {
    'advice': function (context) {
        const ui = $.summernote.ui;
        const options = context.options;

        if (options.advice) {
            context.memo('button.advice', function () {
                const button = ui.button({
                    contents: '<i class="material-icons">thumb_up</i>',
                    tooltip: 'advice',
                    click: function (event) {
                        event.preventDefault();
                        applyFormat(context, 'advice');
                    }
                });

                return button.render();
            });
        }
    }
});

$.extend($.summernote.plugins, {
    'secret': function (context) {
        const ui = $.summernote.ui;
        const options = context.options;

        if (options.secret) {
            context.memo('button.secret', function () {
                const button = ui.button({
                    contents: '<i class="material-icons">security</i>',
                    tooltip: 'secret',
                    click: function (event) {
                        event.preventDefault();
                        applyFormat(context, 'secret');
                    }
                });

                return button.render();
            });
        }
    }
});