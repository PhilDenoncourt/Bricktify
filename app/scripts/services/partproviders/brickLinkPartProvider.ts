/// <reference path="../../ts-defs/angularjs/angular.d.ts" />
/// <reference path="../../ts-defs/lodash/lodash.d.ts" />
/// <reference path="../brickCalculationService.ts" />
/// <reference path="../brickOptionsService.ts" />
/// <reference path="../partSourceService.ts" />

module Services {

  export class BrickLinkPartProvider implements IPartSource {
    GetSourcesForBrick(brick:IPlacedBrick):IBrickSrc[] {
      return [{
        desc:'Bricklink',
        url:'http://www.bricklink.com/search.asp?viewFrom=sa&colorID=' + brick.color.BricklinkId + '&q=' + brick.part.designId +'&searchSort=P&sz=25'
      }];
    }
  }

  angular.module('brickifyApp').service('brickLinkPartProvider', BrickLinkPartProvider);
}
