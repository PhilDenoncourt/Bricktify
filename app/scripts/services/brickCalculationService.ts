/// <reference path="../ts-defs/angularjs/angular.d.ts" />
/// <reference path="../ts-defs/lodash/lodash.d.ts" />
/// <reference path="brickOptionsService.ts" />
module Services {
    export interface INeededBrick {
        designId:number;
        color:number;
        description:string;
        qty:number;
    }

    export class BrickCalculationService {
         static $inject=['brickOptionsService'];

        constructor(public brickOptionsService:Services.BrickOptionService) {

        }

        calculateBricks = ()=> {
            var brickMap = this.brickOptionsService.getCurrentOptions().brickList;
            var brickList = [];
          _.each(brickMap, (b:IPlacedBrick)=> {

            var neededBrick = _.find(brickList,{designId:b.designId, color:b.color.num});
            if (!neededBrick) {
              neededBrick = {
                designId:b.designId,
                color:b.color.num,
                description:b.color.color + ' ' + b.part.n1.toString(10) + 'x' + b.part.n2.toString(10),
                qty:0
              };
              brickList.push(neededBrick);
            }

            neededBrick.qty++;
          });

          //TODO: Add brick sources
          return brickList;
        }

    }
    angular.module('brickifyApp').service('brickCalculationService', BrickCalculationService);
}
