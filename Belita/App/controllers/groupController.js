app.controller('groupController', group);
app.$inject = ['$scope', '$routeParams', '$location', 'groupService', '$timeout'];

function group($scope, $routeParams, $location, groupService, $timeout) {
    $scope.GroupName = "";
    $scope.Description = "";
    $scope.File = "";
    $scope.Model = [];
    $scope.groupType = 1;

    $scope.GetGroupList = function () {

        var myDataPromise = groupService.GetGroupList();
        myDataPromise.then(function (result) {

            $scope.Model = result.data.result_set;
            $scope.BindGrid($scope.Model);
        });
    };
    $scope.BindGrid = function (model) {
        // prepare the data
        var data = new Array();
        for (var i = 0; i < model.length ; i++) {

            var row = {};
            row["groupDesc"] = model[i].groupDesc;
            row["groupName"] = model[i].groupName;
            row["id"] = model[i].id;
            data[i] = row;
        }
        var source =
        {
            localdata: data,
            datatype: "array"
        };
        var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties) {

            return '<a onclick="ShowGroupDetails(' + value + ')"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a><a onclick="DeleteGroup(' + value + ')"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>'

        };
        var dataAdapter = new $.jqx.dataAdapter(source, {
            loadComplete: function (data) { },
            loadError: function (xhr, status, error) { }
        });
        $("#jqxgrid").jqxGrid(
        {
            width: '99%',
            source: dataAdapter,
            pageable: true,
            enableToolTips: true,
            enablebrowserselection: true,
            columns: [
                { text: 'Group Name', datafield: 'groupName', width: '40%' },
                { text: 'Group Description', datafield: 'groupDesc', width: '40%' },
                { text: 'Manage', datafield: 'id', cellsrenderer: cellsrenderer, width: '19%', cellsalign: 'right' }
            ]
        });
    };

    $scope.BindGrid1 = function (model) {
        // prepare the data
        var groupType = 0;
        var columns = [];
        var data = new Array();

        if (model.length > 0) {
            groupType = model[0].groupType;
        }

        for (var i = 0; i < model.length ; i++) {

            var row = {};
            if (groupType == 1) {
                row["name"] = model[i].customerDetailDTOs.name;
                row["mobile"] = model[i].customerDetailDTOs.mobile;
                row["email"] = model[i].customerDetailDTOs.email;
                row["DOB"] =GetDate(new Date(model[i].customerDetailDTOs.DOB));
                row["referralCode"] = model[i].customerDetailDTOs.referralCode;
                columns = column1;
            }
            else if (groupType == 2) {
                row["mobile"] = model[i].mobileNo;
                columns = column2;
            }
            data[i] = row;
        }
        var source =
        {
            localdata: data,
            datatype: "array"
        };

        var dataAdapter = new $.jqx.dataAdapter(source, {
            loadComplete: function (data) { },
            loadError: function (xhr, status, error) { }
        });
        $("#jqxgrid1").jqxGrid(
        {
            width: '99%',
            source: dataAdapter,
            pageable: true,
            columns: columns,
            enableToolTips: true,
            enablebrowserselection: true,
        });
    };

    var column1 = [
        { text: 'Customer Name', datafield: 'name', width: '20%' },
                { text: 'Mobile Number', datafield: 'mobile', width: '20%' },
              { text: 'Email', datafield: 'email', width: '20%' },
                { text: 'Date Of Birth', datafield: 'DOB', width: '25%' },
                { text: 'Referral Code', datafield: 'referralCode', width: '15%' }
    ];

    var column2 = [{ text: 'Mobile Number', datafield: 'mobile', width: '100%' }];

    $scope.ShowGroupModel = function () {
        $scope.ClearFrom();
        $("#dvAddGroup").modal("show");
    };

    $scope.ShowGroupDetails = function (id) {
        //$scope.ClearFrom();
        
        $scope.BindGrid1([]);
        var myDataPromise = groupService.GetGroupDetails(id);
        myDataPromise.then(function (result) {

            $scope.Model = result.data.result_set;
            $scope.BindGrid1($scope.Model);
        });
        $("#dvGroupDetails").modal("show");

    };

    $scope.CreateGroup = function () {
        
        var file = $("#groupFile")[0].files;
        var model = {
            GroupName: $scope.GroupName,
            Description: $scope.Description,
            File: file[0],
            GroupType: $scope.groupType,
        };
        var myDataPromise = groupService.AddGroup(model);
        myDataPromise.then(function (result) {
            $scope.message = result.data.result_set;
            $scope.GetGroupList();
        });
        $('#dvAddGroup').modal('hide');
        HideMessage();
    };

    $scope.DeleteGroup = function () {
        groupService.DeleteGroupById(id);
        $scope.GetGroupList();
    };

    $scope.ClearFrom = function () {
        $scope.GroupName = "";
        $scope.Description = "";
        $scope.Model = [];
        $scope.groupType = 1;
        $("#groupFile").val("");
    };

    function HideMessage() {
        $timeout(function () { $scope.message = ""; }, 3000);
    }

    function GetDate(date) {
        var d = new Date(date);
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var output = (day < 10 ? '0' : '') + day + "/" + (month < 10 ? '0' : '') + month + '/' + d.getFullYear();
        return output;
    }
}

function DeleteGroup(id) {
    var scope = angular.element($("#dvGroup")).scope();
    if (confirm("Are you sure you want to delete ?"))
        scope.DeleteGroup(id);
    scope.$apply();
}
function ShowGroupDetails(id) {
    var scope = angular.element($("#dvGroup")).scope();
    scope.ShowGroupDetails(id);
    scope.$apply();
}

function ShowGroupModel() {
    var scope = angular.element($("#dvGroup")).scope();
    scope.ShowModel();
    scope.$apply();
}