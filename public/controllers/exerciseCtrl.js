angular.module("app")
    .controller('exercisesCtrl', function($http, $scope, $rootScope, panel, editpanel, alert) {

        $rootScope.pagetitle = "Exercises";

        var self = this;
        self.title = "Exercise tracking";
        self.users_id = null;

        self.rows = [];

        self.users_id = null;


        $http.get("/login").then(function(data) { //Get a pseudo random user id and gather data based on that user


            self.users_id = data.data.users_id;
            $http.get('/exercise/' + data.data.users_id).then(function(data) {

                if (data.data)
                    self.rows = data.data;


            });

        });



        self.delete = function(row, index) {


            panel.show({
                title: "Delete a exercise",
                body: "Are you sure you want to delete " + row.exercises_name + "?",
                confirm: function() {
                    $http.delete('/exercise/' + row.exercises_id)
                        .success(function(data) {

                            self.rows.splice(index, 1);
                            alert.show(row.exercises_name + " deleted.", 'success')
                            panel.state = null;
                        }).error(function(data) {


                            alert.show(data.code, 'danger');
                        });
                }
            });
        }

        self.confirm = function() {


        }

        //Details button
        self.details = function(row, index) {

            editpanel.show({
                title: "Details for exercise",
                rows: row,
                editing: false,
                confirm: function() {
                    $http.delete('/exercise/' + row.exercises_id)
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
                exercisestypes_id: 1
            });


        }

        self.save = function(row, index) {

            if (!row.users_id) {

                row.users_id = self.users_id;
            }

            $http.post('/exercise', row)
                .success(function(data) {

                    data.isEditing = false;
                    self.rows[index] = data;

                }).error(function(data) {

                    alert.show(data.code, 'danger');

                });
        }
    })