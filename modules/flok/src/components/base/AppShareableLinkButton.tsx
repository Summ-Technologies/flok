import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  Typography,
  useMediaQuery,
} from "@material-ui/core"
import {Check, Link, Share} from "@material-ui/icons"
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
type AppShareableLinkButtonProps = {
  link: string
}
function AppShareableLinkButton(props: AppShareableLinkButtonProps) {
  let classes = useStyles()
  let [copied, setCopied] = useState(false)
  const isSmallScreen = useMediaQuery((theme: FlokTheme) =>
    theme.breakpoints.down("sm")
  )
  let [shareModalOpen, setShareModalOpen] = useState(false)

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setShareModalOpen(true)}>
        <Share fontSize="small" />
        <Typography> Share</Typography>
      </Button>
      <Dialog open={shareModalOpen}>
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
            color="primary"
            size="small"
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
