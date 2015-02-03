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

        describe('getCellAffects()', function(){
            it('returns empty list for each cell in a newly initialized spreadsheet', function(){
                spreadsheet.getCellAffects(0, 0).should.be.empty;
                spreadsheet.getCellAffects(2, 3).should.be.empty;
                spreadsheet.getCellAffects(8, 2).should.be.empty;
            });

            it('returns the correct dependencies when they exist for a cell', function() {
                spreadsheet.setCellFormula(0, 0, '=A3', null);
                spreadsheet.setCellFormula(0, 1, '=A3', null);
                spreadsheet.getCellAffects(2, 0).should.eql([{row: 0, col: 0}, {row: 0, col: 1}]);
            });
        });

        describe('getCellDependsOn()', function(){
            it('returns empty list for each cell in a newly initialized spreadsheet', function(){
                spreadsheet.getCellDependsOn(0, 0).should.be.empty;
            });

            it('returns the correct dependencies when they exist for a cell', function() {
                spreadsheet.setCellFormula(0, 0, '=A3', null);
                spreadsheet.getCellDependsOn(0, 0).should.eql([{row: 2, col: 0}]);
            });
        }); 

        describe('setCellValue()', function() {
            it('correctly changes the cell\'s value', function(){
                spreadsheet.setCellValue(0, 0, 3, null);
                spreadsheet.getCellValue(0, 0).should.equal(3);
            });

            it('correctly updates the values of the related cells', function(){
                spreadsheet.setCellFormula(0, 0, '=B1', null);
                spreadsheet.setCellValue(0, 1, 3, null);
                spreadsheet.getCellValue(0, 0).should.equal(3);
            });
        });

        describe('setCellFormula()', function() {
            it('updates the cell\'s formula', function(){
                spreadsheet.setCellFormula(0, 0, '=3', null);
                spreadsheet.getCellFormula(0, 0).should.equal('=3');
            });

            it('correctly changes the cell\'s value when entering a new formula', function(){
                spreadsheet.setCellFormula(0, 0, '=3', null);
                spreadsheet.getCellValue(0, 0).should.equal(3);
            });

            it('updates the relations arrays after change in a cell\'s formula', function() {
                spreadsheet.setCellFormula(0, 0, '=A2', null);
                spreadsheet.getCellAffects(1, 0).should.eql([{row:0, col:0}]);
                spreadsheet.getCellDependsOn(0, 0).should.eql([{row:1, col:0}]);
                spreadsheet.setCellFormula(0, 0, '=3', null);
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
                spreadsheet.setCellValue(0, 0, 3, null);
                var formula = excelFormulaUtilities.formula2JavaScript('DUMMY(A1+4)');
                spreadsheet.doEval(2, 2, jsep(formula.slice(6, -1))).should.equal(7);
            });

            it('raises an exception when there is a circular dependency', function(){
                spreadsheet.setCellValue(0, 0, 3, null);
                var formula = excelFormulaUtilities.formula2JavaScript('DUMMY(A1+4)');
                var errorAction = function() {
                    spreadsheet.doEval(0, 0, jsep(formula.slice(6, -1)));
                }
                expect(errorAction).to.throw(referenceError);
            });

            it('raises an exception when there is a longer circular dependency', function(){
                spreadsheet.setCellFormula(0, 0, '=A2', null);
                spreadsheet.setCellFormula(1, 0, '=A3', null);
                var formula = excelFormulaUtilities.formula2JavaScript('DUMMY(A1+4)');
                var errorAction = function() {
                    spreadsheet.doEval(2, 0, jsep(formula.slice(6, -1)));
                }
                expect(errorAction).to.throw(referenceError);
            });
        });
    });

    describe('convertStringToCoords()', function(){
        it('returns an object with properties row and col', function(){
            var coords = convertStringToCoords('A1');
            coords.should.have.property('row');
            coords.should.have.property('col');
        });

        it('computes the right column with strings with one letter', function() {
            var coords = convertStringToCoords('A1');
            coords.col.should.be.equal(0);
        });

        it('computes the right column with strings with two letters', function() {
            var coords = convertStringToCoords('AA1');
            coords.col.should.be.equal(26);
        });

        it('computes the right column with strings with two different letters', function() {
            var coords = convertStringToCoords('BD1');
            coords.col.should.be.equal(55);
        });

        it('computes the right row with strings bigger second coordnate', function() {
            var coords = convertStringToCoords('BD32');
            coords.row.should.be.equal(31);
        });

        it('returns null is the row is not greater that 0', function() {
            var coords = convertStringToCoords('A0');
            expect(coords).to.be.null;
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
