(function () {
    'use strict';

    var subModules = ['The.Power.Soul.Report.Center', 'The.Power.Soul.Private.Message.Center', 'The.Power.Soul.Site.Data', 'The.Power.Soul.Tools'];
    angular.module('The.Power.Soul.Admin', ['ngMaterial', 'ui.router'].concat(subModules)).constant('BaseUrl', "http://localhost:3030").constant('Admin', '5a4b2e781948925d6819c5c4').config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.when('/', 'site-data');
        $stateProvider.state('site-data', {
            url: '/site-data',
            templateUrl: 'dist/pages/site-data.html',
            controller: 'siteDataCtrl'
        }).state('report-center', {
            url: '/report-center',
            templateUrl: 'dist/pages/report-center.html',
            controller: 'reportCenterCtrl'
        }).state('private-message', {
            url: '/private-message',
            templateUrl: 'dist/pages/private-message.html',
            controller: 'privateMessageCtrl'
        });
    }]).controller('mainCtrl', ['$scope', '$state', '$http', '$rootScope', '$mdDialog', 'BaseUrl', function ($scope, $state, $http, $rootScope, $mdDialog, BaseUrl) {
        $scope.goSiteData = function () {
            $state.go('site-data');
        };
        $scope.goReportCenter = function () {
            $state.go('report-center');
        };

        $scope.goPrivateMessage = function () {
            $state.go('private-message');
        };
    }]);
})();
(function () {
    'use strict';

    angular.module('The.Power.Soul.Private.Message.Center', ['ngMaterial']).controller('privateMessageCtrl', ['$scope', '$http', 'BaseUrl', 'Admin', 'alertService', function ($scope, $http, BaseUrl, Admin, alertService) {
        $scope.messages = [];
        $scope.disableLoadMore = false;
        var pageNum = 1;

        $scope.expandConversation = function (message) {
            message.$Expand = true;
            getMessageConversation(false, message);
        };

        $scope.closeConversation = function (message) {
            message.PageNum = 1;
            message.$Expand = false;
        };

        $scope.sendNewMessage = function (message) {
            var body = {
                Content: message.NewMessage,
                UserName: '',
                TargetUserName: ''
            };
            if (message && message.SenderID === Admin) {
                body.UserName = "管理员";
                body.TargetUserName = message.ReceiverName;
            } else if (message && message.TargetID === Admin) {
                body.UserName = "管理员";
                body.TargetUserName = message.SenderName;
            }
            $http.post(BaseUrl + '/private-message', body).then(function (response) {
                alertService.showAlert('发送成功');
                message.Messages.unshift(body);
                message.NewMessage = "";
            }, function (error) {
                alertService.showAlert('发送失败');
                message.NewMessage = "";
            });
        };

        function getMessageConversation(isLoadingMore, message) {
            var body = {
                PageNum: message.PageNum++
            };
            var user_id;
            if (message && message.SenderID === Admin) {
                user_id = message.TargetID;
            } else if (message && message.TargetID === Admin) {
                user_id = message.SenderID;
            }
            $http.post(BaseUrl + '/private-messages/' + Admin + '/' + user_id, body).then(function (response) {
                if (isLoadingMore) {
                    message.Messages = message.Messages.concat(response.data);
                    if (response.data.length < 5) {
                        message.allowLoadMore = false;
                    }
                } else {
                    message.Messages = response.data;
                }
            }, function (error) {
                //
            });
        }

        function getMessageList() {
            $http.get(BaseUrl + '/user/' + Admin).then(function (response) {
                $scope.messages = response.data.MostRecentConversation;
                $scope.messages.forEach(function (message) {
                    message.$Expand = false;
                    message.Messages = [];
                    message.allowLoadMore = true;
                    message.PageNum = 1;
                    message.NewMessage = "";
                });
            }, function (error) {
                //
            });
        }
        getMessageList();
    }]);
})();
(function () {
    'use strict';

    angular.module('The.Power.Soul.Report.Center', ['ngMaterial']).controller('reportCenterCtrl', ['$scope', '$http', 'BaseUrl', 'alertService', function ($scope, $http, BaseUrl, alertService) {
        $scope.isLoading = false;
        $scope.messages = [];
        function getReportMessages() {
            $scope.isLoading = true;
            $http.get(BaseUrl + '/complaint-message').then(function (response) {
                $scope.messages = response.data;
                $scope.isLoading = false;
            }, function (error) {
                alertService.showAlert('加载举报信息失败，请重试');
                $scope.isLoading = false;
            });
        }
        getReportMessages();
    }]);
})();
(function () {
    'use strict';

    angular.module('The.Power.Soul.Site.Data', ['ngMaterial']).controller('siteDataCtrl', ['$scope', '$http', 'BaseUrl', 'alertService', function ($scope, $http, BaseUrl, alertService) {
        $scope.isLoading = false;
        $scope.siteData;
        $scope.refresh = function () {
            getSiteData();
        };

        function getSiteData() {
            $scope.isLoading = true;
            $http.get(BaseUrl + '/site-data').then(function (response) {
                $scope.siteData = response.data;
                $scope.isLoading = false;
            }, function (error) {
                alertService.showAlert('加载站点数据失败，请重试');
                $scope.isLoading = false;
            });
        }
        getSiteData();
    }]);
})();
(function () {
    'use strict';

    angular.module('The.Power.Soul.Tools', []).constant('categoryItems', [{
        Title: "力量训练",
        Value: "STRENGTH"
    }, {
        Title: "瑜伽训练",
        Value: "YOGA"
    }, {
        Title: "形体训练",
        Value: "FITNESS"
    }, {
        Title: "跑步训练",
        Value: "RUNNING"
    }]).filter('categoryFilter', function () {
        return function (str) {
            var result = "";
            switch (str) {
                case 'STRENGTH':
                    result = "力量训练";
                    break;
                case 'YOGA':
                    result = "瑜伽训练";
                    break;
                case 'FITNESS':
                    result = "形体训练";
                    break;
                case 'RUNNING':
                    result = "跑步训练";
                    break;
            }
            return result;
        };
    }).service('alertService', ['$mdDialog', function ($mdDialog) {
        return {
            showAlert: function (text, ev) {
                $mdDialog.show($mdDialog.alert().parent(angular.element(document.querySelector('#popupContainer'))).clickOutsideToClose(true).title('提示').textContent(text).ariaLabel('Alert Dialog Demo').ok('好的').targetEvent());
            }
        };
    }]).service('randomString', function () {
        return {
            getRandomString: function (len) {
                len = len || 32;
                var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
                var maxPos = chars.length;
                var result = '';
                for (var i = 0; i < len; i++) {
                    result += chars.charAt(Math.floor(Math.random() * maxPos));
                }
                return result;
            }
        };
    });
})();