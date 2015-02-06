$(function() {
    'use strict';

    /* Activate Bootstrap's submenu plugin */
    $('.dropdown-submenu > a').submenupicker();

    /* Instantiate "toolbar" for controlling the Handsontable instance */
    var spreadsheetToolbar = $('#spreadsheet-one-toolbar');
    var htToolbar = new HandsontableToolbar(spreadsheetToolbar[0]);

    var numberOfSpreadsheets = 0;

    /* TODO: Add the ability to remove a tab */
    var plusTab = $('#js-plus-tab');
    plusTab.on('click', function() {
        var index = ++numberOfSpreadsheets;
        var spreadsheetId = 'spreadsheet-' + index;
        var tabId = 'tab-' + index;

        $('#tab-list li').removeClass('active');
        $('#tab-list').append('<li class="active"><a id="' + tabId + '" href="#' + spreadsheetId + '" data-toggle="tab">Sheet ' + index + '</a></li>');

        var handsontable = createHandsontableSpreadsheet(spreadsheetId);
        htToolbar.initToolbarForInstance(handsontable);

        $('#' + tabId).on('click', htToolbar.setInstance(handsontable));
    });

    plusTab.click();

});

function createHandsontableSpreadsheet(id) {
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
        comments: true
    });
    ht.spreadsheet =  new Spreadsheet(ht.countRows(), ht.countCols());
    ht.updateSettings({ editor: getSpreadsheetEditor(ht) });
    ht.addHook('beforeAutofillInsidePopulate', beforeAutofillInsidePopulate);
    ht.selectCell(0, 0);

    return ht;
}
