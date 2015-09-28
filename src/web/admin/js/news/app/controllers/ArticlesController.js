;(function () {
    "use strict";

    var NewsArticlesController = function ($scope, $route, $rootScope, $routeParams, $location, $q, $logger, $data, $jsnbt, LocationService, PagedDataService, ModalService) {
        jsnbt.ListControllerBase.apply(this, $scope.getBaseArguments($scope));

        var logger = $logger.create('NewsArticlesController');

        $scope.id = $routeParams.id;
        $scope.parent = undefined;
        
        $scope.title = '';

        $scope.offset = _.str.trim($scope.prefix || '', '/').split('/').length;

        $scope.enqueue('loading', function () {
            var deferred = $q.defer();

            $data.nodes.get($scope.id).then(function (response) {
                $scope.parent = response;
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        });

        $scope.load = function () {
            var deferred = $q.defer();

            PagedDataService.get(jsnbt.db.nodes.get, {
                parent: $scope.id,
                entity: 'article',
                $sort: {
                    'content.date': -1
                }
            }).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        var getBreadcrumbFn = $scope.getBreadcrumb;
        $scope.getBreadcrumb = function () {
            var deferred = $q.defer();

            getBreadcrumbFn.apply(this, arguments).then(function (response) {
                $scope.getNodeBreadcrumb($scope.parent, $scope.prefix).then(function (bc) {

                    var offset = $scope.offset;
                    if ($scope.prefix === '/content/nodes/news' && $scope.offset === 3)
                        offset--;
                    
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
        
        $scope.$watch('parent.title', function () {
            if (!$scope.parent)
                return;

            $scope.title = $scope.parent.title[$scope.defaults.language];
        });

        $scope.canCreate = function () {
            return true;
        };

        $scope.create = function () {
            var url = $jsnbt.entities['article'].getCreateUrl($scope.parent, $scope.prefix);
            $location.next(url);
        };
        
        $scope.gridFn = {

            edit: function (article) {
                var url = $jsnbt.entities[article.entity].getEditUrl(article, $scope.prefix);
                $location.next(url);
            },

            delete: function (article) {

                var deletePromise = function (data) {
                    var deferred = $q.defer();

                    ModalService.open({
                        title: 'are you sure you want to delete the article ' + data.name + '?',
                        controller: 'DeletePromptController',
                        template: 'tmpl/core/modals/deletePrompt.html'
                    }).then(function (confirmed) {
                        if (confirmed) {
                            $data.nodes.get(data.id).then(function (response) {
                                $data.nodes.del(response.id).then(function (result) {
                                    deferred.resolve(result);
                                }, function (ex) {
                                    deferred.reject(ex);
                                });
                            }, function (error) {
                                deferred.reject(error);
                            });
                        }
                    });

                    return deferred.promise;
                }

                deletePromise(article).then(function () {
                    $scope.remove(article);
                }, function (error) {
                    logger.error(error);
                });
            }

        };

        $scope.init().catch(function (ex) {
            logger.error(ex);
        });

    };
    NewsArticlesController.prototype = Object.create(jsnbt.ListControllerBase.prototype);

    angular.module("jsnbt-news")
        .controller('NewsArticlesController', ['$scope', '$route', '$rootScope', '$routeParams', '$location', '$q', '$logger', '$data', '$jsnbt', 'LocationService', 'PagedDataService', 'ModalService', NewsArticlesController]);
})();