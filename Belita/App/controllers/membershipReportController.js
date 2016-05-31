app.controller('membershipReportController', membershipReportController);
app.$inject = ['$scope', '$routeParams', '$location', 'commonService', '$http', '$timeout', 'reportService'];
function membershipReportController($scope, $routeParams, $location, commonService, $http, $timeout, reportService) {
    $scope.message = "";
    $scope.currentDate = new Date();
    $scope.toDate = new Date();
    $scope.showExportToExcel = false;
    $scope.data = [];

    $scope.ViewMembershipReport = function () {
        if ($scope.currentDate != "") {
            var date = $scope.currentDate.getDate() + "/" + ($scope.currentDate.getMonth() + 1) + "/" + $scope.currentDate.getFullYear();
            var date1 = $scope.toDate.getDate() + "/" + ($scope.toDate.getMonth() + 1) + "/" + $scope.toDate.getFullYear();
            
            var myDataPromise = reportService.GetMembershipReport(date, date1);
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
                var date = new Date(model[i].start_date);
                var date1 = new Date(model[i].end_date);
                row["start_date"] = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();// + " " + date.getHours() + ":" + ("0" + date.getMinutes()).slice(-2);
                row["end_date"] = date1.getDate() + "/" + (date1.getMonth() + 1) + "/" + date1.getFullYear();// + " " + date1.getHours() + ":" + ("0" + date1.getMinutes()).slice(-2);
                row["credit_amount"] = model[i].credit_amount == null ? "" : model[i].credit_amount;
                row["actual_price"] = model[i].actual_price == null ? "" : model[i].actual_price;
                row["purchase_price"] = model[i].purchase_price == null ? "" : model[i].purchase_price;
                row["customer_name"] = model[i].customer_name == null ? "" : model[i].customer_name;
                row["invoice_no"] = model[i].invoice_no == null ? "" : model[i].invoice_no;
                row["membership_name"] = model[i].membership_name == null ? "" : model[i].membership_name;
                row["paytm_txn_id"] = model[i].paytm_txn_id == null ? "" : model[i].paytm_txn_id;
                row["balance"] = model[i].balance == null ? "" : model[i].balance;
                row["app_id"] = model[i].app_id;
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
                { text: 'Membership Name', datafield: 'membership_name', width: '15%' },
                { text: 'Invoice No', datafield: 'invoice_no', width: '15%' },

                { text: 'Guest', datafield: 'customer_name', width: '15%' },
                //{ text: 'Center Name', datafield: 'membership_name', width: '15%' },

                { text: 'Start Date', datafield: 'start_date', width: '15%' },
                { text: 'End Date', datafield: 'end_date', width: '15%' },
                { text: 'Purchase Price', datafield: 'purchase_price', width: '15%' },
                { text: 'Actual Price', datafield: 'actual_price', width: '15%' },
                { text: 'Credit Amount', datafield: 'credit_amount', width: '10%' },
                { text: 'Balance', datafield: 'balance', width: '10%' },
                { text: 'Paytm Txn Id', datafield: 'paytm_txn_id', width: '15%' },
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
        saveAs(blob, "InvoiceReport.xls");
    };

    function GetHtml(model) {
        var table = "<table>";
        table += "<thead>";
        table += "<tr>";
        table += "<th>Invoice</th><th>Appointment Id</th><th>Customer Name</th><th>Membership Name</th><th>Purchase Price</th>";
        table += "<th>Actual Price</th><th>Credit Amount</th>";
        table += "</tr>";
        table += "</thead>";

        table += "<tbody>";
        for (var i = 0; i < model.length; i++) {
            table += "<tr>";
            table += "<td>" + model[i].txn_id + "</td><td>" + model[i].app_id + "</td><td>" + model[i].customer_name + "</td><td>" + model[i].membership_name + "</td><td>" + model[i].purchase_price + "</td>";
            table += "<td>" + model[i].actual_price + "</td><td>" + model[i].credit_amount + "</td>";
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