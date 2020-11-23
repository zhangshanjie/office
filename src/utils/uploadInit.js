var accessid = '阿里云的accessid'; // 你阿里云的accessid 
var accesskey = '阿里云的accesskey'; // 你阿里云的accesskey 
var host = 'http://blockname.oss-cn-shenzhen.aliyuncs.com'; // 你阿里云的blockname和地区请对应更改

var objectNname = ' ';
var policyText = {
    "expiration": "2020-01-01T12:00:00.000Z", //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
    "conditions": [
    ["content-length-range", 0, 2097152] // 设置上传文件的大小限制
    ]
};
import { Base64 } from 'js-base64';
var Crypto = require('crypto');
console.log(Crypto,'-------')
var policyBase64 = Base64.encode(JSON.stringify(policyText))
var message = policyBase64;
var bytes = Crypto.Hmac(Crypto.SHA1, message, accesskey, { asBytes: true });
var signature = Crypto.util.bytesToBase64(bytes);
function add0(m) { return m < 10 ? '0' + m : m }
function getNewTime(now) {
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    var millsecond = now.getMilliseconds()
    return year + '' + add0(month) + '' + add0(date) + '' + add0(hour) + '' + add0(minute) + '' + add0(second) + '' + add0(millsecond);
}
function set_upload_param(up, filename, ret) {
    objectNname = '';
    if (filename != '') {
        objectNname = getNewTime(new Date()) + 'web';
    }
    new_multipart_params = {
        'key': objectNname,
        'policy': policyBase64,
        'OSSAccessKeyId': accessid,
        'success_action_status': '200', //让服务端返回200,不然，默认会返回204
        'signature': signature,
    };

    up.setOption({
        'url': host,
        'multipart_params': new_multipart_params
    });
}
function uploadInit() {
    // this 即 editor 对象
    var editor = this;
    // 编辑器中，触发选择图片的按钮的id
    var btnId = editor.customUploadBtnId;
    // 编辑器中，触发选择图片的按钮的父元素的id
    var containerId = editor.customUploadContainerId;

    //实例化一个上传对象
    var uploader = new plupload.Uploader({
        browse_button: btnId,  // 选择文件的按钮的id
        url: 'http://oss.aliyuncs.com', // 服务器端的上传地址
        flash_swf_url: 'lib/plupload/plupload/Moxie.swf',
        sliverlight_xap_url: 'lib/plupload/plupload/Moxie.xap',
        filters: {
            mime_types: [
                //只允许上传图片文件 （注意，extensions中，逗号后面不要加空格）
                { title: "图片文件", extensions: "jpg,gif,png,bmp" }
            ],
            max_file_size: '2097152'
        },
        init: {
            FilesAdded: function (up, files) {
                //显示添加进来的文件信息
                plupload.each(files, function (file) {
                    console.log('文件名:' + file.name + '文件大小:' + plupload.formatSize(file.size));
                });
                // 文件添加之后，开始执行上传
                uploader.start();
            },

            BeforeUpload: function (up, file) {
                set_upload_param(up, file.name, true);
            },

            UploadProgress: function (up, file) {
                // 显示进度条
                editor.showUploadProgress(file.percent);
            },

            FileUploaded: function (up, file, info) {
                if (info.status == 200) {
                    var url = host + '/' + objectNname;
                    console.log('上传成功 ', url);
                    // 插入到编辑器中
                    editor.command(null, 'insertHtml', '<img src="' + url + '?x-oss-process=style/img_800_x" style="max-width:100%;"/>');
                }
                else {
                    console.log('上传失败', info.response);
                }
            },

            Error: function (up, err) {
                alert('上传失败', err.response);
            },
            UploadComplete: function () {
                //队列文件处理完毕后,处理相关的事情
                console.log('on UploadComplete');
                // 隐藏进度条
                editor.hideUploadProgress();
            }
        }
    });
    uploader.init();
}
export default uploadInit;