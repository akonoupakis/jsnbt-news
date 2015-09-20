;(function () {
    "use strict";

    var NewsArticleFormController = function ($scope, $rootScope, $location, $q, $data) {
        jsnbt.NodeFormControllerBase.apply(this, $scope.getBaseArguments($scope));

        $scope.imageSize = {
            teaser: {
                height: undefined,
                width: undefined
            },
            body: {
                height: undefined,
                width: undefined
            },
            gallery: {
                height: undefined,
                width: undefined
            }
        };

        $scope.imageTip = {
            teaser: undefined,
            body: undefined,
            gallery: undefined
        };

        $scope.enqueue('preload', function () {
            var deferred = $q.defer();
            
            $data.settings.get({
                domain: 'news'
            }).then(function (response) {
                var settings = _.first(response);

                if (settings) {
                    $scope.imageSize.teaser.height = typeof(settings.data.imageTeaserHeight) === 'number' ? settings.data.imageTeaserHeight : undefined;
                    $scope.imageSize.teaser.width = typeof (settings.data.imageTeaserWidth) === 'number' ? settings.data.imageTeaserWidth : undefined;

                    $scope.imageSize.body.height = typeof (settings.data.imageBodyHeight) === 'number' ? settings.data.imageBodyHeight : undefined;
                    $scope.imageSize.body.width = typeof (settings.data.imageBodyWidth) === 'number' ? settings.data.imageBodyWidth : undefined;

                    $scope.imageSize.gallery.height = typeof (settings.data.imageGalleryHeight) === 'number' ? settings.data.imageGalleryHeight : undefined;
                    $scope.imageSize.gallery.width = typeof (settings.data.imageGalleryWidth) === 'number' ? settings.data.imageGalleryWidth : undefined;

                    if($scope.imageSize.teaser.height && $scope.imageSize.teaser.width)
                        $scope.imageTip.teaser = $scope.imageSize.teaser.height + 'x' + $scope.imageSize.teaser.width

                    if ($scope.imageSize.body.height && $scope.imageSize.body.width)
                        $scope.imageTip.body = $scope.imageSize.body.height + 'x' + $scope.imageSize.body.width

                    if ($scope.imageSize.gallery.height && $scope.imageSize.gallery.width)
                        $scope.imageTip.gallery = $scope.imageSize.gallery.height + 'x' + $scope.imageSize.gallery.width
                }

                deferred.resolve();
            }, function (error) {
                deferred.reject();
            });

            return deferred.promise;
        });

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
        .controller('NewsArticleFormController', ['$scope', '$rootScope', '$location', '$q', '$data', NewsArticleFormController]);

})();