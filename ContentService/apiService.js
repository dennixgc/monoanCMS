var PORT_webNG_Content_Service=9300;

var express = require('express');
var app = express();
var busboy = require('connect-busboy');
var bodyParser = require('body-parser');
var uuid=require('uuid');
var util=require('util');
var crypto = require('crypto');
var fs=require('fs');
var async=require('async');

var auth=require('./biz_modules/auth.js');
var contents=require('./biz_modules/contents.js');

var img_upload_path = __dirname + '/content_img_uploaded/';
var img_url="http://localhost/webNG/V2/ContentService/content_img_uploaded/";

var CROS_OK=function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Method","POST, GET, OPTIONS");
    res.header("Access-Control-Allow-Headers","Content-Type,X-Requested-With");
    res.header('Access-Control-Max-Age','1000');
    res.header('Access-Control-Allow-Headers','Content-Type');
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires",0);
    next();
}

var CheckSession=function(req,res,next){

    next();
}
app.use(CROS_OK);
app.use(busboy());
app.use( bodyParser.json() );       // to support JSON-encoded bodies
//app.use( bodyParser.urlencoded() );
app.use(CheckSession);

app.options("*",function(req,res){res.end('Good day');});
app.listen(PORT_webNG_Content_Service);
console.log('webNG content Service listening on ' + PORT_webNG_Content_Service);

app.post('/image/upload',function(req,res){
    var fileMeta;
    try{
        req.busboy.on('field',function(k,v){
            if (k == 'json') fileMeta =JSON.parse(v);
        });
        req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
            var fileId =   uuid.v4();
            file.pipe(fs.createWriteStream(img_upload_path + fileId + '_' + filename));
            file.on('end', function() {
                console.log('File <' + filename + '> in  [' + fieldname + '] recieving finished');
                var opt={filename:fileId};
                contents.newFile(opt,function(_id){
                    res.json({filename:fileId + '_' + filename, _id:_id});
                });
            });
        });
        req.pipe(req.busboy)
    }catch(e){
        res.status(400).json(e);
    }
});

app.get('/image/list',function(req,res){
    var d = [];
    fs.readdir(img_upload_path,function(err,files){ console.log(files);
        async.each(files, function( file, callback) {
            fs.stat(img_upload_path + file, function(err,info){
                d.push({filename:file,datetime:info.ctime,filesize:info.size,is_dir:false,had_file:false,is_photo:true,filetype:''});
                console.log(file);
                callback();
            })
        }, function(err){
            var r={
                "moveup_dir_path":"",
                "current_dir_path":"",
                "current_url":img_url,
                "total_count":files.length,
                "file_list":d
            };
            res.json(r);
        });
    });
})

app.post('/folders/getAll',function(req,res){
    res.json(contents.getFolders());
})
app.post('/doc/listByFolder',function(req,res){
    contents.listDocsInFolder(req.body.folder.Id,function(d){res.json(d)});
})
app.post('/doc/save',function(req,res){
    contents.saveDoc(req.body,function(d){res.json(d)});
})
app.post('/doc/delete',function(req,res){
    contents.removeDoc(req.body._id,function(d){res.json(d)});
})

