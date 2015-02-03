$(function() {
    'use strict';

    /* Activate Bootstrap's submenu plugin */
    $('.dropdown-submenu > a').submenupicker();

    var numberOfSpreadsheets = 1;

    var spreadsheetToolbar = $('#spreadsheet-one-toolbar');

    /* Instantiate "toolbar" for controlling the Handsontable instance */
    var htToolbar = new HandsontableToolbar(spreadsheetToolbar[0], 
            createHandsontableSpreadsheet('spreadsheet-1', '1'));

    var plusTab = $('#js-plus-tab');

    /* TODO: Add the ability to remove a tab */
    plusTab.on('click', function() {
        var index = ++numberOfSpreadsheets;
        var spreadsheetId = 'spreadsheet-' + index;

        $('#tab-list li').removeClass('active');
        $('#tab-list').append('<li class="active"><a href="#' + spreadsheetId + '" data-toggle="tab">Sheet ' + index + '</a></li>');

        /* Instantiate "toolbar" for controlling the Handsontable instance */
        var htToolbar = new HandsontableToolbar(spreadsheetToolbar[0], 
            createHandsontableSpreadsheet(spreadsheetId, index));
    });
});

function createHandsontableSpreadsheet(id, index, parentSpreadsheet) {
    'use strict';

    var newSpreadsheet = $('#spreadsheet-hidden').clone();
    newSpreadsheet.attr('id', id);
    newSpreadsheet.removeClass('hidden');

    var calculatedSpreadsheetHeight = $(window).height() - $('header').height() - $('footer').height();
    newSpreadsheet.height(calculatedSpreadsheetHeight);

    $('#tab-content div').removeClass('active');
    $('#tab-content').append(newSpreadsheet);

    var spreadsheetObj = new Spreadsheet(50, 28, parentSpreadsheet);
    //var SpreadsheetEditor = getSpreadsheetEditor(spreadsheetObj);

    var ht = new Handsontable(newSpreadsheet[0], {
        autoColumnSize: false,
        startRows: 50,
        startCols: 28,
        rowHeaders: true,
        colHeaders: true,
        contextMenu: true,
        outsideClickDeselects: false,
        comments: true
    });
    ht.updateSettings({ editor: getSpreadsheetEditor(spreadsheetObj, ht) });

    ht.selectCell(0, 0);

    return ht;
}
