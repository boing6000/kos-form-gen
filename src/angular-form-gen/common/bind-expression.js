fg.directive('fgBindExpression', function ($interpolate) {

  function buildWatchExpression(interpolateFn) {
    var sb = [];
    var parts = interpolateFn.expressions;
    var ii = parts.length;

    while (ii--) {
      var part = parts[ii];

      if (part && !part.match(/^\s*$/)) {
        sb.push(part);
      }
    }

    return '[' + sb.join() + ']';
  }

  return function (scope, element, attr) {

    var interpolateFn, watchHandle, oldWatchExpr;

    function cleanWatchHandle() {
      if (watchHandle) watchHandle();
      watchHandle = undefined;
    }

    function interpolateExpression() {
      element.text(interpolateFn(scope));
    }

    scope.$on('$destroy', function () {
      cleanWatchHandle();
    });

    scope.$watch(attr.fgBindExpression, function (value) {
      if (value !== undefined) {
        interpolateFn = $interpolate(value);

        element.addClass('ng-binding').data('$binding', interpolateFn);

        var watchExpr = buildWatchExpression(interpolateFn);

        if (oldWatchExpr !== watchExpr) {

          oldWatchExpr = watchExpr;

          cleanWatchHandle();

          watchHandle = scope.$watchCollection(watchExpr, function () {
            interpolateExpression();
          });
        } else {
          interpolateExpression();
        }
      }
    });
  };
});
