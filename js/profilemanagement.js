/**
 * Created by Administrator on 2017/8/8.
 */
var g_maxProfileNum = 20;
 var g_maxProfilenameLength = 31;
 var g_minProfilenameLength = 1;
 var g_profileReadonly = 1;
var g_profileReadonly2 = 2;
 var g_profileAuthNONE = 0;
 var g_profileAuthPAP = 1;
 var g_profileAuthCHAP = 2;
 var g_profileAuthAUTO = 3;
var pinStatus;
var g_notVerified = 1;
var g_pinBlocked = 2;
var queryCount = 5;

 var g_profileAuthMode = [
 {
 auth: g_profileAuthNONE,
 name: str_dialup_authmodenone
 },
 {
 auth: g_profileAuthAUTO,
 name: str_dialup_authmodeauto
 },
 {
 auth: g_profileAuthPAP,
 name: str_dialup_authmodepap
 },
 {
 auth: g_profileAuthCHAP,
 name: str_dialup_authmodechap
 }
 ];
var g_profileIptypeIpv4 = 1;
var g_profileIptypeIpv6 = 2;
var g_profileIptypeIpv4v6 = 3;

 var g_profileList;
 var g_defaultProfileID;

var g_profileIPType = [
    {
        type: g_profileIptypeIpv4,
        name: str_dialup_iptypeipv4
    },
    {
        type: g_profileIptypeIpv6,
        name: str_dialup_iptypeipv6
    },
    {
        type: g_profileIptypeIpv4v6,
        name: str_dialup_iptypeipv4v6
    }
];
function initModePage(){
    document.title = str_leftmenu_mc;
    getSimStatus();
    getProfileInfo();
    if(!g_profileList && queryCount > 0){
        queryCount--;
        setTimeout(initModePage,3000);
        $("#apply").attr("value", common_apply);
        $("#del").attr("value", common_del);
        $("#newprofile").attr("value", str_dialup_newprofile);
        return false;
    }
    $("#apply").attr("value", common_apply);
    $("#del").attr("value", common_del);
    $("#newprofile").attr("value", str_dialup_newprofile);

    $(".introduce h1").text(str_mobile_connection);
    $(".introduce p").text(str_mobile_connection_des);
    var i, len, html, $newprofile;
    var option = "<option value=\"%d\">%s</option>";

    len = g_profileList.length;
    if (len <= 0){
        $("#carriername").attr("disabled", "disabled");
        $("#mobileusername").attr("disabled", "disabled");
        $("#mobilepassword").attr("disabled", "disabled");
        $("#authenticationtype").attr("disabled", "disabled");
        $("#ip-type").attr("disabled", "disabled");
        $("#apn").attr("disabled", "disabled");
        $("#apply").hide();
        $("#del").hide();
        $("#newprofile").on("click", function() {
            showNewProfileDialog();
        });
    } else {
        html = "";
        for(i = 0; i < len; i++){
            if (g_profileList[i].index === g_defaultProfileID) {
                html += option;
                html = html.replace("%d", g_profileList[i].index);
                html = html.replace("%s", XSSResolveCannotParseChar(g_profileList[i].profilename) + " (" + common_default + ")");
                break;
            }
        }
        for(i = 0; i < len; i++){
            if (g_profileList[i].index !== g_defaultProfileID) {
                html += option;
                html = html.replace("%d", g_profileList[i].index);
                html = html.replace("%s", XSSResolveCannotParseChar(g_profileList[i].profilename));
            }
        }
        $("#carriername").html(html).on("change", function(){
            var index = $(this).val();
            showProfileInfo(index);
        });
        html = "";
        for(i = 0, len = g_profileAuthMode.length; i < len; i++){
            html += option;
            html = html.replace("%d", g_profileAuthMode[i].auth).replace("%s", g_profileAuthMode[i].name);
        }
        $("#authenticationtype").html(html);
        html = "";
        for(i = 0, len = g_profileIPType.length; i < len; i++){
            html += option;
            html = html.replace("%d", g_profileIPType[i].type).replace("%s", g_profileIPType[i].name);
        }
        $("#ip-type").html(html);
        showProfileInfo(g_defaultProfileID);
        $("#apply").attr("disabled","disabled");
        $("#apply").on("click", modifyProfile);
        $("#del").on("click", deleteProfile);
        $newprofile = $("#newprofile");
        $newprofile.attr("value", str_dialup_newprofile);
        if (g_profileList.length >= g_maxProfileNum){
            $newprofile.attr("disabled", "disabled");
        } else {
            $newprofile.on("click", function() {
                showNewProfileDialog();
            });
        }
    }
    $("#carriername,#authenticationtype,#apn,#mobileusername,#mobilepassword,#ip-type").on("change keyup",function(){
        var profiename = $("#carriername").val();
        var authmode = $("#authenticationtype").val();
        var apnname = $("#apn").val();
        var username = $("#mobileusername").val();
        var password = $("#mobilepassword").val();
        var iptype = $("#ip-type").val();
        $.each(g_profileList,function(i,item){
            if(item.index == g_defaultProfileID){
                if(profiename == item.index
                    && authmode == item.authmode
                    && apnname == item.apn
                    && username == item.username
                    && password == password_decode(item.password,g_priKey)
                    && iptype == item.iptype){
                    $("#apply").attr("disabled","disabled");
                }else{
                    $("#apply").removeAttr("disabled");
                }
            }

        })

    })
}
/*----------------------------profile-------------------------------*/
function deleteProfile(){
    var postdata, _obj = {};

    stopLogoutTimer();
    _obj.index = parseInt($("#carriername").val(), 10);
    postdata = JSON.stringify(_obj);
    saveAjaxJsonData("/action/delete_dialup_profile", postdata, function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            showResultDialog(common_result, common_success, 3000);
        } else {
            showResultDialog(common_result, common_failed);
            startLogoutTimer();
        }
    }, {

    });
}

