var g_ping = 1;
var g_traceroute = 2;
var g_nslookup = 3;
function diagnosis(){
    $("#result").text("");
    clearError();
    var ret, ret1, ret2, target, count, postdata = {};
    count = $("#count").val();
    var reg = /[^0-9]+/g;
    if(count.match(reg)){
        $("#countError").text(str_diagnonse_invaldCount);
        $("#errorTr").show();
        return false;
    }
    if(parseInt(count) < 1 || parseInt(count) > 255){
        $("#countError").text(str_diagnonse_invaldCount);
        $("#errorTr").show();
        return false;
    }
    target =  $("#target").val();
    ret = isValidIP(target);
    ret1 = checkURL(target);
    ret2 = ret || ret1;
    if (ret2 == false) {
        $("#errorMsg").text(str_diagnose_invalid);
        return;
    }
    postdata.domain = target;
    stopLogoutTimer();
    stopAllTimer();
    showWaitingDialog(common_waiting,common_waitingmsg,dialog_align_left);
    setTimeout(function(){
        if($("#diagnose").val() == g_ping){
            postdata.count =count;
            postdata = JSON.stringify(postdata);
            saveAjaxJsonData("/action/exec_diag_ping", postdata, function(obj){
                if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                    $("#result").text(obj.result);
                    closeDialog();
                    startLogoutTimer();
                } else {
                    showResultDialog(common_result, common_failed,3000);
                }
            }, {
                async: false,
                timeout: 1000
            });
        }else if($("#diagnose").val() == g_traceroute){
            postdata.count =count;
            postdata = JSON.stringify(postdata);
            saveAjaxJsonData("/action/exec_diag_tracert", postdata, function(obj){
                if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                    $("#result").text(obj.result);
                    closeDialog();
                    startLogoutTimer();
                } else {
                    showResultDialog(common_result, common_failed,3000);
                }
            }, {
                async: false,
                timeout: 1000
            });
        }else if($("#diagnose").val() == g_nslookup){
            postdata = JSON.stringify(postdata);
            saveAjaxJsonData("/action/exec_diag_nslookup", postdata, function(obj){
                if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
                    $("#result").text(obj.result);
                    closeDialog();
                    startLogoutTimer();
                } else {
                    showResultDialog(common_result, common_failed,3000);
                }
            }, {
                async: false,
                timeout: 1000
            });
        }
    },0);


    startAllTimer();
}

function isValidIP(ip) {
    var ipArr, i, len;
    ipArr = ip.split(".");
    len = ipArr.length;
    if (len !== 4){
        return false;
    }
    for(i = 0; i < len; i++) {
        if (isNaN(ipArr[i]) === true) {
            return false;
        }
        if (ipArr[i].length === 0) {
            return false;
        }
        if (ipArr[i].indexOf(" ") !== -1) {
            return false;
        }
        if(ipArr[i].length > 1 && ipArr[i].indexOf("0")=== 0){
            return false;
        }
    }
    if ((ipArr[0] <= 0 || ipArr[0] == 127 || ipArr[0] > 223) ||
        (ipArr[1] < 0 || ipArr[1] > 255) ||
        (ipArr[2] < 0 || ipArr[2] > 255) ||
        (ipArr[3] < 0 || ipArr[3] > 255))
    {
        return false;
    }
    return true;
}
function checkURL(domainname) {
    if (domainname.length == 0) {
        return false;
    }
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
    if (re.test(domainname)){
        return true;
    }else{
        return false;
    }
}
function clearError(){
    $("#countError").text("");
    $("#errorMsg").text("");
    $("#errorTr").hide();
}
function initModePage(){
    document.title = str_diagnosis;
    $(".introduce h1").text(str_diagnosis);
    $(".introduce p").text(str_diagnosis_des);
    $("#apply").attr("value", str_diagnose).on("click", diagnosis);
    $("#diagnose").on("change",function(){
        clearError();
        if($("#diagnose").val()==g_ping){
            $("#count").val(5);
            $("#countTr").show();
        }else if($("#diagnose").val()==g_traceroute){
            $("#count").val(30);
            $("#countTr").show();
        }else if($("#diagnose").val()==g_nslookup){
            $("#countTr").hide();
        }
    })
}
