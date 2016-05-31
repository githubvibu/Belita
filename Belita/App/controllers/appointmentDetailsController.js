app.controller('appointmentDetailsController', appointments);
app.$inject = ['$scope', '$routeParams', '$location', 'appointmentDetailsService', 'app', 'commonService', '$timeout'];

function appointments($scope, $routeParams, $location, appointmentDetailsService, app, commonService, $timeout) {
    $scope.message = "";
    $scope.Spinner = false;
    $scope.appointmentSearch = "";
    $scope.Model = [];
   

    $scope.GetappDetails = function () {
    
    //    var myDataPromise = appointmentDetailsService.GetAppointment();
    //    myDataPromise.then(function (result) {
    //        $scope.Model = result.data.result_set;
    //        $scope.BindGrid($scope.Model);
    //    });
    }
    

    $scope.SearchAppointment = function () {
        //  $scope.BindGrid([]);
        if ($scope.appointmentSearch.toString().length > 0) {
            var myDataPromise = appointmentDetailsService.GetAppointment(parseInt($scope.appointmentSearch));
            myDataPromise.then(function (result) {
                if (result.data.result_set != null || result.data.result_set != undefined) {
                    $scope.Model = result.data.result_set;
                    $scope.BindGrid($scope.Model);
                }
                else {
                    //$scope.Model = [];
                    $scope.BindGrid();
                    $scope.message = result.data.error.message;
                    HideMessage();
                   
                }
                

            });
        }
        else {
            $scope.message = "Please enter a AppointmentId";
            HideMessage();
        }
    }

    $scope.BindGrid = function (model) {
        // prepare the data
        
        var data = new Array();
        var row = {};
        //for (var i = 0; i < model.length ; i++)
        if(model != null )
        {
            var row = {};
            var date = new Date(model.booking_time);
            var date1 = new Date(model.ap_time); 
            var date2 = new Date(model.ap_end_time);
          
            row["appId"] = model.appid;
                    row["custName"] = model.customerDetail.name;
            row["custMobileNo"] = model.customerDetail.mobile;
            if (model.customerDetail.addressDetail.length > 0)
                row["custAddress"] = model.customerDetail.addressDetail[0].streetAddress + "," + model.customerDetail.addressDetail[0].serviceCity.cityName;// +"," + model.customerDetail.addressDetail[0].serviceCity.zipCode;
            else
                row["custAddress"] = "";
            if (model.stylist != undefined) {
                row["stylistName"] = model.stylist.stylistName;
                row["baseCenter"] = model.stylist.baseServiceCenter.name;
            }
            else {
                row["stylistName"] = "";
                row["baseCenter"] = "";
            }
           
           
            row["appBookingDate"] = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + ("0" + date.getMinutes()).slice(-2);// date.getMinutes();
            row["appDate"] = date1.getDate() + "/" + (date1.getMonth() + 1) + "/" + date1.getFullYear() + " " + date1.getHours() + ":" + ("0" + date1.getMinutes()).slice(-2);
            row["appEndDate"] = date2.getDate() + "/" + (date2.getMonth() + 1) + "/" + date2.getFullYear() + " " + date2.getHours() + ":" + ("0" + date2.getMinutes()).slice(-2);
            row["appStatus"] = model.ap_status_desc;

            var skillSet = "";
            // var skillSet1 = "";
            for (var j = 0; j < model.services.length; j++) {
                if (j < model.services.length - 1) {
                    skillSet += model.services[j].serviceName + ",";
                } else if (j == model.services.length - 1) {
                    skillSet += model.services[j].serviceName;
                }
            }
            row["appServices"] = skillSet;
            row["appAmount"] = model.total_amt;
            data[0] = row;
        }
        var source =
        {
            localdata: data,
            datatype: "array"
        };
       
        var dataAdapter = new $.jqx.dataAdapter(source, {
            loadComplete: function (data) {
                $scope.Spinner = false;
            },
            loadError: function (xhr, status, error) { }
        });
        $("#jqxgrid").jqxGrid(
        {
            width: '100%',
           // autoheight: true,
            height:'100px',
            source: dataAdapter,
           // pageable: true,
            //sortable: true,
            enableToolTips: true,
            enablebrowserselection: true,
            columns: [
                 { text: 'App#', datafield: 'appId', width: '5%' },
                { text: 'Customer Name', datafield: 'custName', width: '10%' },
                { text: 'Mobile No', datafield: 'custMobileNo', width: '7%' },
                { text: 'Customer Address', datafield: 'custAddress', width: '15%' },
                { text: 'Stylist Name', datafield: 'stylistName', width: '8%' },
                { text: 'BaseCenter', datafield: 'baseCenter', width: '8%' },
                { text: 'App Booking Time', datafield: 'appBookingDate', width: '10%' },
                { text: 'App Time', datafield: 'appDate', width: '10%' },
                { text: 'App End Time', datafield: 'appEndDate', width: '10%' },
                { text: 'App Status', datafield: 'appStatus', width: '7%' },
               { text: 'Services', datafield: 'appServices', width: '15%' },
                 { text: 'Total Cost', datafield: 'appAmount', width: '7%' }
            ]
        });
    };

    function HideMessage() {
        $timeout(function () { $scope.message = ""; }, 3000);
    }

    function GetDate(date) {
        var d = new Date(date);
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var output = (day < 10 ? '0' : '') + day + "/" + (month < 10 ? '0' : '') + month + '/' + d.getFullYear();
        return output;
    }

}
