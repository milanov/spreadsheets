$(function() {
    'use strict';

    /* Activate Bootstrap's submenu plugin */
    $('.dropdown-submenu > a').submenupicker();

    var spreadsheetManager = new SpreadsheetManager();

    /* Instantiate "toolbar" for controlling the Handsontable instance */
    var spreadsheetToolbar = $('#spreadsheet-one-toolbar');
    var htToolbar = new HandsontableToolbar(spreadsheetToolbar[0], spreadsheetManager);

    /* TODO: Add the ability to remove a tab */
    var plusTab = $('#js-plus-tab');

    plusTab.on('click', function() {
        var index = spreadsheetManager.getNextId();
        var spreadsheetId = 'spreadsheet-' + index;
        var tabId = 'tab-' + index;

        $('#tab-list li').removeClass('active');
        $('#tab-list').append('<li class="active"><a id="' + tabId + '" href="#' + spreadsheetId + '" data-toggle="tab">Sheet ' + index + '</a></li>');

        var handsontable = spreadsheetManager.createHandsontableSpreadsheet(spreadsheetId, htToolbar);

        $('#' + tabId).on('click', function() {
            spreadsheetManager.setCurrentHandsontable(handsontable);
        });
    });

    plusTab.click();

});
