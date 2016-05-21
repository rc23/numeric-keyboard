describe('touchend unit testing', function () {
    'use strict';

    beforeEach(function () {
        module('numeric-keyboard');
    });

    function compileElement() {
        var element = angular.element('<div touchend="ended = true"></div>');
        inject(function ($rootScope, $compile) {
            $compile(element)($rootScope.$new());
        });
        return element;
    }

    describe('touchend testing', function () {
        it('should be called on touchend', function () {
            var element = compileElement();
            var scope = element.scope();
            expect(scope.ended).toBeUndefined();
            element.triggerHandler('touchstart');
            expect(scope.ended).toBeUndefined();
            element.triggerHandler('touchend');
            expect(scope.ended).toEqual(true);
        });
        it('should de-register event listener on $destroy', function () {
            var element = compileElement();
            var scope = element.scope();
            element.triggerHandler('$destroy');
            element.triggerHandler('touchend');
            expect(scope.ended).toBeUndefined();
        });
    });
});
