app.factory('service', manageService);
app.$inject = ['$http', '$rootScope', '$location', 'app'];
function manageService($http, $rootScope, $location, app) {

    var appUrlGetList = app.serviceBaseURL + "/product/list/by/cityid";
    var appUrlSave = app.serviceBaseURL + "/product/add";
    var appUrlGetProductServiceCategory = app.serviceBaseURL + "product/list/general/by/categoryid";
    var appUrlSaveServiceCity = app.serviceBaseURL + "product/add/cityInfo";
    var appUrlServiceList = app.serviceBaseURL + "product/list/shortinfo";
    var appUrlServiceByServiceId = app.serviceBaseURL + "product/";
    var appUrlUpdateService = app.serviceBaseURL + "product/update";
    var appUrlUpdateCity = app.serviceBaseURL + "product/update/cityInfo";

    var appUrlServiceListByCategoryId = app.serviceBaseURL + "product/list/shortinfo/by/categoryid";
    //var apiUrlServiceDelete = app.serviceBaseURL + "product/delete/by/id";
    var apiUrlServiceDelete = app.serviceBaseURL + "product/delete/by/idAndcityId";

    var services = {};
    services.GetProductServiceList = GetProductServiceList;
    services.SaveProductServices = SaveProductServices;
    services.GetProductServiceCategory = GetProductServiceCategory;
    services.SaveServiceCity = SaveServiceCity;
    services.GetServiceList = GetServiceList;
    services.GetServiceByServiceId = GetServiceByServiceId;
    services.UpdateProductServices = UpdateProductServices;
    services.UpdateCity = UpdateCity;
    services.GetServiceListByCategoryId = GetServiceListByCategoryId;
    services.DeleteService = DeleteService;
    return services;

    function GetProductServiceList(cityId) {
        return $http.get(appUrlGetList + "?cityId=" + cityId + "&lastUpdatedOn=-1&isAppCall=0")
        .success(function (response) {
            return response.result_set;
        });
    }

    function SaveProductServices(model) {
        return $http.post(appUrlSave, JSON.stringify(model))
        .success(function (response) {
            return response.result_set;
        });
    }

    function SaveServiceCity(model) {
        return $http.post(appUrlSaveServiceCity, JSON.stringify(model))
        .success(function (response) {
            return response.result_set;
        });
    }

    function GetProductServiceCategory(productCategoryId) {
        return $http.get(appUrlGetProductServiceCategory + "?productCategoryId=" + productCategoryId)
        .success(function (response) {
            return response.result_set;
        });
    }

    function GetServiceList() {
        return $http.get(appUrlServiceList)
        .success(function (response) {
            return response.result_set;
        });
    }

    function GetServiceListByCategoryId(id) {

        return $http.get(appUrlServiceListByCategoryId + "?productCategoryId=" + id)
        .success(function (response) {
            return response.result_set;
        });
    }

    function GetServiceByServiceId(serviceId) {
        return $http.get(appUrlServiceByServiceId + "?serviceId=" + serviceId)
        .success(function (response) {
            return response.result_set;
        });
    }

    function UpdateProductServices(model) {
        return $http.post(appUrlUpdateService, JSON.stringify(model))
        .success(function (response) {
            return response.result_set;
        });
    }

    function UpdateCity(model) {
        return $http.post(appUrlUpdateCity, JSON.stringify(model))
        .success(function (response) {
            return response.result_set;
        });
    }

    function DeleteService(id)
    {
        return $http.post(apiUrlServiceDelete + "?prodid=" + id.serviceId + "&cityId=" + id.cityId)
        .success(function (response) {
            ShowServiceModel(id.serviceId);
            return response.result_set;
        });
    }
}