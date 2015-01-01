/**
 * Created by Woz on 14/11/12.
 */
document.body.style.webkitTouchCallout='none'

Date.prototype.pattern=function(fmt) {
    var o = {
        "M+" : this.getMonth()+1, //月份
        "d+" : this.getDate(), //日
        "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
        "H+" : this.getHours(), //小时
        "m+" : this.getMinutes(), //分
        "s+" : this.getSeconds(), //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S" : this.getMilliseconds() //毫秒
    };
    var week = {
        "0" : "日",
        "1" : "一",
        "2" : "二",
        "3" : "三",
        "4" : "四",
        "5" : "五",
        "6" : "六"
    };
    if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    if(/(E+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "星期" : "/周") : "")+week[this.getDay()+""]);
    }
    for(var k in o){
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}

Date.prototype.addDays = function(days){
    return new Date(this.getFullYear(),this.getMonth(),this.getDate() + days);
}

var serviceRoot = "http://114.215.150.61:8882";

function getbyId(node,Id){
    if (Id == 'root') return node;

    for (var i in node.sub){
        if (node.sub[Id]){
            return node.sub[Id];
        }else{
            var r =  getbyId(node.sub[i],Id);
            if (r) return r;
        }
    }
    return null;
}

var WebApp= {
    ImIn: function (sessionId) {
        WebApp.sessionId = sessionId
    },
    ImOut: function () {
        WebApp.sessionId = null;
        WebApp.user = null;
    },
    isOut: function () {
        return null == WebApp.sessionId;
    },
    isIn: function () {
        return null != WebApp.sessionId;
    },
    rpc: function ($http, fn, opt) {
        if (!opt) opt = {};
        opt.sessionId = WebApp.sessionId;
        return $http.post(serviceRoot + fn, opt);
    },
    getNode: function (Id) {
        return getbyId(WebApp.categoryTree, Id);
    }
};



Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

String.prototype.evalJSON = function(){
    return eval('(' + this + ')');
}