
app.factory('authService', auth);
app.factory('Base64', Base64);
app.$inject = ['$http', '$rootScope', '$location', 'Base64', 'ngCookies', 'app'];

function auth($http, $rootScope, $location, Base64, $cookieStore, app) {
    var apiUrl = app.serviceBaseURL + "cro/login";
    var apiUrlMaster = app.serviceBaseURL + "masterdata/list";
    var apiUrlLogout = app.serviceBaseURL + "cro/logout";

    var service = {};
    service.Login = Login;
    service.SetCredentials = SetCredentials;
    service.ClearCredentials = ClearCredentials;
    service.GetCredentials = GetCredentials;
    service.Logout = Logout;
    service.IsAuthenticated = IsAuthenticated;
    service.GetMasterData = GetMasterData;
    service.GetPermissionData = GetPermissionData;
    return service;

    function Logout() {
        ClearCredentials();
    }

    function Login(username, password, callback) {

        var queryString = "?username=" + username + "&password=" + password;
        $http.post(apiUrl + queryString)
        .success(function (response, status, headers, config) {

            callback(response);
            GetMasterData();
            GetPermissionData();

        });
    }

    function SetCredentials(username, password, authorized, role, authenticated, id) {

        var authdata = Base64.encode(username + ':' + password);

        $rootScope.globals = {
            currentUser: {
                username: username,
                authdata: authdata,
                isAuthorized: authorized,
                role: role,
                isAuthenticated: authenticated,
                id: id
            }
        };

        $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;
        $cookieStore.put('globals', $rootScope.globals);
    }

    function ClearCredentials() {
        $rootScope.globals = {};
        $cookieStore.remove('globals');
        $http.defaults.headers.common.Authorization = 'Basic ';
    }

    function GetCredentials() {
        $rootScope.globals = $cookieStore.get('globals') || {};
        return $rootScope.globals.currentUser;
    }

    function IsAuthenticated() {
        $rootScope.globals = $cookieStore.get('globals') || {};
        return $rootScope.globals.currentUser == undefined ? false : $rootScope.globals.currentUser.isAuthenticated;
    }

    function GetMasterData() {
        //$http.get(apiUrlMaster + "?lastUpdatedOn=-1")
        //.success(function (response, status, headers, config) {
        //    app.master = response.result_set;
        //});
        $.ajax({
            url: apiUrlMaster + "?lastUpdatedOn=-1",
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            async: false,
            statusCode: {
                200: function (data) {
                    app.master = data.result_set;
                }
            }
        });
    }

    function GetPermissionData() {
        app.executive = {
            CroUser: {
                View: false,
                Edit: false,
                Create: false,
                Delete: false
            },
            Appointment: {
                View: true,
                Edit: true,
                Create: true,
                Delete: false
            },

            Stylist: {
                View: true,
                Edit: false,
                Create: false,
                Delete: false
            },

            Discount: {
                View: true,
                Edit: false,
                Create: false,
                Delete: false
            },

            Services: {
                View: true,
                Edit: false,
                Create: false,
                Delete: false
            },

            Location: {
                View: true,
                Edit: false,
                Create: false,
                Delete: false
            },

            BM: {
                View: true,
                Edit: false,
                Create: false,
                Delete: false
            },

            TimeSlots: {
                View: true,
                Edit: false,
                Create: false,
                Delete: false
            },

            Edit: {
                RegisterSettings: false,
                ReffererSettings: false
            },
            PettyCash: {
                View: true
            },
            Notification: {
                View: false
            },
        };
        app.admin =
            {
                CroUser: {
                    View: true,
                    Edit: true,
                    Create: true,
                    Delete: true
                },
                Appointment: {
                    View: true,
                    Edit: true,
                    Create: true,
                    Delete: false
                },

                Stylist: {
                    View: true,
                    Edit: true,
                    Create: true,
                    Delete: true
                },

                Discount: {
                    View: true,
                    Edit: true,
                    Create: true,
                    Delete: true
                },

                Services: {
                    View: true,
                    Edit: true,
                    Create: true,
                    Delete: true
                },

                Location: {
                    View: true,
                    Edit: true,
                    Create: true,
                    Delete: true
                },

                BM: {
                    View: true,
                    Edit: true,
                    Create: true,
                    Delete: true
                },

                TimeSlots: {
                    View: true,
                    Edit: true,
                    Create: true,
                    Delete: true
                },

                Edit: {
                    RegisterSettings: true,
                    ReffererSettings: true
                },
                PettyCash: {
                    View: true
                },
                Notification: {
                    View: true
                },

            }
    }
}

function Base64() {
    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };
}