'use strict';

/**
 * @ngdoc overview
 * @name brickifyApp
 * @description
 * # brickifyApp
 *
 * Main module of the application.
 */
angular
  .module('brickifyApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap'
  ])
  .config(['$compileProvider',function($compileProvider)  {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|tel|data):/);
    }]);
