//app.controller('aboutController', function ($scope) {
//    $scope.message = "Now viewing about!";
//});

app.controller('dashboardController', about);
app.$inject = ['$scope', '$routeParams', '$location', 'authService'];

function about($scope, $routeParams, $location, authService) {
    $scope.message = "Now viewing dashboard!";
}