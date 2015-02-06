(function (Handsontable) {
    'use strict';
    
    var Actions = {};

    Actions.undo = {
        callback: function () {
            this.undo();
        },
        disabled: function () {
            return this.undoRedo && !this.undoRedo.isUndoAvailable();
        }
    };

    Actions.redo = {
        callback: function () {
            this.redo();
        },
        disabled: function () {
            return this.undoRedo && !this.undoRedo.isRedoAvailable();
        }
    };

    Actions.insertRowAbove = {
        callback: function (key, selection) {
            this.alter('insert_row', selection.start.row);
        },
        disabled: function () {
            var selected = this.getSelected(),
              entireColumnSelection = [0, selected[1], this.countRows() - 1, selected[1]],
              columnSelected = entireColumnSelection.join(',') === selected.join(',');

            return selected[0] < 0 || this.countRows() >= this.getSettings().maxRows || columnSelected;
        }
    };

    Actions.insertRowBelow = {
        callback: function (key, selection) {
            this.alter('insert_row', selection.end.row + 1);
        },
        disabled: function () {
            var selected = this.getSelected(),
              entireColumnSelection = [0, selected[1], this.countRows() - 1, selected[1]],
              columnSelected = entireColumnSelection.join(',') === selected.join(',');

            return this.getSelected()[0] < 0 || this.countRows() >= this.getSettings().maxRows || columnSelected;
        }
    };

    Actions.insertColLeft = {
        callback: function (key, selection) {
            this.alter('insert_col', selection.start.col);
        },
        disabled: function () {
            var selected = this.getSelected(),
              entireRowSelection = [selected[0], 0, selected[0], this.countCols() - 1],
              rowSelected = entireRowSelection.join(',') === selected.join(',');

            return this.getSelected()[1] < 0 || this.countCols() >= this.getSettings().maxCols || rowSelected;
        }
    };

    Actions.insertColRight = {
        callback: function (key, selection) {
            this.alter('insert_col', selection.end.col + 1);
        },
        disabled: function () {
            var selected = this.getSelected(),
              entireRowSelection = [selected[0], 0, selected[0], this.countCols() - 1],
              rowSelected = entireRowSelection.join(',') === selected.join(',');

            return selected[1] < 0 || this.countCols() >= this.getSettings().maxCols || rowSelected;
        }
    };

    // TODO add delete col/row

    Actions.addEditComment = {
        callback: function () {
            Handsontable.Comments.showComment(this.getSelectedRange());
        },
        disabled: function () {
            return false;
        }
    };

    // TODO add remove comment

    Actions.insertFunction = {
        callback: function(functionName) {
            var totalRowsCount = this.countRows(),
              selection = this.getSelectedRange();

            var topLeft = selection.getTopLeftCorner(),
                bottomRight = selection.getBottomRightCorner();

            if (selection.isSingle()) {
                var cellValue = '=' + functionName.toUpperCase() + '()';
                this.getActiveEditor().beginEditing(cellValue);
                return;
            }

            var startCellCoord = this.getColHeader(topLeft.col) + this.getRowHeader(topLeft.row);
            var endCellCoord = this.getColHeader(bottomRight.col) + this.getRowHeader(bottomRight.row);
            var cellValue = '=' + functionName.toUpperCase() + '(' + startCellCoord + ':' + endCellCoord +')';
            var rowToInsertFormulaIn = (bottomRight.row + 1) === totalRowsCount ? topLeft.row - 1 : bottomRight.row + 1;

            this.selectCell(rowToInsertFormulaIn, topLeft.col);
            this.getActiveEditor().beginEditing(cellValue);
        },
        disabled: function() {
            var totalRowsCount = this.countRows(),
              selection = this.getSelectedRange();

            return (!selection.isSingle() && totalRowsCount < 2);
        }
    };

    Actions.toggleClass = {
        callback: function(range, formatClass, classGroup) {
            var that = this;

            range.forAll(function(row, col) {
                var cellMeta = that.getCellMeta(row, col);
                var updatedClassName = toggleClass(cellMeta.className, formatClass, classGroup);

                that.setCellMeta(row, col, 'className', updatedClassName);
            });

            this.render();
        },
        disabled: false
    };

    Handsontable.Actions = Actions;

})(Handsontable);
