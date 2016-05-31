app.controller('stylistAttendenceReportController', stylistAttendenceReportController);
app.$inject = ['$scope', '$routeParams', '$location', 'commonService', '$http', '$timeout', 'reportService'];
function stylistAttendenceReportController($scope, $routeParams, $location, commonService, $http, $timeout, reportService) {

    $scope.cityId = "";
    $scope.cities = [];
    $scope.baseCenterId = "";
    $scope.baseCenter = [];
    $scope.message = "";
    $scope.currentDate = new Date();
    $scope.toDate = new Date();
    $scope.showExportToExcel = false;
    $scope.data = [];
    $scope.GetCity = function () {
        $scope.cities = commonService.GetMasterCities();
    };

    $scope.getBaseGroup = function () {
        $scope.baseCenter = commonService.GetBaseServiceCenter($scope.cityId);
        $scope.baseCenter.push({ id: -1, name: "All BaseCenter" });
        $scope.baseCenterId = "";
    };//

    $scope.ViewStylistReport = function () {
        if ($scope.cityId != "" && $scope.baseCenterId != "" && $scope.currentDate != "") {
            var date = $scope.currentDate.getDate() + "/" + ($scope.currentDate.getMonth() + 1) + "/" + $scope.currentDate.getFullYear();
            var date1 = $scope.toDate.getDate() + "/" + ($scope.toDate.getMonth() + 1) + "/" + $scope.toDate.getFullYear();
            if (date == date1)
                date1 = "";
            var myDataPromise = reportService.GetStylistAttendenceReport(date, date1, $scope.baseCenterId, $scope.cityId);
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
            var row = {};
            row["actualcheckin"] = model[i].actualCheckIn == null ? "" : GetTime(new Date(model[i].actualCheckIn))
            row["actualcheckout"] = model[i].actualCheckOut == null ? "" : GetTime(new Date(model[i].actualCheckOut));

            row["expectedcheckin"] = model[i].expectedCheckIn == null ? "" : GetTime(new Date(model[i].expectedCheckIn));
            row["expectedcheckout"] = model[i].expectedCheckOut == null ? "" : GetTime(new Date(model[i].expectedCheckOut));
            row["attendencedate"] = model[i].attendenceDate == null ? "" : GetDateFormat(new Date(model[i].attendenceDate));
            row["workinghour"] = model[i].workingHours == null ? "" : GetDateDiff(model[i].actualCheckIn, model[i].actualCheckOut)
            row["status"] = model[i].status == null ? "" : model[i].status;
            if (row["status"] == "Leave" || row["status"] == "WeekOff") {
                row["expectedcheckin"] = "";
                row["expectedcheckout"] = "";
            }
            row["stylistname"] = model[i].styListName == null ? "" : model[i].styListName;
            data[i] = row;
            $scope.data[i] = row;
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
                { text: 'Stylist Name', datafield: 'stylistname', width: '15%' },
                { text: 'AttendanceDate', datafield: 'attendencedate', width: '15%' },
                //{ text: 'Center Name', datafield: 'actualcheckout', width: '15%' },
                { text: 'Status', datafield: 'status', width: '15%' },
                { text: 'Expected Checkin', datafield: 'expectedcheckin', width: '15%' },
                { text: 'Actual Checkin', datafield: 'actualcheckin', width: '15%' },
                { text: 'Expected Checkout', datafield: 'expectedcheckout', width: '15%' },
                { text: 'Actual Checkout', datafield: 'actualcheckout', width: '15%' },
                { text: 'Working Hours', datafield: 'workinghour', width: '15%' }
            ]
        });
        $("#excelExport").jqxButton();
    };

    $scope.ExportToExcel = function () {
        var data = GetHtml($scope.data);
        var blob = new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, "Stylist Attendence.xls");
    };

    function GetHtml(model) {
        var table = "<table>";
        table += "<thead>";
        table += "<tr>";
        table += "<th>Stylist Name</th><th>AttendanceDate</th><th>Status</th><th>Expected Checkin</th><th>Actual Checkin</th><th>Expected Checkout</th>";
        table += "<th>Actual Checkout</th><th>Working Hours</th>";
        table += "</tr>";
        table += "</thead>";
        table += "<tbody>";
        for (var i = 0; i < model.length; i++) {
            table += "<tr>";
            table += "<td>" + model[i].stylistname + "</td><td>" + model[i].attendencedate + "</td><td>" + model[i].status + "</td><td>" + model[i].expectedcheckin + "</td><td>" + model[i].actualcheckin + "</td><td>" + model[i].expectedcheckout + "</td>";
            table += "<td>" + model[i].actualcheckout + "</td><td>" + model[i].workinghour + "</td>";
            table += "</tr>";
        }
        table += "</tbody>";
        table += "</table>";
        return table;

    }

    function HideMessage() {
        $timeout(function () { $scope.message = ""; }, 3000);
    }

    function GetDateFormat(date) {
        var d = new Date(date);//new Date();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var output = (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month + '/' + d.getFullYear();
        return output;
    }

    function GetDateFormatWithTime(date) {
        var d = new Date(date);//new Date();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var output = (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month + '/' + d.getFullYear() + " " + d.getHours() + ":" + ("0" + d.getMinutes()).slice(-2);
        return output;
    }

    function GetTime(date) {

        var d = new Date(date);
        var hour = "";
        var minutes = "";
        if (d.getHours().toString().length == 1)
            hour = "0" + d.getHours().toString();
        else
            hour = d.getHours().toString();
        if (d.getMinutes().toString().length == 1)
            minutes = "0" + d.getMinutes().toString();
        else
            minutes = d.getMinutes().toString();

        var output = hour + ":" + minutes;
        return output;
    }

    function GetDateDiff(date1, date2) {
        var d = ((date2 - date1) / 1000 / 60 / 60).toString();
        var d1 = parseInt(d.split('.')[0]);
        var d2 = parseFloat(parseFloat(d) - d1).toFixed(2);
        return d1.toString() + "hr " + (parseInt(d2 * 60)).toString() + " min";
    }
}