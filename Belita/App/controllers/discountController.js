app.controller('discountController', discount);
app.$inject = ['$scope', '$routeParams', '$location', 'discountService', 'app', 'commonService', '$timeout', 'authService', 'app'];

function discount($scope, $routeParams, $location, discountService, app, commonService, $timeout, authService, app) {

    $scope.maxDiscValue = "";
    $scope.voucherPrefix = "";
    $scope.voucherCount = 0;
    $scope.vouchersList = [];
    $scope.DiscApplicabilityType = [];
    $scope.discValue = 0;
    $scope.discCode = "";
    $scope.DiscStatus = [];
    $scope.Disctype = [];
    $scope.mmPeriodRqrd = 0;
    $scope.id = 0;
    $scope.title = "Create Discount";
    $scope.DiscTypeId = "";
    $scope.DiscApplicabilityTypeId = "";
    $scope.Description = "";
    $scope.DiscountAmount = 0;
    $scope.ExpiryDate = "";
    $scope.MinimumAmount = 0;
    $scope.CategoryId = 0;
    $scope.CityId = 1;
    $scope.message = "";
    $scope.isMessage = false;
    $scope.EmployeeCode = "";
    $scope.GroupName = "";
    $scope.Customer = 0;
    $scope.Usable = 0;
    $scope.IsMinimumPrice = false;
    $scope.Model = [];
    $scope.CategoryIds = [];
    $scope.selectedCategoryIds = [];
    $scope.ServicesIds = [];
    $scope.selectedServicesIds = [];
    $scope.cities = [];
    $scope.cityId = [];
    $scope.groupNameId = "";
    $scope.groupName = [];
    $scope.Spinner = false;
    $scope.isEdit = false;
    $scope.text = "Select";
    $scope.text1 = "Select";
    $scope.text2 = "Select";
    $scope.MasterCities = [];
    $scope.offer = false;
    $scope.DiscStatusId = true;
    $scope.DiscountStartDate = "";
    $scope.DiscountEndDate = "";
    $scope.PaymentModeList = [];
    $scope.PaymentModeIds = [];
    $scope.text3 = "";
    $scope.customerTypeId = "";
    $scope.customerTypeArray = [];
    $scope.applicationTypeId = "";
    $scope.applicationTypeArray = [];
    $scope.discountCustomerType = "";
    $scope.discountApplicationType = "";
    $scope.currentPage = 1;

    $scope.VIEW = false;
    $scope.EDIT = false;
    $scope.CREATE = false;
    $scope.DELETE = false;

    $scope.GetRoles = function () {

        commonService.CheckPermissionData();
        if (authService.GetCredentials().role == 1) {
            $scope.VIEW = app.admin.Discount.View;
            $scope.EDIT = app.admin.Discount.Edit;
            $scope.CREATE = app.admin.Discount.Create;
            $scope.DELETE = app.admin.Discount.Delete;
        } else if (authService.GetCredentials().role == 2) {
            $scope.VIEW = app.executive.Discount.View;
            $scope.EDIT = app.executive.Discount.Edit;
            $scope.CREATE = app.executive.Discount.Create;
            $scope.DELETE = app.executive.Discount.Delete;
        }
    };

    $scope.isShown = function (val) {
        return val === $scope.val;
    };

    //$scope.beforeRender = function ($view, $dates, $leftDate, $upDate, $rightDate) {
    //    
    //    var currentDate = new Date();
    //    for (var i = 0; i < $dates.length; i++) {
    //        var utcDate = new Date($dates[i].utcDateValue);
    //        if (utcDate.getFullYear() >= currentDate.getFullYear() && utcDate.getMonth() >= currentDate.getMonth() )
    //        {
    //            if (utcDate.getMonth() > currentDate.getMonth())
    //                $dates[i].selectable = false;
    //            else if(utcDate.getMonth() >= currentDate.getMonth() && utcDate.getDate() > currentDate.getDate())
    //                $dates[i].selectable = false;
    //        }

    //    }

    //}

    $scope.InitDiscount = function () {
        $scope.CategoryIds = commonService.GetServiceCategory();
        $scope.cities = commonService.GetMasterCities();
        $scope.DiscApplicabilityType = commonService.GetDiscountApplicabilityType();
        $scope.Disctype = commonService.GetDiscountType();
        $scope.MasterCities = commonService.GetMasterCities();
        $scope.PaymentModeList = commonService.GetPaymentModeType();
        $scope.customerTypeArray = commonService.GetDiscountCustomerType();
        $scope.applicationTypeArray = commonService.GetDiscountApplicationType();
    };

    $scope.$watch('selectedCategoryIds', function (id) {

        if ($scope.selectedCategoryIds.length == 0) {
            $scope.ServicesIds = [];
        }
        else {
            var myDataPromise = discountService.GetServiceByCategoryAndCityId(1, $scope.selectedCategoryIds);
            myDataPromise.then(function (result) {
                $scope.ServicesIds = [];
                if (result.data.result_set != null) {
                    for (var i = 0; i < result.data.result_set.length; i++) {
                        var cat = {
                            "id": result.data.result_set[i].serviceId,
                            "name": result.data.result_set[i].serviceName
                        }
                        $scope.ServicesIds.push(cat);
                    }
                }
            });

        }

    }, true);

    $scope.$watch('cityId', function (id) {
        //var myDataPromise = discountService.GetDiscountDetail(id);
        //myDataPromise.then(function (result) {
        //    result.data.result_set;
        //});
    }, true);

    $scope.GetGroupList = function () {
        var myDataPromise = discountService.GetGroupName();
        myDataPromise.then(function (result) {
            $scope.groupName = [];
            for (var i = 0; i < result.data.result_set.length; i++) {
                var group = {
                    id: result.data.result_set[i].id,
                    name: result.data.result_set[i].groupName
                }
                $scope.groupName.push(group);
            }
        });
    };
    $scope.GetDiscount = function (page) {

        $scope.GetRoles();
        $scope.Spinner = true;
        var myDataPromise = discountService.GetDiscountDetail(page);//

        myDataPromise.then(function (result) {
            $scope.Model = result.data.result_set;
            $scope.BindGrid($scope.Model);
            //if($scope.Model.length<10)
            //    $scope.currentPage = 0;
        });
        $scope.InitDiscount();
        $scope.GetGroupList();
    };

    $scope.BindGrid = function (model) {
        if ($scope.VIEW) {
            // prepare the data
            if (model == null)
                return;
            var data = new Array();
            for (var i = 0; i < model.length ; i++) {

                var row = {};
                row["discCode"] = model[i].discCode;
                row["description"] = model[i].Disctype.description;
                row["discValue"] = model[i].discValue;
                row["discStatus"] = model[i].DiscStatus.shortDescription;
                row["expiryDate"] = (new Date(model[i].expiryDate).getDate()) + "/" + (new Date(model[i].expiryDate).getMonth() + 1) + "/" + new Date(model[i].expiryDate).getUTCFullYear();
                row["id"] = model[i].id;
                row["description1"] = model[i].description;
                //$scope.MasterCities.length;
                var cityName = "";
                for (var j = 0; j < model[i].cityMappingDTO.length; j++) {
                    var citylength = model[i].cityMappingDTO.length;
                    for (k = 0; k < $scope.MasterCities.length; k++) {
                        if (model[i].cityMappingDTO[j].applicableCityID == $scope.MasterCities[k].id) {
                            if ((citylength - 1) == (k))
                                cityName += $scope.MasterCities[k].name;
                            else
                                cityName += $scope.MasterCities[k].name + ",";
                        }
                    }
                }
                row["cityName"] = cityName;
                data[i] = row;
            }
            var source =
            {
                localdata: data,
                datatype: "array"
            };
            var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties) {
                var str = "";
                if ($scope.EDIT) {
                    str += '<a onclick="ShowUpdateModel(' + value + ')"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></a>';
                }
                if ($scope.DELETE) {
                    str += '<a onclick="DeleteDiscount(' + value + ')"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>';
                }
                return str;
            };
            var dataAdapter = new $.jqx.dataAdapter(source, {
                loadComplete: function (data) {
                    $scope.Spinner = false;

                },
                loadError: function (xhr, status, error) { }
            });
            var pagerrenderer = function () {
                var element = $("<div style='margin-top: 5px; width: 100%; height: 100%;'></div>");
                var paginginfo = $("#jqxgrid").jqxGrid('getpaginginformation');
                for (i = 0; i < paginginfo.pagescount; i++) {
                    // add anchor tag with the page number for each page.
                    var anchor = $("<a style='padding: 5px;' href='#" + i + "'>" + i + "</a>");
                    anchor.appendTo(element);
                    anchor.click(function (event) {
                        // go to a page.
                        var pagenum = parseInt($(event.target).text());
                        $("#jqxgrid").jqxGrid('gotopage', pagenum);
                    });
                }
                return element;
            }

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
                pagesizeoptions: ['10'],
                pagesize: 10,
                //pagerrenderer: pagerrenderer,
                ready: function () {
                    //$("#jqxgrid").jqxGrid('sortby', 'expiryDate', 'desc');
                },
                rendered: function () {
                    //$("#jqxgrid").jqxGrid('sortby', 'expiryDate', 'desc');
                },
                columns: [
                    { text: 'Discount Code', datafield: 'discCode', width: '15%' },
                    { text: 'Discount City', datafield: 'cityName', filterable: false, width: '15%' },
                    { text: 'Discount Type', datafield: 'description', filterable: false, width: '15%' },
                    { text: 'Discount Amount', datafield: 'discValue', filterable: false, width: '15%' },
                    { text: 'Discount Description', datafield: 'description1', filterable: false, width: '15%' },
                    { text: 'Discount Expiry', datafield: 'expiryDate', filterable: false, width: '15%' },
                    { text: 'Manage', datafield: 'id', filterable: false, cellsrenderer: cellsrenderer, width: '10%' }
                ]
            });
            //$("#jqxgrid").bind("pagechanged", function (event) {
            //    debugger;
            //    var args = event.args;
            //    var pagenumber = args.pagenum;
            //    var pagesize = args.pagesize;
            //    var v = $scope.currentPage;
            //});

            //$(".jqx-icon-arrow-left").click(function () {
            //    debugger;
            //    $scope.currentPage -= 1;
            //    if ($scope.currentPage < 0)
            //        $scope.currentPage = 1;
            //    $scope.GetDiscount($scope.currentPage);
            //});
            //$(".jqx-icon-arrow-right").click(function () {
            //    $scope.currentPage += 1;
            //    $scope.GetDiscount($scope.currentPage);
            //});

            //$(".jqx-rc-all").change(function () {
            //    $scope.currentPage = Number($(this).val());
            //    $scope.GetDiscount($scope.currentPage);
            //})
        }
    };



    $scope.ShowModel = function () {
        ClearFom();
        $scope.title = "Create Discount";
        $("#dvAddDiscount").modal("show");
    };

    $scope.CreateDiscount = function () {

        $scope.Spinner = true;
        var model = $scope.GetModel();
        var myDataPromise = discountService.AddDiscount(model);
        myDataPromise.then(function (result) {
            if (result.data.result_set != null) {
                $scope.message = "discount created successfully";
                HideMessage();
                $('#dvAddDiscount').modal('hide');
                $scope.GetDiscount($scope.currentPage);
                ClearFom();
            }
            else {
                $scope.message = "An error while creating discount";
                HideMessage();
                $('#dvAddDiscount').modal('hide');
            }

        });
    };

    $scope.UpdateDiscount = function () {

        var model = $scope.GetModel();
        var myDataPromise = discountService.AddDiscount(model);
        myDataPromise.then(function (result) {
            if (result.data.result_set != null) {
                $scope.message = "Discount updated successfully";
                HideMessage();
                $('#dvAddDiscount').modal('hide');
                $scope.GetDiscount($scope.currentPage);
                ClearFom();
            }
            else {
                $scope.message = "An error while updating discount";
                HideMessage();
                $('#dvAddDiscount').modal('hide');
            }
        });
    };

    $scope.ShowUpdateModel = function (id) {

        ClearFom();
        $scope.title = "Update Discount";
        $scope.id = id;
        $scope.isEdit = true;
        $scope.GetDiscountById(id);
        $("#dvAddDiscount").modal("show");
    };



    $scope.GetDiscountById = function (id) {
        var myDataPromise = discountService.GetDiscountById(id);
        myDataPromise.then(function (result) {
            $scope.Model = result.data.result_set;
            $scope.BindModel($scope.Model);
        });
    }

    $scope.BindModel = function (response) {

        $scope.id = response.id;
        $scope.DiscTypeId = String(response.Disctype.id);
        $scope.Description = response.description;//response.Disctype.description;
        $scope.DiscApplicabilityTypeId = String(response.DiscApplicabilityType.id);
        //$scope.groupNameId = "";
        $scope.discValue = response.discValue;
        $scope.ExpiryDate = new Date(response.expiryDate);
        if (response.MinimumAmount > 0) {
            $scope.MinimumAmount = response.MinimumAmount;
            $scope.IsMinimumPrice = response.IsMinimumPrice;
        }
        $scope.CategoryId = response.CategoryId;
        $scope.CityId = response.CityId;
        $scope.voucherCount = response.voucherCount;
        $scope.voucherPrefix = response.voucherPrefix;
        $scope.discCode = response.discCode;
        $scope.Usable = response.discountUsageType.id;
        $scope.Customer = response.discValidOn.id;
        $scope.MinimumAmount = response.mmPriceRqrd;
        $scope.offer = response.isOffer == 1 ? true : false;
        if (response.mmPriceRqrd != undefined || response.mmPriceRqrd > 0) {
            $scope.IsMinimumPrice = true;//response.mmPriceRqrd;
        }
        $scope.groupNameId = response.associatedUsersId;
        //
        $scope.text = "";
        for (var i = 0; i < response.cityMappingDTO.length; i++) {

            $scope.cityId.push(response.cityMappingDTO[i].applicableCityID);
            for (var j = 0; j < $scope.cities.length; j++) {
                if ($scope.cities[j].id == response.cityMappingDTO[i].applicableCityID)
                    $scope.text += $scope.cities[j].name + ",";
            }
        }
        if ($scope.text.length > 25) {
            $scope.text = $scope.text.substr(0, 20);
            $scope.text += "...";
        }
        //for (var i = 0; i < response.selectedCategoryIds.length; i++) {
        //    $scope.cityId.push(response.selectedCategoryIds[i].applicableCityID);
        //}
        $scope.text2 = "";
        for (var i = 0; i < response.prodcuctServiceDTO.length; i++) {
            $scope.selectedServicesIds.push(response.prodcuctServiceDTO[i].serviceId);
            $scope.text2 += response.prodcuctServiceDTO[i].serviceName + ",";
        }
        if ($scope.text2.length > 25) {
            $scope.text2 = $scope.text2.substr(0, 20);
            $scope.text2 += "...";
        }

        var categories = response.categories;
        if (categories != null && categories != undefined && categories != "") {
            var categoryList = categories.split(',');
            $scope.selectedCategoryIds = [];
            $scope.text1 = "";
            for (var i = 0; i < categoryList.length; i++) {
                $scope.selectedCategoryIds.push(categoryList[i].split('=')[0]);
                $scope.text1 += categoryList[i].split('=')[1] + ",";
            }
            if ($scope.text1.length > 25) {
                $scope.text1 = $scope.text1.substr(0, 20);
                $scope.text1 += "...";
            }
        }

        $scope.DiscStatusId = response.DiscStatus.id == 1 ? true : false;

        $scope.DiscountStartDate = new Date(response.appliedStartTime);
        $scope.DiscountEndDate = new Date(response.appliedEndTime);

        $scope.PaymentModeIds = response.discPaymentMap.split(',');
        if ($scope.PaymentModeIds.length > 0)
            $scope.text3 = "";
        else
            $scope.text3 = "Select";
        for (var i = 0; i < $scope.PaymentModeList.length; i++) {
            if (jQuery.inArray($scope.PaymentModeList[i].id.toString(), $scope.PaymentModeIds) >= 0)
                $scope.text3 += $scope.PaymentModeList[i].name + ",";
        }
        if ($scope.text3.length > 25) {
            $scope.text3 = $scope.text3.substr(0, 20);
            $scope.text3 += "...";
        }

        for (var i = 0; i < response.DiscApplicabilityGroupItems.length; i++) {
            if (response.DiscApplicabilityGroupItems[i].groupId == 1)
                $scope.customerTypeId = String(response.DiscApplicabilityGroupItems[i].id);
            else if (response.DiscApplicabilityGroupItems[i].groupId == 2)
                $scope.applicationTypeId = String(response.DiscApplicabilityGroupItems[i].id);
        }

    };

    $scope.DeleteDiscount = function (id) {

        var myDataPromise = discountService.DeleteDiscountById(id);
        myDataPromise.then(function (result) {
            $scope.message = "Data deleted successfully";
            HideMessage();
            $scope.GetDiscount($scope.currentPage);
        });
    };

    $scope.DiscountChange = function () {
        var val = $scope.DiscTypeId;
    }

    $scope.GetModel = function () {
        var paymentMode = "";
        for (var i = 0; i < $scope.PaymentModeIds.length; i++) {
            if ($scope.PaymentModeIds[i] != "" && i + 1 != $scope.PaymentModeIds.length)
                paymentMode += $scope.PaymentModeIds[i] + ",";
            else if ($scope.PaymentModeIds[i] != "" && i + 1 == $scope.PaymentModeIds.length) {
                paymentMode += $scope.PaymentModeIds[i];
            }
        }

        if ($scope.DiscTypeId == 1)
            $scope.offer = false;
        var city = [];
        for (var i = 0; i < $scope.cityId.length; i++) {
            var cityMapping =
            {
                id: 0,
                applicableCityID: 0
            };
            cityMapping.id = 0;
            cityMapping.applicableCityID = $scope.cityId[i];
            city.push(cityMapping);
        }

        var prodcuctServiceArray = [];
        for (var i = 0; i < $scope.selectedServicesIds.length; i++) {
            var services = {
                servicePrice: 0,
                serviceTime: 0,
                categoryName: "",
                serviceId: $scope.selectedServicesIds[i],
                serviceDescription: "",
                serviceName: "",
                productCityMappingId: 0,
                categoryId: 0
            }
            prodcuctServiceArray.push(services);
        }

        $scope.IsMinimumPrice == false ? $scope.MinimumAmount = 0 : "";
        $scope.Usable = $scope.Usable == 0 ? 1 : $scope.Usable;
        $scope.Customer = $scope.Customer == 0 ? 1 : $scope.Customer;
        var model = {
            id: $scope.id,
            maxDiscValue: 0,
            voucherPrefix: $scope.voucherPrefix,
            voucherCount: $scope.voucherCount,
            discValue: $scope.discValue,
            discCode: $scope.discCode,
            expiryDate: Date.parse($scope.DiscountEndDate), //Date.parse($scope.ExpiryDate), //"",//$scope.ExpiryDate,
            validForID: 0,
            DiscApplicabilityType: {
                id: $scope.DiscApplicabilityTypeId,
                shortDescription: "",
                description: ""
            },
            DiscStatus: {
                id: $scope.DiscStatusId == true ? 1 : 2,
                shortDescription: "",
                description: ""
            },
            Disctype: {
                id: $scope.DiscTypeId,
                longDescription: "",
                description: ""
            },
            cityMappingDTO: city,
            discValidOn: {
                id: $scope.Customer,
                longDescription: "",
                description: ""
            },
            discountUsageType: {
                id: $scope.DiscTypeId == "1" ? "1" : $scope.Usable,
                longDescription: "",
                description: ""
            },
            prodcuctServiceDTO: prodcuctServiceArray,
            mmPeriodRqrd: 0,
            vouchersList: [
              ""
            ],
            mmPriceRqrd: $scope.MinimumAmount,
            associatedUsersId: $scope.groupNameId,
            isOffer: $scope.offer == true ? 1 : 0,
            description: $scope.Description,
            discPaymentMap: paymentMode,
            appliedStartTime: Date.parse($scope.DiscountStartDate),
            appliedEndTime: Date.parse($scope.DiscountEndDate),
            discAppGroupItems: $scope.customerTypeId + "," + $scope.applicationTypeId
        }
        return model;
    }

    function HideMessage() {
        $timeout(function () { $scope.message = ""; }, 3000);
    }

    function ClearFom() {

        $scope.id = 0;
        $scope.DiscTypeId = "";
        $scope.DiscApplicabilityTypeId = "";
        $scope.Description = "";
        $scope.DiscountAmount = 0;
        $scope.ExpiryDate = "";
        $scope.MinimumAmount = 0;
        $scope.CategoryId = "";
        $scope.CityId = "";
        $scope.voucherCount = 0;
        $scope.voucherPrefix = "";
        $scope.cityId = [];
        $scope.selectedCategoryIds = [];
        $scope.selectedCategoryIds1 = [];
        $scope.selectedServicesIds = [];
        $scope.discCode = "";
        $scope.discValue = 0;
        $scope.IsMinimumPrice = false;
        $scope.isEdit = false;
        $(".open").each(function () {
            $(this).removeClass("open");
        });
        $scope.text = "Select";
        $scope.text1 = "Select";
        $scope.text2 = "Select";
        $scope.offer = false;
        $scope.DiscountStartDate = "";
        $scope.DiscountEndDate = "";
        $scope.PaymentModeIds = [];
        $scope.text3 = "Select";
        $scope.customerTypeId = "";
        $scope.applicationTypeId = "";
    }
}

function ShowModel() {
    var scope = angular.element($("#dvDiscount")).scope();
    scope.ShowModel();
    scope.$apply();
}

function ShowUpdateModel(id) {
    var scope = angular.element($("#dvDiscount")).scope();
    scope.ShowUpdateModel(id);
    scope.$apply();
}

function DeleteDiscount(id) {
    var scope = angular.element($("#dvDiscount")).scope();
    if (confirm("Are you sure you want to delete ?"))
        scope.DeleteDiscount(id);
    scope.$apply();
}

