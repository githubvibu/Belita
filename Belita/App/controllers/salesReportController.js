app.controller('salesReportController', salesReportController);
app.$inject = ['$scope', '$routeParams', '$location', 'commonService', '$http', '$timeout', 'reportService'];
function salesReportController($scope, $routeParams, $location, commonService, $http, $timeout, reportService) {

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

    $scope.ViewSalesReport = function () {
        if ($scope.cityId != "" && $scope.baseCenterId != "" && $scope.currentDate != "") {
            var date = $scope.currentDate.getDate() + "/" + ($scope.currentDate.getMonth() + 1) + "/" + $scope.currentDate.getFullYear();
            var date1 = $scope.toDate.getDate() + "/" + ($scope.toDate.getMonth() + 1) + "/" + $scope.toDate.getFullYear();
            if (date == date1)
                date1 = "";
            var myDataPromise = reportService.GetSalesReport(date, date1, $scope.baseCenterId, $scope.cityId);
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
                model[i].tax_amount = model[i].tax_amount == null ? 0 : parseFloat(model[i].tax_amount).toFixed(2);
                row["tax_amount"] = model[i].tax_amount == null ? 0 : model[i].tax_amount;

                row["txn_id"] = model[i].txn_id == null ? "" : model[i].txn_id;
                row["visit_nos"] = model[i].visit_nos == null ? "" : model[i].visit_nos;
                row["ap_end_time"] = model[i].ap_end_time == null ? "" : model[i].ap_end_time;
                row["ap_status_desc"] = model[i].ap_status_desc == null ? "" : model[i].ap_status_desc;
                row["base_center"] = model[i].base_center == null ? "" : model[i].base_center;

                model[i].bm_redemption = model[i].bm_redemption == null ? "" : model[i].bm_redemption;
                row["bm_redemption"] = model[i].bm_redemption == null ? "" : model[i].bm_redemption;

                row["book_source"] = model[i].book_source == null ? "" : model[i].book_source;
                var date = new Date(model[i].invoice_date);
                var date1 = new Date(model[i].sale_date);
                row["invoice_date"] = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + ("0" + date.getMinutes()).slice(-2);
                row["sale_date"] = date1.getDate() + "/" + (date1.getMonth() + 1) + "/" + date1.getFullYear() + " " + date1.getHours() + ":" + ("0" + date1.getMinutes()).slice(-2);
                row["category_name"] = model[i].category_name == null ? "" : model[i].category_name;
                row["customer_name"] = model[i].customer_name == null ? "" : model[i].customer_name;
                row["guest_code"] = model[i].guest_code == null ? "" : model[i].guest_code;

                model[i].net_price = model[i].net_price == null ? 0 : model[i].net_price;
                row["net_price"] = model[i].net_price == null ? "" : model[i].net_price;

                model[i].paytm_amount = model[i].paytm_amount == null ? 0 : model[i].paytm_amount;
                row["paytm_amount"] = model[i].paytm_amount == null ? "" : model[i].paytm_amount;

                row["service_name"] = model[i].service_name == null ? "" : model[i].service_name;

                model[i].service_price = model[i].service_price == null ? 0 : model[i].service_price;
                row["service_price"] = model[i].service_price == null ? "" : model[i].service_price;

                row["stylist"] = model[i].stylist == null ? "" : model[i].stylist;
                row["stylist_id"] = model[i].stylist_id == null ? "" : model[i].stylist_id;

                model[i].service_nos = model[i].service_nos == null ? 0 : model[i].service_nos;
                row["service_nos"] = model[i].service_nos == null ? "" : model[i].service_nos;

                row["discount_code"] = model[i].discount_code == null ? "" : model[i].discount_code;

                model[i].paid_amount = model[i].paid_amount == null ? 0 : model[i].paid_amount;
                row["paid_amount"] = model[i].paid_amount == null ? "" : model[i].paid_amount;

                row["pay_method"] = (model[i].pay_method == null || model[i].pay_method == undefined) ? "" : model[i].pay_method;
                row["pay_type"] = model[i].pay_type == null ? "" : model[i].pay_type.slice(0, -1);

                model[i].cash_collected = model[i].cash_collected == null ? 0 : model[i].cash_collected;
                row["cash_collected"] = model[i].cash_collected == null ? 0 : model[i].cash_collected;
                row["ap_status_desc"] = model[i].ap_status_desc == null ? "" : model[i].ap_status_desc;

                model[i].discount = model[i].discount == null ? 0 : parseFloat(model[i].discount).toFixed(2);
                row["discount"] = model[i].discount == null ? "" : model[i].discount;

                row["paytm_txn_id"] = model[i].paytm_txn_id == null ? "" : model[i].paytm_txn_id;
                row["pay_method_remarks"] = model[i].pay_method_remarks == null ? "" : model[i].pay_method_remarks;
                row["app_id"] = model[i].app_id;
                row["app_modified_by"] = model[i].app_modified_by == null ? "" : model[i].app_modified_by;
                row["app_created_by"] = model[i].app_created_by == null ? "" : model[i].app_created_by;
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
            showaggregates: true,
            showstatusbar: true,
            columns: [
                { text: 'Invoice', datafield: 'txn_id', width: '12%' },
                { text: 'Appointment Id', datafield: 'app_id', width: '12%' },
                { text: 'Service Name', datafield: 'service_name', width: '12%' },
                { text: 'Sold On', datafield: 'sale_date', width: '12%' },
                { text: 'Serviced On', datafield: 'invoice_date', width: '12%' },
                { text: 'Guest', datafield: 'customer_name', width: '12%' },
                { text: 'Basecenter', datafield: 'base_center', width: '12%' },
                { text: 'Employee Code', datafield: 'stylist_id', width: '12%' },
                 { text: 'Sold By', datafield: 'stylist', width: '12%' },
                 {
                     text: 'Quantity', datafield: 'service_nos', width: '12%',
                     aggregates: [{
                         'Total': function (aggregatedValue, currentValue) {
                             return currentValue += parent.parseFloat(aggregatedValue);
                         }
                     }]
                 },
                 { text: 'Promotion', datafield: 'discount_code', width: '12%' },
                 {
                     text: 'Price', datafield: 'service_price', width: '12%',
                     aggregates: [{
                         'Total': function (aggregatedValue, currentValue) {
                             return currentValue += parent.parseFloat(aggregatedValue);
                         }
                     }]
                 },
                 {
                     text: 'Discount', datafield: 'discount', width: '12%',
                     aggregates: [{
                         'Total': function (aggregatedValue, currentValue) {
                             currentValue = Number(currentValue.toFixed(2)) + Number(aggregatedValue.toFixed(2));
                             return currentValue;//currentValue += parent.parseFloat(aggregatedValue);
                         }
                     }]
                 },
                 { text: 'Payment Method', datafield: 'pay_method', width: '12%' },
                 { text: 'Payment Method Remark', datafield: 'pay_method_remarks', width: '12%' },
                 {
                     text: 'Cash Collected', datafield: 'cash_collected', width: '12%',
                     aggregates: [{
                         'Total': function (aggregatedValue, currentValue) {
                             return currentValue += parent.parseFloat(aggregatedValue);
                         }
                     }]
                 },
                 {
                     text: 'Paytm Amount', datafield: 'paytm_amount', width: '12%',
                     aggregates: [{
                         'Total': function (aggregatedValue, currentValue) {
                             return currentValue += parent.parseFloat(aggregatedValue);
                         }
                     }]
                 },
                 {
                     text: 'BM Redemption', datafield: 'bm_redemption', width: '12%',
                     aggregates: [{
                         'Total': function (aggregatedValue, currentValue) {
                             return currentValue += parent.parseFloat(aggregatedValue);
                         }
                     }]
                 },
                 {
                     text: 'Net Price', datafield: 'net_price', width: '12%',
                     aggregates: [{
                         'Total': function (aggregatedValue, currentValue) {
                             return currentValue += parent.parseFloat(aggregatedValue);
                         }
                     }]
                 },
                 {
                     text: 'Tax Amount', datafield: 'tax_amount', width: '12%',
                     aggregates: [{
                         'Total': function (aggregatedValue, currentValue) {
                             return currentValue = Number(currentValue.toFixed(2)) + Number(aggregatedValue.toFixed(2));
                         }
                     }]
                 },
                 {
                     text: 'Price Paid', datafield: 'paid_amount', width: '12%',
                     aggregates: [{
                         'Total': function (aggregatedValue, currentValue) {
                             return currentValue += parent.parseFloat(aggregatedValue);
                         }
                     }]
                 },
                 { text: 'Payment Type', datafield: 'pay_type', width: '12%' },
                 { text: 'Paytm Transaction Id', datafield: 'paytm_txn_id', width: '12%' },
                 { text: 'Status', datafield: 'ap_status_desc', width: '12%' },
                 { text: 'Appointment Source', datafield: 'book_source', width: '12%' },
                 { text: 'Guest Code', datafield: 'guest_code', width: '12%' },
                 { text: 'Visit No', datafield: 'visit_nos', width: '12%' },
                 { text: 'App Created By', datafield: 'app_created_by', width: '10%' },
                 { text: 'App Modified By', datafield: 'app_modified_by', width: '10%' }
                //{ text: 'Service Price', datafield: 'service_price', width: '12%' },
                //{ text: 'Category Name', datafield: 'category_name', width: '12%' },
                //{ text: 'Appointment Status', datafield: 'ap_status_desc', width: '12%' },
                //{ text: 'Invoice Date', datafield: 'invoice_date', width: '12%' },
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
        saveAs(blob, "Sales Report.xls");
    };

    function GetHtml(model) {
        var table = "<table>";
        table += "<thead>";
        table += "<tr>";
        table += "<th>Invoice</th><th>Appointment Id</th><th>Service Name</th><th>Sold On</th><th>Serviced On</th>";
        table += "<th>Guest</th><th>Basecenter</th><th>Employee Code</th><th>Sold By</th><th>Quantity</th>";
        table += "<th>Promotion</th><th>Price</th><th>Discount</th><th>Payment Method</th><th>Payment Method Remark</th><th>Cash Collected</th>";
        table += "<th>Paytm Amount</th><th>BM Redemption</th><th>Net Price</th><th>Tax Amount</th><th>Price Paid</th>";
        table += "<th>Payment Type</th><th>Paytm Transaction Id</th><th>Status</th><th>Appointment Source</th><th>Guest Code</th><th>Visit No</th>";
        table += "<th>App Created By</th><th>App Modified By</th>";
        table += "</tr>";
        table += "</thead>";

        table += "<tbody>";
        for (var i = 0; i < model.length; i++) {
            table += "<tr>";
            table += "<td>" + model[i].txn_id + "</td><td>" + model[i].app_id + "</td><td>" + model[i].service_name + "</td><td>" + model[i].sale_date + "</td><td>" + model[i].invoice_date + "</td>";
            table += "<td>" + model[i].customer_name + "</td><td>" + model[i].base_center + "</td><td>" + model[i].stylist_id + "</td><td>" + model[i].stylist + "</td><td>" + model[i].service_nos + "</td>";
            table += "<td>" + model[i].discount_code + "</td><td>" + model[i].service_price + "</td><td>" + model[i].discount + "</td><td>" + (model[i].pay_method == undefined ? "" : model[i].pay_method) + "</td><td>" + (model[i].pay_method_remarks == undefined ? "" : model[i].pay_method_remarks) + "</td><td>" + model[i].cash_collected + "</td>";
            table += "<td>" + model[i].paytm_amount + "</td><td>" + model[i].bm_redemption + "</td><td>" + model[i].net_price + "</td><td>" + model[i].tax_amount + "</td><td>" + model[i].paid_amount + "</td>";
            table += "<td>" + model[i].pay_type + "</td><td>" + model[i].paytm_txn_id + "</td><td>" + model[i].ap_status_desc + "</td><td>" + model[i].book_source + "</td><td>" + model[i].guest_code + "</td><td>" + model[i].visit_nos + "</td>";
            table += "<td>" + model[i].app_created_by + "</td><td>" + model[i].app_modified_by + "</td>";
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