function getSpreadsheetEditor(ht) {
    'use strict';

    var SpreadsheetEditor = Handsontable.editors.TextEditor.prototype.extend();

    SpreadsheetEditor.prototype.getValue = function() {
        ht.spreadsheet.setCellFormula(this.row, this.col, this.TEXTAREA.value, ht.setDataAtCell);
        return ht.spreadsheet.getCellValue(this.row, this.col);
    };

    SpreadsheetEditor.prototype.setValue = function(newValue){
        var value = newValue.charAt(0) === '=' ? newValue : ht.spreadsheet.getCellFormula(this.row, this.col);
        this.TEXTAREA.value = value;
    };

    return SpreadsheetEditor;
}
