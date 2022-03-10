import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {ResourceNotFoundType} from "../models"
import {RetreatAttendeeModel, RetreatModel} from "../models/retreat"
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
