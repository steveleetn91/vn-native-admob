let exec = require('cordova/exec');
let vnnative = {
    connect : function(){
        exec(callback, (err) => {
            callback(err);
        }, "VnNativeAdmobSdk", "connect");
    },
    banner : function(){
        exec(callback, (err) => {
            callback(err);
        }, "VnNativeAdmobSdk", "connect");
    }
}
export default vnnative;