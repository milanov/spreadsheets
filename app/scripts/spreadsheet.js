function Spreadsheet(rows, cols, storage) {
    'use strict';

    var referenceError = '#REF!';
    var table = {};

    if (storage === undefined) {
        for (var i = 0; i < rows; i++) {
            table[i] = {};
            for (var j = 0; j < cols; j++) {
                table[i][j] = {
                    value: null,
                    formula: '',
                    affects: [],
                    dependsOn: []
                };
            }
        } 
    } else {
        for (var i = 0; i < rows; i++) {
            table[i] = {};
            for (var j = 0; j < cols; j++) {
                table[i][j] = {
                    value: storage.getCellValue(i, j),
                    formula: storage.getCellFormula(i, j),
                    affects: storage.getCellAffects,
                    dependsOn: storage.getCellDependsOn
                };
            }
        }
    }

    this.recomputeAll = function(callback) {
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {

                if (table[i][j].value === null) {
                    this.recompute(i, j, callback);
                }
            }
        }
    };

    this.getCellAffects = function(row, col) {
        return table[row][col].affects;
    };

    this.getCellDependsOn = function(row, col) {
        return table[row][col].dependsOn;
    };

    this.getCellValue = function(row, col) {
        return table[row][col].value;
    };

    this.setCellValue = function(row, col, value, callback) {
        table[row][col].value = value;
        var that = this;
        // Change the value of all cells that depend on this one
        $.each(table[row][col].affects, function (index, value) {
            that.recompute(value.row, value.col, callback);
        });
    };

    this.getCellFormula = function(row, col) {
        return table[row][col].formula;
    };

    this.setCellFormula = function(row, col, value, callback) {

        $.each(table[row][col].dependsOn, function (index, value) {
            var result = table[value.row][value.col].affects.filter(
                function( obj ) {
                    return obj.row !== row || obj.col !== col;
            });

            table[value.row][value.col].affects = result;
        });
        table[row][col].dependsOn = [];

        table[row][col].formula = value;

        /* Compute the new value */

        this.recompute(row, col, callback);


        var that = this;
        /* Change the value of all cells that depend on this one */
        $.each(table[row][col].affects, function (index, value) {
            that.recompute(value.row, value.col, callback);
        });
    };

    var binops = {
        '+' : function(a, b) { return a + b; },
        '-' : function(a, b) { return a - b; },
        '*' : function(a, b) { return a * b; },
        '/' : function(a, b) { return a / b; },
        '%' : function(a, b) { return a % b; }
    };
    var unops = {
        '-' : function(a) { return -a; },
        '+' : function(a) { return a; }
    };

    this.doEval = function(row, col, node, callback) {

        if(node.type === 'BinaryExpression') {
            return binops[node.operator](
                this.doEval(row, col, node.left, callback),
                this.doEval(row, col, node.right, callback));
        } else if(node.type === 'UnaryExpression') {
            return unops[node.operator](this.doEval(row, col, node.argument, callback));
        } else if(node.type === 'Literal') {
            return node.value;
        } else if (node.type === 'Identifier') { // and node.name is in table

            var coords = convertStringToCoords(node.name);

            /* Compute the dependencies of the current cell */
            if (!isInArray(coords, table[row][col].dependsOn)) {
                table[row][col].dependsOn.push(coords);
            }

            $.each(table[coords.row][coords.col].dependsOn, function (index, value) {
                if (!isInArray(value, table[row][col].dependsOn)) {
                    table[row][col].dependsOn.push(value);
                } 
            });

            /* Check if this cell has effect on and at the same
               time depends on another cell
               If so we've found a reference error */          
            if (isInArray(coords, table[row][col].affects) ||
                    (coords.row === row && coords.col === col)) {
                throw new Error(referenceError);
            }

            /* If we haven't found a reference error yet
               we continue with updating the node's affects array
               because the current cell depends on it */
            var currentCell = {
                row: row,
                col: col
            };

            if (!isInArray(currentCell, table[coords.row][coords.col].affects)) {
                table[coords.row][coords.col].affects.push(currentCell);
            }

            $.each(table[row][col].affects, function (index, value) {
                if (!isInArray(value, table[coords.row][coords.col].affects)) {
                    table[coords.row][coords.col].affects.push(value);
                }
            });

            var result = this.getCellValue(coords.row, coords.col);

            if (result === null) {
                /* We haven't computed the cell's value yet */
                this.recompute(coords.row, coords.col, callback);
                result = this.getCellValue(coords.row, coords.col);
                if (result === referenceError) {
                    throw new Error(referenceError);
                }
            }
            if (result === referenceError) {
                /* The cell that we depend on has referece error */
                throw new Error(referenceError);
            }

            return result === '' ? 0 : parseFloat(result);
        }
    };

    this.recompute = function(row, col, callback) {

        var value = this.getCellFormula(row, col);
        var evaluatedValue = value;
        if (value.charAt(0) === '=') {
            /* Remove the 'equal' sign and the whitespace before evaluating */
            value = value.slice(1);
            value = evaluatedValue = value.trim();

            if (value !== '') {
                /* Wrap the value to be evaluated with 'DUMMY' function 
                   so it can be passed to 'excelFormulaUtilities'.
                   After that we unwrap the result before pass it to jsep */
                var jsFormula = excelFormulaUtilities.formula2JavaScript('DUMMY(' + value + ')');
                jsFormula = jsFormula.slice(6, -1);

                try {
                    evaluatedValue = this.doEval(row, col, jsep(jsFormula), callback);                  
                } catch (e) {
                    if (e.message === referenceError) {
                        evaluatedValue = e.message;
                    }
                }
            }
        }
        /* Update the value with the newly evaluated one */
        this.setCellValue(row, col, evaluatedValue, callback);
        if (callback !== undefined && callback !== null) {
            callback(row, col, evaluatedValue);
        }
    };
}

function isInArray(object, array) {
    'use strict';

    var result = array.filter(function( obj ) {
            return obj.row === object.row && obj.col === object.col;
    });

    return result.length !== 0;
}

function convertStringToCoords(string) {
    'use strict';

    var coords = string.match(/([a-zA-Z]+)(\d+)/);
    var row = coords[2], column = coords[1];
    var alphabetLetters = 26;
    var counter = 0;
    var resultColumn = 0;

    if (row <= 0) {
        return null;
    }

    for (var x = column.length - 1; x >= 0; x--) {

        var character = column.charAt(x);
        var characterIndex = character.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0) + 1;
        var toAdd = characterIndex;

        for (var i = 0; i < counter; i++) {
            toAdd *= alphabetLetters;
        }

        resultColumn += toAdd;
        counter++;          
    }
    return {
        row: row - 1,
        col: resultColumn - 1
    };
}
