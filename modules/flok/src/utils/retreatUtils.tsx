import {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {Constants} from "../config"
import {ResourceNotFoundType} from "../models"
import {
  RetreatAttendeeModel,
  RetreatModel,
  RetreatToTask,
} from "../models/retreat"
import {RootState} from "../store"
import {getRetreat, getRetreatAttendees} from "../store/actions/retreat"

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
  useEffect(() => {
    if (!attendees) {
      dispatch(getRetreatAttendees(retreatId))
    }
  }, [attendees, dispatch, retreatId])
  return attendees as RetreatAttendeeModel[] | ResourceNotFoundType | undefined
}

/**
 * Deprecated
 * @param retreatGuid
 * @returns
 */
// export function useRetreatByGuid(retreatGuid: string) {
//   let dispatch = useDispatch()
//   let retreat = useSelector(
//     (state: RootState) => state.retreat.retreatsByGuid[retreatGuid]
//   )
//   useEffect(() => {
//     if (!retreat) {
//       dispatch(getRetreatByGuid(retreatGuid))
//     }
//   }, [retreat, dispatch, retreatGuid])
//   return retreat as RetreatModel | ResourceNotFoundType | undefined
// }

export function parseRetreatTask(task: RetreatToTask, baseUrl: string) {
  let parsedTask = {...task}
  if (task.link) {
    parsedTask.link = task.link.replaceAll(Constants.retreatBaseUrlVar, baseUrl)
  }
  return parsedTask
}
