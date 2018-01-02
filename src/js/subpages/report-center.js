(function () {
    'use strict';
    angular.module('The.Power.Soul.Report.Center', ['ngMaterial'])
        .controller('reportCenterCtrl', ['$scope', '$http', 'BaseUrl', 'alertService',
            function ($scope, $http, BaseUrl, alertService) {
                $scope.isLoading = false;
                $scope.messages = [];
                function getReportMessages() {
                    $scope.isLoading = true;
                    $http.get(BaseUrl + '/complaint-message')
                        .then(function (response) {
                            $scope.messages = response.data;
                            $scope.isLoading = false;
                        }, function (error) {
                            alertService.showAlert('加载举报信息失败，请重试');
                            $scope.isLoading = false;
                        });
                }
                getReportMessages();
            }])
}());