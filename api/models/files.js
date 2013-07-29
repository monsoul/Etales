var mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost/PAS');
var fileSchema = mongoose.Schema({
	fileName:String,
	fileSize:String,
	path:String,
	updateDate:Date
})

var fileModel = mongoose.model('File',fileSchema);

//create new record
exports.addFile = function(file,res) {
	console.log(file);
	file.save(function(err) {
		if(!err){
			res.statusCode = 201;
			res.end;
			console.log("created new file:"+file);
		} else {
			res.statusCode = 400;
			res.end();
			console.log(err);
		}
	});
	//return res.send(file);
}

//single record update

//list files
exports.findAllFiles = function(req, res) {
	console.log('in');
	return fileModel.find(function(err, files){
		if(!err){
			console.log('in2');
			return res.send(files);
			console.log('in3');
		} else {
			return console.log(err);
		}
	});
}

//find single record by id
exports.findFileById = function(id,res) {
	return fileModel.findById(id, function(file) {
		if (!err) {
			return res.send(file);
		} else {
			console.log(err);
			res.statusCode = 404;
		//	res.send({status:'404',message:'cannot find related record'});
			res.end();
		}

	})
} 

//remove a single product
exports.removeFileById = function(id, res) {
	return fileModel.findById(id, function(err, file){
		return file.remove(function(err) {
			if (!err){
				console.log("removed");
				return res.send('');
			} else {
				console.log(err);

			}
		})
	})
}


