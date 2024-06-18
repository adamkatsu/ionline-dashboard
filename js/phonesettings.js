var g_voicemodeVoIP = 2;
var g_voicemodeVOLTE = 1;
var g_voicemodeCS = 0;
var g_cidmodeFSK = 0;
var g_cidmodeDTMF = 1;
var g_voicemode = [
    {
        mode: g_voicemodeVOLTE,
        name: str_voice_mode_volte
    },
    {
        mode: g_voicemodeCS,
        name: str_voice_mode_cs
    },
    {
        mode: g_voicemodeVoIP,
        name: str_voice_mode_voip
    }
];
var g_cidmode = [
    {
        mode: g_cidmodeFSK,
        name: str_cid_mode_fsk
    },
    {
        mode: g_cidmodeDTMF,
        name: str_voice_mode_dtmf
    }
]
var g_curVoicemode;
var g_curCIDmode;

function initPhoneMode(){
    var i, len, $list;
    var option = "<option value=\"%d\">%s</option>";
    var html = "";

    for(i = 0, len = g_voicemode.length; i < len; i++){
        html += option;
        html = html.replace("%d", g_voicemode[i].mode);
        html = html.replace("%s", g_voicemode[i].name);
    }
    $list = $("#phonemode");
    $list.html(html);
    $list.val(g_curVoicemode);
}
function initCIDMode(){
    var i, len, $list;
    var option = "<option value=\"%d\">%s</option>";
    var html = "";

    for(i = 0, len = g_cidmode.length; i < len; i++){
        html += option;
        html = html.replace("%d", g_cidmode[i].mode);
        html = html.replace("%s", g_cidmode[i].name);
    }
    $list = $("#cidmode");
    $list.html(html);
    $list.val(g_curCIDmode);
}
function getVoiceInfo(){
    getAjaxJsonData("/action/get_voice_type", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            g_curVoicemode = obj.type;
        }
    }, {
        async: false,
        timeout:2000
    });
    getAjaxJsonData("/action/get_voice_cid", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            g_curCIDmode = obj.status;
        }
    }, {
        async: false,
        timeout:2000
    });
}
function saveVoiceInfo(){
    var mode, postdata, obj={};
    stopLogoutTimer();
    mode = parseInt($("#phonemode").val());
    obj.type = mode;
    postdata = JSON.stringify(obj);
    saveAjaxJsonData("/action/set_voice_type", postdata, function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
            showResultDialog(common_result, common_success, 3000);
        } else {
            showResultDialog(common_result, common_failed, 3000);
        }
    }, {
        async: true
    });
}
function saveCIDInfo(){
    var mode, postdata, obj={};

    stopLogoutTimer();
    mode = parseInt($("#cidmode").val());
    obj.status = mode;
    postdata = JSON.stringify(obj);
    saveAjaxJsonData("/action/set_voice_cid", postdata, function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
            showResultDialog(common_result, common_success, 3000);
        } else {
            showResultDialog(common_result, common_failed, 3000);
        }
    }, {
        async: true
    });
}
function initModePage(){
    document.title = str_leftmenu_ps;
    $(".introduce h1").text(str_voice);
    $(".introduce p").text(str_voice_des);
    getVoiceInfo();
    initPhoneMode();
    initCIDMode();
    $("#apply").attr("value", common_apply).on("click", function(){
        var ret;
        ret = saveVoiceInfo();
        if (ret === false) {
            startLogoutTimer();
        }
    });
    $("#apply_cid").attr("value", common_apply).on("click", function(){
        var ret;
        ret = saveCIDInfo();
        if (ret === false) {
            startLogoutTimer();
        }
    });
}
