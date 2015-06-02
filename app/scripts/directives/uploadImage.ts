/// <reference path="../ts-defs/angularjs/angular.d.ts" />
/// <reference path="../services/CanvasContextService.ts" />
/// <reference path="../services/AspectRatioService.ts" />
'use strict';
module Directives {
    export class UploadImageDirective {
        public static factory(_canvasContextService:Services.CanvasContextService, _aspectRatioService:Services.AspectRatioService) {
            return {
               require:'ngModel',
                restrict:'E',
                scope:true,
                template:'<label>Image File:</label><input type="file" class="uploadImage" /><button class="rotateButton" data-ng-click="rotateImage()"><i class="fa fa-repeat"></i> </button>' +
                    '<div class="uploadImageCanvasContainer"><canvas style="height:100%;width:100%" class="uploadImageCanvas"></canvas></div><img class="hide hiddenImage" />'  ,
                link: (scope, element, attrs, ngModel) => {

                    var domCanvas = <HTMLCanvasElement>$('canvas',element)[0];
                    var uploadCtrl = $('input[type="file"]',element);
                    var ctx = domCanvas.getContext('2d');
                    var img = <HTMLImageElement>$('img',element)[0];
                    var width;
                    var height;

                    _canvasContextService.setContext(attrs.context,ctx);

                    uploadCtrl.bind('change', (e:any) => {
                        var reader = new FileReader();
                        reader.onload = (readerEvent:any) => {

                            img.onload = () => {
                                $(domCanvas).css('width','100%').css('height','100%');
                              var w = domCanvas.offsetWidth;
                              var h = domCanvas.offsetHeight;
                                domCanvas.width = w;
                                domCanvas.height = h;
                                width=img.width;
                                height=img.height;

                                height = (height/width) * domCanvas.width;
                                width = domCanvas.width;

                                if (width > domCanvas.width) {
                                    var ratio = (domCanvas.width / width);
                                    width = ratio * width;
                                    height = ratio * height;
                                }
                                if (height > domCanvas.height) {
                                    ratio = (domCanvas.height / height);
                                    width = ratio * width;
                                    height = ratio * height;
                                }
                                domCanvas.width = width;
                                domCanvas.height = height;
                                ctx.drawImage(img, 0, 0, width, height);
                                domCanvas.style.width=null;
                                domCanvas.style.height=null;

                                scope.$apply(()=> {
                                  _aspectRatioService.getCurrentAspectRatio().setRatio(height/width);
                                  _aspectRatioService.getCurrentAspectRatio().hasBeenUploaded = true;
                                });
                            };
                            ngModel.$setViewValue(readerEvent.target.result);
                            img.src=ngModel.$viewValue;
                        };
                        reader.readAsDataURL(e.target.files[0]);
                    });

                    scope.rotateImage=()=> {
                        var tempCanvas = <HTMLCanvasElement>angular.element('<canvas />')[0];
                        var tempCtx = tempCanvas.getContext('2d');

                        //noinspection JSSuspiciousNameCombination
                      tempCanvas.width = domCanvas.height;
                        //noinspection JSSuspiciousNameCombination
                      tempCanvas.height = domCanvas.width;

                        tempCtx.save();
                        tempCtx.translate(tempCanvas.width/2,tempCanvas.height/2);
                        tempCtx.rotate(90 * Math.PI/180);
                        tempCtx.translate(-domCanvas.width/2,-domCanvas.height/2);
                        tempCtx.drawImage(domCanvas,0,0);
                        tempCtx.restore();

                        domCanvas.width = tempCanvas.width;
                        domCanvas.height = tempCanvas.height;

                        ctx.save();
                        ctx.drawImage(tempCanvas,0,0);
                        ctx.restore();

                        _aspectRatioService.getCurrentAspectRatio().setRatio(domCanvas.height/domCanvas.width);

                    };
                }
            };
        }
    }
    angular.module('brickifyApp').directive('uploadImage',['canvasContextService','aspectRatioService',UploadImageDirective.factory]);
}
