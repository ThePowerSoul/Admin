(function () {
    'use strict';
    angular.module('The.Power.Soul.Report.Center', ['ngMaterial'])
        .filter('statusFilter', function () {
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
            }
        })
        .filter('reportCategortFilter', function () {
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
            }
        })
        .controller('reportCenterCtrl', ['$scope', '$http', 'BaseUrl', 'alertService', 'Admin',
            function ($scope, $http, BaseUrl, alertService, Admin) {
                $scope.isLoading = false;
                $scope.messages = [];
                function getReportMessages() {
                    $scope.isLoading = true;
                    $http.get(BaseUrl + '/complaint-message')
                        .then(function (response) {
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
                    var confirm = $mdDialog.confirm()
                        .title('提示')
                        .textContent('该操作会直接将信息以官方身份发给举报者，确定发送？')
                        .ariaLabel('Lucky day')
                        .targetEvent()
                        .ok('确定')
                        .cancel('取消');

                    $mdDialog.show(confirm).then(function () {
                        var body = {
                            Content: message.Reply,
                            UserName: '管理员',
                            TargetUserName: message.Author
                        }
                        $scope.isOperating = true;
                        $http.post(BaseUrl + '/private-message/' + Admin + '/' + message.TargetUserID, body)
                            .then(function (response) {
                                $scope.isOperating = false;
                                alertService.showAlert('发送成功, 请到私信板块查看完整对话');
                                message.Reply = "";
                            }, function (error) {
                                $scope.isOperating = false;
                                alertService.showAlert('发送失败');
                            });
                    }, function () {
                        // canceled
                    });
                };

                $scope.sendWarn = function (message) {
                    var confirm = $mdDialog.confirm()
                        .title('提示')
                        .textContent('该操作会直接将信息以官方身份发给被举报者，确定发送？')
                        .ariaLabel('Lucky day')
                        .targetEvent()
                        .ok('确定')
                        .cancel('取消');
                    $mdDialog.show(confirm).then(function () {
                        var body = {
                            Content: message.Warn,
                            UserName: '管理员',
                            TargetUserName: message.Author
                        }
                        $scope.isOperating = true;
                        $http.post(BaseUrl + '/private-message/' + Admin + '/' + message.UserID, body)
                            .then(function (response) {
                                $scope.isOperating = false;
                                alertService.showAlert('发送成功, 请到私信板块查看完整对话');
                                message.Warn = "";
                            }, function (error) {
                                $scope.isOperating = false;
                                alertService.showAlert('发送失败');
                            });
                    }, function () {
                        // canceled
                    });
                }

                $scope.deleteTargetMessage = function (message) {
                    var confirm = $mdDialog.prompt()
                        .title('提示')
                        .textContent('此操作将直接对被举报内容进行彻底删除，请再操作完成后同时对举报者和被举报者进行通知')
                        .ariaLabel('Lucky day')
                        .targetEvent()
                        .ok('确定')
                        .cancel('取消');
                    $mdDialog.show(confirm).then(function (result) {
                        switch (message.Type) {
                            case 'COMMENT':
                                $scope.isOperating = true;
                                $http.delete(BaseUrl + '/comment/' + message.TargetID)
                                    .then(function (response) {
                                        alertService.showAlert('删除成功');
                                        $scope.isOperating = false;
                                    }, function (error) {
                                        $scope.isOperating = false;
                                        alertService.showAlert('删除失败，请重试');
                                    });
                                break;
                            case 'TOPIC':
                                $scope.isOperating = true;
                                $http.delete(BaseUrl + '/topic/' + message.TargetID)
                                    .then(function (response) {
                                        $scope.isOperating = false;
                                        alertService.showAlert('删除成功');
                                    }, function (error) {
                                        $scope.isOperating = false;
                                        alertService.showAlert('删除失败，请重试');
                                    });
                                break;
                            case 'ARTICLE':
                                $scope.isOperating = true;
                                $http.delete(BaseUrl + '/article/' + message.TargetID)
                                    .then(function (response) {
                                        $scope.isOperating = false;
                                        alertService.showAlert('删除成功');
                                    }, function (error) {
                                        $scope.isOperating = false;
                                        alertService.showAlert('删除失败，请重试');
                                    });
                                break;
                        }
                    }, function () {
                        // canceled
                    });
                };

                $scope.markRead = function (message) {
                    var confirm = $mdDialog.prompt()
                        .title('提示')
                        .textContent('确定将改消息标记为已处理？')
                        .ariaLabel('Lucky day')
                        .targetEvent()
                        .ok('确定')
                        .cancel('取消');
                    $mdDialog.show(confirm).then(function (result) {
                        $scope.isOperating = true;
                        $http.put(BaseUrl + '/complaint-message/' + message._id)
                            .then(function (response) {
                                alertService.showAlert('标记成功');
                                $scope.isOperating = false;
                                message.Status = '1';
                            }, function (error) {
                                $scope.isOperating = false;
                                alertService.showAlert('标记失败，请重试');
                            });
                    }, function () {
                        // canceled
                    });
                };
                getReportMessages();
            }])
}());