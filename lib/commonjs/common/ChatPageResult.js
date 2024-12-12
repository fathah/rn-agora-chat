"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChatPageResult = void 0;
/**
 * The pagination class.
 *
 * This class contains the cursor for the next query and the number of records on the page.
 *
 * The class instance is returned when you make a paginated query.
 */
class ChatPageResult {
  /**
   * The number of records on the current page.
   *
   * If the value of `PageCount` is smaller than the number of records that you expect to get on each page, the current page is the last page.
   */

  /**
   * The data of the generic List<T> type.
   */

  constructor(params) {
    var _params$list;
    this.pageCount = params.pageCount;
    let data = [];
    (_params$list = params.list) === null || _params$list === void 0 ? void 0 : _params$list.forEach(value => {
      data.push(params.opt ? params.opt.map(value) : value);
    });
    this.list = data;
  }
}
exports.ChatPageResult = ChatPageResult;
//# sourceMappingURL=ChatPageResult.js.map