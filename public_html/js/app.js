/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var cartApp = angular.module('cartApp', ['ui.bootstrap', 'ui.router']);

//cartApp.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouteProvider){
//
//    $urlRouterProvider.otherwise('home');
//}])

cartApp.constant('Constants', {
  ELIGIBLE_FOR_FREE_SHIPPING: 50,
  SHIPPING_CHARGE: 50,
  DISCOUNT_PRIZE: 7,
  COUPEN_CODE: "JF10",
  ERROR: {
    INVALID_COUPEN_CODE: "Invalid Promo-Code!."
  }
});

cartApp.controller('cartController', ['cartService', 'Constants', '$uibModal', '$scope', function (cartService, Constants, $uibModal, $scope) {

    var vm = this;

    vm.wishList = [];
    vm.error = {}; //for notifiing error in UI

    cartService.getCartDetails().then(function (result) {
      console.log('fetched data ', result.data);
      vm.orderDetails = result.data.productsInCart;
      vm.calculateOrderTotal(vm.orderDetails);
    }, function (err) {
      console.log('fetched error ', err);
    });


    vm.calculateOrderTotal = function (orderedItems) {

      orderedItems = orderedItems || vm.orderDetails;

      if (orderedItems.length == 0)
        return;

      vm.orderCashDetails = {
        currency: "$", //default currency
        subTotal: 0,
        discountPrize: 0,
        shippingPrize: 0,
        estimatedTotal: 0
      };

      vm.orderCashDetails.currency = orderedItems[0].c_currency;

      orderedItems.forEach(function (item) {
        item.totalPrize = (item.p_price * item.p_quantity);
        vm.orderCashDetails.subTotal += item.totalPrize;
      });

      vm.orderCashDetails.shippingPrize = (Number(vm.orderCashDetails.subTotal) >= Constants.ELIGIBLE_FOR_FREE_SHIPPING) ? 0 : Constants.SHIPPING_CHARGE;

      calculateEstimatedToal();

    };

    var calculateEstimatedToal = function () {
      vm.orderCashDetails.estimatedTotal = vm.orderCashDetails.subTotal + vm.orderCashDetails.shippingPrize - vm.orderCashDetails.discountPrize;
    };

    vm.applyCoupenCode = function (code) {
      if (code == Constants.COUPEN_CODE) {
        vm.orderCashDetails.discountPrize = Constants.DISCOUNT_PRIZE;
        calculateEstimatedToal();
      } else {
        vm.error.invalidCoupenCode = Constants.ERROR.INVALID_COUPEN_CODE;
      }
    };

    vm.openEditModal = function (item) {
      $scope.selectedItem = item;
      var modalInstance = $uibModal.open({
        templateUrl: 'modal/itemDetail.html',
        controller: 'cartItemEditCtrl',
        scope: $scope
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        console.error('Modal dismissed at: ');
      });
    };

    vm.removeItemFromCart = function (itemId) {
      var index = _.findIndex(vm.orderDetails, {p_id: itemId});
      vm.orderDetails.splice(index, 1);
      vm.calculateOrderTotal(); //re-calculate prizes when items is removed
    };


    vm.saveForLater = function (item) {
      vm.wishList.push(angular.copy(item));
    };


  }])

cartApp.controller('cartItemEditCtrl', ['$scope', function ($scope) {
    console.log('modal scope ', $scope.selectedItem);

    $scope.getSelectedColor = function (color) {
      if (color.hexcode == $scope.selectedItem.p_selected_color.hexcode) {
        return "active";
      }
    };

  }]);