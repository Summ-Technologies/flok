import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {Constants} from "../config"
import {RetreatToTask} from "../models/retreat"
import {RootState} from "../store"
import {getRetreatAttendees, getRetreatByGuid} from "../store/actions/retreat"

export function useRetreatAttendees(retreatId: number) {
  let dispatch = useDispatch()
  let attendeesList = useSelector(
    (state: RootState) => state.retreat.retreatAttendees[retreatId]
  )
  let attendeesObject = useSelector((state: RootState) => {
    return state.retreat.attendees
  })
  let attendees = attendeesList?.map((id) => attendeesObject[id])
  let [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadAttendees() {
      setLoading(true)
      dispatch(getRetreatAttendees(retreatId))
      setLoading(false)
    }
    if (!attendees) {
      loadAttendees()
    }
  }, [attendees, dispatch, retreatId])
  return [attendees, loading] as const
}

/**
 * Deprecated
 * @param retreatGuid
 * @returns
 */
export function useRetreatByGuid(retreatGuid: string) {
  let dispatch = useDispatch()
  let [loading, setLoading] = useState(false)
  let retreat = useSelector(
    (state: RootState) => state.retreat.retreatsByGuid[retreatGuid]
  )
  useEffect(() => {
    async function loadRetreat() {
      setLoading(true)
      dispatch(getRetreatByGuid(retreatGuid))
      setLoading(false)
    }
    if (!retreat) {
      loadRetreat()
    }
  }, [retreat, dispatch, retreatGuid])
  return [retreat, loading] as const
}

export function parseRetreatTask(task: RetreatToTask, baseUrl: string) {
  let parsedTask = {...task}
  if (task.link) {
    parsedTask.link = task.link.replaceAll(Constants.retreatBaseUrlVar, baseUrl)
  }
  if (task.description) {
    parsedTask.description = task.description.replaceAll(
      Constants.retreatBaseUrlVar,
      baseUrl
    )
  }
  return parsedTask
}
