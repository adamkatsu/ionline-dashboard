
var  sms_hint_max_ucs2_characters_268=str_sms_message_length268;
var sms_hint_max_8bit_characters_532=str_sms_message_length532;
var sms_hint_max_ascii_characters_612=str_sms_message_length612;

var g_sms_maxphonesize = 20;

//这些都是从server读取过来的,暂时采用全局变量赋值。
var g_sms_importenabled=true;
var g_sms_urlenabled=true;
var g_smsFeature={};
g_smsFeature.smscharlang=0;

var MACRO_NET_SINGLE_MODE = 1;
var MACRO_NET_DUAL_MODE = 2;
var MACRO_NET_MODE_CHANGE = 1;
;
var g_net_mode_type = MACRO_NET_SINGLE_MODE;

var SMS_TEXT_MODE_UCS2 =  0;
var SMS_TEXT_MODE_7BIT =  1;
var SMS_TEXT_MODE_8BIT =  2;
var ASCII_CODE    = 127;
var g_SMS_UCS2_MAX_SIZE;
var g_SMS_8BIT_MAX_SIZE;
var g_SMS_7BIT_MAX_SIZE;
var g_content = null;
var g_text_mode = SMS_TEXT_MODE_7BIT;
var g_sms_length = 0;
var g_sms_num = 1;
var g_ucs2_num = 0;
var g_convert_type = '';
var g_lang_edit = -1;
var g_sms_smscharlang = false;

var GSM_7BIT_NUM = 128;
var SMS_STR_NUM = 620;
var EXTENSION_ASCII = 9;
var g_ext_7bit_tab = [
    [20, 0x005E], [40, 0x007B], [41, 0x007D],
    [47, 0x005C], [60, 0x005B], [61, 0x007E],
    [62, 0x005D], [64, 0x007C], [101, 0x20AC]
];
var g_ext_7bit_tab_turkish = [
    [13, 0x001D], [20, 0x005E],
    [40, 0x007B], [41, 0x007D], [47, 0x005C], [60, 0x005B],
    [61, 0x007E], [62, 0x005D], [64, 0x007C], [71, 0x011E],
    [73, 0x0130], [83, 0x015E], [99, 0x00E7], [101, 0x20AC],
    [103, 0x011F], [105, 0x0131], [115, 0x015F]
];
var g_ext_7bit_tab_spanish = [
    [9, 0x00E7],  [20, 0x005E],
    [40, 0x007B], [41, 0x007D], [47, 0x005C], [60, 0x005B],
    [61, 0x007E], [62, 0x005D], [64, 0x007C], [65, 0x00C1],
    [73, 0x00CD], [79, 0x00D3], [85, 0x00DA], [97, 0x00E1],
    [101, 0x20AC], [105, 0x00ED], [111, 0x00F3], [117, 0x00FA]
];
var g_ext_7bit_tab_Portuguese = [
    [5, 0x00EA], [9, 0x00E7],   [11, 0x00D4],
    [12, 0x00F4], [14, 0x00C1], [15, 0x00E1],[18, 0x03A6],
    [19, 0x0393], [20, 0x005E], [21, 0x03A9], [22, 0x03A0],
    [23, 0x03A8], [24, 0x03A3], [25, 0x0398],
    [31, 0x00CA], [40, 0x007B], [41, 0x007D], [47, 0x005C],
    [60, 0x005B], [61, 0x007E], [62, 0x005D], [64, 0x007C],
    [65, 0x00C0], [73, 0x00CD], [79, 0x00D3], [85, 0x00DA],
    [91, 0x00C3], [92, 0x00D5], [97, 0x00C2], [101, 0x20AC],
    [105, 0x00ED], [111, 0x00F3], [117, 0x00FA], [123, 0x00E3],
    [124, 0x00F5], [127, 0x00E2]
];
var extension_char = 27;
var ENTER_CHAR = 10;
var CR_CHAR = 13;
var arrayGSM_7bit =
    [
        0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F,
        0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x1B, 0x1C, 0x1D, 0x1E, 0x1F,
        0x20, 0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2A, 0x2B, 0x2C, 0x2D, 0x2E, 0x2F,
        0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A, 0x3B, 0x3C, 0x3D, 0x3E, 0x3F,
        0x40, 0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4A, 0x4B, 0x4C, 0x4D, 0x4E, 0x4F,
        0x50, 0x51, 0x52, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5A, 0x5B, 0x5C, 0x5D, 0x5E, 0x5F,
        0x60, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6A, 0x6B, 0x6C, 0x6D, 0x6E, 0x6F,
        0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7A, 0x7B, 0x7C, 0x7D, 0x7E, 0x7F
    ];
