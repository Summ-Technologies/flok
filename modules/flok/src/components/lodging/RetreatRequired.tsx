import {Typography} from "@material-ui/core"
import {makeStyles} from "@material-ui/styles"
import {PropsWithChildren} from "react"
import {ResourceNotFound} from "../../models"
import {useRetreat} from "../../utils/lodgingUtils"
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
  let retreat = useRetreat(props.retreatGuid)
  return retreat === ResourceNotFound ? (
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
