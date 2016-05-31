app.controller('feedbackReportController', feedbackReportController);
app.$inject = ['$scope', '$routeParams', '$location', 'commonService', '$http', '$timeout', 'reportService'];
function feedbackReportController($scope, $routeParams, $location, commonService, $http, $timeout, reportService) {

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

    $scope.ViewFeedBackReport = function () {
        if ($scope.cityId != "" && $scope.baseCenterId != "" && $scope.currentDate != "") {
            var date = $scope.currentDate.getDate() + "/" + ($scope.currentDate.getMonth() + 1) + "/" + $scope.currentDate.getFullYear();
            var date1 = $scope.toDate.getDate() + "/" + ($scope.toDate.getMonth() + 1) + "/" + $scope.toDate.getFullYear();
            if (date == date1)
                date1 = "";
            
            var myDataPromise = reportService.GetFeedBackReport(date, date1,  $scope.baseCenterId,$scope.cityId);
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
                var date = new Date(model[i].sale_date);
                var date1 = new Date(model[i].invoice_date);
                var row = {};
                row["app_id"] = model[i].app_id;
                row["customer_name"] = model[i].customer_name == null ? "" : model[i].customer_name;
                var date = new Date(model[i].invoice_date);
                var date1 = new Date(model[i].first_visit);
                row["invoice_date"] = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + ("0" + date.getMinutes()).slice(-2);
                row["stylist"] = model[i].stylist == null ? "" : model[i].stylist;
                row["comments"] = model[i].comments == null ? "" : model[i].comments;
                row["first_visit"] = date1.getDate() + "/" + (date1.getMonth() + 1) + "/" + date1.getFullYear() + " " + date1.getHours() + ":" + ("0" + date1.getMinutes()).slice(-2);
                row["rating"] = model[i].rating == null ? "" : model[i].rating;
                row["dislikes"] = model[i].dislikes == null ? "" : model[i].dislikes;

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
                { text: 'Appointment#', datafield: 'app_id', width: '12%' },
                { text: 'GuestName', datafield: 'customer_name', width: '12%' },
                { text: 'Service Date', datafield: 'invoice_date', width: '12%' },
                { text: 'Therapist', datafield: 'stylist', width: '12%' },
                { text: 'Comments', datafield: 'comments', width: '12%' },
                { text: 'First Visit', datafield: 'first_visit', width: '12%' },
                { text: 'Number Of Stars', datafield: 'rating', width: '12%' },
                { text: 'Disliked Qualities', datafield: 'dislikes', width: '16%' }
            ]
        });
        $("#excelExport").jqxButton();
    };

    $scope.ExportToExcel = function () {
        //$("#jqxgrid").jqxGrid('exportdata', 'xls', 'Invoice Report');
        var data = GetHtml($scope.data);
        var blob = new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, "InvoiceReport.xls");
    };

    function GetHtml(model) {
        var table = "<table>";
        table += "<thead>";
        table += "<tr>";
        table += "<th>Appointment#</th><th>GuestName</th><th>Service Date</th><th>Therapist</th><th>Comments</th>";
        table += "<th>First Visit</th><th>Number Of Stars</th><th>Disliked Qualities</th>";
        table += "</tr>";
        table += "</thead>";

        table += "<tbody>";
        for (var i = 0; i < model.length; i++) {
            table += "<tr>";
            table += "<td>" + model[i].app_id + "</td><td>" + model[i].customer_name + "</td><td>" + model[i].invoice_date + "</td><td>" + model[i].stylist + "</td><td>" + model[i].comments + "</td>";
            table += "<td>" + model[i].first_visit + "</td><td>" + model[i].rating + "</td><td>" + model[i].dislikes + "</td>";
            table += "</tr>";
        }

        table += "</tbody>";
        table += "</table>";
        return table;

    }

    function HideMessage() {
        $timeout(function () { $scope.message = ""; }, 3000);
    }

}