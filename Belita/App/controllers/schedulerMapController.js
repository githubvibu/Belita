app.controller('schedulerMapController', schedulerMapController);
app.$inject = ['$scope', '$routeParams', '$location', 'schedulerService', 'commonService', '$http', '$timeout', '$window', 'appointmentDetailsService', 'authService', 'app', '$rootScope'];

function schedulerMapController($scope, $routeParams, $location, schedulerService, commonService, $http, $timeout, $window, appointmentDetailsService, authService, app, $rootScope) {
    $scope.schedulerStartDate = new Date();
    $scope.currentDate = new Date();
    $scope.baseCenterId = "";
    $scope.browser = "";
    $scope.cities = [];
    $scope.cityId = "";
    $scope.appointmentMarker = [];
    $scope.stylistMarker = [];

    $scope.GetRoles = function () {
        commonService.CheckPermissionData();
        if (authService.GetCredentials().role == 1) {
            $scope.PETTYCASHVIEW = app.admin.PettyCash.View;
        } else if (authService.GetCredentials().role == 2) {
            $scope.PETTYCASHVIEW = app.executive.PettyCash.View;
        }
    };
    $scope.GetRoles();


    /* Initialize Code Start */
    $scope.Previous = function () {
        $scope.currentDate.setDate($scope.currentDate.getDate() - 1);
        $scope.schedulerStartDate = GetDateFormat($scope.currentDate);
    };
    $scope.Next = function () {
        $scope.currentDate.setDate($scope.currentDate.getDate() + 1);
        $scope.schedulerStartDate = GetDateFormat($scope.currentDate);
    };

    $scope.InitializeSchedulerMap = function () {
        $scope.browser = $scope.CheckBrowser();
        $scope.cities = commonService.GetMasterCities();
        //set default city
        $timeout(function () {
            $scope.cityId = 1; $scope.BindBaseCenter()
        }, 1000);
    };

    $scope.BindBaseCenter = function () {
        $scope.basecenter = commonService.GetBaseServiceCenter($scope.cityId);
        $scope.basecenter.push({ id: -1, name: "All BaseCenter" });
        $scope.baseCenterId = "";
        $scope.loadMap();
    }

    $scope.Refresh = function () {
        $scope.StartSchedulerMap();
    };

    $scope.StartSchedulerMap = function () {
        $scope.GetStylistByBasecenter();
        $scope.GetAppointmentList($scope.currentDate);
    };
    /* Initialize Code End*/

    /* Load Appointment And Stylist Start */
    $scope.GetAppointmentList = function (date) {

        $scope.CategoryIds = commonService.GetServiceCategory();
        var d = date;
        var month = d.getMonth() + 1;
        var day = d.getDate();
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

        var myDataPromise = schedulerService.GetAppoiontmentByDateAndBasecenter(basecenter, cityId, currentDate);
        myDataPromise.then(function (result) {
            $scope.appointments = result.data.result_set;
            $scope.BindAppointmentOnMap();
        });
    };

    $scope.BindAppointmentOnMap = function () {
        if ($scope.appointments != undefined && $scope.appointments != null && $scope.appointments.length > 0) {
            for (var i = 0; i < $scope.appointmentMarker.length; i++) {
                $scope.appointmentMarker[i].setMap(null);
            }
            angular.forEach($scope.appointments, function (item, index) {
                if (item.address.latitude != 0 && item.address.longitude != 0) {
                    var name = item.address.streetAddress + " " + item.address.landMark;
                    var marker = new google.maps.Marker({
                        icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                        position: new google.maps.LatLng(item.address.latitude, item.address.longitude),
                        map: map,
                        title: name,
                        options: { scaleControl: true }
                    });
                    attachSecretMessage(marker, name)
                    $scope.appointmentMarker.push(marker);
                    marker.setMap(map);
                }
            });
        }
    }

    /* Load Appointment And Stylist End */


    /* Map Code Start */
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
        //map
        var mapProp = {
            center: new google.maps.LatLng(18.9750, 72.8258),
            zoom: 6,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map"), mapProp);
    };

    /* Map Code End*/



    $scope.$watch("schedulerStartDate", function () {
        if ($.type($scope.schedulerStartDate) != "date") {
            var selectedDate = $scope.schedulerStartDate.split('/');
            var dat = selectedDate[2] + "-" + selectedDate[1] + "-" + selectedDate[0];
            var date = new Date(dat);
            $scope.currentDate = date;
            $scope.schedulerStartDate = $scope.currentDate;
        }
        else {
            $scope.currentDate = $scope.schedulerStartDate;
        }
        $scope.GetStylistByBasecenter();
        $scope.GetAppointmentList($scope.currentDate);
    })




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

        var myDataPromise = schedulerService.GetStylistDetailWithAttendence(basecenter, cityId, dat);
        myDataPromise.then(function (result) {
            $scope.stylistList = [];
            if (result.data.result_set != null) {
                $scope.stylistList = [];
                angular.forEach(result.data.result_set, function (item, index) {
                    if (item.stylistDetails != null) {
                        $scope.stylistList.push({
                            id: item.id,
                            baseLat: item.stylistDetails.baseLocLatitude == null ? 0 : item.stylistDetails.baseLocLatitude,
                            baseLong: item.stylistDetails.baseLocLongitude == null ? 0 : item.stylistDetails.baseLocLongitude,
                            currentLat: item.stylistDetails.lastLatitude == null ? 0 : item.stylistDetails.lastLatitude,
                            currentLong: item.stylistDetails.lastLongitude == null ? 0 : item.stylistDetails.lastLongitude,
                            name: item.stylistName,
                            ischecked: true
                        });
                    }
                });
                $scope.bindStylistOnMap();
            }
        });
    };

    $scope.changeStylist = function (id) {
        for (var i = 0; i < $scope.stylistMarker.length; i++) {
            $scope.stylistMarker[i].setMap(null);
        }
        angular.forEach($scope.stylistList, function (item, index) {
           
        });
    }

    $scope.bindStylistOnMap = function () {
        if ($scope.stylistList != undefined && $scope.stylistList != null && $scope.stylistList.length > 0) {
            for (var i = 0; i < $scope.stylistMarker.length; i++) {
                $scope.stylistMarker[i].setMap(null);
            }
            angular.forEach($scope.stylistList, function (item, index) {
                if (item.currentLat != null && item.currentLong != null) {
                    var name = item.stylistName;
                    var marker = new google.maps.Marker({
                        icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                        position: new google.maps.LatLng(item.currentLat, item.currentLong),
                        map: map,
                        title: name,
                        options: { scaleControl: true }
                    });
                    attachSecretMessage(marker, name)
                    $scope.stylistMarker.push(marker);
                    marker.setMap(map);
                }
            });
        }
    };

    $scope.ClearForm = function () {
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
    function GetDateFormat(date) {
        var d = new Date(date);
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var output = (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month + '/' + d.getFullYear();
        return output;
    }
}