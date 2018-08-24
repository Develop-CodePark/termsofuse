var app = angular.module('codepark',["ngRoute","ngCookies"]);

app.config(function($routeProvider,$locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider
        //Servers the add question page
        .when("/",{
            controller : "questionController",
            templateUrl : "/ejs/question/newquestion.ejs"
        })
        //Serves the answer page
        .when("/answer/:id",{
            controller : "questionController",
            templateUrl : "/ejs/question/answerquestion.ejs"
        })
        //serves the edit answer page
        .when("/edit/:id",{
            controller : "questionController",
            templateUrl : "/ejs/question/editquestion.ejs"
        })
        //serves the view any question page
        .when("/view/:id",{
            controller : "questionController",
            templateUrl : "/ejs/question/viewquestion.ejs"
        })
        //serves the search any question page
        .when("/search?:tag",{
            controller : "questionController",
            templateUrl : "/ejs/question/findquestion.ejs"
        })
    // use the HTML5 History API
    // $locationProvider.html5Mode(true);
});
app.controller('questionController',['$scope','$http','$location','$routeParams','$cookies',function ($scope,$http,$location,$routeParams,$cookies) {


    $(window).scroll(function() {
        var hT = $('#main-question').offset().top,
            // hH = $('#main-question').outerHeight(),
            // wH = $(window).height(),
            wS = $(this).scrollTop();
        // console.log(wS)
        if(window.innerWidth>500){
            if (wS > hT){
                $('.nav-text').text($scope.questionData.questionTitle);
            }else{
                $('.nav-text').text('CodePark');
            }
        }
    });
    //add a new questions
    $scope.addQuestion = function () {
        $http.post('/content/add',$scope.newquestion).then(successCallback, errorCallback);
        function successCallback(response) {
            $scope.contents = response.data;
            if($scope.contents.code === 0){
                window.location.href = '/content/#/view/'+$scope.contents.qid;
            }else{
                //trigger the message modal
                $('#message-detail').text(response.data.message);
                $('#message-dailog').modal('show');
            }
        }
        function errorCallback(error) {
            //trigger the message modal
            $('#message-detail').text('We are unable to connect to the server, please check your internet connectivity!');
            $('#message-dailog').modal('show');
            console.log("Message could not be Obtained !" + error);
        }
    };
    // add answer to any question
    $scope.submitAnswer = function () {
        var par = document.URL.split("/");
        var submitData ={
            content : editor.getValue(),
            language : $('#mode').find("option:selected").attr('id'),
            questionId : par[6]
        };
        console.log(submitData);
        $http.post('/content/answer', submitData).then(successCallback, errorCallback);
        function successCallback(response) {
            console.log(response.data);
            $scope.response = response.data;
            if($scope.response.code === 0){
                window.location.href = '/content/#/view/'+response.data.qid;
            }else{
                //trigger the message modal
                $('#message-detail').text(response.data.message);
                $('#message-dailog').modal('show');
            }
        }
        function errorCallback(error) {
            //trigger the message modal
            $('#message-detail').text('We are unable to connect to the server, please check your internet connectivity!');
            $('#message-dailog').modal('show');
            console.log("Message could not be Obtained !" + error);
        }
    };
    //get question details for view page
    $scope.getQuestionViewDetails = function () {
        var par = document.URL.split("/");
        console.log(par)
        $http.post('/content/questions/'+par[6]).then(successCallback, errorCallback);
        function successCallback(response) {
            /**
             * Serve the data to our dear users
             * Make it look pretty and readable
             */
            //if response code is 1
            if(response.data.code == 1){
                //trigger the message modal
                $('#message-detail').text(response.data.message);
                $('#message-dailog').modal('show');
                // setTimeout(()=>{
                //     window.location.href = '/dashboard';
                // }, 5000)

            }else{
                // to get the question details
                $scope.questionData = response.data.questionData; //question data
                $scope.userData = response.data.user; //user data
                $scope.answerData = response.data.answers; //answer data
                $scope.userLoggedIn = response.data.userFound; //user loggedIn status

                /**
                 * Meta data and title
                 */
                //set the title
                $('title').text($scope.questionData.questionTitle + " | CodePark");
                //set the description
                $('meta[name=description]').attr("content",$scope.questionData.questionTitle + "Get all your answers related to "+ $scope.questionData.tag.join()+"...");
                //set the keywords
                $('meta[name=keywords]').attr("content",$scope.questionData.tag.join()+','+$scope.questionData.questionTitle);
            }
        }
        function errorCallback(error) {
            //trigger the message modal
            $('#message-detail').text('We are unable to connect to the server, please check your internet connectivity!');
            $('#message-dailog').modal('show');
            console.log("Message could not be Obtained !" + error);
        }
    };

    $scope.answeredThisQuestion = function () {
        var par = document.URL.split("/");

        $http.post('/content/questions/'+par[6]).then(successCallback, errorCallback);
        function successCallback(response) {
            console.log(response.data);
            if(response.code === 0){
                $scope.questionData = response.data;

                //checking if the question was answered by this user?
                var notfound = true;
                $scope.questionData.answers.forEach(function(item,index){
                    if(item.answeredBy === $scope.user._id){
                        notfound = false;
                    }else{
                        notFound = true;
                    }
                })
                 return notFound ? false : true;
            }else{
                //trigger the message modal
                $('#message-detail').text(response.data.message);
                $('#message-dailog').modal('show');
            }
        }
        function errorCallback(error) {
            //trigger the message modal
            $('#message-detail').text('We are unable to connect to the server, please check your internet connectivity!');
            $('#message-dailog').modal('show');
            console.log("Message could not be Obtained !" + error);
        }
    };
    $scope.currentUser = function () {
        $http.post('/dashboard/userBasicProfile').then(successCallback, errorCallback);
        function successCallback(response) {
            $scope.currUser = response.data;
        }
        function errorCallback(error) {
            console.log("Message could not be Obtained !" + error);
        }
    };
    /**
     * Follow or unfollow a question
     * @param qid
     */
    $scope.followQuestion = function (uid) {
        $http.get('/content/questions/follow/'+uid).then(successCallback, errorCallback);
        function successCallback(response) {
            if(response.data.code === 1 && response.data.redirect){
                window.location.href = response.data.redirect_url;
            }else if(response.data.code === 0){
                $scope.userData.user_follows_question = response.data.follower;
                $scope.userData.question_followedBy += response.data.follower ? 1 : -1;
            }else{
                //trigger the message modal
                $('#message-detail').text(response.data.message);
                $('#message-dailog').modal('show');
            }
        }
        function errorCallback(error) {
            //trigger the message modal
            $('#message-detail').text('We are unable to connect to the server, please check your internet connectivity!');
            $('#message-dailog').modal('show');
            console.log("Message could not be Obtained !" + error);
        }
    };

    /**
     * React to an answer
     * @param qid
     */
    $scope.react = function (answerID,action,index) {
        $http.get('/content/questions/react/'+action+'/?q='+$scope.questionData.uid+'&a='+answerID,$scope.payload).then(successCallback, errorCallback);
        function successCallback(response) {
            if(response.data.redirect){
                window.location.href = response.data.redirect_url;
            }else if(response.data.code === 0){
                switch(action){
                    case 'upvote':
                        $scope.answerData[index].user_upvoted = response.data.upvoted;
                        $scope.answerData[index].upvotes += response.data.upvoted ? 1 : -1;
                        if($scope.answerData[index].user_downvoted && response.data.upvoted){
                            $scope.answerData[index].downvotes -= 1;
                            $scope.answerData[index].user_downvoted = response.data.downvoted;
                        }
                        break;
                    case 'downvote':
                        $scope.answerData[index].user_downvoted = response.data.downvoted;
                        $scope.answerData[index].downvotes += response.data.downvoted ? 1 : -1;
                        if($scope.answerData[index].user_upvoted && response.data.downvoted){
                            $scope.answerData[index].upvotes -= 1;
                            $scope.answerData[index].user_upvoted = response.data.upvoted;
                        }
                        break;
                    case 'shoutout':
                        $scope.answerData[index].user_shoutout = response.data.shoutout;
                        $scope.answerData[index].shoutout += response.data.shoutout ? 1 : -1;
                        break;
                }
            }else{
                //trigger the message modal
                $('#message-detail').text(response.data.message);
                $('#message-dailog').modal('show');
            }
        }
        function errorCallback(error) {
            //trigger the message modal
            $('#message-detail').text('We are unable to connect to the server, please check your internet connectivity!');
            $('#message-dailog').modal('show');
            console.log("Message could not be Obtained !" + error);
        }
    };
    /**
     *
     * @param {string} qid
     */
    $scope.deleteQuestion = function (qid) {
        $http.get('/content/questions/delete/'+qid).then(successCallback, errorCallback);
        function successCallback(response) {
            if(response.data.code === 0){
                window.location.href = '/dashboard';
                $scope.error = false;
            }else{
                $scope.errorMessage = response.data.message;
                $scope.error = true;
                $('#message-dailog').show();
            }
        }
        function errorCallback(error) {
            console.log("Message could not be Obtained !" + error);
        }
    };

    /**
     * @param {string} answerID
     * @param {string} qid
     */
    $scope.deleteAnswer = function (queUID,ansUID) {
        $http.get('/content/questions/answers/delete/'+queUID+'?a='+ansUID).then(successCallback, errorCallback);
        function successCallback(response) {
            if(response.data.code === 0){
                location.reload();
                $scope.error = false;
            }else{
                $scope.errorMessage = response.data.message;
                $scope.error = true;
                $('#message-dailog').show();
            }
        }
        function errorCallback(error) {
            console.log("Message could not be Obtained !" + error);
        }
    };
    /**
     *To search any data
     * @param {string} qid
     */
    $scope.search = function () {
        //var searchBy = //$('params').selected();
        $http.post('/content/search',$scope.searchData).then(successCallback, errorCallback);
        function successCallback(response) {
            if(response.data.code === 0){
                $scope.questionData = response.data.content;
                $scope.error = false;
            }else{
                $scope.errorMessage = response.data.message;
                $scope.error = true;
                $('#message-dailog').show();
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

app.directive('ngAllowTab', function () {
    return function (scope, element, attrs) {
        element.bind('keydown', function (event) {
            if (event.which == 9) {
                event.preventDefault();
                var start = this.selectionStart;
                var end = this.selectionEnd;
                element.val(element.val().substring(0, start)
                    + '\t' + element.val().substring(end));
                this.selectionStart = this.selectionEnd = start + 1;
                element.triggerHandler('change');
            }
        });
    };
});
