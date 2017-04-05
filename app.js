var express = require('express');
var app = express();

require('./env.js');

var mongoose = require('mongoose');
var Startup = require('./schemas/startup.js');
mongoose.connect(process.env.MONGO_CONNECTION_STRING);

var bodyparser = require('body-parser');
app.use(bodyparser.json());

var port = process.env.PORT || 1969;

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));

app.get('/api/startups', function(req, res) {
	Startup.find({}, function(err, result) {
		if (err) {
			res.json({ ok: false, error: err });
		}
		else {
			res.json({ ok: true, startups: result });
		}
	});
});

app.get('*', function(req, res) {
	res.sendFile('/public/index.html', { root: __dirname });
});

app.listen(port, function() {
	console.log('Server listening on port ' + port + '...');
});