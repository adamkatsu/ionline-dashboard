/**
 * Created by Administrator on 2017/8/8.
 **/
var g_enable = 1;
var g_disable = 0;
var g_autoSync;
var g_CurrentLocalTime;
var g_NTPServer1;
var g_NTPServer2;
var g_NTPServer3;
var g_NTPServer4;
var g_NTPServer5;
var g_LocalTimeZoneName;
var g_HourFormat;
var g_sync_status;
var g_last_success;
var g_sync_status_unsync = 0;
var g_sync_status_syncing = 1;
var g_sync_status_syncsuccess = 2;
var g_sync_status_syncfailure = 3;
var g_sync_error_none = 0;
var g_sync_error_disabled = 1;
var g_sync_error_internal = 2;
var g_sync_error_network = 3;
var g_sync_error_badaddr = 4;
var g_sync_error_timeout = 5;
var g_sync_error_modify = 6;
var g_error_num;
var g_year = 2019;
var g_month = 1;
var g_day = 1;
var g_currentHour = 0;
var g_currentMinute = 0;
var g_currentSecond = 0;
var g_month31 = 31;
var g_month30 = 30;
var g_month28 = 28;
var g_month29 = 29;
var startyear = 1970;
var endyear = 2038;
var g_hour = 23;
var g_minute = 59;
var g_second = 59;
var month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
var week = [str_sntp_sun, str_sntp_mon, str_sntp_tue, str_sntp_wed, str_sntp_thu, str_sntp_fri, str_sntp_sat];
var timeserver = ["clock.fmt.he.net", "clock.nyc.he.net", "clock.sjc.he.net", "clock.via.net", "ntp1.tummy.com", "time.cachenetworks.com", "time.nist.gov","time.windows.com","time.fwa.tim.it"];
var timezoneTbale = [
    ["NTP_TZ_ABIDJAN","Africa/Abidjan","GMT0"],
    ["NTP_TZ_ACCRA", "Africa/Accra", "GMT0"],
    ["NTP_TZ_ADDISABABA", "Africa/Addis Ababa", "EAT-3"],
    ["NTP_TZ_ALGIERS", "Africa/Algiers", "CET-1"],
    ["NTP_TZ_ASMARA", "Africa/Asmara", "EAT-3"],
    ["NTP_TZ_BAMAKO", "Africa/Bamako", "GMT0"],
    ["NTP_TZ_BANGUI", "Africa/Bangui", "WAT-1"],
    ["NTP_TZ_BANJUL", "Africa/Banjul", "GMT0"],
    ["NTP_TZ_BISSAU", "Africa/Bissau", "GMT0"],
    ["NTP_TZ_BLANTYRE", "Africa/Blantyre", "CAT-2"],
    ["NTP_TZ_BRAZZAVILLE", "Africa/Brazzaville", "WAT-1"],
    ["NTP_TZ_BUJUMBURA", "Africa/Bujumbura", "CAT-2"],
    ["NTP_TZ_CAIRO", "Africa/Cairo", "EET-2"],
    ["NTP_TZ_CASABLANCA", "Africa/Casablanca", "WET0WEST,M3.5.0,M10.5.0/3"],
    ["NTP_TZ_CEUTA", "Africa/Ceuta", "CET-1CEST,M3.5.0,M10.5.0/3"],
    ["NTP_TZ_CONAKRY", "Africa/Conakry", "GMT0"],
    ["NTP_TZ_DAKAR", "Africa/Dakar", "GMT0"],
    ["NTP_TZ_DARESSALAAM", "Africa/Dar es Salaam", "EAT-3"],
    ["NTP_TZ_DJIBOUTI", "Africa/Djibouti", "EAT-3"],
    ["NTP_TZ_DOUALA", "Africa/Douala", "WAT-1"],
    ["NTP_TZ_ELAAIUN", "Africa/El Aaiun", "WET0WEST,M3.5.0,M10.5.0/3"],
    ["NTP_TZ_FREETOWN", "Africa/Freetown", "GMT0"],
    ["NTP_TZ_GABORONE", "Africa/Gaborone", "CAT-2" ],
    ["NTP_TZ_HARARE", "Africa/Harare", "CAT-2" ],
    ["NTP_TZ_JOHANNESBURG", "Africa/Johannesburg", "SAST-2" ],
    ["NTP_TZ_JUBA", "Africa/Juba", "EAT-3" ],
    ["NTP_TZ_KAMPALA", "Africa/Kampala", "EAT-3" ],
    ["NTP_TZ_KHARTOUM", "Africa/Khartoum", "EAT-3" ],
    ["NTP_TZ_KIGALI", "Africa/Kigali", "CAT-2" ],
    ["NTP_TZ_KINSHASA", "Africa/Kinshasa", "WAT-1" ],
    ["NTP_TZ_LAGOS", "Africa/Lagos", "WAT-1" ],
    ["NTP_TZ_LIBREVILLE", "Africa/Libreville", "WAT-1" ],
    ["NTP_TZ_LOME", "Africa/Lome", "GMT0" ],
    ["NTP_TZ_LUANDA", "Africa/Luanda", "WAT-1" ],
    ["NTP_TZ_LUBUMBASHI", "Africa/Lubumbashi", "CAT-2" ],
    ["NTP_TZ_LUSAKA", "Africa/Lusaka", "CAT-2" ],
    ["NTP_TZ_MALABO", "Africa/Malabo", "WAT-1" ],
    ["NTP_TZ_MAPUTO", "Africa/Maputo", "CAT-2" ],
    ["NTP_TZ_MASERU", "Africa/Maseru", "SAST-2" ],
    ["NTP_TZ_MBABANE", "Africa/Mbabane", "SAST-2" ],
    ["NTP_TZ_MOGADISHU", "Africa/Mogadishu", "EAT-3" ],
    ["NTP_TZ_MONROVIA", "Africa/Monrovia", "GMT0" ],
    ["NTP_TZ_NAIROBI", "Africa/Nairobi", "EAT-3" ],
    ["NTP_TZ_NDJAMENA", "Africa/Ndjamena", "WAT-1" ],
    ["NTP_TZ_NIAMEY", "Africa/Niamey", "WAT-1" ],
    ["NTP_TZ_NOUAKCHOTT","Africa/Nouakchott", "GMT0" ],
    ["NTP_TZ_OUAGADOUGOU", "Africa/Ouagadougou", "GMT0" ],
    ["NTP_TZ_PORTONOVO", "Africa/Porto-Novo", "WAT-1" ],
    ["NTP_TZ_SAOTOME", "Africa/Sao Tome", "GMT0" ],
    ["NTP_TZ_TRIPOLI", "Africa/Tripoli", "EET-2" ],
    ["NTP_TZ_TUNIS", "Africa/Tunis", "CET-1" ],
    ["NTP_TZ_WINDHOEK", "Africa/Windhoek", "WAT-1WAST,M9.1.0,M4.1.0" ],
    ["NTP_TZ_ADAK", "America/Adak", "HST10HDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_ANCHORAGE", "America/Anchorage", "AKST9AKDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_ANGUILLA", "America/Anguilla", "AST4" ],
    ["NTP_TZ_ANTIGUA", "America/Antigua", "AST4" ],
    ["NTP_TZ_ARAGUAINA", "America/Araguaina", "<-03>3" ],
    ["NTP_TZ_BUENOSAIRES", "America/Argentina/Buenos Aires", "<-03>3" ],
    ["NTP_TZ_CATAMARCA", "America/Argentina/Catamarca", "<-03>3" ],
    ["NTP_TZ_CORDOBA", "America/Argentina/Cordoba", "<-03>3" ],
    ["NTP_TZ_JUJUY", "America/Argentina/Jujuy", "<-03>3" ],
    ["NTP_TZ_LARIOJA", "America/Argentina/La Rioja", "<-03>3" ],
    ["NTP_TZ_MENDOZA", "America/Argentina/Mendoza", "<-03>3" ],
    ["NTP_TZ_RIOGALLEGOS", "America/Argentina/Rio Gallegos", "<-03>3" ],
    ["NTP_TZ_SALTA", "America/Argentina/Salta", "<-03>3" ],
    ["NTP_TZ_SANJUAN", "America/Argentina/San Juan", "<-03>3" ],
    ["NTP_TZ_SANLUIS", "America/Argentina/San Luis", "<-03>3" ],
    ["NTP_TZ_TUCUMAN", "America/Argentina/Tucuman", "<-03>3" ],
    ["NTP_TZ_USHUAIA", "America/Argentina/Ushuaia", "<-03>3" ],
    ["NTP_TZ_ARUBA", "America/Aruba", "AST4" ],
    ["NTP_TZ_ASUNCION", "America/Asuncion", "<-04>4<-03>,M10.1.0/0,M3.4.0/0" ],
    ["NTP_TZ_ATIKOKAN", "America/Atikokan", "EST5" ],
    ["NTP_TZ_BAHIA", "America/Bahia", "<-03>3" ],
    ["NTP_TZ_BAHIABANDERAS", "America/Bahia Banderas", "CST6CDT,M4.1.0,M10.5.0" ],
    ["NTP_TZ_BARBADOS", "America/Barbados", "AST4" ],
    ["NTP_TZ_BELEM", "America/Belem", "<-03>3" ],
    ["NTP_TZ_BELIZE", "America/Belize", "CST6" ],
    ["NTP_TZ_BLANCSABLON", "America/Blanc-Sablon", "AST4" ],
    ["NTP_TZ_BOAVISTA", "America/Boa Vista", "<-04>4" ],
    ["NTP_TZ_BOGOTA", "America/Bogota", "<-05>5" ],
    ["NTP_TZ_BOISE","America/Boise", "MST7MDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_CAMBRIDGEBAY", "America/Cambridge Bay", "MST7MDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_CAMPOGRANDE", "America/Campo Grande", "<-04>4<-03>,M10.3.0/0,M2.3.0/0" ],
    ["NTP_TZ_CANCUN", "America/Cancun", "EST5" ],
    ["NTP_TZ_CARACAS", "America/Caracas", "<-04>4" ],
    ["NTP_TZ_CAYENNE", "America/Cayenne", "<-03>3" ],
    ["NTP_TZ_CAYMAN", "America/Cayman", "EST5" ],
    ["NTP_TZ_CHICAGO", "America/Chicago", "CST6CDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_CHIHUAHUA", "America/Chihuahua", "MST7MDT,M4.1.0,M10.5.0" ],
    ["NTP_TZ_COSTARICA", "America/Costa Rica", "CST6" ],
    ["NTP_TZ_CRESTON", "America/Creston", "MST7" ],
    ["NTP_TZ_CUIABA", "America/Cuiaba", "<-04>4<-03>,M10.3.0/0,M2.3.0/0" ],
    ["NTP_TZ_CURACAO", "America/Curacao", "AST4" ],
    ["NTP_TZ_DANMARKSHAVN", "America/Danmarkshavn", "GMT0" ],
    ["NTP_TZ_DAWSON", "America/Dawson", "PST8PDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_DAWSONCREEK", "America/Dawson Creek", "MST7" ],
    ["NTP_TZ_DENVER", "America/Denver", "MST7MDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_DETROIT", "America/Detroit", "EST5EDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_DOMINICA", "America/Dominica", "AST4" ],
    ["NTP_TZ_EDMONTON", "America/Edmonton", "MST7MDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_EIRUNEPE", "America/Eirunepe", "<-05>5" ],
    ["NTP_TZ_ELSALVADOR", "America/El Salvador", "CST6" ],
    ["NTP_TZ_FORTNELSON", "America/Fort Nelson", "MST7" ],
    ["NTP_TZ_FORTALEZA", "America/Fortaleza", "<-03>3" ],
    ["NTP_TZ_GLACEBAY", "America/Glace Bay", "AST4ADT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_GODTHAB", "America/Godthab", "<-03>3<-02>,M3.5.0/-2,M10.5.0/-1" ],
    ["NTP_TZ_GOOSEBAY", "America/Goose Bay", "AST4ADT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_GRANDTURK", "America/Grand Turk", "AST4" ],
    ["NTP_TZ_GRENADA", "America/Grenada", "AST4" ],
    ["NTP_TZ_GUADELOUPE", "America/Guadeloupe", "AST4" ],
    ["NTP_TZ_GUATEMALA", "America/Guatemala", "CST6" ],
    ["NTP_TZ_GUAYAQUIL", "America/Guayaquil", "<-05>5" ],
    ["NTP_TZ_GUYANA", "America/Guyana", "<-04>4" ],
    ["NTP_TZ_HALIFAX", "America/Halifax", "AST4ADT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_HAVANA", "America/Havana", "CST5CDT,M3.2.0/0,M11.1.0/1" ],
    ["NTP_TZ_HERMOSILLO", "America/Hermosillo", "MST7" ],
    ["NTP_TZ_INDIANAPOLIS", "America/Indiana/Indianapolis", "EST5EDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_KNOX", "America/Indiana/Knox", "CST6CDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_MARENGO", "America/Indiana/Marengo", "EST5EDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_PETERSBURG", "America/Indiana/Petersburg", "EST5EDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_TELLCITY", "America/Indiana/Tell City", "CST6CDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_VEVAY", "America/Indiana/Vevay", "EST5EDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_VINCENNES", "America/Indiana/Vincennes", "EST5EDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_WINAMAC", "America/Indiana/Winamac", "EST5EDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_INUVIK", "America/Inuvik", "MST7MDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_IQALUIT", "America/Iqaluit", "EST5EDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_JAMAICA", "America/Jamaica", "EST5" ],
    ["NTP_TZ_JUNEAU", "America/Juneau", "AKST9AKDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_LOUISVILLE", "America/Kentucky/Louisville", "EST5EDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_MONTICELLO", "America/Kentucky/Monticello", "EST5EDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_KRALENDIJK", "America/Kralendijk", "AST4" ],
    ["NTP_TZ_LAPAZ", "America/La Paz", "<-04>4" ],
    ["NTP_TZ_LIMA", "America/Lima", "<-05>5" ],
    ["NTP_TZ_LOSANGELES", "America/Los Angeles", "PST8PDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_LOWERPRINCES", "America/Lower Princes", "AST4" ],
    ["NTP_TZ_MACEIO", "America/Maceio", "<-03>3" ],
    ["NTP_TZ_MANAGUA", "America/Managua", "CST6" ],
    ["NTP_TZ_MANAUS", "America/Manaus", "<-04>4" ],
    ["NTP_TZ_MARIGOT", "America/Marigot", "AST4" ],
    ["NTP_TZ_MARTINIQUE", "America/Martinique", "AST4" ],
    ["NTP_TZ_MATAMOROS", "America/Matamoros", "CST6CDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_MAZATLAN", "America/Mazatlan", "MST7MDT,M4.1.0,M10.5.0" ],
    ["NTP_TZ_MENOMINEE", "America/Menominee", "CST6CDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_MERIDA", "America/Merida", "CST6CDT,M4.1.0,M10.5.0" ],
    ["NTP_TZ_METLAKATLA", "America/Metlakatla", "AKST9AKDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_MEXICOCITY", "America/Mexico City", "CST6CDT,M4.1.0,M10.5.0" ],
    ["NTP_TZ_MIQUELON", "America/Miquelon", "<-03>3<-02>,M3.2.0,M11.1.0" ],
    ["NTP_TZ_MONCTON", "America/Moncton", "AST4ADT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_MONTERREY", "America/Monterrey", "CST6CDT,M4.1.0,M10.5.0" ],
    ["NTP_TZ_MONTEVIDEO", "America/Montevideo", "<-03>3" ],
    ["NTP_TZ_MONTSERRAT", "America/Montserrat", "AST4" ],
    ["NTP_TZ_NASSAU", "America/Nassau", "EST5EDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_NEWYORK", "America/New York", "EST5EDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_NIPIGON", "America/Nipigon", "EST5EDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_NOME", "America/Nome", "AKST9AKDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_NORONHA", "America/Noronha", "<-02>2" ],
    ["NTP_TZ_BEULAH", "America/North Dakota/Beulah", "CST6CDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_CENTER", "America/North Dakota/Center", "CST6CDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_NEWSALEM", "America/North Dakota/New Salem", "CST6CDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_OJINAGA", "America/Ojinaga", "MST7MDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_PANAMA", "America/Panama", "EST5" ],
    ["NTP_TZ_PANGNIRTUNG", "America/Pangnirtung", "EST5EDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_PARAMARIBO", "America/Paramaribo", "<-03>3" ],
    ["NTP_TZ_PHOENIX", "America/Phoenix", "MST7" ],
    ["NTP_TZ_PORTOFSPAIN", "America/Port of Spain", "AST4" ],
    ["NTP_TZ_PORTAUPRINCE", "America/Port-au-Prince", "EST5EDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_PORTOVELHO", "America/Porto Velho", "<-04>4" ],
    ["NTP_TZ_PUERTORICO", "America/Puerto Rico", "AST4" ],
    ["NTP_TZ_PUNTAARENAS", "America/Punta Arenas", "<-03>3" ],
    ["NTP_TZ_RAINYRIVER", "America/Rainy River", "CST6CDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_RANKININLET", "America/Rankin Inlet", "CST6CDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_RECIFE", "America/Recife", "<-03>3" ],
    ["NTP_TZ_REGINA", "America/Regina", "CST6" ],
    ["NTP_TZ_RESOLUTE", "America/Resolute", "CST6CDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_RIOBRANCO", "America/Rio Branco", "<-05>5" ],
    ["NTP_TZ_SANTAREM", "America/Santarem", "<-03>3" ],
    ["NTP_TZ_SANTIAGO", "America/Santiago", "<-04>4<-03>,M8.2.6/24,M5.2.6/24" ],
    ["NTP_TZ_SANTODOMINGO", "America/Santo Domingo", "AST4" ],
    ["NTP_TZ_SAOPAULO", "America/Sao Paulo", "<-03>3<-02>,M10.3.0/0,M2.3.0/0" ],
    ["NTP_TZ_SCORESBYSUND", "America/Scoresbysund", "<-01>1<+00>,M3.5.0/0,M10.5.0/1" ],
    ["NTP_TZ_SITKA", "America/Sitka", "AKST9AKDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_STBARTHELEMY", "America/St Barthelemy", "AST4" ],
    ["NTP_TZ_STJOHNS", "America/St Johns", "NST3:30NDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_STKITTS", "America/St Kitts", "AST4" ],
    ["NTP_TZ_STLUCIA", "America/St Lucia", "AST4" ],
    ["NTP_TZ_STTHOMAS", "America/St Thomas", "AST4" ],
    ["NTP_TZ_STVINCENT", "America/St Vincent", "AST4" ],
    ["NTP_TZ_SWIFTCURRENT", "America/Swift Current", "CST6" ],
    ["NTP_TZ_TEGUCIGALPA", "America/Tegucigalpa", "CST6" ],
    ["NTP_TZ_THULE", "America/Thule", "AST4ADT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_THUNDERBAY", "America/Thunder Bay", "EST5EDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_TIJUANA", "America/Tijuana", "PST8PDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_TORONTO", "America/Toronto", "EST5EDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_TORTOLA", "America/Tortola", "AST4" ],
    ["NTP_TZ_VANCOUVER", "America/Vancouver", "PST8PDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_WHITEHORSE", "America/Whitehorse", "PST8PDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_WINNIPEG", "America/Winnipeg", "CST6CDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_YAKUTAT", "America/Yakutat", "AKST9AKDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_YELLOWKNIFE", "America/Yellowknife", "MST7MDT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_CASEY", "Antarctica/Casey", "<+11>-11" ],
    ["NTP_TZ_DAVIS", "Antarctica/Davis", "<+07>-7" ],
    ["NTP_TZ_DUMONTDURVILLE", "Antarctica/DumontDUrville", "<+10>-10" ],
    ["NTP_TZ_MACQUARIE", "Antarctica/Macquarie", "<+11>-11" ],
    ["NTP_TZ_MAWSON", "Antarctica/Mawson", "<+05>-5" ],
    ["NTP_TZ_MCMURDO", "Antarctica/McMurdo", "NZST-12NZDT,M9.5.0,M4.1.0/3" ],
    ["NTP_TZ_PALMER", "Antarctica/Palmer", "<-03>3" ],
    ["NTP_TZ_ROTHERA", "Antarctica/Rothera", "<-03>3" ],
    ["NTP_TZ_SYOWA", "Antarctica/Syowa", "<+03>-3" ],
    ["NTP_TZ_TROLL", "Antarctica/Troll", "<+00>0<+02>-2,M3.5.0/1,M10.5.0/3" ],
    ["NTP_TZ_VOSTOK", "Antarctica/Vostok", "<+06>-6" ],
    ["NTP_TZ_LONGYEARBYEN", "Arctic/Longyearbyen", "CET-1CEST,M3.5.0,M10.5.0/3" ],
    ["NTP_TZ_ADEN", "Asia/Aden", "<+03>-3" ],
    ["NTP_TZ_ALMATY", "Asia/Almaty", "<+06>-6" ],
    ["NTP_TZ_AMMAN", "Asia/Amman", "EET-2EEST,M3.5.4/24,M10.5.5/1" ],
    ["NTP_TZ_ANADYR", "Asia/Anadyr", "<+12>-12" ],
    ["NTP_TZ_AQTAU", "Asia/Aqtau", "<+05>-5" ],
    ["NTP_TZ_AQTOBE", "Asia/Aqtobe", "<+05>-5" ],
    ["NTP_TZ_ASHGABAT", "Asia/Ashgabat", "<+05>-5" ],
    ["NTP_TZ_ATYRAU", "Asia/Atyrau", "<+05>-5" ],
    ["NTP_TZ_BAGHDAD", "Asia/Baghdad", "<+03>-3" ],
    ["NTP_TZ_BAHRAIN", "Asia/Bahrain", "<+03>-3" ],
    ["NTP_TZ_BAKU", "Asia/Baku", "<+04>-4" ],
    ["NTP_TZ_BANGKOK", "Asia/Bangkok", "<+07>-7" ],
    ["NTP_TZ_BARNAUL", "Asia/Barnaul", "<+07>-7" ],
    ["NTP_TZ_BEIRUT", "Asia/Beirut", "EET-2EEST,M3.5.0/0,M10.5.0/0" ],
    ["NTP_TZ_BISHKEK", "Asia/Bishkek", "<+06>-6" ],
    ["NTP_TZ_BRUNEI", "Asia/Brunei", "<+08>-8" ],
    ["NTP_TZ_CHITA", "Asia/Chita", "<+09>-9" ],
    ["NTP_TZ_CHOIBALSAN", "Asia/Choibalsan", "<+08>-8" ],
    ["NTP_TZ_COLOMBO", "Asia/Colombo", "<+0530>-5:30" ],
    ["NTP_TZ_DAMASCUS", "Asia/Damascus", "EET-2EEST,M3.5.5/0,M10.5.5/0" ],
    ["NTP_TZ_DHAKA", "Asia/Dhaka", "<+06>-6" ],
    ["NTP_TZ_DILI", "Asia/Dili", "<+09>-9" ],
    ["NTP_TZ_DUBAI", "Asia/Dubai", "<+04>-4" ],
    ["NTP_TZ_DUSHANBE", "Asia/Dushanbe", "<+05>-5" ],
    ["NTP_TZ_FAMAGUSTA", "Asia/Famagusta", "<+03>-3" ],
    ["NTP_TZ_GAZA", "Asia/Gaza", "EET-2EEST,M3.5.6/1,M10.5.6/1" ],
    ["NTP_TZ_HEBRON", "Asia/Hebron", "EET-2EEST,M3.5.6/1,M10.5.6/1" ],
    ["NTP_TZ_HOCHIMINH", "Asia/Ho Chi Minh", "<+07>-7" ],
    ["NTP_TZ_HONGKONG", "Asia/Hong Kong", "HKT-8" ],
    ["NTP_TZ_HOVD", "Asia/Hovd", "<+07>-7" ],
    ["NTP_TZ_IRKUTSK", "Asia/Irkutsk", "<+08>-8" ],
    ["NTP_TZ_JAKARTA", "Asia/Jakarta", "WIB-7" ],
    ["NTP_TZ_JAYAPURA", "Asia/Jayapura", "WIT-9" ],
    ["NTP_TZ_JERUSALEM", "Asia/Jerusalem", "IST-2IDT,M3.4.4/26,M10.5.0" ],
    ["NTP_TZ_KABUL", "Asia/Kabul", "<+0430>-4:30" ],
    ["NTP_TZ_KAMCHATKA", "Asia/Kamchatka", "<+12>-12" ],
    ["NTP_TZ_KARACHI", "Asia/Karachi", "PKT-5" ],
    ["NTP_TZ_KATHMANDU", "Asia/Kathmandu", "<+0545>-5:45" ],
    ["NTP_TZ_KHANDYGA", "Asia/Khandyga", "<+09>-9" ],
    ["NTP_TZ_KOLKATA", "Asia/Kolkata", "IST-5:30" ],
    ["NTP_TZ_KRASNOYARSK", "Asia/Krasnoyarsk", "<+07>-7" ],
    ["NTP_TZ_KUALALUMPUR", "Asia/Kuala Lumpur", "<+08>-8" ],
    ["NTP_TZ_KUCHING", "Asia/Kuching", "<+08>-8" ],
    ["NTP_TZ_KUWAIT", "Asia/Kuwait", "<+03>-3" ],
    ["NTP_TZ_MACAU", "Asia/Macau", "CST-8" ],
    ["NTP_TZ_MAGADAN", "Asia/Magadan", "<+11>-11" ],
    ["NTP_TZ_MAKASSAR", "Asia/Makassar", "WITA-8" ],
    ["NTP_TZ_MANILA", "Asia/Manila", "<+08>-8" ],
    ["NTP_TZ_MUSCAT", "Asia/Muscat", "<+04>-4" ],
    ["NTP_TZ_NICOSIA", "Asia/Nicosia", "EET-2EEST,M3.5.0/3,M10.5.0/4" ],
    ["NTP_TZ_NOVOKUZNETSK", "Asia/Novokuznetsk", "<+07>-7" ],
    ["NTP_TZ_NOVOSIBIRSK", "Asia/Novosibirsk", "<+07>-7" ],
    ["NTP_TZ_OMSK", "Asia/Omsk", "<+06>-6" ],
    ["NTP_TZ_ORAL", "Asia/Oral", "<+05>-5" ],
    ["NTP_TZ_PHNOMPENH", "Asia/Phnom Penh", "<+07>-7" ],
    ["NTP_TZ_PONTIANAK", "Asia/Pontianak", "WIB-7" ],
    ["NTP_TZ_PYONGYANG", "Asia/Pyongyang", "KST-8:30" ],
    ["NTP_TZ_QATAR", "Asia/Qatar", "<+03>-3" ],
    ["NTP_TZ_QYZYLORDA", "Asia/Qyzylorda", "<+06>-6" ],
    ["NTP_TZ_RIYADH", "Asia/Riyadh", "<+03>-3" ],
    ["NTP_TZ_SAKHALIN", "Asia/Sakhalin", "<+11>-11" ],
    ["NTP_TZ_SAMARKAND", "Asia/Samarkand", "<+05>-5" ],
    ["NTP_TZ_SEOUL", "Asia/Seoul", "KST-9" ],
    ["NTP_TZ_SHANGHAI", "Asia/Shanghai", "CST-8" ],
    ["NTP_TZ_SINGAPORE", "Asia/Singapore", "<+08>-8" ],
    ["NTP_TZ_SREDNEKOLYMSK", "Asia/Srednekolymsk", "<+11>-11" ],
    ["NTP_TZ_TAIPEI", "Asia/Taipei", "CST-8" ],
    ["NTP_TZ_TASHKENT", "Asia/Tashkent", "<+05>-5" ],
    ["NTP_TZ_TBILISI", "Asia/Tbilisi", "<+04>-4" ],
    ["NTP_TZ_TEHRAN", "Asia/Tehran", "<+0330>-3:30<+0430>,J80/0,J264/0" ],
    ["NTP_TZ_THIMPHU", "Asia/Thimphu", "<+06>-6" ],
    ["NTP_TZ_TOKYO", "Asia/Tokyo", "JST-9" ],
    ["NTP_TZ_TOMSK", "Asia/Tomsk", "<+07>-7" ],
    ["NTP_TZ_ULAANBAATAR", "Asia/Ulaanbaatar", "<+08>-8" ],
    ["NTP_TZ_URUMQI", "Asia/Urumqi", "<+06>-6" ],
    ["NTP_TZ_USTNERA", "Asia/Ust-Nera", "<+10>-10" ],
    ["NTP_TZ_VIENTIANE", "Asia/Vientiane", "<+07>-7" ],
    ["NTP_TZ_VLADIVOSTOK", "Asia/Vladivostok", "<+10>-10" ],
    ["NTP_TZ_YAKUTSK", "Asia/Yakutsk", "<+09>-9" ],
    ["NTP_TZ_YANGON", "Asia/Yangon", "<+0630>-6:30" ],
    ["NTP_TZ_YEKATERINBURG", "Asia/Yekaterinburg", "<+05>-5" ],
    ["NTP_TZ_YEREVAN", "Asia/Yerevan", "<+04>-4" ],
    ["NTP_TZ_AZORES", "Atlantic/Azores", "<-01>1<+00>,M3.5.0/0,M10.5.0/1" ],
    ["NTP_TZ_BERMUDA", "Atlantic/Bermuda", "AST4ADT,M3.2.0,M11.1.0" ],
    ["NTP_TZ_CANARY", "Atlantic/Canary", "WET0WEST,M3.5.0/1,M10.5.0" ],
    ["NTP_TZ_CAPEVERDE", "Atlantic/Cape Verde", "<-01>1" ],
    ["NTP_TZ_FAROE", "Atlantic/Faroe", "WET0WEST,M3.5.0/1,M10.5.0" ],
    ["NTP_TZ_MADEIRA", "Atlantic/Madeira", "WET0WEST,M3.5.0/1,M10.5.0" ],
    ["NTP_TZ_REYKJAVIK", "Atlantic/Reykjavik", "GMT0" ],
    ["NTP_TZ_SOUTHGEORGIA", "Atlantic/South Georgia", "<-02>2" ],
    ["NTP_TZ_STHELENA", "Atlantic/St Helena", "GMT0" ],
    ["NTP_TZ_STANLEY", "Atlantic/Stanley", "<-03>3" ],
    ["NTP_TZ_ADELAIDE", "Australia/Adelaide", "ACST-9:30ACDT,M10.1.0,M4.1.0/3" ],
    ["NTP_TZ_BRISBANE", "Australia/Brisbane", "AEST-10" ],
    ["NTP_TZ_BROKENHILL", "Australia/Broken Hill", "ACST-9:30ACDT,M10.1.0,M4.1.0/3" ],
    ["NTP_TZ_CURRIE", "Australia/Currie", "AEST-10AEDT,M10.1.0,M4.1.0/3" ],
    ["NTP_TZ_DARWIN", "Australia/Darwin", "ACST-9:30" ],
    ["NTP_TZ_EUCLA", "Australia/Eucla", "<+0845>-8:45" ],
    ["NTP_TZ_HOBART", "Australia/Hobart", "AEST-10AEDT,M10.1.0,M4.1.0/3" ],
    ["NTP_TZ_LINDEMAN", "Australia/Lindeman", "AEST-10" ],
    ["NTP_TZ_LORDHOWE", "Australia/Lord Howe", "<+1030>-10:30<+11>-11,M10.1.0,M4.1.0" ],
    ["NTP_TZ_MELBOURNE", "Australia/Melbourne", "AEST-10AEDT,M10.1.0,M4.1.0/3" ],
    ["NTP_TZ_PERTH", "Australia/Perth", "AWST-8" ],
    ["NTP_TZ_SYDNEY", "Australia/Sydney", "AEST-10AEDT,M10.1.0,M4.1.0/3" ],
    ["NTP_TZ_AMSTERDAM", "Europe/Amsterdam", "CET-1CEST,M3.5.0,M10.5.0/3" ],
    ["NTP_TZ_ANDORRA", "Europe/Andorra", "CET-1CEST,M3.5.0,M10.5.0/3" ],
    ["NTP_TZ_ASTRAKHAN", "Europe/Astrakhan", "<+04>-4" ],
    ["NTP_TZ_ATHENS", "Europe/Athens", "EET-2EEST,M3.5.0/3,M10.5.0/4" ],
    ["NTP_TZ_BELGRADE", "Europe/Belgrade", "CET-1CEST,M3.5.0,M10.5.0/3" ],
    ["NTP_TZ_BERLIN", "Europe/Berlin", "CET-1CEST,M3.5.0,M10.5.0/3" ],
    ["NTP_TZ_BRATISLAVA", "Europe/Bratislava", "CET-1CEST,M3.5.0,M10.5.0/3" ],
    ["NTP_TZ_BRUSSELS", "Europe/Brussels", "CET-1CEST,M3.5.0,M10.5.0/3" ],
    ["NTP_TZ_BUCHAREST", "Europe/Bucharest", "EET-2EEST,M3.5.0/3,M10.5.0/4" ],
    ["NTP_TZ_BUDAPEST", "Europe/Budapest", "CET-1CEST,M3.5.0,M10.5.0/3" ],
    ["NTP_TZ_BUSINGEN", "Europe/Busingen", "CET-1CEST,M3.5.0,M10.5.0/3" ],
    ["NTP_TZ_CHISINAU", "Europe/Chisinau", "EET-2EEST,M3.5.0,M10.5.0/3" ],
    ["NTP_TZ_COPENHAGEN", "Europe/Copenhagen", "CET-1CEST,M3.5.0,M10.5.0/3" ],
    ["NTP_TZ_DUBLIN", "Europe/Dublin", "GMT0IST,M3.5.0/1,M10.5.0" ],
    ["NTP_TZ_GIBRALTAR", "Europe/Gibraltar", "CET-1CEST,M3.5.0,M10.5.0/3" ],
    ["NTP_TZ_GUERNSEY", "Europe/Guernsey", "GMT0BST,M3.5.0/1,M10.5.0" ],
    ["NTP_TZ_HELSINKI", "Europe/Helsinki", "EET-2EEST,M3.5.0/3,M10.5.0/4" ],
    ["NTP_TZ_ISLEOFMAN", "Europe/Isle of Man", "GMT0BST,M3.5.0/1,M10.5.0" ],
    ["NTP_TZ_ISTANBUL", "Europe/Istanbul", "<+03>-3" ],
    ["NTP_TZ_JERSEY", "Europe/Jersey", "GMT0BST,M3.5.0/1,M10.5.0" ],
    ["NTP_TZ_KALININGRAD", "Europe/Kaliningrad", "EET-2" ],
    ["NTP_TZ_KIEV", "Europe/Kiev", "EET-2EEST,M3.5.0/3,M10.5.0/4" ],
    ["NTP_TZ_KIROV", "Europe/Kirov", "<+03>-3" ],
    ["NTP_TZ_LISBON", "Europe/Lisbon", "WET0WEST,M3.5.0/1,M10.5.0" ],
    ["NTP_TZ_LJUBLJANA", "Europe/Ljubljana", "CET-1CEST,M3.5.0,M10.5.0/3" ],
    ["NTP_TZ_LONDON", "Europe/London", "GMT0BST,M3.5.0/1,M10.5.0" ],
    ["NTP_TZ_LUXEMBOURG", "Europe/Luxembourg", "CET-1CEST,M3.5.0,M10.5.0/3" ],
    ["NTP_TZ_MADRID", "Europe/Madrid", "CET-1CEST,M3.5.0,M10.5.0/3" ],
    ["NTP_TZ_MALTA", "Europe/Malta", "CET-1CEST,M3.5.0,M10.5.0/3" ],
    ["NTP_TZ_MARIEHAMN", "Europe/Mariehamn", "EET-2EEST,M3.5.0/3,M10.5.0/4" ],
    ["NTP_TZ_MINSK", "Europe/Minsk", "<+03>-3" ],
    ["NTP_TZ_MONACO", "Europe/Monaco", "CET-1CEST,M3.5.0,M10.5.0/3" ],
    ["NTP_TZ_MOSCOW", "Europe/Moscow", "MSK-3" ],
    ["NTP_TZ_OSLO", "Europe/Oslo", "CET-1CEST,M3.5.0,M10.5.0/3" ],
    ["NTP_TZ_PARIS", "Europe/Paris", "CET-1CEST,M3.5.0,M10.5.0/3" ],
    ["NTP_TZ_PODGORICA", "Europe/Podgorica", "CET-1CEST,M3.5.0,M10.5.0/3" ],
    ["NTP_TZ_PRAGUE", "Europe/Prague", "CET-1CEST,M3.5.0,M10.5.0/3" ],
    ["NTP_TZ_RIGA", "Europe/Riga", "EET-2EEST,M3.5.0/3,M10.5.0/4" ],
    ["NTP_TZ_ROME", "Europe/Rome", "CET-1CEST,M3.5.0,M10.5.0/3" ],
    ["NTP_TZ_SAMARA", "Europe/Samara", "<+04>-4" ],
    ["NTP_TZ_SANMARINO", "Europe/San Marino", "CET-1CEST,M3.5.0,M10.5.0/3" ],
    ["NTP_TZ_SARAJEVO", "Europe/Sarajevo", "CET-1CEST,M3.5.0,M10.5.0/3" ],
    ["NTP_TZ_SARATOV", "Europe/Saratov", "<+04>-4" ],
    ["NTP_TZ_SIMFEROPOL", "Europe/Simferopol", "MSK-3" ],
    ["NTP_TZ_SKOPJE", "Europe/Skopje", "CET-1CEST,M3.5.0,M10.5.0/3" ],
    ["NTP_TZ_SOFIA", "Europe/Sofia", "EET-2EEST,M3.5.0/3,M10.5.0/4" ],
    ["NTP_TZ_STOCKHOLM", "Europe/Stockholm", "CET-1CEST,M3.5.0,M10.5.0/3" ],
    ["NTP_TZ_TALLINN", "Europe/Tallinn", "EET-2EEST,M3.5.0/3,M10.5.0/4" ],
    ["NTP_TZ_TIRANE", "Europe/Tirane", "CET-1CEST,M3.5.0,M10.5.0/3" ],
    ["NTP_TZ_ULYANOVSK", "Europe/Ulyanovsk", "<+04>-4" ],
    ["NTP_TZ_UZHGOROD", "Europe/Uzhgorod", "EET-2EEST,M3.5.0/3,M10.5.0/4" ],
    ["NTP_TZ_VADUZ", "Europe/Vaduz", "CET-1CEST,M3.5.0,M10.5.0/3" ],
    ["NTP_TZ_VATICAN", "Europe/Vatican", "CET-1CEST,M3.5.0,M10.5.0/3" ],
    ["NTP_TZ_VIENNA", "Europe/Vienna", "CET-1CEST,M3.5.0,M10.5.0/3" ],
    ["NTP_TZ_VILNIUS", "Europe/Vilnius", "EET-2EEST,M3.5.0/3,M10.5.0/4" ],
    ["NTP_TZ_VOLGOGRAD", "Europe/Volgograd", "<+03>-3" ],
    ["NTP_TZ_WARSAW", "Europe/Warsaw", "CET-1CEST,M3.5.0,M10.5.0/3" ],
    ["NTP_TZ_ZAGREB", "Europe/Zagreb", "CET-1CEST,M3.5.0,M10.5.0/3" ],
    ["NTP_TZ_ZAPOROZHYE", "Europe/Zaporozhye", "EET-2EEST,M3.5.0/3,M10.5.0/4" ],
    ["NTP_TZ_ZURICH", "Europe/Zurich", "CET-1CEST,M3.5.0,M10.5.0/3" ],
    ["NTP_TZ_ANTANANARIVO", "Indian/Antananarivo", "EAT-3" ],
    ["NTP_TZ_CHAGOS", "Indian/Chagos", "<+06>-6" ],
    ["NTP_TZ_CHRISTMAS", "Indian/Christmas", "<+07>-7" ],
    ["NTP_TZ_COCOS", "Indian/Cocos", "<+0630>-6:30" ],
    ["NTP_TZ_COMORO", "Indian/Comoro", "EAT-3" ],
    ["NTP_TZ_KERGUELEN", "Indian/Kerguelen", "<+05>-5" ],
    ["NTP_TZ_MAHE", "Indian/Mahe", "<+04>-4" ],
    ["NTP_TZ_MALDIVES", "Indian/Maldives", "<+05>-5" ],
    ["NTP_TZ_MAURITIUS", "Indian/Mauritius", "<+04>-4" ],
    ["NTP_TZ_MAYOTTE", "Indian/Mayotte", "EAT-3" ],
    ["NTP_TZ_REUNION", "Indian/Reunion", "<+04>-4" ],
    ["NTP_TZ_APIA", "Pacific/Apia", "<+13>-13<+14>,M9.5.0/3,M4.1.0/4" ],
    ["NTP_TZ_AUCKLAND", "Pacific/Auckland", "NZST-12NZDT,M9.5.0,M4.1.0/3" ],
    ["NTP_TZ_BOUGAINVILLE", "Pacific/Bougainville", "<+11>-11" ],
    ["NTP_TZ_CHATHAM", "Pacific/Chatham", "<+1245>-12:45<+1345>,M9.5.0/2:45,M4.1.0/3:45" ],
    ["NTP_TZ_CHUUK", "Pacific/Chuuk", "<+10>-10" ],
    ["NTP_TZ_EASTER", "Pacific/Easter", "<-06>6<-05>,M8.2.6/22,M5.2.6/22" ],
    ["NTP_TZ_EFATE", "Pacific/Efate", "<+11>-11" ],
    ["NTP_TZ_ENDERBURY", "Pacific/Enderbury", "<+13>-13" ],
    ["NTP_TZ_FAKAOFO", "Pacific/Fakaofo", "<+13>-13" ],
    ["NTP_TZ_FIJI", "Pacific/Fiji", "<+12>-12<+13>,M11.1.0,M1.3.0/3" ],
    ["NTP_TZ_FUNAFUTI", "Pacific/Funafuti", "<+12>-12" ],
    ["NTP_TZ_GALAPAGOS", "Pacific/Galapagos", "<-06>6" ],
    ["NTP_TZ_GAMBIER", "Pacific/Gambier", "<-09>9" ],
    ["NTP_TZ_GUADALCANAL", "Pacific/Guadalcanal", "<+11>-11" ],
    ["NTP_TZ_GUAM", "Pacific/Guam", "ChST-10" ],
    ["NTP_TZ_HONOLULU", "Pacific/Honolulu", "HST10" ],
    ["NTP_TZ_KIRITIMATI", "Pacific/Kiritimati", "<+14>-14" ],
    ["NTP_TZ_KOSRAE", "Pacific/Kosrae", "<+11>-11" ],
    ["NTP_TZ_KWAJALEIN", "Pacific/Kwajalein", "<+12>-12" ],
    ["NTP_TZ_MAJURO", "Pacific/Majuro", "<+12>-12" ],
    ["NTP_TZ_MARQUESAS", "Pacific/Marquesas", "<-0930>9:30" ],
    ["NTP_TZ_MIDWAY", "Pacific/Midway", "SST11" ],
    ["NTP_TZ_NAURU", "Pacific/Nauru", "<+12>-12" ],
    ["NTP_TZ_NIUE", "Pacific/Niue", "<-11>11" ],
    ["NTP_TZ_NORFOLK", "Pacific/Norfolk", "<+11>-11" ],
    ["NTP_TZ_NOUMEA", "Pacific/Noumea", "<+11>-11" ],
    ["NTP_TZ_PAGOPAGO", "Pacific/Pago Pago", "SST11" ],
    ["NTP_TZ_PALAU", "Pacific/Palau", "<+09>-9" ],
    ["NTP_TZ_PITCAIRN", "Pacific/Pitcairn", "<-08>8" ],
    ["NTP_TZ_POHNPEI", "Pacific/Pohnpei", "<+11>-11" ],
    ["NTP_TZ_PORTMORESBY", "Pacific/Port Moresby", "<+10>-10" ],
    ["NTP_TZ_RAROTONGA", "Pacific/Rarotonga", "<-10>10" ],
    ["NTP_TZ_SAIPAN", "Pacific/Saipan", "ChST-10" ],
    ["NTP_TZ_TAHITI", "Pacific/Tahiti", "<-10>10" ],
    ["NTP_TZ_TARAWA", "Pacific/Tarawa", "<+12>-12" ],
    ["NTP_TZ_TONGATAPU", "Pacific/Tongatapu", "<+13>-13<+14>,M11.1.0,M1.3.0/3" ],
    ["NTP_TZ_WAKE", "Pacific/Wake", "<+12>-12" ],
    ["NTP_TZ_WALLIS", "Pacific/Wallis", "<+12>-12" ],
    ["NTP_TZ_ABBRSV", "Europe/Amsterdam,Berlin,Bern,Rome,Stockholm,Vienna", "CET-1CEST,M3.5.0,M10.5.0/3"]
];
function initGetinfo(selectid,inputip,NTPServer){
    $(selectid).val(NTPServer);
    $(inputip).val(NTPServer);
}
function isLeapYear(year) {
    var cond1 = year % 4 == 0;  //条件1：年份必须要能被4整除
    var cond2 = year % 100 != 0;  //条件2：年份不能是整百数
    var cond3 = year % 400 ==0;  //条件3：年份是400的倍数
    //当条件1和条件2同时成立时，就肯定是闰年，所以条件1和条件2之间为“与”的关系。
    //如果条件1和条件2不能同时成立，但如果条件3能成立，则仍然是闰年。所以条件3与前2项为“或”的关系。
    //所以得出判断闰年的表达式：
    var cond = cond1 && cond2 || cond3;
    if(cond) {
        return true;
    } else {
        return false;
    }
}
function isLeapMonth(){
    var changMonth = $("#setMonth").val(),changeYear = $("#setYear").val();
    var dayHtml = "",dayOption = "<option value='%s'>%d</option>";
    if(changMonth==2 && isLeapYear(changeYear) == true){
        for(var i=0;i<g_month29;i++){
            dayHtml += dayOption;
            dayHtml = dayHtml.replace("%s",i+1).replace("%d",i+1);
        }
        $("#setDay").html(dayHtml);
    }else if(changMonth==2){
        for(var i=0;i<g_month28;i++){
            dayHtml += dayOption;
            dayHtml = dayHtml.replace("%s",i+1).replace("%d",i+1);
        }
        $("#setDay").html(dayHtml);
    }else if(changMonth == 1 || changMonth == 3 || changMonth == 5 || changMonth == 7 || changMonth == 8 || changMonth == 10 || changMonth == 12){
        for(var i=0;i<g_month31;i++){
            dayHtml += dayOption;
            dayHtml = dayHtml.replace("%s",i+1).replace("%d",i+1);
        }
        $("#setDay").html(dayHtml);
    }else{
        for(var i=0;i<g_month30;i++){
            dayHtml += dayOption;
            dayHtml = dayHtml.replace("%s",i+1).replace("%d",i+1);
        }
        $("#setDay").html(dayHtml);
    }
};
function showTimezoneDialog(callback){
    var html_timezone = "";
    var style = [
        '<table class="table-setTime">',
        '<tr><td id="timezoneStr">Timezone</td><td><select id="tz-select" class="select-timezone">%timezone</select></td></tr>',
        '</table>'
    ].join("");
    for(var i = 0,len = timezoneTbale.length;i<len;i++){
        var option = "<option value = '"+ i +"'>"+timezoneTbale[i][1]+"</option>";
        html_timezone += option;
    }
    style = style.replace("%timezone",html_timezone);
    //$("#tz-select").html(html_timezone);
    showDialog(style,dialog_align_left);
    $("#timezoneStr").text(str_timezone);
    $("#tz-select").val(g_LocalTimeZoneName);
    $("#diatitle").children("span").text("Change Timezone");
    $("#diaclose").remove();
    $("#ok-btn").attr("value", common_ok).on("click", callback);
    $("#cancel-btn").attr("value", common_cancel).on("click", closeDialog);
}
function showSetTimeDialog(callback){
    var style = ['<table class="table-setTime">',
        '<tr><td><select id="setYear" class="select-ntp">%year</select></td><td id="yearStr" width="40"></td>',
        '<td><select id="setMonth" class="select-ntp">%month</select></td><td id="monthStr" width="40"></td>',
        '<td><select id="setDay" class="select-ntp">%day</select></td><td id="dayStr" width="40"></td></tr>',
        '<tr><td><select id="setHour" class="select-ntp">%hour</select><td id="hourStr"></td></td>',
        '<td><select id="setMinute" class="select-ntp">%minute</select></td><td id="minuteStr"></td>',
        '<td><select id="setSecond" class="select-ntp">%second</select></td><td id="secondStr"></td></tr>',
        '</table>'].join("");
    var yearsHtml = "",yearOption = "<option value='%s'>%d</option>";
    for(var i=startyear;i<=endyear;i++){
        yearsHtml += yearOption;
        yearsHtml = yearsHtml.replace("%s",i).replace("%d",i);
    }
    style = style.replace("%year",yearsHtml);
    var monthHtml = "",monthOption = "<option value='%s'>%d</option>";
    for(var i=0;i<month.length;i++){
        monthHtml += monthOption;
        monthHtml = monthHtml.replace("%s",i+1).replace("%d",month[i]);
    }
    style = style.replace("%month",monthHtml);
    var dayHtml = "",dayOption = "<option value='%s'>%d</option>";
    if(g_month == 1 || g_month == 3 || g_month == 5 || g_month == 7 || g_month == 8 || g_month == 10 || g_month == 12){
        for(var i=0;i<g_month31;i++){
            dayHtml += dayOption;
            dayHtml = dayHtml.replace("%s",i+1).replace("%d",i+1);
        }
    }else if(g_month == 4 || g_month == 6 || g_month == 9 || g_month == 11){
        for(var i=0;i<g_month30;i++){
            dayHtml += dayOption;
            dayHtml = dayHtml.replace("%s",i+1).replace("%d",i+1);
        }
    }else if(g_month == 2 && isLeapYear(g_year) == true){
        for(var i=0;i<g_month29;i++){
            dayHtml += dayOption;
            dayHtml = dayHtml.replace("%s",i+1).replace("%d",i+1);
        }
    }else{
        for(var i=0;i<g_month28;i++){
            dayHtml += dayOption;
            dayHtml = dayHtml.replace("%s",i+1).replace("%d",i+1);
        }
    }
    style = style.replace("%day",dayHtml);
    var hourHtml = "",hourOption = "<option value='%s'>%d</option>";
    for(var i=0;i<=g_hour;i++){
        hourHtml += hourOption;
        hourHtml = hourHtml.replace("%s",i).replace("%d",i);
    }
    style = style.replace("%hour",hourHtml);
    var minuteHtml = "",minuteOption = "<option value='%s'>%d</option>";
    for(var i=0;i<=g_minute;i++){
        minuteHtml += minuteOption;
        minuteHtml = minuteHtml.replace("%s",i).replace("%d",i);
    }
    style = style.replace("%minute",minuteHtml);
    var secondHtml = "",secondOption = "<option value='%s'>%d</option>";
    for(var i=0;i<=g_second;i++){
        secondHtml += secondOption;
        secondHtml = secondHtml.replace("%s",i).replace("%d",i);
    }
    style = style.replace("%second",secondHtml);
    showDialog(style,dialog_align_left);
    $("#diatitle").children("span").text("Set Location Time");
    $("#diaclose").remove();
    $("#ok-btn").attr("value", common_ok).on("click", callback);
    $("#cancel-btn").attr("value", common_cancel).on("click", closeDialog);
    $("#yearStr").text(str_sntp_Year);
    $("#monthStr").text(str_sntp_Month);
    $("#dayStr").text(str_sntp_Day);
    $("#hourStr").text(str_sntp_Hour);
    $("#minuteStr").text(str_sntp_Minute);
    $("#secondStr").text(str_sntp_Second);
    var arryYear_time = g_CurrentLocalTime.split(" ");
    var YMD = arryYear_time[0].split("-");
    var HMS = arryYear_time[1].split(":");
    g_year = Number(YMD[0]);
    g_month = Number(YMD[1]);
    g_day = Number(YMD[2]);
    g_currentHour = Number(HMS[0]);
    g_currentMinute = Number(HMS[1]);
    g_currentSecond = Number(HMS[2]);
    $("#setYear").val(g_year);
    $("#setMonth").val(g_month);
    $("#setYear").on("change",isLeapMonth);
    $("#setMonth").on("change",isLeapMonth);
    $("#setDay").val(g_day);
    $("#setHour").val(g_currentHour);
    $("#setMinute").val(g_currentMinute);
    $("#setSecond").val(g_currentSecond);
}
function getTimeServerInfo(selectid,inputid){
    var server = $(selectid).val();
    if(server == str_sntp_none){
        server = "";
    }else if(server == str_sntp_other){
        server = $(inputid).val();
    }
    return server;
}
function initAutoSyncData(){
    initGetinfo("#timeserver1","#server_other1",g_NTPServer1);
    initGetinfo("#timeserver2","#server_other2",g_NTPServer2);
    initGetinfo("#timeserver3","#server_other3",g_NTPServer3);
    initGetinfo("#timeserver4","#server_other4",g_NTPServer4);
    initGetinfo("#timeserver5","#server_other5",g_NTPServer5);
    /*for(var i=0;i<timezoneTbale.length;i++){
        if(timezoneTbale[i][0] == g_LocalTimeZoneName){
            $("#timezone").val(g_LocalTimeZoneName);
        }
    }*/
    $("#timezone").text(timezoneTbale[g_LocalTimeZoneName][1]);
}
function initData(){
    $("#HourFormat").val(g_HourFormat);
    var i, html_server = "", html_timezone = "";
    for(i = 0,len = timeserver.length;i<len;i++){
        var option = "<option >"+timeserver[i]+"</option>";
        html_server += option;
        $("#timeserver1").html(html_server);
        $("#timeserver2").html(html_server);
        $("#timeserver3").html(html_server);
        $("#timeserver4").html(html_server);
        $("#timeserver5").html(html_server);
    }
    if(g_autoSync == g_enable){
        $("#enable-networktime").attr("checked","checked");
        $("#enable-networktime").attr("value",1);
        $("#autosync").show();
    }else if(g_autoSync == g_disable){
        $("#enable-networktime").removeAttr("checked");
        $("#enable-networktime").attr("value",0);
        $("#autosync").hide();
    }
    initAutoSyncData();
}
function GetSntpInfo(){
    getAjaxJsonData("/action/get_ntp_info", function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            g_autoSync = obj.enable;
            g_sync_status = obj.state;
            g_error_num = obj.error;
            g_CurrentLocalTime = obj.localtime;
            g_last_success = obj.lastsuccess;
            g_HourFormat = obj.format;
            g_NTPServer1 = obj.server1;
            g_NTPServer2 = obj.server2;
            g_NTPServer3 = obj.server3;
            g_NTPServer4 = obj.server4;
            g_NTPServer5 = obj.server5;
            g_LocalTimeZoneName = obj.tzid;
            if(g_last_success.length == 0){
                $("#lastsuctr").hide();
            }else{
                $("#lastsuccess").text(g_last_success);
                $("#lastsuctr").show();
            }
        }
    }, {
        async: false
    });
    setTimeout(GetSntpInfo,1000);
}
function saveSntpInfo(){
    var postdata, data = {};
    data.enable = $("#enable-networktime").val();
    var zonetime = $("#timezone").val();
    data.server1 = $("#server_other1").val();
    data.server2 = $("#server_other2").val();
    data.server3 = $("#server_other3").val();
    data.server4 = $("#server_other4").val();
    data.server5 = $("#server_other5").val();
    data.timezoneindex = zonetime;

    postdata = JSON.stringify(data);
    saveAjaxJsonData("/action/set_ntp_info", postdata, function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            showResultDialog(common_result, common_success, 3000);
        } else {
            showResultDialog(common_result, common_failed, 3000);
        }
    }, {
        async: true
    });
}
function saveTimeInfo(){
    var year = $("#setYear").val();
    var month = $("#setMonth").val();
    var day = $("#setDay").val();
    var hour = $("#setHour").val();
    var minute = $("#setMinute").val();
    var second = $("#setSecond").val();
    var postdata, data = {};
    data.year = year;
    data.month = month;
    data.day = day;
    data.hour = hour;
    data.min = minute;
    data.sec = second;
    postdata = JSON.stringify(data);
    saveAjaxJsonData("/action/set_sys_time", postdata, function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            closeDialog();
            showResultDialog(common_result, common_success, 3000);
        } else {
            closeDialog();
            showResultDialog(common_result, common_failed, 3000);
        }
    }, {
        async: true
    });
}
function saveTimezoneInfo(){
    var timezone = $("#tz-select").val();
    var postdata, data = {};
    data.tzid = timezone;
    postdata = JSON.stringify(data);
    saveAjaxJsonData("/action/set_tz_info", postdata, function(obj){
        if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
            closeDialog();
            showResultDialog(common_result, common_success, 3000);
        } else {
            closeDialog();
            showResultDialog(common_result, common_failed, 3000);
        }
    }, {
        async: true
    });
}
function initSync(){
    $("#currenttime").text(g_CurrentLocalTime);
    if(g_sync_status == g_sync_status_syncsuccess){
        $("#sntpstatus").text(str_succeed_sync);
    }else if(g_sync_status == g_sync_status_syncing){
        $("#sntpstatus").text(str_syncing);
    }else if(g_sync_status == g_sync_status_syncfailure){
        if(g_error_num == g_sync_error_disabled){
            $("#sntpstatus").text(str_failed_sync+"("+str_error_disabled+")");
        }else if(g_error_num == g_sync_error_internal){
            $("#sntpstatus").text(str_failed_sync+"("+str_error_internal+")");
        }else if(g_error_num == g_sync_error_network){
            $("#sntpstatus").text(str_failed_sync+"("+str_error_network+")");
        }else if(g_error_num == g_sync_error_badaddr){
            $("#sntpstatus").text(str_failed_sync+"("+str_error_badaddr+")");
        }else if(g_error_num == g_sync_error_timeout){
            $("#sntpstatus").text(str_failed_sync+"("+str_error_timeout+")");
        }else if(g_error_num == g_sync_error_modify){
            $("#sntpstatus").text(str_failed_sync+"("+str_error_modify+")");
        }else{
            $("#sntpstatus").text(str_failed_sync);
        }
    }else if(g_sync_status == g_sync_status_unsync){
        if(g_error_num == g_sync_error_disabled){
            $("#sntpstatus").text(str_unsync+"("+str_error_disabled+")");
        }else if(g_error_num == g_sync_error_internal){
            $("#sntpstatus").text(str_unsync+"("+str_error_internal+")");
        }else if(g_error_num == g_sync_error_network){
            $("#sntpstatus").text(str_unsync+"("+str_error_network+")");
        }else if(g_error_num == g_sync_error_badaddr){
            $("#sntpstatus").text(str_unsync+"("+str_error_badaddr+")");
        }else if(g_error_num == g_sync_error_timeout){
            $("#sntpstatus").text(str_unsync+"("+str_error_timeout+")");
        }else if(g_error_num == g_sync_error_modify){
            $("#sntpstatus").text(str_unsync+"("+str_error_modify+")");
        }else{
            $("#sntpstatus").text(str_unsync);
        }
    }
    setTimeout(initSync,1000);
}
function initModePage(){
    document.title = str_sntp;
    GetSntpInfo();
    initData();
    initSync();
    $(".introduce h1").text(str_sntp_sntp);
    $(".introduce p").text(str_sntp_des);
    $("#apply").attr("value", common_apply).on("click",function(){
        saveSntpInfo();
    });

    $("#change-ct").on("click",function(){
        startLogoutTimer();
        showSetTimeDialog(saveTimeInfo);
    });
    $("#change-tz").on("click",function(){
        startLogoutTimer();
        showTimezoneDialog(saveTimezoneInfo);
    });
    $("#HourFormat").on("change",function(){
        var postdata, data = {};
        var timeFormat = $("#HourFormat").val();
        data.format = timeFormat;
        postdata = JSON.stringify(data);
        saveAjaxJsonData("/action/set_time_fmt", postdata, function(obj){
            if (typeof obj.retcode === "number" && obj.retcode === g_resultSuccess){
                showResultDialog(common_result, common_success, 3000);
            } else {
                showResultDialog(common_result, common_failed, 3000);
            }
        }, {
            async: true
        });
    });
    var i, len, html_timezone = "";
    for(i = 0,len = timezoneTbale.length;i<len;i++){
        var option = "<option value = '"+ i +"'>"+timezoneTbale[i][1]+"</option>";
        html_timezone += option;
    }
    var $enablenetwofk = $("#enable-networktime");
    $enablenetwofk.on("change",function(){
        if($enablenetwofk.is(":checked")){
            $("#autosync").show();
            $("#enable-networktime").attr("value",1);
        }else{
            $("#autosync").hide();
            $("#enable-networktime").attr("value",0);
        }
    });

    for(var i=1;i<=5;i++){
        var selectid = "#timeserver" + i;
        var inputid = "#server_other" + i;
        hideInput(selectid, inputid);
    }
}
function hideInput(selectid, inputid){
    $(selectid).on("change",function(){
        var currentVal = $(selectid).val();
        $(inputid).val(currentVal);
    })
}
