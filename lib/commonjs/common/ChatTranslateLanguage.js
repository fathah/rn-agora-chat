"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChatTranslateLanguage = void 0;
/**
 * The translation language class, which contains the information of the translation languages.
 */
class ChatTranslateLanguage {
  /**
   * The code of a target language. For example, the code for simplified Chinese is "zh-Hans".
   */

  /**
   * The language name. For example, the name for simplified Chinese is "Chinese Simplified".
   */

  /**
   * The native name of the language. For example, the native name of simplified Chinese is "Chinese (Simplified)".
   */

  constructor(params) {
    this.code = params.code;
    this.name = params.name;
    this.nativeName = params.nativeName;
  }
}
exports.ChatTranslateLanguage = ChatTranslateLanguage;
//# sourceMappingURL=ChatTranslateLanguage.js.map