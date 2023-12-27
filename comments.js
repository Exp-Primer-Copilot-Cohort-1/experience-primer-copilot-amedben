// Create web server 

var http = require('http');
var url = require('url');
var fs = require('fs');

var ROOT_DIR = "html/";

http.createServer(function (req, res) {
	var urlObj = url.parse(req.url, true, false);
	console.log("URL path "+urlObj.pathname);
	console.log("URL search "+urlObj.search);
	console.log("URL query "+urlObj.query["q"]);

	if (urlObj.pathname.indexOf("getcity") != -1) {
		// Execute the REST service
		fs.readFile(ROOT_DIR + "cities.dat.txt", function (err, data) {
			if (err) {
				throw err;
			}
			var cities = data.toString().split("\n");
			var jsonresult = [];
			var myRe = new RegExp("^" + urlObj.query["q"]);
			for (var i = 0; i < cities.length; i++) {
				var result = cities[i].search(myRe);
				if (result != -1) {
					console.log(cities[i]);
					jsonresult.push({city: cities[i]});
				}
			}
			console.log(jsonresult);
			res.writeHead(200);
			res.end(JSON.stringify(jsonresult));
		});
	} else {
		// Serve static files
		fs.readFile(ROOT_DIR + urlObj.pathname, function (err, data) {
			if (err) {
				res.writeHead(404);
				res.end(JSON.stringify(err));
				return;
			}
			res.writeHead(200);
			res.end(data);
		});
	}
}).listen(80);