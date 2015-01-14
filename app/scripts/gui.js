
function createSpreadsheet(holderElement, rows, cols) {
    'use strict';

    var spreadsheetTable = '<table class="table table-bordered spreadsheet">';
    for (var i = 0; i <= rows; i++) {
        spreadsheetTable += '<tr>';
        for (var j = 0; j <= cols; j++) {
            var letter = String.fromCharCode('A'.charCodeAt(0) + j - 1);
            spreadsheetTable += '<td>';
            spreadsheetTable += i && j ? '<input id="' + letter + i + '"/>' : i || letter;
            spreadsheetTable += '</td>';
        }
        spreadsheetTable += '</tr>';
    }
    spreadsheetTable += '</table>';

    holderElement.html(spreadsheetTable);
}
