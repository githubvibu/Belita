app.factory('discountService', discountService);
app.$inject = ['$http', '$rootScope', '$location', 'app'];

function discountService($http, $rootScope, $location, app) {

    var apiUrl = app.serviceBaseURL + "discount/list";
    var apiUrlAdd = app.serviceBaseURL + "discount/create";
    var apiUrlUpdate = app.serviceBaseURL + "discount/detail";
    var apiUrlService = app.serviceBaseURL + "product/list/cityandcategoryid";
    var apiUrlDelete = app.serviceBaseURL + "discount/delete";
    var apiUrlGetServices = app.serviceBaseURL + "product/list/by/cityandcategoryid";
    var apiUrlGetGroups = app.serviceBaseURL + "group/details";

    var services = {};
    services.GetDiscountDetail = GetDiscountDetail;
    services.AddDiscount = AddDiscount;
    services.GetDiscountById = GetDiscountById;
    services.DeleteDiscountById = DeleteDiscountById;
    services.GetServiceByCategoryAndCityId = GetServiceByCategoryAndCityId;
    services.GetGroupName = GetGroupName;
    return services;

    function GetDiscountDetail(index) {
        var pageIndex = "?pageNo=" + index;
        return $http.get(apiUrl + pageIndex)
        .success(function (response) {
            return response.result_set;
        });

    }

    function AddDiscount(model) {
        return $http.post(apiUrlAdd, JSON.stringify(model))
        .success(function (response) {
            return response;
        });
    }

    function GetDiscountById(id) {
        return $http.get(apiUrlUpdate + "?id=" + id)
        .success(function (response) {
            return response;
        });
    }
    function GetGroupName() {
        return $http.get(apiUrlGetGroups)
          .success(function (response) {
              return response.rs;
          });
    }

    function DeleteDiscountById(id) {
        return $http.get(apiUrlDelete + "?id=" + id)
        .success(function (response) {
            return response;
        });
    }

    function GetServiceByCategoryAndCityId(cityId, categoryId) {
        //categoryId = [1];
        return $http.get(apiUrlGetServices + "?cityId=" + cityId + "&productCategoryIds=" + categoryId + "&pageNo=&size=")
        .success(function (response) {
            return response;
        });
    }
}