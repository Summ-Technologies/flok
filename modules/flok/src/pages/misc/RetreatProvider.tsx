import {push} from "connected-react-router"
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps} from "react-router-dom"
import {ResourceNotFound} from "../../models"
import {RetreatModel} from "../../models/retreat"
import {AppRoutes} from "../../Stack"
import {RootState} from "../../store"
import {getRetreat} from "../../store/actions/retreat"
import LoadingPage from "./LoadingPage"

const RetreatContext = createContext<RetreatModel | undefined>(undefined)

export function useRetreat() {
  const retreat = useContext(RetreatContext)
  if (retreat === undefined) {
    throw Error("useRetreat must be used within a RetreatProvider")
  }
  return retreat
}

type RetreatProviderProps = PropsWithChildren<
  RouteComponentProps<{
    retreatIdx: string
  }>
>
export default function RetreatProvider(props: RetreatProviderProps) {
  let dispatch = useDispatch()
  let user = useSelector((state: RootState) => state.user.user)
  if (!user) {
    throw Error("retreat provider needs to be in a ProtectedRoute")
  }
  let retreatIdx = parseInt(props.match.params.retreatIdx)
  let [retreatId, setRetreatId] = useState(
    !isNaN(retreatIdx) && retreatIdx >= 0
      ? user.retreat_ids[retreatIdx]
      : undefined
  )

  useEffect(() => {
    setRetreatId(
      !isNaN(retreatIdx) && retreatIdx >= 0
        ? user!.retreat_ids[retreatIdx]
        : undefined
    )
  }, [retreatIdx, user])

  let retreat = useSelector((state: RootState) => {
    if (retreatId != null) {
      return state.retreat.retreats[retreatId]
    }
  })

  useEffect(() => {
    if (retreatIdx !== 0 && retreatId === undefined) {
      dispatch(push(AppRoutes.getPath("RetreatHomePage", {retreatIdx: "0"})))
    } else if (retreat === undefined) {
      dispatch(getRetreat(retreatId!))
    }
  }, [retreatIdx, dispatch, retreat, retreatId])

  return retreatId === undefined ? (
    <div>No retreats for the user</div>
  ) : retreat === ResourceNotFound ? (
    <div>Retreat not found</div>
  ) : retreat === undefined ? (
    <LoadingPage />
  ) : (
    <RetreatContext.Provider value={retreat}>
      {props.children}
    </RetreatContext.Provider>
  )
}
