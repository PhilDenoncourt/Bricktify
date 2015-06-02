/// <reference path="../ts-defs/angularjs/angular.d.ts" />
/// <reference path="../ts-defs/lodash/lodash.d.ts" />
module Services {

  export interface IBrick {
    designId:number;
    color:number;//£ego Color Number
  }

  export interface IColor {
    num:number;
    color:string;
    r:number;
    g:number;
    b:number;
    a:number;
    BricklinkId:number;
  }

  export interface IPart {
    designId:number;
    n1:number;
    n2:number;
  }
  export class BrickService {
    static $inject=['colors','parts','bricks'];
    constructor (public _colors:IColor[], public _parts:IPart[], public _bricks:IBrick[]) {

    }

    getAllColors():IColor[] {
      return _.sortBy(this._colors, 'color');;
    }

    getPartsWithMultipleStudsForColor(color:number): IPart[] {

      var bricks = _.filter(_.reject(this._bricks, {designId:3005}), {color:color});
      return _.filter(this._parts, (part)=> {
        return _.any(bricks, (brick)=> {
          return brick.designId == part.designId;
        });
      });
    }

    getOneByOneBrick(color:number):IBrick {
      return _.find(this._bricks,{color:color});
    }

    getPart(n1:number, n2:number):IPart {
      return _.find(this._parts,(part)=> {
        return (part.n1 == n1 && part.n2==n2) ||(part.n1 == n2 && part.n2==n1);
      })
    }

    getBrick(designId:number, color:number):IBrick {
      return _.find(this._bricks, {designId:designId, color:color});
    }

  }
  angular.module('brickifyApp').service('brickService', BrickService);
}
