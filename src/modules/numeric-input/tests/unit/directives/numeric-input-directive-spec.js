describe('numeric-input-directive unit testing', function () {
    'use strict';

    var directive;
    var service;

    var timeout;

    var scope;
    var attrs = {};
    var ngModelCtrl = {};
    var elem;

    var focusOverlayElem;

    var callback1;
    var callback2;

    beforeEach(function () {
        module('numeric-keyboard');

        inject([
            'numericInputDirective',
            'numericKeyboardService',
            '$rootScope',
            '$timeout',
            function (
                numericInputDirective,
                numericKeyboardService,
                $rootScope,
                $timeout
            ) {
                directive = numericInputDirective[0];
                service   = numericKeyboardService;
                scope     = $rootScope.$new();
                timeout   = $timeout;

                spyOn(service, 'attach');
                spyOn(service, 'detach');
                spyOn(service, 'isKeyboardVisible');
                spyOn(service, 'setKeyboardVisibility');

                elem = angular.element('<input type="text" ng-model="1" numeric-input />');

                elem.after = function (value) {
                    focusOverlayElem = value;
                };
            }]);
    });

    afterEach(function () {
        attrs = {};
        focusOverlayElem = undefined;
    });

    describe('numeric-input-directive testing', function () {
        it('should test the linkFn without ngModelCtrl', function () {
            directive.link();

            expect(service.attach).not.toHaveBeenCalled();
        });

        it('should test the linkFn with ngModelCtrl', function () {
            attrs.numericInput = "true";
            service.isKeyboardVisible.and.returnValue(false);

            directive.link(scope, elem, attrs, ngModelCtrl);

            expect(service.attach).not.toHaveBeenCalled();

            focusOverlayElem.triggerHandler('click');
            expect(service.attach).toHaveBeenCalledWith(elem[0], jasmine.any(Function), jasmine.any(Function));

            expect(service.setKeyboardVisibility).toHaveBeenCalledWith(true);
        });

        it('should test the case where the keyboard is already visible', function () {
            attrs.numericInput = "true";
            service.isKeyboardVisible.and.returnValue(true);

            directive.link(scope, elem, attrs, ngModelCtrl);

            expect(service.attach).not.toHaveBeenCalled();

            focusOverlayElem.triggerHandler('click');
            expect(service.attach).toHaveBeenCalledWith(elem[0], jasmine.any(Function), jasmine.any(Function));

            expect(service.setKeyboardVisibility).not.toHaveBeenCalled();
        });

        it('should test the linkFn without assign the keyboard', function () {
            attrs.numericInput = "false";

            service.isKeyboardVisible.and.returnValue(false);

            directive.link(scope, elem, attrs, ngModelCtrl);

            expect(focusOverlayElem).toBeUndefined();

            expect(service.attach).not.toHaveBeenCalled();
        });

        it('should not attach keyboard if the element is disable', function () {
            attrs.numericInput = "true";
            attrs.disabled = true;
            service.isKeyboardVisible.and.returnValue(true);

            directive.link(scope, elem, attrs, ngModelCtrl);

            expect(service.attach).not.toHaveBeenCalled();

            focusOverlayElem.triggerHandler('click');
            expect(service.attach).not.toHaveBeenCalled();
        });
    });

    describe('numeric-input-directive testing', function () {
        beforeEach(function () {
            /*jslint unparam: true*/
            service.attach.and.callFake(function (elem, fn1, fn2) {
                callback1 = fn1;
                callback2 = fn2;
            });
            /*jslint unparam: false*/
        });

        it('should test the FIRST callback function', function () {
            var ngModel = jasmine.createSpyObj('ngModelCtrl', ['$setViewValue']);

            attrs.numericInput = "true";

            directive.link(scope, elem, attrs, ngModel);

            expect(service.attach).not.toHaveBeenCalled();

            focusOverlayElem.triggerHandler('click');
            expect(service.attach).toHaveBeenCalledWith(elem[0], jasmine.any(Function), jasmine.any(Function));

            callback1();

            timeout.flush();

            expect(ngModel.$setViewValue).toHaveBeenCalled();
        });

        it('should test the SECOND callback function with isFocusActive === true', function () {
            attrs.numericInput = "true";
            directive.link(scope, elem, attrs, ngModelCtrl);

            expect(service.attach).not.toHaveBeenCalled();

            focusOverlayElem.triggerHandler('click');
            expect(service.attach).toHaveBeenCalledWith(elem[0], jasmine.any(Function), jasmine.any(Function));

            callback2(true);
            timeout.flush();

            expect(focusOverlayElem.hasClass('numeric-input-overlay-active')).toBe(true);
        });

        it('should test the SECOND callback function with isFocusActive === false', function () {
            attrs.numericInput = "true";
            directive.link(scope, elem, attrs, ngModelCtrl);

            expect(service.attach).not.toHaveBeenCalled();

            focusOverlayElem.triggerHandler('click');
            expect(service.attach).toHaveBeenCalledWith(elem[0], jasmine.any(Function), jasmine.any(Function));

            callback2(false);
            expect(focusOverlayElem.hasClass('numeric-input-overlay-active')).toBe(false);
        });

        it('should call detach keyboard if the input is disabled', function () {
            attrs.numericInput = "true";
            attrs.disabled = true;
            directive.link(scope, elem, attrs, ngModelCtrl);
            scope.$digest();

            expect(service.detach).toHaveBeenCalled();
        });
    });
});
