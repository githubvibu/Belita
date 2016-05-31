app.factory('commonService', common);
app.$inject = ['$scope', '$routeParams', '$location', 'app', 'authService'];

function common($http, $rootScope, $location, app, authService) {

    var service = {};
    service.GetMasterCities = GetMasterCities;
    service.GetServiceCategory = GetServiceCategory;
    service.GetDiscountApplicabilityType = GetDiscountApplicabilityType;
    service.GetDiscountType = GetDiscountType;
    service.GetBaseServiceCenter = GetBaseServiceCenter;
    service.CheckMasterData = CheckMasterData;
    service.GetProductServiceType = GetProductServiceType;
    service.GetStylistModelType = GetStylistModelType;
    service.GetAppointmentStatusType = GetAppointmentStatusType;
    service.GetStylistWorkStatus = GetStylistWorkStatus;
    service.GetBaseServiceCenterNonCity = GetBaseServiceCenterNonCity;
    service.GetPaymentStatus = GetPaymentStatus;
    service.CheckPermissionData = CheckPermissionData;
    service.GetExpenseCategory = GetExpenseCategory;
    service.GetSourceType = GetSourceType;
    service.GetPaymentModeType = GetPaymentModeType;
    service.GetAddressType = GetAddressType;
    service.GetDiscountCustomerType = GetDiscountCustomerType;
    service.GetDiscountApplicationType = GetDiscountApplicationType;
    return service;

    function CheckMasterData() {

        if (app.master == null || app.master == undefined) {
            authService.GetMasterData();
        }
    }

    function CheckPermissionData() {

        if (app.admin == null || app.admin == undefined) {
            authService.GetPermissionData();
        }
    }

    function GetMasterCities() {
        CheckMasterData();
        var cities = [];
        if (app.master != null && app.master != undefined && app.master.ServiceCity.length > 0) {
            for (var i = 0; i < app.master.ServiceCity.length; i++) {
                var cit = {
                    "id": app.master.ServiceCity[i].id,
                    "name": app.master.ServiceCity[i].cityName
                };
                cities.push(cit);
            }
        }
        return cities;
    }

    function GetServiceCategory() {
        CheckMasterData();
        var CategoryIds = [];
        if (app.master != null && app.master != undefined && app.master.ServiceCategory.length > 0) {
            for (var i = 0; i < app.master.ServiceCategory.length; i++) {
                var cat = {
                    "id": app.master.ServiceCategory[i].id,
                    "name": app.master.ServiceCategory[i].categoryName
                };
                CategoryIds.push(cat);
            }
        }
        return CategoryIds;
    }

    function GetDiscountApplicabilityType() {
        CheckMasterData();
        var DiscApplicabilityType = [];
        if (app.master != null && app.master != undefined && app.master.DiscountApplicabilityType.length > 0) {
            for (var i = 0; i < app.master.DiscountApplicabilityType.length; i++) {
                var discountApType = {
                    "id": app.master.DiscountApplicabilityType[i].id,
                    "name": app.master.DiscountApplicabilityType[i].shortDescription
                };
                DiscApplicabilityType.push(discountApType);
            }
        }
        return DiscApplicabilityType;
    }

    function GetDiscountType() {
        CheckMasterData();
        var Disctype = [];
        if (app.master != null && app.master != undefined && app.master.DiscountType.length > 0) {
            for (var i = 0; i < app.master.DiscountType.length; i++) {
                var discountType = {
                    "id": app.master.DiscountType[i].id,
                    "name": app.master.DiscountType[i].description
                };
                Disctype.push(discountType);
            }
        }
        return Disctype;
    }

    function GetBaseServiceCenter(cityId) {
        CheckMasterData();
        var baseCenter = [];
        if (app.master != null && app.master != undefined && app.master.BaseServiceCenter.length > 0) {
            for (var i = 0; i < app.master.BaseServiceCenter.length; i++) {
                if (app.master.BaseServiceCenter[i].serviceCityID == cityId) {
                    var baseServiceCenter = {
                        "id": app.master.BaseServiceCenter[i].id,
                        "name": app.master.BaseServiceCenter[i].name
                    };
                    baseCenter.push(baseServiceCenter);
                }
            }
        }
        return baseCenter;
    }

    function GetBaseServiceCenterNonCity() {
        CheckMasterData();
        var baseCenter = [];
        if (app.master != null && app.master != undefined && app.master.BaseServiceCenter.length > 0) {
            for (var i = 0; i < app.master.BaseServiceCenter.length; i++) {
                var baseServiceCenter = {
                    "id": app.master.BaseServiceCenter[i].id,
                    "name": app.master.BaseServiceCenter[i].name
                };
                baseCenter.push(baseServiceCenter);
            }
        }
        return baseCenter;
    }

    function GetProductServiceType() {
        CheckMasterData();
        var productServiceTypes = [];
        if (app.master != null && app.master != undefined && app.master.ProductServiceType.length > 0) {
            for (var i = 0; i < app.master.ProductServiceType.length; i++) {
                var productServiceType = {
                    "id": app.master.ProductServiceType[i].id,
                    "name": app.master.ProductServiceType[i].description
                };
                productServiceTypes.push(productServiceType);
            }
        }
        return productServiceTypes;
    }

    function GetStylistModelType() {
        CheckMasterData();
        var modelType = [];
        if (app.master != null && app.master != undefined && app.master.StylistModelType.length > 0) {
            for (var i = 0; i < app.master.StylistModelType.length; i++) {
                var mod = {
                    "id": app.master.StylistModelType[i].id,
                    "name": app.master.StylistModelType[i].description
                };
                modelType.push(mod);
            }
        }
        return modelType;
    }

    function GetAppointmentStatusType() {
        CheckMasterData();
        var appointStatusType = [];
        if (app.master != null && app.master != undefined && app.master.AppointmentStatusType.length > 0) {
            for (var i = 0; i < app.master.AppointmentStatusType.length; i++) {
                var mod = {
                    "id": app.master.AppointmentStatusType[i].id,
                    "name": app.master.AppointmentStatusType[i].description
                };
                appointStatusType.push(mod);
            }
        }
        return appointStatusType;
    }

    function GetStylistWorkStatus() {
        CheckMasterData();
        var stylishWorkStatus = [];
        if (app.master != null && app.master != undefined && app.master.StylistWorkStatus.length > 0) {
            for (var i = 0; i < app.master.StylistWorkStatus.length; i++) {
                var mod = {
                    "id": app.master.StylistWorkStatus[i].id,
                    "name": app.master.StylistWorkStatus[i].description
                };
                stylishWorkStatus.push(mod);
            }
        }
        return stylishWorkStatus;
    }

    function GetPaymentStatus() {
        CheckMasterData();
        var paymentStatus = [];
        if (app.master != null && app.master != undefined && app.master.PaymentStatusType.length > 0) {
            for (var i = 0; i < app.master.PaymentStatusType.length; i++) {
                var mod = {
                    "id": app.master.PaymentStatusType[i].id,
                    "name": app.master.PaymentStatusType[i].description
                };
                paymentStatus.push(mod);
            }
        }
        return paymentStatus;
    }

    function GetExpenseCategory() {
        CheckMasterData();
        var expenseCategory = [];
        if (app.master != null && app.master != undefined && app.master.ExpenseCategory.length > 0) {
            for (var i = 0; i < app.master.ExpenseCategory.length; i++) {
                var mod = {
                    "id": app.master.ExpenseCategory[i].id,
                    "name": app.master.ExpenseCategory[i].description
                };
                expenseCategory.push(mod);
            }
        }
        return expenseCategory;
    }

    function GetSourceType() {
        CheckMasterData();
        var sourceType = [];
        if (app.master != null && app.master != undefined && app.master.SourceType.length > 0) {
            for (var i = 0; i < app.master.SourceType.length; i++) {
                var mod = {
                    "id": app.master.SourceType[i].id,
                    "name": app.master.SourceType[i].description
                };
                sourceType.push(mod);
            }
        }
        return sourceType;
    }

    function GetPaymentModeType() {
        CheckMasterData();
        var paymentModeType = [];
        if (app.master != null && app.master != undefined && app.master.PaymentModeType.length > 0) {
            for (var i = 0; i < app.master.PaymentModeType.length; i++) {
                var mod = {
                    "id": app.master.PaymentModeType[i].id,
                    "name": app.master.PaymentModeType[i].description
                };
                paymentModeType.push(mod);
            }
        }
        return paymentModeType;
    }

    function GetAddressType() {
        CheckMasterData();
        var addressType = [];
        if (app.master != null && app.master != undefined && app.master.AddressType.length > 0) {
            for (var i = 0; i < app.master.AddressType.length; i++) {
                var mod = {
                    "id": app.master.AddressType[i].id,
                    "name": app.master.AddressType[i].description
                };
                addressType.push(mod);
            }
        }
        return addressType;
    }

    function GetDiscountCustomerType() {
        CheckMasterData();
        var customerType = [];
        var items = [];
        if (app.master != null && app.master != undefined && app.master.DiscountApplicabilityGroupItems.length > 0) {
            for (var i = 0; i < app.master.DiscountApplicabilityGroupItems.length; i++) {
                if (app.master.DiscountApplicabilityGroupItems[i].groupId == 1) {
                    var item = {
                        "id": app.master.DiscountApplicabilityGroupItems[i].id,
                        "name": app.master.DiscountApplicabilityGroupItems[i].item
                    }
                    items.push(item);

                    var mod = {
                        "id": app.master.DiscountApplicabilityGroupItems[i].groupId,
                        "name": app.master.DiscountApplicabilityGroupItems[i].itemLabelText,
                        "items": items
                    };
                    customerType.push(mod);
                }
            }
        }
        return customerType = customerType[0];
    }

    function GetDiscountApplicationType() {
        CheckMasterData();
        var applicationType = [];
        var items = [];
        if (app.master != null && app.master != undefined && app.master.DiscountApplicabilityGroupItems.length > 0) {
            for (var i = 0; i < app.master.DiscountApplicabilityGroupItems.length; i++) {
                if (app.master.DiscountApplicabilityGroupItems[i].groupId == 2) {
                    var item = {
                        "id": app.master.DiscountApplicabilityGroupItems[i].id,
                        "name": app.master.DiscountApplicabilityGroupItems[i].item
                    }
                    items.push(item);

                    var mod = {
                        "id": app.master.DiscountApplicabilityGroupItems[i].groupId,
                        "name": app.master.DiscountApplicabilityGroupItems[i].itemLabelText,
                        "items": items
                    };
                    applicationType.push(mod);
                }
            }
        }
        return applicationType = applicationType[0];
    }

}