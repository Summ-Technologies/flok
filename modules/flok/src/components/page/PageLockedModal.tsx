import {Dialog, makeStyles} from "@material-ui/core"
import {FlokTheme} from "../../theme"
import UnderConstructionView from "./UnderConstructionView"

function PageLockedModal(props: {pageDesc?: string}) {
  let useStyles = makeStyles((theme: FlokTheme) => ({
    MuiBackdrop: {
      backdropFilter: "blur(2px)",
    },
  }))
  let classes = useStyles()

  return (
    <Dialog
      aria-labelledby="simple-dialog-title"
      open={true}
      disableBackdropClick={false}
      style={{zIndex: 1000}}
      classes={{
        root: classes.MuiBackdrop,
      }}>
      <UnderConstructionView pageDesc={props.pageDesc} />
    </Dialog>
  )
}
export default PageLockedModal
