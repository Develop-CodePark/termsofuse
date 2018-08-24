/**
 * Created by Raj Chandra on 07-02-2018.
 */
var app = angular.module('codepark',["ngRoute"]);

app.controller('dashboardController',['$scope','$http','$location',function ($scope,$http,$location) {
    console.log('dashboard controller loaded..');
    $scope.getReleventContent = function () {
        $http.post('/dashboard/content/all').then(successCallback, errorCallback);
        function successCallback(response) {
            $scope.contents = response.data;
            if($scope.contents.code === 0){
                window.location.href = '/dashboard';
            }
        }
        function errorCallback(error) {
            console.log("Message could not be Obtained !" + error);
        }
    };
    $scope.userBasicProfile = function () {
        $http.post('/dashboard/userBasicProfile').then(successCallback, errorCallback);
        function successCallback(response) {
            $scope.user = response.data;
            //set the title
            $('title').text($scope.user.name.fullName + " - Dashboard | CodePark");
        }
        function errorCallback(error) {
            console.log("Message could not be Obtained !" + error);
        }
    };
    $scope.searchPredictor = function () {
        $http.get('/dashboard/searchPredictor?q='+$scope.query).then(successCallback, errorCallback);
        function successCallback(response) {
            $scope.results = response.data;
            console.log($scope.results)
        }
        function errorCallback(error) {
            console.log("Message could not be Obtained !" + error);
        }
    };
    $scope.searchResults = function () {
        $http.get('/dashboard/search?q='+$scope.query).then(successCallback, errorCallback);
        function successCallback(response) {
            $scope.results = response.data;
            console.log($scope.results)
        }
        function errorCallback(error) {
            console.log("Message could not be Obtained !" + error);
        }
    };
}]);

angular.module('codepark').directive('loader', loader);
/**
 * Defines loading spinner behaviour
 *
 * @param {obj} $http
 * @returns {{restrict: string, link: Function}}
 */
function loader($http) {
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            scope.$watch(function() {
                return $http.pendingRequests.length;
            }, function(isLoading) {
                if (isLoading) {
                    $(element).show();
                } else {
                    $(element).hide();
                }
            });
        }
    };
}