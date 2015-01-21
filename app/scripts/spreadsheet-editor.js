function getSpreadsheetEditor(spreadsheetInstance) {

    var SpreadsheetEditor = Handsontable.editors.TextEditor.prototype.extend();

    SpreadsheetEditor.prototype.getValue = function() {
        spreadsheetInstance.setCellFormula(this.row, this.col, this.TEXTAREA.value, null);
        return spreadsheetInstance.getCellValue(this.row, this.col);
    };

    SpreadsheetEditor.prototype.setValue = function(newValue){
        var value = newValue.charAt(0) === '=' ? newValue : spreadsheetInstance.getCellFormula(this.row, this.col);
        this.TEXTAREA.value = value;
    };

    return SpreadsheetEditor;
}
