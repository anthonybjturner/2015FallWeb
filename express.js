var express = require('express'),   app = express();

//Express middleware
var bodyParser = require('body-parser');
var session = require('express-session')

//Models
var goal = require("./models/goal");
var user = require("./models/user");
var food = require("./models/food");
var exercise = require("./models/exercise");
var friend = require("./models/friend");
var login = require("./models/login");


var unirest = require("unirest");
var global = require("./inc/global");
var twit = global.GetTwitterConnection();
var users_id = null;
//https://market.mashape.com/msilverman/nutritionix-nutrition-database
//http://unirest.io/nodejs
//https://www.npmjs.com/package/express-session
//redis.io

app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({  secret: 'my secret'} ));

app.get("/food", function(req, res){
   

  if( req.query.users_id){

    food.getByUserId(req.query.users_id, function(err, rows){
    res.send(rows);
  })
  
  }else if( users_id ){
    
     var row = [users_id, req.query.created_at];
     
       food.getByDate(row, function(err, rows){
         
         res.send(rows);

       });

  }
    
})
.get("/food/:id", function(req, res){
 
      food.get(req.params.id, function(err, rows){
        res.send(rows);
      })

})
.post("/food", function(req, res){
  var errors = food.validate(req.body);
  if(errors){
    res.status(500).send(errors);
    return;
  }
 
  food.save(req.body, function(err, row){
    
    if(err){
     var errors = {"code": err.Error, "msg": err};
      res.status(500).send(errors); 
    }else{
      
       res.send(row);
    }
   
  })
})
.delete("/food/:id", function(req, res){
  
  food.delete(req.params.id, function(err, rows){
      if(err){
        res.status(500).send(err);
      }else{
        res.send(req.params.id);
      }
  })
  
}).get("/exercise", function(req, res){
  
   
     
  if( req.query.users_id){

    exercise.getByUserId(req.query.users_id, function(err, rows){
    res.send(rows);
  })
  
  }else if( users_id ){
    
     var row = [users_id, req.query.created_at];
       exercise.getByDate(row, function(err, rows){
         
    
         res.send(rows);

       });

  }
  
})
.get("/exercise/:id", function(req, res){
  
  exercise.get(req.params.id, function(err, rows){
    res.send(rows);
  })
  
})
.post("/exercise", function(req, res){
  var errors = exercise.validate(req.body);
  if(errors){
    res.status(500).send(errors);
    return;
  }
  
  twit.post('statuses/update', { status: '[App Developer Test] I just accomplished ' + req.body.exercises_minutes + ' minutes with ' + req.body.exercises_name + ' and burned ' + req.body.exercises_calories_burned + ' calories' }, function(err, data, response) {
   })
  
  
  exercise.save(req.body, function(err, row){
    res.send(row);
  })
})
.delete("/exercise/:id", function(req, res){
  
  exercise.delete(req.params.id, function(err, rows){
      if(err){
        res.status(500).send(err);
      }else{
       
        res.send(req.params.id);
      }
  })
  
})
.get("/user", function(req, res){
     
        user.get(null, function(err, rows){
          res.send(rows);
        })
     
})
.get("/user/:id", function(req, res){
 
  user.get(req.params.id, function(err, rows){
    res.send(rows[0]);
  })
  
}).get("/profileuser/:id", function(req, res){
 
  user.get(req.params.id, function(err, rows){
    res.send(rows[0]);
  })
})
  
