angular.module('numeric-keyboard', ['ngTouch']);

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

angular.module('numeric-keyboard')
    .controller('dummyController', [
        function () {
            'use strict';

            var self = this;

            self.values = {
                a: 1,
                b: 2,
                c: 3
            };
        }]);

angular.module('numeric-keyboard')
    .controller('numericKeyboardController', ['$scope', 'numericKeyboardService',
        function ($scope, numericKeyboardService) {
            'use strict';

            var self = this;

            self.decimalSeparator =  $scope.commaSeparator ? ',' : '.'; // COMMA or DOT

            // CONFIG SERVICE
            numericKeyboardService.setDecimalSeparator(self.decimalSeparator);

            // Detection for touch devices
            self.isTouchDevice = function isTouchDevice() {
                return window['ontouchstart'] !== undefined ||
                    (navigator.maxTouchPoints > 0) ||
                    (navigator.msMaxTouchPoints > 0);
            };

            // API
            self.keyboardVisibility    = numericKeyboardService.isKeyboardVisible;
            self.toggleVisibility      = numericKeyboardService.toggleKeyboardVisibility;
            self.clickNumber           = numericKeyboardService.clickNumber;
            self.clickDecimalSeparator = numericKeyboardService.clickDecimalSeparator;
            self.clickConfirm          = numericKeyboardService.clickConfirm;
            self.clickDelete           = numericKeyboardService.clickDelete;
            self.startDelete           = numericKeyboardService.startDelete;
            self.stopDelete            = numericKeyboardService.stopDelete;
        }]);

angular.module('numeric-keyboard')
    .directive('numericKeyboard', function () {
        'use strict';

        return {
            restrict: 'E',
            scope: {
                commaSeparator: '=',
                confirmLabel  : '='
            },
            controller: 'numericKeyboardController',
            controllerAs: 'numericKeyboardCtrl',
            templateUrl: 'KEYBOARD#modules/numeric-keyboard/source/views/numeric-keyboard.html',
            link: function (scope, elem) {
                /*jslint unparam: true*/
                elem.on('touchmove', function (event) {
                    event.preventDefault();
                });
            }
        };
    });

angular.module('numeric-keyboard')
    .service('numericKeyboardService', ['$interval', function ($interval) {
        'use strict';

        var self = this;

        var visibility = false;

        var decimalSeparator = '.'; //DOT
        var keyInputCallback = angular.noop;
        var isFocusActiveCallback = angular.noop;
        var inputTarget = null;

        var intervalPromise;

        /**
         * @function isKeyboardVisible
         */
        function isKeyboardVisible() {
            return visibility;
        }

        /**
         * @function setKeyboardVisibility
         */
        function setKeyboardVisibility(value) {
            visibility = value;
        }

        /**
         * @function toggleKeyboardVisibility
         */
        function toggleKeyboardVisibility() {
            visibility = !visibility;
        }

        /**
         * @function setDecimalSeparator
         */
        function setDecimalSeparator(value) {
            decimalSeparator = value;
        }

        /**
         * @function getDecimalSeparator
         */
        function getDecimalSeparator() {
            return decimalSeparator;
        }

        /**
         * @function setKeyInputCallback
         */
        function setKeyInputCallback(callback) {
            keyInputCallback = angular.isFunction(callback) ? callback : angular.noop;
        }

        /**
         * @function setIsFocusActiveCallback
         */
        function setIsFocusActiveCallback(callback) {
            isFocusActiveCallback = angular.isFunction(callback) ? callback : angular.noop;
        }

        /**
         * @function clearInput
         */
        function clearInput() {
            if (inputTarget) {
                inputTarget.value = '';
                keyInputCallback();
            }
        }

        /**
         * @function addText
         */
        function addText(value) {
            if (inputTarget) {
                inputTarget.value += value;
                keyInputCallback();
            }
        }

        /**
         * @function removeText
         */
        function removeText() {
            if (inputTarget && angular.isString(inputTarget.value)) {
                var str = inputTarget.value;
                inputTarget.value = str.slice(0, -1);
                keyInputCallback();
            }
        }

        /**
         * @function startDelete
         */
        function startDelete() {
            removeText();
            intervalPromise = $interval(function () {
                removeText();
            }, 250);
        }

        /**
         * @function stopDelete
         */
        function stopDelete() {
            if (intervalPromise) {
                $interval.cancel(intervalPromise);
            }
        }

        /**
         * @function clickNumber
         */
        function clickNumber(value) {
            addText(value);
        }

        /**
         * @function clickDecimalSeparator
         */
        function clickDecimalSeparator() {
            addText(getDecimalSeparator());
        }

        /**
         * @function attachKeyboard
         */
        function attachKeyboard(element) {
            inputTarget = element;
        }

        /**
         * @function triggerBlur
         */
        function triggerBlur() {
            isFocusActiveCallback(false);
            //fire native events
            angular.element(inputTarget).triggerHandler('blur');
        }

        /**
         * @function clickConfirm
         */
        function clickConfirm() {
            setKeyboardVisibility(false);
            triggerBlur();
        }

        /**
         * @function attach
         */
        function attach(element, inputCallback, setFocusActive) {
            if (element !== inputTarget) {
                /* old input*/
                if (inputTarget) {
                    triggerBlur();
                }
                setKeyInputCallback(inputCallback);
                setIsFocusActiveCallback(setFocusActive);
                isFocusActiveCallback(true);
                attachKeyboard(element);
                clearInput();
            }
        }

        /**
         * @function detach
         */
        function detach() {

            if (inputTarget) {
                triggerBlur();
            }

            inputTarget = null;
            setKeyInputCallback(angular.noop);
            setIsFocusActiveCallback(angular.noop);
        }

        self.isKeyboardVisible = isKeyboardVisible;
        self.setKeyboardVisibility = setKeyboardVisibility;
        self.toggleKeyboardVisibility = toggleKeyboardVisibility;

        self.setDecimalSeparator = setDecimalSeparator;
        self.getDecimalSeparator = getDecimalSeparator;
        self.clickNumber = clickNumber;
        self.clickDelete = removeText;
        self.startDelete = startDelete;
        self.stopDelete = stopDelete;
        self.clickDecimalSeparator = clickDecimalSeparator;
        self.clickConfirm = clickConfirm;
        self.attach = attach;
        self.detach = detach;
        self.clearInput = clearInput;
    }]);

