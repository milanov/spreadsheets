
function HandsontableToolbar(toolbar, htInstance) {
    'use strict';

    var actionHandlers = {};

    actionHandlers['undo'] = function() {
        htInstance.undo();
    }

    actionHandlers['redo'] = function() {
        htInstance.redo();
    }

    /* Capture events from the toolbar and handle them */
    $(toolbar).on('click', 'a[data-edit-action]', function() {
        var action = $(this).data('edit-action');
        actionHandlers[action]();
    });
}


