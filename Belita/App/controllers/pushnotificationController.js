app.controller('pushnotificationController', pushnotification);
app.$inject = ['$scope', '$routeParams', '$location', 'pushnotificationService', 'commonService', '$timeout', 'app', 'authService'];

function pushnotification($scope, $routeParams, $location, pushnotificationService, commonService, $timeout, app, authService) {

    //$scope.dataType = 1;
    $scope.sent = 2;
    $scope.mobileNo = "";
    $scope.text = "";
    $scope.message = "";
    $scope.groupNameId = "";
    $scope.groupName = [];
    $scope.Spinner = false;
    
    $scope.GetNotification = function () {
        $scope.GetGroupList();
        $scope.GetRoles();
    };
    $scope.GetRoles = function () {
        commonService.CheckPermissionData();
        if (authService.GetCredentials().role == 1) {
            $scope.VIEW = app.admin.Notification.View;
        } else if (authService.GetCredentials().role == 2) {
            $scope.VIEW = app.executive.Notification.View;
        }
    };

    $scope.uploadImage = function () {
        
        var fileSize = $("#file")[0].files[0].size;
        var size = (fileSize / (1024)) / 1024;
        if (size > 2)
        {
            $("#file").val("");
            $scope.message = "File size exceeds max limit of 2MB";

            $scope.$apply();
            HideMessage();
        }
        
    };

    

    $scope.SendToAll = function () {
        $scope.groupNameId = "";
            $scope.mobileNo = "";
    };

    $scope.SendMobileNo = function () {
        $scope.groupNameId = "";
       
    };

    $scope.SendGroup = function () {
        $scope.mobileNo = "";

    };
    
    $scope.SendText = function () {
        $("#file").val("");
    };

    $scope.SendImage = function () {
        $scope.text = "";
    };

    $scope.Submit = function () {
        
        
        var file = $("#file")[0].files;
        var msg = $scope.text;
        var mobNo = [];
        var groupId = $scope.groupNameId;
        var mob = $scope.mobileNo.split(',');
        if (mob.length > 1) {
            mobNo.push(mob)
        }
        else {
            for (var i = 0; i < mob.length; i++) {
                mobNo.push(mob[i]);
            }
        }
        //var model = $scope.GetModel();
        var myDataPromise = pushnotificationService.SaveFile(msg, file, mobNo, groupId);
        myDataPromise.then(function (result) {
           
            $scope.Spinner = true;
            $scope.message = result.data.msg.message;
           
            HideMessage();
            ClearForm();
            $scope.Spinner = false;
        });
    };
    $scope.GetGroupList = function () {
        
        var myDataPromise = pushnotificationService.GetGroupName();
        myDataPromise.then(function (result) {
            for (var i = 0; i < result.data.result_set.length; i++) {
                var group = {
                    id: result.data.result_set[i].id,
                    name: result.data.result_set[i].groupName
                }
                $scope.groupName.push(group);
            }
        });
    };
    function HideMessage() {
        $timeout(function () { $scope.message = ""; $scope.Spinner = false; }, 3000);
    }
    function ClearForm() {
        //$scope.dataType = 1;
        $scope.sent = 2;
        $scope.mobileNo = [];
        $scope.text = "";
        $scope.groupNameId = "";
        //$scope.message = "";
        $("#file").val("");
    }
    //$scope.GetModel = function () {

    //    var mobNo = [];
    //    var mob = $scope.mobileNo.split(',');
    //    if (mob.length > 1) {
    //        mobNo.push(mob)
    //    }
    //    else {
    //        for (var i = 0; i < mob.length; i++) {
    //            mobNo.push(mob[i]);
    //        }
    //    }
    //    
    //    //var file = $("#file")[0];
    //   // var file = $("#file")[0].files;
    //    var model = {
    //        image: {},
    //        mobileNos: mobNo,
    //        message: $scope.text
    //    };
    //    return model;


    //}


}