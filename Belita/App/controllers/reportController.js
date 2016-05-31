app.controller('reportController', reportController);
app.$inject = ['$scope', '$routeParams', '$location', 'commonService', '$http', '$timeout', 'reportService'];
function reportController($scope, $routeParams, $location, commonService, $http, $timeout, reportService) {

    $scope.cityId = "";
    $scope.cities = [];
    $scope.baseCenterId = "";
    $scope.baseCenter = [];
    $scope.message = "";
    $scope.currentDate = new Date();
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

    $scope.ViewReport = function () {
        if ($scope.cityId != "" && $scope.baseCenterId != "" && $scope.currentDate != "") {
            var date = $scope.currentDate.getDate() + "/" + ($scope.currentDate.getMonth() + 1) + "/" + $scope.currentDate.getFullYear();
            var myDataPromise = reportService.GetReportByDate(date, $scope.baseCenterId, $scope.cityId);
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
        //if ($scope.VIEW) {
        var data = [];
        $scope.data = [];
        for (var i = 0; i < model.length ; i++) {
            if (model[i] != null) {
                var date = new Date(model[i].sale_date);
                var date1 = new Date(model[i].invoice_date);
                var row = {};
                row["discount"] = model[i].discount;
                row["txn_id"] = model[i].txn_id;
                row["app_id"] = model[i].app_id;
                row["sale_date"] = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + ("0" + date.getMinutes()).slice(-2);
                row["invoice_date"] = date1.getDate() + "/" + (date1.getMonth() + 1) + "/" + date1.getFullYear() + " " + date1.getHours() + ":" + ("0" + date1.getMinutes()).slice(-2);
                row["customer_name"] = model[i].customer_name;
                row["gross_sale"] = model[i].gross_sale;
                row["net_sale"] = model[i].net_sale;
                row["pay_mode"] = model[i].pay_mode.slice(0, -1);
                row["pay_amount"] = model[i].pay_amount.slice(0, -1);
                row["book_source"] = model[i].book_source;
                row["stylist"] = model[i].stylist;
                row["ap_status_desc"] = model[i].ap_status_desc;
                row["paymethod"] = model[i].pay_method;
                row["paytm_txn_id"] = model[i].paytm_txn_id == null ? "" : model[i].paytm_txn_id;
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
        //var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties) {
        //    var str = "";
        //    if ($scope.EDIT) {
        //        str += '<a onclick="ShowServiceModel(' + value + ')"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></a>';
        //    }

        //    return str;
        //};
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
                { text: 'Invoice Id', datafield: 'txn_id', width: '5%' },
                { text: 'App Id', datafield: 'app_id', width: '5%' },
                { text: 'Sale Date', datafield: 'sale_date', width: '10%' },
                { text: 'Invoice Date', datafield: 'invoice_date', width: '10%' },
                { text: 'Guest', datafield: 'customer_name', width: '10%' },
                {
                    text: 'Gross Sale', datafield: 'gross_sale', width: '7%',
                    aggregates: [{
                        'Total': function (aggregatedValue, currentValue) {
                            return currentValue += parent.parseFloat(aggregatedValue);
                        }
                    }]
                },
                {
                    text: 'Discount', datafield: 'discount', width: '7%',
                    aggregates: [{
                        'Total': function (aggregatedValue, currentValue) {
                            return currentValue += parent.parseFloat(aggregatedValue);
                        }
                    }]

                },
                {
                    text: 'Net Sale', datafield: 'net_sale', width: '7%',
                    aggregates: [{
                        'Total': function (aggregatedValue, currentValue) {
                            return currentValue += parent.parseFloat(aggregatedValue);
                        }
                    }]
                },
                { text: 'Payment Mode', datafield: 'pay_mode', width: '7%' },
                {
                    text: 'Payment Type', datafield: 'paymethod', width: '7%'
                },
                {
                    text: 'Payment Amount', datafield: 'pay_amount', width: '7%' //aggregates: ['sum']
                    //aggregates: [{
                    //    'Total': function (aggregatedValue, currentValue) {
                    //        return currentValue += parent.parseFloat(aggregatedValue);
                    //    }
                    //}]
                },
                { text: 'Booking Source', datafield: 'book_source', width: '7%' },
                { text: 'Stylist Name', datafield: 'stylist', width: '7%' },
                { text: 'Appointment Status Desc', datafield: 'ap_status_desc', width: '10%' },
                { text: 'Paytm Transaction Id', datafield: 'paytm_txn_id', width: '10%' },
                { text: 'App Created By', datafield: 'app_created_by', width: '10%' },
                { text: 'App Modified By', datafield: 'app_modified_by', width: '10%' }
                //{ text: 'Manage', datafield: 'serviceId', filterable: false, cellsrenderer: cellsrenderer, width: '15%', cellsalign: 'right' }
            ]
        });
        $("#excelExport").jqxButton();
        //}
    };

    $scope.ExportToExcel = function () {
        //$("#jqxgrid").jqxGrid('exportdata', 'xls', 'Invoice Report');
        var data = getHtml($scope.data);
        var blob = new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"//
        });
        saveAs(blob, "InvoiceReport.xls");
    };

    function getHtml(model) {
        var table = "<table>";
        table += "<thead>";
        table += "<tr>";
        table += "<th>Invoice Id</th><th>App Id</th><th>Sale Date</th><th>Invoice Date</th><th>Guest</th>";
        table += "<th>Gross Sale</th><th>Discount</th><th>Net Sale</th><th>Payment Mode</th><th>Payment Type</th>";
        table += "<th>Payment Amount</th><th>Booking Source</th><th>Stylist Name</th><th>Appointment Status Desc</th>";
        table += "<th>Paytm Transaction Id</th><th>App Created By</th><th>App Modified By</th>";
        table += "</tr>";
        table += "</thead>";


        table += "<tbody>";
        for (var i = 0; i < model.length; i++) {
            table += "<tr>";
            table += "<td>" + model[i].txn_id + "</td><td>" + model[i].app_id + "</td><td>" + model[i].sale_date + "</td><td>" + model[i].invoice_date + "</td><td>" + model[i].customer_name + "</td>";
            table += "<td>" + model[i].gross_sale + "</td><td>" + model[i].discount + "</td><td>" + model[i].net_sale + "</td><td>" + model[i].pay_mode + "</td><td>" + (model[i].paymethod == null ? '' : model[i].paymethod) + "</td>";
            table += "<td>" + model[i].pay_amount + "</td><td>" + model[i].book_source + "</td><td>" + model[i].stylist + "</td><td>" + model[i].ap_status_desc + "</td>";
            table += "<td>" + (model[i].paytm_txn_id == null ? '' : model[i].paytm_txn_id) + "</td><td>" + model[i].app_created_by + "</td><td>" + model[i].app_modified_by + "</td>";
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