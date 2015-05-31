/// <reference path="../ts-defs/angularjs/angular.d.ts" />
/// <reference path="../ts-defs/lodash/lodash.d.ts" />
/// <reference path="brickService.ts" />

module Services {


  export interface IPlacedBrick {
    color: IColor;
    brick: IBrick;
    part: IPart;
    startX : number;
    startY : number;
    endX :number;
    endY :number;
    designId:number;
    angle:number;
  }

  export interface IBrickOptions {
    dimensions:IHeightWidth;
    addBorder:boolean;
    selectedBorder:number;
    filterColors:any;
    sourceImageDataUri:string;
    brickMap:Services.IColor[][];
    brickList: IPlacedBrick[];
  }

  export interface IHeightWidth {
    width:number;
    height:number;
  }

  export class BrickOptionService {
    static $inject=['colors'];

    private currentOptions:IBrickOptions;
    private defaultWidth = 44;
    private defaultHeight = 34;
    private defaultBorder = 24;
    private defaultAddBorder = true;

    constructor(colors:IColor[]) {
      this.currentOptions = {
        dimensions: {
          width: this.defaultWidth,
          height: this.defaultHeight
        },
        filterColors: {},
        addBorder: this.defaultAddBorder,
        selectedBorder: this.defaultBorder,
        sourceImageDataUri:null,
        brickMap:null,
        brickList:null,
        lxfmlDataUri:null
      };
      _.each(colors, (color:IColor)=> {
        this.currentOptions.filterColors[color.num] = true;
      });

    }

    getCurrentOptions = () => {
      return this.currentOptions;
    }
  }
  angular.module('brickifyApp').service('brickOptionsService', BrickOptionService);
}

