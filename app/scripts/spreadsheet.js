function Spreadsheet(rows, cols, storage) {
    'use strict';

    var referenceError = '#REF!';
    var table = {};

    for (var i = 0; i < rows; i++) {
        table[i] = {};
        for (var j = 0; j < cols; j++) {
            table[i][j] = {
                value: null,
                formula: '',
                effects: [],
                dependsOn: []
            };
        }
    }

    this.convertStringToCoords = function(string) {
        'use strict';

        var coords = string.match(/([a-zA-Z]+)(\d+)/);
        var row = coords[2], column = coords[1];

        var counter = 0;
        var resultColumn = 0;
        for (var x = column.length - 1; x >= 0; x--) {
            var c = column.charAt(x);

            c = c.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0) + 1;
            var add = c;
            for (var i = 0; i < counter; i++) {
                add = add*26;
            }
            resultColumn = resultColumn + add;
            counter += 1;          
        }
        return {row:row - 1, col:resultColumn - 1};

    }

    this.recomputeAll = function(callback) {
        'use strict';

        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {

                if (table[i][j].value === null) {
                    this.recompute(i, j, callback);
                }
            }
        }
    };

    this.getCellValue = function(row, col) {
        'use strict';

        return table[row][col].value;
    };

    this.setCellValue = function(row, col, value, callback) {
        'use strict';

        table[row][col].value = value;
        var that = this;
        // Change the value of all cells that depend on this one
        $.each(table[row][col].effects, function (index, value) {
            that.recompute(value.row, value.col, callback);
        });
    };

    this.getCellFormula = function(row, col) {
        'use strict';

        return table[row][col].formula;
    };

    this.setCellFormula = function(row, col, value, callback) {
        'use strict';

        $.each(table[row][col].dependsOn, function (index, value) {
            var result = table[value.row][value.col].effects.filter(
                function( obj ) {
                    return obj.row != row || obj.col != col;
            });

            table[value.row][value.col].effects = result;
        });
        table[row][col].dependsOn = [];

        table[row][col].formula = value;

        // Compute the new value

        this.recompute(row, col, callback);


        var that = this;
        // Change the value of all cells that depend on this one
        $.each(table[row][col].effects, function (index, value) {
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

    this.doEval = function(row, col, node) {
       'use strict';

        if(node.type === 'BinaryExpression') {
            return binops[node.operator](
                this.doEval(row, col, node.left),
                this.doEval(row, col, node.right));
        } else if(node.type === 'UnaryExpression') {
            return unops[node.operator](this.doEval(row, col, node.argument));
        } else if(node.type === 'Literal') {
            return node.value;
        } else if (node.type === 'Identifier') { // and node.name is in table

            var coords = this.convertStringToCoords(node.name);

            // Compute the dependencies of the current cell
            if (!this.isInArray(coords, table[row][col].dependsOn)) {
                table[row][col].dependsOn.push(coords);
            }
            var that=this;

            $.each(table[coords.row][coords.col].dependsOn, function (index, value) {
                if (!that.isInArray(value, table[row][col].dependsOn)) {
                    table[row][col].dependsOn.push(value);
                } 
            });

            // Check if this cell has effect on and at the same
            // time depends on another cell
            // If so we've found a reference error            
            if (this.isInArray(coords, table[row][col].effects) ||
                    (coords.row === row && coords.col === col)) {
                throw new Error(referenceError);
            }

            // If we haven't found a reference error yet
            // we continue with updating the node's affects array
            // because the current cell depends on it
            var currentCell = {
                row: row,
                col: col
            };

            if (!this.isInArray(currentCell, table[coords.row][coords.col].effects)) {
                table[coords.row][coords.col].effects.push(currentCell);
            }

            $.each(table[row][col].effects, function (index, value) {
                if (!that.isInArray(value, table[coords.row][coords.col].effects)) {
                    table[coords.row][coords.col].effects.push(value);
                }
            });

            var result = this.getCellValue(coords.row, coords.col);

            if (result === null) {
                // We haven't computed the cell's value yet
                this.recompute(coords.row, coords.col, callback);
                result = this.getCellValue(coords.row, coords.col);
                if (result === referenceError) {
                    throw new Error(referenceError);
                }
            }
            if (result === referenceError) {
                // The cell that we depend on has referece error
                throw new Error(referenceError);
            }

            return result === '' ? 0 : parseFloat(result);
        }
    }

    this.recompute = function(row, col, callback) {
        'use strict';

        var value = this.getCellFormula(row, col);
        var evaluatedValue = value;
        if (value.charAt(0) === '=') {
            value = value.slice(1);
            value = evaluatedValue = value.trim();

            if (value !== '') {
                var jsFormula = excelFormulaUtilities.formula2JavaScript('DUMMY(' + value + ')');
                jsFormula = jsFormula.slice(6, -1);

                try {
                    evaluatedValue = this.doEval(row, col, jsep(jsFormula));                  
                } catch (e) {
                    if (e.message === referenceError) {
                        evaluatedValue = e.message;
                    } else {
                        throw new Error(e.message);
                    }
                }
            }
        }
        this.setCellValue(row, col, evaluatedValue, callback);
        if (callback !== null) {
            callback(row, col, evaluatedValue);
        }
    }

    this.isInArray = function(object, array) {
        'use strict';

        var result = array.filter(function( obj ) {
                return obj.row === object.row && obj.col === object.col;
        });

        return result.length !== 0;
    }
}
