import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  useMediaQuery,
} from "@material-ui/core"
import {Check, Link} from "@material-ui/icons"
import {useState} from "react"
import {FlokTheme} from "../../theme"

let useStyles = makeStyles((theme) => ({
  dialogWrapper: {
    display: "flex",
    alignItems: "center",
    margin: 8,
  },
  linkText: {
    backgroundColor: theme.palette.background.default,
    padding: 3,
    borderRadius: 4,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "90%",
    maxWidth: 260,
  },
  copyButton: {
    marginLeft: theme.spacing(0.25),
  },
}))
type AppShareableLinkModalProps = {
  open: boolean
  link: string
  handleClose: () => void
}
function AppShareableLinkModal(props: AppShareableLinkModalProps) {
  let classes = useStyles()
  let [copied, setCopied] = useState(false)
  const isSmallScreen = useMediaQuery((theme: FlokTheme) =>
    theme.breakpoints.down("sm")
  )

  return (
    <Dialog open={props.open}>
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
            }}>
            {isSmallScreen ? (
              copied ? (
                "Copied"
              ) : (
                "Copy"
              )
            ) : copied ? (
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
