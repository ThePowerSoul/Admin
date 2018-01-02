(function () {
    'use strict';
    var subModules = [
        'The.Power.Soul.Report.Center',
        'The.Power.Soul.Private.Message.Center',
        'The.Power.Soul.Site.Data',
        'The.Power.Soul.Tools'
    ];
    angular.module('The.Power.Soul.Admin', ['ngMaterial', 'ui.router'].concat(subModules))
        .constant('BaseUrl', "http://localhost:3030")
        .constant('Admin', '5a4b2e781948925d6819c5c4')
        .config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
            function ($stateProvider, $urlRouterProvider, $locationProvider) {
                $urlRouterProvider
                    .when('/', 'site-data')
                $stateProvider
                    .state('site-data', {
                        url: '/site-data',
                        templateUrl: 'dist/pages/site-data.html',
                        controller: 'siteDataCtrl'
                    })
                    .state('report-center', {
                        url: '/report-center',
                        templateUrl: 'dist/pages/report-center.html',
                        controller: 'reportCenterCtrl'
                    })
                    .state('private-message', {
                        url: '/private-message',
                        templateUrl: 'dist/pages/private-message.html',
                        controller: 'privateMessageCtrl',
                    });
            }])
        .controller('mainCtrl', ['$scope', '$state', '$http', '$rootScope', '$mdDialog', 'BaseUrl',
            function ($scope, $state, $http, $rootScope, $mdDialog, BaseUrl) {
                $scope.goSiteData = function () {
                    $state.go('site-data');
                };
                $scope.goReportCenter = function () {
                    $state.go('report-center');
                };

                $scope.goPrivateMessage = function () {
                    $state.go('private-message');
                };
            }])
}());