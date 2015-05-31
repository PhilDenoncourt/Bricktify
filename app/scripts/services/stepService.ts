/// <reference path="../ts-defs/angularjs/angular.d.ts" />
/// <reference path="../services/brickService.ts" />
/// <reference path="../services/brickOptionsService.ts" />

module Services {

  export class StepService {
    static $inject=['brickOptionsService'];

    constructor(public brickOptionsService:Services.BrickOptionService) {

    }

    public getStepText(stepNum:number) : string
    {
      var brickList = this.brickOptionsService.getCurrentOptions().brickList;
      if (!brickList) {
        return '';
      }

      if (stepNum > brickList.length) {
        return '';
      }

      var brickToDescribe = brickList[stepNum-1];

      var message = "On row " + (brickToDescribe.startX + 1) + ", column " + (brickToDescribe.startY + 1) + " place a ";
      message += brickToDescribe.color.color;
      message += ' ' + brickToDescribe.part.n1.toString(10) + 'x' + brickToDescribe.part.n2.toString(10);
      if (brickToDescribe.angle == 90) {
        message += " facing downwards";
      }
      return message;
    }

    public getAbbreviatedStepList():string[] {
      var brickList = this.brickOptionsService.getCurrentOptions().brickList;

      if (!brickList) {
        return [];
      }
        var rslt = [];
        _.each(brickList, (brick:IPlacedBrick,idx )=> {
            var step = 'Step ' + (idx + 1) + ": ";
            step += brick.color.color + ' ' + brick.part.n1.toString(10) + 'x' + brick.part.n2.toString(10);
            rslt.push(step);
        });

      return rslt;
    }
  }

  angular.module('brickifyApp').service('stepService', StepService);
}
