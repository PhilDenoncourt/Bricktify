/// <reference path="../ts-defs/angularjs/angular.d.ts" />

module Controllers {
    export interface IShowBrickImageCtrl extends ng.IScope {

    }
    export class ShowBrickImageCtrl {
        static $inject=['$scope'];

        constructor(public $scope:IShowBrickImageCtrl) {

        }
    }


    angular.module('brickifyApp')
        .controller('showBrickImage', ShowBrickImageCtrl);
}
