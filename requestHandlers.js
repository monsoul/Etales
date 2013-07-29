var querystring = require("querystring"),
    fs = require("fs"),
    mongoose = require('mongoose'),
    File = require('./api/models/files.js'),
    formidable = require("formidable");



var myModel = mongoose.model('File');
//首页
function index(response,request) {
console.log("Request handler 'start' was called.");

  var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" '+
    'content="text/html; charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" enctype="multipart/form-data" '+
    'method="post">'+
    '<input type="file" name="upload" multiple="multiple">'+
    '<input type="submit" value="Upload file" />'+
    '</form>'+
    '</body>'+
    '</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

//上传文件
function upload(response, request) {
  console.log("Request handler 'upload' was called.");
  var myDate = new Date();
  var form = new formidable.IncomingForm();
  console.log("about to parse");
  form.parse(request, function(error, fields, files) {
    console.log("parsing done");

    var newfile=new myModel();
    var time=myDate.getTime();
    var lastname=time+parseInt(Math.random()*1000)+"."+files.upload.name.substring(files.upload.name.lastIndexOf('.')+1, files.upload.name.length).toLowerCase();
    var path="./upload/files/";
    var newname=path+lastname;
    fs.rename(files.upload.path, newname, function(err) {
      if (err) {
        fs.unlink(newname);
        fs.rename(files.upload.path,newname);
      }
    });

    newfile.fileName=lastname;
    newfile.path=path;
    newfile.fileSize=files.upload.size;
    newfile.updateDate=Date();
    
    File.addFile(newfile,response);//newfile.addFile;

    if(response.statusCode=="200"){
      response.writeHead(200, {"Content-Type": "text/html"});
      response.write("success:<br/>");
    }
    else{
      response.writeHead(400, {"Content-Type": "text/html"});
      response.write("fail:<br/>");
    }
    response.write(JSON.stringify(newfile));
    response.end();
  });
}

function show(id,response) {
  console.log("Request handler 'show' was called.");
  response.writeHead(200, {"Content-Type": "image/png"});
  fs.createReadStream("/tmp/test.png").pipe(response);
}

exports.index = index;
exports.upload = upload;
exports.show = show;