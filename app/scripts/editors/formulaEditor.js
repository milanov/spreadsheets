(function(Handsontable) {
    'use strict';

    var FormulaEditor = Handsontable.editors.TextEditor.prototype.extend();

    FormulaEditor.prototype.getValue = function() {
        this.instance.spreadsheet.setCellFormula(this.row, this.col, this.TEXTAREA.value, this.instance.setDataAtCell);
        return this.instance.spreadsheet.getCellValue(this.row, this.col);
    };

    FormulaEditor.prototype.setValue = function(newValue) {
        var value = newValue.charAt(0) === '=' ? newValue : this.instance.spreadsheet.getCellFormula(this.row, this.col);
        this.TEXTAREA.value = value;
    };

    Handsontable.editors.FormulaEditor = FormulaEditor;
    Handsontable.editors.registerEditor('formula', FormulaEditor);
})(Handsontable);
