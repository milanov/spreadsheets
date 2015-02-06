
function HandsontableToolbar(toolbar) {
    'use strict';

    var that = this;

    this._actionHandlers = {};  
    this._formatterElements = {};

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

    this.setAction('format-as-number', {
        callback: function(type) {
            var instance = this,
                renderer = 'numeric',
                format = '';

            switch(type) {
                case 'number':
                    format = '0,0.0';
                    break;
                case 'percent':
                    format = '0%';
                    break;
                case 'financial':
                    format = '(0,0.0)';
                    break;
                case 'currency':
                    format = '$0,0.0';
                    break;
                default:
                    renderer = 'text';
            }


            this.getSelectedRange().forAll(function(row, col) {
                instance.setCellMeta(row, col, 'renderer', renderer);
                instance.setCellMeta(row, col, 'format', format);
            });

            this.render();
        },
        disabled: false
    });

    this.setFormatter('bold');
    this.setFormatter('italic');
    this.setFormatter('strikethrough');
    this.setFormatter('underline');
    this.setFormatter('wrap-text');
    this.setFormatter('change-font-family',
        'arial',
        [
            'ht-arial',
            'ht-courier-new',
            'ht-georgia',
            'ht-times-new-roman',
            'ht-trebuchet-ms',
            'ht-verdan'
        ]
    );
    this.setFormatter('change-font-size',
        'size-14',
        [
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
        ]
    );
    this.setFormatter('align-vertically',
        'top',
        [
            'ht-top',
            'ht-middle',
            'ht-bottom'
        ]
    );
    this.setFormatter('align-horizontally',
        'left', 
        [
            'ht-left',
            'ht-center',
            'ht-right',
            'ht-justify'
        ]
    );

    /* Capture events from the "toolbar" and handle them */
    $(toolbar).on('click', 'a[data-edit-action]', function() {
        var action = $(this).data('edit-action'),
            argument = $(this).data('edit-argument');

        if (action in that._formatterElements) {
            that.updateUIElement(action, argument);
        }

        that._actionHandlers[action].callback.call(that._instance, argument);
    });
}

HandsontableToolbar.prototype.updateUI = function(elements) {
    this.resetUI();

    for(var index in elements) {
        var formatString = elements[index];
        var action = this.findActionFromValue(formatString);
        if (!action) {
            return;
        }

        if (formatString.substring(0,3) === 'ht-') {
            formatString = formatString.substring(3);
        }

        this.updateUIElement(action, formatString);
    }

}

HandsontableToolbar.prototype.findActionFromValue = function(value) {
    for (var action in this._formatterElements) {
        if ($.inArray(value, this._formatterElements[action].alternatives) !== -1) {
            return action;
        }
    }
}

HandsontableToolbar.prototype.updateUIElement = function(action, argument) {
    /* Get the format elements - from the toolbar and from the menu */
    var uiElement = this.getUIElement(action, argument);

    if (this.isElementDropdown(action, argument)) {
        /* We are dealing with a dropdown menu */

        /* Iterate through all the alternatives and remove the check marks, if any */
        var alternatives = this._formatterElements[action].alternatives;
        var that = this;
        alternatives.forEach(function(alternative) {
            /* Remove the 'ht-' prefix and search for the DOM element */
            var element = that.getUIElement(action, alternative.substring(3));
            element.removeClass('active');
        });

        uiElement.addClass('active');
        this.updateDropdown(action, argument);

    } else {
        uiElement.toggleClass('active');
    }
}

HandsontableToolbar.prototype.resetUI = function() {
    for (var action in this._formatterElements) {
        var defaultValue = this._formatterElements[action].default;

        if (defaultValue) {
            this.updateUIElement(action, defaultValue);
        } else {
            var uiElement = this.getUIElement(action, action);
            uiElement.removeClass('active');
        }
    }
}

HandsontableToolbar.prototype.updateDropdown = function(action, argument) {
    var dropdown = $('#' + action + '-dropdown-menu');
    var newValue = $('a[data-edit-action=' + action + '][data-edit-argument=' + argument + ']:last').text();

    dropdown.html(newValue + '&nbsp;<i class="fa fa-caret-down"></i>');
}


HandsontableToolbar.prototype.getUIElement = function(action, argument) {
    if (!this.isElementDropdown(action, argument)) {
        return $('a[data-edit-action=' + action + ']');
    }
    // Else - element from a dropdown menu
    return $('a[data-edit-action=' + action + '][data-edit-argument=' + argument + ']');
}

HandsontableToolbar.prototype.isElementDropdown = function(action, argument) {
    return argument && action !== argument;
}

HandsontableToolbar.prototype.setInstance = function(instance) {
    'use strict';

    this._instance = instance;
};

HandsontableToolbar.prototype.setAction = function(name, action) {
    'use strict';

    this._actionHandlers[name] = action;
};

HandsontableToolbar.prototype.setFormatter = function(name, defaultValue, classesGroup) {
    'use strict';

    this._formatterElements[name] = {
        'default': defaultValue,
        'alternatives': !classesGroup ? ['ht-' + name] : classesGroup
    }

    this._actionHandlers[name] = {
        callback: function(newCls) {
            var CLASS_PREFIX = 'ht-';
            newCls = CLASS_PREFIX + (newCls ? newCls : name);

            Handsontable.Actions.toggleClass.callback.call(this, this.getSelectedRange(), newCls, classesGroup);
        },
        disabled: false
    };
};
