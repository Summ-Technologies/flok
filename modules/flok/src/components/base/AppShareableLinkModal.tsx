import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core"
import {Check, Link} from "@material-ui/icons"
import {useState} from "react"
type AppShareableLinkModalProps = {
  open: boolean
  link: string
  handleClose: () => void
}
function AppShareableLinkModal(props: AppShareableLinkModalProps) {
  let [copied, setCopied] = useState(false)
  return (
    <Dialog open={props.open}>
      <DialogTitle>
        <Link fontSize="large" /> Get Shareable Link
      </DialogTitle>
      <DialogContent>
        <div style={{display: "flex", alignItems: "center", margin: 8}}>
          <div
            style={{
              backgroundColor: "#ECECEC",
              padding: 3,
              borderRadius: 8,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: "90%",
              maxWidth: 260,
            }}>
            {props.link}
          </div>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            style={{marginLeft: 2}}
            onClick={() => {
              navigator.clipboard.writeText(props.link)
              setCopied(true)
            }}>
            {copied ? (
              <>
                <Check fontSize="small" /> Copied
              </>
            ) : (
              "Copy Link"
            )}
          </Button>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => {
            props.handleClose()
            setCopied(false)
          }}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  )
}
export default AppShareableLinkModal
