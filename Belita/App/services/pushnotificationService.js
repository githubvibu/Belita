app.factory('pushnotificationService', pushnotificationService);
app.$inject = ['$http', '$rootScope', '$location', 'app'];

function pushnotificationService($http, $rootScope, $location, app) {
    var appUrlSend = app.serviceBaseURL + "notification/sends";
    var apiUrlGetGroups = app.serviceBaseURL + "group/details";
    //var appUrlSendImage = app.serviceBaseURL + "/notification/sends";
    var service = {};
    service.SaveFile = SaveFile;
    service.GetGroupName = GetGroupName;
    return service;

    function SaveFile(msg, file, mobNo, groupId) {
        
        var fd = new FormData();
       
        fd.append('inputFile', file[0]);
        fd.append('msg', msg);
        fd.append('mobileNos', mobNo);
        fd.append('gId', groupId);
        
        return $http.post(appUrlSend, fd, {
            withCredentials: false,
            headers: {
                'Content-Type': undefined
            },
            transformRequest: angular.identity
        }).success(function (data) {
            // console.log(data);
            return data;
        })
         .error(function (data) {
             console.log(data);
         });
        //$http.post(appUrlSend, JSON.stringify(model) )
        
        //.success(function (response) {
        //    return response.result_set;
        //});
    }
    function GetGroupName() {
        return $http.get(apiUrlGetGroups)
          .success(function (response) {
              return response.rs;
          });
    }
   
}