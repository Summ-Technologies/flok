import {Dialog, makeStyles} from "@material-ui/core"
import {FlokTheme} from "../../theme"
import UnderConstructionView from "./UnderConstructionView"

function PageLockedModal(props: {pageDesc?: string; container?: HTMLElement}) {
  let useStyles = makeStyles((theme: FlokTheme) => ({
    MuiBackdrop: {
      backdropFilter: "blur(2px)",
      position: "absolute",
    },
  }))
  let classes = useStyles()

  return (
    <Dialog
      aria-labelledby="simple-dialog-title"
      open={true}
      disableBackdropClick={false}
      style={{zIndex: 1000, position: "absolute"}}
      container={props.container ?? document.body}
      BackdropProps={{style: {position: "absolute"}}}
      disablePortal
      classes={{
        root: classes.MuiBackdrop,
      }}>
      <UnderConstructionView pageDesc={props.pageDesc} />
    </Dialog>
  )
}
export default PageLockedModal
