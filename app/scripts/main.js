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
        handsontable.addHook('afterSelection', function(r, c, r2, c2) {
            var selected = handsontable.getSelectedRange();
            var classesFrequency = {};
            var flag = true;

            /* Find the common format classes for all selected cells */
            selected.forAll(function(row, col) {
                var metaData = handsontable.getCellMeta(row, col)['className'];
                if (metaData === undefined) {
                    flag = false;
                    return false;
                }
                var classes = metaData.split(' ');
                for (var index in classes) {
                    if (classesFrequency[classes[index]] === undefined) {
                        classesFrequency[classes[index]] = 0;
                    }
                    classesFrequency[classes[index]]++;
                }
            });

            var intersection = findIntersection(classesFrequency, selected.getWidth()*selected.getHeight());
            if (flag === true) {
                htToolbar.updateUI(intersection);
            } else {
                htToolbar.resetUI();
            }
        });

        htToolbar.setInstance(handsontable);

        $('#' + tabId).on('click', htToolbar.setInstance(handsontable));
    });

    plusTab.click();
});

function findIntersection(classes, count) {
    var intersection = [];

    for (var classElement in classes) {
        if (classes[classElement] === count) {
            intersection.push(classElement);
        }
    }

    return intersection;
}

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
        comments: true,
        editor: 'formula'
    });
    ht.spreadsheet =  new Spreadsheet(ht.countRows(), ht.countCols());
    ht.addHook('beforeAutofillInsidePopulate', beforeAutofillInsidePopulate);

    ht.selectCell(0, 0);

    return ht;
}
