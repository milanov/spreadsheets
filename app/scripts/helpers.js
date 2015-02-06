function clearFormula(formula) {
    'use strict';

    return formula.replace(/\$/g, '');
}

function spreadsheetColumnLabelToIndex(chr) {
    'use strict';

    chr = clearFormula(chr);
    var base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        i, j, result = 0;
    for (i = 0, j = chr.length - 1; i < chr.length; i += 1, j -= 1) {
        result += Math.pow(base.length, j) * (base.indexOf(chr[i]) + 1);
    }
    if (result) {
        --result;
    }
    return result;
}

function getCellAlphaNum(cell) {
    'use strict';

    var num = cell.match(/\d+$/),
        alpha = cell.replace(num, '');
    return {
        alpha: alpha,
        num: parseInt(num[0], 10)
    };
}

function convertStringToCoords(cell) {
    'use strict';

    var coords = getCellAlphaNum(cell);

    return {
        row: coords.num - 1,
        col: spreadsheetColumnLabelToIndex(coords.alpha)
    };
}

function isFormula(literal) {
    'use strict';

    return literal && literal[0] === '=';
}

function wordsIn(str) {
    return str.match(/\S+/g) || [];
}