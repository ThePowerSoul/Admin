(function () {
    'use strict';
    angular.module('The.Power.Soul.Private.Message.Center', ['ngMaterial'])
        .controller('privateMessageCtrl', ['$scope', '$http', 'BaseUrl', 'Admin', 'alertService',
            function ($scope, $http, BaseUrl, Admin, alertService) {
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
                }

                $scope.sendNewMessage = function (message) {
                    var body = {
                        Content: message.NewMessage,
                        UserName: '',
                        TargetUserName: ''
                    }
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
                    $http.post(BaseUrl + '/private-message/' + Admin + '/' + targetID, body)
                        .then(function (response) {
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
                    }
                    var user_id;
                    if (message && message.SenderID === Admin) {
                        user_id = message.TargetID;
                    } else if (message && message.TargetID === Admin) {
                        user_id = message.SenderID;
                    }
                    $http.post(BaseUrl + '/private-messages/' + Admin + '/' + user_id, body)
                        .then(function (response) {
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
                    $http.get(BaseUrl + '/user/' + Admin)
                        .then(function (response) {
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
            }])
}());