export default class Util {
  /**
   * Init class
   *
   * @author Nhat Bui
   */
  static init() {
    return this;
  }

  /**
   * Checks if the data is empty
   *
   * @author Nhat Bui
   */
  static isEmpty(value) {
    const isEmp =
      value === undefined ||
      value === null ||
      (typeof value === 'object' && Object.keys(value).length === 0) ||
      (typeof value === 'string' && value.trim().length === 0);
    if (isEmp) {
      return true;
    } else {
      return false;
    }
  }
}
