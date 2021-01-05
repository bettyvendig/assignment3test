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
               // noneleft: '@noneleft',
                noneleft: '=',
              
              
             


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
        $scope.noneleft = false;
        $scope.numberremoved = 0;

       
        menu.title = "Narrow Down Your Chinese Menu Choice";
        menu.title1 = "title1";
        menu.word = "";
        menu.noneleft = false;
    
        
        menu.removeItem = function ($index) {
            console.log("68", $index);
            
            menu.found = MenuSearchService.removeItem($index);
           // menu.found = $scope.items.data;
          //  menu.found = $scope.items;
            console.log('after remove', menu.found);
            console.log('length', menu.found.length);
            $scope.numberremoved += 1;
            console.log('78',menu.noneleft,$scope.noneleft);
            console.log('removed', $scope.numberremoved);
            if ((menu.found.length - $scope.numberremoved) === 0) {
                $scope.noneleft = true;
                menu.noneleft = true;
                console.log('75', menu.noneleft);
            };
           
            return true;
        };
     
    
        //MenuSearchService.getMenuCategories();
        menu.found = MenuSearchService.narrowAllFunction();

       
        /*
        $scope.narrowFunctionxx = function () {
          
           
            var promise = MenuSearchService.getMenuCategories();

            promise.then(function (response) {
                $scope.categories = response.data;
                $scope.categories.forEach(function (category) {

                    $scope.items = [];
                    

                    var promise1 = MenuSearchService.getMenuForCategory(category.short_name);
                    promise1.then(function (response) {

                        response.data.menu_items.forEach(function (item) {
                           
                            if (item.name.includes($scope.word)) {
                                item.insert = { "id": item.id, "name": item.name,"remove":"" };
                                $scope.items.push(item.insert);

                            }

                        });

                        $scope.found = $scope.items;
                        menu.found = $scope.items;
                       
                      


                    }
                    );
                    
                });
            })
                .catch(function (error) {
                    console.log("Something went terribly wrong.");
                });


        };
        */
        
        var promise = MenuSearchService.getMenuCategories();
        
        promise.then(function (response) {
            menu.categories = response.data;
            menu.categories.forEach(function (category) {

                menu.items = [];

                var promise1 = MenuSearchService.getMenuForCategory(category.short_name);
                promise1.then(function (response) {

                    response.data.menu_items.forEach(function (item) {

                        if (item.name.includes(menu.word)) {
                            item.insert = { "id": item.id, "name": item.name,"remove":false,"short_name":item.short_name,"description":item.description };
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

        

     //   menu.found = MenuSearchService.narrowAllFunction();
        $scope.narrowFunction = function () {
            console.log('83', $scope.word);
            MenuSearchService.narrowFunction($scope.word);
            menu.foundnarrow = MenuSearchService.getitems()
            console.log('86', menu.foundnarrow);
            menu.found = menu.foundnarrow;
            $scope.found = menu.foundnarrow;
            console.log('87', menu.foundnarrow);
            console.log('169', menu.found.length);
            
        };


            
    } //end of narrow it down controller

   


    MenuSearchService.$inject = ['$http', 'ApiBasePath'];
    function MenuSearchService($http, ApiBasePath) {
        var service = this;
        var items = [];
        var thisitem = {};
        var itemshold = [];
        var narrowitems = [];

        service.getMenuCategories = function () {
            var response = $http({
                method: "GET",
                url: (ApiBasePath + "/categories.json")
            })
                .then(function (finalResult) {

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
            // console.log("items243", items);
            return items;

        };

        service.removeItem = function ($index) {
            // console.log("items243", items);
            //  console.log('323', items);
            //   console.log('itemsbeforeslice', items);
            //items.splice($index, 1);
            items[$index].remove = true;
            //  console.log('items',$index, items);
            //   console.log('itemsaftersplice', items);


            return items;

        };

        service.getitems = function () {
            console.log('241', items);
            return narrowitems;
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
        service.narrowFunction = function (serviceword) {
            narrowitems = [];
            items = [];
           
           // console.log('items267', items);
            var serviceword = serviceword;
            serviceword = serviceword.toUpperCase()
            console.log('serviceword269', serviceword);


            var promise = service.getMenuCategories();

            promise.then(function (response) {
                var categories = response.data;
                categories.forEach(function (category) {



                    var promise1 = service.getMenuForCategory(category.short_name);
                    promise1.then(function (response) {

                        response.data.menu_items.forEach(function (item) {

                            // console.log('items263', items);
                            if (item.name.toUpperCase().includes(serviceword)) {
                                console.log('serviceword', serviceword,item.name);
                                thisitem = { "id": item.id, "name": item.name, "remove":false, "short_name":item.short_name,"description":item.description };
                                narrowitems.push(thisitem);
                                //    console.log('264', thisitem);
                                //   console.log('265', items);
                                //
                            }

                        });
                        // console.log('268itms', itemshold);
                       // items = itemshold;
                        
                      //  console.log('276', items);
                        items = narrowitems;
                       
                      return narrowitems;
                        



                    }
                    );
                    
                });
            })
                .catch(function (error) {
                    console.log("Something went terribly wrong.");
                });


        };
    
        service.narrowAllFunction = function () {
            console.log('all');
            items = [];
            console.log('items', items);
            var serviceword = "";


            var promise = service.getMenuCategories();

            promise.then(function (response) {
                var categories = response.data;
                categories.forEach(function (category) {



                    var promise1 = service.getMenuForCategory(category.short_name);
                    promise1.then(function (response) {
                        console.log('346', response.data.menu_items);
                        response.data.menu_items.forEach(function (item) {

                            console.log('items263', items);
                            if (item.name.includes(serviceword)) {
                                thisitem = { "id": item.id, "name": item.name, "remove":false, "short_name":item.short_name,"description":item.description };
                                itemshold.push(thisitem);
                                console.log('264', thisitem);
                               // console.log('265', items);

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
    };

  


   
   







})();