var arrayGSM_7DefaultTable =
    [
        0x0040, 0x00A3, 0x0024, 0x00A5, 0x00E8, 0x00E9, 0x00F9, 0x00EC, 0x00F2, 0x00C7, 0x000A, 0x00D8, 0x00F8, 0x000D, 0x00C5, 0x00E5,
        0x0394, 0x005F, 0x03A6, 0x0393, 0x039B, 0x03A9, 0x03A0, 0x03A8, 0x03A3, 0x0398, 0x039E, 0x001B, 0x00C6, 0x00E6, 0x00DF, 0x00C9,
        0x0020, 0x0021, 0x0022, 0x0023, 0x00A4, 0x0025, 0x0026, 0x0027, 0x0028, 0x0029, 0x002A, 0x002B, 0x002C, 0x002D, 0x002E, 0x002F,
        0x0030, 0x0031, 0x0032, 0x0033, 0x0034, 0x0035, 0x0036, 0x0037, 0x0038, 0x0039, 0x003A, 0x003B, 0x003C, 0x003D, 0x003E, 0x003F,
        0x00A1, 0x0041, 0x0042, 0x0043, 0x0044, 0x0045, 0x0046, 0x0047, 0x0048, 0x0049, 0x004A, 0x004B, 0x004C, 0x004D, 0x004E, 0x004F,
        0x0050, 0x0051, 0x0052, 0x0053, 0x0054, 0x0055, 0x0056, 0x0057, 0x0058, 0x0059, 0x005A, 0x00C4, 0x00D6, 0x00D1, 0x00DC, 0x00A7,
        0x00BF, 0x0061, 0x0062, 0x0063, 0x0064, 0x0065, 0x0066, 0x0067, 0x0068, 0x0069, 0x006A, 0x006B, 0x006C, 0x006D, 0x006E, 0x006F,
        0x0070, 0x0071, 0x0072, 0x0073, 0x0074, 0x0075, 0x0076, 0x0077, 0x0078, 0x0079, 0x007A, 0x00E4, 0x00F6, 0x00F1, 0x00FC, 0x00E0
    ];
var arrayGSM_7ExtTable =
    [
        0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
        0xFFFF, 0xFFFF, 0x000A, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
        0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x005E, 0xFFFF, 0xFFFF, 0xFFFF,
        0xFFFF, 0xFFFF, 0xFFFF, 0x0020, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
        0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
        0x007B, 0x007D, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x005C,
        0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
        0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x005B, 0x007E, 0x005D, 0xFFFF,
        0x007C, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
        0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
        0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
        0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
        0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x20AC, 0xFFFF, 0xFFFF,
        0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
        0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
        0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF
    ];
var arrayGSM_7TurkishExtTable  =
    [
        0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x000A, 0xFFFF, 0xFFFF, 0x001D, 0xFFFF, 0xFFFF,
        0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x005E, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x0020, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
        0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x007B, 0x007D, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x005C,
        0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x005B, 0x007E, 0x005D, 0xFFFF,
        0x007C, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x011E, 0xFFFF, 0x0130, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
        0xFFFF, 0xFFFF, 0xFFFF, 0x015E, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
        0xFFFF, 0xFFFF, 0xFFFF, 0x00E7, 0xFFFF, 0x20AC, 0xFFFF, 0x011F, 0xFFFF, 0x0131, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
        0xFFFF, 0xFFFF, 0xFFFF, 0x015F, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF
    ];
