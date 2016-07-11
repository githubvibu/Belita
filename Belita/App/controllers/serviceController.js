app.controller('serviceController', createService);
app.$inject = ['$scope', 'ngCookies', '$location', 'service', 'commonService', '$timeout', 'authService', 'app'];
function createService($scope, $cookieStore, $location, service, commonService, $timeout, authService, app) {
    $scope.id = 0;
    $scope.city = [];
    $scope.cityId = "0";
    $scope.message = "";
    $scope.Model = [];
    $scope.currentPageIndex = 0;

    //model for add service
    $scope.serviceId = 0;
    $scope.serviceName = "";
    $scope.serviceDescription = "";
    $scope.serviceCategoryID = "";
    $scope.serviceCategory = [];
    $scope.productServiceType = [];
    $scope.productServiceTypeId = "";
    $scope.productCategoryID = '';
    $scope.productCategory = [];
    $scope.belitaMoney = "";
    $scope.belitaMoneyValidity = "";

    $scope.text = "Select";
    $scope.productCategoryIDArray = [];
    $scope.productCategoryArray = [];
    //----finish model

    //model for save city
    $scope.cityProductServiceID = "";
    $scope.cityProductService = [];
    $scope.cityServiceName = "";
    $scope.serviceCityID = "";
    $scope.serviceCity = [];
    $scope.servicePrice = "";
    $scope.serviceTime = "";
    $scope.serviceCityList = [];
    $scope.serviceCityCategoryID = "";
    $scope.isvalidOnApp = false;

    $scope.Spinner = false;

    $scope.VIEW = false;
    $scope.EDIT = false;
    $scope.CREATE = false;
    $scope.DELETE = false;

    $scope.GetRoles = function () {

        commonService.CheckPermissionData();
        if (authService.GetCredentials().role == 1) {
            $scope.VIEW = app.admin.Services.View;
            $scope.EDIT = app.admin.Services.Edit;
            $scope.CREATE = app.admin.Services.Create;
            $scope.DELETE = app.admin.Services.Delete;
        } else if (authService.GetCredentials().role == 2) {
            $scope.VIEW = app.executive.Services.View;
            $scope.EDIT = app.executive.Services.Edit;
            $scope.CREATE = app.executive.Services.Create;
            $scope.DELETE = app.executive.Services.Delete;
        }
    };

    $scope.GoToService = function () {
        $location.path("/service");
    }

    $scope.GetService = function () {
        $scope.GetRoles();
        $scope.serviceCity = commonService.GetMasterCities();
        $scope.serviceCategory = commonService.GetServiceCategory();
        $scope.productServiceType = commonService.GetProductServiceType();
        //$scope.GetServiceList();
    };

    $scope.GetServiceList = function () {

        var myDataPromise = service.GetServiceList();
        myDataPromise.then(function (result) {
            if (result.data.result_set != null) {
                $scope.cityProductService = [];
                for (var i = 0; i < result.data.result_set.length; i++) {

                    var serv =
                        {
                            "id": result.data.result_set[i].serviceId,
                            "name": result.data.result_set[i].serviceName
                        };
                    $scope.cityProductService.push(serv);
                }
            }
        });
    };

    $scope.GetServiceListByCategoryId = function (id) {

        if ($scope.serviceCityCategoryID == "" || $scope.serviceCityCategoryID == undefined) {
            $scope.cityProductService = [];
        }
        else {
            //var myDataPromise = service.GetProductServiceCategory(id);
            var myDataPromise = service.GetServiceListByCategoryId(id);
            myDataPromise.then(function (result) {
                if (result.data.result_set != null) {
                    $scope.cityProductService = [];
                    for (var i = 0; i < result.data.result_set.length; i++) {
                        //if (result.data.result_set[i].categoryId == id) {
                        var serv =
                                                {
                                                    "id": result.data.result_set[i].serviceId,
                                                    "name": result.data.result_set[i].serviceName
                                                };
                        $scope.cityProductService.push(serv);
                        //}
                    }
                }
            });
        }

    };

    $scope.ServiceCategoryChange = function () {
        $scope.GetProductServiceCategory();
    };

    $scope.GetProductServiceCategory = function () {

        $scope.productCategoryID = "";
        $scope.productCategoryIDArray = [];
        $scope.productCategoryArray = [];
        $scope.text = "Select";
        if ($scope.serviceCategoryID == "" || $scope.serviceCategoryID == undefined) {
            $scope.productCategory = [];
            $scope.productCategoryArray = [];
        } else {
            var myDataPromise = service.GetProductServiceCategory($scope.serviceCategoryID);//$scope.productServiceTypeId
            myDataPromise.then(function (result) {
                if (result.data.result_set != null) {
                    $scope.productCategory = [];
                    for (var i = 0; i < result.data.result_set.length; i++) {
                        var servCat =
                            {
                                "id": result.data.result_set[i].serviceId,
                                "name": result.data.result_set[i].serviceName
                            };
                        $scope.productCategory.push(servCat);
                        $scope.productCategoryArray.push(servCat);
                    }
                }
            });
        }

    };

    $scope.loadForm = function () {
        $scope.GetRoles();
        $scope.city = commonService.GetMasterCities();
        $scope.serviceCategory = commonService.GetServiceCategory();
        $scope.productServiceType = commonService.GetProductServiceType();

    };

    $scope.SaveProductService = function () {

        $scope.Spinner = true;
        var model = GetModel();
        var myDataPromise = service.SaveProductServices(model);
        myDataPromise.then(function (result) {
            if (result.data.result_set != null) {
                $scope.message = "Service created successfully";
                ClearForm();
            }
            else if (result.data.msg != null) {
                $scope.message = result.data.msg.message;
            }
            HideMessage();
            $scope.Spinner = false;
        });
    };

    $scope.AddCity = function () {
        $scope.Spinner = true;
        var model = GetCityModel();
        if (model.serviceId != 0) {
            var myDataPromise = service.SaveServiceCity(model);
            myDataPromise.then(function (result) {
                if (result.data.result_set != null) {
                    $scope.message = "city associated successfully";
                    ClearForm()
                }
                $scope.Spinner = false;
                HideMessage();
            });
        }
    };

    $scope.UpdateService = function () {

        $scope.Spinner = true;
        var model = GetUpdateModel();//GetModel();
        var myDataPromise = service.UpdateProductServices(model);
        myDataPromise.then(function (result) {
            if (result.data.msg.code == "1") {
                $scope.GetServiceData();
                $("#dvUpdateService").modal("hide");
                ClearForm();
                $scope.message = "Service updated successfully";
                HideMessage();
            }
            $scope.Spinner = false;
        });
        $scope.IsEdit(id, false);
    };

    $scope.EditCity = function (id) {

        $scope.IsEdit(id, true);
    }
    $scope.CancelCity = function (id) {

        $scope.IsEdit(id, false);
    };

    $scope.IsEdit = function (id, isEdit) {
        var val = $scope.serviceCityList;
        for (var i = 0; i < $scope.serviceCityList.length; i++) {
            if (id == $scope.serviceCityList[i].cityId && isEdit == true) {
                $scope.serviceCityList[i].edit = true;
            }
            else {
                $scope.serviceCityList[i].edit = false;
            }
        }
    };

    $scope.UpdateCity = function (id) {


        var val = $scope.serviceCityList;
        var model = GetUpdateCityModel(id);
        var myDataPromise = service.UpdateCity(model);
        myDataPromise.then(function (result) {
            if (result.data.result_set != null) {
                //ClearForm();

                $scope.GetServiceByServiceId($scope.serviceId);
                $scope.GetServiceData();
            }
        });
        $scope.IsEdit(id, false);
    }

    $scope.GetServiceName = function () {

        $scope.cityProductServiceID = "";
        $scope.GetServiceListByCategoryId($scope.serviceCityCategoryID);
    };

    function GetUpdateCityModel(cityId) {

        var city = [];

        var val = $scope.serviceCityList;
        for (var i = 0; i < $scope.serviceCityList.length; i++) {
            if (cityId == $scope.serviceCityList[i].cityId) {
                city = $scope.serviceCityList[i];
            }
        }
        var serviceId = city.serviceId;
        var servicePrice = city.servicePrice;
        var serviceTime = city.serviceTime;
        var cityId = city.cityId;
        var serviceCityMappingId = city.serviceCityMappingId;
        var model = {
            categoryId: 0,
            servicePrice: parseInt(servicePrice),
            serviceTime: parseInt(serviceTime),
            categoryName: "",
            serviceId: parseInt(serviceId),
            serviceDescription: "",
            serviceName: "",
            productCityMappingId: serviceCityMappingId,
            generalServiceAppliedIds: [],
            productServiceTypeId: 0,
            cityId: parseInt(cityId)
        };
        //$scope.productServiceTypeId
        return model;
    }

    function GetCityModel() {
        var model = {
            categoryId: 0,
            servicePrice: parseInt($scope.servicePrice),
            serviceTime: parseInt($scope.serviceTime),
            categoryName: "",
            serviceId: parseInt($scope.cityProductServiceID),
            serviceDescription: "",
            serviceName: "",
            productCityMappingId: 0,
            generalServiceAppliedIds: [],
            productServiceTypeId: $scope.productServiceTypeId,
            cityId: parseInt($scope.serviceCityID)
        };
        return model;
    }

    function GetUpdateModel() {
        var model = {
            categoryId: parseInt($scope.serviceCategoryID),
            servicePrice: 0,
            serviceTime: 0,
            categoryName: "",
            serviceId: $scope.serviceId,
            serviceDescription: $scope.serviceDescription,
            serviceName: $scope.serviceName,
            productCityMappingId: 0,
            generalServiceAppliedIds: $scope.productCategoryIDArray,//[$scope.productCategoryIDArray],//[$scope.productCategoryID],
            productServiceTypeId: $scope.productServiceTypeId,
            cityId: 0,
            packageAmount: $scope.belitaMoney,
            packageValidity: $scope.belitaMoneyValidity,
            isvalidOnApp: $scope.isvalidOnApp == true ? 1 : 0
        };
        return model;
    }

    function GetModel() {
        var model = {
            categoryId: parseInt($scope.serviceCategoryID),
            servicePrice: 0,
            serviceTime: 0,
            categoryName: "",
            serviceId: 0,
            serviceDescription: $scope.serviceDescription,
            serviceName: $scope.serviceName,
            productCityMappingId: 0,
            generalServiceAppliedIds: $scope.productCategoryIDArray,//[$scope.productCategoryID],
            productServiceTypeId: $scope.productServiceTypeId,
            cityId: 0,
            packageAmount: $scope.belitaMoney,
            packageValidity: $scope.belitaMoneyValidity,
            isvalidOnApp: $scope.isvalidOnApp == true ? 1 : 0
        };
        return model;
    }

    $scope.GetServiceData = function () {

        $scope.Spinner = true;
        var myDataPromise = service.GetProductServiceList($scope.cityId);
        myDataPromise.then(function (result) {

            $scope.Model = result.data.result_set;
            $scope.BindGrid($scope.Model);

        });
    };

    $scope.BindGrid = function (model) {
        if ($scope.VIEW) {
            var data = [];
            for (var i = 0; i < model.length ; i++) {
                var row = {};
                row["serviceName"] = model[i].serviceName;
                row["categoryName"] = model[i].categoryName;
                row["serviceTime"] = model[i].serviceTime;
                row["servicePrice"] = model[i].servicePrice;
                row["serviceDescription"] = model[i].serviceDescription
                row["isvalidOnApp"] = model[i].isvalidOnApp == 0 ? false : true;
                row["serviceId"] = model[i].serviceId;
                data[i] = row;
            }
            var source =
            {
                localdata: data,
                datatype: "array",
                pagenum: $scope.currentPageIndex
            };
            var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties) {
                var str = "";
                if ($scope.EDIT) {

                    //str += '<a onclick="ShowServiceModel(' + value + ')"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></a><a onclick="DeleteService(' + value + ')"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>';
                    str += '<a onclick="ShowServiceModel(' + value + ')"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></a>';
                }

                return str;
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
                showfilterrow: true,
                enablebrowserselection: true,
                columns: [
                    { text: 'Product Name', datafield: 'serviceName', width: '15%' },
                      { text: 'Category Name', datafield: 'categoryName', width: '15%' },
                    { text: 'Product Time', datafield: 'serviceTime', width: '15%' },
                    { text: 'Price', datafield: 'servicePrice', width: '15%' },
                    { text: 'Desciption', datafield: 'serviceDescription', width: '15%' },
                    { text: 'Valid for App', datafield: 'isvalidOnApp', width: '10%' },
                    { text: 'Manage', datafield: 'serviceId', filterable: false, cellsrenderer: cellsrenderer, width: '15%', cellsalign: 'right' }
                ]
            });
            $("#jqxgrid").jqxGrid('gotopage', $scope.currentPageIndex);

        }
    };



    $("#jqxgrid").on("pagechanged", function (event) {

        $scope.currentPageIndex = args.pagenum;
    });



    $scope.CreateService = function () {
        $location.path("/addservice");
    };

    //$scope.ShowServiceModel = function () {
    //    // ClearForm();
    //    $("#dvAddService").modal("show");
    //};

    $scope.ShowModel = function (id) {

        ClearForm();
        $scope.serviceCityList = [];
        $("#dvUpdateService").modal("show");
        $scope.GetServiceByServiceId(id);

    };

    $scope.GetServiceByServiceId = function (id) {

        var myDataPromise = service.GetServiceByServiceId(id);
        myDataPromise.then(function (result) {
            $scope.serviceCityList = [];
            $scope.Model = result.data.result_set;
            $scope.BindModel($scope.Model);
            for (var i = 0; i < result.data.result_set.serviceCityMappingInfo.length; i++) {
                var city =
                    {
                        "cityId": result.data.result_set.serviceCityMappingInfo[i].cityId,
                        "cityName": result.data.result_set.serviceCityMappingInfo[i].cityName,
                        "servicePrice": result.data.result_set.serviceCityMappingInfo[i].servicePrice,
                        "serviceTime": result.data.result_set.serviceCityMappingInfo[i].serviceTime,
                        "serviceId": result.data.result_set.serviceCityMappingInfo[i].serviceId,
                        "edit": false,
                        "serviceCityMappingId": result.data.result_set.serviceCityMappingInfo[i].serviceCityMappingId,
                    }
                $scope.serviceCityList.push(city);
            }

        });
    };

    $scope.BindModel = function (response) {
        $scope.serviceCategoryID = String(response.categoryId);
        $scope.GetProductServiceCategory();
        $timeout(function () {
            $(".btnDropdown").attr("disabled", "disabled");
            $(".select_arrow").attr("disabled", "disabled");
            if (response.generalServiceAppliedIds.length > 0)
                $scope.text = "";
            for (var i = 0; i < $scope.productCategoryArray.length; i++) {
                for (var j = 0; j < response.generalServiceAppliedIds.length; j++) {
                    if ($scope.productCategoryArray[i].id == response.generalServiceAppliedIds[j])
                        $scope.text += $scope.productCategoryArray[i].name + ",";
                }
            }
            if ($scope.text.length > 25) {
                $scope.text = $scope.text.substr(0, 20);
                $scope.text += "...";
            }
            $scope.productCategoryIDArray = response.generalServiceAppliedIds;
            $scope.message = "";
            $scope.serviceId = response.serviceId;
            $scope.serviceName = response.serviceName;
            $scope.serviceDescription = response.serviceDescription;
            $scope.productServiceTypeId = String(response.productServiceTypeId);
            $scope.productCategoryID = response.productCategoryID;
            $scope.cityProductServiceID = response.cityProductServiceID;
            $scope.cityServiceName = response.cityServiceName;
            $scope.serviceCityID = response.serviceCityID;
            $scope.servicePrice = response.servicePrice;
            $scope.serviceTime = response.serviceTime;

            $scope.productCategoryID = response.generalServiceAppliedIds[0];
            $scope.belitaMoney = response.packageAmount;
            $scope.belitaMoneyValidity = response.packageValidity;
            $scope.isvalidOnApp = response.isvalidOnApp == 0 ? false : true;
        }, 500);
    }

    $scope.DeleteService = function (id) {
        var dataPromise = service.DeleteService(id);
        dataPromise.then(function (result) {
            if (result.data.msg != null && result.data.msg.code == "1") {
                $scope.message = "Service deleted successfully";
                HideMessage();
                $scope.GetServiceData();
            }
            else {
                $scope.message = "An error occur while deleting";
                HideMessage();
            }
        });
    }


    function HideMessage() {
        $timeout(function () { $scope.message = ""; }, 3000);
    }

    function ClearForm() {
        $scope.serviceId = 0;
        $scope.serviceName = "";
        $scope.serviceDescription = "";
        $scope.serviceCategoryId = "0";
        $scope.productServiceTypeId = "";
        $scope.productCategoryID = "0";
        $scope.cityProductServiceID = "0";
        $scope.cityServiceName = "";
        $scope.serviceCityID = "0";
        $scope.servicePrice = "";
        $scope.serviceTime = "";
        $scope.serviceCategoryID = "0";
        $scope.serviceCityCategoryID = "0";
        $scope.isvalidOnApp = false;
    }


}
function ShowServiceModel(id) {

    var scope = angular.element($("#dvService")).scope();
    scope.ShowModel(id);
    scope.$apply();
}

function DeleteService(id) {
    var scope = angular.element($("#dvService")).scope();
    if (confirm("Are you sure you want to delete ?"))
        scope.DeleteService(id);
    scope.$apply();
}