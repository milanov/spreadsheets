
function HandsontableToolbar(toolbar) {
    'use strict';

    var that = this;
    this._actionHandlers = {};  

    /* Capture events from the "toolbar" and handle them */
    $(toolbar).on('click', 'a[data-edit-action]', function() {
        var action = $(this).data('edit-action'),
            argument = $(this).data('edit-argument');

        that._actionHandlers[action].callback.call(that._instance, argument);
    });
}

HandsontableToolbar.prototype.initToolbarForInstance = function(instance) {
    'use strict';

    this.setInstance(instance);

    this.setAction('undo', Handsontable.Actions.undo);
    this.setAction('redo', Handsontable.Actions.redo);
    this.setAction('insert-row-above', Handsontable.Actions.insertRowAbove);
    this.setAction('insert-row-below', Handsontable.Actions.insertRowBelow);
    this.setAction('insert-col-left', Handsontable.Actions.insertColLeft);
    this.setAction('insert-col-right', Handsontable.Actions.insertColRight);
    this.setAction('comment', Handsontable.Actions.addEditComment);
    this.setAction('insert-function', Handsontable.Actions.insertFunction);
    this.setAction('clear-formatting', function() {
        // TODO don't wipe out HOT classes if present
        this.getSelectedRange().forAll(function(row, col) {
            this.setCellMeta(row, col, 'className', '');
        });

        this.render();
    });

    this.setFormatter('bold');
    this.setFormatter('italic');
    this.setFormatter('strikethrough');
    this.setFormatter('underline');
    this.setFormatter('wrap-text');
    this.setFormatter('change-font-family', [
        'ht-arial',
        'ht-courier-new',
        'ht-georgia',
        'ht-times-new-roman',
        'ht-trebuchet-ms',
        'ht-verdan'
    ]);
    this.setFormatter('change-font-size', [
        'ht-size-6',
        'ht-size-7',
        'ht-size-8',
        'ht-size-9',
        'ht-size-10',
        'ht-size-11',
        'ht-size-12',
        'ht-size-14',
        'ht-size-18',
        'ht-size-24',
        'ht-size-36'
    ]);
    this.setFormatter('align-vertically', [
        'ht-top',
        'ht-middle',
        'ht-bottom'
    ]);
    this.setFormatter('align-horizontally', [
            'ht-left',
            'ht-center',
            'ht-right',
            'ht-justify'
    ]);

};

HandsontableToolbar.prototype.setInstance = function(instance) {
    'use strict';

    this._instance = instance;
};

HandsontableToolbar.prototype.setAction = function(name, action) {
    'use strict';

    this._actionHandlers[name] = action;
};

HandsontableToolbar.prototype.setFormatter = function(name, classesGroup) {
    'use strict';

    var instance = this._instance;

    this._actionHandlers[name] = {
        callback: function(newCls) {
            var CLASS_PREFIX = 'ht-';
            newCls = CLASS_PREFIX + (newCls ? newCls : name);

            Handsontable.Actions.toggleClass.callback.call(instance, instance.getSelectedRange(), newCls, classesGroup);
        },
        disabled: false
    };
};