var arrayGSM_7PortugueseExtTable =
    [
        0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x00EA, 0xFFFF, 0xFFFF, 0xFFFF, 0x00E7, 0x000A, 0x00D4, 0x00F4, 0xFFFF, 0x00C1, 0x00E1,
        0xFFFF, 0xFFFF, 0x03A6, 0x0393, 0x005E, 0x03A9, 0x03A0, 0x03A8, 0x03A3, 0x0398, 0xFFFF, 0x0020, 0xFFFF, 0xFFFF, 0xFFFF, 0x00CA,
        0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x007B, 0x007D, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x005C,
        0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x005B, 0x007E, 0x005D, 0xFFFF,
        0x007C, 0x00C0, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x00CD, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x00D3,
        0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x00DA, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x00C3, 0x00D5, 0xFFFF, 0xFFFF, 0xFFFF,
        0xFFFF, 0x00C2, 0xFFFF, 0xFFFF, 0xFFFF, 0x20AC, 0xFFFF, 0xFFFF, 0xFFFF, 0x00ED, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x00F3,
        0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x00FA, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x00E3, 0x00F5, 0xFFFF, 0xFFFF, 0x00E2
    ];
var arrayGSM_7SpanishExtTable =
    [
        0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x00E7, 0x000A, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
        0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x005E, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x0020, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
        0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x007B, 0x007D, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x005C,
        0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x005B, 0x007E, 0x005D, 0xFFFF,
        0x007C, 0x00C1, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x00CD, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x00D3,
        0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x00DA, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
        0xFFFF, 0x00E1, 0xFFFF, 0xFFFF, 0xFFFF, 0x20AC, 0xFFFF, 0xFFFF, 0xFFFF, 0x00ED, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x00F3,
        0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0x00FA, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF
    ];
var arrayGSM_7SpanishSpecialTable=[
    0x00A2, 0x00C0, 0x00C1, 0x00C2, 0x00C3, 0x00C8, 0x00CA, 0x00CB, 0x00CC, 0x00CD, 0x00CE, 0x00CF, 0x00D0, 0x00D2, 0x00D3, 0x00D4,
    0x00D5, 0x00D6, 0x00D9, 0x00DA, 0x00DB, 0x00DD, 0x00DE, 0x00E1, 0x00E2, 0x00E3, 0x00E7, 0x00EA, 0x00EB, 0x00ED, 0x00EE, 0x00EF,
    0x00F0, 0x00F3, 0x00F4, 0x00F5, 0x00F6, 0x00FA, 0x00FB, 0x00FD, 0x00FE, 0x00FF, 0x0102, 0x0104, 0x0105, 0x0106, 0x0107, 0x010C,
    0x010D, 0x010E, 0x010F, 0x0111, 0x0114, 0x0118, 0x0119, 0x011B, 0x0132, 0x0133, 0x0139, 0x013D, 0x0141, 0x0142, 0x0143, 0x0144,
    0x0147, 0x0148, 0x0154, 0x0155, 0x0158, 0x0159, 0x015A, 0x015B, 0x015E, 0x015F, 0x0160, 0x0161, 0x0162, 0x0163, 0x0164, 0x0165,
    0x0168, 0x016E, 0x016F, 0x0179, 0x017A, 0x017B, 0x017C, 0x017D, 0x017E, 0x01CE, 0x01D4, 0x0490, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
    0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF,
    0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF, 0xFFFF
];



