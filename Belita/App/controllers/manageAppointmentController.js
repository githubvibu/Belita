app.controller('manageAppointmentController', manageAppointment);
app.$inject = ['$scope', '$routeParams', '$location', 'manageAppointmentService', 'app', 'commonService', '$timeout', 'appointmentDetailsService', 'schedulerService'];
function manageAppointment($scope, $routeParams, $location, manageAppointmentService, app, commonService, $timeout, appointmentDetailsService, schedulerService) {
    $scope.customerName = "";
    $scope.customerAddress = "";
    $scope.mobileNumber = "";
    $scope.email = "";
    $scope.cityId = "";
    $scope.city = [];
    $scope.cityIdAdd = "";
    $scope.cityAdd = [];
    $scope.baseCenterId = "";
    $scope.baseCenter = [];
    $scope.stylistId = "0";
    $scope.stylist = [];
    $scope.model = [];
    $scope.appointmentId = 0;
    $scope.customerId = 0;
    $scope.marker = "";
    $scope.citySelected = false;
    $scope.appointmentStatusId = "";
    $scope.appointmentStatusList = [];
    $scope.stylistList = [];
    $scope.stylistMarker = [];
    $scope.baseCenterStylistId = "";
    $scope.baseCenterStylist = [];
    $scope.stylistListId = "";
    $scope.selection = [];
    $scope.stylistDetail = [];
    // $scope.selectedDate = "";
    $scope.selectedDate = new Date();
    $scope.currentPageIndex = 0;
    $scope.currentPageIndex1 = 0;
    $scope.ist = 19800000;
    $scope.utcToIst = 23400000;

    //appointment detail model
    $scope.appId = "";
    $scope.custName = "";
    $scope.appBookTime = "";
    $scope.appStartTime = "";
    $scope.appEndTime = "";
    $scope.appStatus = "";
    $scope.appServices = "";
    $scope.appTotalCost = "";

    $scope.PaytmTransactionIdText = "";
    $scope.transactionId = "";
    $scope.PaytmTransactionAmountText = "";
    $scope.transactionAmount = "";
    $scope.appointmentDate = "";
    $scope.selectedCategoryIds = [];
    $scope.serviceTime = 0;

    var map = "";
    $scope.Refresh = function () {
        $scope.getAppointment();
    };

    $scope.InitAppointment = function () {
        $scope.city = commonService.GetMasterCities();
        $timeout(function () { $scope.cityId = "1"; $scope.getAppointment(); }, 1000);

        $scope.appointmentStatusList = commonService.GetAppointmentStatusType();
        $scope.cityAdd = $scope.city;
        ////map
        $scope.loadMap();
        $scope.BindGrid();
        $scope.appointmentStatusId = "";
        $scope.cityIdAdd = "";
    };



    $scope.loadMap = function () {
        //map
        var mapProp = {
            center: new google.maps.LatLng(20.385181, 72.911453),
            zoom: 4,
            mapTypeId: google.maps.MapTypeId.ROADMAP//,
            //styles: [{ featureType: 'all', stylers: [{ saturation: -100 }, { gamma: 0.0 }] }]
        };
        map = new google.maps.Map(document.getElementById("map"), mapProp);
    };

    $scope.getAppointment = function () {

        $scope.loadMap();
        $scope.baseCenterStylist = commonService.GetBaseServiceCenter($scope.cityId);
        var myDataPromise = manageAppointmentService.GetAppointmentList($scope.cityId);
        myDataPromise.then(function (result) {
            $scope.model = result.data.result_set;
            $scope.BindGrid($scope.model);
        });
        $scope.stylistList = [];
        $scope.baseCenterStylistId = "";
    };


    $scope.$watch('selectedDate', function (id) {
        $scope.stylistDetail = [];
        $scope.selection = [];
        //$scope.getStylistList();

    }, true);

    $scope.getStylistList = function () {
        $scope.stylistList = [];
        $scope.stylistDetail = [];
        var date = $scope.appointmentDate;//Date.parse(new Date($scope.selectedDate));
        if (date != null && date != undefined && date != "") {
            var dataPromise = manageAppointmentService.GetStylistLocations($scope.baseCenterStylistId, date);
            dataPromise.then(function (result) {
                if (result.data.result_set != null && result.data.result_set != undefined) {
                    angular.forEach(result.data.result_set, function (item, index) {
                        $scope.stylistList.push({
                            id: item.stylist_id,
                            latitude: item.base_latitute,
                            longitude: item.base_longitude,
                            currentlatitude: item.proj_latitute,
                            currentlongitude: item.proj_longitude,
                            name: item.stylist_username,
                            type: item.stylist_status,
                            isChecked: true,
                            starttime: item.start_time,
                            endtime: item.end_time
                        });
                    });
                    $scope.stylistDetail = $scope.stylistList;
                    $scope.bindStylistMap()
                }
            });
        }
        else {
            alert("Please select appointment");
            $scope.baseCenterStylistId = "";
        }
    };
    $scope.getBaseGroup = function () {
        $scope.baseCenter = commonService.GetBaseServiceCenter($scope.cityIdAdd);
    };
    $scope.getStylistData = function () {

        var myDataPromise = manageAppointmentService.GetStylistList($scope.baseCenterId);
        myDataPromise.then(function (result) {
            $scope.stylist = [];
            if (result.data.result_set != null) {
                for (var i = 0; i < result.data.result_set.length; i++) {
                    var stylist =
                        {
                            name: result.data.result_set[i].stylistName, id: result.data.result_set[i].id
                        };
                    $scope.stylist.push(stylist);
                }
            }
        });
    };


    $scope.initGrid = function () {
        var data = new Array();
        var model1 = [];
        for (var i = 0; i < $scope.model.length; i++) {
            if ($scope.model[i].todaysAppointment == true)
                model1.push($scope.model[i]);
        }
        for (var i = 0; i < model1.length ; i++) {

            var row = {};
            row["appointmentId"] = model1[i].appid;
            row["customerName"] = model1[i].customerDetail.name;
            row["appointmentAddress"] = model1[i].address.streetAddress + " " + model1[i].address.landMark;
            row["mobileNumber"] = model1[i].customerDetail.mobile;
            row["email"] = model1[i].customerDetail.email;
            row["appointmentDate"] = $scope.getDate(model1[i].ap_time);//+ $scope.utcToIst- $scope.ist
            row["appointmentEndTime"] = $scope.getDate(model1[i].ap_end_time);
            row["bookingDate"] = $scope.getFormatedDate(model1[i].booking_time);
            row["appointmentStatus"] = model1[i].ap_status_desc;
            row["specificRequest"] = model1[i].specificRequest;
            row["discountCode"] = "";
            if (model1[i].discount_code != null && model1[i].discount_code != undefined)
                row["discountCode"] = model1[i].discount_code;

            row["services"] = "";
            for (var j = 0; j < model1[i].services.length; j++)
                row["services"] += model1[i].services[j].serviceName + ", ";
            var paymentType = "";
            row["paytm_txn_id"] = "";
            if (model1[i].trans_details.length > 0) {
                if (model1[i].trans_details.length == 1 && model1[i].trans_details[0].pay_status == 1) {
                    row["paymentStatus"] = model1[i].trans_details[0].pay_status_desc;
                    row["transactionStaus"] = model1[i].trans_details[0].trans_status_desc;
                }
                else {
                    row["paymentStatus"] = model1[i].trans_details[0].pay_status_desc;
                    row["transactionStaus"] = "Successful";//model1[i].trans_details[0].trans_status_desc;
                }
                for (var j = 0; j < model1[i].trans_details.length; j++) {
                    if (model1[i].trans_details[j].is_debit == 0)
                        paymentType += model1[i].trans_details[j].paytype_desc + " (₹" + model1[i].trans_details[j].trans_amount + ")" + ","; //model1[i].total_amt + ")" + ",";
                    else
                        paymentType += model1[i].trans_details[j].paytype_desc + " (₹" + model1[i].trans_details[j].trans_amount + ")" + ",";//<del>&#8377;</del>
                    if (model1[i].trans_details[j].paytype == 2)
                        row["paytm_txn_id"] = model1[i].trans_details[j].paytm_txn_id != null ? model1[i].trans_details[j].paytm_txn_id : "";  //model1[i].appointments != undefined ? model1[i].appointments.trans_details[j].paytm_txn_id : "";
                }
            }
            else {
                row["paymentStatus"] = "";
                row["paymentType"] = "";
                row["transactionStaus"] = "";
            }

            row["paymentType"] = paymentType.slice(0, -1);//model1[i].trans_details[0].paytype_desc;
            row["totalAmount"] = model1[i].total_amt;
            row["id"] = model1[i].appid + "," + model1[i].customerDetail.id;
            //row["latLong"] = model[i].address.latitude + "," + model[i].address.longitude;
            data[i] = row;
        }
        var source =
        {
            localdata: data,
            datatype: "array",
            pagenum: $scope.currentPageIndex
        };
        var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties) {

            return '<a onclick="ShowUpdateAppointmentModel(\'' + value + '\')"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></a><a onclick="Viewlocation(\'' + value + '\')"><span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span></a><a onclick="ShowDetailAppointmentModel(\'' + value + '\')"><span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span></a>'
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
            source: dataAdapter,
            pageable: true,
            sortable: true,
            height: '250px',
            enabletooltips: true,
            enablebrowserselection: true,
            columns: [
                 { text: 'Manage', datafield: 'id', cellsrenderer: cellsrenderer, width: '9%' },
                { text: 'App#', datafield: 'appointmentId', width: '4%' },
                { text: 'Name', datafield: 'customerName', width: '10%' },
                { text: 'Address', datafield: 'appointmentAddress', width: '10%' },
                { text: 'Mobile Number', datafield: 'mobileNumber', width: '9%' },
                { text: 'Booking Date', datafield: 'bookingDate', width: '8%' },
                { text: 'Appoint Date', datafield: 'appointmentDate', width: '12%' },
                { text: 'Appoint End Time', datafield: 'appointmentEndTime', width: '12%' },
                { text: 'Services', datafield: 'services', width: '9%' },
                { text: 'Appoint Status', datafield: 'appointmentStatus', width: '9%' },
                { text: 'Payment Status', datafield: 'paymentStatus', width: '9%' },
                { text: 'Payment Type', datafield: 'paymentType', width: '8%' },
                { text: 'Paytm Transaction Id', datafield: 'paytm_txn_id', width: '8%' },
                { text: 'Trans Status', datafield: 'transactionStaus', width: '8%' },
                { text: 'Specific Request', datafield: 'specificRequest', width: '10%' },
                { text: 'Amount', datafield: 'totalAmount', width: '5%' },
                { text: "Discount Code", datafield: 'discountCode', width: '5%' }
               //,
                //{ text: 'Location', datafield: 'latLong', cellsrenderer: locationrender, width: '10%' }
            ]
        });

        $("#jqxgrid").jqxGrid('gotopage', $scope.currentPageIndex);

        $("#jqxgrid").bind('rowselect', function (event) {

            var row = event.args.rowindex;
            var datarow = $("#jqxgrid").jqxGrid('getrowdata', row);
            var appointmentDateString = moment(datarow.appointmentDate, "DD/MM/YYYY");
            var appointmentDate = appointmentDateString._d;
            $scope.selectedDate = appointmentDate;//$scope.getFormatedDate(appointmentDate);
            // $scope.selectedDate = $scope.getFormatedDate(datarow.appointmentDate);
            $scope.$apply();
        });
    };

    $("#jqxgrid").on("pagechanged", function (event) {

        $scope.currentPageIndex = args.pagenum;
    });

    $scope.initGrid2 = function () {
        var data = new Array();
        var model1 = [];
        for (var i = 0; i < $scope.model.length; i++) {
            if ($scope.model[i].todaysAppointment == false)
                model1.push($scope.model[i]);
        }
        for (var i = 0; i < model1.length ; i++) {

            var row = {};
            row["appointmentId"] = model1[i].appid;
            row["customerName"] = model1[i].customerDetail.name;
            row["appointmentAddress"] = model1[i].address.streetAddress + " " + model1[i].address.landMark;
            row["mobileNumber"] = model1[i].customerDetail.mobile;
            row["email"] = model1[i].customerDetail.email;
            row["appointmentDate"] = $scope.getDate(model1[i].ap_time);//+ $scope.utcToIst - $scope.ist
            row["appointmentEndTime"] = $scope.getDate(model1[i].ap_end_time);
            row["bookingDate"] = $scope.getFormatedDate(model1[i].booking_time);
            row["appointmentStatus"] = model1[i].ap_status_desc;
            row["specificRequest"] = model1[i].specificRequest;
            row["discountCode"] = "";
            if (model1[i].discount_code != null && model1[i].discount_code != undefined)
                row["discountCode"] = model1[i].discount_code;
            row["services"] = "";
            for (var j = 0; j < model1[i].services.length; j++)
                row["services"] += model1[i].services[j].serviceName + ", ";
            var paymentType = "";
            row["paytm_txn_id"] = "";
            if (model1[i].trans_details.length > 0) {
                row["paymentStatus"] = model1[i].trans_details[0].pay_status_desc;
                row["transactionStaus"] = model1[i].trans_details[0].trans_status_desc;
                for (var j = 0; j < model1[i].trans_details.length; j++) {
                    if (model1[i].trans_details[j].is_debit == 0)
                        paymentType += model1[i].trans_details[j].paytype_desc + " (₹" + model1[i].total_amt + ")" + ",";
                    else
                        paymentType += model1[i].trans_details[j].paytype_desc + " (₹" + model1[i].trans_details[j].trans_amount + ")" + ",";//<del>&#8377;</del>
                    if (model1[i].trans_details[j].paytype == 2)
                        row["paytm_txn_id"] = model1[i].trans_details[j].paytm_txn_id != null ? model1[i].trans_details[j].paytm_txn_id : "";  //model1[i].appointments != undefined ? model1[i].appointments.trans_details[j].paytm_txn_id : "";
                }
            }
            else {
                row["paymentStatus"] = "";
                row["paymentType"] = "";
                row["transactionStaus"] = "";
            }
            row["paymentType"] = paymentType.slice(0, -1);
            row["totalAmount"] = model1[i].total_amt;
            row["id"] = model1[i].appid + "," + model1[i].customerDetail.id;
            //row["latLong"] = model[i].address.latitude + "," + model[i].address.longitude;
            data[i] = row;
        }
        var source =
        {
            localdata: data,
            datatype: "array",
            pagenum: $scope.currentPageIndex1
        };
        var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties) {

            return '<a onclick="ShowUpdateAppointmentModel(\'' + value + '\')"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></a><a onclick="Viewlocation(\'' + value + '\')"><span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span></a><a onclick="ShowDetailAppointmentModel(\'' + value + '\')"><span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span></a>'
        };
        var dataAdapter = new $.jqx.dataAdapter(source, {
            loadComplete: function (data) {
                $scope.Spinner = false;
            },
            loadError: function (xhr, status, error) { }
        });



        $("#jqxgrid2").jqxGrid(
        {
            width: '100%',
            source: dataAdapter,
            pageable: true,
            sortable: true,
            height: '250px',
            enabletooltips: true,
            enablebrowserselection: true,
            columns: [
                 { text: 'Manage', datafield: 'id', cellsrenderer: cellsrenderer, width: '9%' },
                { text: 'App#', datafield: 'appointmentId', width: '4%' },
                { text: 'Name', datafield: 'customerName', width: '10%' },
                { text: 'Address', datafield: 'appointmentAddress', width: '10%' },
                { text: 'Mobile Number', datafield: 'mobileNumber', width: '9%' },
                { text: 'Booking Date', datafield: 'bookingDate', width: '8%' },
                { text: 'Appoint Date', datafield: 'appointmentDate', width: '12%' },
                { text: 'Appoint End Time', datafield: 'appointmentEndTime', width: '12%' },
                { text: 'Services', datafield: 'services', width: '9%' },
                { text: 'Appoint Status', datafield: 'appointmentStatus', width: '9%' },
                { text: 'Payment Status', datafield: 'paymentStatus', width: '9%' },
                { text: 'Payment Type', datafield: 'paymentType', width: '8%' },
                { text: 'Paytm Transaction Id', datafield: 'paytm_txn_id', width: '8%' },
                { text: 'Trans Status', datafield: 'transactionStaus', width: '8%' },
                { text: 'Specific Request', datafield: 'specificRequest', width: '10%' },
                { text: 'Amount', datafield: 'totalAmount', width: '5%' },
                { text: "Discount Code", datafield: 'discountCode', width: '5%' }
               //,
                //{ text: 'Location', datafield: 'latLong', cellsrenderer: locationrender, width: '10%' }
            ]
        });

        $("#jqxgrid2").jqxGrid('gotopage', $scope.currentPageIndex1);

        $("#jqxgrid2").bind('rowselect', function (event) {

            var row = event.args.rowindex;
            var datarow = $("#jqxgrid2").jqxGrid('getrowdata', row);
            var appointmentDateString = moment(datarow.appointmentDate, "DD/MM/YYYY");
            var appointmentDate = appointmentDateString._d;
            $scope.selectedDate = appointmentDate;//$scope.getFormatedDate(appointmentDate);//datarow.appointmentDate
            $scope.$apply();
        });

    };

    $("#jqxgrid2").on("pagechanged", function (event) {

        $scope.currentPageIndex1 = args.pagenum;
    });

    $scope.BindGrid = function (model) {
        $scope.initGrid($scope.model);
        $scope.initGrid2($scope.model);
        // init widgets.
        var initWidgets = function (tab) {
            switch (tab) {
                case 0:
                    $scope.initGrid($scope.model);
                    break;
                case 1:
                    $scope.initGrid2($scope.model);
                    break;
            }
        }
        $('#jqxTabs').jqxTabs({ width: "99%", height: 280, initTabContent: initWidgets });
        $scope.citySelected = true;
    };

    //$scope.stylistLocations = function (id) {
    //    var idx = $scope.selection.indexOf(id);

    //    // is currently selected
    //    if (idx > -1) {
    //        $scope.selection.splice(idx, 1);
    //    }
    //    else {
    //        $scope.selection.push(id);
    //    }
    //    $scope.stylistDetail = [];

    //    for (var i = 0; i < $scope.stylistList.length; i++) {
    //        for (j = 0; j < $scope.selection.length; j++) {
    //            if ($scope.stylistList[i].id == $scope.selection[j]) {
    //                $scope.stylistDetail.push($scope.stylistList[i]);
    //            }
    //        }
    //    }
    //    $scope.stylistLocation(0, true);
    //};

    $scope.checkboxStylistChange = function () {
        $scope.stylistDetail = $scope.stylistList;
        $scope.bindStylistMap();
    }

    $scope.bindStylistMap = function () {
        var latitude = "";
        var longitude = "";
        var currentLatitude = "";
        var currentLongitude = "";
        var name = "";
        var address = "";
        var startTime = "";
        var endTime = "";

        for (var i = 0; i < $scope.stylistMarker.length; i++) {
            $scope.stylistMarker[i].setMap(null);
        }

        for (var i = 0; i < $scope.stylistDetail.length; i++) {
            if ($scope.stylistDetail[i].isChecked == true) {
                latitude = $scope.stylistDetail[i].latitude;
                longitude = $scope.stylistDetail[i].longitude;
                currentLatitude = $scope.stylistDetail[i].currentlatitude;
                currentLongitude = $scope.stylistDetail[i].currentlongitude;
                startTime = $scope.stylistDetail[i].starttime;
                endTime = $scope.stylistDetail[i].endtime;
                var n = $scope.stylistDetail[i].type == "1" ? "<b>start time:</b> " + $scope.getDate(startTime) + "<br><b>end time:</b> " + $scope.getDate(endTime) : "";
                name = "<b>" + $scope.stylistDetail[i].name + "</b>" + "<br>" + n;

                if (latitude != 0 && longitude != 0) {
                    var marker = new google.maps.Marker({
                        icon: $scope.stylistDetail[i].type == "1" ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" : "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                        position: $scope.stylistDetail[i].type == "0" ? new google.maps.LatLng(latitude, longitude) : new google.maps.LatLng(currentLatitude, currentLongitude),
                        map: map,
                        //title: name,
                        options: { scaleControl: true }
                    });
                    if ($scope.stylistDetail[i].id == id && $scope.selection[j] == id)
                        map.setCenter(marker.getPosition());
                    attachSecretMessage(marker, name)
                    $scope.stylistMarker.push(marker);
                    marker.setMap(map);
                }
            }
        }
        map.setZoom(12);
    }


    $scope.bindSelectedStylist = function (id) {

    };

    $scope.stylistLocation = function (id, isStylist) {


        var latitude = "";
        var longitude = "";
        var currentLatitude = "";
        var currentLongitude = "";
        var name = "";
        var address = "";


        for (var i = 0; i < $scope.stylistMarker.length; i++) {
            $scope.stylistMarker[i].setMap(null);
        }

        if (isStylist == true) {

            for (var i = 0; i < $scope.stylistDetail.length; i++) {
                for (j = 0; j < $scope.selection.length; j++) {
                    latitude = $scope.stylistDetail[i].latitude;
                    longitude = $scope.stylistDetail[i].longitude;
                    currentLatitude = $scope.stylistDetail[i].currentlatitude;
                    currentLongitude = $scope.stylistDetail[i].currentlongitude;
                    name = $scope.stylistDetail[i].name;
                    if (latitude != 0 && longitude != 0) {
                        var marker = new google.maps.Marker({
                            icon: $scope.stylistDetail[i].type == "1" ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png" : "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                            position: $scope.stylistDetail[i].type == "0" ? new google.maps.LatLng(latitude, longitude) : new google.maps.LatLng(currentLatitude, currentLongitude),
                            map: map,
                            title: name,
                            options: { scaleControl: true }
                        });
                        if ($scope.stylistDetail[i].id == id && $scope.selection[j] == id)
                            map.setCenter(marker.getPosition());
                        attachSecretMessage(marker, name)
                        $scope.stylistMarker.push(marker);
                        marker.setMap(map);
                    }
                }
            }
        }
        //else {
        //    for (var i = 0; i < $scope.stylistDetail.length; i++) {
        //        for (var j = 0; j < $scope.stylistDetail[i].schedule.length; j++) {
        //            if ($scope.stylistDetail[i].schedule[j].id == id) {
        //                latitude = $scope.stylistDetail[i].schedule[j].latitude;
        //                longitude = $scope.stylistDetail[i].schedule[j].longitude;
        //                name = $scope.stylistDetail[i].name;
        //                var marker = new google.maps.Marker({
        //                    icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        //                    position: new google.maps.LatLng(latitude, longitude),
        //                    map: map,
        //                    title: name

        //                });

        //                var infowindow = new google.maps.InfoWindow({
        //                    content: name
        //                });

        //                marker.addListener('click', function () {
        //                    infowindow.open(map, marker);
        //                });
        //                marker.setMap(map);
        //                $scope.stylistMarker.push(marker);
        //            }
        //        }
        //    }
        //}
        map.setZoom(8);
    };

    function attachSecretMessage(marker, secretMessage) {
        var infowindow = new google.maps.InfoWindow({
            content: secretMessage
        });

        marker.addListener('click', function () {
            infowindow.open(marker.get('map'), marker);
        });
    }

    $scope.addMarkerWithSameLocation = function () {
        for (var i = 0; i < $scope.stylistDetail.length; i++) {
            var count = 0;
            var name = "";
            var lat = 0;
            var long = 0;
            for (k = i + 1; k < $scope.stylistDetail.length; k++) {
                //name += $scope.stylistDetail[i].name;
                if ($scope.stylistDetail[i].latitude == $scope.stylistDetail[k].latitude && $scope.stylistDetail[i].longitude == $scope.stylistDetail[k].longitude
                    && jQuery.inArray($scope.stylistDetail[i].id, $scope.selection) == 0 && $scope.stylistDetail[i].latitude != 0 && $scope.stylistDetail[i].longitude != 0) {
                    count += 1;
                    name += ", " + $scope.stylistDetail[k].name;
                }
            }
            if (count >= 1) {
                var marker = new google.maps.Marker({
                    icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                    position: new google.maps.LatLng(lat, long),
                    map: map,
                    title: name,
                    options: { scaleControl: false }
                });
                attachSecretMessage(marker, name)
                map.setCenter(marker.getPosition());
                $scope.stylistMarker.push(marker);
                marker.setMap(map);
            }
        }
    }


    $scope.Viewlocation = function (ids) {

        var latitude = "";
        var longitude = "";
        var name = "";
        var address = "";
        var id = ids.split(',')[0];
        for (var i = 0; i < $scope.model.length; i++) {
            if ($scope.model[i].appid == id) {
                latitude = $scope.model[i].address.latitude;
                longitude = $scope.model[i].address.longitude;
                name = "<b>name:</b> " + $scope.model[i].customerDetail.name;
                address = "<b>street:</b> " + $scope.model[i].address.streetAddress + "<br><b>landmark:</b> " + $scope.model[i].address.landMark + "<br><b>zipcode:</b>" + $scope.model[i].address.zipCode;
                $scope.appointmentDate = $scope.model[i].ap_time;
            }
        }

        $scope.removeMarker();

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(latitude, longitude),
            map: map//,
            //title: name + "<br>" + address
        });

        var infowindow = new google.maps.InfoWindow({
            content: name + "<br>" + address
        });

        marker.addListener('click', function () {
            infowindow.open(map, marker);
        });
        marker.setMap(map);
        $scope.marker = marker;
        map.setCenter(marker.getPosition());
        map.setZoom(16);
    };

    $scope.removeMarker = function () {
        //clear previous marker
        if ($scope.marker != "")
            $scope.marker.setMap(null);
    };

    $scope.ShowUpdateAppointmentModel = function (id) {
        $scope.ClearForm();
        $scope.stylist = [];
        var appointmentId = id.split(',')[0];
        $scope.appointmentId = appointmentId;
        $scope.customerId = id.split(',')[1];
        var myDataPromise = manageAppointmentService.GetAppointmentById(appointmentId);
        myDataPromise.then(function (result) {
            $scope.model = result.data.result_set;
            $scope.GetModel($scope.model);
            $("#dvEditAppointment").modal("show");
        });

    };
    $scope.updateAppointment = function (id) {

        var v = $scope.checkStylistAvailability();
        v.then(function (result) {
            if (result.status != undefined && result.status != null) {
                if (result.status == 2 && $scope.appointmentStatusId != 3 && $scope.appointmentStatusId != 4) {
                    var v = confirm(result.error.message + "\n" + "Do you want to continue anyway?");
                    if (!v) {
                        $scope.GetAppointmentList($scope.currentDate);
                        $scope.Spinner = false;
                        return;
                    }
                }
                var appointmentId = $scope.appointmentId;
                var customerID = $scope.customerId;
                var send_notification = false;
                if ($scope.appointmentStatusId == 4 && confirm("Do you want to send notification?"))
                    send_notification = true;
                var model =
                {
                    appid: appointmentId,
                    customer_id: customerID,
                    //stylistId: $scope.stylistId,
                    stylist: {
                        id: $scope.stylistId
                    },
                    ap_status: $scope.appointmentStatusId//,
                    //send_notification: send_notification
                };
                var myDataPromise = manageAppointmentService.UpdateAppointment(model);
                myDataPromise.then(function (result) {

                    if (result.data.result_set != null) {
                        $scope.message = "Appointment updated successfully";
                        $("#dvEditAppointment").modal("hide");
                        $scope.getAppointment($scope.cityId);
                        $scope.ClearForm();
                    }
                    else {
                        $scope.message = "An error occur while updating appointment";
                        $("#dvEditAppointment").modal("hide");
                        $scope.getAppointment($scope.cityId);
                        $scope.ClearForm();
                    }
                    HideMessage();

                });
            }
        });
    }

    $scope.checkStylistAvailability = function () {
        var model = {
            stylist_id: $scope.stylistId,
            ap_time: $scope.appointmentDate,//$scope.getAppointmentTime(),
            menu_ids: $scope.selectedCategoryIds,
            ap_duration: $scope.serviceTime
        };
        return schedulerService.StylistAllocationStatus(model);
    }

    $scope.ShowDetailAppointmentModel = function (id) {
        $scope.PaytmTransactionIdText = "";
        $scope.transactionId = "";
        $scope.PaytmTransactionAmountText = "";
        $scope.transactionAmount = "";
        var appointmentId = id.split(',')[0];
        $("#dvAppointmentDetail").modal("show");
        var myDataPromise = appointmentDetailsService.GetAppointment(parseInt(appointmentId));
        myDataPromise.then(function (result) {
            if (result.data.result_set != null || result.data.result_set != undefined) {
                $scope.appId = result.data.result_set.appid;
                $scope.custName = result.data.result_set.customerDetail.name;
                $scope.appBookTime = $scope.getFormatedDate(result.data.result_set.booking_time);
                $scope.appStartTime = $scope.getDate(result.data.result_set.ap_time);
                $scope.appEndTime = $scope.getDate(result.data.result_set.ap_end_time);
                $scope.appStatus = result.data.result_set.ap_status_desc;

                $scope.appDetailNotes = result.data.result_set.customerDetail.notes;
                $scope.appSpReq = result.data.result_set.specificRequest;
                //$scope.appPaymentMethod = result.data.result_set.paymentMethod;
                $scope.appBookingSourcde = result.data.result_set.booking_source.description;
                $scope.appDiscountCode = result.data.result_set.discount_code;
                $scope.appNetPrice = result.data.result_set.total_amt;
                $scope.appCreatedBy = result.data.result_set.appointmentCreatedBy.userName;
                $scope.appModifiedBy = result.data.result_set.appointmentModifiedBy.userName;
                //$scope.appStylistName = result.data.result_set.stylist.stylistName;
                $scope.appCustomerName = result.data.result_set.customerDetail.name;
                $scope.appMobile = result.data.result_set.customerDetail.mobile;
                var paymentStatus = "";
                var paymentType = "";
                if (result.data.result_set.trans_details.length > 0 && result.data.result_set.trans_details != null
                    && typeof result.data.result_set.trans_details != 'undefined') {
                    for (var j = 0; j < result.data.result_set.trans_details.length; j++) {
                        if (typeof result.data.result_set.trans_details[j].pay_status_desc != 'undefined' && typeof result.data.result_set.trans_details[j].paytype_desc != 'undefined' && result.data.result_set.trans_details[j].is_debit == 1) {
                            paymentStatus += result.data.result_set.trans_details[j].pay_status_desc + ",";
                            paymentType += result.data.result_set.trans_details[j].paytype_desc + ",";
                        }
                    }
                }
                $scope.appPayment = paymentStatus.slice(0, -1) + " , " + paymentType.slice(0, -1);

                var skillSet = "";
                // var skillSet1 = "";
                for (var j = 0; j < result.data.result_set.services.length; j++) {
                    if (j < result.data.result_set.services.length - 1) {
                        skillSet += result.data.result_set.services[j].serviceName + ",";
                    } else if (j == result.data.result_set.services.length - 1) {
                        skillSet += result.data.result_set.services[j].serviceName;
                    }
                }
                $scope.appServices = skillSet;
                $scope.appTotalCost = "₹" + result.data.result_set.total_amt;

                for (var j = 0; j < result.data.result_set.trans_details.length; j++) {
                    if (result.data.result_set.trans_details[j].paytype == 2) {
                        $scope.PaytmTransactionIdText = "Paytm Transaction Id:-";
                        $scope.transactionId = result.data.result_set.trans_details[j].paytm_txn_id;
                        $scope.PaytmTransactionAmountText = "Paytm Transaction Amount:-";
                        $scope.transactionAmount = "₹" + result.data.result_set.trans_details[j].trans_amount;
                    }
                }

            }
        });
    }

    $scope.closeAppointment = function () {

    };

    $scope.GetModel = function (response) {
        $scope.selectedCategoryIds = [];
        $scope.customerName = response.customerDetail.name;
        $scope.customerAddress = response.address.streetAddress + "," + response.address.landMark;
        $scope.mobileNumber = response.customerDetail.mobile;
        $scope.email = response.customerDetail.email;
        $scope.cityIdAdd = String(response.address.serviceCity.id);
        $scope.appointmentStatusId = String(response.ap_status);
        $scope.appointmentDate = response.ap_time;
        angular.forEach(response.services, function (item, index) {
            $scope.serviceTime += item.serviceTime;
            $scope.selectedCategoryIds.push(item.categoryId);
            $.unique($scope.selectedCategoryIds.sort());
        });


        $scope.getBaseGroup();
        //$scope.baseCenterId = response.;
    };

    function HideMessage() {
        $timeout(function () { $scope.message = ""; }, 3000);
    }


    $scope.ClearForm = function () {
        $scope.customerName = "";
        $scope.customerAddress = "";
        $scope.mobileNumber = "";
        $scope.email = "";
        //$scope.cityId = "";
        $scope.cityIdAdd = "";
        $scope.baseCenterId = "";
        $scope.stylistId = "0";
        $scope.appointmentId = 0;
        $scope.customerId = 0;
        $scope.appointmentStatusId = "";
        $scope.stylistList = [];
    };

    $scope.getDate = function (date, hour, minute) {
        var d = new Date(date);//new Date();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var output = (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month + '/' + d.getFullYear() + " " + d.getHours() + ":" + ("0" + d.getMinutes()).slice(-2);
        return output;
    };

    $scope.getFormatedDate = function (date) {

        var d = new Date(date);//new Date();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var output = (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month + '/' + d.getFullYear();
        return output;
    };
}
function ShowUpdateAppointmentModel(id) {
    var scope = angular.element($("#dvAppointment")).scope();
    scope.ShowUpdateAppointmentModel(id);
    scope.$apply();
}

function Viewlocation(coordinates) {
    var scope = angular.element($("#dvAppointment")).scope();
    scope.Viewlocation(coordinates);
    scope.$apply();
}

function ShowDetailAppointmentModel(id) {
    var scope = angular.element($("#dvAppointment")).scope();
    scope.ShowDetailAppointmentModel(id);
    scope.$apply();
}
