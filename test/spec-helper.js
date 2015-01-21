Assertion.addMethod('equalAsSets', function (otherArray) {
    var array = this._obj;

    expect(array).to.be.an.instanceOf(Array);
    expect(otherArray).to.be.an.instanceOf(Array);

    var diff = array.filter(function(i) {return !(otherArray.indexOf(i) > -1);});

    this.assert(
        diff.length === 0,
        "expected #{this} to be equal to #{exp} (as sets, i.e. no order)",
        array,
        otherArray
    );
});

/**
 * Returns a list of tokens from a given string.
 */
function wordsIn(str) {
    return str.match(/\S+/g) || [];
}