function sms_numberCheck(str) {
    var N_or_Y_isCDMA_sms_hint_max_ucs2_characters_268=0;
    var N_or_Y_isCDMA_sms_hint_max_8bit_characters_532=0;
    var N_or_Y_isCDMA_sms_hint_max_ascii_characters_612=0;
    if (g_isCDMA)
    {
        g_SMS_UCS2_MAX_SIZE = 260;
        g_SMS_8BIT_MAX_SIZE = 540;
        g_SMS_7BIT_MAX_SIZE = 620;
        N_or_Y_isCDMA_sms_hint_max_ucs2_characters_268 = sms_hint_max_ucs2_characters_268.replace(/268/, "260");
        N_or_Y_isCDMA_sms_hint_max_8bit_characters_532 = sms_hint_max_8bit_characters_532.replace(/532/, "540");
        N_or_Y_isCDMA_sms_hint_max_ascii_characters_612 = sms_hint_max_ascii_characters_612.replace(/612/, "620");
    } else {
        g_SMS_UCS2_MAX_SIZE = 268;
        g_SMS_8BIT_MAX_SIZE = 532;
        g_SMS_7BIT_MAX_SIZE = 612;
        N_or_Y_isCDMA_sms_hint_max_ucs2_characters_268 = sms_hint_max_ucs2_characters_268;
        N_or_Y_isCDMA_sms_hint_max_8bit_characters_532 = sms_hint_max_8bit_characters_532;
        N_or_Y_isCDMA_sms_hint_max_ascii_characters_612 = sms_hint_max_ascii_characters_612;
    }
    var sms_left_length;
    var sms_num;
    var temp_length;
    var temp_enter_number;
    var normal_max_len = 160;
    var long_max_len = 153;
    var err_info = null;
    temp_length = str.length;
    if(SMS_TEXT_MODE_UCS2 == g_text_mode) {
        if (g_isCDMA) {
            normal_max_len = 70;
            long_max_len = 65;
        } else {
            normal_max_len = 70;
            long_max_len = 67;
        }
        if(temp_length > g_SMS_UCS2_MAX_SIZE) {
            err_info = N_or_Y_isCDMA_sms_hint_max_ucs2_characters_268;
        }
    } else if (SMS_TEXT_MODE_8BIT == g_text_mode) {
        if (g_isCDMA) {
            normal_max_len = 140;
            long_max_len = 135;
        } else {
            normal_max_len = 140;
            long_max_len = 133;
        }
        if(temp_length > g_SMS_8BIT_MAX_SIZE) {
            err_info = N_or_Y_isCDMA_sms_hint_max_8bit_characters_532;
        }
    } else if (SMS_TEXT_MODE_7BIT == g_text_mode && !g_isCDMA )
    {
        if(g_lang_edit == '-1') {
            temp_length = check_extension_ascii_for_char_number(str);
        } else {
            temp_length = check_extension_ascii_for_char_number_new(str);
        }
        if( g_lang_edit != '-1'&& !g_sms_smscharlang ) {
            normal_max_len = 160;
            long_max_len = 153;
            if(temp_length > g_SMS_7BIT_MAX_SIZE) {
                err_info = N_or_Y_isCDMA_sms_hint_max_ascii_characters_612;
            }
        } else if(g_lang_edit == '-1' && (0 == g_smsFeature.smscharlang || "undefined" == typeof(g_smsFeature.smscharlang)) ) {
            normal_max_len = 160;
            long_max_len = 153;
            if(temp_length > g_SMS_7BIT_MAX_SIZE) {
                err_info = N_or_Y_isCDMA_sms_hint_max_ascii_characters_612;
            }
        } else {
            normal_max_len = 155;
            long_max_len = 149;
            if(temp_length > long_max_len*4 ) {
                err_info = sms_hint_max_ascii_characters_596;
            }
        }
    } else if(SMS_TEXT_MODE_7BIT == g_text_mode && g_isCDMA) {
        normal_max_len = 160;
        long_max_len = 155;
        if(temp_length > long_max_len*4 ) {
            err_info = N_or_Y_isCDMA_sms_hint_max_ascii_characters_612;
        }
    }
    if( null != err_info ||  str.length <=0 ) {
        sms_clearAllErrorLabel();
        if( null != err_info){
            showErrorUnderTextbox("inputcontentnew", err_info);
            var max_word_count = err_info.replace(/[^0-9]/ig,"");
            $("#inputcontentnew").attr("maxlength",max_word_count);
            $("#ok-btn").attr("disabled","disabled");

        }
        
        g_sms_length = temp_length;
      /*  button_enable("pop_send", "0");
        button_enable("pop_save_to_drafts", "0");*/
        if(g_source_type== g_source_type_reply) {
            $("#send_button").attr("disabled", true);
        }
        if(g_source_type== g_source_type_new) {
            $("#ok-btn").attr("disabled", true);
        }

    } else {
        sms_clearAllErrorLabel();
        $("#inputcontentnew").removeAttr("maxlength");
        $("#ok-btn").removeAttr("disabled");
        if(g_source_type== g_source_type_reply){
            $("#send_button").attr("disabled", false);
        }
        if(g_source_type== g_source_type_new) {
            if(g_sms_full_flag != true ){
                $("#ok-btn").attr("disabled", false);
            }
        }

    }
    if( temp_length <= normal_max_len ) {
        document.getElementById(g_sms_count).innerText= normal_max_len - temp_length + "(" + 1 + ")";
        sms_num = 1;
        if(temp_length <= 0) {
            g_content = str.substring(0);
        }
    } else if( (temp_length > normal_max_len ) && (temp_length <= long_max_len*4) ) {
        sms_num = parseInt(temp_length/long_max_len, 10)+1;
        if( 0 == (temp_length%long_max_len) ) {
            sms_num -= 1;
        }
        document.getElementById(g_sms_count).innerText= long_max_len*sms_num - temp_length + "(" + sms_num + ")";
    } else {
        var tmp =  parseInt((temp_length - long_max_len*4)/long_max_len, 10);
        var tmp2 = Math.floor(tmp);
        var tmp3 = (long_max_len*4 +(tmp2+1)*long_max_len) - temp_length;
        document.getElementById(g_sms_count).innerText=tmp3 + "(" + (tmp2+4+1)+ ")";
    }
    g_sms_num = sms_num;
    g_sms_length = temp_length;
}
function  sms_clearAllErrorLabel() {
   clearAllErrorLabel();
  /*  $('#sms_number_wrapper').css({
        height : '76px'
    });*/
}
function clearAllErrorLabel() {
    $('.error_message').remove();
}
function showErrorUnderTextbox(idOfTextbox, errormsg, label_id) {
    //显示错误信息
    var errorLabel = '';
    if (label_id != null && label_id != '' && label_id != ' ') {
        errorLabel = "<div class='error_message'><label id='" + label_id + "'>" + errormsg + '</label><div>';
    } else {
        errorLabel = "<div class='error_message'><label>" + errormsg + '</label><div>';
    }
    if (0 == $('#' + idOfTextbox).parent().children('.error_message').length) {
        $('#' + idOfTextbox).after(errorLabel);
        setErrorMessageColor('error_message');
    }
}

