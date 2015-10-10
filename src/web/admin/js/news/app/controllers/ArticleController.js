;(function () {
    "use strict";

    var NewsArticleController = function ($scope, $rootScope, $route, $location, $q, $data, $logger) {
        jsnbt.controllers.NodeFormControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var logger = $logger.create('NewsArticleController');

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

        this.enqueue('preloading', function () {
            var deferred = $q.defer();

            $data.settings.get({
                domain: 'news'
            }).then(function (response) {
                var settings = _.first(response);

                if (settings) {
                    $scope.imageSize.teaser.height = typeof (settings.data.imageTeaserHeight) === 'number' ? settings.data.imageTeaserHeight : undefined;
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
                deferred.reject(error);
            });

            return deferred.promise;
        });
                
        this.init().catch(function (ex) {
            logger.error(ex);
        });
    };
    NewsArticleController.prototype = Object.create(jsnbt.controllers.NodeFormControllerBase.prototype);

    NewsArticleController.prototype.getBreadcrumb = function () {
        var deferred = this.ctor.$q.defer();

        var self = this;

        jsnbt.controllers.NodeFormControllerBase.prototype.getBreadcrumb.apply(this, arguments).then(function (breadcrumb) {

            self.scope.getNodeBreadcrumb(self.isNew() ? { id: 'new', parent: self.scope.id.substring(4) } : self.scope.node, self.scope.prefix).then(function (bc) {

                var offset = self.scope.offset;
                var remaining = 1;
                if (self.scope.prefix === '/content/nodes/news' && self.scope.offset === 3) {
                    offset--;
                    remaining++;
                }

                breadcrumb.splice(offset);

                _.each(bc, function (c) {
                    breadcrumb.push(c);
                });

                deferred.resolve(breadcrumb);

            }, function (ex) {
                deferred.reject(ex);
            });

        }).catch(function (ex) {
            deferred.reject(ex);
        });

        return deferred.promise;
    };

    angular.module("jsnbt-news")
        .controller('NewsArticleController', ['$scope', '$rootScope', '$route', '$location', '$q', '$data', '$logger', NewsArticleController]);

})();