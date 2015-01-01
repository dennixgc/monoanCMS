var folderData={
    f000001:{title:'新闻动态首页图片',isImageFolder:true},
    f000002:{title:'新闻动态',isDocFolder:true},
    f000003:{title:'通知公告',isDocFolder:true},

    f000004:{title:'协同创新',isDocFolder:true},
    f000040:{title:'协同创新首页图片',isImageFolder:true,parent:'f000004'},
    f000041:{title:'平台管理',isDocFolder:true,parent:'f000004'},
    f000042:{title:'张江研究院',isDocFolder:true,parent:'f000004'},
    f000043:{title:'上海高校技术市场',isDocFolder:true,parent:'f000004'},
    f000044:{title:'平台通讯',isImageFolder:true,parent:'f000004'},
    f000045:{title:'平台通讯首页图片',isDocFolder:true,parent:'f000004'},

    f000005:{title:'科技参展工作'},
    f000050:{title:'科技参展工作首页图片',isImageFolder:true,parent:'f000005'},
    f000051:{title:'工博会',isDocFolder:true,parent:'f000005'},
    f000052:{title:'上交会',isDocFolder:true,parent:'f000005'},
    f000053:{title:'其他展会',isDocFolder:true,parent:'f000005'},
    f000054:{title:'历届优秀项目',isDocFolder:true,parent:'f000005'},

    f000006:{title:'产学研合作'},
    f000060:{title:'产学研合作首页图片',isImageFolder:true,parent:'f000006'},

    f000061:{title:'信息动态',isDocFolder:true,parent:'f000006'},
    f000062:{title:'技术转移体系建设',isDocFolder:true,parent:'f000006'},
    f000621:{title:'试点高校',isDocFolder:true,parent:'f000062'},

    f000063:{title:'产学研合作服务',isDocFolder:true,parent:'f000006'},
    f000631:{title:'区域合作平台',isDocFolder:true,parent:'f000063'},
    f000632:{title:'成果发布',isDocFolder:true,parent:'f000063'},
    f000633:{title:'难题招标',isDocFolder:true,parent:'f000063'},

    f000064:{title:'产学研合作项目',isDocFolder:true,parent:'f000006'},
    f000641:{title:'助推计划',isDocFolder:true,parent:'f000064'},
    f000642:{title:'中小企业合作',isDocFolder:true,parent:'f000064'},

    f000065:{title:'技术经纪服务',isDocFolder:true,parent:'f000006'},
    f000651:{title:'高校技术经纪公司',isDocFolder:true,parent:'f000065'},
    f000652:{title:'技术经纪中介项目',isDocFolder:true,parent:'f000065'},
    f000653:{title:'技术经纪委托服务',isDocFolder:true,parent:'f000065'},

    f000007:{title:'政策法规',isDocFolder:true},
    f000008:{title:'下载专区',isDocFolder:true},
    f000009:{title:'中心概况',isDocFolder:true}
};

var Db = require('mongodb').Db
    , Connection = require('mongodb').Connection
    , Server = require('mongodb').Server
    ,BSON = require('mongodb').BSONPure
    , format = require('util').format
    ,OriginalObjectID = require('mongodb').ObjectID;

var ObjectID =function(str){
    try{
        var oid = OriginalObjectID(str);
        return oid;
    }catch (e){
        console.log(e);
        return null;
    }
}
var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;

var mdb={};
function getDBCollection(db_alias,cList){
    Db.connect(format("mongodb://%s:%s/%s", host, port,db_alias), function(err, db) {
        console.log('MongoDB connected, host '+host);
        for (var i in cList){
            db.collection(cList[i], function(err, collection) {
                mdb[cList[i]] = collection;
            });
        }
    });
};

getDBCollection('webNG_V2_SESTDC',['WebNG_users','docPool']);

module.exports.getFolders=function(){
    for (var id in folderData ) folderData[id].Id = id;
    return folderData;
};
module.exports.newFile=function(opt,cb){
    cb('no _id for files now');
   console.log('TODO: Insert the file into DB or list files from folder (why not)');
};

module.exports.listDocsInFolder=function(folderId,cb){
    mdb.docPool.find({"folder.Id":folderId}).toArray(function(e,d){cb(d)});
};
module.exports.saveDoc=function(doc,cb){
    doc._id = ObjectID(doc._id);
    mdb.docPool.save(doc,function(err,d){
        var r = {_id:doc._id};
        cb(r)});
};
module.exports.removeDoc=function(_id,cb){
    var _id = ObjectID(_id);
    mdb.docPool.remove({_id:_id},function(err,d){
        console.log(_id + '    removed');
        cb(d)});
};
