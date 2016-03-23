/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
angular.module('cartApp').factory('cartService', ['$http', function ($http) {
    var cartService = {};

    cartService.getCartDetails = function () {
      return $http.get('./asserts/json/cart.json')
    }

    return cartService;

  }])

