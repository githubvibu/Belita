app.controller('revenueReportByServiceController', revenueReportByServiceController);
app.$inject = ['$scope', '$routeParams', '$location', 'commonService', '$http', '$timeout', 'reportService'];
function revenueReportByServiceController($scope, $routeParams, $location, commonService, $http, $timeout, reportService) {

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

    $scope.ViewRevenueReportByService = function () {
        if ($scope.cityId != "" && $scope.baseCenterId != "" && $scope.currentDate != "") {
            var date = $scope.currentDate.getDate() + "/" + ($scope.currentDate.getMonth() + 1) + "/" + $scope.currentDate.getFullYear();
            var date1 = $scope.toDate.getDate() + "/" + ($scope.toDate.getMonth() + 1) + "/" + $scope.toDate.getFullYear();
            if (date == date1)
                date1 = "";

            var myDataPromise = reportService.GetRevenueReportByService(date, date1, $scope.baseCenterId, $scope.cityId);
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
                row["service"] = model[i].service;
                row["subCategory"] = model[i].subCategory == null ? "" : model[i].subCategory;
                row["quantity"] = model[i].quantity == null ? "" : model[i].quantity;
                row["revenue"] = model[i].revenue == null ? "" : model[i].revenue;
                row["actualTotalPrice"] = model[i].actualTotalPrice == null ? "" : model[i].actualTotalPrice.toFixed(2);
                row["servicePrice"] = model[i].servicePrice == null ? "" : model[i].servicePrice;
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
                { text: 'Category', datafield: 'service', width: '20%' },
                { text: 'Service', datafield: 'subCategory', width: '20%' },
                { text: 'Service Price', datafield: 'servicePrice', width: '20%' },
                { text: 'Count', datafield: 'quantity', width: '20%' },
                { text: 'Actual Total Price', datafield: 'actualTotalPrice', width: '20%' }
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
        table += "<th>Category</th><th>Service</th><th>Count</th><th>Actual Total Price</th>";
        table += "</tr>";
        table += "</thead>";

        table += "<tbody>";
        for (var i = 0; i < model.length; i++) {
            table += "<tr>";
            table += "<td>" + model[i].service + "</td><td>" + model[i].subCategory + "</td><td>" + model[i].quantity + "</td><td>" + model[i].actualTotalPrice + "</td>";
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