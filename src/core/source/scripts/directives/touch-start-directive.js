angular.module('numeric-keyboard')
    .directive('touchstart', ['$parse', function ($parse) {
        'use strict';

        return {
            link: function ($scope, $element, $attrs) {
                var callback = $parse($attrs.touchstart);

                function onTouchStart(event) {
                    $scope.$event = event;
                    $scope.$apply(callback);
                }

                function onDestroy() {
                    $element.off('touchstart', onTouchStart);
                    $scope.event = null;
                }

                $element.on('touchstart', onTouchStart);
                $element.on('$destroy', onDestroy);
            }
        };
    }]);
