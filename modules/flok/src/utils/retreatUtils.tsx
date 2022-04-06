import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {Constants} from "../config"
import {ResourceNotFoundType} from "../models"
import {RetreatModel, RetreatToTask} from "../models/retreat"
import {RootState} from "../store"
import {
  getRetreat,
  getRetreatAttendees,
  getRetreatByGuid,
} from "../store/actions/retreat"

export function useRetreat(retreatId: number) {
  let dispatch = useDispatch()
  let retreat = useSelector(
    (state: RootState) => state.retreat.retreats[retreatId]
  )
  useEffect(() => {
    if (!retreat) {
      dispatch(getRetreat(retreatId))
    }
  }, [retreat, dispatch, retreatId])
  return retreat as RetreatModel | ResourceNotFoundType | undefined
}
export function useRetreatAttendees(retreatId: number) {
  let dispatch = useDispatch()
  let attendees = useSelector(
    (state: RootState) => state.retreat.retreatAttendees[retreatId]
  )
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
  return parsedTask
}
