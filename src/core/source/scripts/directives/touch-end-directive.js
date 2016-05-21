angular.module('numeric-keyboard')
    .directive('touchend', ['$parse', function ($parse) {
        'use strict';

        return {
            link: function ($scope, $element, $attrs) {
                var callback = $parse($attrs.touchend);

                function onTouchEnd(event) {
                    $scope.$event = event;
                    $scope.$apply(callback);
                }

                function onDestroy() {
                    $element.off('touchend', onTouchEnd);
                    $scope.event = null;
                }

                $element.on('touchend', onTouchEnd);
                $element.on('$destroy', onDestroy);
            }
        };
    }]);
