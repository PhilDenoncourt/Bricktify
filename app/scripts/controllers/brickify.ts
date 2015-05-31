/// <reference path="../ts-defs/angularjs/angular.d.ts" />
/// <reference path="../ts-defs/lodash/lodash.d.ts" />
/// <reference path="../ts-defs/angularui/angular-ui-bootstrap.d.ts" />
/// <reference path="../services/aspectRatioService.ts" />
/// <reference path="../services/brickOptionsService.ts" />
/// <reference path="../services/brickCalculationService.ts" />
/// <reference path="../services/bricktifyService.ts" />
/// <reference path="../services/brickService.ts" />
module Controllers {


  export interface IBrickifyScope {
    currentDocument:Services.IBrickOptions;

    brickColors:Services.IColor[];

    keepAspectRatio:boolean;
    aspectRatio:Services.IAspectRatio;

    toggleFilterColors:()=>void;
    showFilterColors:boolean;

    toggleBorder:()=>void;
    showBorder:boolean;


    bricktify:()=>void;
    throttledBricktify:()=>void;
  }

  export class bricktifyCtrl implements IBrickifyScope {
    static $inject = ['$rootScope', 'bricktifyService', /*'$modal',*/'brickOptionsService', 'aspectRatioService', 'brickService'];

    currentDocument:Services.IBrickOptions;
    brickColors:Services.IColor[];
    keepAspectRatio:boolean;
    aspectRatio:Services.IAspectRatio;

    showFilterColors:boolean;
    showBorder:boolean;
    throttledBricktify:()=>void;

    constructor(public _rootScope:ng.IRootScopeService,
                public _bricktifyService:Services.BricktifyService,
                //_modal:ng.ui.bootstrap.IModalService,
                _brickOptionsService:Services.BrickOptionService,
                _aspectRatioService:Services.AspectRatioService,
                _brickService:Services.BrickService) {
      this.brickColors = _brickService.getAllColors();
      this.currentDocument = _brickOptionsService.getCurrentOptions();

      this.showFilterColors = false;
      this.showBorder = false;

      this.keepAspectRatio = true;
      this.aspectRatio = _aspectRatioService.getCurrentAspectRatio();


      this.throttledBricktify = _.throttle(this.bricktify, 1000, {trailing: true});

      /*_scope.$on("brickImageClicked", ()=> {
       _modal.open({
       controller: 'showBrickImage',
       templateUrl: '../views/showLegoImage.html',
       });
       });*/

      _rootScope.$watch(()=> {
        return this.currentDocument.dimensions.width;
      }, ()=> {
        this.imgSizeChanged();
      });

      _rootScope.$watch(()=> {
        return this.currentDocument.dimensions.height;
      }, ()=> {
        this.imgSizeChanged();
      });

      _rootScope.$watch(()=> {
          return this.currentDocument.addBorder;
        }
        , ()=> {
          this.bricktifyIfAlreadyDone();
        });
      _rootScope.$watch(()=> {
          return this.currentDocument.selectedBorder;
        }
        , ()=> {
          if (this.currentDocument.brickList && this.currentDocument.addBorder) {
            this.throttledBricktify();
          }
        });
      _rootScope.$watch(()=> {
          return this.currentDocument.filterColors;
        }
        , ()=> {
          this.bricktifyIfAlreadyDone();
        },
        true);
    }

    imgSizeChanged() {
      if (this.keepAspectRatio) {
        this.currentDocument.dimensions.height = Math.floor(this.currentDocument.dimensions.width * this.aspectRatio.ratio);
      } else {
        this.aspectRatio.ratio = this.currentDocument.dimensions.height / this.currentDocument.dimensions.width;
      }
      if (this.currentDocument.brickList) {
        this.throttledBricktify();
      }
    }

    bricktifyIfAlreadyDone() {
      if (this.currentDocument.brickList) {
        this.throttledBricktify();
      }
    }

    toggleFilterColors() {
      this.showFilterColors = !this.showFilterColors;
    }

    toggleBorder() {
      this.showBorder = !this.showBorder;
    }

    bricktify() {
      var borderColor = null;
      if (this.currentDocument.addBorder) {
        borderColor = _.find(this.brickColors, (c:Services.IColor)=> {
          return c.num == this.currentDocument.selectedBorder
        });
      }
      var validColors:Services.IColor[] = [];
      _.each(this.currentDocument.filterColors, (v:boolean, k:string)=> {
        if (v) {
          validColors.push(_.find(this.brickColors, {num: parseInt(k)}));
        }
      });

      this._bricktifyService.bricktify('source', 'brck', validColors, borderColor, this.currentDocument.dimensions.width, this.currentDocument.dimensions.height);

      this._rootScope.$broadcast('bricktified');
    }
  }

  angular.module('brickifyApp')
    .controller('BricktifyCtrl', bricktifyCtrl);

}
