app.controller('faqController', faq);
app.$inject = ['$scope', 'ngCookies', '$location', 'faqService', 'commonService', '$timeout'];

function faq($scope, $cookieStore, $location, faqService, commonService, $timeout) {
    $scope.id = 0;
    $scope.faqQues = "";
    $scope.faqAns = "";
    $scope.title = "Add FAQ";
    $scope.Spinner = false;
    $scope.model = [];
    $scope.message = "";

    $scope.GetFaq = function () {
        
        $scope.Spinner = true;
        var myDataPromise = faqService.GetFaqList();
        myDataPromise.then(function (result) {
            $scope.Model = result.data.result_set;
            $scope.BindGrid($scope.Model);
        });
    };
   
    $scope.BindGrid = function (model) {

        var data = [];
        for (var i = 0; i < model.length ; i++) {
            var row = {};
            row["faqQues"] = model[i].faqQuestion;
            row["faqAns"] = model[i].faqAnswer;
            row["id"] = model[i].id;
            data[i] = row;
        }
        var source =
        {
            localdata: data,
            datatype: "array"
        };
        var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties) {
            return '<a onclick="ShowFaqUpdateModel(' + value + ')"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></a><a onclick="DeleteFaq(' + value + ')"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>'
        };
        var dataAdapter = new $.jqx.dataAdapter(source, {
            loadComplete: function (data) { $scope.Spinner = false; },
            loadError: function (xhr, status, error) { }
        });
        $("#jqxgrid").jqxGrid(
        {
            width: '99%',
            source: dataAdapter,
            pageable: true,
            sortable: true,
            enableToolTips: true,
            enablebrowserselection: true,
            columns: [
                { text: 'FAQ Questions', datafield: 'faqQues', width: '45%' },
                { text: 'FAQ Answers', datafield: 'faqAns', width: '45%' },
                { text: 'Manage', datafield: 'id', cellsrenderer: cellsrenderer, width: '10%' }
            ]
        });
    };
    $scope.CreateFaq = function () {
        ClearForm();
        $scope.Title = "Add FAQ";
        $("#dvAddFaq").modal("show");
    };

    $scope.ShowFaqModel = function () {
        ClearForm();
        $("#dvAddFaq").modal("show");
    };

    $scope.ShowFaqUpdateModel = function (id) {
        ClearForm();
        $scope.Title = "Edit FAQ";
        $scope.GetFaqDetail(id);
        $("#dvAddFaq").modal("show");
    };

    $scope.DeleteFaq = function (id) {
        
        var myDataPromise = faqService.DeleteFaqById(id);
        myDataPromise.then(function (result) {
            $scope.message = "FAQ deleted successfully";
            HideMessage();
            $scope.GetFaq();
        });
    };

    $scope.SaveFaq = function () {
        $scope.Spinner = true;
        var model = $scope.GetModel();
        var myDataPromise = faqService.AddFaq(model);
        myDataPromise.then(function (result) {
            if (result.data.result_set != null) {

                $scope.GetFaq();
                $("#dvAddFaq").modal("hide");
                $scope.message = "FAQ created successfully";
            }
            else {
                $scope.GetFaq();
                $("#dvAddFaq").modal("hide");
                $scope.message = "An error while creating FAQ";
            }
            HideMessage();
        });
    };
    $scope.GetFaqDetail = function (id) {
       
        
        var faqId = id;
        for (var i = 0; i < $scope.Model.length; i++) {
            if ($scope.Model[i].id == faqId) {
                $scope.id = id;
                $scope.faqQues = $scope.Model[i].faqQuestion;
                $scope.faqAns = $scope.Model[i].faqAnswer;
            }
        }
        $scope.$apply();
    }
    $scope.GetModel = function () {

        var model = {
            
            id: $scope.id,
        faqQuestion: $scope.faqQues,
        faqAnswer: $scope.faqAns,
        };
        return model;
    }
    function HideMessage() {
        $timeout(function () { $scope.message = ""; }, 3000);
    }
    function ClearForm() {
        $scope.id = 0;
        $scope.faqQues = "";
        $scope.faqAns = "";
    };
}
function ShowFaqModel() {
    var scope = angular.element($("#dvFaq")).scope();
    scope.ShowModel();
    scope.$apply();
}

function ShowFaqUpdateModel(id) {
    var scope = angular.element($("#dvFaq")).scope();
    scope.ShowFaqUpdateModel(id);
    scope.$apply();
}

function DeleteFaq(id) {
    var scope = angular.element($("#dvFaq")).scope();
    if (confirm("Are you sure you want to delete ?"))
    scope.DeleteFaq(id);
    scope.$apply();
}
