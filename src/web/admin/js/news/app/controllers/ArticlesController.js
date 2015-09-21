;(function () {
    "use strict";

    var NewsArticlesController = function ($scope, $route, $rootScope, $routeParams, $location, $q, $logger, $data, $jsnbt, LocationService, PagedDataService, ModalService) {
        jsnbt.ListControllerBase.apply(this, $scope.getBaseArguments($scope));

        $scope.id = $routeParams.id;
        $scope.parent = undefined;
        $scope.prefix = $route.current.$$route.location ? $route.current.$$route.location.prefix : undefined;
        $scope.offset = _.str.trim($scope.prefix || '', '/').split('/').length;
        
        $scope.title = '';

        $scope.load = function () {

            var loadParent = function () {
                var deferred = $q.defer();

                $data.nodes.get($scope.id).then(function (response) {
                    $scope.parent = response;                    
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            };

            var loadData = function () {
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

            var d = $q.defer();

            $q.all([loadParent(), loadData()]).then(function (results) {
                var parentResult = results[0];
                var dataResults = results[1];
                d.resolve(dataResults);
            }, function (ex) {
                d.reject(ex);
            });

            return d.promise;
        };

        var setLocationFn = $scope.setLocation;
        $scope.setLocation = function () {
            var deferred = $q.defer();

            setLocationFn.apply(this, arguments).then(function (response) {
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

        $scope.back = function () {
            if ($rootScope.location.previous) {
                $location.previous($rootScope.location.previous);
            }
            else {
                $location.previous($location.previous($scope.current.breadcrumb[$scope.current.breadcrumb.length - 2].url));
            }
        };

        $scope.canCreate = function () {
            return true;
        };

        $scope.create = function () {
            var url = $jsnbt.entities['article'].getCreateUrl($scope.parent, $scope.prefix);
            $location.next(url);
        };

        $scope.$watch('parent.title', function () {
            if (!$scope.parent)
                return;

            $scope.title = $scope.parent.title[$scope.defaults.language];
            $scope.setLocation();
        });

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

        $scope.init();

    };
    NewsArticlesController.prototype = Object.create(jsnbt.ListControllerBase.prototype);

    angular.module("jsnbt-news")
        .controller('NewsArticlesController', ['$scope', '$route', '$rootScope', '$routeParams', '$location', '$q', '$logger', '$data', '$jsnbt', 'LocationService', 'PagedDataService', 'ModalService', NewsArticlesController]);
})();