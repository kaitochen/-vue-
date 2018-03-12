/*global Qiniu */
/*global plupload */
/*global FileProgress */
/*global hljs */

$(function() {
    var uploader = Qiniu.uploader({
        disable_statistics_report: true,
        makeLogFunc: 1,
        runtimes: 'html5,flash,html4',
        browse_button: 'pickfiles',
        container: 'container',
        drop_element: 'container',
        max_file_size: '500mb',
        //flash_swf_url: 'bower_components/plupload/js/Moxie.swf',
        dragdrop: true,
        chunk_size: '4mb',
        multi_selection: !(moxie.core.utils.Env.OS.toLowerCase()==="ios"),
        // uptoken: 'FMVCRs2-LO1ivRNi4l7mEZE6ZDvPv-519D12kZCO:uyCYSsZ2CARyiKgQG-91t7ZiR-s=:eyJzY29wZSI6InJ0Y3Rlc3QiLCJkZWFkbGluZSI6MjUwMDYyMjEzM30=',
        //uptoken_url : 'http://app.yscase.com/qiniu/upload/upload_token.php?1501661704642',
        unique_names: false,
        max_retries: 3,                     // 上传失败最大重试次数
        uptoken_func: function(){
            var ajax = new XMLHttpRequest();
            ajax.open('GET', $('#uptoken_url').val(), false);
            ajax.setRequestHeader("If-Modified-Since", "0");
            ajax.send();
            if (ajax.status === 200) {
                var res = JSON.parse(ajax.responseText);
                console.log('custom uptoken_func:' + res.data.token);
                return res.data.token;
            } else {
                console.log('custom uptoken_func err');
                return '';
            }
        },
        domain: $('#domain').val(),
        get_new_uptoken: true,
        // downtoken_url: '/downtoken',
        // unique_names: true,
        // save_key: true,
        // x_vars: {
        //     'id': '1234',
        //     'time': function(up, file) {
        //         var time = (new Date()).getTime();
        //         // do something with 'time'
        //         return time;
        //     },
        // },
        auto_start: true,
        log_level: 5,
        init: {
            'BeforeChunkUpload':function (up,file) {
                console.log("before chunk upload:",file.name);
            },
            'FilesAdded': function(up, files) {
                $('table').show();
                $('#success').hide();
                plupload.each(files, function(file) {
                    console.log('filetype: ' + file.type);
                    // if(file.type=='image/jpeg'||file.type=='image/jpg'||file.type=='image/png'||file.type=='image/gif' || file.type=='video/x-matroska' || file.type=='video/mp4'){
                    //     console.log('type:' + file.type);
                        // isUpload =true;
                        // file.album_name=album_name;
                        var progress = new FileProgress(file, 'fsUploadProgress');
                        progress.setStatus("等待...");
                        progress.bindUploadCancel(up);
                    // }else {
                    //     isUpload = false;
                    //     up.removeFile(file);
                    //     console.log('上传类型只能是.jpg,.png,.gif,.mkv');
                    //     return false;
                    // }
                });
            },
            'BeforeUpload': function(up, file) {
                console.log("this is a beforeupload function from init");
                var progress = new FileProgress(file, 'fsUploadProgress');
                var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                if (up.runtime === 'html5' && chunk_size) {
                    progress.setChunkProgess(chunk_size);
                }
            },
            'UploadProgress': function(up, file) {
                var progress = new FileProgress(file, 'fsUploadProgress');
                var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                progress.setProgress(file.percent + "%", file.speed, chunk_size);
            },
            'UploadComplete': function() {
                $('#success').show();
            },
            'FileUploaded': function(up, file, info) {
                var res = JSON.parse(info.response);
                $('.fileName').text(res.data.fileName)
                // var progress = new FileProgress(file, 'fsUploadProgress');
                // progress.setComplete(up, info);
                // console.log(file);
            },
            'Error': function(up, err, errTip) {
                $('table').show();
                var progress = new FileProgress(err.file, 'fsUploadProgress');
                progress.setError();
                progress.setStatus(errTip);
            }

            // ,
            // 'Key': function(up, file) {
            //     var key = "";
            //     // do something with key
            //     return key
            // }
        }
    });
    // uploader.bind('FilesAdded', function() {
    //     console.log("hello man, a file added");
    // });
    // uploader.bind('BeforeUpload', function () {
    //     console.log("hello man, i am going to upload a file");
    // });
    // uploader.bind('FileUploaded', function () {
    //     console.log('hello man,a file is uploaded');
    // });
    // $('#up_load').on('click', function(){
    //     uploader.start();
    // });
    // $('#stop_load').on('click', function(){
    //     uploader.stop();
    // });
    // $('#retry').on('click', function(){
    //     uploader.stop();
    //     uploader.start();
    // });
    // $('#container').on(
    //     'dragenter',
    //     function(e) {
    //         e.preventDefault();
    //         $('#container').addClass('draging');
    //         e.stopPropagation();
    //     }
    // ).on('drop', function(e) {
    //     e.preventDefault();
    //     $('#container').removeClass('draging');
    //     e.stopPropagation();
    // }).on('dragleave', function(e) {
    //     e.preventDefault();
    //     $('#container').removeClass('draging');
    //     e.stopPropagation();
    // }).on('dragover', function(e) {
    //     e.preventDefault();
    //     $('#container').addClass('draging');
    //     e.stopPropagation();
    // });



    // $('#show_code').on('click', function() {
    //     $('#myModal-code').modal();
    //     $('pre code').each(function(i, e) {
    //         hljs.highlightBlock(e);
    //     });
    // });


    // $('body').on('click', 'table button.btn', function() {
    //     $(this).parents('tr').next().toggle();
    // });


/*    var getRotate = function(url) {
        if (!url) {
            return 0;
        }
        var arr = url.split('/');
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i] === 'rotate') {
                return parseInt(arr[i + 1], 10);
            }
        }
        return 0;
    };*/
});
