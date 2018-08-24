/**
 * Created by Raj Chandra on 06-02-2018.
 */
var app = angular.module('codepark',["ngRoute"]);

app.config(function($routeProvider,$locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider
        .when("/", {
            templateUrl: "/ejs/index/main.ejs"
        })
        .when("/about", {
            templateUrl: "/ejs/index/about.ejs"
        })
        .when("/team", {
            templateUrl: "/ejs/index/team.ejs"
        })
        .when("/contact", {
            templateUrl: "/ejs/index/contact.ejs"
        })
        .when("/10daysofcode",{
            templateUrl : "/ejs/index/10daysofcode.ejs"
        })
        .when("/privacypolicy",{
            templateUrl : "/ejs/index/privacyPolicy.ejs"
        })
        .when("/termsofservice",{
            templateUrl : "/ejs/index/termsOfService.ejs"
        })
});
app.controller('authController',['$scope','$http','$location',function ($scope,$http,$location) {

    $scope.getRegistered = function () {
        $scope.msgReg = {
            msg : "Saving your data.Pls wait...",
            code : 2
        };
        $scope.registerData.googleCaptcha = $('#g-recaptcha-response').val();
        $http.post('/auth/save', $scope.registerData).then(successCallback, errorCallback);

        function successCallback(response) {
            $scope.msgReg = {
                msg : response.data.message,
                code : response.data.code
            };
        }

        function errorCallback(error) {
            console.log("Message could not be Obtained !" + error);
        }
    };
    $scope.getLogin = function () {
        $scope.msgLogin = {
            msg : "Verifying credentials...",
            code : 2
        };
        $http.post('/auth/verifyUser', $scope.loginData).then(successCallback, errorCallback);
        function successCallback(response) {
            $scope.resData = response.data;
            $scope.msgLogin = {
                msg : $scope.resData.message,
                code : $scope.resData.code
            };
            !$scope.resData.code?window.location.href = '/dashboard':'';
        }

        function errorCallback(error) {
            console.log("Message could not be Obtained !" + error);
        }
    };
    $scope.forgotEmailGen = function () {
        $scope.msgfp = {
            msg : "Searching for your EMAIL ID in our database..",
            code : 2
        };
        $http.post('/forgotPassword', $scope.fp).then(successCallback, errorCallback);

        function successCallback(response) {
            $scope.resData = response.data; //getting response
            $scope.msgfp = {
                msg : $scope.resData.message,
                code : $scope.resData.code
            };
        }

        function errorCallback(error) {
            console.log("Message could not be Obtained !" + error);
        }
    };
    $scope.emailGen = function () {

        $http.post('/resend', $scope.participant).then(successCallback, errorCallback);

        function successCallback(response) {
            $scope.resData = response.data; //getting response
            switch ($scope.resData.code) {
                case 0:
                    $scope.msg = $scope.resData.message;
                    break;
                case 1:
                    $scope.msg = $scope.resData.message;
                    break
            }
        }

        function errorCallback(error) {
            console.log("Message could not be Obtained !" + error);
        }
    };
    $scope.resetPassword = function () {
        var par = document.URL.split("/");
        var token = par[4];
        $http.post('/resetPassword/'+token,$scope.user).then(successCallback,errorCallback);
        function successCallback(response) {
            $scope.resData = response.data; //getting response
            switch ($scope.resData.code) {
                case 0:
                    $scope.msg = $scope.resData.message;
                    window.location.href = '/';
                    break;
                case 1:
                    $scope.msg = $scope.resData.message;
                    break;
            }
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