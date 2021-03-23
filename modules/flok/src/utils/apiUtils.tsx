import {camelCase} from "lodash"

/*
 * All this util does is is turn objects to
 *  camelCase from snake_case objects.
 */
export function apiToModel(obj: any): any {
  function camelizeKeys(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((v) => camelizeKeys(v))
    } else if (obj !== null && obj.constructor === Object) {
      return Object.keys(obj).reduce(
        (result, key) => ({
          ...result,
          [camelCase(key)]: camelizeKeys(obj[key]),
        }),
        {}
      )
    }
    return obj
  }
  return camelizeKeys(obj)
}
