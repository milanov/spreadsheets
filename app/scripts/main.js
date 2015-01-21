$(function() {
    'use strict';

    /* Activate Bootstrap's submenu plugin */
    $('.dropdown-submenu > a').submenupicker();

    var spreadsheet = $('#spreadsheet-one');
    var spreadsheetToolbar = $('#spreadsheet-one-toolbar');

    /* Manually calculate and set spreadsheet height, needed for the overflow scrolling functionality */
    var calculatedSpreadsheetHeight = $(window).height() - $('header').height() - $('footer').height();
    spreadsheet.height(calculatedSpreadsheetHeight);

    var spreadsheetObj = new Spreadsheet(50, 26, {});
    spreadsheetObj.recomputeAll(null);

    /* Instantiate and configure Handsontable instance */
    var ht = new Handsontable(spreadsheet[0], {
        autoColumnSize: false,
        startRows: 50,
        startCols: 28,
        rowHeaders: true,
        colHeaders: true,
        contextMenu: true,
        outsideClickDeselects: false,
        comments: true,
        afterChange: function (change, source) {
            for(var index in change) {
                var row = change[index][0], col = change[index][1], value = change[index][3];

                var from = ht.getCellMeta(row, col)['calledFrom'];
                if (from !== 'mouseDown' && from !== 'spreadsheet') {
                    spreadsheetObj.setCellFormula(row, col, value, callbackDataChange);
                }
                ht.setCellMeta(row, col, 'calledFrom', '');
            }
        },

        afterOnCellMouseDown: function (event, coords, TD) {
            var previouslySelected = spreadsheetObj.getSelected();

            if(previouslySelected !== null) {
                var row = previouslySelected['row'], col = previouslySelected['col'];
                ht.setCellMeta (row, col, 'calledFrom', 'mouseDown');
                ht.setDataAtCell(row, col, spreadsheetObj.getCellValue(row, col));
            }

            spreadsheetObj.setSelected(coords.row, coords.col);
            ht.setCellMeta (coords.row, coords.col, 'calledFrom', 'mouseDown');

            ht.setDataAtCell(coords.row, coords.col, 
                             spreadsheetObj.getCellFormula(coords.row, coords.col));
        }
    });

    ht.selectCell(0, 0);

    /* Instantiate "toolbar" for controlling the Handsontable instance */
    var htToolbar = new HandsontableToolbar(spreadsheetToolbar[0], ht);

    var callbackDataChange = function(row, column, value) {
        ht.setCellMeta(row, column, 'calledFrom', 'spreadsheet');
        ht.setDataAtCell(row, column, value);
    }

});
