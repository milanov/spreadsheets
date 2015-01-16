$(function() {
    'use strict';

    $('.dropdown-submenu > a').submenupicker();

    var container = document.getElementById('spreadsheet-one');
    var hot = new Handsontable(container, {
        startRows: 50,
        startCols: 26,
        rowHeaders: true,
        colHeaders: true,
        contextMenu: true
    });

});
