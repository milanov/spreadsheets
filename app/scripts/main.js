$(function() {
    'use strict';

    /* Activate Bootstrap's submenu plugin */
    $('.dropdown-submenu > a').submenupicker();

    /* Calculate and set spreadsheet height based on the visible viewport height */
    var viewportHeight = $(window).height() - $('header').height() - $('footer').height();
    $('#spreadsheet-hidden').height(viewportHeight);

    /* Instantiate toolbar and manager for controlling the Handsontable instances */
    var spreadsheetToolbar = $('#spreadsheet-one-toolbar'),
        formulaBar = $('#formula-bar'),
        spreadsheetManager = new SpreadsheetManager(),
        htToolbar = new HandsontableToolbar(spreadsheetToolbar[0], spreadsheetManager);

    /* Simulate two-way binding between the currently selected cell and with the formula bar */
    formulaBar.on('focus input paste', function() {
        var instance = spreadsheetManager.getActiveSheet(),
            selection = instance.getSelectedRange().from;

        instance.setDataAtCell(selection.row, selection.col, this.value);
    });
    formulaBar.on('blur', function() {
        var instance = spreadsheetManager.getActiveSheet(),
            selection = instance.getSelectedRange().from;

        instance.spreadsheet.setCellFormula(selection.row, selection.col, this.value, instance.setDataAtCell);
        instance.setDataAtCell(selection.row, selection.col, instance.spreadsheet.getCellValue(selection.row, selection.col));
    });
    $(document).on('input paste', '.handsontableInput', function() {
        formulaBar.val(this.value);
    });


    var plusTab = $('#js-plus-tab'),
        tabs = $('#tab-list').tabs();
    plusTab.on('click', function() {
        var newSpreadsheet = $('#spreadsheet-hidden').clone();
        var sheetId = spreadsheetManager.createHandsontableSpreadsheet(newSpreadsheet[0], htToolbar);

        var sheetTitle = 'Sheet ' + sheetId;
        tabs.addTab(sheetId, sheetTitle, newSpreadsheet);

        /* Update the formula bar when clicked on a single cell */
        spreadsheetManager.getActiveSheet().addHook('afterSelection', function(r, c) {
            var selection = this.getSelectedRange();

            var cellFormula = '';
            if (selection.isSingle()) {
                cellFormula = this.spreadsheet.getCellFormula(r, c);
            }

            formulaBar.val(cellFormula);
        });

        spreadsheetManager.getActiveSheet().render()
    });
    plusTab.click();

    /* Update the active sheet on tab switch */
    $(document).on('tabs.afterTabSwitch tabs.afterTabClose', function(e, sheetId) {
        formulaBar.val('');
        spreadsheetManager.setActiveSheet(sheetId);
        spreadsheetManager.getActiveSheet().render();
    });
});
