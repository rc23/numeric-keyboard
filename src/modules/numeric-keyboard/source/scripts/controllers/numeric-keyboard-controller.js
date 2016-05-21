angular.module('numeric-keyboard')
    .controller('numericKeyboardController', ['$scope', 'numericKeyboardService',
        function ($scope, numericKeyboardService) {
            'use strict';

            var self = this;

            self.decimalSeparator =  $scope.commaSeparator ? ',' : '.'; // COMMA or DOT

            //CONFIG SERVICE
            numericKeyboardService.setDecimalSeparator(self.decimalSeparator);

            //API
            self.keyboardVisibility    = numericKeyboardService.isKeyboardVisible;
            self.toggleVisibility      = numericKeyboardService.toggleKeyboardVisibility;
            self.clickNumber           = numericKeyboardService.clickNumber;
            self.clickDecimalSeparator = numericKeyboardService.clickDecimalSeparator;
            self.clickConfirm          = numericKeyboardService.clickConfirm;
            self.clickDelete           = numericKeyboardService.clickDelete;
            self.startDelete           = numericKeyboardService.startDelete;
            self.stopDelete            = numericKeyboardService.stopDelete;
        }]);
