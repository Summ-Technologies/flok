import {push} from "connected-react-router"
import {useEffect, useState} from "react"
import {useDispatch} from "react-redux"
import {useLocation} from "react-router-dom"

/**
 * returns datestring like:
 *  mm/dd/yy, hh:mm [AM/PM]
 */
export function getDateTimeString(datetime: Date): string {
  let formatter = Intl.DateTimeFormat("en-US", {
    dateStyle: "short",
    timeStyle: "short",
    second: undefined,
  })
  return formatter.format(datetime)
}

/**
 *
 * @param isoDatetime, ISO formatted datetime string
 * @returns Date object
 */
export function getDateFromString(isoDatetime: string): Date {
  return new Date(isoDatetime)
}

export function useQuery(param: string) {
  let dispatch = useDispatch()
  let searchString = useLocation().search.substring(1)
  let [paramVal, setParamVal] = useState<string | null>(
    new URLSearchParams(searchString).get(param)
  )
  useEffect(() => {
    setParamVal(new URLSearchParams(searchString).get(param))
  }, [searchString, setParamVal, param])

  /* If null is given for newParamVal, delete the param */
  function setParam(newParamVal: string | null) {
    let allParams = new URLSearchParams(searchString)
    if (newParamVal == null) {
      allParams.delete(param)
    } else {
      allParams.set(param, newParamVal)
    }
    dispatch(
      push({
        search: `${allParams.toString() ? "?" + allParams.toString() : ""}`,
      })
    )
  }
  return [paramVal, setParam] as const
}
