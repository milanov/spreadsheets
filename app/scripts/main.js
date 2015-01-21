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

    var SpreadsheetEditor = getSpreadsheetEditor(spreadsheetObj);

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
        editor: SpreadsheetEditor
    });
    ht.selectCell(0, 0);

    /* Instantiate "toolbar" for controlling the Handsontable instance */
    var htToolbar = new HandsontableToolbar(spreadsheetToolbar[0], ht);
});
