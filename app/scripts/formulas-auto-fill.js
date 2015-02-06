function changeRowIndex(cell, counter) {
    'use strict';

    var alphaNum = getCellAlphaNum(cell),
        col = alphaNum.alpha,
        row = parseInt(alphaNum.num + counter, 10);
    if (row < 1) {
        row = 1;
    }
    return col + '' + row;
}

function changeColIndex(cell, counter) {
    'use strict';

    var alphaNum = getCellAlphaNum(cell),
        alpha = alphaNum.alpha,
        col = Handsontable.helper.spreadsheetColumnLabel(parseInt(spreadsheetColumnLabelToIndex(alpha) + counter, 10)),
        row = alphaNum.num;
    if (!col || col.length === 0) {
        col = 'A';
    }
    var fixedCol = alpha[0] === '$' || false,
        fixedRow = alpha[alpha.length - 1] === '$' || false;
    col = (fixedCol ? '$' : '') + col;
    row = (fixedRow ? '$' : '') + row;
    return col + '' + row;
}

function updateFormula(formula, direction, delta) {
    'use strict';

    var type, counter;
    
    // left, right -> col
    if (['left', 'right'].indexOf(direction) !== -1) {
        type = 'col';
    } else if (['up', 'down'].indexOf(direction) !== -1) {
        type = 'row';
    }
    
    // down, up -> row
    if (['down', 'right'].indexOf(direction) !== -1) {
        counter = delta * 1;
    } else if (['up', 'left'].indexOf(direction) !== -1) {
        counter = delta * (-1);
    }
    
    if (type && counter) {
        return formula.replace(/(\$?[A-Za-z]+\$?[0-9]+)/g, function(match) {
            var alpha = getCellAlphaNum(match).alpha;
            var fixedCol = alpha[0] === '$' || false,
                fixedRow = alpha[alpha.length - 1] === '$' || false;
            if (type === 'row' && fixedRow) {
                return match;
            }
            if (type === 'col' && fixedCol) {
                return match;
            }
            return (type === 'row' ? changeRowIndex(match, counter) : changeColIndex(match, counter));
        });
    }
    return formula;
}

function beforeAutofillInsidePopulate(index, direction, data, deltas, iterators, selected) {
    'use strict';

    var r = this.getSelectedRange().from.row + index.row,
        c = this.getSelectedRange().from.col + index.col,
        value = this.spreadsheet.getCellFormula(r, c),
        delta = 0,
        rlength = data.length, // rows
        clength = data ? data[0].length : 0; //cols

    var offsetR = 0,
        offsetC = 0;
    if (direction === 'down') {
        offsetR = rlength * iterators.row;
    }
    if (direction === 'up') {
        offsetR = -rlength * iterators.row;
    }
    if (direction === 'right') {
        offsetC = clength * iterators.col;
    }
    if (direction === 'left') {
        offsetC = -clength * iterators.col;
    }

    var currentRow = r + offsetR;
    var currentCol = c + offsetC;

    if (isFormula(value)) { // formula
        if (['down', 'up'].indexOf(direction) !== -1) {
            delta = rlength * iterators.row;
        } else if (['right', 'left'].indexOf(direction) !== -1) {
            delta = clength * iterators.col;
        }

        var fml = updateFormula(value, direction, delta);
        this.spreadsheet.setCellFormula(currentRow, currentCol, fml, null);
        value = this.spreadsheet.getCellValue(currentRow, currentCol);
    }

    return {
        value: value,
        iterators: iterators
    };
}
