
app.controller('appController', appController);
app.$inject = ['$scope', 'ngCookies', '$location', 'authService'];

function appController($scope, $cookieStore, $location, authService) {
    $scope.logout = function () {
        authService.Logout();
        $location.path('/');
    };

    $scope.loggedIn = authService.IsAuthenticated();
}