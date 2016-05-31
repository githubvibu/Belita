app.controller('stylistScheduleController', stylistScheduleController);
app.$inject = ['$scope', '$routeParams', '$location', 'commonService', '$http', '$timeout', , 'stylistService', 'stylistScheduleService', 'manageAppointmentService'];
function stylistScheduleController($scope, $routeParams, $location, commonService, $http, $timeout, stylistService, stylistScheduleService, manageAppointmentService) {
    $scope.cityId = "";
    $scope.cities = [];
    $scope.baseCenterId = "";
    $scope.baseCenter = [];
    $scope.message = "";
    $scope.noOfDays = 1;
    $scope.currentDate = new Date();
    $scope.showStylist = false;
    $scope.stylishWorkStatus = [];
    $scope.select = false;
    $scope.model = [];

    $scope.hours = [];
    $scope.minutes = [];
    $scope.am = ["AM", "PM"];
    $scope.message = "";
    $scope.ist = 19800000;
    $scope.GetCity = function () {
        for (var i = 1; i <= 12; i++) {
            $scope.hours.push(i);
        }
        for (var i = 1; i <= 59; i++) {
            $scope.minutes.push(i);
        }
        $scope.cities = commonService.GetMasterCities();
        $scope.stylishWorkStatus = commonService.GetStylistWorkStatus();
    };

    $scope.getBaseGroup = function () {
        $scope.baseCenter = commonService.GetBaseServiceCenter($scope.cityId);
        $scope.baseCenterId = "";
    };

    $scope.Previous = function () {
        $scope.currentDate.setDate($scope.currentDate.getDate() - 1);
    };
    $scope.Next = function () {
        $scope.currentDate.setDate($scope.currentDate.getDate() + 1);
    };

    $scope.$watch('currentDate', function () {
        $scope.getStylistData();
    }, true);

    $scope.getStylistData = function () {

        var date = new Date($scope.currentDate.getFullYear() + "-" + ($scope.currentDate.getMonth() + 1) + "-" + $scope.currentDate.getDate());
        var dat = Date.parse(date) + $scope.ist;
        var myDataPromise = manageAppointmentService.GetStylistDetailWithAttendence($scope.baseCenterId, -1, dat);
        myDataPromise.then(function (result) {
            $scope.showStylist = true;
            $scope.model = $scope.getStylistModel(result.data.result_set)
            //$timeout(function () {
            //$scope.$apply();
            //}, 3000);
            //$scope.$apply();
        });
    };

    $scope.SetWorkStatusId = function (id) {
        for (var i = 0; i < $scope.model.length; i++) {
            if (id == $scope.model[i].id)
                $scope.model[i].workStatusId ="2";
        }
        //$scope.apply();
    }

    $scope.getStylistModel = function (scopeModel) {

        var modelArray = [];
        if (scopeModel != null && scopeModel.length > 0) {
            for (var i = 0; i < scopeModel.length; i++) {
                var fromHour = 1;
                var fromMinute = 0;
                var fromAMPM = "AM";
                var toHour = 1;
                var toMinute = 0;
                var toAMPM = "AM";
                var attendenceId = 0;
                var workStatusId = "1";
                var fromDate = "";
                var toDate = "";
                if (scopeModel[i].stylistAttendances.length > 0) {
                    if (scopeModel[i].stylistAttendances[0].id == null)//scopeModel[i].stylistAttendances[0].stylistId == scopeModel[i].stylistAttendances[0].id)
                        attendenceId = 0;
                    else
                        attendenceId = scopeModel[i].stylistAttendances[0].id;

                    fromDate = new Date(scopeModel[i].stylistAttendances[0].fromTime);
                    toDate = new Date(scopeModel[i].stylistAttendances[0].toTime);
                    fromHour = fromDate.getHours() > 12 ? (fromDate.getHours() - 12) : fromDate.getHours();
                    fromHour = fromHour == 0 ? 12 : fromHour;
                    fromMinute = fromDate.getMinutes();
                    toHour = toDate.getHours() > 12 ? (toDate.getHours() - 12) : toDate.getHours();
                    toHour = toHour == 0 ? 12 : toHour;
                    toMinute = toDate.getMinutes();

                    fromAMPM = fromDate.getHours() >= 12 ? "PM" : "AM"; //scopeModel[i].stylistAttendances[0].workStatusId;
                    toAMPM = toDate.getHours() >= 12 ? "PM" : "AM";//scopeModel[i].stylistAttendances[0].id;
                    workStatusId =String(scopeModel[i].stylistAttendances[0].workStatusId);
                }
                //if (workStatusId < 2)
                //{
                var model = {
                    id: attendenceId,
                    stylistName: scopeModel[i].stylistName,
                    stylistId: scopeModel[i].id,
                    fromTime: 0,
                    toTime: 0,
                    workStatusId: workStatusId,
                    vaildForDays: 1,

                    isChecked: false,
                    hoursValueFrom: String(fromHour),
                    minuteValueFrom: String(fromMinute),
                    amValueFrom: fromAMPM,//"AM",
                    hoursValueTo: String(toHour),
                    minuteValueTo: String(toMinute),
                    amValueTo: toAMPM//"PM",
                }
                modelArray.push(model);
                //}


            }
            $scope.$apply();
        }

        return modelArray;
    }

    $scope.Save = function () {

        var model = [];
        var isAnyChecked = false;
        for (var i = 0; i < $scope.model.length; i++) {
            if ($scope.model[i].isChecked == true) {
                isAnyChecked = true;
                var m = $scope.GetSaveModel();
                var hoursFrom = parseInt($scope.model[i].hoursValueFrom);
                var hoursTo = parseInt($scope.model[i].hoursValueTo);
                if ($scope.model[i].amValueFrom == "PM") {
                    if (hoursFrom != 12)
                        hoursFrom += 12;
                }
                else if ($scope.model[i].amValueFrom == "AM") {
                    if (hoursFrom == 12)
                        hoursFrom = 0;
                }

                if ($scope.model[i].amValueTo == "PM") {
                    if (hoursTo != 12)
                        hoursTo += 12;
                }
                else if ($scope.model[i].amValueTo == "AM") {
                    if (hoursTo == 12)
                        hoursTo = 0;
                }
                var fromDate = ((parseInt(hoursFrom) * 60) + parseInt($scope.model[i].minuteValueFrom)) * 60 * 1000 - $scope.ist; //$scope.getDate($scope.currentDate, hoursFrom, $scope.model[i].minuteValueFrom);
                //if (fromDate == 0) fromDate=$scope.ist;
                var toDate = ((parseInt(hoursTo) * 60) + parseInt($scope.model[i].minuteValueTo)) * 60 * 1000 - $scope.ist; //$scope.getDate($scope.currentDate, hoursTo, $scope.model[i].minuteValueTo);
                //if (toDate == 0)fromDate= $scope.ist;

                fromDate = new Date(fromDate);
                toDate = new Date(toDate);

                var from = Date.parse(fromDate);
                var to = Date.parse(toDate);

                if ($scope.model[i].workStatusId == "2" || $scope.model[i].workStatusId == "3")
                {
                    m.fromTime = 0;
                    m.toTime = 0;
                }
                else
                {
                    m.fromTime = from;
                    m.toTime = to;
                }
                
                m.vaildForDays = $scope.noOfDays;// + 1;
                m.workStatusId = $scope.model[i].workStatusId;
                m.id = $scope.model[i].id;
                m.stylistId = $scope.model[i].stylistId;
                m.date = Date.parse(new Date($scope.getDateWithoutTime($scope.currentDate)));
                model.push(m);
            }

        }
        if (isAnyChecked == true) {
            var myDataPromise = stylistScheduleService.addStylistSchedule(model);
            myDataPromise.then(function (result) {
                $scope.message = result.data.msg.message;
                HideMessage();
                $scope.getStylistData();
                $scope.select = false;
            });
        }
        else {
            $scope.message = "Please select stylist";
            HideMessage();
        }
    };

    $scope.GetSaveModel = function () {
        var model = {
            id: 0,
            stylistId: 0,
            fromTime: 0,
            toTime: 0,
            workStatusId: 0,
            vaildForDays: 0,
            checkIn: 0,
            checkOut: 0,
            date: 0
        }
        return model;
    };

    $scope.getDate = function (date, hour, minute) {
        var d = new Date(date);//new Date();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var output = hour + ":" + minute;//d.getFullYear() + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day + " " + hour + ":" + minute;
        return output;
    };

    $scope.getDateWithoutTime = function (date) {
        var d = new Date(date);//new Date();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var output = d.getFullYear() + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;
        return output;
    };

    $scope.getTime = function (date, time) {
        var d = new Date(date);
        var value = '';
        switch (time) {
            case 'hour':
                value = d.getHours();
                break;
            case 'Minute':
                value = d.getMinutes();
                break;
            case 'AMPM':
                if (d.getHours() >= 12)
                    value = "PM"
                else value = "AM";
                break;
        }
        return value;
    }

    $scope.selectAll = function () {
        var select = $scope.select == false ? true : false;
        for (var i = 0; i < $scope.model.length; i++)
            $scope.model[i].isChecked = select == false ? true : false;
    };

    function HideMessage() {
        $timeout(function () { $scope.message = ""; }, 3000);
    }
}