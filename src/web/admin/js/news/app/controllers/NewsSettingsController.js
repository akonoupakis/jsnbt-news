;(function () {
    "use strict";

    var NewsSettingsController = function ($scope, $location, $jsnbt) {
        jsnbt.SettingsControllerBase.apply(this, $scope.getBaseArguments($scope));

        $scope.back = function () {
            $location.previous('/modules/news');
        };

        $scope.templates = [];

        for (var templateName in $jsnbt.templates) {
            var template = $jsnbt.templates[templateName];

            var entityName = 'article';

            var tmpl = {};
            $.extend(true, tmpl, template);

            var include = false;

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
        .controller('NewsSettingsController', ['$scope', '$location', '$jsnbt', NewsSettingsController]);

})();