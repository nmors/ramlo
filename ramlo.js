#!/usr/bin/env node

var path = require('path');
var fs = require('fs');

var program = require('commander');
var chalk = require('chalk');
var sass = require('node-sass');
var jade = require('jade');

var pkg = require(path.join(__dirname, 'package.json'));
var api = require('./src/modules/api');
var helpers = require('./src/modules/helpers');



program
    .version(pkg.version)
    .option('-f, --file <path>', 'RAML input file')
    .parse(process.argv);

if (program.file) {
    var docFile = 'api.html';

    console.log(chalk.blue('starting ramlo...'));
    console.time('time');

    // check if RAML file exists
    var ramlFile = path.resolve(process.cwd(), program.file);

    try {
        fs.statSync(ramlFile);
    }
    catch(e) {
        console.log(chalk.red('provided file does not exist!'));
        process.exit(1);
    }

    // convert RAML to API object
    var ramlApi = api(ramlFile);




    // render html from jade template
    var html = jade.renderFile(path.join(__dirname, 'src/index.jade'), { api: ramlApi, helpers: helpers });

    // save html file with documentation
    fs.writeFileSync(path.resolve(process.cwd(), docFile), html);

    console.timeEnd('time');
    console.log(chalk.green('finished'));
}
else {
    program.outputHelp();
}