$(function() {
    'use strict';

    /* Activate Bootstrap's submenu plugin */
    $('.dropdown-submenu > a').submenupicker();

    /* Manually calculate and set spreadsheet height, needed for the overflow scrolling functionality */
    var calculatedSpreadsheetHeight = $(window).height() - $('header').height() - $('footer').height();
    $('#spreadsheet-one').height(calculatedSpreadsheetHeight);

    var container = document.getElementById('spreadsheet-one');
    var hot = new Handsontable(container, {
        startRows: 50,
        startCols: 26,
        rowHeaders: true,
        colHeaders: true,
        contextMenu: true,
        outsideClickDeselects: false
    });
    hot.selectCell(0, 0);

});
