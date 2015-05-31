/// <reference path="../ts-defs/angularjs/angular.d.ts" />

module Services {
    export class CanvasContextService {
        private contextDictionary={};

        setContext = (name,ctx) => {
            this.contextDictionary[name]=ctx;
        };

        getContext = (name) => {
            return this.contextDictionary[name];
        }

    }
    angular.module('brickifyApp').service('canvasContextService', CanvasContextService);
}
