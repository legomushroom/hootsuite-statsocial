"use strict"

;(function (undefined) {

  var throttle = function throttle(fn, threshhold, scope) {
    threshhold || (threshhold = 250);
    var last, deferTimer;
    return function () {
      var context = scope || this;

      var now = +new Date,
          args = arguments;
      if (last && now < last + threshhold) {
        // hold on to it
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function () {
          last = now;
          fn.apply(context, args);
        }, threshhold);
      } else {
        last = now;
        fn.apply(context, args);
      }
    };
  }

  var togglePoint = function togglePoint ( width, point ) {
    var className = 'hst-at-less-' + point,
        method    = ( width < point ) ? 'add' : 'remove';
    classList[method](className);
  }

  var reportEl  = document.querySelector('#js-report'),
      classList = document.documentElement.classList,
      points    = [ 1040, 860, 600, 400, 370 ];

  reportEl.addEventListener('onresize', throttle(function (e) {
    var width = parseInt(reportEl.offsetWidth, 10), i;
    for (i = 0; i < points.length; i++) { togglePoint( width, points[i] ); }
  }));

})();