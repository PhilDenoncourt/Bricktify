/// <reference path="../ts-defs/angularjs/angular.d.ts" />
/// <reference path="../ts-defs/lodash/lodash.d.ts" />
/// <reference path="../ts-defs/angularui/angular-ui-bootstrap.d.ts" />
/// <reference path="../services/brickOptionsService.ts" />
/// <reference path="../services/brickCalculationService.ts" />

module Controllers {

  export interface IPartsListController {
    print:()=>void;
    neededParts:Services.INeededBrick[];
  }

  export class partListCtrl implements IPartsListController {
    static $inject = ['$rootScope', 'brickCalculationService'];
    neededParts:Services.INeededBrick[];

    constructor(_rootScope:ng.IRootScopeService,
                _brickCalculationService:Services.BrickCalculationService) {

      this.neededParts = [];

      _rootScope.$on('bricktified', ()=> {
        this.neededParts = _brickCalculationService.calculateBricks();
      });
    }

    print() {
      window.print();
    }
  }
  angular.module('brickifyApp')
    .controller('PartsListCtrl', partListCtrl);
}