function clearErrorInfo(){
    $("#nametips").hide();
    $("#usntips").hide();
    $("#pwdtips").hide();
    $("#apntips").hide();
}

function checkNewProfile(obj) {
    var i, len, val, reg;

    clearErrorInfo();

    reg = /[^ !#$()*.\-\/0-9=@A-Z\[\]^_`a-z{}|~]/g;

    val = obj["profilename"];
    if (val.match(reg)){
        $("#new-profilename").focus();
        $("#nametipstring").text(str_dialup_profilenametips1);
        $("#nametips").show();
        return false;
    }
    var realLength = getStrLeng(val);
    if (realLength < g_minProfilenameLength || realLength > g_maxProfilenameLength){
        $("#new-profilename").focus();
        $("#nametipstring").text(str_dialup_profilenametips2.replace("%s", g_minProfilenameLength).replace("%e", g_maxProfilenameLength));
        $("#nametips").show();
        return false;
    }
    for(i = 0, len = g_profileList.length; i < len; i++) {
        if (val === g_profileList[i].profilename) {
            $("#new-profilename").focus();
            $("#nametipstring").text(str_dialup_profilenametips);
            $("#nametips").show();
            return false;
        }
    }

    val = obj["username"];
    if (val.match(reg)){
        $("#new-username").focus();
        $("#usntipstring").text(str_dialup_usernametips1);
        $("#usntips").show();
        return false;
    }

    val = obj["password"];
    if (val[0] === " ") {
        $("#new-password").focus();
        $("#pwdtipstring").text(str_dialup_password_spacetips1);
        $("#pwdtips").show();
        return false;
    }

    if (val.match(reg)){
        $("#new-password").focus();
        $("#pwdtipstring").text(str_dialup_passwordtips1);
        $("#pwdtips").show();
        return false;
    }

    val = obj["apn"];
    if (val.match(reg) || val.indexOf(" ") > 0){
        $("#new-apn").focus();
        $("#apntipstring").text(str_dialup_apntips1);
        $("#apntips").show();
        return false;
    }

    return true;
}
function addProfile(){
    var ret, data, postdata, obj = {};
    data = $("#newprofileinfo").serializeArray();
    $.each(data, function(index, val){
        if(val.name === "password"){
            obj[val.name] =val.value;
        }else{
            obj[val.name] =$.trim(val.value);
        }
    });
    ret = checkNewProfile(obj);
    if (ret === false) {
        return;
    }
    obj.authmode = parseInt(obj.authmode);
	obj.password = password_encode(obj.password,g_priKey,g_timestamp,g_timestamp_start)
    stopLogoutTimer();
    postdata = JSON.stringify(obj);
    saveAjaxJsonData("/action/add_dialup_profile", postdata, function(data){
        var _obj = data;
        closeDialog();
        if (typeof _obj.retcode === "number" && _obj.retcode === g_resultSuccess){
            showResultDialog(common_result, common_success, 3000);
        } else {
            showResultDialog(common_result, common_failed, 3000);
        }
    }, {
    });
}
function checkModifyProfile(obj){
    var i, len, val, reg, $tip, $tipstring;


    $tip = $("#profiletips");
    $tipstring = $("#profiletipstring");
    $tip.hide();
    $tipstring.text("");
    reg = /[^ !#$()*\-\/.0-9=@A-Z\[\]^_`a-z{}|~]/g;

    val = obj["username"];
    if (val.match(reg)){
        $("#mobileusername").focus();
        $tipstring.text(str_dialup_usernametips1);
        $tip.show();
        return false;
    }

    val = obj["password"];
    if (val[0] === " ") {
        $("#mobilepassword").focus();
        $tipstring.text(str_dialup_password_spacetips1);
        $tip.show();
        return false;
    }
    if (val.match(reg)){
        $("#mobilepassword").focus();
        $tipstring.text(str_dialup_passwordtips1);
        $tip.show();
        return false;
    }

    val = obj["apn"];
    if (val.match(reg) || val.indexOf(" ") > 0){
        $("#apn").focus();
        $tipstring.text(str_dialup_apntips1);
        $tip.show();
        return false;
    }

    return true;

}
function modifyProfile(){
    var data = $("#profile-settings").serializeArray();
    var obj = {};
    var postdata, ret;

    stopLogoutTimer();
    $.each(data, function(index, val){
        if(val.name === "password"){
            obj[val.name] =val.value;
        }else{
            obj[val.name] =$.trim(val.value);
        }
    });
    obj.index = parseInt(obj.index);
    for(var i = 0, len = g_profileList.length; i < len; i++) {
        if (obj.index === g_profileList[i].index) {
            obj.profilename = g_profileList[i].profilename;
            break;
        }
    }
    if (g_profileList[i].readonly === g_profileReadonly) {
        obj.username = g_profileList[i].username;
        obj.password = password_decode(g_profileList[i].password,g_priKey);
        obj.authmode = g_profileList[i].authmode;
        obj.apn = g_profileList[i].apn;
        obj.iptype = g_profileList[i].iptype;
    }
    obj.authmode = parseInt(obj.authmode);
    ret = checkModifyProfile(obj);
    if (ret === false) {
        startLogoutTimer();
        return false;
    }
	obj.password = password_encode(obj.password,g_priKey,g_timestamp,g_timestamp_start);
    postdata = JSON.stringify(obj);
    saveAjaxJsonData("/action/set_dialup_profile", postdata, function(data){
        var _obj = data;
        if (typeof _obj.retcode === "number" && _obj.retcode === g_resultSuccess){
            showResultDialog(common_result, common_success, 3000);
        } else {
            showResultDialog(common_result, common_failed);
            startLogoutTimer();
        }
    }, {
    });
}

function showProfileInfo(index){
    var i, len, profile, num;
    var $usn, $psd, $apn, $auth;

    num = parseInt(index);
    for(i = 0, len = g_profileList.length; i < len; i++){
        if (num === g_profileList[i].index) {
            profile = g_profileList[i];
            break;
        }
    }

    $usn = $("#mobileusername");
    $psd = $("#mobilepassword");
    $auth = $("#authenticationtype");
    $apn = $("#apn");
    $iptype = $("#ip-type");
    $usn.attr("value", profile.username);
    $psd.attr("value", password_decode(profile.password,g_priKey));
    $auth.val(profile.authmode);
    $apn.attr("value", profile.apn);
    $iptype.val(profile.iptype);
    if (profile.readonly === g_profileReadonly || profile.readonly === g_profileReadonly2) {
        $usn.attr("disabled", "disabled");
        $psd.attr("disabled", "disabled");
        $auth.attr("disabled", "disabled");
        $apn.attr("disabled", "disabled");
        $iptype.attr("disabled", "disabled");
        $("#del").attr("disabled","disabled");
        $("#del").hide();
    } else {
        $usn.removeAttr("disabled");
        $psd.removeAttr("disabled");
        $auth.removeAttr("disabled");
        $apn.removeAttr("disabled");
        $iptype.removeAttr("disabled");
        $("#del").removeAttr("disabled");
        $("#del").show();
    }
}

function getProfileInfo(){
    getAjaxJsonData("/action/get_dialup_profile", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            g_profileList = obj.profileList;
            g_defaultProfileID = obj.curid;
        }
    }, {
        async: false
    });
}
function showNewProfileDialog(){
    var i, len, html, style;
    var option = "<option value=\"%d\">%s</option>";
    var newprofiledialog = [
        '<div id="newprofiledialog">',
        '<form id="newprofileinfo">',
        '<table cellspacing="0" cellpadding="0" width="400">',
        '<tbody>',
        '<tr>',
        '<td class="tdwidth120"><label id="label-new-profilename" for="new-profilename"></label></td>',
        '<td><input id="new-profilename" type="text" name="profilename" maxlength="31" class="newprofileinput" /></td>',
        '</tr>',
        '<tr id="nametips" style="display: none" class="fontcolorred">',
        '<td class="tdwidth120"></td>',
        '<td id="nametipstring"></td>',
        '</tr>',
        '<tr>',
        '<td class="tdwidth120"><label id="label-new-authmode" for="new-authmode"></label></td>',
        '<td><select id="new-authmode" name="authmode" class="newprofileselect">%select</select></td>',
        '</tr>',
        '<tr>',
        '<td class="tdwidth120"><label id="label-new-apn" for="new-apn"></label></td>',
        '<td><input id="new-apn" type="text" name="apn" maxlength="31" class="newprofileinput"></td>',
        '</tr>',
        '<tr id="apntips" style="display: none" class="fontcolorred">',
        '<td class="tdwidth120"></td>',
        '<td id="apntipstring"></td>',
        '</tr>',
        '<tr>',
        '<td class="tdwidth120"><label id="label-new-username" for="new-username"></label></td>',
        '<td><input id="new-username" type="text" name="username" maxlength="31" class="newprofileinput"></td>',
        '</tr>',
        '<tr id="usntips" style="display: none" class="fontcolorred">',
        '<td class="tdwidth120"></td>',
        '<td id="usntipstring"></td>',
        '</tr>',
        '<tr>',
        '<td class="tdwidth120"><label id="label-new-password" for="new-password"></label></td>',
        '<td><input type="password" style="display:none" autocomplete="off" disabled/><input id="new-password" type="password" name="password" maxlength="31" class="newprofileinput" autocomplete="off"></td>',
        '</tr>',
        '<tr id="pwdtips" style="display: none" class="fontcolorred">',
        '<td class="tdwidth120"></td>',
        '<td id="pwdtipstring"></td>',
        '</tr>',
        '<tr>',
        '<td class="tdwidth120"><label id="label-new-Iptype" for="new-Iptype"></label></td>',
        '<td><select id="new-iptype" name="iptype" class="newprofileselect">%selectip</select></td>',
        '</tr>',
        '</tbody>',
        '</table>',
        '</form>',
        '</div>'].join("");
    html = "";
    for(i = 0, len = g_profileAuthMode.length; i < len; i++){
        html += option;
        html = html.replace("%d", g_profileAuthMode[i].auth).replace("%s", g_profileAuthMode[i].name);
    }
    style = newprofiledialog.replace("%select", html);
    html = "";
    for(i = 0, len = g_profileIPType.length; i < len; i++){
        html += option;
        html = html.replace("%d", g_profileIPType[i].type).replace("%s", g_profileIPType[i].name);
    }
    style = style.replace("%selectip", html);
    showDialog(style,dialog_align_left);
    $("#label-new-profilename").text(str_carrier_name);
    $("#label-new-username").text(str_dialup_username);
    $("#label-new-password").text(str_dialup_psd);
    $("#label-new-authmode").text(str_dialup_authmode);
    $("#label-new-apn").text(str_dialup_apn);
    $("#label-new-Iptype").text(str_dialup_iptypemode);
    $("#cancel-btn").attr("value", common_cancel).on("click", closeDialog);
    $("#diatitle").children().text(str_dialup_newprofile);
    $("#diaclose").on("click", closeDialog);
    $("#ok-btn").attr("value", common_save).on("click", addProfile);
}

function getSimStatus(){
    getAjaxJsonData("/goform/get_sim_info", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
            if (obj.state === g_simStatusNo) {
               showTipsDialog(common_info,str_dialup_no_simtips,redirect,dialog_align_left);
            } else if(obj.state == g_notVerified){
                window.location.replace("pinrequired.html");
            }else if(obj.state == g_pinBlocked){
                window.location.replace("pukrequired.html");
            }else{

            }
        }
    }, {
        async: false
    })
}


function getStrLeng(str){
    var realLength = 0;
    var len = str.length;
    var charCode = -1;
    for(var i = 0; i < len; i++){
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) {
            realLength += 1;
        }else{
            realLength += 3;
        }
    }
    return realLength;
}