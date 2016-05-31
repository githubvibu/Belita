
var app = angular.module('myApp', ['ngRoute', 'ngCookies', 'ui.bootstrap', 'angularSpinner', 'ui.bootstrap.datetimepicker'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
          templateUrl: 'App/views/scheduler.html',//'App/views/dashboard.html',
          controller: 'schedulerController'//'dashboardController'
      })
      .when('/discount', {
          templateUrl: 'App/views/discount.html',
          controller: 'discountController'
      })
      .when('/stylist', {
          templateUrl: 'App/views/stylist.html',
          controller: 'stylistController'
      })
        .when('/group', {
            templateUrl: 'App/views/group.html',
            controller: 'groupController'
        })
        .when('/manageappointment', {
            templateUrl: 'App/views/scheduler.html',
            controller: 'schedulerController'
        })
        .when('/othersettings', {
            templateUrl: 'App/views/otherSettings.html',
            controller: 'otherSettingsController'
        })
        .when('/login', {
            templateUrl: 'App/views/login.html',
            controller: 'mainController'
        })
        .when('/pushnotification', {
            templateUrl: 'App/views/pushnotification.html',
            controller: 'pushnotificationController'
        })
        .when('/service', {
            templateUrl: 'App/views/service.html',
            controller: 'serviceController'
        })
        .when('/addservice', {
            templateUrl: 'App/views/addService.html',
            controller: 'serviceController'
        })
        .when('/unassignedappointment', {
            templateUrl: 'App/views/manageAppointment.html',
            controller: 'manageAppointmentController'
        })
        .when('/faq', {
            templateUrl: 'App/views/faq.html',
            controller: 'faqController'
        })
        .when('/stylistSchedule', {
            templateUrl: 'App/views/stylistSchedule.html',
            controller: 'stylistScheduleController'
        })
        .when('/customer', {
            templateUrl: 'App/views/customer.html',
            controller: 'customerController'
        })
        .when('/basecenter', {
            templateUrl: 'App/views/basecenter.html',
            controller: 'basecenterController'
        })
         .when('/appdetails', {
             templateUrl: 'App/views/appointmentDetails.html',
             controller: 'appointmentDetailsController'
         })
        .when('/report', {
            templateUrl: 'App/views/report.html',
            controller: 'reportController'
        })
        .when('/salesreport', {
            templateUrl: 'App/views/salesreport.html',
            controller: 'salesReportController'
        })
        .when('/CroUser', {
            templateUrl: 'App/views/crouser.html',
            controller: 'crouserController'
        })
         .when('/feedbackreport', {
             templateUrl: 'App/views/feedbackreport.html',
             controller: 'feedbackReportController'
         })
        .when('/pettycashreport', {
            templateUrl: 'App/views/pettycashreport.html',
            controller: 'pettycashReportController'
        })
        .when('/revenuereportbyservice', {
            templateUrl: 'App/views/revenuereportbyservice.html',
            controller: 'revenueReportByServiceController'
        })
        .when('/stylistattendencereport', {
            templateUrl: 'App/views/stylistattendencereport.html',
            controller: 'stylistAttendenceReportController'
        })
        .when('/membershipreport', {
            templateUrl: 'App/views/membershipreport.html',
            controller: 'membershipReportController'
        })
        .when('/birthdayanniversary', {
            templateUrl: 'App/views/birthdayandanniversary.html',
            controller: 'birthdayAnniversaryController'
        })
        //.when('/schedulermap', {
        //    templateUrl: 'App/views/schedulermap.html',
        //    controller: 'schedulerMapController'
        //})
      .otherwise({
          redirectTo: '/login'
      });
}])
    .config(['datepickerConfig', function (datepickerConfig) {
        datepickerConfig.parseFormat = 'yyyy-MM-dd HH:mm'
    }])
    .config(['$httpProvider', function ($httpProvider) {
        //$httpProvider.defaults.withCredentials = true;
        //$httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = '*';
        //$httpProvider.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS';
        //$httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
        //$httpProvider.defaults.headers.common['Access-Control-Allow-Credentials'] = true;

    }])
    .directive("autoCompleteDirective", function ($http) {
        return {
            restrict: 'A',
            scope: {
                ngModel: '=',
                url: '@',
                customer: "=",
                customeremail: "=",
                customername: "=",
                pincode: "=",
                customeraddress: "=",
                lat: "=",
                long: "=",
                landmark: "=",
                addressid: "=",
                addressarray: "=",
                customernotes: "="
            },
            require: 'ngModel',
            link: function (scope, element, attr) {
                element.autocomplete({
                    source: function (request, response) {
                        if (request.term.length > 3) {

                            $.ajax({
                                url: scope.url + "?mob=" + request.term,
                                type: "GET",
                                contentType: "application/json",
                                dataType: "json",
                                async: false,
                                statusCode: {
                                    200: function (data) {

                                        var objarray = [];
                                        if (data.result_set != null) {

                                            for (var i = 0; i < data.result_set.length; i++) {
                                                var addressAndPin = "";
                                                if (data.result_set[i].addressDTO.length > 0) {
                                                    scope.addressarray = data.result_set;
                                                    for (var j = 0; j < data.result_set[i].addressDTO.length; j++) {
                                                        if (data.result_set[i].addressDTO[j].addressType.id == 1) {
                                                            var lat = data.result_set[i].addressDTO[j].latitude == null ? "0" : data.result_set[i].addressDTO[j].latitude;
                                                            var long = data.result_set[i].addressDTO[j].longitude == null ? "0" : data.result_set[i].addressDTO[j].longitude;
                                                            addressAndPin = data.result_set[i].addressDTO[j].streetAddress + "|" + data.result_set[i].addressDTO[j].zipCode + "|" + data.result_set[i].addressDTO[j].landMark + "|" + lat + "|" + long + "|" + data.result_set[i].addressDTO[j].id + "|" + data.result_set[i].notes;
                                                        }
                                                        else {
                                                            var lat = data.result_set[i].addressDTO[0].latitude == null ? "0" : data.result_set[i].addressDTO[0].latitude;
                                                            var long = data.result_set[i].addressDTO[0].longitude == null ? "0" : data.result_set[i].addressDTO[0].longitude;
                                                            addressAndPin = data.result_set[i].addressDTO[0].streetAddress + "|" + data.result_set[i].addressDTO[0].zipCode + "|" + data.result_set[i].addressDTO[0].landMark + "|" + lat + "|" + long + "|" + data.result_set[i].addressDTO[0].id + "|" + data.result_set[i].notes;
                                                        }
                                                    }
                                                }
                                                else {
                                                    addressAndPin = ' ' + "|" + ' ' + ' ' + "|" + ' ' + "|" + ' ';
                                                }
                                                var obj =
                                                {
                                                    value: data.result_set[i].name + "|" + data.result_set[i].mobile + "|" + data.result_set[i].email + "|" + addressAndPin,
                                                    label: data.result_set[i].name + "|" + data.result_set[i].mobile + "|" + data.result_set[i].email,//+ "," + addressAndPin,
                                                    id: data.result_set[i].id
                                                };
                                                objarray[i] = obj;
                                            };
                                        }
                                        response(objarray);
                                    }
                                }
                            });

                        }
                    },
                    select: function (event, ui) {
                        var val = ui.item.value.split('|');
                        if (val.length > 0) {
                            scope.ngModel = val[1];
                            if (val[2].trim() != "")
                                scope.customeremail = val[2].trim();
                            else
                                scope.customeremail = "";
                            scope.customername = val[0].trim();
                            scope.pincode = val[4].trim();
                            scope.customeraddress = val[3].trim();
                            scope.landmark = val[5].trim();
                            scope.lat = val[6],
                            scope.long = val[7],
                            scope.addressid = val[8];
                            scope.customernotes = (val[9] == null || val[9] == undefined) ? "" : val[9].trim() == "null" ? "" : val[9].trim();
                            ui.item.value = val[1];
                            for (var i = 0; i < scope.addressarray.length; i++) {
                                if (ui.item.id == scope.addressarray[i].id) {
                                    scope.addressarray = scope.addressarray[i].addressDTO;
                                    break;
                                }
                            }
                        }
                        scope.customer = ui.item.id;
                        scope.$apply();
                    },
                    minlength: 3
                });
            }

        };
    })
    .directive('onlyDigits', function () {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, element, attr, ctrl) {
                function inputValue(val) {
                    if (val) {
                        var digits = val.replace(/[^0-9]/g, '');

                        if (digits !== val) {
                            ctrl.$setViewValue(digits);
                            ctrl.$render();
                        }
                        return parseInt(digits, 10);
                    }
                    return 0;//undefined;
                }
                ctrl.$parsers.push(inputValue);
            }
        };
    })
    .directive('dropdownMultiselect1', function () {
        return {
            restrict: 'E',
            scope: {
                model: '=',
                options: '=',
                text: '='
            },
            template:
                    "<div class='btn-group select_multi_box' data-ng-class='{open: open}'  >" +
                    "<button class='btn btn-small select_div btnDropdown' data-ng-click='openDropdown()' >{{text}}</button>" +
                    "<button class='btn btn-small dropdown-toggle select_arrow' style='margin-top:5px;' data-ng-click='openDropdown()'><span class='caret'></span></button>" +
                    "<ul class='dropdown-menu' aria-labelledby='dropdownMenu' ng-mouseleave='closeDropdown(this)'>" +
                    "<li><a data-ng-click='selectAll()'><span class='glyphicon glyphicon-ok green' aria-hidden='true'></span> Check All</a></li>" +
                    "<li><a data-ng-click='deselectAll();'><span class='glyphicon glyphicon-remove red' aria-hidden='true'></span> Uncheck All</a></li>" +
                    "<li class='divider'></li>" + "<li data-ng-repeat='option in options'><a data-ng-click='toggleSelectItem(option)'><span data-ng-class='getClassName(option)' aria-hidden='true'></span> {{option.name}}</a></li>" +
                    "</ul>" +
                    "</div>",

            controller: function ($scope) {
                $scope.text = "Select";
                $scope.SelectedData = [];

                $scope.closeDropdown = function (context) {
                    $scope.openDropdown();
                }

                $scope.openDropdown = function () {
                    $scope.open = !$scope.open;
                    if ($scope.text != "Select" && $scope.text.length == 0) {
                        $scope.text = "Select";
                        $scope.SelectedData = [];
                    }
                };

                $scope.selectAll = function () {
                    $scope.model = [];
                    $scope.text = "";
                    angular.forEach($scope.options, function (item, index) {
                        $scope.model.push(item.id);
                        $scope.text += item.name;
                    });

                    $scope.text = $scope.text.substr(0, 20);
                    $scope.text += "...";
                };

                $scope.deselectAll = function () {
                    $scope.model = [];
                    $scope.text = "Select";
                };

                $scope.toggleSelectItem = function (option) {

                    var intIndex = -1;
                    angular.forEach($scope.model, function (item, index) {
                        if (item == option.id) {
                            intIndex = index;
                        }
                    });

                    if (intIndex >= 0) {
                        $scope.model.splice(intIndex, 1);
                        $scope.SelectedData.splice(intIndex, 1);
                    }
                    else {
                        $scope.model.push(option.id);
                        $scope.SelectedData.push(option.name);
                    }

                    $scope.SelectedData = [];
                    for (var i = 0; i < $scope.options.length; i++) {
                        for (var j = 0; j < $scope.model.length; j++) {
                            if ($scope.model[j] == $scope.options[i].id) {
                                $scope.SelectedData.push($scope.options[i].name);
                            }
                        }
                    }

                    $scope.text = "";
                    if ($scope.SelectedData.length == 0) {
                        $scope.text = "Select";
                    }
                    else {

                        for (var i = 0; i < $scope.SelectedData.length; i++) {
                            $scope.text += $scope.SelectedData[i] + ",";
                        }
                        if ($scope.text.length > 25) {
                            $scope.text = $scope.text.substr(0, 20);
                            $scope.text += "...";
                        }
                    }
                };


                $scope.getClassName = function (option) {
                    var varClassName = '';//'glyphicon glyphicon-remove white';
                    angular.forEach($scope.model, function (item, index) {
                        if (item == option.id) {
                            varClassName = 'glyphicon glyphicon-ok green';
                        }
                    });
                    return (varClassName);
                };
            }
        }
    })
    .directive('dropdownMultiselect', function () {
        return {
            restrict: 'E',
            scope: {
                model: '=',
                options: '=',
                text: '='
            },
            template:
                    "<div class='btn-group select_multi_box' data-ng-class='{open: open}'  >" +
                    "<button class='btn btn-small select_div btnDropdown' data-ng-click='openDropdown()' >{{text}}</button>" +
                    "<button class='btn btn-small dropdown-toggle select_arrow' style='margin-top:5px;' data-ng-click='openDropdown()'><span class='caret'></span></button>" +
                    "<ul class='dropdown-menu' aria-labelledby='dropdownMenu' ng-mouseleave='closeDropdown(this)'>" +
                    //"<li><a data-ng-click='selectAll()'><span class='glyphicon glyphicon-ok green' aria-hidden='true'></span> Check All</a></li>" +
                    //"<li><a data-ng-click='deselectAll();'><span class='glyphicon glyphicon-remove red' aria-hidden='true'></span> Uncheck All</a></li>" +
                    "<li class='divider'></li>" + "<li data-ng-repeat='option in options'><a data-ng-click='toggleSelectItem(option)'><span data-ng-class='getClassName(option)' aria-hidden='true'></span> {{option.name}}</a></li>" +
                    "</ul>" +
                    "</div>",

            controller: function ($scope) {
                $scope.text = "Select";
                $scope.SelectedData = [];

                $scope.closeDropdown = function (context) {
                    $scope.openDropdown();
                }

                $scope.openDropdown = function () {
                    $scope.open = !$scope.open;
                    if ($scope.text != "Select" && $scope.text.length == 0) {
                        $scope.text = "Select";
                        $scope.SelectedData = [];
                    }
                };

                $scope.selectAll = function () {
                    $scope.model = [];
                    angular.forEach($scope.options, function (item, index) {
                        $scope.model.push(item.id);
                    });
                    return false;
                };

                $scope.deselectAll = function () {
                    $scope.model = [];
                };

                $scope.toggleSelectItem = function (option) {

                    var intIndex = -1;
                    angular.forEach($scope.model, function (item, index) {
                        if (item == option.id) {
                            intIndex = index;
                        }
                    });

                    if (intIndex >= 0) {
                        $scope.model.splice(intIndex, 1);
                        $scope.SelectedData.splice(intIndex, 1);
                    }
                    else {
                        $scope.model.push(option.id);
                        $scope.SelectedData.push(option.name);
                    }

                    $scope.SelectedData = [];
                    for (var i = 0; i < $scope.options.length; i++) {
                        for (var j = 0; j < $scope.model.length; j++) {
                            if ($scope.model[j] == $scope.options[i].id) {
                                $scope.SelectedData.push($scope.options[i].name);
                            }
                        }
                    }

                    $scope.text = "";
                    if ($scope.SelectedData.length == 0) {
                        $scope.text = "Select";
                    }
                    else {

                        for (var i = 0; i < $scope.SelectedData.length; i++) {
                            $scope.text += $scope.SelectedData[i] + ",";
                        }
                        if ($scope.text.length > 25) {
                            $scope.text = $scope.text.substr(0, 20);
                            $scope.text += "...";
                        }
                    }
                };

                $scope.getClassName = function (option) {
                    var varClassName = '';//'glyphicon glyphicon-remove white';
                    angular.forEach($scope.model, function (item, index) {
                        if (item == option.id) {
                            varClassName = 'glyphicon glyphicon-ok green';
                        }
                    });
                    return (varClassName);
                };
            }
        }
    })
    .directive('usSpinner', ['$http', '$rootScope', function ($http, $rootScope) {
        return {
            link: function (scope, elm, attrs) {
                $rootScope.spinnerActive = false;
                scope.isLoading = function () {
                    return $http.pendingRequests.length > 0;
                };

                scope.$watch(scope.isLoading, function (loading) {
                    $rootScope.spinnerActive = loading;
                    if (loading) {
                        elm.removeClass('ng-hide');
                    } else {
                        elm.addClass('ng-hide');
                    }
                });
            }
        };

    }])
    .directive('validFile', function () {
        return {
            require: 'ngModel',
            link: function (scope, el, attrs, ctrl) {
                ctrl.$setValidity('validFile', el.val() != '');
                //change event is fired when file is selected
                el.bind('change', function () {
                    ctrl.$setValidity('validFile', el.val() != '');
                    scope.$apply(function () {
                        ctrl.$setViewValue(el.val());
                        ctrl.$render();
                    });
                });
            }
        }
    })
    .directive('datepickerPopup', function () {
        return {
            restrict: 'EAC',
            require: 'ngModel',
            link: function (scope, element, attr, controller) {
                //remove the default formatter from the input directive to prevent conflict
                controller.$formatters.shift();
            }
        }
    })
