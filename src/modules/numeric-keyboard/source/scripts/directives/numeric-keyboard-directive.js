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
