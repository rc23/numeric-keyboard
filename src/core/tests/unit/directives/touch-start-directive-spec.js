describe('touchstart unit testing', function () {
    'use strict';

    beforeEach(function () {
        module('numeric-keyboard');
    });

    function compileElement() {
        var element = angular.element('<div touchstart="started = true"></div>');
        inject(function ($rootScope, $compile) {
            $compile(element)($rootScope.$new());
        });
        return element;
    }

    describe('touchstart testing', function () {
        it('should be called on touchstart', function () {
            var element = compileElement();
            var scope = element.scope();
            expect(scope.started).toBeUndefined();
            element.triggerHandler('touchstart');
            expect(scope.started).toEqual(true);
        });
        it('should de-register event listener on $destroy', function () {
            var element = compileElement();
            var scope = element.scope();
            element.triggerHandler('$destroy');
            element.triggerHandler('touchstart');
            expect(scope.started).toBeUndefined();
        });
    });
});
