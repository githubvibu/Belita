app.controller('headerController', header);
app.$inject = ['$scope', '$routeParams', '$location', 'authService', 'commonService', 'app'];

function header($scope, $routeParams, $location, authService, commonService, app) {
    $scope.Logout = function () {
        
        authService.ClearCredentials();
        $location.path('/login');
    }

    $scope.GetRoles = function () {
        commonService.CheckPermissionData();
        if (authService.GetCredentials().role == 1) {
            $scope.VIEW = app.admin.CroUser.View;
            $scope.EDIT = app.admin.CroUser.Edit;
            $scope.CREATE = app.admin.CroUser.Create;
            $scope.DELETE = app.admin.CroUser.Delete;
            $scope.VIEWNOTIFICATION = app.admin.Notification.View;
        } else if (authService.GetCredentials().role == 2) {
            $scope.VIEW = app.executive.CroUser.View;
            $scope.EDIT = app.executive.CroUser.Edit;
            $scope.CREATE = app.executive.CroUser.Create;
            $scope.DELETE = app.executive.CroUser.Delete;
            $scope.VIEWNOTIFICATION = app.executive.Notification.View;
        }
    };
}