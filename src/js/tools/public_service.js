(function () {
    'use strict';
    angular.module('The.Power.Soul.Tools', [])
        .constant('categoryItems', [
            {
                Title: "力量训练",
                Value: "STRENGTH"
            },
            {
                Title: "瑜伽训练",
                Value: "YOGA"
            },
            {
                Title: "形体训练",
                Value: "FITNESS"
            },
            {
                Title: "跑步训练",
                Value: "RUNNING"
            }
        ])
        .filter('categoryFilter', function () {
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
            }
        })
        .service('alertService', ['$mdDialog', function ($mdDialog) {
            return {
                showAlert: function (text, ev) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent(text)
                            .ariaLabel('Alert Dialog Demo')
                            .ok('好的')
                            .targetEvent()
                    );
                }
            }
        }])
        .service('randomString', function () {
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
            }
        })
}());