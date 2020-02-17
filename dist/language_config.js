"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.translation_unavailable = exports.languages = exports.dialects = void 0;

/**
 * Map of dialects to speechSynthesis-recognised strings
 * Map of languages to Yandex-recognised country codes
 * Map of languages to native phrases indicating a translation for the article was unavailable
 */
var dialects = {
  'English': 'en-US',
  'Chinese': 'zh-CN',
  'Dutch': 'nl-NL',
  'French': 'fr-FR',
  'German': 'de-DE',
  'Italian': 'it-IT',
  'Japanese': 'ja-JP',
  'Korean': 'ko-KR',
  'Russian': 'ru-RU',
  'Spanish': 'es-ES'
};
exports.dialects = dialects;
var languages = {
  'English': 'en',
  'Chinese': 'zh',
  'Dutch': 'nl',
  'French': 'fr',
  'German': 'de',
  'Italian': 'it',
  'Japanese': 'ja',
  'Korean': 'ko',
  'Russian': 'ru',
  'Spanish': 'es'
};
exports.languages = languages;
var translation_unavailable = {
  'English': 'Translation unavailable',
  'Chinese': '翻譯不可用',
  'Dutch': 'Vertaling niet beschikbaar',
  'French': 'Traduction indisponible',
  'German': 'Übersetzung nicht verfügbar',
  'Italian': 'Traduzione non disponibile',
  'Japanese': '翻訳を使用できません',
  'Korean': '번역 불가',
  'Russian': 'Перевод недоступен',
  'Spanish': 'Traducción no disponible'
};
/**
 For reference only

 Arabic (Saudi Arabia) ➡️ ar-SA
 Chinese (China) ➡️ zh-CN
 Chinese (Hong Kong SAR China) ➡️ zh-HK
 Chinese (Taiwan) ➡️ zh-TW
 Czech (Czech Republic) ➡️ cs-CZ
 Danish (Denmark) ➡️ da-DK
 Dutch (Belgium) ➡️ nl-BE
 Dutch (Netherlands) ➡️ nl-NL
 English (Australia) ➡️ en-AU
 English (Ireland) ➡️ en-IE
 English (South Africa) ➡️ en-ZA
 English (United Kingdom) ➡️ en-GB
 English (United States) ➡️ en-US
 Finnish (Finland) ➡️ fi-FI
 French (Canada) ➡️ fr-CA
 French (France) ➡️ fr-FR
 German (Germany) ➡️ de-DE
 Greek (Greece) ➡️ el-GR
 Hindi (India) ➡️ hi-IN
 Hungarian (Hungary) ➡️ hu-HU
 Indonesian (Indonesia) ➡️ id-ID
 Italian (Italy) ➡️ it-IT
 Japanese (Japan) ➡️ ja-JP
 Korean (South Korea) ➡️ ko-KR
 Norwegian (Norway) ➡️ no-NO
 Polish (Poland) ➡️ pl-PL
 Portuguese (Brazil) ➡️ pt-BR
 Portuguese (Portugal) ➡️ pt-PT
 Romanian (Romania) ➡️ ro-RO
 Russian (Russia) ➡️ ru-RU
 Slovak (Slovakia) ➡️ sk-SK
 Spanish (Mexico) ➡️ es-MX
 Spanish (Spain) ➡️ es-ES
 Swedish (Sweden) ➡️ sv-SE
 Thai (Thailand) ➡️ th-TH
 Turkish (Turkey) ➡️ tr-TR
 */

exports.translation_unavailable = translation_unavailable;