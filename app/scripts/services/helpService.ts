/// <reference path="../ts-defs/angularjs/angular.d.ts" />
/// <reference path="../ts-defs/lodash/lodash.d.ts" />

module Services {
    export class HelpService {
        private elements = [];

        private stepCallbacks = [];

        Start = () => {
            _.each(this.elements, (element)=> {
                (<any>$(window)).joyride('destroy');
                (<any>$(element)).joyride({
                    autoStart:true,
                    postRideCallback: ()=> {
                        this.Stop();
                    },
                    preStepCallback: (idx) => {
                        _.each(this.stepCallbacks, (stepCallback)=> {
                           stepCallback(idx);
                        });
                    }
                });
            })
        };

        Stop = () => {
            (<any>$(window)).joyride('destroy');
        };

        RegisterElement = (element) => {
            this.elements.push(element);
        };

        RegisterStepCallback = (callback) =>  {
            this.stepCallbacks.push(callback);
        };
    }

    angular.module('brickifyApp').service('helpService', HelpService);
}
