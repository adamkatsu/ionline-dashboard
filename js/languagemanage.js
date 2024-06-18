var g_langList;
var g_currentLang;
var g_defaultLang = "en_us";
var languageflag=false;
var checkLang = true;
function initlanguage(){
    getLanguageFromAction();
    loadlnaguage();
    getlanguage();
}
function getLanguageFromAction(){
    getxCsrfTokens();
    getAjaxJsonData("/goform/get_current_language", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode ===g_resultSuccess){
            //  window.location.reload();
            g_currentLang = obj.languageType;
            languageflag=true;
        }else{
            g_currentLang = g_defaultLang;
        }
    }, {
        async: false,
    });
    if(languageflag==false){
        setTimeout(getLanguageFromAction,3000);
        return false;
    }
}
function  getlanguage() {
    getAjaxDataXml("/config/language.xml", function(xml){
        var _obj = xml2object($(xml));
        g_langList = _obj.config.lang_list.lang;
    }, {
        datatype: "xml",
        async: false,
        timeout: 1000
    });
}
function changeLanguage(){
    var obj={};
    obj.languageType=$("#langid").val();
    getxCsrfTokens();
    var postdata = JSON.stringify(obj);
    saveAjaxJsonData("/goform/set_current_language", postdata, function(obj){
        closeDialog();
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess) {
            window.location.reload();
        }
    }, {
        timeout: 3000
    });
}

function loadlnaguage(){
    var langFile="../language/lang_"+g_currentLang+".js";
    $.ajax({
        async: false,
        //cache: false,
        type: 'GET',
        timeout: '3000',
        url: langFile,
        dataType: 'script',
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            try {
                console.log('MAIN : loadLangFile() error.');
                console.log('MAIN : XMLHttpRequest.readyState = ' + XMLHttpRequest.readyState);
                console.log('MAIN : XMLHttpRequest.status = ' + XMLHttpRequest.status);
                console.log('MAIN : textStatus' + textStatus);
                console.log('MAIN : errorThrown' + errorThrown);
            }
            catch (exception) {
                log.error(exception);
            }
        },
        success: function(data) {
            console.debug('MAIN : loadLangFile() success.');
        }
    });
}

function initLangList(list){
    var $langauage, innerHtml = "",
        _opn = "<option value=\"%lang\">%label_lang</option>";

    $langauage = $("#langid");
    if (!Array.isArray(list)){
        innerHtml +=_opn;
        innerHtml = innerHtml.replace("%lang", list);
        innerHtml = innerHtml.replace("%label_lang", eval("common_lang_" + list));
        $langauage.children("select").attr("disabled", "disabled");
    } else{
        for(var i = 0, len = list.length; i < len; i++){
            innerHtml +=_opn;
            innerHtml = innerHtml.replace("%lang", list[i]);
            innerHtml = innerHtml.replace("%label_lang", eval("common_lang_" + list[i]));
        }
    }
    $langauage.html(innerHtml).val(g_currentLang);
    $langauage.on("change", changeLanguage);
}

function getAjaxDataXml(urlstr, callback, options) {
    var isasync = true,
        type = "GET",
        datatype = "xml",
        cacheable = false,
        inTimeout = 0,
        contentType = "application/xml";
    if (options) {
        if (options.hasOwnProperty("async")) {
            isasync = options.async;
        }
        if (options.hasOwnProperty("dataType")) {
            datatype = options.dataType;
        }
        if (options.hasOwnProperty("timeout")) {
            inTimeout = parseInt(options.timeout, 10);
            if ((inTimeout < 0) || isNaN(inTimeout)) {
                inTimeout = g_ajaxTimeout;
            }
        }
        if (options.hasOwnProperty("contentType")) {
            contentType = options.contentType;
        }
    }
    $.ajax({
        url: urlstr,
        type: type,
        async: isasync,
        dataType: datatype,
        timeout: inTimeout,
        cache: cacheable,
        contentType: contentType,
        error: function(xhr, textStatus) {
            var errorInfo = textStatus + ": " + xhr.status + " " + xhr.readyState;
            console.log(errorInfo);
            if((checkLang == true)&&(textStatus == "parsererror" && xhr.status == 200 && xhr.readyState == 4)){
                window.location.reload();
            }
        },
        success: function(data){
            if (typeof callback === "function"){
                callback(data);
            }
        }
    });
}
