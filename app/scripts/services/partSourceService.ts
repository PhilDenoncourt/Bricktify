/// <reference path="../ts-defs/angularjs/angular.d.ts" />
/// <reference path="../ts-defs/lodash/lodash.d.ts" />
/// <reference path="brickCalculationService.ts" />
/// <reference path="brickOptionsService.ts" />

module Services {
  export interface IPartSource {
    GetSourcesForBrick: (brick:IPlacedBrick)=>IBrickSrc[];
  }
  export class PartSourceService {
    static $inject=['brickLinkPartProvider'];
    constructor(public brickLinkPartProvider:IPartSource) {

    }
    GetSourcesForBrick(brick:IPlacedBrick):IBrickSrc[] {
      var rslt=[];

      Array.prototype.push.apply(rslt, this.brickLinkPartProvider.GetSourcesForBrick(brick));

      return rslt;
    }
  }

  angular.module('brickifyApp').service('partSourceService', PartSourceService);
}
