app.controller('otherSettingsController', otherSettings);
app.$inject = ['$scope', '$routeParams', '$location', 'otherSettingsService', 'app', 'commonService', '$timeout', 'authService', 'app'];
function otherSettings($scope, $routeParams, $location, otherSettingsService, app, commonService, $timeout, authService, app) {
    //register settings
    $scope.messageRegister = "";
    $scope.IsActive = "";
    $scope.bmAmount = "";
    $scope.bmExpiry = "";

    //referral Settings
    $scope.messageReferral = "";
    $scope.IsActiveReferee = "";
    $scope.referrerBmAmount = "";
    $scope.referrerBmExpiry = "";
    $scope.refereeBmAmount = "";
    $scope.refereeBmExpiry = "";

    //appversion
    $scope.messageAppversion = "";
    $scope.id = "";
    $scope.appVersionName = "";
    $scope.appDescriptionDetail = "";
    $scope.IsMandatory = "";
    $scope.model = [];

    //premiumtime
    $scope.messagePremium = "";
    $scope.time = "";
    $scope.premiumCost = "";
    $scope.Premium = "";
    $scope.premiumIdUpdate = "";

    //Basecenter
    $scope.basecenter = "";
    $scope.cityId = "";
    $scope.city = [];

    //refferel text
    $scope.refferelText = "";
    $scope.messageRefferelText = "";
    $scope.smsTag = "";

    $scope.VIEW = false;
    $scope.EDIT = false;
    $scope.CREATE = false;
    $scope.DELETE = false;
    $scope.EDIT_REGISTERSETTINGS = false;
    $scope.EDIT_REFERERSETTINGS = false;

    $scope.GetRoles = function () {

        commonService.CheckPermissionData();
        if (authService.GetCredentials().role == 1) {
            $scope.VIEW = app.admin.TimeSlots.View;
            $scope.EDIT = app.admin.TimeSlots.Edit;
            $scope.CREATE = app.admin.TimeSlots.Create;
            $scope.DELETE = app.admin.TimeSlots.Delete;
            $scope.EDIT_RegisterSettings = app.admin.Edit.RegisterSettings;
            $scope.EDIT_ReffererSettings = app.admin.Edit.ReffererSettings;
        } else if (authService.GetCredentials().role == 2) {
            $scope.VIEW = app.executive.TimeSlots.View;
            $scope.EDIT = app.executive.TimeSlots.Edit;
            $scope.CREATE = app.executive.TimeSlots.Create;
            $scope.DELETE = app.executive.TimeSlots.Delete;
            $scope.EDIT_RegisterSettings = app.executive.Edit.RegisterSettings;
            $scope.EDIT_ReffererSettings = app.executive.Edit.ReffererSettings;
        }
    };

    $scope.GetSettings = function () {
        $scope.GetRoles();
    };

    $scope.GetAppVersionSettings = function () {
        var myDataPromise = otherSettingsService.GetAppVersionDetails();
        myDataPromise.then(function (result) {
            $scope.Model = result.data.result_set;
            $scope.BindGrid($scope.Model);
        });
    };

    $scope.GetRegisterSettings = function () {
        var myDataPromise = otherSettingsService.GetRegisterSettingsDetails();
        myDataPromise.then(function (result) {
            $scope.Model = result.data.result_set;
            $scope.BindGrid1($scope.Model);

        });
    };
    $scope.GetReferrerSettings = function () {
        var myDataPromise = otherSettingsService.GetRegisterSettingsDetails();
        myDataPromise.then(function (result) {
            $scope.Model = result.data.result_set;
            $scope.BindGrid2($scope.Model);
        });
    };

    $scope.GetPremiumTime = function () {
        var myDataPromise = otherSettingsService.GetPremiumDetails();
        myDataPromise.then(function (result) {
            $scope.Model = result.data.result_set;
            $scope.BindGrid3($scope.Model);
        });
    };
    $scope.SaveRegisterSettings = function () {

        $scope.Spinner = true;
        var model = $scope.GetRegisterModel();
        var myDataPromise = otherSettingsService.RegisterSettings(model);
        myDataPromise.then(function (result) {
            $("#dvAddRegisterSettings").modal("hide");
            $scope.GetRegisterSettings();
            $scope.messageRegister = "Settings registered successfully";
            HideMessage();
        });
    };

    $scope.SaveReferralSettings = function () {

        $scope.Spinner = true;
        var model = $scope.GetRegisterModel();
        var myDataPromise = otherSettingsService.ReferrerSettings(model);
        myDataPromise.then(function (result) {
            $("#dvAddReferralSetting").modal("hide");
            $scope.GetReferrerSettings();
            $scope.messageReferral = "Settings registered successfully";
            HideMessage();
        });

    };

    $scope.BindGrid = function (model) {

        var data = [];
        for (var i = 0; i < model.length ; i++) {
            var row = {};
            var date = new Date(model[i].versionDate - 19800000);

            row["id"] = model[i].id;
            row["appVersion"] = model[i].versionNo;
            row["appDescription"] = model[i].appDesc;
            row["isMandatory"] = model[i].isMandatory == 1 ? true : false;
            row["lastUpdated"] = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " ";
            row["id"] = model[i].id;
            data[i] = row;


        }
        var source =
        {
            localdata: data,
            datatype: "array"
        };

        var dataAdapter = new $.jqx.dataAdapter(source, {
            loadComplete: function (data) { $scope.Spinner = false; },
            loadError: function (xhr, status, error) { }
        });
        $("#jqxgrid").jqxGrid(
        {
            width: '99%',
            height: '300px',
            source: dataAdapter,
            pageable: true,
            sortable: true,
            enableToolTips: true,
            enablebrowserselection: true,
            columns: [
                { text: 'ID', datafield: 'id', width: '10%' },
                { text: 'App Version', datafield: 'appVersion', width: '25%' },
                { text: 'App Description', datafield: 'appDescription', width: '25%' },
                { text: 'Is Mandatory', datafield: 'isMandatory', width: '20%' },
                { text: 'Last Updated', datafield: 'lastUpdated', width: '20%' }
            ]
        });
    };

    $scope.BindGrid1 = function (model) {

        var data = [];
        for (var i = 0; i < model.length ; i++) {
            var row = {};
            row["bmAmount"] = model[i].userRegistersBMAmount;
            row["bmExpiry"] = model[i].userRegistersBMValidity;
            row["active"] = model[i].isUserRegisterFunctionalityValid == 1 ? true : false;
            data[i] = row;
        }
        var source =
        {
            localdata: data,
            datatype: "array"
        };

        var dataAdapter = new $.jqx.dataAdapter(source, {
            loadComplete: function (data) { $scope.Spinner = false; },
            loadError: function (xhr, status, error) { }
        });
        $("#jqxgrid1").jqxGrid(
        {
            width: '99%',
            height: '100px',
            source: dataAdapter,
            //pageable: true,
            sortable: true,
            enableToolTips: true,
            enablebrowserselection: true,
            columns: [

                { text: 'BM Amount', datafield: 'bmAmount', width: '40%' },
                { text: 'BM Expiry', datafield: 'bmExpiry', width: '40%' },
                { text: 'Active', datafield: 'active', width: '20%' },

            ]
        });
    };

    $scope.BindGrid2 = function (model) {

        var data = [];
        for (var i = 0; i < model.length ; i++) {
            var row = {};
            //row["id"] = model[i].id;
            row["referrerBmAmount"] = model[i].refererBMAmount;
            row["referrerBmExpiry"] = model[i].refererBMValidity;
            row["refereeBmAmount"] = model[i].refereeBMAmount;
            row["refereeBmExpiry"] = model[i].refereeBMValidity;
            row["isActive"] = model[i].isReferralFunctionalityValid == 1 ? true : false;
            data[i] = row;

        }

        var source =
        {
            localdata: data,
            datatype: "array"
        };

        var dataAdapter = new $.jqx.dataAdapter(source, {
            loadComplete: function (data) { $scope.Spinner = false; },
            loadError: function (xhr, status, error) { }
        });
        $("#jqxgrid2").jqxGrid(
        {
            width: '99%',
            height: '100px',
            source: dataAdapter,
            //pageable: true,
            sortable: true,
            enableToolTips: true,
            enablebrowserselection: true,
            columns: [

                { text: 'Referrer BM Amount', datafield: 'referrerBmAmount', width: '20%' },
                { text: 'Referrer BM Expiry', datafield: 'referrerBmExpiry', width: '25%' },
                 { text: 'Referee BM Amount', datafield: 'refereeBmAmount', width: '20%' },
                { text: 'Referee BM Expiry', datafield: 'refereeBmExpiry', width: '25%' },
                { text: 'Active', datafield: 'isActive', width: '10%' },

            ]
        });
    };

    $scope.BindGrid3 = function (model) {
        if ($scope.VIEW) {
            var data = [];
            for (var i = 0; i < model.length ; i++) {
                var formTime = model[i].fromTime.toString();
                var toTime = model[i].toTime.toString();
                var hours1 = "";
                var minutes1 = "";
                var hours2 = "";
                var minutes2 = "";

                if (formTime.length == 4) {
                    hours1 = formTime.substring(0, 2);
                    minutes1 = formTime.substring(2, 4);
                }
                else if (formTime.length == 3) {
                    hours1 = formTime.substring(0, 1);
                    minutes1 = formTime.substring(1, 3);
                }

                if (toTime.length == 4) {
                    hours2 = toTime.substring(0, 2);
                    minutes2 = toTime.substring(2, 4);
                }
                else if (toTime.length == 3) {
                    hours2 = toTime.substring(0, 1);
                    minutes2 = toTime.substring(1, 3);
                }

                var row = {};
                row["time"] = hours1 + ":" + minutes1 + "-" + hours2 + ":" + minutes2;
                row["premiumCost"] = model[i].charge;
                row["isPremium"] = model[i].isPremium == 1 ? true : false;
                row["id"] = model[i].id;
                data[i] = row;
            }
            var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties) {
                var str = "";
                if ($scope.EDIT) {
                    str += '<a onclick="ShowPremiumModel(' + value + ')"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></a>';
                }
                return str;
            };
            var source =
            {
                localdata: data,
                datatype: "array"
            };

            var dataAdapter = new $.jqx.dataAdapter(source, {
                loadComplete: function (data) { $scope.Spinner = false; },
                loadError: function (xhr, status, error) { }
            });
            $("#jqxgrid3").jqxGrid(
            {
                width: '99%',
                height: '400px',
                source: dataAdapter,
                pageable: true,
                sortable: true,
                enableToolTips: true,
                enablebrowserselection: true,
                columns: [

                    { text: 'Time', datafield: 'time', width: '30%' },
                    { text: 'Premium Cost', datafield: 'premiumCost', width: '40%' },
                    { text: 'Is Premium', datafield: 'isPremium', width: '20%' },
                     { text: 'Manage', datafield: 'id', cellsrenderer: cellsrenderer, width: '10%' }
                ]
            });
        }
    };
    $scope.GetRegisterSettingsDetail = function () {
        for (var i = 0; i < $scope.Model.length; i++) {
            $scope.IsActive = $scope.Model[i].isUserRegisterFunctionalityValid == 1 ? true : false;
            $scope.bmAmount = $scope.Model[i].userRegistersBMAmount;
            $scope.bmExpiry = $scope.Model[i].userRegistersBMValidity;
        }
        $scope.$apply();
    }

    $scope.GetReferrerSettingsDetail = function () {
        for (var i = 0; i < $scope.Model.length; i++) {
            $scope.IsActiveReferee = $scope.Model[i].isReferralFunctionalityValid == 1 ? true : false;
            $scope.referrerBmAmount = $scope.Model[i].refererBMAmount;
            $scope.referrerBmExpiry = $scope.Model[i].refererBMValidity;
            $scope.refereeBmAmount = $scope.Model[i].refereeBMAmount;
            $scope.refereeBmExpiry = $scope.Model[i].refereeBMValidity;
        }
        $scope.$apply();
    }

    $scope.GetPremiumDetailsById = function (id) {

        var premiumId = id;
        for (var i = 0; i < $scope.Model.length; i++) {
            if ($scope.Model[i].id == premiumId) {
                var formTime = $scope.Model[i].fromTime.toString();
                var toTime = $scope.Model[i].toTime.toString();
                var hours1 = "";
                var minutes1 = "";
                var hours2 = "";
                var minutes2 = "";

                if (formTime.length == 4) {
                    hours1 = formTime.substring(0, 2);
                    minutes1 = formTime.substring(2, 4);
                }
                else if (formTime.length == 3) {
                    hours1 = formTime.substring(0, 1);
                    minutes1 = formTime.substring(1, 3);
                }

                if (toTime.length == 4) {
                    hours2 = toTime.substring(0, 2);
                    minutes2 = toTime.substring(2, 4);
                }
                else if (toTime.length == 3) {
                    hours2 = toTime.substring(0, 1);
                    minutes2 = toTime.substring(1, 3);
                }
                $scope.premiumIdUpdate = premiumId;
                $scope.Premium = $scope.Model[i].isPremium == 1 ? true : false;
                $scope.premiumCost = $scope.Model[i].charge;
                $scope.time = hours1 + ":" + minutes1 + "-" + hours2 + ":" + minutes2;

            }
        }
        $scope.$apply();
    }

    $scope.ShowAppModel = function () {
        $scope.ClearFormApp();
        $("#dvAddAppVersion").modal("show");
    };

    $scope.ShowRegisterModel = function () {
        $scope.ClearForm();
        $scope.GetRegisterSettingsDetail();
        $("#dvAddRegisterSettings").modal("show");
    };


    $scope.ShowPremiumModel = function (id) {
        //$scope.ClearForm();
        $scope.GetPremiumDetailsById(id);
        $("#dvAddPremiumSettings").modal("show");
    };

    $scope.ShowReferralModel = function () {
        $scope.ClearForm();
        $scope.GetReferrerSettingsDetail();
        $("#dvAddReferralSetting").modal("show");
    };

    $scope.SaveAppVersion = function () {

        $scope.Spinner = true;
        var appVersion = parseInt($scope.appVersionName);
        var appDesc = $scope.appDescriptionDetail;
        var isMandatory = $scope.IsMandatory == true ? 1 : 0;
        var myDataPromise = otherSettingsService.CreateAppVersion(appVersion, appDesc, isMandatory);
        myDataPromise.then(function (result) {
            $scope.GetAppVersionSettings();
            $("#dvAddAppVersion").modal("hide");
            $scope.messageAppversion = "App Version created successfully";
            HideMessage();
            $scope.ClearFormApp();
        });
    };

    $scope.UpdatePremiumSettings = function () {

        $scope.Spinner = true;
        var model = $scope.GetPremiumModel();
        var myDataPromise = otherSettingsService.UpdatePremium(model);
        myDataPromise.then(function (result) {
            $("#dvAddPremiumSettings").modal("hide");
            $scope.GetPremiumTime();
            $scope.messagePremium = "Premium updated successfully";
            HideMessage();
        });
    };

    $scope.GetRegisterModel = function () {

        var model = {
            isReferralFunctionalityValid: $scope.IsActiveReferee == true ? 1 : 0,
            isUserRegisterFunctionalityValid: $scope.IsActive == true ? 1 : 0,
            refererBMAmount: $scope.referrerBmAmount,
            refereeBMAmount: $scope.refereeBmAmount,
            refererBMValidity: $scope.referrerBmExpiry,
            refereeBMValidity: $scope.refereeBmExpiry,
            userRegistersBMAmount: $scope.bmAmount,
            userRegistersBMValidity: $scope.bmExpiry,
            serviceDataLastUpdatedOn: 0,
            masterDataLastUpdatedOn: 0
        };
        return model;
    }

    $scope.GetPremiumModel = function () {

        var model = [
            {
                id: $scope.premiumIdUpdate,
                isPremium: $scope.Premium == true ? 1 : 0,
                charge: $scope.premiumCost,
                fromTime: 0,
                toTime: 0,
            }
        ];
        return model;
    }

    function HideMessage() {
        $timeout(function () { $scope.messageAppversion = ""; $scope.messageReferral = ""; $scope.messageRegister = ""; $scope.messagePremium = ""; $scope.messageRefferelText = ""; }, 3000);
    }
    $scope.ClearForm = function () {

        $scope.IsActive = false;
        $scope.bmAmount = "";
        $scope.bmExpiry = "";

        //referral Settings
        $scope.IsActiveReferee = false;
        $scope.referrerBmAmount = "";
        $scope.referrerBmExpiry = "";
        $scope.refereeBmAmount = "";
        $scope.refereeBmExpiry = "";
    };

    $scope.ClearFormApp = function () {
        $scope.id = "";
        $scope.appVersionName = "";
        $scope.appDescriptionDetail = "";
        $scope.IsMandatory = "";
    };

    $scope.GetCity = function () {
        $scope.city = commonService.GetMasterCities();
    };

    $scope.AddBasecenter = function () {
        var myDataPromise = otherSettingsService.AddBasecenter($scope.GetBasecenterModel());
        myDataPromise.then(function (result) {
            $scope.messageBasecenter = "Basecenter added successfully";
        });
    };


    $scope.GetBasecenterModel = function () {
        var model = {
            id: 0,
            serviceCityID: $scope.cityId,
            name: $scope.basecenter
        };
        return model;
    };

    $scope.GetRefferalTags = function () {
        var myDataPromise = otherSettingsService.GetRefferalTag();
        myDataPromise.then(function (result) {
            var data = result.data.result_set.MasterConfiguration[0];
            $scope.refferelText = data.referrelTag;
            $scope.smsTag = data.smsTag;
            $scope.BindRefferalTag(result.data.result_set.MasterConfiguration);
        });
    };

    $scope.ShowRefferalTextModel = function () {
        $("#dvAddFefferelTextSettings").modal("show");
    };

    $scope.SaveRefferelTextSettings = function () {
        var model = { referrelTag: $scope.refferelText, smsTag: $scope.smsTag };
        var myDataPromise = otherSettingsService.AddRefferelTag(model);
        myDataPromise.then(function (result) {
            $("#dvAddFefferelTextSettings").modal("hide");
            $scope.messageRefferelText = "Refferal tag updated successfully";
            HideMessage();
            $scope.GetRefferalTags();
        });
    };

    $scope.BindRefferalTag = function (model) {

        var data = [];
        for (var i = 0; i < model.length ; i++) {
            var row = {};
            row["tag"] = model[i].referrelTag;
            row["smstag"] = model[i].smsTag;
            data[i] = row;
        }
        var source =
        {
            localdata: data,
            datatype: "array"
        };

        var dataAdapter = new $.jqx.dataAdapter(source, {
            loadComplete: function (data) { $scope.Spinner = false; },
            loadError: function (xhr, status, error) { }
        });
        $("#jqxgrid6").jqxGrid(
        {
            width: '99%',
            height: '200px',
            source: dataAdapter,
            pageable: true,
            sortable: true,
            enableToolTips: true,
            enablebrowserselection: true,
            columns: [
                { text: 'Refferal Tag', datafield: 'tag', width: '50%' },
                { text: 'SMS Tag', datafield: 'smstag', width: '50%' }
            ]
        });
    };

    //$scope.ShowModel = function () {
    //    $("#dvAddPremiumSettings").modal("show");
    //};

}


function ShowPremiumModel(id) {
    var scope = angular.element($("#dvSettings")).scope();
    scope.ShowPremiumModel(id);
    scope.$apply();
}