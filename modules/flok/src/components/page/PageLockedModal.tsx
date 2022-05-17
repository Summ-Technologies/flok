import {Dialog} from "@material-ui/core"
import UnderConstructionView from "./UnderConstructionView"

function PageLockedModal(props: {pageDesc?: string}) {
  return (
    <Dialog
      aria-labelledby="simple-dialog-title"
      open={true}
      disableBackdropClick={false}
      style={{zIndex: 1000}}>
      <UnderConstructionView pageDesc={props.pageDesc} />
    </Dialog>
  )
}
export default PageLockedModal
