'use strict';

/* Filters */

angular.module('myApp.filters', [])
    .filter('nameOnly',function(){
        return function(nodeList) {
            var result = [];
            for (var i in nodeList){ result.push ( nodeList[i].name)};
            return result;
        };
    })
    .filter('aclName',function(){
        return function(acl) {
            return WebApp.getNode(acl).name;
        };
    })
    .filter('statusIcon',function(){
        return function(status) {
            if (status == undefined) status = 'new';
            return 'img/statusIcons/' + status + '.png';
        };
    })
    .filter('switchIcon',function(){
        return function(yes) {
            return yes?'\u2713' : '\u2718';
        };
    })
    .filter('ObjectId2Date',function(){
        return function(_id){
            return new Date(parseInt(_id.slice(0,8), 16)*1000).toLocaleString();
        }
    })
    .filter('sizeDisplay',function(){
        return function(size){
            if (size > 1000000){
                var M = (size /  1000000.0).toString().split('.');
                if (M.length == 1){
                    return M[0] + ' MB';
                }else{
                    var p2 = M.pop().substr(0,2);
                    var p1 = M.pop();
                    return p1 + '.' + p2 + ' MB';
                }
            }
            if (size > 1000){
                var M = (size /  1000.0).toString().split('.');
                if (M.length == 1){
                    return M + ' KB';
                }else{
                    var p2 = M.pop().substr(0,2);
                    var p1 = M.pop();
                    return p1 + '.' + p2 + ' KB';
                }
            }
            return size + ' B';
        }
    })
    .filter('inFolder',function(){
        return function(List, folder){
            var r=[];
            for (var i in List){if (List[i].parent == folder) r.push(List[i])};
            return r;
        }
    })