#!/usr/bin/env node

//var Q = require('q'),
//	FS = require('fs'),
//	PB = require('progress'),
//	AWS = require('aws-sdk'),
//	conf = new require('../config')();

import * as Q from 'q';
import * as FS from 'fs';
import * as AWS from 'aws-sdk';
import * as path from 'path';

let s3bucket = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
	apiVersion: 'latest',
});

function downloadFile(filename, inputFolder) {
	var deferred = Q.defer(),
		output = path.join(inputFolder, path.basename(filename)),
		stream = FS.createWriteStream(output),
		params = {
			Bucket: process.env.AWS_BUCKET_NAME,
			Key: filename
		};
	var bar;
	s3bucket.getObject(params).createReadStream()
		.on('end', () => {
			deferred.resolve(output);
		})
		.on('error', (error) => {
			deferred.reject(error);
		}).pipe(stream);
	return deferred.promise;
}

function deleteFolderRecursive(path) {
	if (FS.existsSync(path)) {
		FS.readdirSync(path).forEach(function (file, index) {
			var curPath = path + "/" + file;
			if (FS.lstatSync(curPath).isDirectory()) { // recurse
				deleteFolderRecursive(curPath);
			} else { // delete file
				FS.unlinkSync(curPath);
			}
		});
		FS.rmdirSync(path);
	}
}

const fileApi = {
	'getFiles': function (files, inputFolder) {
		return Q.all(files.map((file => downloadFile(file, inputFolder))));
	},
	'deleteFolder': deleteFolderRecursive
};

export default fileApi;

// *********** --------------------- *********** //
// *********** example usage: app.js *********** //
// *********** --------------------- *********** //
// #!/usr/bin/env node

// var Q = require('q'),
// fileAPI = require('./lib/file'),
// filenames = [
// 	'files/one.pdf',
// 	'files/two.pdf',
// 	'files/three.ppt',
// 	'files/four.ppt'
// ];

// fileAPI.getFiles(filenames)
// .then(console.log)
// .fail(function (error) {
// 	console.error('Error: ' + error.statusCode + ' - ' + error.message);
// });
// *********** // example usage: app.js *********** //

// *********** -------------- *********** //
// *********** example output *********** //
// *********** -------------- *********** //
//  files/one.pdf: [===================] 100% 0.0s
//  files/two.pdf: [===================] 100% 0.0s
//  files/three.ppt: [===================] 100% 0.0s
//  conversions/four.ppt: [===================] 100% 0.0s
// *********** // example output *********** //