.post("/user", function(req, res){
  var errors = user.validate(req.body);
  if(errors){
    res.status(500).send(errors);
    return;
  }
  user.save(req.body, function(err, row){
    res.send(row);
  })
})
.delete("/user/:id", function(req, res){
  
  user.delete(req.params.id, function(err, rows){
      if(err){
        res.status(500).send(err);
      }else{
        res.send(req.params.id);
      }
  })
  
})
.get("/friend", function(req, res){
  
  friend.get(null, function(err, rows){
    res.send(rows);
  })
    
}).post("/friend", function(req, res){
  var errors = friend.validate(req.body);
  if(errors){
    res.status(500).send(errors);
    return;
  }
  friend.save(req.body, function(err, row){
    console.log(err)
    res.send(row);
  })
})
.get("/goal", function(req, res){
   

  if( req.query.users_id){

    goal.getByUserId(req.query.users_id, function(err, rows){
    res.send(rows);
  })
  
  }else if( users_id ){
    
     var row = [users_id, req.query.created_at];
     
       goal.getByDate(row, function(err, rows){
         
         res.send(rows);

       });

  }
  

    
}).get("/goal/:id", function(req, res){

 
  goal.get(req.params.id, function(err, rows){
    res.send(rows);
  })
  
})
.post("/goal", function(req, res){
  
  var errors = goal.validate(req.body);
  if(errors){
    
    res.status(500).send(errors);
    return;
  }
  goal.save(req.body, function(err, row){
    
      if(err){
        res.status(500).send(err);
        return;
      }
      
    res.send(row);
  })
})
.delete("/goal/:id", function(req, res){
  
  goal.delete(req.params.id, function(err, rows){
      if(err){
        res.status(500).send(err);
      }else{
        res.send(req.params.id);
      }
  })
})
.get("/login", function(req, res){
     

    res.send({"users_id": users_id});
     
})
.get("/login/:id", function(req, res){
 
 
  login.get(req.params.id, function(err, rows){
    res.send(rows[0]);
  })
  
})
.post("/login", function(req, res){
  
  var errors = login.validate(req.body);
  if(errors){
    res.status(500).send(errors);
    return;
  }
  login.save(req.body, function(err, row){
    res.send(row);
  })
}).post("/fbLogin", function(req, res){
  

 unirest.get("https://graph.facebook.com/me?access_token=" + req.body.access_token + "&fields=id,name,email")
    .end(function (result) {
      
      var fbUser = req.session.fbUser = JSON.parse(result.body);
      req.session.fbUser.access_token = req.body.access_token;
     
      user.get(req.session.fbUser.id, function(err, rows){
        
        if( rows && rows.length){//If we have that user then store there data

          req.session.user = rows[0];
          users_id = rows[0].users_id;
          
        }else{
      
          user.save({users_name: fbUser.name, facebook_id: fbUser.id, users_age: '26', users_height: null, users_weight: null, users_avatar: fbUser.id, TypeId: 6 }, function(err, row){
            
            req.session.user = row;
            users_id = row.users_id;

            
          })
        }
        
        
      }, 'facebook');
      
      res.send(result.body);
      
    });
  
}).get("/session", function(req, res){
  
   user.get(req.query.access_token, function(err, rows){
        
        
        if( rows && rows.length){//If we have that user then store there data
          
          req.session.user = rows[0];
          users_id = req.session.user.users_id;

        }
        
        
      }, 'facebook');
      
      res.send({"users_id": users_id});
   
   
  
})
.get("/fbuser/:access_token", function(req, res){
   
   
   user.get(req.session.fbUser.id, function(err, rows){
        
        
        if( rows && rows.length){//If we have that user then store there data
          
          req.session.user = rows[0];

          
        }else{
      
          user.save({users_name: fbUser.name, facebook_id: fbUser.id, users_age: '26', users_height: null, users_weight: null, users_avatar: fbUser.id, TypeId: 6 }, function(err, row){
            
            req.session.user = row;
           
            
          })
        }
        
         users_id = req.session.user.users_id;

        
        
      }, 'facebook');
   
   
})
.get("/food/search/:term", function(req, res){
    unirest.get("https://nutritionix-api.p.mashape.com/v1_1/search/" + req.params.term + "?fields=item_name%2Citem_id%2Cbrand_name%2Cnf_calories%2Cnf_total_fat%2Cnf_ingredien%2Ct_statement%2Cnf_sodium%2Cnf_cholesterol%2Cnf_polyunsaturated_fat%2Cnf_total_carbohydrate%2Cnf_dietary_fiber%2C+nf_monounsaturated_fat%2Cnf_protein")
    .header("X-Mashape-Key", "qYpiKTaB8emshjm5EVuKkQwT8pLfp1L1LAdjsncmdtXipZViyv")
    .header("Accept", "application/json")
    .end(function (result) {
      
        res.send(result.body);
    });
    
})


  


app.listen(process.env.PORT);