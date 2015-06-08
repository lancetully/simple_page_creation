var fs = require('fs'),
	mustache = require('mustache'),
	_ = require('underscore'),
	mkdirp = require('mkdirp');


// using the subjects array, create files for each subject page.
// using *Sync methods to avoid callbacks for this simple script

var subjects = ["ACCT", "AGRI", "AGEC", "AGPS", "ASDC", "ANSC", "ANTH", "ARCH", "AUTO", "BSET", "BIOL", "BLCT", "BUAD", "CHEM", "CIVL", "COMP", "CISY", "CTRP", "CJUS", "DGMA", "DCAD", "ECON", "EDUC", "ELET", "ELTR", "EMET", "ENGR", "ESOL", "ENVR", "FILM", "FNAT", "FDSR", "FRSC", "GEOL", "GLST", "HPED", "MEDR", "HLTH", "HIST", "HUSR", "DSGN", "ITAL", "JAPN", "LITR", "MATT", "MKTG", "MATH", "MECH", "NASC", "NURS", "PHIL", "PHYS", "PLSC", "PSYC", "SOCI", "SPAN", "SPCH", "SPMG", "TMGT", "VETS", "WELD"];


var defaultConfig = {
	// data object contains page data needed in templates, each page requires uniqueKey. Here we're processing an array into an object.
	data : subjects.map(function(item,index){var itemObj = {}; itemObj.courseID = item.toLowerCase(); itemObj.uniqueKey=itemObj.courseID; return itemObj;}),
	// paths for templates, w
	paths : {templates : "templates/", output:"output2/"},
	templates : {props:"_props.mst", index:"index.mst", nav:"_nav.mst"},
	output_extension :".pcf",
	callback:callback,
	// @function filename
	// @param	item {string} string to be formatted into file name. return the unchanged id item if you don't need to change this.
	filename:function(item){return item.courseID.toLowerCase()},
	// display console.log stuffs by setting this to true
	debug:true
};

// makepages takes a config object (example above) and creates pages from mustache templates and js objects
var makePages = {
	// save our scope
	self : this,
	rendered: {},
	init: function(config){
		// start our process. extend the main object to include config
		if(makePages.debug){console.log("makePages.init() running.")};
		_.extend(makePages,defaultConfig,config);
		if(makePages.debug){console.log("makePages.init() complete, passing to makePages.make()")};
		this.make();

	},
	make: function(){
		if(makePages.debug){console.log("makePages.make() running.")};
		// this is where we make all the pages
		// pages contains rendered html for all the pages we will output. the pages object is sent to our write() function 
		var pages = {};
		// iterate our data items, compile with the templates, and push to the pages object
		_.each(this.data, function(item){
			var currentPage = pages[item.uniqueKey] = {};
			// for each template, get the mustache rendered html, and add the rendered html to the pages[this item key] object
			_.each(this.templates, function(template){
				// console.log("args",arguments[0],"item",item);
				// console.log("template: ",template,", item: ",item);
				var html = this.build.renderedMustache(arguments[0],item);
				currentPage[template] = html;
				// console.log(html);
			}.bind(this));
			// add the pages object to our root object
			this.pages = pages;
			// console.log(item.uniqueKey);
		}.bind(this));
		// send our pages to the write() function for output
		if(makePages.debug){console.log("makePages.make() complete, passing to makePages.write()")}
		this.write(this.pages);
	},
	// write will write the pages in the appropriate directory
	// @param pages {object} contains html for each page.
	write: function(pages){
		// we need to write each file to the path
		if(makePages.debug){console.log("makePages.write() running.")}
		var test = true;
		_.each(pages,function(value, key, obj){
			var dirPath = makePages.paths.output + key;
			// console.log("mkdirping : ", dirPath);
			mkdirp.sync(dirPath);
			_.each(value, function(value, key, obj){
				var filePath = dirPath+"/"+key;
				// mkdirp(filePath);
				fs.writeFileSync(filePath,value);
				// console.log("Wrote file at : ",filePath);
			});
		});
		console.log("all files written, makePages completed successfully.");
	},
	// below this line are the support functions  //

	// use build  to create the intermediate things like file paths and html from mustache. all our necessary things
	build: {
		outputPath:function(filename){
			return path = makePages.paths.output + "/" + filename  + makePages.output_extension;
		},
		renderedMustache:function(template, item){
			// render the html for each template
			var self = makePages,
				templateFile = fs.readFileSync(self.paths.templates + template,"utf8");

			// console.log(mustache.render(templateFile,item));
			return  mustache.render(templateFile,item);
		}
	}
};

// callback placeholder
function callback(data){
	console.log("default debug output:: ", data)
}

// makePages.init();

module.exports = makePages;
