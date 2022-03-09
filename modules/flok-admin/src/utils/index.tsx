import {TextFieldProps} from "@material-ui/core"
import {push} from "connected-react-router"
import _ from "lodash"
import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {useLocation} from "react-router-dom"
import {RootState} from "../store"
import {
  getDestinations,
  getRetreatAttendees,
  getRetreatDetails,
} from "../store/actions/admin"

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

/**Takes object and maps all empty string values ("") to null. Used in forms because TextField can't take null or undefined as a value */
export function nullifyEmptyString<T extends {[key: string]: any}>(
  obj: T
): Partial<T> {
  return _.mapValues(obj, (val) =>
    val === "" || val == null ? null : val
  ) as Partial<T>
}

/**
 * Get destinations database
 *
 * @returns destinations, isLoading
 */
export function useDestinations() {
  let dispatch = useDispatch()
  let allDestinations = useSelector(
    (state: RootState) => state.admin.allDestinations
  )
  let destinations = useSelector((state: RootState) => state.admin.destinations)
  let [loading, setLoading] = useState(false)
  useEffect(() => {
    async function loadDestinations() {
      setLoading(true)
      await dispatch(getDestinations())
      setLoading(false)
    }
    if (!allDestinations) {
      loadDestinations()
    }
  }, [allDestinations, dispatch])

  return [destinations, loading] as const
}

/**
 * Get retreat details
 */
export function useRetreat(retreatId: number) {
  let dispatch = useDispatch()
  let [loading, setLoading] = useState(false)
  let retreat = useSelector((state: RootState) => {
    return state.admin.retreatsDetails[retreatId]
  })
  useEffect(() => {
    async function loadRetreatDetails() {
      setLoading(true)
      await dispatch(getRetreatDetails(retreatId))
      setLoading(false)
    }
    if (retreat === undefined) {
      loadRetreatDetails()
    }
  }, [retreatId, dispatch, setLoading, retreat])
  return [retreat, loading] as const
}

export function useRetreatAttendees(retreatId: number) {
  let dispatch = useDispatch()
  let [loading, setLoading] = useState(false)
  let retreatAttendees = useSelector((state: RootState) => {
    return state.admin.attendeesByRetreat[retreatId]
  })
  useEffect(() => {
    async function loadRetreatAttendees() {
      setLoading(true)
      await dispatch(getRetreatAttendees(retreatId))
      setLoading(false)
    }
    if (retreatAttendees === undefined) {
      loadRetreatAttendees()
    }
  }, [retreatId, dispatch, setLoading, retreatAttendees])
  return [retreatAttendees, loading] as const
}

export function getTextFieldErrorProps(
  formik: any,
  field: string
): TextFieldProps {
  let isError = formik.errors && !!formik.errors[field]
  return {
    error: isError,
    helperText: isError && formik.errors && formik.errors[field],
  }
}
