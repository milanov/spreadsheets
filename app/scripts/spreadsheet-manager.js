function SpreadsheetManager() {

    this._currentHandsontable;
    this._currentSpreadsheet;
    this._numberOfSpreadsheets = 0;

    this.getCurrentHandsontable = function() {
        return this._currentHandsontable;
    };

    this.getCurrentSpreadsheet = function() {
        return this._currentSpreadsheet;
    };

    this.setCurrentHandsontable = function(handsontable) {
        this._currentHandsontable = handsontable;
        this.setCurrentSpreadsheet(this._currentHandsontable.spreadsheet);
    };

    this.setCurrentSpreadsheet = function(spreadsheet) {
        this._currentSpreadsheet = spreadsheet;
    };

    this.getNextId = function() {
        return ++this._numberOfSpreadsheets;
    };

    this.setUpdateUICallback = function(toolbar) {

        var handsontable = this._currentHandsontable;
        handsontable.addHook('afterSelection', function(r, c, r2, c2) {
            var selected = handsontable.getSelectedRange();
            var classesFrequency = {};

            /* Find the common format classes for all selected cells */
            selected.forAll(function(row, col) {
                var className = handsontable.getCellMeta(row, col).className;
                if (!className) {
                    return false;
                }

                var classes = wordsIn(className);
                classes.forEach(function(currentClass) {
                    if (!classesFrequency[currentClass]) {
                        classesFrequency[currentClass] = 0;
                    }
                    classesFrequency[currentClass]++;
                });
            });

            var commonClasses = filterCommonClasses(classesFrequency,
                selected.getWidth() * selected.getHeight());
            toolbar.updateUI(commonClasses);
        });
    };

    this.createHandsontableSpreadsheet = function(id, toolbar) {
        'use strict';

        var newSpreadsheet = $('#spreadsheet-hidden').clone();
        newSpreadsheet.attr('id', id);
        newSpreadsheet.removeClass('hidden');

        var calculatedSpreadsheetHeight = $(window).height() - $('header').height() - $('footer').height();
        newSpreadsheet.height(calculatedSpreadsheetHeight);

        $('#tab-content div').removeClass('active');
        $('#tab-content').append(newSpreadsheet);

        var ht = new Handsontable(newSpreadsheet[0], {
            autoColumnSize: false,
            startRows: 50,
            startCols: 28,
            rowHeaders: true,
            colHeaders: true,
            contextMenu: true,
            outsideClickDeselects: false,
            comments: true,
            editor: 'formula'
        });
        ht.spreadsheet =  new Spreadsheet(ht.countRows(), ht.countCols());
        ht.addHook('beforeAutofillInsidePopulate', beforeAutofillInsidePopulate);

        ht.addHook('afterCreateRow', function(index, amount) {
            ht.spreadsheet.insertRow(index, ht.setDataAtCell);
        });

        ht.addHook('afterCreateCol', function(index, amount) {
            ht.spreadsheet.insertColumn(index, ht.setDataAtCell);
        });

        ht.addHook('afterRemoveRow', function(index, amount) {
            ht.spreadsheet.removeRow(index, ht.setDataAtCell);
        });

        ht.addHook('afterRemoveCol', function(index, amount) {
            ht.spreadsheet.removeColumn(index, ht.setDataAtCell);
        });

        ht.selectCell(0, 0);

        this.setCurrentHandsontable(ht);
        this.setUpdateUICallback(toolbar);

        return ht;
    };
}
