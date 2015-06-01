/// <reference path="../ts-defs/angularjs/angular.d.ts" />
/// <reference path="../ts-defs/lodash/lodash.d.ts" />
/// <reference path="brickOptionsService.ts" />
/// <reference path="partSourceService.ts" />

module Services {
  export interface IBrickSrc {
    desc:string;
    url:string;
  }
    export interface INeededBrick {
        designId:number;
        color:number;
        description:string;
        qty:number;
        srcs:IBrickSrc[];
        placedBrick:IPlacedBrick;
    }

    export class BrickCalculationService {
         static $inject=['brickOptionsService', 'partSourceService'];

        constructor(public brickOptionsService:Services.BrickOptionService, public partSourceService:Services.PartSourceService) {

        }

        calculateBricks = ()=> {
            var brickMap = this.brickOptionsService.getCurrentOptions().brickList;
            var brickList = [];
          _.each(brickMap, (b:IPlacedBrick)=> {

            var neededBrick = _.find(brickList,{designId:b.designId, color:b.color.num});
            if (!neededBrick) {
              neededBrick = {
                placedBrick: b,
                designId:b.designId,
                color:b.color.num,
                description:b.color.color + ' ' + b.part.n1.toString(10) + 'x' + b.part.n2.toString(10),
                qty:0
              };
              brickList.push(neededBrick);
            }

            neededBrick.qty++;
          });

          _.each(brickList, (neededBrick:INeededBrick)=> {
            neededBrick.srcs = this.partSourceService.GetSourcesForBrick(neededBrick.placedBrick);
          });
          return brickList;
        }

    }
    angular.module('brickifyApp').service('brickCalculationService', BrickCalculationService);
}
