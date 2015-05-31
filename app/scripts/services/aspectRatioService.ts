/// <reference path="../ts-defs/angularjs/angular.d.ts" />
/// <reference path="../ts-defs/lodash/lodash.d.ts" />
/// <reference path="brickOptionsService.ts" />

module Services {
  export interface IAspectRatio {
    ratio:number;
    hasBeenUploaded;
    setRatio:(newVal)=>void;
  }

  export class AspectRatioService {
    static $inject=['brickOptionsService','defaultWidth','defaultHeight'];
    private currentAspectRatio:IAspectRatio;

    constructor(_brickOptionsService:Services.BrickOptionService,
                _defaultWidth:number,
                _defaultHeight:number) {
      var currentDocument=_brickOptionsService.getCurrentOptions();

      this.currentAspectRatio = {
        ratio: currentDocument.dimensions.height / currentDocument.dimensions.width,
        hasBeenUploaded: false,
        setRatio: (newVal)=> {
          if (newVal < 1) {
            currentDocument.dimensions.width = Math.round(_defaultWidth);
            currentDocument.dimensions.height = Math.round(newVal * _defaultWidth);
          }
          else {
           currentDocument.dimensions.width = Math.round(_defaultHeight * (1 / newVal));
           currentDocument.dimensions.height = Math.round(_defaultHeight);
          }
          this.currentAspectRatio.ratio = newVal;
        }
      };
    }

    public getCurrentAspectRatio() {
      return this.currentAspectRatio;
    }
  }

  angular.module('brickifyApp')
    .value('defaultWidth',44)
    .value('defaultHeight',34)
    .service('aspectRatioService', AspectRatioService);
}
