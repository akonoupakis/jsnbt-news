;(function () {
    "use strict";

    var NewsSettingsController = function ($scope, $rootScope, $jsnbt, $logger) {
        jsnbt.controllers.SettingsControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var logger = $logger.create('NewsSettingsController');

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

        this.init().catch(function (ex) {
            logger.error(ex);
        });
    };
    NewsSettingsController.prototype = Object.create(jsnbt.controllers.SettingsControllerBase.prototype);

    angular.module("jsnbt-news")
        .controller('NewsSettingsController', ['$scope', '$rootScope', '$jsnbt', '$logger', NewsSettingsController]);

})();