//Ignore unit tests helper to define Bind function
/* istanbul ignore next */
var setupBind = function () {
    'use strict';

    // polyfill for bind...
    if (!Function.prototype.bind) {
        Function.prototype.bind = function (oThis) {
            if (typeof this !== "function") {
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            }

            var aArgs = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                FNOP = angular.noop,
                fBound = function () {
                    return fToBind.apply(this instanceof FNOP && oThis
                            ? this
                            : oThis,
                        aArgs.concat(Array.prototype.slice.call(arguments)));
                };

            FNOP.prototype = this.prototype;
            fBound.prototype = new FNOP();

            return fBound;
        };
    }
};

angular.module('numeric-keyboard').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('KEYBOARD#modules/numeric-keyboard/source/views/numeric-keyboard.html',
    "<div class=\"numeric-keyboard\" ng-class=\"{'numeric-keyboard-open' : numericKeyboardCtrl.keyboardVisibility()}\"><div class=\"panel-left\"><div class=\"panel-row\"><div class=\"button-container panel-col1 numeric-input-1\" ng-click=\"numericKeyboardCtrl.clickNumber(1)\">1</div><div class=\"button-container numeric-input-2\" ng-click=\"numericKeyboardCtrl.clickNumber(2)\">2</div><div class=\"button-container numeric-input-3\" ng-click=\"numericKeyboardCtrl.clickNumber(3)\">3</div></div><div class=\"panel-row\"><div class=\"button-container panel-col1 numeric-input-4\" ng-click=\"numericKeyboardCtrl.clickNumber(4)\">4</div><div class=\"button-container numeric-input-5\" ng-click=\"numericKeyboardCtrl.clickNumber(5)\">5</div><div class=\"button-container numeric-input-6\" ng-click=\"numericKeyboardCtrl.clickNumber(6)\">6</div></div><div class=\"panel-row\"><div class=\"button-container panel-col1 numeric-input-7\" ng-click=\"numericKeyboardCtrl.clickNumber(7)\">7</div><div class=\"button-container numeric-input-8\" ng-click=\"numericKeyboardCtrl.clickNumber(8)\">8</div><div class=\"button-container numeric-input-9\" ng-click=\"numericKeyboardCtrl.clickNumber(9)\">9</div></div><div class=\"panel-row\"><div class=\"button-container-0 numeric-input-0\" ng-click=\"numericKeyboardCtrl.clickNumber(0)\">0</div><div class=\"button-container numeric-input-decimal-separator\" ng-click=\"numericKeyboardCtrl.clickDecimalSeparator()\">{{numericKeyboardCtrl.decimalSeparator}}</div></div></div><div class=\"panel-right\"><div class=\"panel-row\"><div class=\"button-container-clear numeric-input-clear\" ng-if=\"::!numericKeyboardCtrl.isTouchDevice()\" ng-click=\"numericKeyboardCtrl.clickDelete()\"><span class=\"keyboard\"></span></div><div class=\"button-container-clear numeric-input-clear\" ng-if=\"::numericKeyboardCtrl.isTouchDevice()\" touchstart=\"numericKeyboardCtrl.startDelete()\" touchend=\"numericKeyboardCtrl.stopDelete()\"><span class=\"keyboard\"></span></div></div><div class=\"panel-row\"><div class=\"button-container-confirm numeric-input-confirm\" ng-click=\"numericKeyboardCtrl.clickConfirm()\">{{confirmLabel ? confirmLabel : 'OK'}}</div></div></div></div>"
  );

}]);
