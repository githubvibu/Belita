app.controller('crouserController', crouser);
app.$inject = ['$scope', 'ngCookies', '$location', 'crouserService', 'commonService', '$timeout', 'authService', 'app'];

function crouser($scope, $cookieStore, $location, crouserService, commonService, $timeout, authService, app) {
    $scope.message = "";
    $scope.Title = "Cro user";
    $scope.CroUserName = "";
    $scope.Password = "";
    $scope.ConfirmPassword = "";
    $scope.RoleId = "";
    $scope.Id = 0;
    $scope.required = true;
    $scope.EncryptedPassword = "";
    
    $scope.GetRoles = function () {
        commonService.CheckPermissionData();
        if (authService.GetCredentials().role == 1) {
            $scope.VIEW = app.admin.CroUser.View;
            $scope.EDIT = app.admin.CroUser.Edit;
            $scope.CREATE = app.admin.CroUser.Create;
            $scope.DELETE = app.admin.CroUser.Delete;
        } else if (authService.GetCredentials().role == 2) {
            $scope.VIEW = app.executive.CroUser.View;
            $scope.EDIT = app.executive.CroUser.Edit;
            $scope.CREATE = app.executive.CroUser.Create;
            $scope.DELETE = app.executive.CroUser.Delete;
        }
    };
    $scope.GetRoles();

    $scope.GetUser = function () {
        
        var dataPromise = crouserService.GetCroUserList();
        dataPromise.then(function (result) {
            $scope.BindCroUser(result.data.result_set);
        });
    };

    $scope.CreateCroUser = function () {
        $scope.ClearForm();
        $("#dvAddCroUSer").modal("show");
    };

    $scope.SaveCroUser = function () {
        var dataPromise = crouserService.AddCroUser($scope.GetModel());
        dataPromise.then(function (result) {
            if (result.data.result_set != null || result.data.result_set != undefined) {
                if ($scope.Id==0)
                    $scope.message = "User Added Successfully";
                else
                    $scope.message = "User Updated Successfully";
                $scope.GetUser();
            } else {
                $scope.message = result.data.error.message;
            }
            $scope.HideMesssage();
            $("#dvAddCroUSer").modal("hide");
            $("#dvEditCroUSer").modal("hide");
        });
    };

    $scope.HideMesssage = function () {
        $timeout(function () { $scope.message = ""; }, 3000);
    };

    $scope.GetModel = function () {
        var model = {};
        if ($scope.Id == 0) {
            model = {
                id: $scope.Id,
                userName: $scope.CroUserName,
                userRoleTypeDTO: [
                  {
                      id: $scope.RoleId
                  }
                ],
                password: $scope.Password
            };
        }
        else
        {
            model = {
                id: $scope.Id,
                userName: $scope.CroUserName,
                userRoleTypeDTO: [
                  {
                      id: $scope.RoleId
                  }
                ],
                password: $scope.Password == "" ? $scope.EncryptedPassword : $scope.Password
            };
        }

        return model;
    }

    $scope.BindCroUser = function (model) {
        var data = new Array();
        for (var i = 0; i < model.length ; i++) {
            var row = {};
            row["userName"] = model[i].userName;
            row["role"] = model[i].userRoleTypeDTO[0].roleDescription;
            row["id"] = model[i].id;
            data[i] = row;
        }
        var source =
        {
            localdata: data,
            datatype: "array",
            pagenum: $scope.currentPageIndex
        };
        var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties) {
            return '<a onclick="ShowUpdateCroUser(\'' + value + '\')"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></a>';
        };
        var dataAdapter = new $.jqx.dataAdapter(source, {
            loadComplete: function (data) {
                $scope.Spinner = false;
            },
            loadError: function (xhr, status, error) { }
        });

        $("#jqxgrid").jqxGrid(
        {
            width: '99%',
            source: dataAdapter,
            pageable: true,
            sortable: true,
            height: '400px',
            enabletooltips: true,
            enablebrowserselection: true,
            columns: [
                 { text: 'User Name', datafield: 'userName', width: '50%' },
                { text: 'Role', datafield: 'role', width: '25%' },
                { text: 'Edit', datafield: 'id', cellsrenderer: cellsrenderer, width: '25%' }
            ]
        });
    };

    $scope.ShowUpdateCroUser = function (id) {
        $scope.ClearForm();
        $("#dvEditCroUSer").modal("show");
        var dataPromise = crouserService.GetCroUserById(id);
        dataPromise.then(function (result) {
            if (result.data.result_set != null && result.data.result_set != undefined) {
                $scope.CroUserName = result.data.result_set.userName;
                $scope.RoleId =String(result.data.result_set.userRoleTypeDTO[0].id);
                $scope.Id = result.data.result_set.id;
                $scope.EncryptedPassword = result.data.result_set.password;
                $scope.required = true;
            }
        });
    }

    $scope.ClearForm = function () {
        $scope.CroUserName = "";
        $scope.Password = "";
        $scope.RoleId = "";
        $scope.Id = 0;
        $scope.ConfirmPassword = "";
        $scope.required = true;
        $scope.EncryptedPassword = "";
    };
}

function ShowUpdateCroUser(id) {
    var scope = angular.element($("#dvCroUser")).scope();
    scope.ShowUpdateCroUser(id);
    scope.$apply();
}
