(function() {
    'use strict';

    beforeEach(function() {
        $('#test').empty();
    });

    after(function() {
        $('#test').empty();
    });

    describe('Creating the spreadsheet table', function() {
        it('should create a table with the given dimensions', function() {
            var rows = 6, cols = 6, holder = $('#test');

            createSpreadsheet(holder, rows, cols);

            var rowCount = holder.find('table tr').length;
            var colsCount = holder.find('table tr:first td').length;

            // adding 1s for the extra top and left rows
            rowCount.should.be.equal(rows + 1);
            colsCount.should.be.equal(cols + 1);
        });

        it('should create an empty table', function() {
            var rows = 20, cols = 10, holder = $('#test');

            createSpreadsheet(holder, rows, cols);

            var values = holder.find('tr:not(:first) td').map(function() {
                return this.value;
            });

            values.should.all.be.empty;
        });

        // TODO Add tests for top "labeling" row and first "numbering" column
    });
})();
