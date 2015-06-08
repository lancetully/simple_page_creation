var fs = require('fs'),
mustache = require('mustache'),
_ = require('underscore');

// using the subjects array, create files for each subject page.
// using *Sync methods to avoid callbacks for this simple script

// subjects is the array of subject IDs. for these pages, we only need this array
var subjects = ["ACCT", "AGRI", "AGEC", "AGPS", "ASDC", "ANSC", "ANTH", "ARCH", "AUTO", "BSET", "BIOL", "BLCT", "BUAD", "CHEM", "CIVL", "COMP", "CISY", "CTRP", "CJUS", "DGMA", "DCAD", "ECON", "EDUC", "ELET", "ELTR", "EMET", "ENGR", "ESOL", "ENVR", "FILM", "FNAT", "FDSR", "FRSC", "GEOL", "GLST", "HPED", "MEDR", "HLTH", "HIST", "HUSR", "DSGN", "ITAL", "JAPN", "LITR", "MATT", "MKTG", "MATH", "MECH", "NASC", "NURS", "PHIL", "PHYS", "PLSC", "PSYC", "SOCI", "SPAN", "SPCH", "SPMG", "TMGT", "VETS", "WELD"],
// read our template files into local vars
tmpl_props = fs.readFileSync("templates/_props.mst","utf8"),
tmpl_index = fs.readFileSync("templates/index.mst","utf8");

// this would be more modular if we created the data object first and then iterated self, instead of working with a single array as a starting point
// subjects.forEach(function(item){
// 	// set the destination path root
// 	var path = "output/"+item.toLowerCase(),
// 		// create the data object
// 		data = {course : item},
// 		// render the templates
// 		renderedProps = mustache.render(tmpl_props,data),
// 		renderedIndex = mustache.render(tmpl_index, data);

// 	// make the dir
// 	fs.mkdir(path, function(){
// 		// create file path for each file we're creating
// 		var indexpath = path+"/index.pcf",
// 		propspath = path+"/_props.pcf",
// 		navpath = path+"/_nav.inc";

// 		// write rendered html templates to the appropriate file
// 		fs.writeFileSync(indexpath,renderedIndex);
// 		fs.writeFileSync(propspath,renderedProps);
// 		// in this case, we have no template for the _nav.inc. they will be blank on creation
// 		fs.writeFileSync(navpath);

// 		// console.log(path + " files written");
// 	})

// })


// @TODO add config object and export a simple_page_creation function
var config = {
	// data object contains page data needed in templates, each page requires uniqueKey. Here we're processing an array into an object.
	data : subjects.map(function(item,index){var itemObj = {}; itemObj.courseID = item.toLowerCase(); itemObj.uniqueKey=itemObj.courseID; return itemObj;}),
	// paths for templates, w
	paths : {templates : "templates/", output:"output/"},
	templates : {props:"_props.mst", index:"index.mst", nav:"_nav.mst"},
	output_extension :".pcf",
	callback:callback,
	// @function filename
	// @param	item {string} string to be formatted into file name. return the unchanged id item if you don't need to change this.
	filename:function(item){return item.courseID.toLowerCase()}
};

var makePages = {
	// save our scope
	self : this,
	rendered: {},
	init: function(){
		// start our process. extend the main object to include config
		_.extend(makePages,config);
		console.log("makePages has been initiated.");
		this.make();
	},
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
	},
	write: function(pages){
		// we need to write each file to the path
		console.log(pages)
	},
	make: function(){
		// this is where we make all the pages
		// pages contains all the rendered pages we will output, we will send this to write()
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
		this.write(this.pages);
	}
};

// callback placeholder
function callback(data){
	console.log("default debug output:: ", data)
}

makePages.init();