function setErrorMessageColor(errorTarget) {
    $('.' + errorTarget).css({ "color": "red"});
}

function check_extension_ascii_for_char_number(str) {
    var i = 0;
    var char_i;
    var char_i_code;
    var k = 0;
    var extension_ascii_num = 0;
    var charLenAtFirstSMSEnd = 1;
    var ext_tab = g_ext_7bit_tab;
    var normal_max_len = 160;
    var long_max_len = 153;
    switch( g_smsFeature.smscharlang ) {
        case 0:
            ext_tab = g_ext_7bit_tab;
            break;
        case 1:
            ext_tab = g_ext_7bit_tab_turkish;
            break;
        case 2:
            ext_tab = g_ext_7bit_tab_spanish;
            break;
        case 3:
            ext_tab = g_ext_7bit_tab_Portuguese;
            break;
        default:
            break;
    }
    if( 0 == g_smsFeature.smscharlang || "undefined" == typeof(g_smsFeature.smscharlang) ) {
        normal_max_len = 160;
        long_max_len = 153;
    } else {
        normal_max_len = 155;
        long_max_len = 149;
    }
    for(i=0; i<str.length; i++) {
        var charLen = 1;
        char_i = str.charAt(i);
        char_i_code = char_i.charCodeAt();
        for(charLen=1,k = 0;k< ext_tab.length;k++) {
            if(char_i_code == ext_tab[k][1]) {
                charLen = 2;
                break;
            }
        }
        if(1 == charLen) {
            extension_ascii_num++;
        } else {
            if(1 == charLenAtFirstSMSEnd) {
                if( (long_max_len-1) == extension_ascii_num ) {
                    extension_ascii_num+=2;
                    charLenAtFirstSMSEnd=2;
                } else if(( (long_max_len*2-1) == extension_ascii_num)
                    || ( (long_max_len*3-1) == extension_ascii_num )
                    || ( (long_max_len*4-1) == extension_ascii_num)) {
                    extension_ascii_num+=3;
                } else {
                    extension_ascii_num+=2;
                }
            } else {
                if(( (long_max_len-1)*2 == extension_ascii_num)
                    || (((long_max_len-1)*3+1) == extension_ascii_num)
                    || (((long_max_len-1)*4+2) == extension_ascii_num)) {
                    extension_ascii_num+=3;
                } else {
                    extension_ascii_num+=2;
                }
            }
        }
    }
    if(extension_ascii_num > normal_max_len && 2 == charLenAtFirstSMSEnd) {
        extension_ascii_num++;
    }
    return extension_ascii_num;
}

