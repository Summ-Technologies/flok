import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {RootState} from "../store"
import {getRetreatAttendees, getRetreatByGuid} from "../store/actions/retreat"

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
