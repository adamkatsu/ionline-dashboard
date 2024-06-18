var g_proxyserveraddress;
var g_sipserveraddress;
var g_registerserverport;
var g_outboundserver;
var g_outboundport;
var g_protocol;
var g_tcp = 1;
var g_udp = 0;
var g_protocolstatus = [
    {
        value: g_tcp,
        name: str_server_tcp
    },
    {
        value: g_udp,
        name: str_server_udp
    }
];
function getSipServerData(){
    getAjaxJsonData("/action/get_sip_info", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            g_proxyserveraddress = obj.proxyserveraddress;
            g_sipserveraddress = obj.sipserveraddress;
            g_registerserverport = obj.serverport;
            g_outboundserver = obj.outboundProAddr;
            g_outboundport = obj.outTransport;
            g_protocol = obj.protocol;
        }
    }, {
        async: false
    });
}
function checkAddress(ip){
    var i, ipaddr;
    if (typeof ip !== "string") {
        return false;
    }
    ipaddr = ip.split(".");
    if (ipaddr.length !== 4) {
        return false;
    }
    for (i = 0; i < 4; i++) {
        if (ipaddr[i].length === 0){
            return false
        }
        if (isNaN(ipaddr[i])) {
            return false;
        }
        if (ipaddr[i].indexOf("0") === 0 && ipaddr[i].length !== 1){
            return false;
        }
        if (ipaddr.indexOf(" ") !== -1){
            return false;
        }
    }
    if ((ipaddr[0] <= 0 || ipaddr[0] === 127 || ipaddr[0] >= 223) ||
        (ipaddr[1] < 0 || ipaddr[1] > 255) ||
        (ipaddr[2] < 0 || ipaddr[2] > 255) ||
        (ipaddr[3] < 0 || ipaddr[3] > 255))
    {
        return false;
    }
    return true;
}
function checkport(port){
    var i, len, val, reg;
    reg = /[^0-9]+/g;
    if (port < 0 || port > 65535){
        return false;
    } else {
        val = port.split("-");
    }
    if(val.length>=3){
        return false;
    }
    len = val.length;
    for (i = 0; i < len; i++){
        if (val[i].match(reg)){
            return false;
        }
        if (val[i][0] === "0"){
            return false;
        }
    }
    if (len === 2) {
        if (parseInt(val[0]) > parseInt(val[1])){
            return false;
        }
        if (val[0].length===0 || parseInt(val[0])<0 || parseInt(val[0])>65535 || val[1].length===0 || parseInt(val[1])<0 || parseInt(val[1])>65535){
            return false;
        }
    }
    return true;
}
function checkdomainname(domainname){
    /*var reg = /((https|http|ftp|rtsp|mms):\/\/)?(([0-9a-z_!~*'().&=+$%-]+:)?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+\.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.[a-z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+\/?)/g;
    if(domainname.match(reg)){
        return false;
    }
    return true;*/
    var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
        + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
        + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
        + "|" // 允许IP和DOMAIN（域名）
        + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
        + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
        + "[a-z]{2,6})" // first level domain- .com or .museum
        + "(:[0-9]{1,4})?" // 端口- :80
        + "((/?)|" // a slash isn't required if there is no file name
        + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
    var re=new RegExp(strRegex);
    //re.test()
    if (re.test(domainname)){
        return true;
    }else{
        return false;
    }
}
function saveSipServerData(){
        clearAllTips();
        stopLogoutTimer();
        var proxyaddress, regaddress, regproxy, outboundserver, outboundport, protocol, postdata={};
        var ret;
        proxyaddress = $("#proxyaddress").val();
/*
        ret = checkAddress(proxyaddress);
        if(ret == false){
            $("#addrtips").text(str_address_tips);
            $("#addresstips").show();
            $("#proxyaddress").focus();
            return;
        }
        ret = checkdomainname(regaddress);
        if(ret == false){
            $("#addrtips").text(str_address_tips);
            $("#addresstips").show();
            $("#proxyaddress").focus();
            return;
        }
	*/
        postdata.proxyserveraddress = proxyaddress;
        regaddress = $("#regaddress").val();
/*
        ret = checkAddress(regaddress);
        if(ret == false){
            $("#regaddrtips").text(str_address_tips);
            $("#regaddresstips").show();
            $("#regaddress").focus();
            return;
        }
        ret = checkdomainname(regaddress);
        if(ret == false){
            $("#regaddrtips").text(str_address_tips);
            $("#regaddresstips").show();
            $("#regaddress").focus();
            return;
        }
*/
        postdata.sipserveraddress = regaddress;
        regproxy = $("#regproxy").val();
        ret = checkport(regproxy);
        if(ret == false){
            $("#regporttips").text(str_port_tips);
            $("#registrationporttips").show();
            $("#regproxy").focus();
            return;
        }
        postdata.serverport = regproxy;
        outboundserver = $("#outboundserver").val();
        postdata.outboundProAddr = outboundserver;
        outboundport = $("#outport").val();
        ret = checkport(outboundport);
        if(ret == false){
            $("#outporttips").text(str_port_tips);
            $("#outboundporttips").show();
            $("#outport").focus();
            return;
        }
        postdata.outTransport = outboundport;
        protocol = $("#protocol").children("option:selected").val();
        postdata.protocol = protocol;
        postdata = JSON.stringify(postdata);
        startLogoutTimer();
        saveAjaxJsonData("/action/set_sip_info", postdata, function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
                closeDialog();
                showResultDialog(common_result, common_success, 3000);
            } else {
                showResultDialog(common_result, common_failed, 3000);
            }
        }, {
            async: true

        });
}
function initSipInfo(){
    var i, html = "";

    $("#proxyaddress").val(g_proxyserveraddress);
    $("#regaddress").val(g_sipserveraddress);
    $("#regproxy").val(g_registerserverport);
    $("#outboundserver").val(g_outboundserver);
    $("#outport").val(g_outboundport);
    for(i=0;i<g_protocolstatus.length;i++){
        var option = "<option value='"+g_protocolstatus[i].value+"'>"+g_protocolstatus[i].name+"</option>";
        html+=option;
    }
    $("#protocol").html(html);
    for(i=0;i<g_protocolstatus.length;i++){
        if(g_protocol == g_protocolstatus[i].value){
            $("#protocol").val(g_protocol);
        }else{
            $("#protocol").val(g_protocolstatus[0].value);
        }
    }


}
function clearAllTips(){
    $("#addresstips").hide();
    $("#regaddresstips").hide();
    $("#registrationporttips").hide();
}
function initModePage(){
    document.title = str_sipserver;
    $(".introduce h1").text(str_sipserver);
    $(".introduce p").text(str_sipserver_des);
    startLogoutTimer();
    getSipServerData();
    initSipInfo();
    $("#apply").attr("value", common_apply).on("click", saveSipServerData);
}
