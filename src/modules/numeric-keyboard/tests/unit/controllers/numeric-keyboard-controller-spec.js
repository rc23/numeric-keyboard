describe('numeric-keyboard-controller unit testing', function () {
    'use strict';

    var scope;
    var controller;
    var directive;

    function getController(_scope) {
        return controller('numericKeyboardController', {
            $scope: _scope
        });
    }

    beforeEach(function () {
        module('numeric-keyboard');

        inject(['$rootScope', '$controller', 'numericKeyboardDirective',
            function (_$rootScope, _$controller, _numericKeyboardDirective) {
                scope = _$rootScope;
                controller = _$controller;
                directive = _numericKeyboardDirective[0];
            }]);
    });

    describe('numeric-keyboard-controller testing', function () {
        it('should test the templateUrl', function () {
            controller = getController(scope);

            expect(directive.templateUrl)
                .toBe('KEYBOARD#modules/numeric-keyboard/source/views/numeric-keyboard.html');
        });

        it('should set the decimal separator (dot)', function () {
            scope.commaSeparator = undefined;
            controller = getController(scope);

            expect(controller.decimalSeparator).toBe('.');
        });

        it('should set the decimal separator (comma)', function () {
            scope.commaSeparator = ',';
            controller = getController(scope);

            expect(controller.decimalSeparator).toBe(',');
        });
    });
});
