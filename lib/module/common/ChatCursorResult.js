/**
 * The generic class which contains the cursor and pagination result.
 *
 * The class instance is returned when you make a paginated query.
 */
export class ChatCursorResult {
  /**
   * The cursor that specifies where to start to get data.
   */

  /**
   * The request result.
   */

  constructor(params) {
    var _params$list;
    this.cursor = params.cursor;
    let data = [];
    (_params$list = params.list) === null || _params$list === void 0 ? void 0 : _params$list.forEach(value => {
      data.push(params.opt ? params.opt.map(value) : value);
    });
    this.list = data;
  }
}
//# sourceMappingURL=ChatCursorResult.js.map