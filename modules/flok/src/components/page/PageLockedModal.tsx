import {Dialog, makeStyles, SvgIconTypeMap} from "@material-ui/core"
import {OverridableComponent} from "@material-ui/core/OverridableComponent"
import {FlokTheme} from "../../theme"
import UnderConstructionView from "./UnderConstructionView"

function PageLockedModal(props: {
  pageDesc?: string
  header?: string
  headerIcon?: OverridableComponent<SvgIconTypeMap<{}, "svg">>
  noBackdrop?: boolean
}) {
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
      hideBackdrop={props.noBackdrop}
      classes={
        !props.noBackdrop
          ? {
              root: classes.MuiBackdrop,
            }
          : {}
      }>
      <UnderConstructionView {...props} />
    </Dialog>
  )
}
export default PageLockedModal
