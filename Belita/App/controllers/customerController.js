app.controller('customerController', customer);
app.$inject = ['$scope', '$routeParams', '$location', 'customerService', 'app', 'commonService', '$timeout', 'authService', 'app'];

function customer($scope, $routeParams, $location, customerService, app, commonService, $timeout, authService, app) {
    $scope.message = "";
    $scope.title = "Add Customer";
    $scope.Spinner = false;
    $scope.basecenterList = [];

    //customer model
    $scope.id = 0;
    $scope.name = "";
    $scope.birthday = "";
    $scope.emailId = "";
    $scope.anniversary = "";
    $scope.mobileNumber = "";
    $scope.address = "";
    $scope.homeNo = 0;
    $scope.notes = "";
    $scope.nationality = "";
    $scope.basecenter = "";
    $scope.gender = 1;
    $scope.marketingEmail = "";
    $scope.marketingSMS = "";
    $scope.customerSearch = "";
    $scope.isEdit = false;
    $scope.landMark = "";
    $scope.lat = "";
    $scope.long = "";
    $scope.pinCode = "";
    $scope.bmType = "";
    $scope.otherBmType = "";
    $scope.bmAmount = "";
    $scope.bmExpiry = "";
    $scope.customerId = "";
    $scope.messageBelitaMoney = "";
    $scope.Model = [];
    $scope.addressTypeId = "";
    $scope.addressId = 0;
    $scope.addressArray = [];
    $scope.notes = "";
    $scope.blockButton = false;

    $scope.VIEW = false;
    $scope.EDIT = false;
    $scope.CREATE = false;
    $scope.DELETE = false;

    $scope.GetRoles = function () {

        commonService.CheckPermissionData();
        if (authService.GetCredentials().role == 1) {
            $scope.VIEW = app.admin.BM.View;
            $scope.EDIT = app.admin.BM.Edit;
            $scope.CREATE = app.admin.BM.Create;
            $scope.DELETE = app.admin.BM.Delete;
        } else if (authService.GetCredentials().role == 2) {
            $scope.VIEW = app.executive.BM.View;
            $scope.EDIT = app.executive.BM.Edit;
            $scope.CREATE = app.executive.BM.Create;
            $scope.DELETE = app.executive.BM.Delete;
        }
    };

    $scope.GetCustomer = function () {
        $scope.GetRoles();
        $scope.basecenterList = commonService.GetBaseServiceCenterNonCity();
        $scope.addressTypeList = commonService.GetAddressType();

    };

    $scope.SearchCustomer = function () {
        if ($scope.customerSearch.toString().length > 2) {
            var myDataPromise = customerService.GetCustomerList($scope.customerSearch);
            myDataPromise.then(function (result) {
                $scope.Model = result.data.result_set;
                $scope.BindGrid($scope.Model);
            });
        }
        else {
            $scope.message = "Please Enter Atleast 3 Characters";
            HideMessage();
        }

    }

    $scope.BindGrid = function (model) {
        // prepare the data
        if (model == null)
            return;
        var data = new Array();
        var row = {};
        for (var i = 0; i < model.length ; i++) {
            var row = {};
            row["userName"] = model[i].name;
            row["mobileNo"] = model[i].mobile;
            row["emailId"] = model[i].email;
            row["officeAddress"] = "";
            row["othersAddress"] = "";
            row["address"] = "";
            row["notes"] = model[i].notes;
            if (model[i].addressDTO.length > 0) {
                for (var j = 0; j < model[i].addressDTO.length; j++) {
                    if (model[i].addressDTO[j].addressType.id == 1)
                        row["address"] = model[i].addressDTO[j].streetAddress + " " + model[i].addressDTO[j].landMark;
                    else if (model[i].addressDTO[j].addressType.id == 2)
                        row["officeAddress"] = model[i].addressDTO[j].streetAddress + " " + model[i].addressDTO[j].landMark;
                    else if (model[i].addressDTO[j].addressType.id == 3)
                        row["othersAddress"] = model[i].addressDTO[j].streetAddress + " " + model[i].addressDTO[j].landMark;
                }
            }

            row["id"] = model[i].id;
            data[i] = row;
        }
        var source =
        {
            localdata: data,
            datatype: "array"
        };
        var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties) {

            return '<a onclick="ShowCustomerUpdate(' + value + ')"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></a>'
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
            enablebrowserselection: true,
            columns: [
                { text: 'User Name', datafield: 'userName', width: '15%' },
                { text: 'Mobile No', datafield: 'mobileNo', width: '15%' },
                { text: 'Email Id', datafield: 'emailId', width: '15%' },
                { text: 'Address', datafield: 'address', width: '15%' },
                { text: 'Office Address', datafield: 'officeAddress', width: '15%' },
                { text: 'Other Address', datafield: 'othersAddress', width: '15%' },
                { text: 'Notes', datafield: 'notes', width: '15%' },
                //{ text: 'Location', datafield: 'location', width: '11%' },
                //{ text: 'Basecenter', datafield: 'basecenter', width: '11%' },
                //{ text: 'City', datafield: 'city', width: '11%' },
                //{ text: 'Last Appointment Date', datafield: 'lastappointmentdate', width: '11%' },
                { text: 'Manage', datafield: 'id', cellsrenderer: cellsrenderer, width: '10%' }
            ]
        });
    };

    $scope.CreateCustomer = function () {
        $scope.isEdit = false;
        $("#dvAddCustomer").modal("show");

        google.maps.event.addDomListener(window, 'load', initialize);

        var autocomplete = new google.maps.places.Autocomplete(document.getElementById('txtLandMark1'));
        google.maps.event.addListener(autocomplete, 'place_changed', function () {
            var place = autocomplete.getPlace();
            $scope.landMark = place.name; //place.formatted_address;
            $scope.lat = place.geometry.location.lat();
            $scope.long = place.geometry.location.lng();
        });
    };


    function initialize() {

        var input1 = document.getElementById('txtLandMark1');
        var options1 = { componentRestrictions: { country: 'in' } };

        new google.maps.places.Autocomplete(input1, options1);

        var input2 = document.getElementById('txtLandMark2');
        var options2 = { componentRestrictions: { country: 'in' } };

        new google.maps.places.Autocomplete(input2, options2);
    }

    $scope.SaveCustomer = function () {
        $scope.disableButton();
        var model = $scope.getModel();
        var dataPromise = customerService.CreateCustomer(model);
        dataPromise.then(function (result) {
            if (result.data.result_set != null) {

                $scope.GetCustomer();
                $("#dvAddCustomer").modal("hide");
                $scope.message = "Customer created successfully";
            }
            else {
                $scope.GetCustomer();
                $("#dvAddCustomer").modal("hide");
                $scope.message = "An error while creating Customer";
            }
            HideMessage();
            $scope.clearForm();

        });
    };

    $scope.clearForm = function () {
        $scope.id = 0;
        $scope.name = "";
        $scope.birthday = "";
        $scope.emailId = "";
        $scope.anniversary = "";
        $scope.mobileNumber = "";
        $scope.address = "";
        $scope.homeNo = 0;
        $scope.notes = "";
        $scope.landMark = "";
        $scope.lat = "";
        $scope.long = "";
        $scope.nationality = "";
        $scope.basecenter = "";
        $scope.gender = 1;
        $scope.marketingEmail = "";
        $scope.marketingSMS = "";
        $scope.pinCode = "";
        $scope.customerId = "";
        $scope.addressTypeId = "";
        $scope.addressId = 0;

        $(".accordion-toggle").each(function () {
            $(this).addClass("collapsed");
        });
        $(".panel-collapse").each(function () {
            $(this).removeClass("in");
        });
    }

    $scope.getModel = function () {
        var model = {
            DOB: Date.parse($scope.birthday),
            id: $scope.id,
            serviceCityID: 0,
            addressDetail: [
              {
                  id: $scope.addressId,
                  serviceCity: {
                      id: 0,
                      cityAbr: "",
                      cityName: ""
                  },
                  addressType: {
                      id: $scope.addressTypeId,
                      description: ""
                  },
                  landMark: $scope.landMark,
                  latitude: $scope.lat,
                  longitude: $scope.long,
                  streetAddress: $scope.address,
                  zipCode: $scope.pinCode == "" ? "400001" : $scope.pinCode
              }
            ],
            anniversaryDate: Date.parse($scope.anniversary),
            email: $scope.emailId,
            homePhone: $scope.homeNo,
            isFemale: $scope.gender == true ? 1 : 0,
            mobile: $scope.mobileNumber,
            recievingEmails: $scope.marketingEmail == true ? 1 : 0,
            recievingSMS: $scope.marketingSMS == true ? 1 : 0,
            referralCode: "",
            appliedRefCode: "",
            imageURL: "",
            name: $scope.name,
            notes: $scope.notes
        };
        return model;
    };


    $scope.getBelitaMoneyModel = function () {

        if ($.type($scope.bmExpiry) == "date") //Date.parse($scope.start)
        {
            var date = ($scope.bmExpiry.getDate() < 10 ? '0' : '') + $scope.bmExpiry.getDate() + '/' + (($scope.bmExpiry.getMonth() + 1) < 10 ? '0' : '') + ($scope.bmExpiry.getMonth() + 1) + '/' + $scope.bmExpiry.getFullYear();
            $scope.bmExpiry = date;
        }

        var selectedDate = $scope.bmExpiry.split('/');
        var dat = selectedDate[2] + "-" + selectedDate[1] + "-" + selectedDate[0];

        var date = new Date(dat);
        var model = {
            custId: $scope.customerId,
            bmType: $scope.bmType,
            amount: $scope.bmAmount,
            expiry: Date.parse(date)
        };
        return model;
    };

    $scope.ShowCustomerUpdate = function (id) {

        $("#dvCustomerDetail").modal("show");
        google.maps.event.addDomListener(window, 'load', initialize);
        var autocomplete = new google.maps.places.Autocomplete(document.getElementById('txtLandMark2'));
        google.maps.event.addListener(autocomplete, 'place_changed', function () {
            var place = autocomplete.getPlace();
            $scope.landMark = place.name;//place.formatted_address;
            $scope.lat = place.geometry.location.lat();
            $scope.long = place.geometry.location.lng();
        });
        $timeout(function () {
            $scope.isEdit = true;
            $scope.customerId = id;
            $scope.GetCustomerDetails(id);
            $scope.GetAppointmentHistory(id);
            $scope.GetPaymentHistory(id);
            $scope.GetBelitaMoney(id);
            $scope.GetNotificationHistory(id);
            $scope.GetSubscribedPackages(id);
            $scope.GetBelitaMoneyTransaction(id);
        }, 700);
    };

    $scope.addressTypeChange = function () {
        if ($scope.addressArray != null && $scope.addressArray.length > 0) {
            for (var i = 0; i < $scope.addressArray.length; i++) {
                if ($scope.addressArray[i].addressType.id == parseInt($scope.addressTypeId)) {
                    $scope.address = $scope.addressArray[i].streetAddress;
                    $scope.lat = $scope.addressArray[i].latitude;
                    $scope.long = $scope.addressArray[i].longitude;
                    $scope.landMark = $scope.addressArray[i].landMark;
                    $scope.pinCode = $scope.addressArray[i].zipCode;
                    $scope.addressId = $scope.addressArray[i].id;
                    break;
                }
                else {
                    $scope.address = "";
                    $scope.lat = "";
                    $scope.long = "";
                    $scope.landMark = "";
                    $scope.pinCode = "";
                    $scope.addressId = 0;
                }
            }
        }
    }

    $scope.GetCustomerDetails = function (id) {
        var dataPromise = customerService.GetCustomerById(id);
        dataPromise.then(function (result) {

            if (result.data.result_set != null) {
                $scope.id = result.data.result_set.id;
                $scope.name = result.data.result_set.name;
                if (result.data.result_set.DOB != null && result.data.result_set.DOB != 0)
                    $scope.birthday = GetDate(new Date(result.data.result_set.DOB));

                $scope.emailId = result.data.result_set.email.trim();
                if (result.data.result_set.anniversaryDate != null && result.data.result_set.anniversaryDate != 0)
                    $scope.anniversary = GetDate(new Date(result.data.result_set.anniversaryDate));
                $scope.mobileNumber = result.data.result_set.mobile;
                $scope.homeNo = result.data.result_set.homePhone;

                $scope.addressArray = result.data.result_set.addressDetail;
                if ($scope.addressArray != null && $scope.addressArray.length > 0) {
                    for (var i = 0; i < $scope.addressArray.length; i++) {
                        if ($scope.addressArray[i].addressType.id == 1) {
                            $scope.address = result.data.result_set.addressDetail[i].streetAddress;
                            $scope.lat = result.data.result_set.addressDetail[i].latitude;
                            $scope.long = result.data.result_set.addressDetail[i].longitude;
                            $scope.landMark = result.data.result_set.addressDetail[i].landMark;
                            $scope.pinCode = result.data.result_set.addressDetail[i].zipCode;
                            $scope.addressId = result.data.result_set.addressDetail[i].id;
                            $scope.addressTypeId =String(result.data.result_set.addressDetail[i].addressType.id);
                        }
                        else {
                            $scope.address = result.data.result_set.addressDetail[0].streetAddress;
                            $scope.lat = result.data.result_set.addressDetail[0].latitude;
                            $scope.long = result.data.result_set.addressDetail[0].longitude;
                            $scope.landMark = result.data.result_set.addressDetail[0].landMark;
                            $scope.pinCode = result.data.result_set.addressDetail[0].zipCode;
                            $scope.addressId = result.data.result_set.addressDetail[0].id;
                            $scope.addressTypeId = String(result.data.result_set.addressDetail[0].addressType.id);
                        }
                    }
                }

                //$scope.address = result.data.result_set.addressDetail[0].streetAddress;
                //$scope.lat = result.data.result_set.addressDetail[0].latitude;
                //$scope.long = result.data.result_set.addressDetail[0].longitude;
                //$scope.landMark = result.data.result_set.addressDetail[0].landMark;
                //$scope.pinCode = result.data.result_set.addressDetail[0].zipCode;
                //$scope.addressId = result.data.result_set.addressDetail[0].id;
                //$scope.addressTypeId = result.data.result_set.addressDetail[0].addressType.id;

                $scope.gender = result.data.result_set.isFemale == 1 ? true : false;
                $scope.marketingEmail = result.data.result_set.recievingEmails == 1 ? true : false;
                $scope.marketingSMS = result.data.result_set.recievingSMS == 1 ? true : false;
                $scope.notes = result.data.result_set.notes;
            }
        });
    };

    $scope.GetBelitaMoneyDetailsById = function (id) {

        var belitaMoneyId = id;
        for (var i = 0; i < $scope.Model1.length; i++) {
            if ($scope.Model1[i].belitaMoneyType.id == belitaMoneyId) {

                $scope.bmType = $scope.Model1[i].belitaMoneyType.id;
                //$scope.otherBmType = $scope.Model1[i].belitaMoneyType.id;
                $scope.bmAmount = $scope.Model1[i].belitaMoneyAmount;
                $scope.bmExpiry = new Date($scope.Model1[i].belitaMoneyExp);//GetDate();
            }
        }
        $scope.$apply();
    };

    $scope.GetAppointmentHistory = function (id) {

        //$scope.BindGridAppointmentHistory([]);
        var myDataPromise = customerService.GetAppointmentHistory(id);
        myDataPromise.then(function (result) {
            $scope.Model = result.data.result_set;
            $scope.BindGridAppointmentHistory($scope.Model);
        });
    };

    $scope.GetPaymentHistory = function (id) {

        //var myDataPromise = customerService.GetPaymentHistory(id);
        //myDataPromise.then(function (result) {
        //    $scope.Model = result.data.result_set;
        //    $scope.BindGridPaymentHistory($scope.Model);
        //});
    };

    $scope.GetNotificationHistory = function (id) {
        //  $scope.BindGridNotificationHistory([]);

        var myDataPromise = customerService.GetNotificationHistory(id);
        myDataPromise.then(function (result) {
            if (result.data.result_set != null) {
                $scope.Model = result.data.result_set;
                $scope.BindGridNotificationHistory($scope.Model);
            }
        });
    };

    $scope.GetSubscribedPackages = function (id) {
        //$scope.BindGridSubscribedPackages([]);
        // uncomment after getting data
        var myDataPromise = customerService.GetSubscribedPackages(id);
        myDataPromise.then(function (result) {
            $scope.Model = result.data.result_set;
            $scope.BindGridSubscribedPackages($scope.Model);
        });
    };

    $scope.GetBelitaMoney = function (id) {
        var myDataPromise = customerService.GetBelitaMoney(id);
        myDataPromise.then(function (result) {
            $scope.Model1 = result.data.result_set;
            $scope.BindGridBelitaMoney($scope.Model1);
        });
    };

    $scope.GetBelitaMoneyTransaction = function (id) {
        var myDataPromise = customerService.GetBelitaMoneyTransaction(id);
        myDataPromise.then(function (result) {
            $scope.BindGridBelitaMoneyTransaction(result.data.result_set);
        });
    };

    $scope.BindGridBelitaMoneyTransaction = function (model) {
        var data = [];
        for (var i = 0; i < model.length ; i++) {
            var row = {};
            row["paymentType"] = model[i].paytype_desc;
            row["paymentStatus"] = model[i].pay_status_desc;
            row["transactionStatus"] = model[i].trans_status_desc;
            row["transactionAmount"] = model[i].trans_amount;
            row["remark"] = model[i].trans_remarks;
            row["transactionDate"] = GetDate(model[i].trans_date);
            row["isDebit"] = model[i].is_debit == 1 ? true : false;
            data[i] = row;
        }
        var source =
        {
            localdata: data,
            datatype: "array"
        };

        var dataAdapter = new $.jqx.dataAdapter(source, {
            loadComplete: function (data) { $scope.Spinner = false; },
            loadError: function (xhr, status, error) { }
        });
        $("#jqxgridBelitaMoneyTransaction").jqxGrid(
        {
            width: '99%',
            height: '300px',
            source: dataAdapter,
            pageable: true,
            sortable: true,
            enableToolTips: true,
            enablebrowserselection: true,
            columns: [
                { text: 'Payment Type', datafield: 'paymentType', width: '25%' },
                { text: 'Payment Status', datafield: 'paymentStatus', width: '25%' },
                { text: 'Transaction Status', datafield: 'transactionStatus', width: '25%' },
                { text: 'Transaction Amount', datafield: 'transactionAmount', width: '25%' },
                { text: 'Remark', datafield: 'remark', width: '25%' },
                { text: 'Transaction Date', datafield: 'transactionDate', width: '25%' },
                { text: 'Is-Debit', datafield: 'isDebit', width: '25%' }
            ]
        });
    };

    $scope.BindGridAppointmentHistory = function (model) {

        var data = [];
        for (var i = 0; i < model.appointments.length ; i++) {
            var row = {};
            var date = new Date(model.appointments[i].ap_time - 19800000);

            row["invoiceNo"] = model.appointments[i].appid;

            row["serviceDate"] = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
            if (model.appointments[i].stylist != null || model.appointments[i].stylist != undefined) {
                row["therapist"] = model.appointments[i].stylist.stylistName;
            }
            else {
                row["therapist"] = "";
            }

            row["totalCost"] = model.appointments[i].total_amt;
            row["status"] = model.appointments[i].ap_status_desc;


            //row["invoiceNo"] = model.appointments[i].trans_details[0].id;
            //row["appointmentId"] = model.appointments[i].trans_details[0].appid;

            row["paymentDate"] = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

            row["paymentMode"] = "";
            row["paymentType"] = "";
            row["paytm_txn_id"] = "";
            for (var j = 0; j < model.appointments[i].trans_details.length; j++) {
                if (model.appointments[i].trans_details[j].is_debit == 1 && model.appointments[i].trans_details[j].trans_status != 4) {
                    row["paymentMode"] += model.appointments[i].trans_details[j].trans_amount + " , ";
                    row["paymentType"] += model.appointments[i].trans_details[j].paytype_desc + " , ";
                    if (model.appointments[i].trans_details[j].paytype == 2)
                        row["paytm_txn_id"] = model.appointments[i].trans_details[j].paytm_txn_id;
                }
            }
            var services = "";
            for (var j = 0; j < model.appointments[i].services.length; j++) {
                services += model.appointments[i].services[j].serviceName + ", ";
            }
            if (model.appointments[i].feedback != undefined) {
                row["dislikeQuality"] = model.appointments[i].feedback.dislikeQualities;
                row["additionalComment"] = model.appointments[i].feedback.additionalComment;
                row["averageRating"] = model.appointments[i].feedback.totalRating;
            }
            else {
                row["dislikeQuality"] = "";
                row["additionalComment"] = "";
                row["averageRating"] = "";
            }
            row["services"] = services;
            row["appointmentCreatedBy"] = model.appointments[i].appointmentCreatedBy != undefined ? model.appointments[i].appointmentCreatedBy.userName : "";
            row["appointmentModifiedBy"] = model.appointments[i].appointmentModifiedBy != undefined ? model.appointments[i].appointmentModifiedBy.userName : "";
            data[i] = row;


        }
        var source =
        {
            localdata: data,
            datatype: "array"
        };

        var dataAdapter = new $.jqx.dataAdapter(source, {
            loadComplete: function (data) { $scope.Spinner = false; },
            loadError: function (xhr, status, error) { }
        });
        $("#jqxgridappointmentHistory").jqxGrid(
        {
            width: '99%',
            height: '300px',
            source: dataAdapter,
            pageable: true,
            sortable: true,
            enableToolTips: true,
            enablebrowserselection: true,
            columns: [
                { text: 'Appointment Id', datafield: 'invoiceNo', width: '25%' },
                { text: 'Service Date', datafield: 'serviceDate', width: '25%' },
                { text: 'Services ', datafield: 'services', width: '25%' },
                { text: 'Therapist', datafield: 'therapist', width: '25%' },
                { text: 'Total Cost', datafield: 'totalCost', width: '25%' },
                { text: 'Status', datafield: 'status', width: '25%' },
                { text: 'Dislike Qualities', datafield: 'dislikeQuality', width: '25%' },
                { text: 'Additional Comment', datafield: 'additionalComment', width: '25%' },
                { text: 'Average Rating', datafield: 'averageRating', width: '25%' },
                { text: 'Payment Date', datafield: 'paymentDate', width: '20%' },
                { text: 'Payment Cost', datafield: 'paymentMode', width: '20%' },
                { text: 'Payment Type', datafield: 'paymentType', width: '20%' },
                { text: 'Paytm Transaction Id', datafield: 'paytm_txn_id', width: '20%' },
                { text: 'App Created By', datafield: 'appointmentCreatedBy', width: '20%' },
                { text: 'App Modified By', datafield: 'appointmentModifiedBy', width: '20%' },

                // { text: 'BaseCenter', datafield: 'baseCenter', width: '20%' }
            ]
        });
    };

    $scope.BindGridPaymentHistory = function (model) {

        var data = [];
        for (var i = 0; i < model.appointments.length ; i++) {
            var row = {};
            var date = new Date(model.appointments[i].trans_details[0].trans_date - 19800000);

            row["invoiceNo"] = model.appointments[i].trans_details[0].id;
            row["appointmentId"] = model.appointments[i].trans_details[0].appid;

            row["paymentDate"] = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
            row["paymentMode"] = model.appointments[i].trans_details[0].trans_amount;
            row["paymentType"] = model.appointments[i].trans_details[0].paytype_desc;
            // row["baseCenter"] = model.appointments[i].baseCenter;
            data[i] = row;


        }
        var source =
        {
            localdata: data,
            datatype: "array"
        };

        var dataAdapter = new $.jqx.dataAdapter(source, {
            loadComplete: function (data) { $scope.Spinner = false; },
            loadError: function (xhr, status, error) { }
        });
        $("#jqxgridpaymentHistory").jqxGrid(
        {
            width: '99%',
            height: '250px',
            source: dataAdapter,
            pageable: true,
            sortable: true,
            enableToolTips: true,
            enablebrowserselection: true,
            columns: [
                { text: 'Invoice No', datafield: 'invoiceNo', width: '20%' },
                { text: 'Appointment#', datafield: 'appointmentId', width: '20%' },
               { text: 'Payment Date', datafield: 'paymentDate', width: '20%' },
                { text: 'Payment Cost', datafield: 'paymentMode', width: '20%' },
                { text: 'Payment Type', datafield: 'paymentType', width: '20%' },
               //  { text: 'BaseCenter', datafield: 'baseCenter', width: '20%' }
            ]
        });

    };

    $scope.BindGridNotificationHistory = function (model) {

        var data = [];
        if (model != null) {
            for (var i = 0; i < model.length ; i++) {
                var row = {};
                var date = new Date(model[i].sentOnDate - 19800000);

                //row["template"] = model[i].template;
                //row["status"] = model[i].status;
                row["sentOn"] = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
                row["type"] = model[i].notificationType;
                row["message"] = model[i].message;
                data[i] = row;
            }
        }



        var source =
        {
            localdata: data,
            datatype: "array"
        };

        var dataAdapter = new $.jqx.dataAdapter(source, {
            loadComplete: function (data) { $scope.Spinner = false; },
            loadError: function (xhr, status, error) { }
        });
        $("#jqxgridNotificationHistory").jqxGrid(
        {
            width: '99%',
            height: '300px',
            source: dataAdapter,
            pageable: true,
            sortable: true,
            enableToolTips: true,
            enablebrowserselection: true,
            columns: [
               // { text: 'Template', datafield: 'template', width: '10%' },
               // { text: 'Status', datafield: 'status', width: '25%' },
                { text: 'Sent On', datafield: 'sentOn', width: '25%' },
                { text: 'Type', datafield: 'type', width: '20%' },
                 { text: 'Message', datafield: 'message', width: '55%' }
            ]
        });
    };

    $scope.BindGridSubscribedPackages = function (model) {

        var data = [];
        if (model == null)
            return;
        var row = {};
        for (var i = 0; i < model.packageDetailDTOs.length ; i++) {

            var date = new Date(model.packageDetailDTOs[i].booking_time - 19800000);
            var date1 = new Date(model.packageDetailDTOs[i].ap_time - 19800000);

            for (var j = 0; j < model.packageDetailDTOs[i].services.length; j++) {
                //var date2 = new Date(model.packageDetailDTOs[i].pkg_expiry_date - 19800000);
                row["packageName"] = model.packageDetailDTOs[i].services[j].serviceName;
                row["purchaseDate"] = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
                row["price"] = model.packageDetailDTOs[i].services[j].servicePrice;
                row["startDate"] = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();;//date1.getDate() + "/" + (date1.getMonth() + 1) + "/" + date1.getFullYear();
                //row["expiration"] = date2.getDate() + "/" + (date2.getMonth() + 1) + "/" + date2.getFullYear();
                //data[j] = row;
                data.push(row);
            }
        }
        var source =
        {
            localdata: data,
            datatype: "array"
        };

        var dataAdapter = new $.jqx.dataAdapter(source, {
            loadComplete: function (data) { $scope.Spinner = false; },
            loadError: function (xhr, status, error) { }
        });
        $("#jqxgridSubscribedPackages").jqxGrid(
        {
            width: '99%',
            height: '300px',
            source: dataAdapter,
            pageable: true,
            sortable: true,
            enableToolTips: true,
            enablebrowserselection: true,
            columns: [
                { text: 'Package Name', datafield: 'packageName', width: '25%' },
                { text: 'Purchase Date', datafield: 'purchaseDate', width: '25%' },
                { text: 'Price', datafield: 'price', width: '10%' },
                { text: 'Start Date', datafield: 'startDate', width: '20%' },
                 { text: 'Expiration', datafield: 'expiration', width: '20%' }
            ]
        });
    };

    $scope.BindGridBelitaMoney = function (model) {

        if ($scope.VIEW) {
            var data = [];
            if (model == null)
                return;
            for (var i = 0; i < model.length ; i++) {
                var row = {};
                var date = new Date(model[i].belitaMoneyExp + 19800000);

                row["bmType"] = model[i].belitaMoneyType.description;
                row["bmAmount"] = model[i].belitaMoneyAmount;
                row["bmExpiry"] = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
                row["id"] = model[i].belitaMoneyType.id;
                data[i] = row;
            }

            var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties) {
                var str = "";
                if ($scope.EDIT) {
                    str += '<a onclick="ShowBelitaMoneyModel(' + value + ')"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></a>';
                }
                return str;
            };
            var source =
            {
                localdata: data,
                datatype: "array"
            };

            var dataAdapter = new $.jqx.dataAdapter(source, {
                loadComplete: function (data) { $scope.Spinner = false; },
                loadError: function (xhr, status, error) { }
            });
            $("#jqxgridBelitaMoney").jqxGrid(
            {
                width: '99%',
                height: '150px',
                source: dataAdapter,
                //pageable: true,
                sortable: true,
                enableToolTips: true,
                enablebrowserselection: true,
                columns: [
                    { text: 'BM Type', datafield: 'bmType', width: '25%' },
                    { text: 'BM Amount', datafield: 'bmAmount', width: '25%' },
                    { text: 'BM Expiry', datafield: 'bmExpiry', width: '25%' },
                     { text: 'Manage', datafield: 'id', cellsrenderer: cellsrenderer, width: '25%' }

                ]
            });
        }
    };

    $scope.ShowBelitaMoneyModel = function (id) {
        //$scope.ClearForm();
        $scope.GetBelitaMoneyDetailsById(id);
        $("#dvAddBelitaMoney").modal("show");
    };

    $scope.UpdateCustomer = function () {
        $scope.disableButton();
        var model = $scope.getModel();
        var dataPromise = customerService.UpdateCustomer(model);
        dataPromise.then(function (result) {
            if (result.data.result_set != null) {
                $("#collapseOne").removeClass("in");
                $scope.messageRegister = "Customer updated successfully";
            }
            else {
                $scope.messageRegister = "An error while updating Customer";
            }
            $scope.SearchCustomer($scope.customerSearch);
            HideMessage();
        });
    };

    $scope.disableButton = function () {
        $scope.blockButton = true;
        $timeout(function () { $scope.blockButton = false; }, 2000);
    }


    $scope.SaveBelitaMoney = function () {
        var model = $scope.getBelitaMoneyModel();
        var dataPromise = customerService.UpdateBelitaMoney(model);
        dataPromise.then(function (result) {


            $("#dvAddBelitaMoney").modal("hide");
            $scope.messageBelitaMoney = result.data.msg.message;


            $scope.ShowCustomerUpdate(model.custId);
            HideMessage();
            $scope.clearFormBelita();
        });
    };

    $scope.Close = function () {
        $scope.clearFormBelita();
        $("#dvAddBelitaMoney").modal("hide");
    };

    $scope.clearFormBelita = function () {
        $scope.bmAmount = "";
        $scope.bmExpiry = "";
        $scope.bmType = ""
    };

    function HideMessage() {
        $timeout(function () { $scope.message = ""; $scope.messageBelitaMoney = ""; $scope.messageRegister = "" }, 3000);
    }

    function GetDate(date) {
        var d = new Date(date);//new Date();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var output = (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month + '/' + d.getFullYear();
        // d.getFullYear() + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;
        return output;
    }
}

function ShowCustomerUpdate(custId) {
    var scope = angular.element($("#dvCustomer")).scope();
    scope.ShowCustomerUpdate(custId);
    scope.$apply();
}

function ShowBelitaMoneyModel(id) {
    var scope = angular.element($("#dvCustomer")).scope();
    scope.ShowBelitaMoneyModel(id);
    scope.$apply();
}