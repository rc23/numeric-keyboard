describe('numeric-keyboard-directive unit testing', function () {
    'use strict';

    var directive;

    beforeEach(function () {
        module('numeric-keyboard');

        inject(['numericKeyboardDirective', function (numericKeyboardDirective) {
            directive = numericKeyboardDirective[0];
        }]);
    });

    describe('numeric-keyboard-directive testing', function () {
        it('should test the templateUrl', function () {
            expect(directive.templateUrl)
                .toBe('KEYBOARD#modules/numeric-keyboard/source/views/numeric-keyboard.html');
        });
    });
});
