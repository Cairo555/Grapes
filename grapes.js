var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs')
var db = mongojs('grapes')
var ObjectId = mongojs.ObjectId;
var app = express() ;

/*
var logger = function(req, res, next){
	console.log('Logging...');
	next();
}

app.use(logger);
*/

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set Static path
app.use(express.static(path.join(__dirname, 'public')))

// Global Vars
app.use(function(req, res, next){
	res.locals.errors = null;
	next();
});


// Express Validator Middeleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


app.get('/', function(req, res){
	db.customers.find(function (err, docs) {
	   	res.render('index', {
			title: 'customers',
			customers: docs
		});
	})
});




app.post('/cards/add', function(req, res){

	req.checkBody('name', 'The name of the Pokemon is required').notEmpty();
	req.checkBody('hp', 'You need to enter the HitPoints of this Pokemon').notEmpty();
	req.checkBody('attack1', 'What is the first attack of this Pokemon').notEmpty();
	req.checkBody('image', 'Please add an image for this Pokemon card').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('index', {
			title: 'grapes',
			cards: cards,
			errors: errors
		});
	} else {
		var newCard = {
		name: req.body.name,
		hp: req.body.hp,
		attack1: req.body.attack1,
		image: req.body.image,
		type: req.body.type
	}

	db.cards.insert(newCard, function(err, result){
		if(err){
			console.log(err);
		}
		res.redirect('/');
	});
   }
});

app.delete('/cards/delete/:id', function(req, res) {
	db.cards.remove({_id: ObjectId(req.params.id)}, function(err, result){
		if(err){
			console.log(err);
		}
		res.redirect('/');
	});
	console.log(req.params.id);
});

app.listen(3000, function(){
	console.log('Server started on port 3000....');
})