/// <reference path="../ts-defs/angularjs/angular.d.ts" />
/// <reference path="../ts-defs/lodash/lodash.d.ts" />
/// <reference path="brickService.ts" />
/// <reference path="brickOptionsService.ts" />
/// <reference path="canvasContextService.ts" />

'use strict';
module Services {

  export class BricktifyService {
    public static $inject = ['canvasContextService','brickService','brickOptionsService'];

    private lastMap:Services.IColor[][];
    private lastBrickList:IPlacedBrick[];
    private lastPictureMap:number[][];
    private oneByOneDesignId:number=3005;

    constructor(public canvasContextService:Services.CanvasContextService, public _brickService:Services.BrickService, public brickOptionsService:Services.BrickOptionService) {

    }

    bricktify = (sourceContextName:string, destContextName:string, allowedColors:IColor[], borderColor:IColor, width:number, height:number) => {

      var sourceRawContext = this.canvasContextService.getContext(sourceContextName);
      var sourceContext = BricktifyService.scaleInput(sourceRawContext, width, height);

      var legoCanvas = BricktifyService.createBrickContext(width, height);
      $(document.body).append(legoCanvas); //Some browsers need the canvas added to the body to work from it.
      var legoContext = legoCanvas.getContext('2d');
      this.brickOptionsService.getCurrentOptions().brickMap =new Array(sourceContext.canvas.width);
      this.lastMap = this.brickOptionsService.getCurrentOptions().brickMap;

      //Find nearest lego color for each pixel in the portrait
      for (var x = 0; x < sourceContext.canvas.width; x++) {
        this.lastMap[x] = new Array(sourceContext.canvas.height);
        for (var y = 0; y < sourceContext.canvas.height; y++) {
          var colorToUse;
          if (borderColor && (x === 0 || y === 0 || x === sourceContext.canvas.width - 1 || y === sourceContext.canvas.height - 1)) {
            colorToUse = borderColor;
          } else {
            var imgd = sourceContext.getImageData(x, y, 1, 1);
            colorToUse = BricktifyService.findClosestColor(imgd.data[0], imgd.data[1], imgd.data[2], allowedColors);
          }
          var legod = legoContext.createImageData(1, 1);
          legod.data[0] = colorToUse.r;
          legod.data[1] = colorToUse.g;
          legod.data[2] = colorToUse.b;
          legod.data[3] = 255;
          this.lastMap[x][y] = colorToUse;
          legoContext.putImageData(legod, x, y);
        }
      }

      this.reduceBrickMap(sourceContext.canvas.width, sourceContext.canvas.height);

      var displayImg = this.canvasContextService.getContext(destContextName);
      displayImg.attr('src', legoCanvas.toDataURL('image/png'));
      $('.removeMe').remove();
    };

