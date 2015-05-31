/// <reference path="../ts-defs/angularjs/angular.d.ts" />
/// <reference path="../ts-defs/lodash/lodash.d.ts" />
/// <reference path="../ts-defs/angularui/angular-ui-bootstrap.d.ts" />
/// <reference path="../services/brickOptionsService.ts" />
/// <reference path="../services/brickCalculationService.ts" />
/// <reference path="../services/stepService.ts" />

module Controllers {

  export interface IStepsController {
    stepNum:number;
    previousStep:()=>void;
    nextStep:()=>void;
    setStep :(idx:number)=>void;
    abbreviatedSteps:string[];
    stepDescription:string;
    currentDocument:Services.IBrickOptions;
  }

  export class stepsCtrl implements IStepsController {
    static $inject = ['$rootScope', 'stepService','brickOptionsService'];
    stepNum:number;
    abbreviatedSteps:string[];
    stepDescription:string;
    currentDocument:Services.IBrickOptions;

    constructor(_rootScope:ng.IRootScopeService, _stepService:Services.StepService,_brickOptionsService:Services.BrickOptionService) {

      this.currentDocument = _brickOptionsService.getCurrentOptions();
      _rootScope.$on('bricktified', ()=> {
        this.stepNum = 1;
        this.abbreviatedSteps = _stepService.getAbbreviatedStepList()
      });

      _rootScope.$watch(()=> {
        return this.stepNum;
      }, ()=> {
        if (this.stepNum) {
          this.stepDescription = _stepService.getStepText(this.stepNum);
        }
      });
    }

    nextStep() {
      this.stepNum++;
    }

    previousStep() {
      this.stepNum--;
    }

    setStep(step:number) {
      this.stepNum = step;
    }

  }
  angular.module('brickifyApp')
    .controller('StepsCtrl', stepsCtrl);
}
