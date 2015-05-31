/// <reference path="../ts-defs/angularjs/angular.d.ts" />
/// <reference path="../ts-defs/lodash/lodash.d.ts" />
/// <reference path="../ts-defs/angularui/angular-ui-bootstrap.d.ts" />
/// <reference path="../services/brickCalculationService.ts" />
/// <reference path="../services/helpService.ts" />
/// <reference path="../services/brickOptionsService.ts" />
/// <reference path="../services/stepService.ts" />
/**
 * Created by Phil on 7/26/2014.
 */
'use strict';

module Controllers {


  export interface IMainController {
    needHelp:()=>void;
    currentDocument:Services.IBrickOptions;
  }

  export class MainCtrl implements IMainController {

    static $inject = ['helpService', 'brickOptionsService'];

    currentDocument:Services.IBrickOptions;

    constructor(public helpService:Services.HelpService,
                brickOptionsService:Services.BrickOptionService) {

     this.currentDocument = brickOptionsService.getCurrentOptions();


    }
    needHelp() {
      this.helpService.Start();
    }

  }
  angular.module('brickifyApp')
    .controller('MainCtrl', MainCtrl);
}

