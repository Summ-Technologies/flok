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

// Hook
export type ScriptLoadingState = "loading" | "idle" | "ready" | "error"
export function useScript(src: string): [boolean, ScriptLoadingState] {
  // Keep track of script status ("idle", "loading", "ready", "error")
  const [status, setStatus] = useState<ScriptLoadingState>(
    src ? "loading" : "idle"
  )
  const [ready, setReady] = useState(false)

  useEffect(
    () => {
      // Allow falsy src value if waiting on other data needed for
      // constructing the script URL passed to this hook.
      if (!src) {
        setStatus("idle")
        return
      }

      // Fetch existing script element by src
      // It may have been added by another intance of this hook
      let script = document.querySelector<HTMLScriptElement>(
        `script[src="${src}"]`
      )

      if (!script) {
        // Create script
        script = document.createElement("script")
        script.src = src
        script.async = true
        script.setAttribute("data-status", "loading")
        // Add script to document body
        document.body.appendChild(script)

        // Store status in attribute on script
        // This can be read by other instances of this hook
        const setAttributeFromEvent = (event: Event) => {
          if (script) {
            script.setAttribute(
              "data-status",
              event.type === "load" ? "ready" : "error"
            )
          }
        }

        script.addEventListener("load", setAttributeFromEvent)
        script.addEventListener("error", setAttributeFromEvent)
      } else {
        // Grab existing script status from attribute and set to state.
        let _status = script.getAttribute("data-status") as ScriptLoadingState
        if (_status) {
          setStatus(_status)
        }
      }

      // Script event handler to update status in state
      // Note: Even if the script already exists we still need to add
      // event handlers to update the state for *this* hook instance.
      const setStateFromEvent = (event: Event) => {
        setStatus(event.type === "load" ? "ready" : "error")
      }

      // Add event listeners
      script.addEventListener("load", setStateFromEvent)
      script.addEventListener("error", setStateFromEvent)

      // Remove event listeners on cleanup
      return () => {
        if (script) {
          script.removeEventListener("load", setStateFromEvent)
          script.removeEventListener("error", setStateFromEvent)
        }
      }
    },
    [src] // Only re-run effect if script src changes
  )

  useEffect(() => {
    if (status === "ready") {
      setReady(true)
    } else {
      setReady(false)
    }
  }, [status, setReady])

  return [ready, status]
}
