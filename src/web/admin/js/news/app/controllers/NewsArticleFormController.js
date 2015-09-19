;(function () {
    "use strict";

    var NewsArticleFormController = function ($scope, $rootScope, $location) {
        jsnbt.NodeFormControllerBase.apply(this, $scope.getBaseArguments($scope));

        $scope.back = function () {
            if ($rootScope.location.previous) {
                $location.previous($rootScope.location.previous);
            }
            else {
                $location.previous('/modules/news');
            }
        };

        $scope.init();
    };
    NewsArticleFormController.prototype = Object.create(jsnbt.NodeFormControllerBase.prototype);

    angular.module("jsnbt-news")
        .controller('NewsArticleFormController', ['$scope', '$rootScope', '$location', NewsArticleFormController]);

})();