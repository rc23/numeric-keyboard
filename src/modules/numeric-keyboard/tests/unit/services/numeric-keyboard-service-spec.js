describe('numeric-keyboard-service unit testing', function () {
    'use strict';

    var $scope;
    var $scope2;
    var $compile;
    var $interval;
    var numericKeyboardService;
    var element;
    var element2;
    var ctrl;
    var ctrl2;
    var inputCallbackCounter;
    var setFocusActiveCounter;

    beforeEach(function () {

        inputCallbackCounter  = 0;
        setFocusActiveCounter = 0;

        module('numeric-keyboard');

        inject(['$rootScope', '$compile', '$interval', 'numericKeyboardService',
            function (_$rootScope, _$compile, _$interval, _numericKeyboardService) {
                $scope  = _$rootScope.$new();
                $scope2 = _$rootScope.$new();
                $compile = _$compile;
                $interval = _$interval;
                numericKeyboardService = _numericKeyboardService;

                $scope.data = {value: ''};
                element = angular.element('<input type="text" ng-model="data.value" numeric-input />');
                $compile(element)($scope);
                $scope.$digest();

                ctrl = element.data('$ngModelController');

                $scope2.data2 = {value: ''};
                element2 = angular.element('<input type="text" ng-model="data2.value" numeric-input />');
                $compile(element2)($scope2);
                $scope2.$digest();
                ctrl2 = element.data('$ngModelController');

                spyOn($interval, 'cancel');
            }]);
    });

    function setViewValue(ctr, s, value) {
        ctr.$setViewValue(value);
        s.$evalAsync();
    }

    function dummyInputCallback1(value) {
        inputCallbackCounter++;
        setViewValue(ctrl, $scope, value);
    }

    function dummyInputCallback2(value) {
        inputCallbackCounter++;
        setViewValue(ctrl2, $scope2, value);
    }

    function dummySetFocusActive() {
        setFocusActiveCounter++;
    }

    function clickNumberAndValidate(element, value, result) {
        numericKeyboardService.clickNumber(value);
        expect(element.val()).toBe(result);
    }

    function clickDeleteAndValidate(element, result) {
        numericKeyboardService.clickDelete();
        expect(element.val()).toBe(result);
    }

    describe('numeric-keyboard-service testing', function () {
        it('should test the setKeyboardVisibility function', function () {
            expect(numericKeyboardService.isKeyboardVisible()).toBe(false);
            numericKeyboardService.setKeyboardVisibility(true);
            expect(numericKeyboardService.isKeyboardVisible()).toBe(true);
        });

        it('should test the toggleKeyboardVisibility function', function () {
            expect(numericKeyboardService.isKeyboardVisible()).toBe(false);
            numericKeyboardService.toggleKeyboardVisibility();
            expect(numericKeyboardService.isKeyboardVisible()).toBe(true);
            numericKeyboardService.toggleKeyboardVisibility();
            expect(numericKeyboardService.isKeyboardVisible()).toBe(false);
        });

        it('should test the setDecimalSeparator function', function () {
            numericKeyboardService.setDecimalSeparator(',');
            expect(numericKeyboardService.getDecimalSeparator()).toBe(',');
        });

        it('should test the clickConfirm function', function () {
            numericKeyboardService.clickConfirm();
            expect(numericKeyboardService.isKeyboardVisible()).toBe(false);
        });

        it('should test the clickNumber, clickDecimalSeparator and clickDelete function', function () {
            numericKeyboardService.attach(element[0], dummyInputCallback1, dummySetFocusActive);
            clickNumberAndValidate(element, '1', '1');
            numericKeyboardService.clickDecimalSeparator();
            expect(element.val()).toBe('1.');
            clickNumberAndValidate(element, '2', '1.2');
            clickDeleteAndValidate(element, '1.');
        });

        it('should test the clickNumber and clickDelete edge cases', function () {
            numericKeyboardService.clickNumber('1');
            expect(inputCallbackCounter).toBe(0);
            numericKeyboardService.clickDelete();
            expect(inputCallbackCounter).toBe(0);
        });

        it('should test the startDelete and stopDelete function', function () {
            numericKeyboardService.stopDelete();
            expect($interval.cancel).not.toHaveBeenCalled();

            numericKeyboardService.attach(element[0], dummyInputCallback1, dummySetFocusActive);
            clickNumberAndValidate(element, '1', '1');
            clickNumberAndValidate(element, '2', '12');
            clickNumberAndValidate(element, '3', '123');
            clickNumberAndValidate(element, '4', '1234');

            numericKeyboardService.startDelete();
            expect(element.val()).toBe('123');

            $interval.flush(500);

            expect(element.val()).toBe('1');

            numericKeyboardService.stopDelete();
            expect($interval.cancel).toHaveBeenCalled();
        });

        it('should test the attach function when changing the input keyboard', function () {
            numericKeyboardService.attach(element[0], dummyInputCallback1, dummySetFocusActive);
            clickNumberAndValidate(element, '1', '1');

            numericKeyboardService.attach(element2[0], dummyInputCallback2, dummySetFocusActive);
            clickNumberAndValidate(element2, '2', '2');

            //Nothing changed in the first element
            expect(element.val()).toBe('1');
        });

        it('should test the attach function when trying to attach the same element', function () {
            numericKeyboardService.attach(element[0], dummyInputCallback1, dummySetFocusActive);
            expect(setFocusActiveCounter).toBe(1);
            numericKeyboardService.attach(element2[0], dummyInputCallback2, dummySetFocusActive);
            expect(setFocusActiveCounter).toBe(3);
            numericKeyboardService.attach(element2[0], dummyInputCallback2, dummySetFocusActive);
            expect(setFocusActiveCounter).toBe(3);
        });

        it('should test the attach function when trying to attach the same element', function () {
            numericKeyboardService.attach(element[0]);
            expect(ctrl.$viewValue).toBe('');
            numericKeyboardService.clickNumber('1');
            expect(ctrl.$viewValue).toBe('');
        });

        it('should test the attach function when trying to attach an undefined element', function () {
            numericKeyboardService.attach(undefined, dummyInputCallback1, dummySetFocusActive);
            expect(inputCallbackCounter).toBe(0);
            numericKeyboardService.attach(element[0], dummyInputCallback1, dummySetFocusActive);
            expect(inputCallbackCounter).toBe(1);
        });


        it('should test the detach keyboard', function () {
            numericKeyboardService.attach(element[0], dummyInputCallback1, dummySetFocusActive);
            clickNumberAndValidate(element, '1', '1');
            expect(inputCallbackCounter).toBe(2);
            numericKeyboardService.detach();

            //no inputCall should be called
            clickNumberAndValidate(element, '1', '1');
            expect(inputCallbackCounter).toBe(2);
        });

        it('should test the detach function when trying to detach an undefined element', function () {
            numericKeyboardService.attach(undefined, dummyInputCallback1, dummySetFocusActive);
            expect(inputCallbackCounter).toBe(0);
            numericKeyboardService.detach();
            expect(inputCallbackCounter).toBe(0);

        });
    });
});
