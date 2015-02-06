/* global describe, it */

(function () {
    'use strict';

    describe('spreadsheetColumnLabelToIndex', function () {
        it('should work for single-character labels (A)', function () {
            spreadsheetColumnLabelToIndex('A').should.equal(0);
        });

        it('should work for single-character labels (Z)', function () {
            spreadsheetColumnLabelToIndex('Z').should.equal(25);
        });

        it('should work for multi-character labels', function () {
            spreadsheetColumnLabelToIndex('BD').should.equal(55);
        });
    });

    describe('clearFormula', function() {
        it('should leave the formula as it is in case it does not contain absolute references', function() {
            var formula = '=A1+B2';
            clearFormula(formula).should.equal(formula);
        });

        it('should remove absolute references if present', function() {
            var formula = '=A$1+$B2';
            clearFormula(formula).should.equal('=A1+B2');
        });

        it('should work with nested formulas', function() {
            var formula = '=SUM(A1:$B2)+G5/$AB$12',
                cleared = '=SUM(A1:B2)+G5/AB12';

            clearFormula(formula).should.equal(cleared);
        });
    });

    describe('getCellAlphaNum', function() {
        it('returns an object with properties alpha and nu,', function(){
            var alphanum = getCellAlphaNum('A1');
            alphanum.should.have.property('alpha');
            alphanum.should.have.property('num');
        });

        it('splits the formula into alpha and numeric parts', function() {
            var alphanum = getCellAlphaNum('B5');
            alphanum.alpha.should.equal('B');
            alphanum.num.should.equal(5);
        });

        it('should handle multi-character and multi-digit cell labels', function() {
            var alphanum = getCellAlphaNum('AAC12');
            alphanum.alpha.should.equal('AAC');
            alphanum.num.should.equal(12);
        });
    });

    describe('isFormula', function() {
        it('should return false when a value is not a formula', function() {
            isFormula('formula').should.be.false;
        });

        it('should return false when the value is not a formula and contains special symbols', function() {
            isFormula('$not a FORm&l@').should.be.false;
        });

        it('should correctly recognize formulas', function() {
            isFormula('=A1+B2').should.be.true;
        });

        it('should work with nested formulas', function() {
            isFormula('=AVG(SUM(A1:B2), $B2)').should.be.true;
        });
    });

    describe('convertStringToCoords', function(){
        it('returns an object with properties row and col', function(){
            var coords = convertStringToCoords('A1');
            coords.should.have.property('row');
            coords.should.have.property('col');
        });

        it('computes the right column with strings with one letter', function() {
            var coords = convertStringToCoords('A1');
            coords.col.should.be.equal(0);
            coords.row.should.be.equal(0);
        });

        it('computes the right column with strings with two letters', function() {
            var coords = convertStringToCoords('AA1');
            coords.col.should.be.equal(26);
            coords.row.should.be.equal(0);
        });

        it('computes the right row with strings bigger second coordnate', function() {
            var coords = convertStringToCoords('BD32');
            coords.col.should.be.equal(55);
            coords.row.should.be.equal(31);
        });
    });

})();
