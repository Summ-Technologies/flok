import {makeStyles, Typography} from "@material-ui/core"
import {PropsWithChildren, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {RootState} from "../../store"
import {getRetreat} from "../../store/actions/retreat"
import PageContainer from "../page/PageContainer"

let useStyles = makeStyles((theme) => ({
  body: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "baseline",
  },
}))

type RetreatRequiredProps = PropsWithChildren<{retreatGuid: string}>

export default function RetreatRequired(props: RetreatRequiredProps) {
  let classes = useStyles(props)
  let dispatch = useDispatch()
  let retreat = useSelector(
    (state: RootState) => state.retreat.retreats[props.retreatGuid]
  )
  useEffect(() => {
    if (!retreat) {
      dispatch(getRetreat(props.retreatGuid))
    }
  }, [retreat, dispatch, props.retreatGuid])
  return retreat === "NOT_FOUND" ? (
    <PageContainer>
      <div className={classes.body}>
        <Typography variant="h1">Oops, we can't find your retreat.</Typography>
        <Typography variant="body1">
          If this was a mistake, please reach out to us via{" "}
          <a href="mailto:support@goflok.com">support@goflok.com</a>
        </Typography>
      </div>
    </PageContainer>
  ) : (
    <>{props.children}</>
  )
}
