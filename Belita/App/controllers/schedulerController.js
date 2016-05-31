app.controller('schedulerController', main);
app.$inject = ['$scope', '$routeParams', '$location', 'schedulerService', 'commonService', '$http', '$timeout', '$window', 'appointmentDetailsService', 'authService', 'app', '$rootScope', 'manageAppointmentService', 'stylistScheduleService'];

function main($scope, $routeParams, $location, schedulerService, commonService, $http, $timeout, $window, appointmentDetailsService, authService, app, $rootScope, manageAppointmentService, stylistScheduleService) {
    $scope.locationURL = app.serviceBaseURL + "activity/getdetailajax";
    $scope.location = "";
    $scope.cityId = "";

    $scope.baseCenterId = "";
    $scope.discountCode = "";
    $scope.landMark = "";
    $scope.lat = "";
    $scope.long = "";
    $scope.cities = [];
    $scope.basecenter = [];
    $scope.start = "";

    $scope.end = "";
    $scope.resource = "";
    $scope.CategoryIds = [];
    $scope.selectedCategoryIds = [];
    $scope.ServicesIds = [];
    $scope.selectedServicesIds = [];

    $scope.customerNotes = "";
    $scope.customerEmail = "";
    $scope.customerId = 0;
    $scope.customerMobNo = "";
    $scope.customerName = "";
    $scope.customerAddress = "";
    $scope.addressId = 0;
    $scope.appointmentList = [];
    $scope.stylistList = [];

    $scope.stylistId = "";
    $scope.servicesList = [];
    $scope.selectedServicesListWithPrice = [];
    $scope.selectedServicesList = [];
    $scope.message = "";
    //$scope.addressType = 0;
    $scope.createdCustomerId = 0;
    $scope.text = "Select";
    $scope.text1 = "Select";
    $scope.Spinner = false;
    $scope.currentDate = new Date();
    $scope.ist = 19800000;
    $scope.appId = 0;
    $scope.pinCode = "";
    $scope.appointmentStatusList = [];
    $scope.appointmentStatusId = "";
    $scope.appointments = [];
    $scope.specificRequest = "";

    $scope.appliedDiscountCode = "";
    $scope.discountMessage = "";
    $scope.discountAmount = 0;
    $scope.totalAmountWithTax = 0;
    $scope.discountServices = [];
    $scope.addressId = 0;
    //$scope.paymentStatusId = "";
    $scope.paymentMode = "";
    $scope.isCashBack = false;

    //total amount of services selected
    $scope.totalAmount = 0;
    $scope.premiumAmount = 0;
    $scope.discount_Code = "";
    $scope.premiumTimeValue = "";
    //$scope.discountAmount = 0;
    $scope.isLoading = 0;
    $scope.schedulerStartDate = new Date();
    $scope.browser = "";

    $scope.feedbackAppId = 0;
    $scope.feedbackCustId = 0;
    $scope.feedbackDislikeList = [{ id: "Booking", name: "Booking" }, { id: "Punctuality", name: "Punctuality" }, { id: "Hygiene", name: "Hygiene" }, { id: "Stylist", name: "Stylist" }, { id: "Product", name: "Product" }, { id: "Price", name: "Price" }];
    $scope.feedbackDislike = [];
    $scope.feedbackComment = "";
    $scope.feedbackText = "Select";
    $scope.feedBackRating = "1";
    $scope.stylistListDropDown = [];
    $scope.isCreateOrModify = 0;
    $scope.feedBackId = 0;

    //petty cash
    $scope.entry = 1;
    $scope.source = "";
    $scope.pettyCategory = "";
    $scope.pettyDescription = "";
    $scope.pettyAmount = 0;
    $scope.pettyCashMessage = "";
    $scope.sourceList = [];
    $scope.pettyCategoryList = [];
    $scope.paymentType = "3";
    $scope.BelitaMoney = 0;
    $scope.TotalAmountWithTax = 0;
    $scope.CancelAppId = 0;
    $scope.CancelFeedback = "";
    $scope.CancelAppointmentReason = "";
    $scope.OldTransactionObject = [];
    $scope.OldTotalAmount = 0;
    $scope.PettyCashAmount = 0;


    //appointment detail model
    $scope.appDetailId = "";
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
    $scope.addressTypeId = "";
    $scope.addressarray = [];
    $scope.addressTypeList = [];
    $scope.createdBy = 0;
    $scope.updatedBy = 0;

    $scope.appDisableModify = false;
    $scope.stylistDetail = [];
    $scope.stylistMarker = [];
    $scope.marker = "";
    $scope.serviceTime = 0;
    $scope.sentNotification = false;
    $scope.isPastDate = false;
    $scope.paymentModeAmount = 0;

    $scope.GetRoles = function () {
        commonService.CheckPermissionData();
        if (authService.GetCredentials().role == 1) {
            $scope.VIEW = app.admin.Appointment.View;
            $scope.EDIT = app.admin.Appointment.Edit;
            $scope.DELETE = app.admin.Appointment.Delete;
            $scope.CREATE = app.admin.Appointment.Create;
            $scope.PETTYCASHVIEW = app.admin.PettyCash.View;
        } else if (authService.GetCredentials().role == 2) {
            $scope.PETTYCASHVIEW = app.executive.PettyCash.View;
            $scope.VIEW = app.executive.Appointment.View;
            $scope.EDIT = app.executive.Appointment.Edit;
            $scope.DELETE = app.executive.Appointment.Delete;
            $scope.CREATE = app.executive.Appointment.Create;
        }
    };

    $scope.isPreviousDate = function () {
        $scope.isPastDate = false;
        var currentDate = (new Date().getDate());
        var currentMonth = (new Date().getMonth() + 1);
        var currentYear = (new Date().getFullYear());

        var selectedDate = ($scope.currentDate.getDate())
        var selectedMonth = ($scope.currentDate.getMonth() + 1);
        var selectedYear = ($scope.currentDate.getFullYear());

        if (selectedYear < currentYear)
            $scope.isPastDate = true;
        else if (selectedYear == currentYear) {
            if (selectedMonth < currentMonth)
                $scope.isPastDate = true;
            else if (selectedMonth = currentMonth) {
                if (selectedDate < currentDate)
                    $scope.isPastDate = true;
            }
        }
    }

    $scope.GetRoles();

    $scope.premiumTime = function (date) {

        var time = GetTime(date);
        $scope.premiumTimeValue = time;
        var myDataPromise = schedulerService.IsPremiumTime(time);
        myDataPromise.then(function (result) {
            if (result.data.result_set != null && result.data.result_set.isPremium == "1") {
                $scope.premiumAmount = result.data.result_set.charge;
            }
            else {
                $scope.premiumAmount = 0;
            }
        });
    };

    $scope.ViewMap = function () {

        var startDate = $scope.start;
        if ($.type($scope.start) == "date") //Date.parse($scope.start)
        {
            var date = ($scope.start.getDate() < 10 ? '0' : '') + $scope.start.getDate() + '/' + (($scope.start.getMonth() + 1) < 10 ? '0' : '') + ($scope.start.getMonth() + 1) + '/' + $scope.start.getFullYear() + " " + $scope.start.getHours() + ":" + ("0" + $scope.start.getMinutes()).slice(-2);
            startDate = date;
        }

        var dateArray = startDate.split(' ');
        var selectedDate = dateArray[0].split('/');
        var selectedTime = dateArray[1].split(':');
        var dat = selectedDate[2] + "-" + selectedDate[1] + "-" + selectedDate[0] + " " + selectedTime[0] + ":" + selectedTime[1] + ":00";
        if ($scope.browser != "chrome")
            dat = selectedDate[2] + "/" + selectedDate[1] + "/" + selectedDate[0] + " " + selectedTime[0] + ":" + selectedTime[1] + ":00";
        var date = new Date(dat);
        var d = Date.parse(date);
        $("#dvStylistLocation").modal("show");
        $scope.loadMap();
        $scope.stylistMapList = [];
        var dataPromise = manageAppointmentService.GetStylistLocations($scope.baseCenterId, d);
        dataPromise.then(function (result) {
            if (result.data.result_set != null && result.data.result_set != undefined) {
                angular.forEach(result.data.result_set, function (item, index) {
                    $scope.stylistMapList.push({
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
                $scope.stylistDetail = $scope.stylistMapList;
                $scope.bindStylistMap();
            }
        });

        //for (var i = 0; i < $scope.stylistList.length; i++) {
        //    var latitude = $scope.stylistList[i].lat;
        //    var longitude = $scope.stylistList[i].long;
        //    var name = $scope.stylistList[i].name;
        //    var marker = new google.maps.Marker({
        //        icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        //        position: new google.maps.LatLng(latitude, longitude),
        //        map: map,
        //        //title: name
        //    });

        //    attachSecretMessage(marker, name);
        //    marker.setMap(map);
        //}
        $timeout(function () {
            google.maps.event.trigger(map, 'resize');
            //map.setCenter(marker.getPosition());
        }, 1000);

    };

    $scope.bindStylistMap = function () {
        var latitude = "";
        var longitude = "";
        var currentLatitude = "";
        var currentLongitude = "";
        var name = "";
        var address = "";
        var startTime = "";
        var endTime = "";
        //$scope.stylistMarker = [];

        for (var i = 0; i < $scope.stylistMarker.length; i++) {
            $scope.stylistMarker[i].setMap(null);
        }

        for (var i = 0; i < $scope.stylistDetail.length; i++) {
            //if ($scope.stylistDetail[i].isChecked == true) {
            latitude = $scope.stylistDetail[i].latitude;
            longitude = $scope.stylistDetail[i].longitude;
            currentLatitude = $scope.stylistDetail[i].currentlatitude;
            currentLongitude = $scope.stylistDetail[i].currentlongitude;
            startTime = $scope.stylistDetail[i].starttime;
            endTime = $scope.stylistDetail[i].endtime;
            var n = $scope.stylistDetail[i].type == "1" ? "<b>start time:</b> " + GetDateFormatWithTime(startTime) + "<br><b>end time:</b> " + GetDateFormatWithTime(endTime) : "";
            name = "<b>" + $scope.stylistDetail[i].name + "</b>" + "<br>" + n;

            if (latitude != 0 && longitude != 0) {
                var marker = new google.maps.Marker({
                    icon: $scope.stylistDetail[i].type == "1" ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" : "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                    position: $scope.stylistDetail[i].type == "0" ? new google.maps.LatLng(latitude, longitude) : new google.maps.LatLng(currentLatitude, currentLongitude),
                    map: map,
                    //title: name,
                    options: { scaleControl: true }
                });
                //if ($scope.stylistDetail[i].id == id && $scope.selection[j] == id)
                //map.setCenter(marker.getPosition());
                attachSecretMessage(marker, name)
                $scope.stylistMarker.push(marker);
                marker.setMap(map);
            }
            //}
        }
        $timeout(function () {
            map.setCenter(new google.maps.LatLng($scope.lat, $scope.long));
        }, 1000);
        map.setZoom(12);
    }

    function attachSecretMessage(marker, secretMessage) {
        var infowindow = new google.maps.InfoWindow({
            content: secretMessage
        });

        marker.addListener('click', function () {
            infowindow.open(marker.get('map'), marker);
        });
    }
    var map = "";
    $scope.loadMap = function () {
        if ($scope.marker != "")
            $scope.marker.setMap(null);
        //map
        var mapProp = {
            //center: new google.maps.LatLng(20.385181, 72.911453),
            zoom: 4,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map"), mapProp);

        if ($scope.lat != "" && $scope.long != "") {
            var latitude = $scope.lat;
            var longitude = $scope.long;
            var name = $scope.landMark;
            var marker = new google.maps.Marker({
                icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                position: new google.maps.LatLng(latitude, longitude),
                map: map,
                title: name
            });

            attachSecretMessage(marker, name);
            marker.setMap(map);
            $scope.marker = marker;
            map.setCenter(marker.getPosition());
        }

    };

    $scope.Refresh = function () {
        //$scope.GetAppointmentList($scope.currentDate);
        $scope.StartScheduler();
    };



    $scope.$watch("schedulerStartDate", function () {

        if (dp != "") {

            if ($.type($scope.schedulerStartDate) != "date")//Date.parse($scope.schedulerStartDate) == undefined || isNaN(Date.parse($scope.schedulerStartDate))
            {
                var selectedDate = $scope.schedulerStartDate.split('/');
                var dat = selectedDate[2] + "-" + selectedDate[1] + "-" + selectedDate[0];
                var date = new Date(dat);
                $scope.currentDate = date;//new Date($scope.schedulerStartDate);
                $scope.schedulerStartDate = $scope.currentDate;
            }
            else {

                //var dat =new Date(Date.parse($scope.schedulerStartDate));
                $scope.currentDate = $scope.schedulerStartDate;
            }
            $scope.GetStylistByBasecenter();
            dp.startDate = $scope.GetDaypilotDate($scope.currentDate);//new DayPilot.Date($scope.currentDate);
            $scope.GetAppointmentList($scope.currentDate);
            dp.update();
        }
    })

    $scope.Previous = function () {

        $scope.currentDate.setDate($scope.currentDate.getDate() - 1);
        //$scope.GetStylistByBasecenter();
        $scope.schedulerStartDate = GetDateFormat($scope.currentDate);
        dp.startDate = $scope.GetDaypilotDate($scope.currentDate);//new DayPilot.Date($scope.currentDate);
        //$scope.GetAppointmentList($scope.currentDate);
        dp.update();
        //check if selected date is less than current date
        $scope.isPreviousDate();
    };
    $scope.Next = function () {
        $scope.currentDate.setDate($scope.currentDate.getDate() + 1);
        //$scope.GetStylistByBasecenter();
        $scope.schedulerStartDate = GetDateFormat($scope.currentDate);
        dp.startDate = $scope.GetDaypilotDate($scope.currentDate);//new DayPilot.Date($scope.currentDate);
        //$scope.GetAppointmentList($scope.currentDate);
        dp.update();
        //check if selected date is less than current date
        $scope.isPreviousDate();
    };

    $scope.InitializeScheduler = function () {
        $scope.browser = $scope.CheckBrowser();
        $scope.cities = commonService.GetMasterCities();
        $scope.sourceList = commonService.GetSourceType();
        $scope.pettyCategoryList = commonService.GetExpenseCategory();
        $scope.addressTypeList = commonService.GetAddressType();
        loadScheduler($scope.GetDaypilotDate((new Date())));
        //set default city
        $timeout(function () {
            $scope.cityId = "1"; $scope.BindBaseCenter();

        }, 1000);
    };

    $scope.addressTypeChange = function () {
        for (var i = 0; i < $scope.addressarray.length; i++) {
            if ($scope.addressarray[i].addressType.id == $scope.addressTypeId) {
                $scope.addressId = $scope.addressarray[i].id;
                $scope.lat = $scope.addressarray[i].latitude;
                $scope.long = $scope.addressarray[i].longitude;
                $scope.landMark = $scope.addressarray[i].landMark;
                $scope.pinCode = $scope.addressarray[i].zipCode;
                $scope.customerAddress = $scope.addressarray[i].streetAddress
                break;
            }
            else {
                $scope.addressId = 0;
                $scope.lat = 0;
                $scope.long = 0;
                $scope.landMark = "";
                $scope.pinCode = "";
                $scope.customerAddress = "";
            }
        }
    };

    $scope.RemoveService = function (id) {
        //selectedServicesIds
        for (var i = $scope.selectedServicesIds.length - 1; i >= 0; i--) {
            if ($scope.selectedServicesIds[i] == id) {
                $scope.selectedServicesIds.splice(i, 1);
            }
        }
        $scope.removeDiscount();
    };

    $scope.removeDiscount = function () {
        $scope.appliedDiscountCode = "";
        $scope.discountMessage = "";
        $scope.discountAmount = 0;
    };

    $scope.applyDiscount = function () {

        var model = $scope.getDiscountModel();
        var myDataPromise = schedulerService.applyDiscount(model);
        myDataPromise.then(function (result) {
            if (result.data.result_set != null) {
                //Date.parse(GetDateWithStringCheck($scope.start))
                var startTime = Date.parse(GetDateWithStringCheck($scope.start));
                if (result.data.result_set.appliedStartTime <= startTime && result.data.result_set.appliedEndTime >= startTime) {
                    $scope.discountMessage = "Discount applied successfully";
                    $scope.appliedDiscountCode = $scope.discountCode;
                    $scope.isCashBack = result.data.result_set.isCashBack;
                    $scope.discountAmount = result.data.result_set.discountApplicable;
                    $scope.getTotalAmount();
                    $scope.discountServices = result.data.result_set.productServiceId;
                }
                else {
                    $scope.discountMessage = "Discount not applicable for selected date";//result.data.error.message; //"Discount not applicable for selected date";
                }
            }
            else {
                $scope.discountMessage = result.data.error.message;
            }
            $timeout(function () { $scope.discountMessage = ""; }, 3000);
        });
    };

    $scope.getDiscountModel = function () {

        var service = [];
        var totalAmount = 0;
        for (i = 0; i < $scope.selectedServicesListWithPrice.length; i++) {
            var serv =
                {
                    productServiceId: $scope.selectedServicesListWithPrice[i].id,
                    servicePrice: $scope.selectedServicesListWithPrice[i].price
                }
            service.push(serv);
            totalAmount += $scope.selectedServicesListWithPrice[i].price;
        }
        $scope.customerId = $scope.customerId > 0 ? $scope.customerId : -1;
        var model = {
            discount_code: $scope.discountCode,
            cityId: $scope.cityId,
            total_amt: totalAmount,
            services: service,
            //disc_value: 0,
            customer_id: $scope.customerId,
            address_id: 0,
            ap_time: 0,
            booking_time: 0,
            mobileNo: $scope.customerId == -1 ? $scope.customerMobNo : 0,
            appid: $scope.appId
        }
        return model;
    };

    $scope.BindBaseCenter = function () {

        $scope.basecenter = commonService.GetBaseServiceCenter($scope.cityId);
        $scope.basecenter.push({ id: -1, name: "All BaseCenter" });
        $scope.baseCenterId = "";
        dp.startDate = $scope.GetDaypilotDate($scope.currentDate);//new DayPilot.Date($scope.currentDate);
        $scope.GetAppointmentList($scope.currentDate);
        dp.update();

    }


    $scope.GetStylistByBasecenter = function () {

        $scope.Spinner = true;
        var date = new Date($scope.currentDate.getFullYear() + "-" + ($scope.currentDate.getMonth() + 1) + "-" + $scope.currentDate.getDate());
        if ($scope.browser != "chrome")
            date = new Date($scope.currentDate.getFullYear() + "/" + ($scope.currentDate.getMonth() + 1) + "/" + $scope.currentDate.getDate());
        var dat = Date.parse(date);

        var cityId = -1;
        var basecenter = -1;
        if ($scope.baseCenterId == -1)
            cityId = $scope.cityId;
        else {
            cityId = -1;
            basecenter = $scope.baseCenterId
        }


        var myDataPromise = schedulerService.GetStylistDetailWithAttendence(basecenter, cityId, dat);// Date.parse($scope.currentDate)); //Date.parse($scope.currentDate));1446661800000
        myDataPromise.then(function (result) {

            $scope.stylistList = [];
            $scope.stylistListDropDown = [];
            var stylistSortedIncentice = [];
            var stylistSortedCommission = [];
            var stylistSortedAssociate = [];

            if (result.data.result_set != null) {
                for (var i = 0; i < result.data.result_set.length; i++) {
                    var skillSet = "";
                    for (var j = 0; j < result.data.result_set[i].skillsets.length; j++) {
                        skillSet += result.data.result_set[i].skillsets[j].categoryName + ", ";
                    }
                    var startTime = "";
                    var endTime = "";
                    var checkIn = 0;
                    var checkOut = 0;
                    var workstatusId = 0;
                    var attendenceId = 0;
                    if (result.data.result_set[i].stylistAttendances.length > 0) {
                        startTime = result.data.result_set[i].stylistAttendances[0].fromTime;
                        endTime = result.data.result_set[i].stylistAttendances[0].toTime;
                        workstatusId = result.data.result_set[i].stylistAttendances[0].workStatusId;
                        checkIn = result.data.result_set[i].stylistAttendances[0].checkIn;
                        checkOut = result.data.result_set[i].stylistAttendances[0].checkOut;
                        attendenceId = result.data.result_set[i].stylistAttendances[0].id;
                    }
                    else {
                        startTime = "";
                        endTime = "";
                    }
                    var lat = result.data.result_set[i].stylistDetails == null ? 0 : result.data.result_set[i].stylistDetails.lastLatitude;
                    var long = result.data.result_set[i].stylistDetails == null ? 0 : result.data.result_set[i].stylistDetails.lastLongitude;

                    var stylist =
                        {
                            name: result.data.result_set[i].stylistName, id: result.data.result_set[i].id,
                            stTime: startTime, edTime: endTime, lat: lat, long: long, toolTip: skillSet, workstatusId: workstatusId,
                            checkIn: checkIn, checkOut: checkOut, attendenceId: attendenceId
                        };
                    var stylist1 =
                        {
                            name: result.data.result_set[i].stylistName, id: result.data.result_set[i].id,
                            stTime: startTime, edTime: endTime, lat: lat, long: long, toolTip: skillSet,
                            checkIn: checkIn, checkOut: checkOut, attendenceId: attendenceId
                        };

                    $scope.stylistListDropDown.push(stylist1);

                    if (result.data.result_set[i].stylistModelType.id == 1)//incentive
                    {
                        stylistSortedIncentice.push(stylist);
                    }
                    else if (result.data.result_set[i].stylistModelType.id == 2)//commision
                    {
                        stylistSortedCommission.push(stylist);
                    }
                    else if (result.data.result_set[i].stylistModelType.id == 3)//associate
                    {
                        stylist.name += "<br> (Associate) ";
                        stylistSortedAssociate.push(stylist);
                    }

                }

                $scope.stylistList = $scope.MergeStylist(stylistSortedIncentice, stylistSortedCommission, stylistSortedAssociate);

                //$scope.stylistList.push(stylist);
            }

            var date = $scope.currentDate;
            $scope.GetAppointmentList(date);//(new Date())
            $scope.Spinner = false;
            //google map
            var autocomplete = new google.maps.places.Autocomplete(document.getElementById('txtLandMark'));
            google.maps.event.addListener(autocomplete, 'place_changed', function () {
                var place = autocomplete.getPlace();
                $scope.landMark = place.name;//place.formatted_address;
                $scope.lat = place.geometry.location.lat();
                $scope.long = place.geometry.location.lng();
                $scope.$apply();
            });
        });
    };

    $scope.MergeStylist = function (stylistSortedIncentice, stylistSortedCommission, stylistSortedAssociate) {
        var v = $scope.SortAlphabetically(stylistSortedIncentice);
        var v1 = $scope.SortAlphabetically(stylistSortedCommission);
        var v2 = $scope.SortAlphabetically(stylistSortedAssociate);
        return $.merge($.merge($.merge([], v), v1), v2);
    };

    $scope.SortAlphabetically = function (array) {
        array.sort(function (a, b) {
            var a1 = a.name, b1 = b.name;
            if (a1 == b1) return 0;
            return a1 > b1 ? 1 : -1;
        });
        return array;
    }


    $scope.GetAppointmentList = function (date) {

        $scope.CategoryIds = commonService.GetServiceCategory();
        var d = date;//new Date();
        var month = d.getMonth() + 1;
        var day = d.getDate();

        //var output = d.getFullYear() + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;

        //var date1 = new Date(output);
        var output = d.getFullYear() + '/' + (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + day;
        var date = Date.parse(output);

        var currentDate = date;
        $scope.appointments = [];

        var cityId = -1;
        var basecenter = -1;
        if ($scope.baseCenterId == -1)
            cityId = $scope.cityId;
        else {
            cityId = -1;
            basecenter = $scope.baseCenterId
        }

        var myDataPromise = schedulerService.GetAppoiontmentByDateAndBasecenter(basecenter, cityId, currentDate);//Date.parse((new Date()))
        myDataPromise.then(function (result) {
            $scope.appointments = result.data.result_set;
            initScheduler(result.data.result_set, (date));
        });
    };



    $scope.$watch("start", function () {

        if ($scope.start != null && $scope.start != undefined && $scope.start != "")
            var date = Date.parse($scope.start)
        if (date != undefined && !isNaN(date))
            $scope.premiumTime($scope.start);
    }, true);

    $scope.$watch('customerId', function () {

        if ($scope.customerId > 0) {
            var myDataPromise = schedulerService.GetCustomerAppointments($scope.customerId);
            myDataPromise.then(function (result) {

                $scope.appointmentList = [];
                for (var i = 0; i < result.data.result_set.appointments.length; i++) {
                    var serviceName = "";
                    var totalServiceCost = 0;
                    for (j = 0; j < result.data.result_set.appointments[i].services.length; j++) {
                        if (result.data.result_set.appointments[i].services.length - 1 == j)
                            serviceName += result.data.result_set.appointments[i].services[j].serviceName;
                        else
                            serviceName += result.data.result_set.appointments[i].services[j].serviceName + " , ";
                        totalServiceCost += result.data.result_set.appointments[i].services[j].payableAmount;
                    }
                    var therapist = "";
                    if (result.data.result_set.appointments[i].stylist != null && result.data.result_set.appointments[i].stylist != undefined)
                        therapist = result.data.result_set.appointments[i].stylist.stylistName;
                    var appointment = {
                        date: GetDateFormat(new Date(result.data.result_set.appointments[i].ap_time)),
                        cost: totalServiceCost,//result.data.result_set.appointments[i].serviceTime,
                        duration: 30,
                        therapist: therapist,
                        service: serviceName
                    };
                    $scope.appointmentList.push(appointment);
                }
            });

            //get belita money
            var dataPromise = schedulerService.GetBelitaMoney($scope.customerId)
            dataPromise.then(function (result) {

                if (result.data != null && result.data.result_set != null && result.data.result_set.length > 0)
                    $scope.BelitaMoney = result.data.result_set[0].actualAmount;
            });

        }
    })

    $scope.$watch('selectedCategoryIds', function (id) {
        if ($scope.cityId != 0 && $scope.selectedCategoryIds.length > 0) {
            var myDataPromises = schedulerService.GetServiceByCategoryAndCityId($scope.cityId, $scope.selectedCategoryIds);
            myDataPromises.then(function (result) {

                $scope.ServicesIds = [];
                if (result.data.result_set != null) {
                    for (var i = 0; i < result.data.result_set.length; i++) {
                        var price = result.data.result_set[i].serviceCityMappingInfo[0].servicePrice == null ? "0" : result.data.result_set[i].serviceCityMappingInfo[0].servicePrice;
                        var cat = {
                            "id": result.data.result_set[i].serviceId,
                            "name": result.data.result_set[i].serviceName + ", " + price
                        }
                        $scope.ServicesIds.push(cat);
                    }
                    $scope.servicesList = result.data.result_set;

                    //bind selected services
                    if (servicesIds.length > 0) {
                        for (var i = 0; i < servicesIds.length; i++)
                            $scope.selectedServicesIds.push(servicesIds[i]);
                    }
                    servicesIds = [];
                }
            });
        }
        else {
            $scope.text1 = "Select";
        }
    }, true);

    $scope.$watch('selectedServicesIds', function () {

        //$scope.servicesList = [];
        if ($scope.selectedServicesIds.length == 0)
            $scope.text1 = "Select";
        else
            $scope.text1 = "";
        $scope.selectedServicesListWithPrice = [];
        var servicesIds = [];
        for (var i = 0; i < $scope.selectedServicesIds.length; i++) {
            for (j = 0; j < $scope.servicesList.length; j++) {
                if ($scope.selectedServicesIds[i] == $scope.servicesList[j].serviceId) {
                    var service = {
                        id: $scope.servicesList[j].serviceId,
                        name: $scope.servicesList[j].serviceName,
                        price: $scope.servicesList[j].serviceCityMappingInfo[0].servicePrice,
                        time: $scope.servicesList[j].serviceCityMappingInfo[0].serviceTime
                    }
                    $scope.selectedServicesListWithPrice.push(service);
                    $scope.text1 += $scope.servicesList[j].serviceName + ", ";
                    servicesIds.push($scope.servicesList[j].serviceId);
                }
            }
        }
        $scope.selectedServicesIds = servicesIds;
        if ($scope.text1.length > 25) {
            $scope.text1 = $scope.text1.substr(0, 20);
            $scope.text1 += "...";
        }

        //remove discount if service is removed
        if ($scope.isLoading == 0) {
            $scope.removeDiscount();
        }
        else {
            $scope.isLoading = 0;
        }
    }, true);


    $scope.getTotalAmount = function () {

        var amount = 0;
        for (var i = 0; i < $scope.selectedServicesListWithPrice.length; i++) {
            amount += $scope.selectedServicesListWithPrice[i].price;
        }
        if (!$scope.isCashBack)
            amount -= $scope.discountAmount == undefined ? 0 : $scope.discountAmount;
        amount += amount * (15 / 100); //(14.5 / 100);
        amount += $scope.premiumAmount;
        if ($scope.selectedServicesIds.length > 0)
            $scope.totalAmountWithTax = Math.round(amount);
        else
            $scope.totalAmountWithTax = 0;
        $scope.TotalAmountWithTax = $scope.totalAmountWithTax;
        return $scope.totalAmountWithTax;
    };

    $scope.getTax = function () {
        var amount = 0;
        for (var i = 0; i < $scope.selectedServicesListWithPrice.length; i++) {
            amount += $scope.selectedServicesListWithPrice[i].price;
        }
        amount -= $scope.discountAmount == undefined ? 0 : $scope.discountAmount;
        amount = amount * (15 / 100); //(14.5 / 100);
        return amount;
    };

    $scope.getTotalAmountExTax = function () {
        var amount = 0;
        for (var i = 0; i < $scope.selectedServicesListWithPrice.length; i++) {
            amount += $scope.selectedServicesListWithPrice[i].price;
        }
        return amount;
    };

    $scope.getTotalTime = function () {
        var time = 0;
        for (var i = 0; i < $scope.selectedServicesListWithPrice.length; i++) {
            time += $scope.selectedServicesListWithPrice[i].time;
        }
        return time;
    };


    $scope.CreateAppointment = function () {
        $scope.serviceTime = $scope.getTotalTime();
        var v = $scope.checkStylistAvailability();
        v.then(function (result) {
            if (result.status != undefined && result.status != null) {
                if (result.status == 2 && ($scope.appointmentStatusId != "3" && $scope.appointmentStatusId != "4" && $scope.appointmentStatusId != "7")) {//
                    var errorMessage = result.error.message.split('|');
                    var message = "";
                    angular.forEach(errorMessage, function (item, index) {
                        message += item + " and ";
                    });
                    message = message.slice(0, -4) + ".";
                    var v = confirm(message + "\n" + "Do you want to continue anyway?");
                    if (!v) {
                        $scope.Spinner = false;
                        return;
                    }
                }
                if ($scope.paymentType == 1 && $scope.BelitaMoney < $scope.TotalAmountWithTax && $scope.appDisableModify == false) {
                    alert("Insufficient Belita Money");
                }
                else {
                    $scope.Spinner = true;
                    if ($scope.appId == 0 && ($scope.customerId == 0 || $scope.customerId == -1)) {
                        var myDataPromise = schedulerService.AddCustomer($scope.GetCustomerModel());
                        myDataPromise.then(function (result) {
                            if (result.data.result_set != null) {
                                $scope.createdCustomerId = result.data.result_set.id;
                                if (result.data.result_set.addressDetail.length > 0)
                                    $scope.addressId = result.data.result_set.addressDetail[0].id;
                                $scope.createdBy = $rootScope.globals.currentUser.id;
                                var myDataPromise1 = schedulerService.AddAppointment($scope.GetAppointmentModel());
                                myDataPromise1.then(function (result1) {
                                    if (result1.data.result_set != null) {
                                        $("#hide").click();
                                        $scope.message = "Appointment created successfully";

                                        //rebind appointmnets
                                        $scope.GetAppointmentList($scope.currentDate);
                                        $scope.Spinner = false;
                                        dp.heightSpec = "Max";
                                        var v = dp.resources.length;
                                        dp.height = $scope.windowHeight();//v * 40 + 40;
                                        dp.update();
                                        $scope.ClearForm();
                                    }
                                    else {
                                        $scope.message = result1.data.error.message;
                                    }
                                    HideMessage();
                                });
                            }
                        });
                    }
                    else if ($scope.appId == 0 && $scope.customerId != 0) {

                        var myDataPromise = schedulerService.UpdateCustomer($scope.GetCustomerModel());
                        myDataPromise.then(function (result) {
                            if (result.data.result_set != null) {
                                $scope.createdCustomerId = result.data.result_set.id;
                                if (result.data.result_set.addressDetail.length > 0)
                                    $scope.addressId = result.data.result_set.addressDetail[0].id;
                                $scope.createdBy = $rootScope.globals.currentUser.id;
                                var myDataPromise1 = schedulerService.AddAppointment($scope.GetAppointmentModel());
                                myDataPromise1.then(function (result1) {
                                    if (result1.data.result_set != null) {
                                        $("#hide").click();
                                        $scope.message = "Appointment created successfully";
                                        HideMessage();
                                        //rebind appointmnets
                                        $scope.GetAppointmentList($scope.currentDate);
                                        $scope.Spinner = false;
                                        dp.heightSpec = "Max";
                                        var v = dp.resources.length;
                                        dp.height = $scope.windowHeight();//v * 40 + 40;
                                        dp.update();
                                        $scope.ClearForm();
                                    }
                                    else {
                                        $scope.message = result1.data.error.message;
                                    }
                                });
                            }
                        });
                    }
                    else {
                        var myDataPromise = schedulerService.UpdateCustomer($scope.GetCustomerModel());
                        myDataPromise.then(function (result) {
                            if (result.data.result_set != null) {
                                $scope.createdCustomerId = result.data.result_set.id;
                                if (result.data.result_set.addressDetail.length > 0)
                                    $scope.addressId = result.data.result_set.addressDetail[0].id;
                                $scope.updatedBy = $rootScope.globals.currentUser.id;
                                $scope.sentNotification = true;
                                //if ($scope.appointmentStatusId == 4 && confirm("Do you want to send notification?"))
                                //    $scope.sentNotification = true;
                                var myDataPromise1 = schedulerService.UpdateAppointment($scope.GetAppointmentModel());
                                myDataPromise1.then(function (result1) {
                                    if (result1.data.result_set != null) {
                                        $("#hide").click();
                                        $scope.message = "Appointment updated successfully";
                                        HideMessage();
                                        //rebind appointmnets
                                        $scope.GetAppointmentList($scope.currentDate);
                                        $scope.Spinner = false;
                                        dp.heightSpec = "Max";
                                        var v = dp.resources.length;
                                        dp.height = $scope.windowHeight();//v * 40 + 40;
                                        dp.update();
                                        $scope.ClearForm();
                                    }
                                    else {
                                        $scope.message = result1.data.error.message;
                                        HideMessage();
                                        $scope.GetAppointmentList($scope.currentDate);
                                    }
                                });
                            }
                        });
                    }
                }
            }
        });
        return;
    };

    $scope.CancelAppointments = function () {
        $scope.ClearForm();
        dp.heightSpec = "Max";
        var v = dp.resources.length;
        dp.height = $scope.windowHeight();//v * 40 + 40;
        dp.update();
    };

    function HideMessage() {
        $timeout(function () { $scope.message = ""; }, 3000);
    }

    $scope.GetCustomerModel = function () {
        var model = {
            name: $scope.customerName,
            mobile: $scope.customerMobNo,
            email: $scope.customerEmail,
            addressDetail: [
              {
                  id: $scope.addressId,
                  serviceCity: { "id": $scope.cityId },
                  addressType: { "id": $scope.addressTypeId },
                  streetAddress: $scope.customerAddress,
                  landMark: $scope.landMark,
                  zipCode: $scope.pinCode,
                  latitude: $scope.lat == "" ? 0 : $scope.lat,
                  longitude: $scope.long == "" ? 0 : $scope.long
              }
            ],
            id: $scope.customerId,
            isFemale: 1,
            notes: $scope.customerNotes
        }
        return model;
    };

    $scope.GetAppointmentModel = function () {

        var customerId = $scope.createdCustomerId == 0 ? $scope.customerId : $scope.createdCustomerId;

        if ($.type($scope.start) == "date") //Date.parse($scope.start)
        {
            var date = ($scope.start.getDate() < 10 ? '0' : '') + $scope.start.getDate() + '/' + (($scope.start.getMonth() + 1) < 10 ? '0' : '') + ($scope.start.getMonth() + 1) + '/' + $scope.start.getFullYear() + " " + $scope.start.getHours() + ":" + ("0" + $scope.start.getMinutes()).slice(-2);
            $scope.start = date;
        }

        var dateArray = $scope.start.split(' ');
        var selectedDate = dateArray[0].split('/');
        var selectedTime = dateArray[1].split(':');
        var dat = selectedDate[2] + "-" + selectedDate[1] + "-" + selectedDate[0] + " " + selectedTime[0] + ":" + selectedTime[1] + ":00";
        if ($scope.browser != "chrome")
            dat = selectedDate[2] + "/" + selectedDate[1] + "/" + selectedDate[0] + " " + selectedTime[0] + ":" + selectedTime[1] + ":00";
        var date = new Date(dat);
        var servicesArray = [];
        for (var i = 0; i < $scope.selectedServicesIds.length; i++) {
            var services = {
                discountCode: "",
                id: 0,
                payableAmount: 0,
                productServiceId: $scope.selectedServicesIds[i],
                serviceName: "",
                servicePrice: 0,
                taxAmount: 0
            }
            servicesArray.push(services);
        }

        //
        $scope.OldTransactionObject = $scope.OldTransactionObject.filter(function (el) {
            return el.id !== 0;
        });
        if ($scope.appDisableModify == false && $scope.appointmentStatusId != 4) {
            var paidAmount = 0;
            var refundAmount = 0;
            for (var i = 0; i < $scope.OldTransactionObject.length; i++) {
                if ($scope.OldTransactionObject[i].paytype != 3 && $scope.OldTransactionObject[i].is_debit == 1) {
                    //add amount
                    paidAmount += $scope.OldTransactionObject[i].trans_amount;
                }
                else if ($scope.OldTransactionObject[i].paytype != 3 && $scope.OldTransactionObject[i].is_debit == 0) {
                    //deduct amount
                    paidAmount -= $scope.OldTransactionObject[i].trans_amount;
                }
                if ($scope.paymentType == 1 && $scope.OldTransactionObject[i].paytype == 3 && $scope.OldTransactionObject.length >= 1)
                    $scope.OldTransactionObject[i].isDeleted = 1;
            }
            if ((paidAmount - $scope.TotalAmountWithTax) <= 0) {
                //for debit

                if ($scope.paymentType == "3") {
                    refundAmount = paidAmount;
                    //if (refundAmount == 0) {
                    if ($scope.OldTransactionObject.length == 0) {
                        $scope.OldTransactionObject.push({
                            id: 0,
                            appid: $scope.appId,
                            paytype: $scope.paymentType,
                            paytype_desc: "",
                            pay_status: $scope.paymentType == "3" ? 2 : 1,
                            pay_status_desc: "",
                            trans_status: $scope.paymentType == "3" ? 3 : 1,
                            trans_status_desc: "",
                            trans_amount: $scope.TotalAmountWithTax,
                            trans_remarks: "",
                            trans_date: 0,
                            paytm_order_id: "",
                            paytm_txn_id: "",
                            is_debit: 1
                        });
                    }
                    else if ($scope.OldTransactionObject.length >= 1 && $scope.paymentType == "3")//&& $scope.OldTransactionObject[0].paytype == 3) //for cod
                    {
                        var isCodExists = false;
                        for (var i = 0; i < $scope.OldTransactionObject.length; i++) {
                            if ($scope.OldTransactionObject[i].paytype == 3) {
                                $scope.OldTransactionObject[i].trans_amount = $scope.TotalAmountWithTax;
                                isCodExists = true;
                            }
                        }
                        if (!isCodExists) {
                            $scope.OldTransactionObject.push({
                                id: 0,
                                appid: $scope.appId,
                                paytype: $scope.paymentType,
                                paytype_desc: "",
                                pay_status: $scope.paymentType == "3" ? 2 : 1,
                                pay_status_desc: "",
                                trans_status: $scope.paymentType == "3" ? 3 : 1,
                                trans_status_desc: "",
                                trans_amount: $scope.TotalAmountWithTax,
                                trans_remarks: "",
                                trans_date: 0,
                                paytm_order_id: "",
                                paytm_txn_id: "",
                                is_debit: 1
                            });
                        }
                    }
                    else if ($scope.OldTransactionObject.length >= 1 && $scope.OldTransactionObject[$scope.OldTransactionObject.length - 1].paytype == 1)//belita money
                    {
                        $scope.OldTransactionObject.push({
                            id: 0,
                            appid: $scope.appId,
                            paytype: $scope.paymentType,
                            paytype_desc: "",
                            pay_status: $scope.paymentType == "3" ? 2 : 1,
                            pay_status_desc: "",
                            trans_status: $scope.paymentType == "3" ? 3 : 1,
                            trans_status_desc: "",
                            trans_amount: $scope.TotalAmountWithTax,
                            trans_remarks: "",
                            trans_date: 0,
                            paytm_order_id: "",
                            paytm_txn_id: "",
                            is_debit: 1
                        });
                    }
                    //}
                }
                else {
                    if ((paidAmount - $scope.TotalAmountWithTax) != 0) {
                        $scope.OldTransactionObject.push({
                            id: 0,
                            appid: $scope.appId,
                            paytype: $scope.paymentType,
                            paytype_desc: "",
                            pay_status: $scope.paymentType == "3" ? 2 : 1,
                            pay_status_desc: "",
                            trans_status: $scope.paymentType == "3" ? 3 : 1,
                            trans_status_desc: "",
                            trans_amount: (paidAmount - $scope.TotalAmountWithTax) * -1,//$scope.TotalAmountWithTax,
                            trans_remarks: "",
                            trans_date: 0,
                            paytm_order_id: "",
                            paytm_txn_id: "",
                            is_debit: 1
                        });
                    }
                }

            }
            else if ((paidAmount - $scope.TotalAmountWithTax) > 0 && $scope.paymentType != "3") {
                //for credit
                refundAmount = $scope.OldTotalAmount - $scope.TotalAmountWithTax;
            }
            else if ((paidAmount - $scope.TotalAmountWithTax) > 0 && $scope.paymentType == "3") {
                refundAmount = paidAmount;
                if (refundAmount != 0) {
                    $scope.OldTransactionObject.push({
                        id: 0,
                        appid: $scope.appId,
                        paytype: $scope.paymentType,
                        paytype_desc: "",
                        pay_status: $scope.paymentType == "3" ? 2 : 1,
                        pay_status_desc: "",
                        trans_status: $scope.paymentType == "3" ? 3 : 1,
                        trans_status_desc: "",
                        trans_amount: $scope.TotalAmountWithTax,
                        trans_remarks: "",
                        trans_date: 0,
                        paytm_order_id: "",
                        paytm_txn_id: "",
                        is_debit: 1
                    });
                }
            }
        }
        var paymentModeString = "";
        $scope.paymentModeAmount = ($scope.paymentModeAmount == undefined || $scope.paymentModeAmount == null || $scope.paymentModeAmount == "") ? 0 : $scope.paymentModeAmount;
        if ($scope.paymentMode != undefined && $scope.paymentMode != null && $scope.paymentMode.trim() != "")
            paymentModeString = "Paid " + $scope.paymentModeAmount + " by " + $scope.paymentMode + " and " + ($scope.getTotalAmount() - $scope.paymentModeAmount) + " by " + ($scope.paymentType == 1 ? "BM" : "COD");
        else
            paymentModeString = "Paid " + ($scope.getTotalAmount() - $scope.paymentModeAmount) + " by " + ($scope.paymentType == 1 ? "BM" : "COD");
        var model = {
            customer_id: customerId,
            address_id: $scope.addressId,
            menu_ids: $scope.selectedServicesIds,
            ap_time: (Date.parse(date)),
            booking_time: Date.parse(new Date()),
            stylist: { id: $scope.stylistId },
            appid: $scope.appId,
            discount_code: $scope.appliedDiscountCode,
            ap_status: $scope.appointmentStatusId,
            disc_value: $scope.discountAmount,
            specificRequest: $scope.specificRequest,
            paymentMethod: $scope.paymentMode,
            paymentMethodRemarks: paymentModeString,
            premium_time: $scope.premiumTimeValue,
            services: servicesArray,
            cityId: $scope.cityId,
            trans_details: $scope.OldTransactionObject,
            cancel_reason: $scope.CancelAppointmentReason,
            refund_amount: refundAmount,
            createdBy: $rootScope.globals.currentUser.id,
            appointmentCreatedBy: {
                id: $scope.createdBy,
                userName: "",
                userRoleTypeDTO: [
                        {
                            id: 0,
                            roleDescription: ""
                        }
                ],
                password: ""
            },
            appointmentModifiedBy: {
                id: $scope.updatedBy,
                userName: "",
                userRoleTypeDTO: [
                {
                    id: 0,
                    roleDescription: ""
                }
                ],
                password: ""
            },
            send_notification: $scope.sentNotification,
            paymentMethodAmount: $scope.paymentModeAmount
        };
        return model;
    };

    $scope.ClearForm = function () {
        $scope.updatedBy = 0;
        $scope.createdBy = 0;
        $scope.customerName = "";
        $scope.customerMobNo = "";
        $scope.customerEmail = "";
        $scope.customerAddress = "";
        $scope.landMark = "";
        $scope.lat = 0;
        $scope.long = 0;
        $scope.selectedServicesIds = [];
        //$scope.start = "";
        $scope.stylistId = "";
        $scope.selectedCategoryIds = [];
        $scope.text = "Select";
        $scope.text1 = "Select";
        $scope.createdCustomerId = 0;
        $scope.customerId = 0;
        $scope.addressId = 0;
        $scope.appId = 0;
        $scope.discountCode = "";
        $scope.start = "";
        $scope.appointmentStatusId = "";
        $scope.appointmentList = [];

        $scope.appliedDiscountCode = "";
        $scope.discountMessage = "";
        $scope.discountAmount = 0;
        $scope.totalAmountWithTax = 0;
        $scope.specificRequest = "";
        $scope.addressId = 0;
        $scope.paymentMode = "";
        $scope.premiumAmount = 0;
        servicesIds = [];
        $scope.premiumTimeValue = "";
        $scope.pinCode = "";
        $scope.isLoading = 0;
        $scope.isCreateOrModify = 0;
        $scope.BelitaMoney = 0;
        $scope.TotalAmountWithTax = 0;
        $scope.CancelAppointmentReason = "";
        $scope.OldTransactionObject = [];
        $scope.OldTotalAmount = 0;
        $scope.addressTypeId = "1";
        //$scope.addressArray = [];
        $scope.appDisableModify = false;
        $scope.customerNotes = "";
        $scope.PettyCashAmount = 0;
        $scope.serviceTime = 0;
        $scope.sentNotification = false;
        $scope.paymentModeAmount = 0;
    };

    $scope.StartScheduler = function () {
        $scope.GetStylistByBasecenter();
        $scope.appointmentStatusList = commonService.GetAppointmentStatusType();
        $scope.paymentStatusList = commonService.GetPaymentStatus();

    };

    $scope.AppointmentStatusUpdate = function (appId, appStatus) {

        var myDataPromise = schedulerService.UpdateAppointmentStatus(appId, appStatus);
        myDataPromise.then(function (result) {
            if (result.data.msg != null && result.data.msg.code == "1") {
                $scope.message = "Appointment updated successfully";
                HideMessage();
                $scope.GetAppointmentList($scope.currentDate);
            }
            else {
                $scope.message = "An error occur while updating appointment";
                HideMessage();
            }
            $scope.ClearForm();
        });
    };

    //google search textbox
    function initialize() {
        var input = document.getElementById('txtLandMark');
        var options = { componentRestrictions: { country: 'in' } };

        var autocomplete = new google.maps.places.Autocomplete(input, options);
        //autocomplete.addListener('place_changed', function () {
        //    
        //    var place = autocomplete.getPlace();
        //});
    }

    $scope.GetDaypilotDate = function (date) {
        return new DayPilot.Date(new Date(Date.parse(date) + 23400000));
    };

    google.maps.event.addDomListener(window, 'load', initialize);
    var servicesIds = [];
    var dp = "";
    function loadScheduler(date) {
        dp = new DayPilot.Scheduler("dp");
        // view


        dp.startDate = new DayPilot.Date(date);//new Date());//"2013-03-25"  // or just dp.startDate = "2013-03-25";
        //dp.cellGroupBy = "Month";
        dp.days = 1;
        dp.cellWidth = 18;
        dp.cellHeight = 20;
        dp.minCellHeight = 20;
        dp.eventHeight = 40;
        //dp.rowHeight = 30;
        //dp.cellDuration = 1440; // one day
        dp.timeHeaders = [
            { groupBy: "Day" },
            { groupBy: "Hour" },
            { groupBy: "Cell" }
        ];
        //dp.scale = "Hour";
        dp.scale = "CellDuration"
        dp.cellDuration = "15"
        dp.businessBeginsHour = "6"
        dp.businessEndsHour = "21"
        dp.showNonBusiness = true;
        dp.contextMenuSelection = "menu";
        dp.allowEventOverlap = false;
        dp.treeEnabled = false;
        dp.rowHeaderWidthAutoFit = false;
        dp.rowHeaderWidth = 150;
        //dp.rowMinHeight = 20;
        //dp.rowHeight = 20;
        dp.TimeRangeSelectedHandling = "enabled";
        dp.eventHoverHandling = "Bubble";
        dp.eventResizeHandling = "Disabled";

        // bubble, sync loading
        // see also DayPilot.Event.data.staticBubbleHTML property
        dp.bubble = new DayPilot.Bubble();
        //dp.contextMenu
        function GetContextMenu(disable, disableRequested, appointmentStatus, modifyDisabled) {
            return new DayPilot.Menu({
                items: [

                    {
                        text: "Modify Appointment", onclick: function () {

                            $scope.ClearForm();
                            $scope.appId = this.source.id();
                            var dateLong = Date.parse(this.source.start());
                            var date = new Date(dateLong - $scope.ist);
                            //$scope.start = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
                            if ($scope.browser != "chrome")
                                date = new Date(dateLong);

                            $scope.start = date;//(date.getDate() < 10 ? '0' : '') + date.getDate() + '/' + ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1) + '/' + date.getFullYear() + " " + date.getHours() + ":" + ("0" + date.getMinutes()).slice(-2);

                            //get premiumtime
                            $scope.premiumTime(date);
                            var myDataPromise = schedulerService.GetAppointmentByAppId($scope.appId);
                            myDataPromise.then(function (result) {

                                if (result.data.result_set != null) {
                                    $scope.appDisableModify = result.data.result_set.booking_source.id == 2 ? true : false;
                                    var elm = document.getElementsByClassName("btnDropdown");
                                    var elm1 = document.getElementsByClassName("select_arrow");
                                    if ($scope.appDisableModify == true) {
                                        angular.element(elm).attr("disabled", "disabled");
                                        angular.element(elm1).attr("disabled", "disabled");
                                    }
                                    else {
                                        angular.element(elm).removeAttr("disabled");
                                        angular.element(elm1).removeAttr("disabled");
                                    }


                                    var customerDetail = result.data.result_set.customerDetail;
                                    $scope.addressId = result.data.result_set.address.id;
                                    $scope.customerId = customerDetail.id;
                                    $scope.customerMobNo = customerDetail.mobile;
                                    $scope.customerName = customerDetail.name;
                                    $scope.customerEmail = customerDetail.email;
                                    $scope.customerNotes = customerDetail.notes;

                                    //$scope.customerAddress = customerDetail.addressDetail[0].streetAddress;
                                    //$scope.pinCode = customerDetail.addressDetail[0].zipCode;
                                    //$scope.landMark = customerDetail.addressDetail[0].landMark;
                                    //$scope.lat = customerDetail.addressDetail[0].latitude;
                                    //$scope.long = customerDetail.addressDetail[0].longitude;

                                    $scope.addressarray = customerDetail.addressDetail;
                                    for (var i = 0; i < customerDetail.addressDetail.length; i++) {
                                        if (customerDetail.addressDetail[i].addressType.id == result.data.result_set.address.addressType.id) {//1) {
                                            $scope.customerAddress = customerDetail.addressDetail[i].streetAddress;
                                            $scope.pinCode = customerDetail.addressDetail[i].zipCode;
                                            $scope.landMark = customerDetail.addressDetail[i].landMark;
                                            $scope.lat = customerDetail.addressDetail[i].latitude;
                                            $scope.long = customerDetail.addressDetail[i].longitude;
                                            $scope.addressTypeId = String(customerDetail.addressDetail[i].addressType.id);//"1";
                                            break;
                                        }
                                        else {
                                            $scope.customerAddress = customerDetail.addressDetail[0].streetAddress;
                                            $scope.pinCode = customerDetail.addressDetail[0].zipCode;
                                            $scope.landMark = customerDetail.addressDetail[0].landMark;
                                            $scope.lat = customerDetail.addressDetail[0].latitude;
                                            $scope.long = customerDetail.addressDetail[0].longitude;
                                            $scope.addressTypeId = String(customerDetail.addressDetail[0].addressType.id);
                                        }
                                    }

                                    $scope.stylistId = String(result.data.result_set.stylist.id);
                                    $scope.appointmentStatusId = String(result.data.result_set.ap_status);
                                    $scope.specificRequest = result.data.result_set.specificRequest;
                                    $scope.paymentMode = result.data.result_set.paymentMethod;
                                    if (result.data.result_set.isCashBack == 1)
                                        $scope.isCashBack = true;
                                    $scope.discount_Code = result.data.result_set.discount_code;
                                    $scope.discountAmount = result.data.result_set.disc_value;
                                    $scope.appliedDiscountCode = result.data.result_set.discount_code;
                                    $scope.OldTotalAmount = result.data.result_set.total_amt;
                                    var categoriesId = [];
                                    $scope.servicesList = result.data.result_set.services;
                                    for (var i = 0; i < result.data.result_set.services.length; i++) {
                                        categoriesId.push(result.data.result_set.services[i].categoryId);
                                        servicesIds.push(result.data.result_set.services[i].productServiceId);
                                    }
                                    categoriesId = jQuery.unique(categoriesId);

                                    var categoryText = "";
                                    for (var i = 0; i < categoriesId.length; i++) {
                                        for (var j = 0; j < $scope.CategoryIds.length; j++) {
                                            if (categoriesId[i] == $scope.CategoryIds[j].id) {
                                                categoryText += $scope.CategoryIds[j].name + ",";
                                            }
                                        }
                                    }
                                    $scope.text = categoryText;

                                    var catId = [];
                                    for (var i = 0; i < categoriesId.length; i++) {
                                        catId.push(categoriesId[i]);
                                    }
                                    $scope.isLoading = 1;
                                    $scope.selectedCategoryIds = catId;
                                    $scope.OldTransactionObject = result.data.result_set.trans_details;
                                    dp.heightSpec = "Max";
                                    dp.height = 150; //$scope.windowHeight();//
                                    dp.update();
                                    $(".employee_details_box").show(100);
                                    $scope.isCreateOrModify = 1;
                                    if (result.data.result_set.appointmentCreatedBy != undefined && result.data.result_set.appointmentCreatedBy != null) {
                                        $scope.createdBy = result.data.result_set.appointmentCreatedBy.id;
                                    }
                                    else
                                        $scope.createdBy = $rootScope.globals.currentUser.id;
                                    $scope.updatedBy = $rootScope.globals.currentUser.id;
                                    $scope.paymentModeAmount = result.data.result_set.paymentMethodAmount;
                                }
                            });
                            $scope.$apply();
                        }, disabled: modifyDisabled
                    },

                    {
                        text: "Appointment Status", items: $scope.modifyAppointmentItems(disableRequested), disabled: disableRequested

                    },
                    {
                        text: "Feedback", onclick: function () {
                            $scope.ClearFeedbackForm();
                            $scope.feedbackAppId = this.source.id();
                            $scope.feedbackCustId = this.source.data.customerId;
                            $scope.appointmentStatusId = appointmentStatus;
                            var myDataPromise = schedulerService.GetAppointmentByAppId($scope.feedbackAppId);
                            myDataPromise.then(function (result) {
                                if (result.data.result_set != null && result.data.result_set.feedback != null) {
                                    $scope.feedBackRating = String(result.data.result_set.feedback.totalRating);
                                    if (result.data.result_set.feedback.dislikeQualities != "") {
                                        var feedback = result.data.result_set.feedback.dislikeQualities.split(',');
                                        $scope.feedbackText = "";
                                        for (var i = 0; i < feedback.length; i++) {
                                            $scope.feedbackText += feedback[i].trim() + ", ";
                                            if (feedback[i] != "")
                                                $scope.feedbackDislike.push(feedback[i].trim())
                                        }
                                        if ($scope.feedbackText.length > 25) {
                                            $scope.feedbackText = $scope.feedbackText.substr(0, 20);
                                            $scope.feedbackText += "...";
                                        }
                                    }
                                    $scope.feedbackComment = result.data.result_set.feedback.additionalComment;
                                    $scope.feedBackId = result.data.result_set.feedback.id;
                                }
                            });

                            $("#dvFeedBackAdd").modal("show");
                        }, disabled: disable
                    },
                    {
                        text: "Email Invoice", onclick: function () {

                            var myDataPromise = schedulerService.SendInvoice(this.source.id());
                            myDataPromise.then(function (result) {
                                if (result.data.msg != null) {
                                    $scope.message = result.data.msg.message;
                                    HideMessage();
                                }
                            });
                        }, disabled: disable
                    },
                    {
                        text: "Appointment Detail", onclick: function () {
                            $scope.ClearAppointmentDetail();
                            var myDataPromise = appointmentDetailsService.GetAppointment(parseInt(this.source.id()));
                            myDataPromise.then(function (result) {
                                if (result.data.result_set != null || result.data.result_set != undefined) {
                                    $scope.appDetailId = result.data.result_set.appid;
                                    $scope.custName = result.data.result_set.customerDetail.name;
                                    $scope.appBookTime = GetDateFormat(result.data.result_set.booking_time);
                                    $scope.appStartTime = GetDate(result.data.result_set.ap_time);
                                    $scope.appEndTime = GetDate(result.data.result_set.ap_end_time);
                                    $scope.appStatus = result.data.result_set.ap_status_desc;
                                    $scope.appDetailNotes = result.data.result_set.customerDetail.notes;
                                    $scope.appSpReq = result.data.result_set.specificRequest;
                                    $scope.appPaymentMethod = result.data.result_set.paymentMethod;
                                    $scope.appBookingSourcde = result.data.result_set.booking_source.description;
                                    $scope.appDiscountCode = result.data.result_set.discount_code;
                                    $scope.appNetPrice = result.data.result_set.total_amt;
                                    $scope.appCreatedBy = result.data.result_set.appointmentCreatedBy.userName;
                                    $scope.appModifiedBy = result.data.result_set.appointmentModifiedBy.userName;
                                    $scope.appStylistName = result.data.result_set.stylist.stylistName;
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
                                    $scope.appFeedback = "";
                                    if (result.data.result_set.feedback != null) {
                                        if (result.data.result_set.feedback.totalRating != "")
                                            $scope.appFeedback += "Rating:" + result.data.result_set.feedback.totalRating;
                                        if (result.data.result_set.feedback.totalRating <= 3)
                                            $scope.appFeedback += ", DislikeQualities: " + result.data.result_set.feedback.dislikeQualities;
                                        if (result.data.result_set.feedback.additionalComment != "")
                                            $scope.appFeedback += ", AdditionalComment: " + result.data.result_set.feedback.additionalComment;
                                    }
                                    $scope.appStylistFeedback = "";
                                    if (result.data.result_set.stylistFeedbackDTO != null && result.data.result_set.stylistFeedbackDTO != undefined) {
                                        $scope.appStylistFeedback = result.data.result_set.stylistFeedbackDTO.feedback + ", Rating:" + result.data.result_set.stylistFeedbackDTO.rate;
                                    }
                                    $("#dvAppointmentDetail").modal("show");
                                }
                            });
                        }
                    }
                ]
            });
        }



        //dp.contextMenuSelection = new DayPilot.Menu([
        //{
        //    text: "New appointment", onclick: function (args) {

        //        $scope.ClearForm();
        //        var v = dp.cells.find(this.source.start, this.source.resource)

        //        var dateLong = Date.parse(this.source.start);
        //        var date = new Date(dateLong - $scope.ist);
        //        if ($scope.browser != "chrome")
        //            date = new Date(dateLong);
        //        $scope.start = (date.getDate() < 10 ? '0' : '') + date.getDate() + '/' + ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1) + '/' + date.getFullYear() + " " + date.getHours() + ":" + ("0" + date.getMinutes()).slice(-2);

        //        $scope.end = this.source.end;
        //        $scope.resource = this.source.resource;
        //        $scope.stylistId = this.source.resource;
        //        //get premiumtime
        //        $scope.premiumTime(date);

        //        $(".employee_details_box").show(100);
        //        $scope.isCreateOrModify = 1;
        //        dp.heightSpec = "Max";
        //        dp.height = 150;
        //        dp.update();
        //        $scope.$apply();
        //    }
        //},
        //{
        //    text: "Petty Cash", onclick: function (args) {
        //        if ($scope.baseCenterId == "-1") {
        //            alert("Please select specific basecenter");
        //        }
        //        else {
        //            $scope.getPettyCash();
        //            $scope.getPettyCashUnApproved();
        //            $scope.ClearPettyCash();
        //            $("#dvPettyCash").modal("show");
        //        }
        //    }, disabled: $scope.pettyCashDisabled()
        //}
        //]);


        dp.onBeforeTimeHeaderRender = function (args) {
            $scope.bindContextMenuSelection();
            if (args.header.html.length >= 8) {
                args.header.html = GetDateFormat($scope.currentDate);
                args.header.toolTip = GetDateFormat($scope.currentDate);

            }
        };

        dp.onCellClick = function (args) {

        };


        dp.onIncludeTimeCell = function (args) {


            args.cell.visible = false;
            var dateLongStart = Date.parse(args.cell.start.value);
            if ($scope.browser == "chrome")
                var dateStart = new Date(dateLongStart - $scope.ist);
            else
                var dateStart = new Date(dateLongStart);

            var startHours = dateStart.getHours();

            var dateLongEnd = Date.parse(args.cell.end.value);
            var dateEnd = new Date(dateLongEnd - $scope.ist);

            var endHours = dateEnd.getHours();

            if (startHours >= 6 && endHours <= 23) {
                args.cell.visible = true;
            }
        };


        dp.onBeforeCellRender = function (args) {

            var v = args.cell.resource;
            var dpStartTime = "";
            var dpEndTime = "";
            for (var i = 0; i < $scope.stylistList.length; i++) {
                if (v == $scope.stylistList[i].id) {
                    args.cell.properties.business = true;
                    var dateLong = Date.parse(args.cell.start.value);
                    var date = new Date(dateLong - $scope.ist);

                    dpStartTime = date;

                    var dateLong1 = Date.parse(args.cell.end.value);
                    var date1 = new Date(dateLong1 - $scope.ist);
                    dpEndTime = date1;
                    if (($scope.stylistList[i].stTime != "" || $scope.stylistList[i].stTime == 0) && $scope.stylistList[i].edTime != "" && ($scope.stylistList[i].workstatusId == 1)) {

                        var longDate = $scope.stylistList[i].stTime;
                        var dpCurrentCellStartDate = new Date(longDate);
                        var longDate1 = $scope.stylistList[i].edTime;
                        var dpCurrentCellEndDate = new Date(longDate1);
                        var minute = dpCurrentCellStartDate.getMinutes();
                        if ($scope.browser != "chrome") {
                            var longDate = $scope.stylistList[i].stTime - $scope.ist;
                            var dpCurrentCellStartDate = new Date(longDate);
                            var longDate1 = $scope.stylistList[i].edTime - $scope.ist;
                            var dpCurrentCellEndDate = new Date(longDate1);
                            var minute = dpCurrentCellStartDate.getMinutes();
                        }

                        if (dpCurrentCellStartDate.getHours() <= dpStartTime.getHours() && dpCurrentCellEndDate.getHours() >= dpEndTime.getHours()) {

                            if (dpCurrentCellEndDate.getHours() != dpEndTime.getHours() && dpCurrentCellStartDate.getHours() == dpStartTime.getHours() && dpCurrentCellStartDate.getMinutes() <= dpStartTime.getMinutes()) {
                                args.cell.backColor = "#dddddd";//"#7b172e";
                            }
                            else if (dpCurrentCellEndDate.getHours() != dpEndTime.getHours() && dpCurrentCellStartDate.getHours() < dpStartTime.getHours()) {
                                args.cell.backColor = "#dddddd";//"#7b172e";
                            }
                            else if (dpCurrentCellEndDate.getHours() == dpEndTime.getHours() && dpCurrentCellEndDate.getMinutes() >= dpEndTime.getMinutes()) {
                                args.cell.backColor = "#dddddd";//"#7b172e";
                            }
                        }
                    }
                    else if (($scope.stylistList[i].workstatusId == 2 || $scope.stylistList[i].workstatusId == 3)) {
                        //args.cell.backColor = "#dddddd";
                        //var dpCurrentCellStartDate = null;
                        //var dpCurrentCellEndDate = null;
                        //if (v == $scope.stylistList[i].id && dpCurrentCellStartDate == null && dpCurrentCellEndDate == null) {
                        //    args.cell.backColor = "#dddddd";
                        //    args.cell.b
                        //}
                    }

                    var checkInTime = 0;
                    var checkOutTime = 0;
                    var checkInTime = $scope.stylistList[i].checkIn;
                    var checkOutTime = $scope.stylistList[i].checkOut;
                    var startTime = Date.parse(dpStartTime);
                    var endTime = Date.parse(dpEndTime);
                    if ($scope.browser != "chrome") {
                        checkInTime -= $scope.ist;
                        checkOutTime -= $scope.ist;
                    }
                    if (startTime < checkInTime && checkInTime < endTime) {
                        args.cell.backColor = "#ce0dd8";
                    }
                    if (startTime < checkOutTime && checkOutTime < endTime) {
                        args.cell.backColor = "#21ff00";
                    }
                }
            }
        };

        dp.onBeforeEventRender = function (args) {
            var string = "";
            for (var i = 0; i < $scope.appointments.length; i++) {
                if (args.e.id == $scope.appointments[i].appid) {

                    var modifydisabled = !$scope.EDIT; //false;
                    var disableAppointmentStatus = false;
                    if (authService.GetCredentials().role == 2 && $scope.isPastDate) {
                        modifydisabled = true;
                        disableAppointmentStatus = true;
                    }
                    else {
                        if ($scope.appointments[i].booking_source.id == 2) {
                            modifydisabled = false;
                        }
                        if ($scope.appointments[i].ap_status == 3 || $scope.appointments[i].ap_status == 4 && $scope.appointments[i].booking_source.id == 1) {
                            modifydisabled = true;
                        }
                        disableAppointmentStatus = ($scope.appointments[i].ap_status == 3 || $scope.appointments[i].ap_status == 4) ? true : false
                    }
                    if ($scope.appointments[i].ap_status != 4)
                        args.e.contextMenu = GetContextMenu(($scope.appointments[i].ap_status == 7 || $scope.appointments[i].ap_status == 3 || $scope.appointments[i].ap_status == 4) ? false : true, disableAppointmentStatus, $scope.appointments[i].ap_status, modifydisabled);

                    string += "<b>AppNo:</b>  #" + $scope.appointments[i].appid + "<br>";
                    var services = "";
                    for (var j = 0; j < $scope.appointments[i].services.length; j++) {
                        services += $scope.appointments[i].services[j].serviceName + ", ";
                    }
                    string += "<b>Services:</b> " + services + "<br>";
                    string += "<b>Customer Name:</b> " + $scope.appointments[i].customerDetail.name + "<br>";
                    string += "<b>Mobile:</b> " + $scope.appointments[i].customerDetail.mobile + "<br>";
                    if ($scope.appointments[i].customerDetail.notes == null)
                        string += "<b>Notes:</b> " + "<br>";
                    else
                        string += "<b>Notes:</b> " + $scope.appointments[i].customerDetail.notes + "<br>";

                    string += "<b>Address:</b> " + $scope.appointments[i].address.streetAddress + "<br>";
                    string += "<b>Landmark:</b> " + $scope.appointments[i].address.landMark + "<br>";
                    string += "<b>Therapist:</b> " + $scope.appointments[i].stylist.stylistName + "<br>";

                    var paymentStatus = "";
                    var paymentType = "";
                    if ($scope.appointments[i].trans_details.length > 0 && $scope.appointments[i].trans_details != null
                        && typeof $scope.appointments[i].trans_details != 'undefined') {
                        for (var j = 0; j < $scope.appointments[i].trans_details.length; j++) {
                            if (typeof $scope.appointments[i].trans_details[j].pay_status_desc != 'undefined' && typeof $scope.appointments[i].trans_details[j].paytype_desc != 'undefined' && $scope.appointments[i].trans_details[j].is_debit == 1) {
                                paymentStatus += $scope.appointments[i].trans_details[j].pay_status_desc + ",";
                                paymentType += $scope.appointments[i].trans_details[j].paytype_desc + ",";
                                if ($scope.appointments[i].trans_details[j].paytype == 2 && $scope.appointments[i].trans_details[j].paytm_txn_id != null)
                                    string += "<b>Paytm TransactionId:</b> " + $scope.appointments[i].trans_details[j].paytm_txn_id + "<br>";
                            }
                        }
                    }


                    string += "<b>Payment:</b> " + paymentStatus.slice(0, -1) + " , " + paymentType.slice(0, -1) + "<br>";

                    var utcDate = args.e.start.value;
                    var istLong = Date.parse(utcDate);
                    if ($scope.browser == "chrome")
                        istLong -= $scope.ist;
                    var istDate = new Date(istLong);

                    string += "<b>Appointment Time:</b> " + GetDateFormatWithTime(istDate) + "<br>";//args.e.start.value   
                    string += "<b>Appointment Status:</b> " + $scope.appointments[i].ap_status_desc + "<br>";
                    if ($scope.appointments[i].cancel_reason != undefined) {
                        string += "<b>Cancel Reason:</b> " + $scope.appointments[i].cancel_reason + "<br>";
                    }
                    string += "<b>Booking Source:</b> " + $scope.appointments[i].booking_source.description + "<br>";
                    if ($scope.appointments[i].discount_code != null && $scope.appointments[i].discount_code != undefined)
                        string += "<b>Applied Discount Code:</b> " + $scope.appointments[i].discount_code + "<br>";
                    string += "<b>Net Price:</b> " + $scope.appointments[i].total_amt + "<br>";
                    if ($scope.appointments[i].appointmentCreatedBy != undefined && $scope.appointments[i].appointmentCreatedBy != null) {
                        string += "<b>Created By:</b> " + $scope.appointments[i].appointmentCreatedBy.userName + "<br>";
                    }
                    if ($scope.appointments[i].appointmentModifiedBy != undefined && $scope.appointments[i].appointmentModifiedBy != null) {
                        string += "<b>Updated By:</b> " + $scope.appointments[i].appointmentModifiedBy.userName + "<br>";
                    }
                    if ($scope.appointments[i].specificRequest != undefined && $scope.appointments[i].specificRequest != null) {
                        string += "<b>Sp.Req:</b> " + $scope.appointments[i].specificRequest + "<br>";
                    }
                    if ($scope.appointments[i].paymentMethod != null && $scope.appointments[i].paymentMethod != undefined && $scope.appointments[i].paymentMethod != "") {
                        string += "<b>Payment Method:</b> " + $scope.appointments[i].paymentMethod + "<br>";
                    }
                    if ($scope.appointments[i].paymentMethodRemarks != null && $scope.appointments[i].paymentMethodRemarks != undefined && $scope.appointments[i].paymentMethodRemarks != "") {
                        string += "<b>Payment Method Remark:</b> " + $scope.appointments[i].paymentMethodRemarks + "<br>";
                    }

                    if ($scope.appointments[i].stylistFeedbackDTO != null && $scope.appointments[i].stylistFeedbackDTO != undefined) {
                        string += "<b>Stylist Feedback:</b> " + $scope.appointments[i].stylistFeedbackDTO.feedback + " ,Rating:" + $scope.appointments[i].stylistFeedbackDTO.rate + "<br>";
                    }
                    if ($scope.appointments[i].feedback != null) {
                        if ($scope.appointments[i].feedback.totalRating != "")
                            string += "<b>Feedback:</b> " + "Rating:" + $scope.appointments[i].feedback.totalRating;
                        if ($scope.appointments[i].feedback.totalRating <= 3)
                            string += ", DislikeQualities: " + $scope.appointments[i].feedback.dislikeQualities;
                        if ($scope.appointments[i].feedback.additionalComment != "")
                            string += ", AdditionalComment: " + $scope.appointments[i].feedback.additionalComment;
                    }

                }
            }
            args.e.bubbleHtml = string;
        };

        // event moving
        dp.onEventMoved = function (args) {
            $scope.ClearForm();
            $scope.appId = args.e.id();//newResource;//this.source.id();
            var dateLong = Date.parse(args.newStart);

            if ($scope.browser != "chrome")
                var date = new Date(dateLong);
            else
                var date = new Date(dateLong - $scope.ist);



            $scope.start = (date.getDate() < 10 ? '0' : '') + date.getDate() + '/' + ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1) + '/' + date.getFullYear() + " " + date.getHours() + ":" + ("0" + date.getMinutes()).slice(-2);

            //get premiumtime
            $scope.premiumTime(date);



            var myDataPromise = schedulerService.GetAppointmentByAppId($scope.appId);
            myDataPromise.then(function (result) {

                if (result.data.result_set != null) {
                    var categoriesIds = [];
                    var servicesIds = [];
                    var servicesArray = [];
                    for (var i = 0; i < result.data.result_set.services.length; i++) {
                        servicesIds.push(result.data.result_set.services[i].productServiceId);
                        var services = {
                            discountCode: "",
                            id: 0,
                            payableAmount: 0,
                            productServiceId: result.data.result_set.services[i].productServiceId,//$scope.selectedServicesIds[i],
                            serviceName: "",
                            servicePrice: 0,
                            taxAmount: 0
                        }
                        servicesArray.push(services);
                        $scope.serviceTime += result.data.result_set.services[i].serviceTime;
                        categoriesIds.push(result.data.result_set.services[i].categoryId);
                    }
                    $.unique(categoriesIds.sort());
                    $scope.selectedCategoryIds = categoriesIds;

                    var dateArray = $scope.start.split(' ');
                    var selectedDate = dateArray[0].split('/');
                    var selectedTime = dateArray[1].split(':');
                    var dat = selectedDate[2] + "-" + selectedDate[1] + "-" + selectedDate[0] + " " + selectedTime[0] + ":" + selectedTime[1];

                    if ($scope.browser != "chrome")
                        dat = selectedDate[2] + "/" + selectedDate[1] + "/" + selectedDate[0] + " " + selectedTime[0] + ":" + selectedTime[1];
                    var date = new Date(dat);
                    //$scope.OldTransactionObject = result.data.result_set.trans_details;
                    $scope.createdBy = (result.data.result_set.appointmentCreatedBy == undefined || result.data.result_set.appointmentCreatedBy == null) ? $rootScope.globals.currentUser.id : result.data.result_set.appointmentCreatedBy.id;
                    $scope.updatedBy = $rootScope.globals.currentUser.id;
                    var model = {
                        customer_id: result.data.result_set.customerDetail.id,
                        address_id: result.data.result_set.address.id,
                        menu_ids: servicesIds,
                        ap_time: (Date.parse(date)),
                        booking_time: Date.parse(new Date()),
                        stylist: { id: args.newResource },
                        appid: $scope.appId,
                        discount_code: result.data.result_set.discount_code,
                        ap_status: result.data.result_set.ap_status,
                        disc_value: result.data.result_set.disc_value,
                        specificRequest: result.data.result_set.specificRequest,
                        paymentMethod: result.data.result_set.paymentMethod,
                        premium_time: $scope.premiumTimeValue,
                        services: servicesArray,
                        cityId: $scope.cityId,
                        trans_details: result.data.result_set.trans_details,
                        cancel_reason: "",
                        refund_amount: 0,
                        appointmentCreatedBy: {
                            id: $scope.createdBy,
                            userName: "",
                            userRoleTypeDTO: [
                                    {
                                        id: 0,
                                        roleDescription: ""
                                    }
                            ],
                            password: ""
                        },
                        appointmentModifiedBy: {
                            id: $scope.updatedBy,
                            userName: "",
                            userRoleTypeDTO: [
                            {
                                id: 0,
                                roleDescription: ""
                            }
                            ],
                            password: ""
                        }
                    };

                    //check stylist availibility and validity
                    $scope.stylistId = args.newResource;
                    var v = $scope.checkStylistAvailability();
                    v.then(function (result) {
                        if (result.status != undefined && result.status != null) {
                            if (result.status == 2) {
                                var errorMessage = result.error.message.split('|');
                                var message = "";
                                angular.forEach(errorMessage, function (item, index) {
                                    message += item + " and ";
                                });
                                message = message.slice(0, -4) + ".";
                                var v = confirm(message + "\n" + "Do you want to continue anyway?");
                                if (!v) {
                                    $scope.GetAppointmentList($scope.currentDate);
                                    return;
                                }

                            }
                            var myDataPromise1 = schedulerService.UpdateAppointment(model);
                            myDataPromise1.then(function (result1) {
                                if (result1.data.result_set != null) {
                                    $scope.message = "Appointment updated successfully";
                                    HideMessage();
                                    $scope.ClearForm();
                                }
                                else {
                                    $scope.message = result1.data.error.message;
                                    HideMessage();
                                }
                                $scope.GetAppointmentList($scope.currentDate);
                            });
                        }
                        $scope.selectedCategoryIds = [];
                    });
                }
            });

        };

        // event resizing
        dp.onEventResized = function (args) {
        };

        // event creating
        dp.onTimeRangeSelected = function (args) {
        };

        dp.onEventClicked = function (args) {
        };

        dp.onTimeHeaderClick = function (args) {
        };

        dp.onResourceHeaderClick = function (args) {

        }
        dp.onBeforeResHeaderRender = function (args) {

            if (args.resource.checkIn == null && args.resource.checkOut == null) {
                args.resource.backColor = "#ad324f";
                //if (args.resource.attendenceId != 2 && args.resource.attendenceId == 3)
                args.resource.contextMenu = $scope.ResourceHeaderMenu("Check in", true, args.resource.attendenceId, args.resource.workstatusId);
            }
            else if (args.resource.checkIn > 0 && args.resource.checkOut == null) {
                //if (args.resource.attendenceId != 2 && args.resource.attendenceId == 3)
                args.resource.contextMenu = $scope.ResourceHeaderMenu("Check out", false, args.resource.attendenceId, args.resource.workstatusId);
                args.resource.backColor = "green";
            }
            else if (args.resource.checkIn != null && args.resource.checkOut != null)
                args.resource.backColor = "pink";
        };

        dp.onAfterRender = function (args) {
        };

        dp.init();
    }

    $scope.bindContextMenuSelection = function () {
        dp.contextMenuSelection = new DayPilot.Menu([
        {
            text: "New appointment", onclick: function (args) {

                $scope.ClearForm();
                var v = dp.cells.find(this.source.start, this.source.resource)

                var dateLong = Date.parse(this.source.start);
                var date = new Date(dateLong - $scope.ist);
                if ($scope.browser != "chrome")
                    date = new Date(dateLong);
                $scope.start = date;//(date.getDate() < 10 ? '0' : '') + date.getDate() + '/' + ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1) + '/' + date.getFullYear() + " " + date.getHours() + ":" + ("0" + date.getMinutes()).slice(-2);

                $scope.end = this.source.end;
                $scope.resource = this.source.resource;
                $scope.stylistId = String(this.source.resource);

                //get premiumtime
                $scope.premiumTime(date);
                $scope.appDisableModify = false;
                var elm = document.getElementsByClassName("btnDropdown");
                var elm1 = document.getElementsByClassName("select_arrow");
                angular.element(elm).removeAttr("disabled");
                angular.element(elm1).removeAttr("disabled");


                $(".employee_details_box").show(100);
                $scope.isCreateOrModify = 1;
                dp.heightSpec = "Max";
                dp.height = 150;//$scope.windowHeight();//
                dp.update();
                $scope.$apply();
            }, disabled: !$scope.CREATE
        },
        {
            text: "Petty Cash", onclick: function (args) {
                if ($scope.baseCenterId == "-1") {
                    alert("Please select specific basecenter");
                }
                else {
                    $scope.getPettyCash();
                    $scope.getPettyCashUnApproved();
                    $scope.ClearPettyCash();
                    $("#dvPettyCash").modal("show");
                }
            }, disabled: $scope.pettyCashDisabled()
        }
        ]);
    };

    $scope.pettyCashDisabled = function () {
        var returnType = false;
        if ($scope.PETTYCASHVIEW) {
            returnType = false;
            if (authService.GetCredentials().role == 2 && !(GetJqueryDate($scope.currentDate) == GetJqueryDate(new Date()))) {
                returnType = true;
            }
        }
        return returnType;
    };

    $scope.ResourceHeaderMenu = function (text, isCheckIn, attendenceId, workstatusId) {
        //dp.contextMenuResource = 
        return new DayPilot.Menu([
            {
                text: text, onclick: function () {
                    var stylistId = this.source.id;
                    var model = $scope.getCheckinModel(isCheckIn, stylistId);
                    var dataPromise = schedulerService.StylistCheckin(model)
                    dataPromise.then(function (result) {
                        if (result.data.result_set != null) {
                            $scope.message = text + " successfully";
                            HideMessage();
                            $scope.GetStylistByBasecenter();
                            $scope.GetAppointmentList($scope.currentDate);
                        }
                    })
                }, disabled: (workstatusId == 2 || workstatusId == 3) ? true : false
            },
            {
                text: "Leave", onclick: function () {
                    var id = attendenceId == this.source.id ? 0 : attendenceId;
                    var model = $scope.getAttendenceModel(id, this.source.id, 2);
                    var dataPromise = stylistScheduleService.addStylistSchedule(model)
                    dataPromise.then(function (result) {
                        if (result.data.msg != null) {
                            $scope.message = "leave " + result.data.msg.message;// + " successfully";
                            HideMessage();
                            $scope.GetStylistByBasecenter();
                            $scope.GetAppointmentList($scope.currentDate);
                        }
                    })
                }
            },
            {
                text: "WeekOff", onclick: function () {
                    var id = attendenceId == this.source.id ? 0 : attendenceId;
                    var model = $scope.getAttendenceModel(id, this.source.id, 3);
                    var dataPromise = stylistScheduleService.addStylistSchedule(model)
                    dataPromise.then(function (result) {
                        if (result.data.msg != null) {
                            $scope.message = "weekoff " + result.data.msg.message;// + " successfully";
                            HideMessage();
                            $scope.GetStylistByBasecenter();
                            $scope.GetAppointmentList($scope.currentDate);
                        }
                    })
                }
            }
        ]);
    }

    $scope.getAttendenceModel = function (id, stylistId, workStatusId) {

        var model = [{
            id: id,
            stylistId: stylistId,
            fromTime: 0,
            toTime: 0,
            workStatusId: workStatusId,
            vaildForDays: 1,
            checkIn: 0,
            checkOut: 0,
            date: Date.parse(GetJqueryDate(new Date()))
        }];
        return model;
    }

    $scope.getCheckinModel = function (ischeckIn, stylistId) {
        var date = new Date();
        var time = Date.parse(new Date());
        if (ischeckIn) {
            return {
                stylistName: "",
                stylistId: stylistId,
                checkin: time,
                //checkout: Date.parse(new Date()),
                workStatus: "",
                isLeave: 0,
                isOff: 0,
                date: Date.parse(GetJqueryDate(new Date()))
            }
        }
        else {
            return {
                stylistName: "",
                stylistId: stylistId,
                //checkin: Date.parse(new Date()),
                checkout: time,
                workStatus: "",
                isLeave: 0,
                isOff: 0,
                date: Date.parse(GetJqueryDate(new Date()))
            }
        }
    }

    $scope.ClearPettyCash = function () {
        $scope.source = "";
        $scope.pettyCategory = "";
        $scope.pettyDescription = "";
        $scope.pettyAmount = "";
    };

    $scope.modifyAppointmentItems = function (status) {
        var items = [];
        if (!status) {
            items = [
                                           {
                                               text: "Requested", onclick: function () {
                                                   $scope.AppointmentStatusUpdate(this.source.id(), 1);
                                               }
                                           },
                                           {
                                               text: "Confirmed", onclick: function () {
                                                   var appointmentId = this.source.id();
                                                   var dateLong = Date.parse(this.source.start());
                                                   var myDataPromise = schedulerService.GetAppointmentByAppId(appointmentId);
                                                   myDataPromise.then(function (result) {
                                                       if (result.data.result_set != null && result.data.result_set != undefined) {
                                                           $scope.stylistId = result.data.result_set.stylist.id;
                                                           var categoriesIds = [];
                                                           var servicesTime = 0;
                                                           angular.forEach(result.data.result_set.services, function (item, index) {
                                                               categoriesIds.push(item.categoryId);
                                                               servicesTime += item.serviceTime;
                                                           });
                                                           $scope.serviceTime = servicesTime;
                                                           $scope.selectedCategoryIds = jQuery.unique(categoriesIds);
                                                           var date = new Date(dateLong - $scope.ist);
                                                           if ($scope.browser != "chrome")
                                                               date = new Date(dateLong);
                                                           $scope.start = date;

                                                           //check stylist validity
                                                           var v = $scope.checkStylistAvailability();
                                                           v.then(function (result) {
                                                               if (result.status != undefined && result.status != null) {
                                                                   if (result.status == 2) {
                                                                       var errorMessage = result.error.message.split('|');
                                                                       var message = "";
                                                                       angular.forEach(errorMessage, function (item, index) {
                                                                           message += item + " and ";
                                                                       });
                                                                       message = message.slice(0, -4) + ".";
                                                                       var v = confirm(message + "\n" + "Do you want to continue anyway?");
                                                                       if (!v) {
                                                                           $scope.Spinner = false;
                                                                           return;
                                                                       }
                                                                   }
                                                                   //update appointment status
                                                                   $scope.AppointmentStatusUpdate(appointmentId, 2);//this.source.id(), 2);

                                                               }
                                                           });
                                                       }
                                                       //$scope.AppointmentStatusUpdate(this.source.id(), 2);
                                                   });
                                               }
                                           },
                                           {
                                               text: "Closed", onclick: function () {
                                                   $scope.AppointmentStatusUpdate(this.source.id(), 3);
                                               }
                                           },
                                           {
                                               text: "Cancelled", onclick: function () {
                                                   $scope.CancelAppId = this.source.id();
                                                   $("#dvCancelAppointment").modal("show");
                                                   //$scope.AppointmentStatusUpdate(this.source.id(), 4);
                                               }
                                           }
                                           ,
                                           {
                                               text: "Departed", onclick: function () {
                                                   $scope.AppointmentStatusUpdate(this.source.id(), 5);
                                               }
                                           },
                                           {
                                               text: "Ongoing", onclick: function () {
                                                   $scope.AppointmentStatusUpdate(this.source.id(), 6);
                                               }
                                           },
                                           {
                                               text: "Completed", onclick: function () {
                                                   $scope.AppointmentStatusUpdate(this.source.id(), 7);
                                               }
                                           },
                                           {
                                               text: "Delayed", onclick: function () {
                                                   $scope.AppointmentStatusUpdate(this.source.id(), 8);
                                               }
                                           }
            ];
        }
        return items;
    }

    $scope.CancelApp = function () {
        var send_notification = false;
        if (confirm("Do you want to send notification?")) {
            send_notification = true;
        }
        var dataPromise = schedulerService.CancelAppointment($scope.CancelAppId, 4, $scope.CancelFeedback, send_notification);
        dataPromise.then(function (result) {
            if (result.data.msg != null && result.data.msg.code == "1") {
                $scope.message = "Appointment updated successfully";
                $scope.GetAppointmentList($scope.currentDate);
                $("#dvCancelAppointment").modal("hide");
            }
            else {
                $scope.message = "An error occur while updating the appointment";
                $("#dvCancelAppointment").modal("hide");
            }
            HideMessage();
            $scope.CancelAppId = 0;
            $scope.CancelFeedback = "";
        });
    };

    $scope.CheckBrowser = function () {
        var userAgent = $window.navigator.userAgent;
        var browsers = { chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i };

        for (var key in browsers) {
            if (browsers[key].test(userAgent)) {
                return key;
            }
        };
    }

    $scope.FeedBackChange = function () {
        if ($scope.feedBackRating >= 3) {
            $scope.feedbackDislike = [];
            $scope.feedbackText = "Select";
        }
        else {
            $scope.feedbackText = "Select";
        }
    }
    $scope.feedbackMessage = "";
    $scope.SaveFeedBack = function () {

        var dislike = "";
        for (var i = 0; i < $scope.feedbackDislike.length; i++) {
            dislike += $scope.feedbackDislike[i] + ",";
        }
        var model = {
            id: $scope.feedBackId,
            additionalComment: $scope.feedbackComment,
            totalRating: $scope.feedBackRating,
            dislikeQualities: dislike,
            customerId: $scope.feedbackCustId,
            appointmentId: $scope.feedbackAppId
        };
        var dataPromise = schedulerService.AddFeedBack(model);
        dataPromise.then(function (result) {
            if (result.data.msg != null && result.data.msg.code == "1") {
                $("#dvFeedBackAdd").modal("hide");
                $scope.ClearFeedbackForm();
                $scope.message = "Feedback added successfully";
                HideMessage();
                $scope.GetAppointmentList($scope.currentDate);
            }
            else {
                $scope.feedbackMessage = "An error occur while adding feedback";
                $timeout(function () { $scope.feedbackMessage = ""; }, 3000);
            }

        });
    };

    $scope.ClearFeedbackForm = function () {
        $scope.feedbackComment = "";
        $scope.feedBackRating = "1";
        $scope.feedbackDislike = [];
        $scope.feedbackCustId = 0;
        $scope.feedbackAppId = 0;
        $scope.feedbackText = "Select";
        $scope.feedBackId = 0;
        $scope.$apply();
    }

    $scope.savePettyCash = function () {

        var date = Date.parse(new Date(GetJqueryDate($scope.schedulerStartDate)));
        var model = {
            id: 0,
            stylistId: 0,
            baseServiceCenterId: $scope.baseCenterId,
            expenseCategoryId: $scope.pettyCategory,
            amount: $scope.pettyAmount,
            pCashDate: date,//Date.parse(new Date(GetDateFormat(new Date()))),
            entryBy: $rootScope.globals.currentUser.id,
            expenseTypeId: $scope.entry,
            sourceTypeId: $scope.source,
            balanceAmount: 0,
            description: $scope.pettyDescription
        };
        var dataPromise = schedulerService.SavePettyCash(model);
        dataPromise.then(function (result) {
            $scope.pettyCashMessage = result.data.msg.message;
            $timeout(function () { $scope.pettyCashMessage = ""; }, 3000);
            $scope.clearPettyForm();
            $scope.getPettyCash();
        });

    };

    $scope.ApprovePettyCash = function (id) {
        var dataPromise = schedulerService.ApprovePettyCash(id);
        dataPromise.then(function (result) {
            $scope.pettyCashMessage = result.data.msg.message;
            $timeout(function () { $scope.pettyCashMessage = ""; }, 3000);
            $scope.getPettyCashUnApproved();
        });
    }

    $scope.getPettyCash = function () {
        var date = Date.parse(new Date(GetJqueryDate($scope.schedulerStartDate)));
        var dataPromise = schedulerService.GetPettyCash($scope.baseCenterId, date);//Date.parse(new Date(GetDateFormat(new Date())))
        dataPromise.then(function (result) {
            $scope.bindPettyCash(result.data.result_set);
        });
    };

    $scope.getPettyCashUnApproved = function () {
        var date = Date.parse(new Date(GetJqueryDate($scope.schedulerStartDate)));
        var dataPromise = schedulerService.GetPettyCashUnApproved($scope.baseCenterId, date);//Date.parse(new Date(GetDateFormat(new Date())))
        dataPromise.then(function (result) {
            $scope.bindPettyCashUnApproved(result.data.result_set);
            $scope.getPettyCash();
        });
    }

    $scope.bindPettyCash = function (model) {

        var data = new Array();
        if (model == null || model == undefined || model.length == 0)
            $scope.PettyCashAmount = 0;
        for (var i = 0; i < model.length ; i++) {
            //if (model[i].id != null) {
            //    $scope.PettyCashAmount = model[i].finalBCBalance;
            //}
            //else if (model[i].id != null) {
            $scope.PettyCashAmount = model[i].finalBCBalance;
            var row = {};
            row["date"] = GetDateFormat(new Date(model[i].pCashDate));
            row["type"] = model[i].expenseTypeId == 1 ? "Expense" : "Receipt";
            for (var j = 0; j < $scope.pettyCategoryList.length; j++) {
                if (model[i].expenseCategoryId == $scope.pettyCategoryList[j].id)
                    row["categoryName"] = $scope.pettyCategoryList[j].name;
            }
            row["description"] = model[i].description;
            row["receipt"] = model[i].amount;
            row["balanceAmount"] = model[i].balanceAmount;
            data.push(row);
            //}
        }
        var source =
        {
            localdata: data,
            datatype: "array",
            pagenum: $scope.currentPageIndex
        };
        var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties) {

            return '<a onclick="ShowUpdateAppointmentModel(\'' + value + '\')"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></a><a onclick="Viewlocation(\'' + value + '\')"><span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span></a>'
        };
        var dataAdapter = new $.jqx.dataAdapter(source, {
            loadComplete: function (data) {
                $scope.Spinner = false;
            },
            loadError: function (xhr, status, error) { }
        });

        $("#jqxPettyCash").jqxGrid(
        {
            width: '100%',
            source: dataAdapter,
            pageable: true,
            sortable: true,
            height: '250px',
            enabletooltips: true,
            enablebrowserselection: true,
            columns: [
                 { text: 'Date', datafield: 'date', width: '15%' },
                //{ text: 'Voucher No', datafield: 'appointmentId', width: '10%' },
                { text: 'Type', datafield: 'type', width: '15%' },
                { text: 'Category Name', datafield: 'categoryName', width: '25%' },
                //{ text: 'Source', datafield: 'source', width: '10%' },
                { text: 'Description', datafield: 'description', width: '25%' },
                //{ text: 'Expenses', datafield: 'expenses', width: '10%' },
                { text: 'Amount', datafield: 'receipt', width: '10%' },
                { text: 'Balance', datafield: 'balanceAmount', width: '10%' },
                //{ text: 'Print', datafield: 'paymentStatus', width: '10%' }
            ]
        });
    };

    $scope.bindPettyCashUnApproved = function (model) {
        var data = new Array();
        for (var i = 0; i < model.length ; i++) {
            var row = {};
            row["date"] = GetDateFormat(new Date(model[i].pCashDate));
            row["id"] = model[i].id;
            row["type"] = model[i].expenseTypeId == 1 ? "Expense" : "Receipt";
            row["categoryName"] = model[i].expenseCategoryId;
            row["source"] = model[i].sourceTypeId;
            row["description"] = model[i].description;
            row["expenses"] = model[i].amount;
            row["receipt"] = "";
            row["balanceAmount"] = model[i].balanceAmount;
            row["stylistId"] = model[i].stylistId;
            data[i] = row;
        }
        var source =
        {
            localdata: data,
            datatype: "array",
            pagenum: $scope.currentPageIndex
        };
        var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties) {

            return '<a onclick="ApprovePettyCash(\'' + value + '\')">Approve</a>';
        };
        var dataAdapter = new $.jqx.dataAdapter(source, {
            loadComplete: function (data) {
                $scope.Spinner = false;
            },
            loadError: function (xhr, status, error) { }
        });

        $("#jqxPettyCashUnapproved").jqxGrid(
        {
            width: '100%',
            source: dataAdapter,
            pageable: true,
            sortable: true,
            height: '250px',
            enabletooltips: true,
            enablebrowserselection: true,
            columns: [
                { text: 'Approve', datafield: 'id', cellsrenderer: cellsrenderer, width: '25%' },
                { text: 'Date', datafield: 'date', width: '25%' },
                { text: 'Type', datafield: 'type', width: '25%' },
                //{ text: 'Category', datafield: 'categoryName', width: '15%' },
                //{ text: 'Source', datafield: 'source', width: '15%' },
                { text: 'Description', datafield: 'description', width: '25%' },
                { text: 'Expenses', datafield: 'expenses', width: '25%' },
                { text: 'Stylist', datafield: 'stylistId', width: '10%' },
                //{ text: 'Balance', datafield: 'balanceAmount', width: '10%' },

            ]
        });
    };

    $scope.clearPettyForm = function () {
        $scope.pettyCategory = "";
        $scope.pettyAmount = 0;
        $scope.entry = 1;
        $scope.source = "";
        $scope.pettyDescription = "";
        $scope.PettyCashAmount = 0;
    }

    $scope.ClearAppointmentDetail = function () {
        $scope.appDetailId = "";
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
        $scope.appDetailNotes = "";
        $scope.appSpReq = "";
        $scope.appPaymentMethod = "";
        $scope.appBookingSourcde = "";
        $scope.appDiscountCode = "";
        $scope.appNetPrice = "";
        $scope.appCreatedBy = "";
        $scope.appModifiedBy = "";
        $scope.appStylistName = "";
        $scope.appCustomerName = "";
        $scope.appMobile = "";
        $scope.appFeedback = "";
        $scope.appStylistFeedback = "";
    }
    $scope.checkStylistAvailability = function () {
        var model = {
            stylist_id: $scope.stylistId,
            ap_time: $scope.getAppointmentTime(),
            menu_ids: $scope.selectedCategoryIds,
            ap_duration: $scope.serviceTime
        };
        return schedulerService.StylistAllocationStatus(model);
    }

    $scope.getAppointmentTime = function () {
        var returnDate = $scope.start;
        if ($.type($scope.start) == "date") {
            var date = ($scope.start.getDate() < 10 ? '0' : '') + $scope.start.getDate() + '/' + (($scope.start.getMonth() + 1) < 10 ? '0' : '') + ($scope.start.getMonth() + 1) + '/' + $scope.start.getFullYear() + " " + $scope.start.getHours() + ":" + ("0" + $scope.start.getMinutes()).slice(-2);
            returnDate = date;
        }

        var dateArray = returnDate.split(' ');
        var selectedDate = dateArray[0].split('/');
        var selectedTime = dateArray[1].split(':');
        var dat = selectedDate[2] + "-" + selectedDate[1] + "-" + selectedDate[0] + " " + selectedTime[0] + ":" + selectedTime[1] + ":00";
        if ($scope.browser != "chrome")
            dat = selectedDate[2] + "/" + selectedDate[1] + "/" + selectedDate[0] + " " + selectedTime[0] + ":" + selectedTime[1] + ":00";
        return Date.parse(new Date(dat));
    }

    function initScheduler(appointments, date) {

        dp.events.list = [];
        if ($scope.baseCenterId == "")
            dp.resources = [];
        else
            dp.resources = $scope.stylistList;
        if (appointments == null) {
            dp.update();
            return;
        }
        var resource = 0;
        for (var j = 0; j < $scope.stylistList.length; j++) {
            for (var i = 0; i < appointments.length; i++) {
                if (appointments[i].stylist.id == $scope.stylistList[j].id) {
                    resource = $scope.stylistList[j].id;
                    var startTime = appointments[i].ap_time + $scope.ist;
                    var endTime = appointments[i].ap_end_time + $scope.ist;
                    var startDate = new DayPilot.Date(startTime);
                    var endDate = new DayPilot.Date(endTime);
                    var backGroundColor = BackgroundColor(appointments[i].ap_status);
                    var draggable = true;//moveDisabled: true,
                    if (appointments[i].ap_status == 1 || appointments[i].ap_status == 2 || appointments[i].ap_status == 8)
                        draggable = false;
                    if (authService.GetCredentials().role == 2 && $scope.isPastDate)
                        draggable = true;

                    var e = new DayPilot.Event({
                        start: startDate,
                        end: endDate,
                        id: appointments[i].appid,//DayPilot.guid(),
                        text: "<div style='margin-top:-5px'>" + GetCustomerTypeHtml(appointments[i]) + "<br>" + appointments[i].customerDetail.name + "</div>",//GetCustomerTypeHtml() +//+   GetCustomerTypeHtml(appointments[i]) appointments[i].customerDetail.mobile
                        resource: resource,
                        backColor: backGroundColor,
                        barColor: backGroundColor,
                        cssClass: "clr",
                        customerId: appointments[i].customerDetail.id,
                        moveDisabled: draggable
                    });
                    dp.events.add(e);
                }
            }
        }
        if ($scope.stylistList != null && $scope.stylistList.length > 0) {
            dp.heightSpec = "Max";
            dp.height = $scope.windowHeight();//$scope.stylistList.length * 40 + 40;
        }
        dp.update();

        //check if selected date is less than current date
        $scope.isPreviousDate();
        showCurrentTime();

    }

    var slidingTimeout = null;

    function showCurrentTime() {
        dp.update({
            separators: [{ color: "Red", location: new DayPilot.Date() }]
        });
        slidingTimeout = setInterval(function () {
            dp.update({
                //height: $scope.windowHeight(),
                separators: [{ color: "Red", location: new DayPilot.Date() }]
            });
        }, 60000);  // once per minute
    }

    function GetCustomerTypeHtml(appointment) {
        var str = "";
        if (appointment.booking_source.id == 2)
            str += "<img src='App/images/mobile.png' style='height:15px;padding-top:3px'>";
        else if (appointment.booking_source.id == 1)
            str += "<img src='App/images/web.png' style='height:15px;padding-top:3px'>";
        if (appointment.isHighSpendor != null && appointment.isHighSpendor == 1)
            str += "<img src='App/images/highspender.png' style='height:15px;padding-top:3px'>";
        if (appointment.isLowFeedBack != null && appointment.isLowFeedBack == 1)
            str += "<img src='App/images/lowfeedback.png' style='height:15px;padding-top:3px'>";
        if (appointment.isMember != null && appointment.isMember == 1)
            str += "<img src='App/images/member.png' style='height:15px;padding-top:3px'>";
        if (appointment.isNonRecentGuest != null && appointment.isNonRecentGuest == 1)
            str += "<img src='App/images/nonrecentguest.png' style='height:15px;padding-top:3px'>";
        if (appointment.isNewCustomer != null && appointment.isNewCustomer == 1)
            str += "<img src='App/images/newguest.png' style='height:15px;padding-top:3px'>";
        if (appointment.isRegularGuest != null && appointment.isRegularGuest == 1)
            str += "<img src='App/images/regularguest.png' style='height:15px;padding-top:3px'>";
        return str;
    }

    function GetJqueryDate(date) {
        var d = new Date(date);//new Date();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var output = d.getFullYear() + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;
        return output;
    }

    function GetDate(date) {
        var d = new Date(date);//new Date();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var output = d.getFullYear() + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day + " " + d.getHours() + ":" + ("0" + d.getMinutes()).slice(-2);
        return output;
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

    function GetDateWithStringCheck(appDate) {
        var date = appDate;
        if ($.type(appDate) == "date") //Date.parse($scope.start)
        {
            date = (appDate.getDate() < 10 ? '0' : '') + appDate.getDate() + '/' + ((appDate.getMonth() + 1) < 10 ? '0' : '') + (appDate.getMonth() + 1) + '/' + appDate.getFullYear() + " " + appDate.getHours() + ":" + ("0" + appDate.getMinutes()).slice(-2);

        }

        var dateArray = date.split(' ');
        var selectedDate = dateArray[0].split('/');
        var selectedTime = dateArray[1].split(':');
        var dat = selectedDate[2] + "-" + selectedDate[1] + "-" + selectedDate[0] + " " + selectedTime[0] + ":" + selectedTime[1];
        if ($scope.browser != "chrome")
            dat = selectedDate[2] + "/" + selectedDate[1] + "/" + selectedDate[0] + " " + selectedTime[0] + ":" + selectedTime[1];
        return dat;
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

        var output = hour + minutes;
        return output;
    }

    $scope.windowHeight = function () {
        var windowHeight = $(window).height() - 220;//$scope.stylistList.length * 40 + 40;
        var currentHeight = $scope.stylistList.length * 40 + 40;
        if (currentHeight < windowHeight)
            windowHeight = currentHeight;
        return windowHeight;
    }

    function BackgroundColor(status) {
        var backgroungColor = "";
        switch (status) {
            case 1:
                backgroungColor = "orange"//"#8E7EAD";
                break;
            case 2:
                backgroungColor = "green";//"#55A728";
                break;
            case 3:
                backgroungColor = "red";//"#F8B1B2";
                break;
            case 4:
                backgroungColor = "#000000";//"#D4131D";
                break;
            case 5:
                backgroungColor = "grey";//"#FECF90";
                break;
            case 6:
                backgroungColor = "#DEDE09";//"#B4E7FE";
                break;
            case 7:
                backgroungColor = "pink";//"#E483B0";
                break;
            case 8:
                backgroungColor = "grey";//"#F65167";
                break;
        }
        return backgroungColor;
    }
}


function ApprovePettyCash(id) {
    var scope = angular.element($("#dvScheduler")).scope();
    scope.ApprovePettyCash(id);
    scope.$apply();
}