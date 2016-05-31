app.controller('birthdayAnniversaryController', birthdayAnniversaryController);
app.$inject = ['$scope', '$routeParams', '$location', 'customerService', 'app', 'commonService', '$timeout', 'authService', 'app'];

function birthdayAnniversaryController($scope, $routeParams, $location, customerService, app, commonService, $timeout, authService, app) {
    $scope.currentDate = new Date();
    $scope.toDate = new Date();

    $scope.viewBirthdayAnniversary = function () {
        if ($scope.currentDate != "") {
            var date = $scope.currentDate.getDate() + "/" + ($scope.currentDate.getMonth() + 1) + "/" + $scope.currentDate.getFullYear();
            var date1 = $scope.toDate.getDate() + "/" + ($scope.toDate.getMonth() + 1) + "/" + $scope.toDate.getFullYear();

            var myDataPromise = customerService.GetBirthdayAnniversary(date, date1);
            myDataPromise.then(function (result) {
                if (result.data.result_set != null && result.data.result_set.length > 0) {
                    $scope.showExportToExcel = true;
                    $scope.BindGrid(result.data.result_set);
                }
                else {
                    $scope.BindGrid([]);
                    $scope.showExportToExcel = false;
                }
            });
        }
        else {
            $scope.message = "Please select required field";
        }
        HideMessage();
    };
    $scope.BindGrid = function (model) {
        var data = [];
        $scope.data = [];
        for (var i = 0; i < model.length ; i++) {
            if (model[i] != null) {
                var row = {};
                var date = new Date(model[i].DOB);
                var date1 = new Date(model[i].anniversaryDate);
                row["DOB"] = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
                row["anniversaryDate"] = date1.getDate() + "/" + (date1.getMonth() + 1) + "/" + date1.getFullYear();
                var appointmentDate = (model[i].appointmentDate == null || model[i].appointmentDate == undefined) ? "" : GetDateFormatWithTime(model[i].appointmentDate);
                row["name"] = model[i].name == null ? "" : model[i].name;
                row["email"] = model[i].email == null ? "" : model[i].email;
                row["mobile"] = model[i].mobile == null ? "" : model[i].mobile;
                row["services"] = "";
                if (model[i].services != null) {
                    for (var j = 0; j < model[i].services.length; j++) {
                        row["services"] += model[i].services[j] + ", ";
                    }
                }
                row["appointmentDate"] = appointmentDate == null ? "" : appointmentDate;
                if (row["DOB"] == "1/1/1970")
                    row["DOB"] = "";
                if (row["anniversaryDate"] == "1/1/1970")
                    row["anniversaryDate"] = "";
                data[i] = row;
                $scope.data[i] = row;
            }
        }
        var source =
        {
            localdata: data,
            datatype: "array",
            pagenum: $scope.currentPageIndex
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
            enableToolTips: true,
            filterable: true,
            enablebrowserselection: true,
            columns: [
                { text: 'Name', datafield: 'name', width: '20%' },
                { text: 'Email', datafield: 'email', width: '20%' },
                { text: 'Mobile', datafield: 'mobile', width: '20%' },
                { text: 'Date Of Birth', datafield: 'DOB', width: '20%' },
                { text: 'Anniversary Date', datafield: 'anniversaryDate', width: '20%' },
                { text: 'Appointment Date', datafield: 'appointmentDate', width: '20%' },
                { text: 'Services', datafield: 'services', width: '20%' }
            ],
            selectionmode: 'none'
        });
        $("#excelExport").jqxButton();
    };

    $scope.ExportToExcel = function () {
        var data = GetHtml($scope.data);
        var blob = new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, "Birthday Anniversary.xls");
    };

    function GetHtml(model) {
        var table = "<table>";
        table += "<thead>";
        table += "<tr>";
        table += "<th>Name</th><th>Email</th><th>Mobile</th><th>Date of Birth</th><th>Anniversary Date</th><th>Appointment Date</th><th>Services</th>";
        table += "</tr>";
        table += "</thead>";

        table += "<tbody>";
        for (var i = 0; i < model.length; i++) {
            table += "<tr>";
            table += "<td>" + model[i].name + "</td><td>" + model[i].email + "</td><td>" + model[i].mobile + "</td><td>" + model[i].DOB + "</td><td>" + model[i].anniversaryDate + "</td><td>" + model[i].appointmentDate + "</td><td>" + model[i].services + "</td>";;
            table += "</tr>";
        }

        table += "</tbody>";
        table += "</table>";
        return table;

    }

    function HideMessage() {
        $timeout(function () { $scope.message = ""; }, 3000);
    }

    function GetDateFormatWithTime(date) {
        var d = new Date(date);//new Date();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var output = (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month + '/' + d.getFullYear() + " " + d.getHours() + ":" + ("0" + d.getMinutes()).slice(-2);
        return output;
    }
}