function check_extension_ascii_for_char_number_new(str) {
    var i = 0;
    var char_i;
    var char_i_code;
    var k = 0;
    var extension_ascii_num = 0;
    var charLenAtFirstSMSEnd = 1;
    var ext_tab = g_ext_7bit_tab;
    var normal_max_len = 160;
    var long_max_len = 153;
    var ext_tab_ = '';
    var tab_7bit_ext = true;
    switch( g_smsFeature.smscharlang ) {
        case 0:
            ext_tab_ = g_ext_7bit_tab;
            break;
        case 1:
            ext_tab_ = g_ext_7bit_tab_turkish;
            break;
        case 2:
            ext_tab_ = g_ext_7bit_tab_spanish;
            break;
        case 3:
            ext_tab_ = g_ext_7bit_tab_Portuguese;
            break;
        default:
            break;
    }
    g_sms_smscharlang = false;
    for(i=0; i<str.length; i++) {
        tab_7bit_ext = true;
        var charLen = 1;
        char_i = str.charAt(i);
        char_i_code = char_i.charCodeAt();
        for(charLen=1,k = 0;k< ext_tab.length;k++) {
            if(char_i_code == ext_tab[k][1]) {
                charLen = 2;
                normal_max_len = 160;
                long_max_len = 153;
                tab_7bit_ext = false;
                break;
            }
        }
        if(tab_7bit_ext) {
            for(charLen=1,k = 0;k< ext_tab_.length;k++) {
                if(char_i_code == ext_tab_[k][1]) {
                    charLen = 2;
                    normal_max_len = 155;
                    long_max_len = 149;
                    g_sms_smscharlang = true;
                    break;
                }
            }
        }
        if(1 == charLen) {
            extension_ascii_num++;
        } else {
            if(1 == charLenAtFirstSMSEnd) {
                if( (long_max_len-1) == extension_ascii_num ) {
                    extension_ascii_num+=2;
                    charLenAtFirstSMSEnd=2;
                } else if(( (long_max_len*2-1) == extension_ascii_num)
                    || ( (long_max_len*3-1) == extension_ascii_num )
                    || ( (long_max_len*4-1) == extension_ascii_num)) {
                    extension_ascii_num+=3;
                } else {
                    extension_ascii_num+=2;
                }
            } else {
                if(( (long_max_len-1)*2 == extension_ascii_num)
                    || (((long_max_len-1)*3+1) == extension_ascii_num)
                    || (((long_max_len-1)*4+2) == extension_ascii_num)) {
                    extension_ascii_num+=3;
                } else {
                    extension_ascii_num+=2;
                }
            }
        }
    }
    if(extension_ascii_num > normal_max_len && 2 == charLenAtFirstSMSEnd) {
        extension_ascii_num++;
    }
    return extension_ascii_num;
}




