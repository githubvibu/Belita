app.controller('pettycashReportController', pettycashReportController);
app.$inject = ['$scope', '$routeParams', '$location', 'commonService', '$http', '$timeout', 'reportService'];
function pettycashReportController($scope, $routeParams, $location, commonService, $http, $timeout, reportService) {

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
        $scope.baseCenter.push({ id: 0, name: "All BaseCenter" });
        $scope.baseCenterId = "";
    };//

    $scope.ViewPettyCashReport = function () {
        if ($scope.cityId != "" && $scope.baseCenterId != "" && $scope.currentDate != "") {
            var date = $scope.currentDate.getDate() + "/" + ($scope.currentDate.getMonth() + 1) + "/" + $scope.currentDate.getFullYear();
            var date1 = $scope.toDate.getDate() + "/" + ($scope.toDate.getMonth() + 1) + "/" + $scope.toDate.getFullYear();
            if (date == date1)
                date1 = "";
            var myDataPromise = reportService.GetPettyCashReport(date, date1, $scope.baseCenterId);
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
                var date = new Date(model[i].pCashDate);
                row["pCashDate"] = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();// + " " + date.getHours() + ":" + ("0" + date.getMinutes()).slice(-2);

                row["id"] = model[i].id == null ? "" : model[i].id;
                row["entryByName"] = model[i].entryByName == null ? "" : model[i].entryByName;
                row["baseCenterName"] = model[i].baseCenterName == null ? "" : model[i].baseCenterName;
                row["categoryName"] = model[i].categoryName == null ? "" : model[i].categoryName;
                row["description"] = model[i].description == null ? "" : model[i].description;
                row["openingBalanceOfDay"] = model[i].openingBalanceOfDay == null ? "" : model[i].openingBalanceOfDay;
                row["amount"] = model[i].amount == null ? "" : model[i].amount;
                row["closingBalanceOfDay"] = model[i].closingBalanceOfDay == null ? "" : model[i].closingBalanceOfDay;
                row["type"] = model[i].expenseTypeName;
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
                { text: 'Transaction Date', datafield: 'pCashDate', width: '12%' },
                { text: 'VoucherNo', datafield: 'id', width: '12%' },
                { text: 'Basecenter', datafield: 'baseCenterName', width: '12%' },
                { text: 'Entered By', datafield: 'entryByName', width: '12%' },
                { text: 'CategoryName', datafield: 'categoryName', width: '12%' },
                { text: 'Description', datafield: 'description', width: '12%' },
                { text: 'Type', datafield: 'type', width: '12%' },
                { text: 'Opening Balance', datafield: 'openingBalanceOfDay', width: '12%' },
                { text: 'Amount', datafield: 'amount', width: '12%' },
                { text: 'Closing Balance', datafield: 'closingBalanceOfDay', width: '16%' }
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
        table += "<th>Transaction Date</th><th>VoucherNo</th><th>Basecenter</th><th>Entered By</th><th>CategoryName</th><th>Description Type</th>";
        table += "<th>Opening Balance</th><th>Amount</th><th>Closing Balance</th>";
        table += "</tr>";
        table += "</thead>";

        table += "<tbody>";
        for (var i = 0; i < model.length; i++) {
            table += "<tr>";
            table += "<td>" + model[i].pCashDate + "</td><td>" + model[i].id + "</td><td>" + model[i].baseCenterName + "</td><td>" + model[i].entryByName + "</td><td>" + model[i].categoryName + "</td><td>" + model[i].description + "</td>";
            table += "<td>" + model[i].openingBalanceOfDay + "</td><td>" + model[i].balanceAmount + "</td><td>" + model[i].closingBalanceOfDay + "</td>";
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