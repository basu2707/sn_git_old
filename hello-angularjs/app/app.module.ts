(function () {
 
    angular.module('app', [])
      .controller('HelloController', HelloController);
   
    HelloController.$inject = ['$scope'];
   
    function HelloController($scope) {
      $scope.myModel = 'World';
    }
   
  })();