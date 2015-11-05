angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})
.controller('LoadingUID', function($scope, $http, $state,$ionicLoading, $timeout, $cordovaDevice) {
  $scope.getData = function() {
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
    
    $timeout(function () {
      $ionicLoading.hide();
      // LoginService.Check_UID();
      $state.go('login-page',null,{reload:true});
    }, 1000);

  }
})
.controller('LoginCtrl', function($scope, $state,$ionicLoading, $timeout, LoginService, $cordovaDevice) {
  $scope.doLogin = function(isValidPass, password){
    if(isValidPass == true){
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
      $timeout(function () {
        $ionicLoading.hide();
          LoginService.Check_UID(password);
      }, 500);
    }else{
        
    }

  };
  $scope.showUUID = $cordovaDevice.getUUID();


})

.controller('ListTopicCtrl', function($scope, $ionicLoading, $timeout, GetTopicService, RegisTopicService){

    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
     
    $timeout(function () {
      $ionicLoading.hide();
      GetTopicService.Get_Topic().then(function(){
        $scope.listCanSwipe = true;
        $scope.listtopic = GetTopicService.Get_Topic_Result();
        // $scope.showFavorites = GetTopicService.Get_RegisHtml();
    })
    }, 500);

  $scope.bookmark = function(topicId, status){
    if(status == true){
      RegisTopicService.Regis_Topic(topicId,'0').then(function(){
              GetTopicService.Get_Topic().then(function(){
        $scope.listCanSwipe = true;
        $scope.listtopic = GetTopicService.Get_Topic_Result();
      });
      });

    }else if(status == false){
      RegisTopicService.Regis_Topic(topicId,'1').then(function(){
              GetTopicService.Get_Topic().then(function(){
        $scope.listCanSwipe = true;
        $scope.listtopic = GetTopicService.Get_Topic_Result();
      });
      });
    }
    // alert("ss");
  };
  // $scope.isActive = false;
  // $scope.toggleActive = function() {
  //   $scope.isActive = !$scope.isActive;
  // };
})
.controller('ChangePassCtrl', function($scope,$ionicLoading,$timeout, ChangePassService){
    $scope.doChangePass = function(isValidPass, oldPass, newPass){
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
      
      $timeout(function () {
        $ionicLoading.hide();
        if(isValidPass == true){
          ChangePassService.Change_Pass(oldPass, newPass);
        }else{
          alert("Lỗi!");
        }
      }, 500);
    }
})
.controller('TopicContentCtrl', function($scope, $stateParams, GetTopicContentService) {
  GetTopicContentService.Get_Topic_Content($stateParams.topicId).then(function(){
      $scope.listTopicContent = GetTopicContentService.Get_Topic_Content_Result();

      $scope.topicId = $stateParams.topicId;
      // $scope.contentId = $stateParams.topicId;
    });

})
.controller('ContentDetailCtrl', function($scope, $stateParams,  GetContentDetailService) {
  GetContentDetailService.Get_Content_Detail($stateParams.contentId).then(function(){
      $scope.listContentDetail = GetContentDetailService.Get_Content_Detail_Result();
      $scope.getHtmlcontent = GetContentDetailService.Get_Html_Content();
      $scope.getHtmlOriginLink = GetContentDetailService.Get_Html_OriginLink();
    })
})
.directive('nxEqual', function() {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, model) {
            if (!attrs.nxEqual) {
                console.error('nxEqual expects a model as an argument!');
                return;
            }
            scope.$watch(attrs.nxEqual, function (value) {
                model.$setValidity('nxEqual', value === model.$viewValue);
            });
            model.$parsers.push(function (value) {
                var isValid = value === scope.$eval(attrs.nxEqual);
                model.$setValidity('nxEqual', isValid);
                return isValid ? value : undefined;
            });
        }
    };
})

