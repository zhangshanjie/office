function getString(name) {
    var urlparams = location.search;
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = urlparams.substr(1)
        .match(reg);
    if (r != null) return r[2];
    return null;
}
var isTest = (location.host.match(/192|122|127|172|36.7|localhost|:8081|:8080|169.254|10[.]0/) != null && getString('isTest') !== '0') || getString('isTest') === '1';

// export const BASEURL = '//transition.co-new.cn/'
export const BASEURL = isTest ? '//47.99.72.232:8887' : '//endmanager.znccc.cn'