var g_psdMinLength = 8;
var g_psdMaxLength = 36;
var g_usernameMinLength = 5;
var g_usernameMaxLength = 15;
var g_curusernameIncorrect = 200;
var g_curpsdIncorrect = 211;
var key = "0123456789";
function clearAllTips(){
    $("#curusernametips").hide();
    $("#curUntips").text("");
    $("#newusernametips").hide();
    $("#newUntips").text("");
    $("#curpsdtips1").hide();
    $("#curtips1").text("");
    $("#curpsdtips").hide();
    $("#curtips").text("");
    $("#newpsdtips").hide();
    $("#newtips").text("");
    $("#confirmpsdtips").hide();
    $("#confirmtips").text("");
}
function checkCurUsername(username){
    var reg = /[^!#$()*.\-\/0-9=@A-Z\[\]^_`a-z{}|~]/g;

    if (username.length > g_usernameMaxLength || username.length < g_usernameMinLength) {
        $("#curUntips").text(str_system_curusernametipslength.replace("%s", g_usernameMinLength).replace("%e", g_usernameMaxLength));
        $("#curusernametips").show();
        return false;
    }
    if (username.match(reg)) {
        $("#curUntips").text(str_system_curusernametipsmatch);
        $("#curusernametips").show();
        return false;
    }
    return true;
}
function checkNewUsername(username){
    var reg = /[^!#$()*.\-\/0-9=@A-Z\[\]^_`a-z{}|~]/g;

    if (username.length > g_usernameMaxLength || username.length < g_usernameMinLength) {
        $("#newUntips").text(str_system_newusernametipslength.replace("%s", g_usernameMinLength).replace("%e", g_usernameMaxLength));
        $("#newusernametips").show();
        return false;
    }
    if (username.match(reg)) {
        $("#newUntips").text(str_system_newusernametipsmatch);
        $("#newusernametips").show();
        return false;
    }
    return true;
}
function checkCurPsd1(psd){
    var reg = /^(?![A-z0-9]+$)(?=.[^%&',;=?$\x22])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,36}$/;
    if (psd.length > g_psdMaxLength || psd.length < g_psdMinLength) {
        $("#curtips1").text(str_system_curpsdtipslength.replace("%s", g_psdMinLength).replace("%e", g_psdMaxLength));
        $("#curpsdtips1").show();
        return false;
    }
    if (reg.test(psd)) {
        return true;
    }else{
        $("#curtips1").text(str_system_curpsdtipsmatch);
        $("#curpsdtips1").show();
        return false;
    }
    return true;
}
function checkUserCurPsd1(psd){
    var reg = /^(?![A-z0-9]+$)(?=.[^%&',;=?$\x22])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,36}$/;
    if (psd.length > g_psdMaxLength || psd.length < g_psdMinLength) {
        $("#curtips1").text(str_system_curpsdtipslength.replace("%s", g_psdMinLength).replace("%e", g_psdMaxLength));
        $("#curpsdtips1").show();
        $("#curpsd1").focus();
        return false;
    }
    if (reg.test(psd)) {
        return true;
    } else {
        $("#curtips1").text(str_system_curpsdtipsmatch);
        $("#curpsdtips1").show();
        $("#curpsd1").focus();
        return false;
    }
    return true;
}
function checkCurPsd(psd){
    var reg = /[^!#$()*.\-\/0-9=@A-Z\[\]^_`a-z{}|~]/g;
    if (psd.length > g_psdMaxLength || psd.length < 5) {
        $("#curtips").text(str_system_curpsdtipslength.replace("%s", 5).replace("%e", g_psdMaxLength));
        $("#curpsdtips").show();
        $("#curpsd").focus();
        return false;
    }
    if (psd.match(reg)) {
        $("#curtips").text(str_system_curpsdtipsmatchss);
        $("#curpsdtips").show();
        $("#curpsd").focus();
        return false;
    }
    return true;
}

function checkNewPsd(psd){
    var reg = /^(?![A-z0-9]+$)(?=.[^%&',;=?$\x22])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,36}$/;
    var reg1 = /[^!#$()*.\-\/0-9=@A-Z\[\]^_`a-z{}|~]/g;
    if (psd.length > g_psdMaxLength || psd.length < g_psdMinLength) {
        $("#newtips").text(str_system_newpsdtipslength.replace("%s", g_psdMinLength).replace("%e", g_psdMaxLength));
        $("#newpsdtips").show();
        $("#newpsd").focus();
        return false;
    }
    if(psd.indexOf("O")>=0 || psd.indexOf("I")>=0 || psd.indexOf("l")>=0 || psd.indexOf("0")>=0 ||psd.indexOf("1")>=0){
        $("#newtips").text(str_system_newpsdtipsmatch);
        $("#newpsdtips").show();
        $("#newpsd").focus();
        return false;
    }
    if (!reg.test(psd)) {// || 
        $("#newtips").text(str_system_newpsdtipsmatch);
        $("#newpsdtips").show();
        $("#newpsd").focus();
        return false;
    }
    if (psd.match(reg1)) {
        $("#newtips").text(str_system_vpnpsdtipsmatch);
        $("#newpsdtips").show();
        $("#newpsd").focus();
        return false;
    }
    return true;
}
function primary(){
    $("p.pwdColor span").removeClass("co1,co2,co3");
}

function weak(){
    $("span.c1").addClass("co1");
    $("span.c2").removeClass("co2");
    $("span.c3").removeClass("co3");
}

function middle(){
    $("span.c1").addClass("co1");
    $("span.c2").addClass("co2");
    $("span.c3").removeClass("co3");
}
function strong(){
    $("span.c1").addClass("co1");
    $("span.c2").addClass("co2");
    $("span.c3").addClass("co3");
}

function checkpwd(obj){
    let password = $.trim(obj.val());
    // �����д��ڴ�д��ĸ��Сд��ĸ�����֡������ַ��ĸ���
    let uppercase = /[A-Z]/.test(password);
    let lowercase = /[a-z]/.test(password);
    let digit = /\d/.test(password);
    let special = /[^A-Za-z0-9]/.test(password);
    // �ж�����ǿ��
    let strength = 0;
    if (uppercase) strength++;
    if (lowercase) strength++;
    if (digit) strength++;
    if (special) strength++;
    if(password.length < 1){
        primary();
    }
    if (password.length < 12) {
        weak()
    }
    if(password.length >= 12 && password.length <= 36){
        if (strength === 4) {
            console.log("����ǿ��ǿ")
            strong();
        } else if (strength >= 2 && strength <= 3) {
            console.log("����ǿ������")
            middle();
        } else {
            console.log("����ǿ����")
            weak()
        }
    }
}
function checkConfirmPsd(psd){
    var reg = /^(?![A-z0-9]+$)(?=.[^%&',;=?$\x22])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,36}$/;
    var reg1 = /[^!#$()*.\-\/0-9=@A-Z\[\]^_`a-z{}|~]/g;
    if (psd.length > g_psdMaxLength || psd.length < g_psdMinLength) {
        $("#confirmtips").text(str_system_conpsdtipslength.replace("%s", g_psdMinLength).replace("%e", g_psdMaxLength));
        $("#confirmpsdtips").show();
        return false;
    }
    if(psd.indexOf("O")>=0 || psd.indexOf("I")>=0 || psd.indexOf("l")>=0 || psd.indexOf("0")>=0 ||psd.indexOf("1")>=0){
        $("#confirmtips").text(str_system_conpsdtipsmatch);
        $("#confirmpsdtips").show();
        $("#confirmpsd").focus();
        return false;
    }
    if (!reg.test(psd)) {
        $("#confirmtips").text(str_system_conpsdtipsmatch);
        $("#confirmpsdtips").show();
        $("#confirmpsd").focus();
        return false;
    }
    if (psd.match(reg1)) {
        $("#confirmtips").text(str_system_vpnpsdtipsmatch);
        $("#confirmpsdtips").show();
        $("#confirmpsdtips").focus();
        return false;
    }
    return true;
}
function saveNewUserName(){
    var ret, curusername, newusername, curpsd1, postdata={};
    curusername = $("#curusername").val();
    newusername = $("#newusername").val();
    curpsd1 = $("#curpsd1").val();
    clearAllTips();
    if (curusername.length === 0) {
        $("#curUntips").text(str_system_curusernametips);
        $("#curusernametips").show();
        return;
    }
    ret = checkCurUsername(curusername);
    if (ret === false) {
        return;
    }
    if (newusername.length === 0) {
        $("#newUntips").text(str_system_newusernametips);
        $("#newusernametips").show();
        return;
    }
    ret = checkNewUsername(newusername);
    if (ret === false) {
        return;
    }
    if (curusername === newusername) {
        $("#newUntips").text(str_system_curnewusernametipssame);
        $("#newusernametips").show();
        return;
    }
    if (curpsd1.length === 0) {
        $("#curtips1").text(str_system_curpsdtips);
        $("#curpsdtips1").show();
        return;
    }
    ret = checkUserCurPsd1(curpsd1);
    if (ret === false) {
        return;
    }

    postdata.o_username = hex_hmac_md5(key,curusername);
    postdata.n_username = hex_hmac_md5(key,newusername);
    postdata.o_passwd = password_encode(hex_hmac_md5(key,curpsd1),g_priKey,g_timestamp,g_timestamp_start);
    postdata = JSON.stringify(postdata);
    startLogoutTimer();

    saveAjaxJsonData("/action/modify_username", postdata, function(obj){

        if (typeof obj.retcode === "number") {
            if (obj.retcode === g_resultSuccess) {
                stopAllTimer();
                showTipsDialog(common_info, common_success,function(){
                    setTimeout(do_logout,3000);
                });
            } else if (obj.retcode === g_curusernameIncorrect) {
                $("#curUntips").text(str_system_curusernametipswrong);
                $("#curusernametips").show();
            } else if (obj.retcode === g_curpsdIncorrect) {
                $("#curtips1").text(str_system_curpsdtipswrong);
                $("#curpsdtips1").show();
            }
        }
    }, {

    });
}
function saveNewPassWord(){
    var ret, curpsd, newpsd, confirmpsd, postdata={};
    curpsd = $("#curpsd").val();
    newpsd = $("#newpsd").val();
    confirmpsd = $("#confirmpsd").val();

    clearAllTips();
    if (curpsd.length === 0) {
        $("#curtips").text(str_system_curpsdtips);
        $("#curpsdtips").show();
        return;
    }
    ret = checkCurPsd(curpsd);
    if (ret === false) {
        return;
    }
    if (newpsd.length === 0) {
        $("#newtips").text(str_system_newpsdtips);
        $("#newpsdtips").show();
        return;
    }
    ret = checkNewPsd(newpsd);
    if (ret === false) {
        return;
    }
    if (curpsd == newpsd) {
        $("#newtips").text(str_system_curnewpsdtipssame);
        $("#newpsdtips").show();
        return;
    }
    if (confirmpsd.length === 0) {
        $("#confirmtips").text(str_system_conpsdtips);
        $("#confirmpsdtips").show();
        return;
    }
    ret = checkConfirmPsd(confirmpsd);
    if (ret === false) {
        return;
    }

    if (newpsd !== confirmpsd) {
        $("#confirmtips").text(str_system_conpsdtips_notsame);
        $("#confirmpsdtips").show();
        return;
    }

    postdata.o_passwd = password_encode(hex_hmac_md5(key,curpsd),g_priKey,g_timestamp,g_timestamp_start);
    postdata.n_passwd = password_encode(hex_hmac_md5(key,newpsd),g_priKey,g_timestamp,g_timestamp_start);
    postdata.c_passwd = password_encode(hex_hmac_md5(key,confirmpsd),g_priKey,g_timestamp,g_timestamp_start);
    postdata = JSON.stringify(postdata);
    startLogoutTimer();

    saveAjaxJsonData("/action/modify_password", postdata, function(obj){

        if (typeof obj.retcode === "number") {
            if (obj.retcode === g_resultSuccess) {
                stopAllTimer();
                showTipsDialog(common_info, common_success,function(){
                    setTimeout(do_logout,3000);
                });
            } else if (obj.retcode === g_curpsdIncorrect) {
                $("#curtips").text(str_system_curpsdtipswrong);
                $("#curpsdtips").show();
            }
        }
    }, {

    });
}
function ShowPsw(){
    var biyanjing = document.getElementById("biyanjing");
    var demoInput = document.getElementById("newpsd");
    if (demoInput.type == "password") {
        demoInput.type = "text";
        biyanjing.src = "../images/yanjing_kai.png";

    }else {
        demoInput.type = "password";
        biyanjing.src = "../images/yanjing_bi.png";
    }
}

function curpsd1Psw(){
    var curpsd1Yan = document.getElementById("curpsd1Yan");
    var curpsd1Input = document.getElementById("curpsd1");
    if (curpsd1Input.type == "password") {
        curpsd1Input.type = "text";
        curpsd1Yan.src = "../images/yanjing_kai.png";
    }else {
        curpsd1Input.type = "password";
        curpsd1Yan.src = "../images/yanjing_bi.png";
    }
}
function curpsdPsw(){
    var curpsdYan = document.getElementById("curpsdYan");
    var curpsdInput = document.getElementById("curpsd");
    if (curpsdInput.type == "password") {
        curpsdInput.type = "text";
        curpsdYan.src = "../images/yanjing_kai.png";
    }else {
        curpsdInput.type = "password";
        curpsdYan.src = "../images/yanjing_bi.png";
    }
}
function confirmpsd(){
    var confirmpsdYan = document.getElementById("confirmpsdYan");
    var confirmpsdInput = document.getElementById("confirmpsd");
    if (confirmpsdInput.type == "password") {
        confirmpsdInput.type = "text";
        confirmpsdYan.src = "../images/yanjing_kai.png";
    }else {
        confirmpsdInput.type = "password";
        confirmpsdYan.src = "../images/yanjing_bi.png";
    }
}
function initModePage(){
    document.title = str_leftmenu_sa;
    $(".introduce h1").text(str_admin);
    $(".introduce p").text(str_admin_des);
    clearAllTips();
    $("#newpsd").on("keyup", function(){
        var psd;
        psd = $(this).val();
        if (typeof psd !== "string") {
            return false;
        }
        if (psd.length < g_psdMinLength) {
            return true;
        }
    });
    $("#apply-psw").attr("value", common_apply);
    $("input#newpsd").keyup(function(){
        var txt=$(this).val(); 
        var len=txt.length;
        if(txt=='' || len<6){
            $("label").show();
            $("label").addClass("tips");
        }else {
            $("label").hide();
        }
        checkpwd($(this));
    });
    $("#apply-psw").on("mousedown",function(e){
        e.preventDefault();
    });
    $("#apply-psw").on("click",function(){
        $(".pwdColor").addClass("hide");
        saveNewPassWord();
    });
    $("#newpsd").focus(function () {
        $(".pwdColor").removeClass("hide");
    }).blur(function () {
        $(".pwdColor").addClass("hide");
    });
}
