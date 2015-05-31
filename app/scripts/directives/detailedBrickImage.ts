/// <reference path="../ts-defs/angularjs/angular.d.ts" />
/// <reference path="../services/bricktifyService.ts" />
/// <reference path="../services/brickOptionsService.ts" />
/// <reference path="../services/brickService.ts" />

module Directives {
  export class DetailedBrickImage {
    public static Factory($timeout:ng.ITimeoutService, brickOptionsService:Services.BrickOptionService) {
      return {
        restrict: 'E',
        replace: true,
        template: '<canvas style="width:100%;height:100%"></canvas>',
        scope: {
          step:'='
        },
        link: (scope, element,attrs) => {
          $timeout(()=> {
            var maxSteps = scope.step;
            if (!attrs.step) {
              maxSteps = brickOptionsService.getCurrentOptions().brickList.length;
            }

            drawBricks(maxSteps);
          }, 20);

          scope.$watch('step', ()=> {
            if (scope.step) {
              drawBricks(scope.step);
            }
          });

          function drawBricks(numberOfSteps) {
            var ctx = element[0].getContext('2d');
            var grid = brickOptionsService.getCurrentOptions().brickMap;
            var bricks = brickOptionsService.getCurrentOptions().brickList;
            ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
            _.each(bricks, (brick, idx)=> {
              if (idx < numberOfSteps) {
                DetailedBrickImage.drawBrick(ctx, brick.startX, brick.startY, brick.color, brick.endX - brick.startX + 1, brick.endY - brick.startY + 1, grid.length, grid[0].length);
              }
            });
          }
        }
      }
    }

    public static drawBrick(ctx, x:number, y:number, color:Services.IColor, width:number, height:number,rowWidth:number, colHeight:number) {
      var pixelsPerXBrick = ctx.canvas.width / rowWidth ;
      var pixelsPerYBrick = ctx.canvas.height / colHeight ;
      var startX = x * pixelsPerXBrick;
      var startY = y * pixelsPerYBrick;

      ctx.fillStyle = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
      ctx.fillRect(startX, startY, pixelsPerXBrick*width, pixelsPerYBrick*height);

      ctx.beginPath();
      ctx.lineWidth="1";
      ctx.strokeStyle="Black";
      ctx.rect(startX, startY, pixelsPerXBrick*width, pixelsPerYBrick*height);
      ctx.stroke();
    }
  }

  angular.module('brickifyApp').directive('detailedBrickImage', ['$timeout','brickOptionsService', DetailedBrickImage.Factory]);
}
