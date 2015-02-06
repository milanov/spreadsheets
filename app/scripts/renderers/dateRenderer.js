/**
 * Date cell renderer
 * @param {Object} instance Handsontable instance
 * @param {Element} TD Table cell where to render
 * @param {Number} row
 * @param {Number} col
 * @param {String|Number} prop Row object property name
 * @param value Value to render (remember to escape unsafe HTML before inserting to DOM!)
 * @param {Object} cellProperties Cell properties (shared by cell renderer and editor)
 */
(function (Handsontable) {
  'use strict';

  var DateRenderer = function (instance, TD, row, col, prop, value, cellProperties) {
    if (moment(value).isValid()) {
      if (typeof cellProperties.language !== 'undefined') {
        moment.locale(cellProperties.language);
      }
      value = moment(value).format(cellProperties.format); //docs: http://momentjs.com/
    }

    Handsontable.renderers.TextRenderer(instance, TD, row, col, prop, value, cellProperties);
  };

  Handsontable.renderers.DateRenderer = DateRenderer;
  Handsontable.renderers.registerRenderer('date', DateRenderer);

})(Handsontable);
