(function () {
    'use strict';
    angular.module('The.Power.Soul.Site.Data', ['ngMaterial'])
        .controller('siteDataCtrl', ['$scope', '$http', 'BaseUrl', 'alertService',
            function ($scope, $http, BaseUrl, alertService) {
                $scope.isLoading = false;
                $scope.siteData;
                $scope.refresh = function() {
                    getSiteData();
                };

                function getSiteData() {
                    $scope.isLoading = true;
                    $http.get(BaseUrl + '/site-data')
                        .then(function (response) {
                            $scope.siteData = response.data; 
                            $scope.isLoading = false;
                        }, function (error) {
                            alertService.showAlert('加载站点数据失败，请重试');
                            $scope.isLoading = false;
                        });
                }
                getSiteData();
            }])
}());