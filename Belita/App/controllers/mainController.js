app.controller('mainController', main);
app.$inject = ['$scope', '$routeParams', '$location', 'authService'];

function main($scope, $routeParams, $location, authService) {
    $scope.username = null;
    $scope.password = null;
    $scope.errorMessage = null;
    $scope.message = null;
    $scope.isEmailValid = true;
    $scope.rememberMe = false;

    $scope.RedirectDashBoard = function () {
        
        authService.Login($scope.username, $scope.password, function (response) {
            if (response.result_set != null || response.result_set != undefined)
            {
                authService.SetCredentials($scope.username, $scope.password, true, response.result_set.userRoleTypeDTO[0].id, true,response.result_set.id);
                $location.path('/');
            }
            else
            {
                $scope.errorMessage = response.error.message;
            }
            
        });
    }
    function HideMessage() {
        $timeout(function () { $scope.errorMessage = ""; }, 3000);
    }
}