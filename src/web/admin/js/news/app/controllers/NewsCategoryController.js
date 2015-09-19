;(function () {
    "use strict";

    var NewsCategoryController = function ($scope, $rootScope, $routeParams, $location, $q, $logger, $data, LocationService, PagedDataService, ModalService) {
        jsnbt.ListControllerBase.apply(this, $scope.getBaseArguments($scope));

        $scope.id = $routeParams.id;
        $scope.parent = undefined;

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
                        name: 1
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

        $scope.setLocation = function () {
            var breadcrumb = LocationService.getBreadcrumb();

            if ($scope.parent) {
                breadcrumb = breadcrumb.slice(0, breadcrumb.length - 1);
            }

            $scope.getNodeBreadcrumb($scope.parent).then(function (bc) {
                var newBreadcrumb = _.map(bc, function (x) { x.url = '/modules/news' + x.url; return x; });
                
                $scope.current.setBreadcrumb(_.union(breadcrumb, newBreadcrumb));
            }, function (ex) {
                throw ex;
            });
        };

        $scope.back = function () {
            if ($rootScope.location.previous) {
                $location.previous($rootScope.location.previous);
            }
            else {
                $location.previous('/modules/news');
            }
        };

        $scope.canCreate = function () {
            return true;
        };

        $scope.create = function () {
            $location.next('/modules/news/article/new-' + $scope.parent.id);
        };

        $scope.$watch('parent.name', function () {
            if (!$scope.parent)
                return;

            $scope.title = 'news: ' + $scope.parent.name;
            $scope.setLocation();
        });

        $scope.gridFn = {

            edit: function (article) {
                $location.next('/modules/news/article/' + article.id);
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
    NewsCategoryController.prototype = Object.create(jsnbt.ListControllerBase.prototype);

    angular.module("jsnbt-news")
        .controller('NewsCategoryController', ['$scope', '$rootScope', '$routeParams', '$location', '$q', '$logger', '$data', 'LocationService', 'PagedDataService', 'ModalService', NewsCategoryController]);
})();