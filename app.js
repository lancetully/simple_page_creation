var makePages = require('./local_modules/makePages.js');

var config = {
	paths : {templates : "templates/", output:"output/"},
	debug:false
};

makePages.init(config);