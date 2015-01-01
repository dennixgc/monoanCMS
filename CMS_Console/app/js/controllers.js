'use strict';
var serviceRoot;
serviceRoot = "";
serviceRoot = "http://localhost:9300";
var imageBaseUrl= "http://localhost/webNG/V2/ContentService/content_img_uploaded/";

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
    config:function(httpService){
        WebApp.http = httpService;
    },
    rpc: function (fn, opt) {
        if (!opt) opt = {};
        opt.sessionId = WebApp.sessionId;
        return WebApp.http.post(serviceRoot + fn, opt);
    },
    getNode: function (Id) {
        return getbyId(WebApp.categoryTree, Id);
    }
};
/* Controllers */
angular.module('myApp.controllers', [])
  .controller('webNGConsole', ['$scope','$upload',"$sce","$http", function($scope,$upload,$sce,$http) {
        WebApp.config($http);
        WebApp.rpc('/folders/getAll').success(function(d){
            console.log(d);
            $scope.folders = d;
        });
        $scope.onFileSelect=function(filesSelcetd){
            console.log(filesSelcetd);
            $scope.fileToUpload = filesSelcetd[0];
            $scope.fileUploadingName =$scope.fileToUpload.name;
            $scope.sendFile();
        };
        $scope.sendFile = function() {
            $scope.showUploadProgress = true;
            $scope.percentUpload = 0;
            $scope.upload = $upload.upload({
                url: serviceRoot + '/image/upload',
                data:{json:{
                    fileName:$scope.fileUploadingName,
                    filesize: $scope.fileToUpload.size
                }},
                file:  $scope.fileToUpload
            }).progress(function(evt) {
                $scope.percentUpload = parseInt(95.0 * evt.loaded / evt.total)
                console.log('percent: ' + $scope.percentUpload);
            }).success(function(data, status, headers, config) {
                $scope.showUploadProgress = false;
                console.log(data);
                $scope.showUpload=false;
            });
        };
        $scope.cancelSendFile=function(){
            $scope.showUpload=false;
            $scope.upload.abort();
        }

        $scope.docList=[];
        $scope.loadFolder=function(folder){
            if ($scope.editing){
                alert('请先保存或放弃正在编辑的文档');
            }else {
                WebApp.rpc('/doc/listByFolder', {folder: folder})
                    .success(function (d) {
                        console.log(d);
                        $scope.docList = d;
                        $scope.currentFolder = folder;
                        $scope.docEditing = null;
                        $scope.imageActive = null;
                    });
            }
        }
        $scope.doDocActive=function(d){
            if ($scope.editing){
                alert('请先保存或放弃正在编辑的文档');
            }else{
                if($scope.currentFolder.isDocFolder){
                    $scope.docEditing = d;
                    $scope.docEditing.htmlSafe = $sce.trustAsHtml($scope.docEditing.html);
                }
                if ($scope.currentFolder.isImageFolder){
                    $scope.imageActive = d;
                    console.log(d);
                }
            }
        }
        $scope.doNewDoc=function(){
            if ($scope.editing){
                alert('请先保存或放弃正在编辑的文档');
            }else{
                $scope.docEditing={type:'doc',newDoc:true,title:'',folder:$scope.currentFolder,html:''};
                //$scope.docList.unshift($scope.docEditing);
                $scope.doEditDoc();
            }
        }

        $scope.doEditDoc=function(){
            $scope.editing=true;
            console.log($scope.docEditing);
            editor.html($scope.docEditing.html);
        }

        $scope.doneEditDoc=function(){
            $scope.docEditing.html =  editor.html();
            $scope.docEditing.htmlSafe = $sce.trustAsHtml($scope.docEditing.html);
            $scope.editing=false;
            if ($scope.docEditing.newDoc) {
                $scope.docList.unshift($scope.docEditing);
                delete $scope.docEditing.newDoc;
            }
            WebApp.rpc('/doc/save',$scope.docEditing)
                .success(function(d){
                    $scope.docEditing._id = d._id;
                    console.log(d);
                });

        }
        $scope.cancelEdit=function(){
            $scope.editing=false;
        };
        $scope.doRemove=function(item){
            console.log(item);
            WebApp.rpc('/doc/delete',{_id: item._id}).success(function(data){
                $scope.docList.splice($scope.docList.indexOf(item),1);
            });
        }
        $scope.doNewImage=function(){
            if ($scope.editing){
                alert('请先保存或放弃正在编辑的图片');
            }else{
                $scope.imageActive={type:'image',newImage:true,title:'',folder:$scope.currentFolder};
                //$scope.docList.unshift($scope.docEditing);
                $scope.doEditImage();
            }
        }
        $scope.doEditImage=function(){
            $scope.editing=true;
        }

        $scope.doneEditImage=function(){
            $scope.editing=false;
            if ($scope.imageActive.newImage) {
                $scope.docList.unshift($scope.imageActive);
                delete $scope.imageActive.newImage;
            }
            WebApp.rpc('/doc/save',$scope.imageActive)
                .success(function(d){
                    $scope.imageActive._id = d._id;
                    console.log(d);
                });

        }

        $scope.onImageSelect=function(filesSelcetd){
            var fileToUpload = filesSelcetd[0];
            $scope.imagePercentUpload = 0;
            $scope.imageUpload = $upload.upload({
                url: serviceRoot + '/image/upload',
                file:  fileToUpload
            }).progress(function(evt) {
                $scope.imagePercentUpload = parseInt(95.0 * evt.loaded / evt.total)
            }).success(function(data, status, headers, config) {
                console.log(data);
                $scope.imageActive.url = imageBaseUrl + data.filename;
            });
        };
        $scope.cancelImageSendFile=function(){
            $scope.showUpload=false;
            $scope.imageUpload.abort();
        }
  }])
 ;