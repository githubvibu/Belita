app.controller('stylistController', stylist);
app.$inject = ['$scope', 'ngCookies', '$location', 'stylistService', 'commonService', '$timeout', 'authService', 'app'];

function stylist($scope, $cookieStore, $location, stylistService, commonService, $timeout, authService, app) {

    $scope.id = 0;
    $scope.stylistUsername = "";
    $scope.stylistName = "";
    $scope.mobileNumber = "";
    $scope.message = "";
    $scope.emailId = "";
    $scope.password = "";
    $scope.dateOfJoining = "";
    $scope.emergencyContactNo = "";
    $scope.address = "";
    $scope.baseCenterId = "";
    $scope.baseCenterIdAdd = "";
    $scope.cities = [];
    $scope.stylistModel = [];
    $scope.stylistModelId = "";
    $scope.citiesAdd = [];
    $scope.cityId = "";
    $scope.cityIdAdd = "";
    $scope.baseCenter = [];
    $scope.baseCenterAdd = [];
    $scope.StylistSkillSet = [];
    $scope.StylistSkillSetId = [];
    $scope.Model = [];
    $scope.Spinner = false;
    $scope.text = "Select";
    $scope.Title = "Create Stylist";
    $scope.endDate = new Date();
    $scope.showExportToExcel = false;
    $scope.model = [];
    //$scope.isEditClick = false;
    //$scope.editPasswordClick = true;
    //$scope.showEditPassword = false;
    $scope.VIEW = false;
    $scope.EDIT = false;
    $scope.CREATE = false;
    $scope.DELETE = false;

    $scope.GetRoles = function () {

        commonService.CheckPermissionData();
        if (authService.GetCredentials().role == 1) {
            $scope.VIEW = app.admin.Stylist.View;
            $scope.EDIT = app.admin.Stylist.Edit;
            $scope.CREATE = app.admin.Stylist.Create;
            $scope.DELETE = app.admin.Stylist.Delete;
        } else if (authService.GetCredentials().role == 2) {
            $scope.VIEW = app.executive.Stylist.View;
            $scope.EDIT = app.executive.Stylist.Edit;
            $scope.CREATE = app.executive.Stylist.Create;
            $scope.DELETE = app.executive.Stylist.Delete;
        }
    };

    $scope.SearchStylist = function () {
    };

    //$scope.editPassword = function () {
    //    $scope.isEditClick = false;
    //};

    $scope.beforeRender = function ($view, $dates, $leftDate, $upDate, $rightDate) {

        var currentDate = new Date();
        for (var i = 0; i < $dates.length; i++) {
            var utcDate = new Date($dates[i].utcDateValue);
            if (utcDate.getFullYear() >= currentDate.getFullYear()) {//&& utcDate.getMonth() >= currentDate.getMonth()
                if (utcDate.getFullYear() > currentDate.getFullYear()) {
                    $dates[i].selectable = false;
                }
                else if (utcDate.getMonth() > currentDate.getMonth())
                    $dates[i].selectable = false;
                else if (utcDate.getMonth() >= currentDate.getMonth() && utcDate.getDate() > currentDate.getDate())
                    $dates[i].selectable = false;
            }

        }
    }

    $scope.getBaseGroup = function (cityId) {
        $scope.baseCenter = commonService.GetBaseServiceCenter($scope.cityId);
        $scope.baseCenterId = "";
    };

    $scope.getBaseGroupAdd = function () {
        $scope.baseCenterAdd = commonService.GetBaseServiceCenter($scope.cityIdAdd);
        $scope.baseCenterIdAdd = "";
    };

    $scope.GetStylistData = function () {

        $scope.Spinner = true;
        var myDataPromise = stylistService.GetStylistDetail($scope.baseCenterId);
        myDataPromise.then(function (result) {
            $scope.Model = result.data.result_set;
            $scope.BindGrid($scope.Model);
        });
    };

    $scope.GetStylist = function () {
        $scope.GetRoles();
        $scope.cities = commonService.GetMasterCities();
        $scope.citiesAdd = commonService.GetMasterCities();
        $scope.stylistModel = commonService.GetStylistModelType();
        $scope.BindStylistSkillSet();
        $scope.BindGrid($scope.Model)
    };

    $scope.BindStylistSkillSet = function () {

        var myDataPromise = stylistService.GetStylistSkill();
        myDataPromise.then(function (result) {

            for (var i = 0; i < result.data.result_set.length; i++) {
                if (result.data.result_set[i].id != 7) {
                    var skillSet =
                    {
                        "id": result.data.result_set[i].id,
                        "name": result.data.result_set[i].categoryName
                    }
                    $scope.StylistSkillSet.push(skillSet);
                }
            }
        });
    };

    $scope.BindGrid = function (model) {
        if ($scope.VIEW) {
            var data = [];
            for (var i = 0; i < model.length ; i++) {
                var row = {};
                row["stylistName"] = model[i].stylistName;
                row["mobileNumber"] = model[i].mobileNumber;
                row["emailId"] = model[i].emailId;
                var skillSet = "";
                // var skillSet1 = "";
                for (var j = 0; j < model[i].skillsets.length; j++) {
                    if (j < model[i].skillsets.length - 1) {
                        skillSet += model[i].skillsets[j].categoryName + ",";
                    } else if (j == model[i].skillsets.length - 1) {
                        skillSet += model[i].skillsets[j].categoryName;
                    }
                }
                row["skillSet"] = skillSet;
                //row["baseCenter"] = model[i].baseServiceCenter.name;
                //row["city"] = model[i].city;
                row["address"] = model[i].address;
                row["emergencyContactNo"] = model[i].emergencyContactNo;
                row["dateOfJoining"] = $scope.getFormatedDate(new Date(model[i].dateOfJoining));
                row["id"] = model[i].id;
                data[i] = row;
            }
            var source =
            {
                localdata: data,
                datatype: "array"
            };
            var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties) {
                var str = "";
                if ($scope.EDIT) {
                    str += '<a onclick="ShowStylistUpdateModel(' + value + ')"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></a>';
                }
                if ($scope.DELETE) {
                    str += '<a onclick="DeleteStylist(' + value + ')"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>';
                }
                if ($scope.VIEW) {
                    str += '<a onclick="ShowStylistDetails(' + value + ')"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>';
                }

                return str;
            };
            var dataAdapter = new $.jqx.dataAdapter(source, {
                loadComplete: function (data) { $scope.Spinner = false; },
                loadError: function (xhr, status, error) { }
            });
            $("#jqxgrid").jqxGrid(
            {
                width: '99%',
                source: dataAdapter,
                pageable: true,
                sortable: true,
                enableToolTips: true,
                enablebrowserselection: true,
                columns: [
                    { text: 'Stylist Name', datafield: 'stylistName', width: '10%' },
                    { text: 'Stylist Mobile No', datafield: 'mobileNumber', width: '10%' },
                    { text: 'Emergency Contact', datafield: 'emergencyContactNo', width: '15%' },
                    { text: 'Stylist Email Id', datafield: 'emailId', width: '15%' },
                    { text: 'Stylist SkillSet', datafield: 'skillSet', width: '15%' },
                    //{ text: 'Base Center', datafield: 'baseCenter', width: '20%' },
                    //{ text: 'City', datafield: 'city', width: '15%'},
                    { text: 'Address', datafield: 'address', width: '10%' },
                    { text: 'Date of joining', datafield: 'dateOfJoining', width: '10%' },
                    { text: 'Manage', datafield: 'id', cellsrenderer: cellsrenderer, width: '15%' }
                ]
            });
        }
    };
    $scope.CreateStylist = function () {
        ClearForm();
        $scope.Title = "Create Stylist";
        $("#dvAddStylist").modal("show");
    };

    $scope.ShowStylistModel = function () {
        ClearForm();
        $("#dvAddStylist").modal("show");
    };

    $scope.ShowStylistUpdateModel = function (id) {

        //ClearForm();
        $scope.Title = "Update Stylist";
        $scope.GetStylistById(id);
        $("#dvAddStylist").modal("show");
    };

    $scope.GetStylistById = function (id) {

        var stylistId = id;
        for (var i = 0; i < $scope.Model.length; i++) {
            if ($scope.Model[i].id == stylistId) {
                $scope.StylistSkillSetId = [];
                $scope.id = id;
                $scope.stylistUsername = $scope.Model[i].stylistUsername;
                $scope.stylistName = $scope.Model[i].stylistName;
                $scope.mobileNumber = $scope.Model[i].mobileNumber;
                $scope.emailId = $scope.Model[i].emailId;
                $scope.dateOfJoining = new Date($scope.Model[i].dateOfJoining);
                $scope.emergencyContactNo = $scope.Model[i].emergencyContactNo;
                $scope.address = $scope.Model[i].address;
                $scope.cityIdAdd = String($scope.Model[i].baseServiceCenter.serviceCityID);
                $scope.getBaseGroupAdd();
                $scope.BindBaseCenter($scope.Model[i].baseServiceCenter.id);
                //$scope.baseCenterIdAdd = $scope.Model[i].baseServiceCenter.id;
                $scope.stylistModelId = String($scope.Model[i].stylistModelType.id);
                if ($scope.Model[i].skillsets.length > 0)
                    $scope.text = "";
                for (var j = 0; j < $scope.Model[i].skillsets.length; j++) {
                    $scope.StylistSkillSetId.push($scope.Model[i].skillsets[j].categoryId);
                    $scope.text += $scope.Model[i].skillsets[j].categoryName + ",";
                }
                if ($scope.text.length > 25) {
                    $scope.text = $scope.text.substr(0, 20);
                    $scope.text += "...";
                }
                $scope.isEditClick = true;
                $scope.showEditPassword = true;
            }
        }
        $scope.$apply();
    }

    $scope.BindBaseCenter = function (basecenterId) {
        $timeout(function () {
            $scope.baseCenterIdAdd = String(basecenterId);
        }, 700);
    };

    $scope.DeleteStylist = function (id) {

        var myDataPromise = stylistService.DeleteStylistById(id);
        myDataPromise.then(function (result) {
            $scope.message = "Stylist deleted successfully";
            HideMessage();
            $scope.GetStylistData();
        });
    };

    $scope.SaveStylist = function () {

        var model = $scope.GetModel();
        var myDataPromise = stylistService.AddStylist(model);
        myDataPromise.then(function (result) {
            if (result.data.result_set != null) {

                $scope.GetStylistData();
                $("#dvAddStylist").modal("hide");
                $scope.message = "Stylist created successfully";
                ClearForm();
            }
            else {
                //$scope.GetStylistData();
                //$("#dvAddStylist").modal("hide");
                //$scope.message = "An error while creating Stylist";
                $scope.message = result.data.error.message;
            }

            HideMessage();
        });
    };

    $scope.UpdateStylist = function () {
        var model = $scope.GetModel();
        stylistService.UpdateStylist(model);
    };

    $scope.GetModel = function () {

        var skillSet = [];
        for (var i = 0; i < $scope.StylistSkillSetId.length; i++) {
            var dat = {
                stylistSkillsetDetailId: 0,
                categoryName: "",
                stylistId: 0,
                categoryId: $scope.StylistSkillSetId[i]
            }
            skillSet.push(dat);
        }

        var model = {
            id: $scope.id,
            mobileNumber: $scope.mobileNumber,
            stylistUsername: $scope.stylistUsername,
            emergencyContactNo: $scope.emergencyContactNo,
            dateOfJoining: Date.parse($scope.dateOfJoining),
            stylistName: $scope.stylistName,
            emailId: $scope.emailId,
            skillsets: skillSet,
            stylistModelType: {
                id: $scope.stylistModelId,
                description: ""
            },
            baseServiceCenter: {
                id: $scope.baseCenterIdAdd,
                serviceCityID: $scope.cityIdAdd,
                name: ""
            },
            address: $scope.address,
            password: $scope.password
        };
        return model;
    }
    function HideMessage() {
        $timeout(function () { $scope.message = ""; }, 3000);
    }
    function ClearForm() {
        $scope.id = 0;
        $scope.stylistName = "";
        $scope.mobileNumber = "";
        $scope.emailId = "";
        $scope.password = "";
        $scope.baseCenterAdd = [];
        $scope.stylistUsername = "";
        $scope.cityAdd = [];
        $scope.emergencyContactNo = "";
        $scope.address = "";
        $scope.dateOfJoining = 0;
        $scope.baseCenterIdAdd = "";
        $scope.cityIdAdd = "";
        $scope.StylistSkillSetId = [];
        $scope.text = "Select";
        $scope.stylistModelId = "";

    }

    $scope.ShowStylistDetails = function (id) {

        var myDataPromise = stylistService.GetStylistHistory(id);
        myDataPromise.then(function (result) {
            if (result.data.result_set != null && result.data.result_set.length > 0)
                $scope.showExportToExcel = true;
            else
                $scope.showExportToExcel = false;
            $scope.BindStylistAppointmentGrid(result.data.result_set);
            $("#dvStylistDetail").modal("show");
        });
    };

    $scope.ExportToExcel = function () {
        var data = GetHtml($scope.model);
        var blob = new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, "Stylist Appointment History.xls");
    };

    

    $scope.BindStylistAppointmentGrid = function (model) {
        var data = [];
        for (var i = 0; i < model.length ; i++) {
            var row = {};
            row["customerName"] = model[i].customerDetail.name;
            row["address"] = model[i].customerDetail.addressDetail[0].streetAddress + "," + model[i].customerDetail.addressDetail[0].landMark + "," + model[i].customerDetail.addressDetail[0].zipCode;
            row["booking_time"] = $scope.getFormatedDate(model[i].booking_time);
            row["ap_time"] = $scope.getFormatedDateWithTime(new Date(model[i].ap_time));
            row["ap_end_time"] = $scope.getFormatedDateWithTime(new Date(model[i].ap_end_time));
            row["ap_status_desc"] = model[i].ap_status_desc;
            row["mobileNumber"] = model[i].customerDetail.mobile;
            row["total_amt"] = model[i].total_amt;
            row["emailId"] = model[i].customerDetail.email;
            row["paymentstatus"] = "";
            row["paymenttype"] = "";
            var paymentstatus = "";
            var paymenttype = "";
            if (model[i].trans_details.length > 0) {
                for (var j = 0; j < model[i].trans_details.length; j++) {
                    if (model[i].trans_details[j].is_debit == 1) {
                        paymentstatus += model[i].trans_details[j].pay_status_desc + ",";//model[i].trans_details[0].pay_status_desc;
                        paymenttype += model[i].trans_details[j].paytype_desc + ",";//model[i].trans_details[0].paytype_desc;
                    }
                }
            }
            else {
                paymentstatus = "";
                paymenttype = "";
            }
            row["paymentstatus"] = paymentstatus == "" ? "" : paymentstatus.slice(0, -1);
            row["paymenttype"] = paymenttype == "" ? "" : paymenttype.slice(0, -1);

            if (model[i].feedback != undefined) {
                row["dislikeQuality"] = model[i].feedback.dislikeQualities.slice(0, -1);
                row["additionalComment"] = model[i].feedback.additionalComment
                row["averageRating"] = model[i].feedback.totalRating;
            }
            else {
                row["dislikeQuality"] = "";
                row["additionalComment"] = "";
                row["averageRating"] = "";
            }


            var services = "";
            for (var j = 0; j < model[i].services.length; j++) {
                if (j < model[i].services.length - 1) {
                    services += model[i].services[j].serviceName + ",";
                } else if (j == model[i].services.length - 1) {
                    services += model[i].services[j].serviceName;
                }
            }
            row["services"] = services;
            row["id"] = model[i].appid;
            row["basecenter"]=model[i].stylist.baseServiceCenter.name;
            data[i] = row;
        }
        $scope.model = data;
        var source =
        {
            localdata: data,
            datatype: "array"
        };
        //var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties) {
        //    return '<a onclick="ShowStylistUpdateModel(' + value + ')"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></a><a onclick="DeleteStylist(' + value + ')"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a><a onclick="ShowStylistDetails(' + value + ')"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span></a>'
        //};
        var dataAdapter = new $.jqx.dataAdapter(source, {
            loadComplete: function (data) { $scope.Spinner = false; },
            loadError: function (xhr, status, error) { }
        });
        $("#jqxgridStylistDetail").jqxGrid(
        {
            width: '99%',
            source: dataAdapter,
            pageable: true,
            sortable: true,
            enableToolTips: true,
            enablebrowserselection: true,
            columns: [
                { text: 'App #', datafield: 'id', width: '5%' },
                { text: 'Customer Name', datafield: 'customerName', width: '10%' },
                { text: 'Address', datafield: 'address', width: '10%' },
                { textL: 'Mobile Number', datafield: 'mobileNumber', width: '10%' },
                { textL: 'Email', datafield: 'emailId', width: '15%' },
                { text: 'Booking Time', datafield: 'booking_time', width: '10%' },
                { text: 'Appointment Time', datafield: 'ap_time', width: '10%' },
            { text: 'Appointment Status', datafield: 'ap_status_desc', width: '10%' },
                { text: 'Services', datafield: 'services', width: '20%' },
                { text: 'Total Amount', datafield: 'total_amt', width: '10%' },
                { text: 'Payment Status', datafield: 'paymentstatus', width: '10%' },
                { text: 'Payment Type', datafield: 'paymenttype', width: '10%' },
                { text: 'Dislike Qualities', datafield: 'dislikeQuality', width: '10%' },
                { text: 'Additional Comment', datafield: 'additionalComment', width: '10%' },
                { text: 'Average Rating', datafield: 'averageRating', width: '10%' },
                { text: 'Base Center', datafield: 'basecenter', width: '10%' }
    //{ text: 'Manage', datafield: 'id', cellsrenderer: cellsrenderer, width: '15%' }
            ]
        });
    };

    function GetHtml(model) {
        var table = "<table>";
        table += "<thead>";
        table += "<tr>";
        table += "<th>App #</th><th>Customer Name</th><th>Address</th><th>Mobile Number</th><th>Email</th>";
        table += "<th>Booking Time</th><th>Appointment Time</th><th>Appointment Status</th><th>Services</th><th>Total Amount</th>";
        table += "<th>Payment Status</th><th>Payment Type</th><th>Dislike Qualities</th><th>Additional Comment</th><th>Average Rating</th>";
        table += "<th>Base Center</th></tr>";
        table += "</thead>";

        table += "<tbody>";
        for (var i = 0; i < model.length; i++) {
            table += "<tr>";
            table += "<td>" + model[i].id + "</td><td>" + model[i].customerName + "</td><td>" + model[i].address + "</td><td>" + model[i].mobileNumber + "</td><td>" + model[i].emailId + "</td>";
            table += "<td>" + model[i].booking_time + "</td><td>" + model[i].ap_time + "</td><td>" + model[i].ap_status_desc + "</td><td>" + model[i].services + "</td><td>" + model[i].total_amt + "</td>";
            table += "<td>" + model[i].paymentstatus + "</td><td>" + model[i].paymenttype + "</td><td>" + model[i].dislikeQuality + "</td><td>" + model[i].additionalComment + "</td><td>" + model[i].averageRating + "</td>";
            table += "<td>" + model[i].basecenter + "</td>";
            table += "</tr>";
        }

        table += "</tbody>";
        table += "</table>";
        return table;

    }

    $scope.getFormatedDate = function (date) {
        var d = new Date(date);//new Date();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var output = (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month + '/' + d.getFullYear();
        return output;
    };

    $scope.getFormatedDateWithTime = function (date) {
        var d = new Date(date);//new Date();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var output = (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month + '/' + d.getFullYear() + " " + d.getHours() + ":" + ("0" + d.getMinutes()).slice(-2);
        return output;
    };


}

function ShowStylistModel() {
    var scope = angular.element($("#dvStylist")).scope();
    scope.ShowModel();
    scope.$apply();
}

function ShowStylistUpdateModel(id) {

    var scope = angular.element($("#dvStylist")).scope();

    scope.ShowStylistUpdateModel(id);
    scope.$apply();
}

function DeleteStylist(id) {

    var scope = angular.element($("#dvStylist")).scope();
    if (confirm("Are you sure you want to delete ?"))
        scope.DeleteStylist(id);
    scope.$apply();
}

function ShowStylistDetails(id) {
    var scope = angular.element($("#dvStylist")).scope();
    scope.ShowStylistDetails(id);
    scope.$apply();
}