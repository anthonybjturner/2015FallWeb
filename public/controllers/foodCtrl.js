angular.module("app")
    .controller('foodCtrl', function($http, $scope, $rootScope, panel, editpanel, alert, calendarService) {

        $rootScope.pagetitle = "Nutrition"

         var self = this;
         self.title = "Nutrition"
         self.description  = "Keep track of your nutrtion";
         self.rows = [];
         self.totalCals = 0, self.totalFat = 0, self.totalSodium = 0;
         self.isViewing = false;
         self.bgimage = "nutrition.jpg";
         self.createItemButtonText = "New food";
         self.deleteItemsButtonText = "Delete all";

           $scope.updateCalendar = function(){
    
                   
               $http.get('/food',  {    params: { users_id: null, created_at: calendarService.date }}).then(function(data){
              
                    self.rows = data.data;
                    self.totalCals = 0;self.totalCals = 0, self.totalFat = 0, self.totalSodium = 0;

                    for(var i = 0; i < self.rows.length; i++){
                      
                        var curRow = self.rows[i];
                        
                        self.totalCals +=curRow.foods_calories;
                        self.totalFat += curRow.foods_fat;
                        self.totalSodium += curRow.foods_sodium;
                    }

                 });
               
           }
           
         


        self.delete = function(row, index) {


            panel.show({
                title: "Delete a food",
                body: "Are you sure you want to delete " + row.foods_name + "?",
                confirm: function() {
                    $http.delete('/food/' + row.foods_id)
                        .success(function(data) {

                            self.rows.splice(index, 1);
                             alert.show(row.foods_name + " deleted.", 'success')
                        }).error(function(data) {


                            alert.show(data.code, 'danger');
                        });
                        panel.state = null;
                }
            });
        }

        self.confirm = function() {


        }

        //Details button
        self.details = function(row, index) {

            editpanel.show({
                title: "Details for food",
                rows: row,
                editing: false,
                confirm: function() {
                    $http.delete('/food/' + row.foods_id)
                        .success(function(data) {


                            self.rows.splice(index, 1);
                        }).error(function(data) {


                            alert.show(data.code, 'danger');
                        });
                }
            });
        }



        //Details button
        self.edit = function(row, index) {

            row.isEditing = true;
        }

        //Details button
        self.create = function() {

            self.rows.push({
                isEditing: true,
                foods_id: null,
                foodstypes_id: null
            });

        }

        self.save = function(row, index) {

            $http.get('/login').success( function(data){
                             
                           row.users_id =  data.users_id;
                           row.created_at = calendarService.date;

                            $http.post('/food', row)
                            .success(function(data){
                                
                                data.isEditing = false;
                                self.rows[index] = data;
                                alert.show(row.foods_name + " saved for "+ row.created_at+".", 'success')

                            }).error(function(data){
                                
                                alert.show(data.code , 'danger');
                                
                            });
                         })
        }
        
         self.row = {};
        self.term = null;
        self.choices = [];

        self.search = function() {
            
            var food = self.rows[self.rows.length-1]
            //Get the value(foods name) that was input into the add new row
            $http.get("/food/search/" + food.foods_name)
                .success(function(data) {
                    self.choices = data.hits;
                });
        }
        
        self.choose = function(choice) {
            
            var food = self.rows[self.rows.length-1]
                
            food.foods_name = choice.fields.item_name;
            food.foods_calories = choice.fields.nf_calories;
            food.foods_cholestrol = choice.fields.nf_cholesterol;
            food.foods_fiber = choice.fields.nf_dietary_fiber;
            food.foods_fat = choice.fields.nf_total_fat;
            food.foods_carbohydrates = choice.fields.nf_total_carbohydrate;
            food.foods_polyunsaturated_fat = choice.fields.nf_polyunsaturated_fat;
            food.foods_monounsaturated_fat = choice.fields.nf_monounsaturated_fat;
            food.foods_sodium = choice.fields.nf_sodium;
            food.foods_protein = choice.fields.nf_protein;
            
            self.choices = [];
        }


    }).controller('foodNewCtrl', function($http, alert, panel) {
        var self = this;

        self.row = {};
        self.term = null;
        self.choices = [];

        self.search = function() {
            $http.get("/food/search/" + self.term)
                .success(function(data) {
                    self.choices = data.hits;
                });
        }
        self.choose = function(choice) {
            self.row.Name = choice.fields.item_name;
            self.row.Calories = choice.fields.nf_calories;
            self.row.Fat = choice.fields.nf_total_fat;
            self.choices = [];
        }
    })
