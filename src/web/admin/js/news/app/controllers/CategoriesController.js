;(function () {
    "use strict";
    
    jsnbt.NewsCategoriesController = function ($scope, $rootScope, $route, $location, $data, $jsnbt, $logger, ModalService, AuthService) {
        jsnbt.controllers.TreeControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var self = this;

        var logger = $logger.create('NewsCategoriesController');
        
        $scope.canViewSettings = function () {
            return $scope.prefix === '/modules/news' && AuthService.isInRole($scope.current.user, 'sa');
        };


        $scope.viewSettings = function () {
            $location.next('/modules/news/settings');
        };

        $scope.canCreate = function () {
            return AuthService.isAuthorized($scope.current.user, 'nodes:articleList', 'C');
        };


        $scope.create = function () {
            var url = $jsnbt.entities['articleList'].getCreateUrl(undefined, $scope.prefix);
            $location.next(url);
        };

        $scope.treeFn = {

            canOpen: function (node) {
                return AuthService.isAuthorized($scope.current.user, 'nodes:' + node.entity, 'R');
            },

            open: function (node) {
                var url = $jsnbt.entities[node.entity].getViewUrl(node, $scope.prefix);
                $location.next(url);
            },

            canCreate: function (node) {
                return AuthService.isAuthorized($scope.current.user, 'nodes:' + node.entity, 'C');
            },

            create: function (node) {
                var url = $jsnbt.entities['articleList'].getCreateUrl(node, $scope.prefix);
                $location.next(url);
            },

            canEdit: function (node) {
                return AuthService.isAuthorized($scope.current.user, 'nodes:' + node.entity, 'U');
            },

            edit: function (node) {
                var url = $jsnbt.entities[node.entity].getEditUrl(node, $scope.prefix);
                $location.next(url);
            },

            canDelete: function (node) {
                return AuthService.isAuthorized($scope.current.user, 'nodes:' + node.entity, 'D');
            },

            delete: function (node) {
                $data.nodes.get({
                    hierarchy: node.id,
                    id: {
                        $ne: [node.id]
                    },
                    $limit: 1
                }).then(function (nodes) {

                    if (nodes.length > 0) {

                        ModalService.prompt(function (x) {
                            x.title('oops');
                            x.message('this category is not empty and cannot be deleted');
                        }).then(function (result) {

                        }).catch(function (ex) {
                            throw ex;
                        });

                    }
                    else {

                        ModalService.confirm(function (x) {
                            x.title('are you sure you want to permanently delete the category ' + node.title[$scope.defaults.language] + '?');
                        }).then(function (result) {
                            if (result) {
                                $data.nodes.del(node.id).then(function (nodeDeleteResults) {
                                    self.remove(node);
                                }, function (nodeDeleteError) {
                                    deferred.reject(nodeDeleteError);
                                });
                            }
                        });
                    }

                }).catch(function (ex) {
                    deferred.reject(ex);
                });
            }

        };

        this.init().catch(function (ex) {
            logger.error(ex);
        });

    };
    jsnbt.NewsCategoriesController.prototype = Object.create(jsnbt.controllers.TreeControllerBase.prototype);

    angular.module("jsnbt-news")
        .controller('NewsCategoriesController', ['$scope', '$rootScope', '$route', '$location', '$data', '$jsnbt', '$logger', 'ModalService', 'AuthService', jsnbt.NewsCategoriesController]);
})();