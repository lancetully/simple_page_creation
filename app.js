var fs = require('fs'),
	mustache = require('mustache');

// using the subjects array, create files for each subject page.
// using *Sync methods to avoid callbacks for this simple script

// subjects is the array of subject IDs. 
var subjects = ["ACCT", "AGRI", "AGEC", "AGPS", "ASDC", "ANSC", "ANTH", "ARCH", "AUTO", "BSET", "BIOL", "BLCT", "BUAD", "CHEM", "CIVL", "COMP", "CISY", "CTRP", "CJUS", "DGMA", "DCAD", "ECON", "EDUC", "ELET", "ELTR", "EMET", "ENGR", "ESOL", "ENVR", "FILM", "FNAT", "FDSR", "FRSC", "GEOL", "GLST", "HPED", "MEDR", "HLTH", "HIST", "HUSR", "DSGN", "ITAL", "JAPN", "LITR", "MATT", "MKTG", "MATH", "MECH", "NASC", "NURS", "PHIL", "PHYS", "PLSC", "PSYC", "SOCI", "SPAN", "SPCH", "SPMG", "TMGT", "VETS", "WELD"],
	tmpl_props = fs.readFileSync("templates/_props.mst","utf8"),
	tmpl_index = fs.readFileSync("templates/index.mst","utf8");

// this would be more modular if we created the data object first and then iterated that, instead of working with a single array as a starting point
subjects.forEach(function(item){
	// set the destination path root
	var path = "output/"+item.toLowerCase(),
		// create the data object
		data = {course : item},
		// render the templates
		renderedProps = mustache.render(tmpl_props,data),
		renderedIndex = mustache.render(tmpl_index, data);

	// make the dir
	fs.mkdir(path, function(){
		// create file path for each file we're creating
		var indexpath = path+"/index.pcf",
		propspath = path+"/_props.pcf",
		navpath = path+"/_nav.inc";
		
		// write rendered html templates to the appropriate file
		fs.writeFileSync(indexpath,renderedIndex);
		fs.writeFileSync(propspath,renderedProps);
		// in this case, we have no template for the _nav.inc. they will be blank on creation
		fs.writeFileSync(navpath);

		console.log(path + " files written");
	})
	
})

// debug callback
function callback(data){
	console.log("default debug output:: ", data)
}