;(function () {
    "use strict";

    var NewsArticlesController = function ($scope, $rootScope, $route, $routeParams, $location, $q, $logger, $data, $jsnbt, LocationService, PagedDataService, ModalService, AuthService) {
        jsnbt.controllers.ListControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var self = this;

        var logger = $logger.create('NewsArticlesController');

        $scope.id = $routeParams.id;
        $scope.parent = undefined;
        
        $scope.title = '';

        $scope.offset = _.str.trim($scope.prefix || '', '/').split('/').length;

        this.enqueue('loading', '', function () {
            var deferred = $q.defer();

            $data.nodes.get($scope.id).then(function (response) {
                $scope.parent = response;
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        });
                
        $scope.$watch('parent.title', function () {
            if (!$scope.parent)
                return;

            $scope.title = $scope.parent.title[$scope.defaults.language];
        });

        $scope.canCreate = function () {
            return AuthService.isAuthorized($scope.current.user, 'nodes:article', 'C');
        };

        $scope.create = function () {
            var url = $jsnbt.entities['article'].getCreateUrl($scope.parent, $scope.prefix);
            $location.next(url);
        };
        
        $scope.gridFn = {

            canEdit: function (article) {
                return AuthService.isAuthorized($scope.current.user, 'nodes:article', 'U');
            },

            edit: function (article) {
                var url = $jsnbt.entities[article.entity].getEditUrl(article, $scope.prefix);
                $location.next(url);
            },

            canDelete: function (article) {
                return AuthService.isAuthorized($scope.current.user, 'nodes:article', 'D');
            },

            delete: function (article) {

                var deletePromise = function (data) {
                    var deferred = $q.defer();

                    ModalService.confirm(function (x) {
                        x.title('are you sure you want to delete the article ' + data.name + '?');
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
                    self.remove(article);
                }, function (error) {
                    logger.error(error);
                });
            }

        };

        this.init().catch(function (ex) {
            logger.error(ex);
        });

    };
    NewsArticlesController.prototype = Object.create(jsnbt.controllers.ListControllerBase.prototype);

    NewsArticlesController.prototype.load = function () {
        var deferred = this.ctor.$q.defer();

        this.ctor.PagedDataService.get(this.ctor.$jsnbt.db.nodes.get, {
            parent: this.scope.id,
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

    NewsArticlesController.prototype.getBreadcrumb = function () {
        var deferred = this.ctor.$q.defer();

        var self = this;

        jsnbt.controllers.ListControllerBase.prototype.getBreadcrumb.apply(this, arguments).then(function (breadcrumb) {

            self.scope.getNodeBreadcrumb(self.scope.parent, self.scope.prefix).then(function (bc) {

                var offset = self.scope.offset;
                if (self.scope.prefix === '/content/nodes/news' && self.scope.offset === 3)
                    offset--;

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
        .controller('NewsArticlesController', ['$scope', '$rootScope', '$route', '$routeParams', '$location', '$q', '$logger', '$data', '$jsnbt', 'LocationService', 'PagedDataService', 'ModalService', 'AuthService', NewsArticlesController]);
})();