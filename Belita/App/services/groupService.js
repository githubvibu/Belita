app.factory('groupService', groupService);
app.$inject = ['$http', '$rootScope', '$location', 'app'];

function groupService($http, $rootScope, $location, app) {
    var apiUrlDetail = app.serviceBaseURL + "group/details";
    var apiUrlAdd = app.serviceBaseURL + "group/add";
    var apiUrlDelete = app.serviceBaseURL + "group/delete";
    var apiUrlGroupDetails = app.serviceBaseURL + "group/groupid";
    
    var services = {};
    services.GetGroupList = GetGroupList;
    services.AddGroup = AddGroup;
    services.DeleteGroupById = DeleteGroupById;
    services.GetGroupDetails = GetGroupDetails;
    return services;

    function GetGroupList() {
        return $http.get(apiUrlDetail)
        .success(function (response) {
            return response.rs;
        });
    }

    function GetGroupDetails(id) {
        
        return $http.get(apiUrlGroupDetails + "?gId=" + id)
        .success(function (response) {
            return response.rs;
        });
    }

    function AddGroup(model) {
        
        var fd = new FormData();
        fd.append("inputFile", model.File);
        fd.append("gn", model.GroupName);
        fd.append("gd", model.Description);
        fd.append("gt", model.GroupType);

        return $http.post(apiUrlAdd, fd, {
            withCredentials: false,
            headers: {
                'Content-Type': undefined
            },
            transformRequest: angular.identity
        }).success(function (data) {
            console.log(data);
        })
         .error(function (data) {
             console.log(data);
         });
    }

    function DeleteGroupById(id) {
        
        return $http.get(apiUrlDelete + "?gId=" + id)
        .success(function (response) {
            responsedata = response;
        });
    }
}