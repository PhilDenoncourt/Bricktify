/// <reference path="../ts-defs/angularjs/angular.d.ts" />
module Directives {
    export class bricktifiedImageDirective {
        public static factory(canvasContextService,$rootScope) {
            return {
                restrict: 'E',
                link: (scope, element, attrs) => {
                    var canvas = angular.element('<img></img>');
                    var canvasContainer = angular.element('<div class="brickImageContainer"></div>');
                    var zoomIcon = angular.element('<i class="brickZoomIcon fa fa-search fa-2x"></i>');
                    element.append(canvasContainer);
                    canvasContainer.append(canvas);
                    canvasContainer.append(zoomIcon);

                    canvasContextService.setContext(attrs.context, canvas);
                    canvas.css('height',"100%");
                    canvas.css('width',"100%");

                    canvas.click(function() {
                        $rootScope.$broadcast("brickImageClicked");
                    });
                }
            }
        }
    }
    angular.module('brickifyApp').directive('bricktifiedImage',['canvasContextService','$rootScope',bricktifiedImageDirective.factory]);
}
