/// <reference path="../ts-defs/angularjs/angular.d.ts" />
/// <reference path="../services/helpservice.ts" />
module Directives {

    export class HelpDirective {
        public static factory(helpService:Services.HelpService) {
            return {
                restrict:'A',
              link: (scope, element)=> {
                helpService.RegisterElement(element);
                }
            }
        }
    }
    angular.module('brickifyApp').directive('help',['helpService',HelpDirective.factory]);
}