function sms_contentChange(str) {
    if(g_isCDMA) {
        g_text_mode = CDMA_textmode_check(str);
    } else {
       /* if( $.browser.msie ) {
            if(g_net_mode_type==MACRO_NET_DUAL_MODE && g_net_mode_change==MACRO_NET_MODE_CHANGE) {
                g_ucs2_num=ucs2_number_check(str);
            } else {
                sms_contentDiffUCS2Num( str );
            }
        } else {*/
            g_ucs2_num =  ucs2_number_check(str);
        //}
        if (g_ucs2_num >0) {
            g_text_mode = SMS_TEXT_MODE_UCS2;
        } else {
            g_text_mode = SMS_TEXT_MODE_7BIT;
        }
    }
    sms_numberCheck(str);
    g_content = str;
}
function sms_contentDiffUCS2Num( str ) {
    var idx        = 0;
    var oldEndPos    = 0;
    var newEndPos  = 0;
    var minLen  = 0;
    var diffLen  = 0;
    var diffPos  = 0;
    var diffNum = 0;
    var diffOldNum   = 0;
    var diffNewNum = 0;
    if ( null == g_content  || 0 == g_content.length  ) {
        g_ucs2_num =  ucs2_number_check(str);
        return;
    }
    if ( null == str || 0 == str.length ) {
        g_ucs2_num =0;
        return;
    }
    minLen = Math.min( str.length, g_content.length );
    for( diffPos = 0; diffPos < minLen; ++diffPos ) {
        if( str.charAt( diffPos ).charCodeAt() != g_content.charAt( diffPos ).charCodeAt() ) {
            break;
        }
    }
    if( diffPos == minLen )
    {
        diffLen = str.length - g_content.length;
        if( diffLen > 0 )
        {
            diffNum = ucs2_number_check( str.substring( diffPos ) );
        } else if( diffLen < 0 )
        {
            diffNum = (-1) * ucs2_number_check( g_content.substring( diffPos ) );
        } else {
        }
    } else
    {
        for( idx = 0, oldEndPos = g_content.length-1,newEndPos = str.length-1; idx < minLen && oldEndPos > diffPos && newEndPos > diffPos; ++idx, --oldEndPos,--newEndPos ) {
            if( str.charAt( newEndPos ).charCodeAt() != g_content.charAt( oldEndPos ).charCodeAt() ) {
                break;
            }
        }
        diffOldNum = ucs2_number_check( g_content.substring( diffPos, oldEndPos+1 ) );
        diffNewNum = ucs2_number_check( str.substring( diffPos, newEndPos+1 ) );
        diffNum = diffNewNum - diffOldNum;
    }
    g_ucs2_num += diffNum;
}
function ucs2_number_check(str) {
    var i = 0;
    var char_i;
    var num_char_i;
    var j = 0;
    var flag;
    var ucs2_num_temp=0;
    var ext_Table = arrayGSM_7ExtTable;
    if (str.length ==0) {
        return 0;
    }
    switch( g_smsFeature.smscharlang ) {
        case 0:
            if("2" == g_convert_type) {
                ext_Table= arrayGSM_7SpanishExtTable;
            } else {
                ext_Table= arrayGSM_7ExtTable;
            }
            break;
        case 1:
            ext_Table = arrayGSM_7TurkishExtTable;
            break;
        case 2:
            ext_Table = arrayGSM_7SpanishExtTable;
            break;
        case 3:
            ext_Table = arrayGSM_7PortugueseExtTable;
            break;
        default:
            break;
    }
    for(i=0; i<str.length; i++) {
        flag = 0;
        char_i = str.charAt(i);
        num_char_i = char_i.charCodeAt();
        for(j = 0; j < GSM_7BIT_NUM; j++) {
            if ("2" == g_convert_type) {
                if (num_char_i == arrayGSM_7DefaultTable[j] ||
                    (num_char_i == ext_Table[j] ||
                        (num_char_i == arrayGSM_7SpanishSpecialTable[j]))) {
                    flag = 1;
                    break;
                }
            } else {
                if (num_char_i == arrayGSM_7DefaultTable[j] || (num_char_i == ext_Table[j] )) {
                    flag = 1;
                    break;
                }
            }
        }
        if (0 == flag) {
            ucs2_num_temp++;
        }
    }
    return ucs2_num_temp;
}
function CDMA_textmode_check(str) {
    var i = 0;
    var char_i;
    var num_char_i;
    var codeFormat = SMS_TEXT_MODE_7BIT;
    var ucs2_num_temp=0;
    if (str.length ==0) {
        return SMS_TEXT_MODE_7BIT;
    }
    for(i=0; i<str.length; i++) {
        char_i = str.charAt(i);
        num_char_i = char_i.charCodeAt();
        if((SMS_TEXT_MODE_7BIT == codeFormat)
            &&(0 <= num_char_i && 0x7F >= num_char_i)) {
            codeFormat = SMS_TEXT_MODE_7BIT;
        } else if((SMS_TEXT_MODE_7BIT == codeFormat || SMS_TEXT_MODE_8BIT == codeFormat)
            &&(0x7F < num_char_i && 0xFF >= num_char_i)) {
            codeFormat = SMS_TEXT_MODE_8BIT;
        } else if(0xFF < num_char_i) {
            codeFormat = SMS_TEXT_MODE_UCS2;
            break;
        }
    }
    return codeFormat;
}

function sms_isPhoneNumber(str) {
    var bRet = true;
    var rgExp = /^[+]{0,1}[*#0123456789]{1,20}$/;
    if (!(str.match(rgExp))) {
        bRet = false;
    }
    return bRet;
}
function sms_isSendNumber(str) {
    var bRet = true;
    var i = 0;
    var char_i;
    var num_char_i;
    if($.isArray(str)) {
        $(str).each( function(i) {
            bRet = sms_isPhoneNumber(str[i]);
            if(!bRet){
                return bRet;
            }
        });
    } else {
        bRet = sms_isPhoneNumber(str);
    }
    return bRet;
}