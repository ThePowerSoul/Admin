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
            message.showButtonTip = false;
            message.allowLoadMore = true;
        };

        $scope.sendNewMessage = function (message) {
            var body = {
                Content: message.NewMessage,
                UserName: '',
                TargetUserName: ''
            };
            var targetID;
            if (message && message.SenderID === Admin) {
                body.UserName = "管理员";
                body.TargetUserName = message.ReceiverName;
                targetID = message.TargetID;
            } else if (message && message.TargetID === Admin) {
                body.UserName = "管理员";
                body.TargetUserName = message.SenderName;
                targetID = message.SenderID;
            }
            $http.post(BaseUrl + '/private-message/' + Admin + '/' + targetID, body).then(function (response) {
                alertService.showAlert('发送成功');
                message.Messages.unshift(body);
                message.NewMessage = "";
            }, function (error) {
                alertService.showAlert('发送失败');
                message.NewMessage = "";
            });
        };

        $scope.loadMore = function (isLoadingMore, message) {
            getMessageConversation(isLoadingMore, message);
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
                        message.showButtonTip = true;
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
                    message.showButtonTip = false;
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

    angular.module('The.Power.Soul.Report.Center', ['ngMaterial']).filter('statusFilter', function () {
        return function (status) {
            var str = "";
            switch (status) {
                case '0':
                    str = "未处理";
                    break;
                case '1':
                    str = "已处理";
                    break;
            }
            return str;
        };
    }).filter('reportCategortFilter', function () {
        return function (id) {
            var category = "";
            switch (id) {
                case '01-1':
                    category = "侵犯我的权益-骚扰我";
                    break;
                case '01-2':
                    category = "侵犯我的权益-辱骂我，歧视我，挑衅等（不友善）";
                    break;
                case '01-3':
                    category = "侵犯我的权益-抄袭了我的内容";
                    break;
                case '01-4':
                    category = "侵犯我的权益-侵犯了我企业的权益";
                    break;
                case '01-5':
                    category = "侵犯我的权益-侵犯了我个人的权益";
                    break;
                case '02-1':
                    category = "对社区有害的内容-垃圾广告信息";
                    break;
                case '02-2':
                    category = "对社区有害的内容-色情，暴力，血腥等违反法律法规的内容";
                    break;
                case '02-3':
                    category = "对社区有害的内容-不规范转载";
                    break;
                case '02-4':
                    category = "对社区有害的内容-政治敏感";
                    break;
                case '02-5':
                    category = "对社区有害的内容-辱骂，歧视，挑衅";
                    break;
            }
            return category;
        };
    }).controller('reportCenterCtrl', ['$scope', '$http', 'BaseUrl', 'alertService', 'Admin', function ($scope, $http, BaseUrl, alertService, Admin) {
        $scope.isLoading = false;
        $scope.messages = [];
        function getReportMessages() {
            $scope.isLoading = true;
            $http.get(BaseUrl + '/complaint-message').then(function (response) {
                $scope.messages = response.data;
                $scope.messages.forEach(function (message) {
                    message.Reply = "我们已经收到您的举报信息,将会尽快进行处理。";
                    message.Warn = "我们收到来自其他用户的举报，现对您做出警告";
                });
                $scope.isLoading = false;
            }, function (error) {
                alertService.showAlert('加载举报信息失败，请重试');
                $scope.isLoading = false;
            });
        }

        $scope.sendReply = function (message) {
            var body = {
                Content: message.Reply,
                UserName: '管理员',
                TargetUserName: message.Author
            };
            $http.post(BaseUrl + '/private-message/' + Admin + '/' + message.UserID, body).then(function (response) {
                alertService.showAlert('发送成功, 请到私信板块查看完整对话');
                message.Reply = "";
            }, function (error) {
                alertService.showAlert('发送失败');
            });
        };

        $scope.sendWarn = function (message) {
            var body = {
                Content: message.Reply,
                UserName: '管理员',
                TargetUserName: message.Author
            };
            $http.post(BaseUrl + '/private-message/' + Admin + '/' + message.UserID, body).then(function (response) {
                alertService.showAlert('发送成功, 请到私信板块查看完整对话');
                message.Reply = "";
            }, function (error) {
                alertService.showAlert('发送失败');
            });
        };

        $scope.markRead = function (message) {
            $http.put(BaseUrl + '/complaint-message/' + message._id).then(function (response) {
                alertService.showAlert('标记成功');
                message.Status = '1';
            }, function (error) {
                alertService.showAlert('标记失败，请重试');
            });
        };
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