.factory('LoginService', function($http, $state, $cordovaDevice) {
  var uid ;
  return {
    Check_UID: function(accuracy_id){
      var uuid = $cordovaDevice.getUUID();
      //var uuid = '8c0e1faa90259f85';
      return $http.get("http://demo.neo.vn/services/SqlServices/ref?Provider=default&Service=mobile_check_uid_value&ParamSize=2&P1="+uuid+"&P2="+accuracy_id+"&response=application/json").success(function(data) {
        eval('var response ='+data.return);
        var result = response[0].RESULT;
        if(result == "0000"){
          $state.go('app.listsubject');
        }else if(result == "0001"){
          alert("UID không tồn tại");
        }else if(result == "0002"){
          alert("UID đã bị khóa");
        }else if(result == "0003"){
          alert("Mã xác thực không đúng");
        }else if(result == "0004"){
          alert("Lỗi hệ thống");
        }
      })
      .error(function(data) {
          alert("ERROR LoginService");
      });
    },
    Get_UID: function(){
      return $cordovaDevice.getUUID();
    }
  }
})
.factory('GetTopicService', function($http, $state, $cordovaDevice) {
  var topics = [];
  return {
    Get_Topic: function(){
      var uuid = $cordovaDevice.getUUID();
      // var uuid = '8c0e1faa90259f85';
      return $http.get("http://demo.neo.vn/services/SqlServices/ref?Provider=default&Service=mobile_get_topic_uid&ParamSize=1&P1="+uuid+"&response=application/json").success(function(data) {
        eval('var response ='+data.return);
        topics  = response;
        topics.forEach(function (item) {
          if(item.REGIS == "true"){
            item.REGIS_HTML = '<a class=\'positive\' ng-click=\'bookmark("\{\{topic.ID\}\}",\{\{topic.REGIS\}\})\'><i class=\'icon ion-android-star\' ></i></a>';
          }else{
            item.REGIS_HTML = '<a ng-click=\'bookmark("\{\{topic.ID\}\}",\{\{topic.REGIS\}\})\'><i class=\'icon ion-android-star-outline\' ></i></a>';
          }

        });
        
      })
      .error(function(data) {
          alert("ERROR GetTopicService");
      });
    },
    Get_Topic_Result: function(){
      return topics;
    }
  }
})
.factory('ChangePassService', function($http, $state, $cordovaDevice) {
  var topic = [];
  return {
    Change_Pass: function(oldPass, newPass){
      var uuid = $cordovaDevice.getUUID();
      // var uuid = '8c0e1faa90259f85';
      return $http.get("http://demo.neo.vn/services/SqlServices/ref?Provider=default&Service=mobile_change_accid_value&ParamSize=3&P1="+uuid+"&P2="+oldPass+"&P3="+newPass+"&response=application/json").success(function(data) {
        eval('var response ='+data.return);
        var result = response[0].RESULT;
        if(result == "0000"){
          alert("Thành công!");
        }else if(result == "0001"){
          alert("UID không tồn tại");
        }else if(result == "0002"){
          alert("UID đã bị khóa");
        }else if(result == "0003"){
          alert("Mã xác thực không đúng");
        }else if(result == "0004"){
          alert("Lỗi hệ thống");
        }
      })
      .error(function(data) {
          alert("ERROR ChangePassService");
      });
    },
  }
})
.factory('GetTopicContentService', function($http, $state, $cordovaDevice) {
  var topicContent = [];
  return {
    Get_Topic_Content: function(topicId){
      var uuid = $cordovaDevice.getUUID();
      // var uuid = '8c0e1faa90259f85';
      return $http.get("http://demo.neo.vn/services/SqlServices/ref?Provider=default&Service=mobile_get_contents_topic&ParamSize=2&P1="+topicId+"&P2="+uuid+"&response=application/json").success(function(data) {
        eval('var response ='+data.return);
        topicContent  = response;
      })
      .error(function(data) {
          alert("ERROR GetTopicContentService");
      });
    },
    Get_Topic_Content_Result: function(){
      return topicContent;
    }
  }
})
.factory('GetContentDetailService', function($http, $state, $cordovaDevice) {
  var contentDetail = [];
  var htmlContent='' ;
  var htmlOriginLink ='';
  return {
    Get_Content_Detail: function(contentId){
      var uuid = $cordovaDevice.getUUID();
      // var uuid = '8c0e1faa90259f85';
      return $http.get("http://demo.neo.vn/services/SqlServices/ref?Provider=default&Service=mobile_get_content_detail&ParamSize=2&P1="+contentId+"&P2="+uuid+"&response=application/json").success(function(data) {
        eval('var response ='+data.return);
        contentDetail  = response;
        htmlContent =  (response[0].CONTENT);
        htmlOriginLink =  (response[0].ORIGIN_LINK);
        // alert(htmlContent);
      })
      .error(function(data) {
          alert("ERROR GetContentDetailService");
      });
    },
    Get_Content_Detail_Result: function(){
      return contentDetail;
    },
    Get_Html_Content: function(){
      return htmlContent;
    },
    Get_Html_OriginLink: function(){
      return 'Nguồn: <a href='+htmlOriginLink+'>'+htmlOriginLink+'</a>';
    }
  }
})
.factory('RegisTopicService', function($http, $state, $cordovaDevice) {
  var uuid = $cordovaDevice.getUUID();
  // var uuid = '8c0e1faa90259f85';
  var topic_id='';
  return {
    Regis_Topic: function(topicId, status){
      // var uuid = $cordovaDevice.getUUID();
  var uuid = $cordovaDevice.getUUID();

      return $http.get("http://demo.neo.vn/services/SqlServices/ref?Provider=default&Service=mobile_regis_topic&ParamSize=3&P1="+uuid+"&P2="+topicId+"&P3="+status+"&response=application/json").success(function(data) {
        eval('var response ='+data.return);
        var result = response[0].RESULT;
        topic_id = topicId;
        if(result == "0000"){

          }else if(result == "0001"){
            alert("UID không tồn tại");
          }else if(result == "0002"){
            alert("UID đã bị khóa");
          }else if(result == "0003"){
            alert("Mã xác thực không đúng");
          }else if(result == "0004"){
            alert("Lỗi hệ thống");
          }
        })
      .error(function(data) {
          alert("ERROR RegisTopicService");
      });
    },
    Get_Topic_Id: function(){
      return topic_id;
    }
  }
})
//no image config
.factory('settings', function() {
    return {
        noImageUrl: "../img/no_image_small.png"
    };
})
.directive('noImage', function (settings) {
    var setDefaultImage = function (el) {
        el.attr('src', settings.noImageUrl);
    };
    return {
        restrict: 'A',
        link: function (scope, el, attr) {
            scope.$watch(function() {
                return attr.ngSrc;
            }, function () {
                var src = attr.ngSrc;
                if (!src) {
                    setDefaultImage(el);
                }
            });
            el.bind('error', function() { setDefaultImage(el); });
        }
    };
})
//bind-html-compile: ng-bind-html with ngclick
.directive('bindHtmlCompile', ['$compile', function ($compile) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      scope.$watch(function () {
        return scope.$eval(attrs.bindHtmlCompile);
      }, function (value) {
        // Incase value is a TrustedValueHolderType, sometimes it
        // needs to be explicitly called into a string in order to
        // get the HTML string.
        element.html(value && value.toString());
        // If scope is provided use it, otherwise use parent scope
        var compileScope = scope;
        if (attrs.bindHtmlScope) {
          compileScope = scope.$eval(attrs.bindHtmlScope);
        }
        $compile(element.contents())(compileScope);
      });
    }
  };
}])
.directive('star', function ($compile) {
  return {
    restrict: 'A',
    replace: false,
    terminal: true,
    priority: 1000,
    link: function link(scope,element, attrs) {
      element.attr('class', 'icon ion-android-star-outline');
      element.removeAttr("star"); 
      $compile(element)(scope);
    }
  };
});