    private reduceBrickMap(canvasWidth:number, canvasHeight:number) {

      //See if we can use fewer bricks by using larger bricks to simplify the result.
      //This map is used to create the step by step instructions.
      var oneByOnePart = this._brickService.getPart(1,1);

      this.brickOptionsService.getCurrentOptions().brickList = [];
      this.lastBrickList = this.brickOptionsService.getCurrentOptions().brickList;

      this.lastPictureMap = new Array(canvasWidth);
      for (var x = 0; x < canvasWidth; x++) {
        this.lastPictureMap[x] = new Array(canvasHeight);
      }
      for (var x = 0; x < canvasWidth; x++) {
        for (var y = 0; y < canvasHeight; y++) {
          if (angular.isUndefined(this.lastPictureMap[x][y])) {
            var c = this.lastMap[x][y];
            var oneByOneBrick = this._brickService.getOneByOneBrick(c.num);
            var brick = <IPlacedBrick>{
              brick: oneByOneBrick,
              startX: x,
              startY: y,
              endX: x,
              endY: y,
              designId: this.oneByOneDesignId,
              angle:0,
              color:c,
              part:oneByOnePart
            };

            this.lastBrickList.push(brick);
            var otherBricks = this._brickService.getPartsWithMultipleStudsForColor(c.num);
            if (otherBricks) {
              _.each(otherBricks, (otherSize:IPart)=> {

                var sizeFits:boolean;
                var angle:number;
                var width:number;
                var height:number;

                sizeFits = this.seeIfBrickFits(x,y,otherSize.n1, otherSize.n2,c);
                if (sizeFits) {
                  angle=0;
                  width=otherSize.n1;
                  height=otherSize.n2;
                } else if (otherSize.n1 !== otherSize.n2) {
                  sizeFits = this.seeIfBrickFits(x,y,otherSize.n2,otherSize.n1,c); {
                    angle=90;
                    width=otherSize.n2;
                    height=otherSize.n1;
                  }
                }

                if (sizeFits) {
                  brick.angle=angle;
                  brick.brick = this._brickService.getBrick(otherSize.designId, brick.color.num);
                  brick.part = otherSize;
                  brick.startX = x;
                  brick.startY = y;
                  brick.endX = x + width - 1;
                  brick.endY = y + height - 1;
                  brick.designId = otherSize.designId;
                  for (var x1 = x; x1 < x + width; x1++) {
                    for (var y1 = y; y1 < y + height; y1++) {
                      this.lastPictureMap[x1][y1] = this.lastBrickList.length - 1;
                    }
                  }
                }
              });
            }
            this.lastPictureMap[x][y] = this.lastBrickList.length - 1;
          }
        }
      }
    }

    private seeIfBrickFits(startX:number, startY:number,width:number,height:number, color:IColor):boolean {
      var okToUse = true;
      for (var x1 = startX; x1 < startX + width && okToUse; x1++) {
        for (var y1 = startY; y1 < startY + height && okToUse; y1++) {
          if (x1 >= this.lastMap.length || y1 >= this.lastMap[x1].length) {
            okToUse = false;
          } else if (angular.isDefined(this.lastPictureMap[x1][y1])) {
            okToUse = false;
          } else if (this.lastMap[x1][y1].num !== color.num) {
            okToUse = false;
          }
        }
      }

      return okToUse;
    }

    private static scaleInput(sourceRawContext, width, height) {
      var sourceCanvas = <HTMLCanvasElement>angular.element('<canvas class="removeMe"></canvas>')[0];
      $(document.body).append(sourceCanvas);
      sourceCanvas.style.width = width + 'px';
      sourceCanvas.style.height = height + 'px';
      sourceCanvas.width = width;
      sourceCanvas.height = height;
      var sourceContext = sourceCanvas.getContext('2d');
      var sourceImg = new Image();
      sourceImg.src = sourceRawContext.canvas.toDataURL('image/png');
      sourceContext.drawImage(sourceImg, 0, 0, width, height);
      return sourceContext;
    }

    private static createBrickContext(width, height) {
      var brickCanvas = <HTMLCanvasElement>angular.element('<canvas class="removeMe"></canvas>')[0];
      brickCanvas.style.width = width + 'px';
      brickCanvas.style.height = height + 'px';
      brickCanvas.width = width;
      brickCanvas.height = height;

      return brickCanvas;
    }

    private static findClosestColor(r:number, g:number, b:number, allowableColors) {

      var candidateColor = null;
      var candidateDistance = Number.MAX_VALUE;
      for (var i = 0; i < allowableColors.length; i++) {
        var d = BricktifyService.findColorDistance(r, g, b, allowableColors[i].r, allowableColors[i].g, allowableColors[i].b);
        if (d < candidateDistance) {
          candidateColor = allowableColors[i];
          candidateDistance = d;
        }
      }

      return candidateColor;
    }

    private static findColorDistance(r:number, g:number, b:number, r1:number, g1:number, b1:number) {
      return Math.pow(((r - r1) * 0.3), 2) +
        Math.pow(((g - g1) * 0.3), 2) +
        Math.pow(((b - b1) * 0.3), 2);
    }
  }
  angular.module('brickifyApp').service('bricktifyService',  BricktifyService);
}
