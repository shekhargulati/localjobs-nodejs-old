var ip_addr = process.env.OPENSHIFT_NODEJS_IP   || '127.0.0.1';
var port    = process.env.OPENSHIFT_NODEJS_PORT || '8080';

var db_name = process.env.OPENSHIFT_APP_NAME || "localjobs";

var connection_string = '127.0.0.1:27017/' + db_name;
// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}

var mongojs = require("mongojs");

var db = mongojs(connection_string, ['localjobs']);
var jobs = db.collection("jobs");
var gm = require('googlemaps');
var util = require('util');

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.new = function(req , res){
	res.render("create_job" , {"title" :"Create a new Job"});
};

exports.save = function(req , res){


	var title = req.body.title ,
		description = req.body.description,
		location = req.body.location,
		companyName = req.body["company.name"],
		companyWebSite = req.body["company.website"],
		companyContactEmail = req.body["company.contact.email"],
		companyContactTelephone = req.body["company.contact.telephone"];

	var skills = [];
	req.body.skills.split(",").forEach(function(e){skills.push(e.trim().toLowerCase())});

	gm.geocode(location , function(err , result){
		if(err){
			console.log(err);
		}else{
			var lat = result.results[0].geometry.location.lat;
			var lng = result.results[0].geometry.location.lng;
			console.log("Latitude "+lat);
			console.log("Longitude "+lng);
			var job = {
				"title" : title,
				"description" : description,
				"skills" : skills,
				"location" : location,
				"lngLat" : [lng , lat],
				"company" : {
					"name" :companyName,
					"website" : companyWebSite,
					"contact" :{
						"email" : companyContactEmail,
						"telephone" : companyContactTelephone
					}
				}
			}
	
			jobs.save(job , function(err , saved){
				if(err || !saved){
					console.log("Job not saved");
				}else{
					console.log("Job saved..");
				}
			});
			res.send("Data saved ..");
		}
		
	});

	
};	