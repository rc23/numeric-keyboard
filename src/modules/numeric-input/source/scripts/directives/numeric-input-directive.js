angular.module('numeric-keyboard')
    .directive('numericInput', ['$timeout', 'numericKeyboardService',
        function ($timeout, numericKeyboardService) {
            'use strict';

            function linkFn(scope, elem, attrs, ngModelCtrl) {
                if (!ngModelCtrl) {
                    return;
                }

                var keyboardActive = scope.$eval(attrs.numericInput);
                if (!angular.isDefined(keyboardActive) || !keyboardActive) {
                    return;
                }

                elem.addClass('numeric-input');

                var focusOverlayHtml = '<div class="numeric-input-overlay">' +
                    '<span class="numeric-input-overlay-value"><\/span>' +
                    '<div class="cursor"><\/div>' +
                    '<\/div>';

                var focusOverlayElem = angular.element(focusOverlayHtml);

                elem.wrap('<div class="numeric-input-overlay-wrapper"><\/div>');
                elem.after(focusOverlayElem);

                focusOverlayElem.bind('click', function (event) {

                    event.preventDefault();
                    event.stopPropagation();

                    if (attrs.disabled) {
                        return;
                    }

                    numericKeyboardService.clearInput();

                    numericKeyboardService.attach(
                        elem[0],
                        function () {
                            $timeout(function () {
                                ngModelCtrl.$setViewValue(elem[0].value);
                            });
                        },
                        function (isFocusActive) {
                            if (isFocusActive) {
                                focusOverlayElem.addClass('numeric-input-overlay-active');
                                $timeout(function () {
                                    focusOverlayElem[0].scrollIntoView();
                                }, 200);
                            } else {
                                focusOverlayElem.removeClass('numeric-input-overlay-active');
                            }
                        }
                    );

                    if (!numericKeyboardService.isKeyboardVisible()) {
                        numericKeyboardService.setKeyboardVisibility(true);
                        scope.$apply();
                    }
                });

                scope.$watch(
                    function () {
                        return attrs.disabled;
                    },
                    function (value) {
                        if (!!value) {
                            numericKeyboardService.setKeyboardVisibility(false);
                            numericKeyboardService.detach();
                        }
                    }
                );

            }

            return {
                restrict: 'A',
                require: '?ngModel',
                scope: {},
                link: linkFn
            };
        }]);
