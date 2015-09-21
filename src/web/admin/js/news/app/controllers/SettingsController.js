;(function () {
    "use strict";

    var NewsSettingsController = function ($scope, $route, $location, $jsnbt) {
        jsnbt.SettingsControllerBase.apply(this, $scope.getBaseArguments($scope));

        $scope.prefix = $route.current.$$route.location ? $route.current.$$route.location.prefix : undefined;

        $scope.back = function () {
            $location.previous($scope.prefix);
        };

        $scope.templates = [];

        for (var templateName in $jsnbt.templates) {
            var template = $jsnbt.templates[templateName];

            var entityName = 'article';

            var tmpl = {};
            $.extend(true, tmpl, template);

            if (tmpl.restricted) {
                if (tmpl.restricted.indexOf(entityName) !== -1) {
                    $scope.templates.push(tmpl);
                }
            }
            else {
                $scope.templates.push(tmpl);
            }
        }

        $scope.init();
    };
    NewsSettingsController.prototype = Object.create(jsnbt.SettingsControllerBase.prototype);

    angular.module("jsnbt-news")
        .controller('NewsSettingsController', ['$scope', '$route', '$location', '$jsnbt', NewsSettingsController]);

})();