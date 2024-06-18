var g_deviceInfo = {
        manufacturer:"",
        deviceName: "",
        softwareVersion: "",
        //modemVersion: "",
        //apVersion:"",
        //deviceType:"",
        hardwareVersion: "",
        lanMac: "",
        imei: "",
        meid: "",
        serial:""
};
var g_deviceStatus = {
    uptime:"",
    totalram:"",
    freeram:"",
    usageram:"",
    cpuusage:"",
    procs:""
};

function initModePage(){
    getDeviceInfo();
    getDeviceStatus();
    document.title = str_leftmenu_di;
    $(".introduce h1").text(str_deviceinfo);
    $(".introduce p").text(str_deviceinfo_des);
}
function getDeviceInfo(){
        getAjaxJsonData("/action/get_device_info", function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                g_deviceInfo.manufacturer = obj.man;
                g_deviceInfo.deviceName = obj.devname;
                g_deviceInfo.softwareVersion = obj.swv;
                //g_deviceInfo.modemVersion = obj.fwv;
                //g_deviceInfo.apVersion = obj.aswv;
                //g_deviceInfo.deviceType = obj.devtype;
                g_deviceInfo.hardwareVersion = obj.hwv;
                g_deviceInfo.lanMac = password_decode(obj.macaddr,g_priKey);
                g_deviceInfo.imei = password_decode(obj.imei,g_priKey);
                g_deviceInfo.meid = password_decode(obj.meid,g_priKey);
                g_deviceInfo.serial = password_decode(obj.sn,g_priKey);
                showDeviceInfo();
            }
        }, {
            async: false
        });

}
function getDeviceStatus(){
    getAjaxJsonData("/action/get_device_state", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
            g_deviceStatus.uptime = obj.uptime;
            g_deviceStatus.totalram = obj.totalram;
            g_deviceStatus.freeram = obj.freeram;
            g_deviceStatus.usageram = obj.usageram;
            g_deviceStatus.cpuusage = obj.cpuusage;
            g_deviceStatus.procs = obj.procs;
            showDeviceStatus();
        }
    }, {
        async: false
    });
    setTimeout(getDeviceStatus,3000);
}
function showDeviceStatus(){
    $("#cpu").text(g_deviceStatus.cpuusage+"%");
    $("#cpuUsage").width(g_deviceStatus.cpuusage*2.5+"px");
    $("#memory").text(transformRam(g_deviceStatus.usageram)+"/"+transformRam(g_deviceStatus.totalram));
    $("#memoryUsage").width(g_deviceStatus.usageram/g_deviceStatus.totalram*250+"px");
    $("#uptime").text(transformtime(g_deviceStatus.uptime));
    $("#procs").text(g_deviceStatus.procs);
}
function transformRam(ram){
    var b,kb,mb,gb;
    b = ram;
    kb = (ram/1024).toFixed(2);
    mb = (ram/1024/1024).toFixed(2);
    gb = (ram/1024/1024/1024).toFixed(2);
    if(gb == 0 && mb == 0 && kb < 1){
        return b+"B";
    }else if(gb == 0 && mb < 1){
        return kb + "KB";
    }else if(gb < 1){
        return mb + "MB";
    }else{
        return gb + "GB";
    }
}
function showDeviceInfo(){
    if (g_deviceInfo.manufacturer.length > 0) {
        $("#manufacturer").text(g_deviceInfo.manufacturer);
    } else {
        $("#manufacturer").text(common_unknown);
    }
    if (g_deviceInfo.deviceName.length > 0) {
        $("#devicename").text(g_deviceInfo.deviceName);
    } else {
        $("#devicename").text(common_unknown);
    }
    if (g_deviceInfo.softwareVersion.length > 0) {
        $("#softver").text(g_deviceInfo.softwareVersion);
    } else {
        $("#softver").text(common_unknown);
    }
    if (g_deviceInfo.imei.length > 0) {
        $("#imei").text(g_deviceInfo.imei);
    } else {
        $("#imei").text(common_unknown);
    }
    if (g_deviceInfo.hardwareVersion.length > 0) {
        $("#hardver").text(g_deviceInfo.hardwareVersion);
    } else {
        $("#hardver").text(common_unknown);
    }
    if (g_deviceInfo.lanMac.length > 0) {
        $("#lanmac").text(g_deviceInfo.lanMac);
    } else {
        $("#lanmac").text(common_unknown);
    }
    if (g_networkType == g_networkModeCDMA || g_networkType == g_networkModeEVDO) {
        $("#meidTr").show();
        if (g_deviceInfo.meid.length > 0) {
            $("#meid").text(g_deviceInfo.meid);
        } else {
            $("#meid").text(common_unknown);
        }
    } else {
        $("#meidTr").hide();
    }
    if (g_deviceInfo.serial.length > 0) {
        $("#serial").text(g_deviceInfo.serial);
    } else {
        $("#serial").text(common_unknown);
    }
}
