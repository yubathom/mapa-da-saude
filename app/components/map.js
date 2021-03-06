var m = require('mithril');
var c = require('config');
var _ = require('underscore');

var homeVM   = require('models/homeVM');
var Hospital = require('models/hospital');

var EM = 12; // main.styl -> font-size: 12px

var map = {
  el: null,

  controller: function() {
    events.subscribe('changeIndicator', map.onChangeIndicator);
    events.subscribe('changeActiveMark', map.setActiveMark);
  },

  view: function(ctrl) {
    return m('#map', {config: map.drawMap})
  },

  drawMap: function(element, isInitialized) {
    if (isInitialized) return;

    L.mapbox.accessToken = c.getMapboxToken();
    map.el = L.mapbox.map('map', 'mapbox.emerald').setZoom(12);

    map.loadData();
  },

  loadData: function() {
    Hospital.each(function(hosp) {
      if (hosp.id) {
        map.buildMarker(hosp)
          .on('click', function() { map.setActiveMark(hosp); })
          .addTo(map.el);

      } else {
        console.error("hospital must have an ID");
      }

    }).then(function(hospitais) {
      // set any point to start (12 is a point found manually, just to look good =P)
      map.el.setView(hospitais[12].pos);
    });
  },

  buildMarker: function(hosp) {
    return L.marker(hosp.pos, {
      icon: L.divIcon({
        className: [ 'circle-marker', hosp.elementID, map.indicatorClass(hosp) ].join(' '),
        iconSize: 2 * EM,
        html: '<span class="inner-content">' + Hospital.indicatorValue(hosp) + '</span>'
      }),
      title: hosp.name,
    });
  },

  setActiveMark: function(hosp) {
    map.resetMarks();

    // set style for active mark
    var markEl = document.getElementsByClassName(hosp.elementID)[0];
    if (markEl) {
      markEl.className += ' circle-marker-active';
      Velocity(markEl.children[0], 'fadeIn', {display: 'inline-block'});  // show inner content
    }

    homeVM.activeMark(hosp);
    map.el.setView(hosp.pos);

    m.redraw(true);
  },

  resetMarks: function() {
    _.each(document.getElementsByClassName('circle-marker-active'), function(el) {
      el.className = el.className.replace('circle-marker-active', '');
      el.children[0].style.display = 'none';  // hide inner-content
    });
  },

  resize: function() {
    map.el.invalidateSize(true);
  },

  indicatorClass: function(hosp) {
    return 'indicator-' + Hospital.indicatorColor(hosp);
  },

  onChangeIndicator: function() {
    Hospital.each(function(hosp) {
      var el = document.getElementsByClassName(hosp.elementID)[0];

      // reset color to new indicator
      el.className = el.className.replace(/indicator-(red|green|yellow)/g, map.indicatorClass(hosp));

      // set value to new indicator
      el.children[0].textContent = Hospital.indicatorValue(hosp);
    });
  },
};

module.exports = map;
