
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var job = require('./routes/job');
var http = require('http');
var path = require('path');
var engine = require("ejs-locals");

var app = express();

app.engine("ejs",engine);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/jobs', job.list);
app.get('/jobs/new',job.new);
app.post('/jobs/new',job.save);
app.get('/jobs/search',job.searchPage);
app.get('/api/jobs/:skills' , job.search)

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
