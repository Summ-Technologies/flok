import {makeStyles} from "@material-ui/styles"
import {PropsWithChildren} from "react"
import {ResourceNotFound} from "../../models"
import RedirectPage from "../../pages/misc/RedirectPage"
import {useRetreat} from "../../utils/lodgingUtils"

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

type RetreatRequiredProps = PropsWithChildren<{retreatIdx: number}>

export default function RetreatRequired(props: RetreatRequiredProps) {
  let classes = useStyles(props)
  let retreat = useRetreat(props.retreatIdx)
  return retreat === ResourceNotFound ? (
    <RedirectPage pageName="SigninPage" />
  ) : (
    <>{props.children}</>
  )
}
