/**
 * The translation language class, which contains the information of the translation languages.
 */
export class ChatTranslateLanguage {
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
//# sourceMappingURL=ChatTranslateLanguage.js.map