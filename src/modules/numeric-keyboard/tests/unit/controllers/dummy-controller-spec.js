describe('dummy-controller unit testing', function () {
    'use strict';

    var scope;
    var controller;

    function getController(_scope) {
        return controller('dummyController', {
            $scope: _scope
        });
    }

    beforeEach(function () {
        module('numeric-keyboard');

        inject(['$rootScope', '$controller',
            function (_$rootScope, _$controller) {
                scope = _$rootScope;
                controller = _$controller;
            }]);
    });

    describe('dummy-controller testing', function () {
        it('should set the values', function () {
            controller = getController(scope);

            expect(controller.values).toEqual({ a: 1, b: 2, c: 3 });
        });
    });
});
