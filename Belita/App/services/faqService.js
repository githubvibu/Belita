app.factory('faqService', faqService);
app.$inject = ['$http', '$rootScope', '$location', 'app'];

function faqService($http, $rootScope, $location, app) {
   
    var apiUrlAdd = app.serviceBaseURL + "faq/create";
    var apiUrlUpdate = app.serviceBaseURL + "faq/update";
    var apiUrlDelete = app.serviceBaseURL + "faq/delete";
    var apiUrlGetFaq = app.serviceBaseURL + "faq/list";
   
    var services = {};
    services.AddFaq = AddFaq;
    services.DeleteFaqById = DeleteFaqById;
    services.GetFaqList = GetFaqList;
    return services;

    $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

    function AddFaq(model) {
        
        if (model.id == 0) {
            return $http.post(apiUrlAdd, JSON.stringify(model))
        .success(function (response) {
            return response.result_set;
        });
        }
        else {
            return $http.post(apiUrlUpdate, JSON.stringify(model))
        .success(function (response) {
            return response;
        });
        }
    }

    function GetFaqList() {
        return $http.get(apiUrlGetFaq)
        .success(function (response) {
            return response;
        });
    }

    function DeleteFaqById(id) {
        return $http.get(apiUrlDelete + "?id=" + id)
        .success(function (response) {
            return response;
        });
    }  
}