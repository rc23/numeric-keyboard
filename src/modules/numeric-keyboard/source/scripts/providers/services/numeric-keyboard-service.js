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