.run(function ($rootScope, $location, $cookieStore) {
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        var restrictedPage = $.inArray($location.path(), ['/login']) === -1;
        var loggedIn = $rootScope.globals.currentUser;
        if (restrictedPage && !loggedIn) {
            $location.path('/login');
        }

    });
});

app.factory('app', function () {
    return {
        serviceBaseURL: 'http://api.belitaindia.com/',
    };
    return
    {
        master = {
            DeviceType: [],
            PaymentModeType: [],
            PaymentStatusType: [],
            DiscountApplicabilityType: [],
            DiscountType: [],
            DiscountStatus: [],
            ServingStatusType: [],
            UserRoleType: [],
            TransactionStatusType: [],
            AddressType: [],
            AppointmentStatusType: [],
            DiscountApplicabilityGroupItems: []

        }
    };
    return
    {
        executive =
            {
                CroUser: {
                    View: false,
                    Edit: false,
                    Create: false,
                    Delete: false
                },
                Appointment: {
                    View: true,
                    Edit: true,
                    Create: true,
                    Delete: false
                },
                Stylist: {
                    View: true,
                    Edit: false,
                    Create: false,
                    Delete: false
                },

                Discount: {
                    View: true,
                    Edit: false,
                    Create: false,
                    Delete: false
                },

                Services: {
                    View: true,
                    Edit: false,
                    Create: false,
                    Delete: false
                },

                Location: {
                    View: true,
                    Edit: false,
                    Create: false,
                    Delete: false
                },

                BM: {
                    View: true,
                    Edit: false,
                    Create: false,
                    Delete: false
                },

                TimeSlots: {
                    View: true,
                    Edit: false,
                    Create: false,
                    Delete: false
                },

                Edit: {
                    RegisterSettings: false,
                    ReffererSettings: false
                },
                PettyCash: {
                    View: true
                },
                Notification: {
            View: false
        }

            }
    };
    return
    {
        admin =
            {
                CroUser: {
                    View: true,
                    Edit: true,
                    Create: true,
                    Delete: true
                },
                Appointment: {
                    View: true,
                    Edit: true,
                    Create: true,
                    Delete: false
                },

                Stylist: {
                    View: true,
                    Edit: true,
                    Create: true,
                    Delete: true
                },

                Discount: {
                    View: true,
                    Edit: true,
                    Create: true,
                    Delete: true
                },

                Services: {
                    View: true,
                    Edit: true,
                    Create: true,
                    Delete: true
                },

                Location: {
                    View: true,
                    Edit: true,
                    Create: true,
                    Delete: true
                },

                BM: {
                    View: true,
                    Edit: true,
                    Create: true,
                    Delete: true
                },

                TimeSlots: {
                    View: true,
                    Edit: true,
                    Create: true,
                    Delete: true
                },

                Edit: {
                    RegisterSettings: true,
                    RegisterSettings: true
                },
                PettyCash: {
                    View: true
                },
                Notification: {
                    View: true
                },

            }
    };
});
