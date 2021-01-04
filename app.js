(function () {
    'use strict';

    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .factory('MenuSearchServiceFactory', MenuSearchServiceFactory)
       
        .directive('foundItems', foundItemsDirective)
        .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");
        
    
   
    function foundItemsDirective() {
        var ddo = {
            templateUrl: 'narrowlist.html',
            scope: {
                items: '=',
                onRemove: '&',
              
             


            },
            
            controller: FoundItemsDirectiveController,
            
            controllerAs: 'list',
            bindToController: true,
           
           
        };
        function removeItem() {
            console.log("emove");
        }
        return ddo;

    };

   

    FoundItemsDirectiveController.$inject = ['MenuSearchServiceFactory', 'MenuSearchService', '$scope'];
    
    function FoundItemsDirectiveController(MenuSearchServiceFactory,MenuSearchService,$scope) {
        var list = this;
        
    }
   

    NarrowItDownController.$inject = ['MenuSearchServiceFactory','MenuSearchService','$scope'];
    function NarrowItDownController(MenuSearchServiceFactory,MenuSearchService,$scope) {
        var menu = this;
        menu.word = "";
        $scope.word = "";
        var MenuSearchServices = MenuSearchServiceFactory();


       
        menu.title = "Narrow Down Your Chinese Menu Choice";
        menu.title1 = "title1";
        menu.word = "";
      //  var promise = MenuSearchService.getMenuCategories();
       // var promise = MenuSearchServices.getMenuCategories();
       // MenuSearchService.writeMenuCategories();
        //menu.list = MenuSearchService.getCategories();
        
        menu.removeItem = function ($index) {
            console.log("68", $index);
            
            menu.found = MenuSearchService.removeItem($index);
           // menu.found = $scope.items.data;
          //  menu.found = $scope.items;
            console.log('after remove', menu.found);
           
            return true;
        };
     
    
        //MenuSearchService.getMenuCategories();
        menu.found = MenuSearchService.narrowFunction();

        $scope.narrowFunction = function () {

            MenuSearchService.narrowFunction();
        };

        $scope.narrowFunctionxx = function () {
          
           
            var promise = MenuSearchService.getMenuCategories();

            promise.then(function (response) {
                $scope.categories = response.data;
                $scope.categories.forEach(function (category) {

                    $scope.items = [];
                    

                    var promise1 = MenuSearchService.getMenuForCategory(category.short_name);
                    promise1.then(function (response) {

                        response.data.menu_items.forEach(function (item) {
                            console.log('scope', item.name,'scopeword', $scope.word,'menuword',menu.word);
                            if (item.name.includes($scope.word)) {
                                item.insert = { "id": item.id, "name": item.name,"remove":"" };
                                $scope.items.push(item.insert);

                            }

                        });

                        $scope.found = $scope.items;
                        menu.found = $scope.items;
                        console.log('scope.found', menu.found);
                      


                    }
                    );
                    
                });
            })
                .catch(function (error) {
                    console.log("Something went terribly wrong.");
                });


        };
        
        var promise = MenuSearchService.getMenuCategories();
        
        promise.then(function (response) {
            menu.categories = response.data;
            menu.categories.forEach(function (category) {

                menu.items = [];

                var promise1 = MenuSearchService.getMenuForCategory(category.short_name);
                promise1.then(function (response) {

                    response.data.menu_items.forEach(function (item) {

                        if (item.name.includes(menu.word)) {
                            item.insert = { "id": item.id, "name": item.name };
                            menu.items.push(item.insert);

                        }

                    });

                    menu.found = menu.items;


                }
                );
            });
        })
            .catch(function (error) {
                console.log("Something went terribly wrong.");
            });

        

        menu.found = MenuSearchService.narrowFunction();



            
    } //end of narrow it down controller

   


    MenuSearchService.$inject = ['$http', 'ApiBasePath'];
    function MenuSearchService($http, ApiBasePath) {
        var service = this;
        var items = [];
        var thisitem = {};
        var itemshold = [];

        service.getMenuCategories = function () {
            var response = $http({
                method: "GET",
                url: (ApiBasePath + "/categories.json")
            })
                .then(function (finalResult) {
                    console.log(finalResult);
                    items = finalResult;
                    return finalResult;
                });
            return response;
        };
        service.writeMenuCategories = function () {
            var response = $http({
                method: "GET",
                url: (ApiBasePath + "/categories.json")
            })
                .then(function (finalResult) {
                   
                   
                    
                        finalResult.data.forEach(function (item) {
                            
                            var newItem = { id: item.id, name: item.name };
                            items.push(newItem);

                    });
                    console.log('236', items);
                });
            
        };

        service.getCategories = function () {
            console.log("items243", items);
            return items;

        };
        
        service.removeItem = function ($index) {
            console.log("items243", items);
            console.log('323', items);
            console.log('itemsbeforeslice', items);
            //items.splice($index, 1);
            items[$index].remove = true;
            console.log('items',$index, items);
            console.log('itemsaftersplice', items);

            
            return items;

        };








        service.getMenuForCategory = function (shortName) {
            var response = $http({
                method: "GET",
                url: (ApiBasePath + "/menu_items.json"),
                params: {
                    category: shortName
                }
            });


            return response;
        };
        service.getMatchedMenuItems = function (shortName) {
            var response = $http({
                method: "GET",
                url: (ApiBasePath + "/menu_items.json"),
                params: {
                    category: shortName
                }
            });


            return response;
        };
        service.narrowFunction = function () {
            items = [];
            console.log('items', items);

            var promise = service.getMenuCategories();

            promise.then(function (response) {
                var categories = response.data;
                categories.forEach(function (category) {

                    

                    var promise1 = service.getMenuForCategory(category.short_name);
                    promise1.then(function (response) {

                        response.data.menu_items.forEach(function (item) {
                            var serviceword = "";
                            console.log('items263', items);
                            if (item.name.includes(serviceword)) {
                                thisitem = { "id": item.id, "name": item.name };
                                itemshold.push(thisitem);
                                console.log('264', thisitem);
                                console.log('265', items);

                            }

                        });
                        console.log('268itms', itemshold);
                        items = itemshold;
                        console.log('276', items);
                     


                    }
                    );
                });
            })
                .catch(function (error) {
                    console.log("Something went terribly wrong.");
           });


        };

    };
    
    function MenuSearchServiceFactory() {
            console.log('line247 creating factory');
            var factory = function () {

                return new MenuSearchService();
            };

            return factory;
        }

    
   
   







})();
