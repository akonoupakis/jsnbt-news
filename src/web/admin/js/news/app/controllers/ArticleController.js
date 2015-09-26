;(function () {
    "use strict";

    var NewsArticleController = function ($scope, $route, $rootScope, $location, $q, $data) {
        jsnbt.NodeFormControllerBase.apply(this, $scope.getBaseArguments($scope));

        $scope.prefix = $route.current.$$route.location ? $route.current.$$route.location.prefix : undefined;
        $scope.offset = _.str.trim($scope.prefix || '', '/').split('/').length;

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

        var setLocationFn = $scope.setLocation;
        $scope.setLocation = function () {
            var deferred = $q.defer();

            setLocationFn.apply(this, arguments).then(function (response) {
                $scope.getNodeBreadcrumb($scope.isNew() ? { id: 'new', parent: $scope.id.substring(4) } : $scope.node, $scope.prefix).then(function (bc) {

                    var offset = $scope.offset;
                    var remaining = 1;
                    if ($scope.prefix === '/content/nodes/news' && $scope.offset === 3) {
                        offset--;
                        remaining++;
                    }

                    response.splice(offset);

                    _.each(bc, function (c) {
                        response.push(c);
                    });

                    deferred.resolve(response);

                }, function (ex) {
                    deferred.reject(ex);
                });
            }).catch(function (ex) {
                deferred.reject(ex);
            });

            return deferred.promise;
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

                    if ($scope.imageSize.teaser.height && $scope.imageSize.teaser.width)
                        $scope.imageTip.teaser = $scope.imageSize.teaser.height + 'x' + $scope.imageSize.teaser.width;

                    if ($scope.imageSize.body.height && $scope.imageSize.body.width)
                        $scope.imageTip.body = $scope.imageSize.body.height + 'x' + $scope.imageSize.body.width;

                    if ($scope.imageSize.gallery.height && $scope.imageSize.gallery.width)
                        $scope.imageTip.gallery = $scope.imageSize.gallery.height + 'x' + $scope.imageSize.gallery.width;
                }

                deferred.resolve();
            }, function (error) {
                deferred.reject();
            });

            return deferred.promise;
        });

        $scope.init();
    };
    NewsArticleController.prototype = Object.create(jsnbt.NodeFormControllerBase.prototype);

    angular.module("jsnbt-news")
        .controller('NewsArticleController', ['$scope', '$route', '$rootScope', '$location', '$q', '$data', NewsArticleController]);

})();