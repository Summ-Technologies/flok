import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  Typography,
} from "@material-ui/core"
import {Check, Link, Share} from "@material-ui/icons"
import {useState} from "react"

let useStyles = makeStyles((theme) => ({
  dialogWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  linkText: {
    backgroundColor: theme.palette.grey[300],
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    flex: 1,
  },
  copyButton: {
    marginLeft: theme.spacing(0.5),
    minWidth: "max-content",
  },
}))
type AppShareableLinkButtonProps = {
  link: string
}
function AppShareableLinkButton(props: AppShareableLinkButtonProps) {
  let classes = useStyles()
  let [copied, setCopied] = useState(false)
  let [shareModalOpen, setShareModalOpen] = useState(false)
  let [buttonTimeout, setButtonTimeout] = useState<NodeJS.Timeout | undefined>(
    undefined
  )

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setShareModalOpen(true)}>
        <Share fontSize="small" />
        <Typography>&nbsp;Share</Typography>
      </Button>
      <Dialog
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        maxWidth={"xs"}
        fullWidth>
        <DialogTitle>
          <Link fontSize="large" /> Get Shareable Link
        </DialogTitle>
        <DialogContent>
          <div className={classes.dialogWrapper}>
            <div className={classes.linkText}>{props.link}</div>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              className={classes.copyButton}
              onClick={() => {
                navigator.clipboard.writeText(props.link)
                setCopied(true)
                if (buttonTimeout) {
                  clearTimeout(buttonTimeout)
                  setButtonTimeout(undefined)
                }
                setButtonTimeout(setTimeout(() => setCopied(false), 2000))
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
            color="primary"
            onClick={() => {
              setShareModalOpen(false)
              setCopied(false)
            }}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
export default AppShareableLinkButton
