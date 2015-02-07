(function() {
    'use strict';

    var spreadsheet;
    var referenceError = '#REF!';
    var rows = 10;
    var cols = 10;

    describe('Spreadsheet', function() {

        beforeEach(function() {
            spreadsheet = new Spreadsheet(rows, cols);
        });

        describe('getCellAffects()', function() {
            it('returns empty list for each cell in a newly initialized spreadsheet', function(){
                spreadsheet.getCellAffects(0, 0).should.be.empty;
                spreadsheet.getCellAffects(2, 3).should.be.empty;
                spreadsheet.getCellAffects(8, 2).should.be.empty;
            });

            it('returns the correct dependencies when they exist for a cell', function() {
                spreadsheet.setCellFormula(0, 0, '=A3');
                spreadsheet.setCellFormula(0, 1, '=A3');
                spreadsheet.getCellAffects(2, 0).should.eql([{row: 0, col: 0}, {row: 0, col: 1}]);
            });
        });

        describe('getCellDependsOn()', function() {
            it('returns empty list for each cell in a newly initialized spreadsheet', function(){
                spreadsheet.getCellDependsOn(0, 0).should.be.empty;
            });

            it('returns the correct dependencies when they exist for a cell', function() {
                spreadsheet.setCellFormula(0, 0, '=A3');
                spreadsheet.getCellDependsOn(0, 0).should.eql([{row: 2, col: 0}]);
            });
        }); 

        describe('setCellValue()', function() {
            it('correctly changes the cell\'s value', function(){
                spreadsheet.setCellValue(0, 0, 3);
                spreadsheet.getCellValue(0, 0).should.equal(3);
            });

            it('correctly updates the values of the related cells', function(){
                spreadsheet.setCellFormula(0, 0, '=B1');
                spreadsheet.setCellValue(0, 1, 3);
                spreadsheet.getCellValue(0, 0).should.equal(3);
            });
        });

        describe('setCellFormula()', function() {
            it('updates the cell\'s formula', function(){
                spreadsheet.setCellFormula(0, 0, '=3');
                spreadsheet.getCellFormula(0, 0).should.equal('=3');
            });

            it('correctly changes the cell\'s value when entering a new formula', function(){
                spreadsheet.setCellFormula(0, 0, '=3');
                spreadsheet.getCellValue(0, 0).should.equal(3);
            });

            it('updates the relations arrays after change in a cell\'s formula', function() {
                spreadsheet.setCellFormula(0, 0, '=A2');
                spreadsheet.getCellAffects(1, 0).should.eql([{row:0, col:0}]);
                spreadsheet.getCellDependsOn(0, 0).should.eql([{row:1, col:0}]);
                spreadsheet.setCellFormula(0, 0, '=3');
                spreadsheet.getCellAffects(0, 0).should.be.empty;
                spreadsheet.getCellDependsOn(0, 0).should.be.empty;
                spreadsheet.getCellAffects(1, 0).should.be.empty;
            })
        });

        describe('doEval()', function(){
            it('comptutes the right value of a simple expression', function(){
                var formula = excelFormulaUtilities.formula2JavaScript('DUMMY(3+4)');
                spreadsheet.doEval(0, 0, jsep(formula.slice(6, -1))).should.equal(7);
            });

            it('computes the right value of a complex expression with dependencies', function(){
                spreadsheet.setCellValue(0, 0, 3);
                var formula = excelFormulaUtilities.formula2JavaScript('DUMMY(A1+4)');
                spreadsheet.doEval(2, 2, jsep(formula.slice(6, -1))).should.equal(7);
            });

            it('raises an exception when there is a circular dependency', function(){
                spreadsheet.setCellValue(0, 0, 3);
                var formula = excelFormulaUtilities.formula2JavaScript('DUMMY(A1+4)');
                var errorAction = function() {
                    spreadsheet.doEval(0, 0, jsep(formula.slice(6, -1)));
                }
                expect(errorAction).to.throw(referenceError);
            });

            it('raises an exception when there is a longer circular dependency', function(){
                spreadsheet.setCellFormula(0, 0, '=A2');
                spreadsheet.setCellFormula(1, 0, '=A3');
                var formula = excelFormulaUtilities.formula2JavaScript('DUMMY(A1+4)');
                var errorAction = function() {
                    spreadsheet.doEval(2, 0, jsep(formula.slice(6, -1)));
                }
                expect(errorAction).to.throw(referenceError);
            });
        });
        
        describe('insertRow()', function() {
            it('increases the height of the spreashsheet', function(){
                spreadsheet.insertRow(0);
                spreadsheet.getCellFormula(rows, 0).should.equal('');
            });

            it('moves the rows below', function(){
                spreadsheet.setCellFormula(0, 0, '=1');
                spreadsheet.setCellFormula(1, 1, '=2');
                spreadsheet.insertRow(0);
                spreadsheet.getCellFormula(0, 0).should.equal('');
                spreadsheet.getCellFormula(1, 0).should.equal('=1');
                spreadsheet.getCellFormula(2, 1).should.equal('=2');
            });

            it('keeps the rows above the same', function(){
                spreadsheet.setCellFormula(0, 0, '=1');
                spreadsheet.setCellFormula(1, 1, '=2');
                spreadsheet.insertRow(1);
                spreadsheet.getCellFormula(0, 0).should.equal('=1');
                spreadsheet.getCellFormula(1, 0).should.equal('');
                spreadsheet.getCellFormula(2, 1).should.equal('=2');
            });
        });

        describe('insertColumn()', function() {
            it('increases the width of the spreashsheet', function(){
                spreadsheet.insertColumn(0);
                spreadsheet.getCellFormula(0, cols).should.equal('');
            });

            it('moves the column on the right', function(){
                spreadsheet.setCellFormula(0, 0, '=1');
                spreadsheet.setCellFormula(1, 1, '=2');
                spreadsheet.insertColumn(0);
                spreadsheet.getCellFormula(0, 0).should.equal('');
                spreadsheet.getCellFormula(0, 1).should.equal('=1');
                spreadsheet.getCellFormula(1, 2).should.equal('=2');
            });

            it('keeps the columns on the left the same', function(){
                spreadsheet.setCellFormula(0, 0, '=1');
                spreadsheet.setCellFormula(1, 1, '=2');
                spreadsheet.insertColumn(1);
                spreadsheet.getCellFormula(0, 0).should.equal('=1');
                spreadsheet.getCellFormula(0, 1).should.equal('');
                spreadsheet.getCellFormula(1, 2).should.equal('=2');
            });
        });

        describe('removeRow()', function() {
            it('moves the rows below with one row up', function(){
                spreadsheet.setCellFormula(0, 1, '=1');
                spreadsheet.setCellFormula(1, 1, '=2');
                spreadsheet.removeRow(0);
                spreadsheet.getCellFormula(0, 1).should.equal('=2');
                spreadsheet.getCellFormula(1, 1).should.equal('');
            });

            it('keeps the rows above the same', function(){
                spreadsheet.setCellFormula(0, 0, '=1');
                spreadsheet.setCellFormula(1, 0, '=2');
                spreadsheet.setCellFormula(2, 0, '=3');
                spreadsheet.removeRow(1);
                spreadsheet.getCellFormula(0, 0).should.equal('=1');
                spreadsheet.getCellFormula(1, 0).should.equal('=3');
            });
        });

        describe('removeColumn()', function() {
            it('moves the columns on the right with one column to the left', function(){
                spreadsheet.setCellFormula(0, 1, '=1');
                spreadsheet.setCellFormula(0, 2, '=2');
                spreadsheet.removeColumn(0);
                spreadsheet.getCellFormula(0, 0).should.equal('=1');
                spreadsheet.getCellFormula(0, 1).should.equal('=2');
                spreadsheet.getCellFormula(0, 2).should.equal('');
            });

            it('keeps the rows on the left side the same', function(){
                spreadsheet.setCellFormula(0, 0, '=1');
                spreadsheet.setCellFormula(0, 1, '=2');
                spreadsheet.setCellFormula(0, 2, '=3');
                spreadsheet.removeColumn(1);
                spreadsheet.getCellFormula(0, 0).should.equal('=1');
                spreadsheet.getCellFormula(0, 1).should.equal('=3');
                spreadsheet.getCellFormula(0, 2).should.equal('');
            });
        });
    });

    describe('isInArray()', function(){

        var coords = {row : 1, col: 1};

        it('returns false if the array is empty', function(){
            isInArray(coords, []).should.be.false;
        });

        it('returns false if the array doesn\'t contain an object with the same values for row and col', function(){
            isInArray(coords, [{row: 3, col: 4}]).should.be.false;
        });

        it('returns false if the array contains an object with the same value for only one of the properties', function(){
            isInArray(coords, [{row: 1, col: 4}]).should.be.false;
            isInArray(coords, [{row: 3, col: 1}]).should.be.false;
        });

        it('finds the object if the array contains an object with the same values for the properties', function(){
            isInArray(coords, [{row: 1, col: 1}]).should.be.true;
        });

        it('finds the object if the array contains more than one object', function(){
            isInArray(coords, [{row: 2, col: 3}, {row: 1, col: 1}]).should.be.true;
        });
    });

})();
