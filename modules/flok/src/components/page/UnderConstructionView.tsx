import {Icon, makeStyles} from "@material-ui/core"
import {LockRounded} from "@material-ui/icons"
import AppTypography from "../base/AppTypography"

type UnderConstructionViewProps = {
  pageDesc?: string
}

let useStyles = makeStyles((theme) => ({
  body: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "baseline",
    backgroundImage:
      'url("https://flok-b32d43c.s3.amazonaws.com/misc/flok-page-construction-background.svg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  modal: {
    backgroundColor: "#FFF",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    borderRadius: 5,
    "-webkit-box-shadow": "0 3px 7px rgba(0, 0, 0, 0.3)",
    "-moz-box-shadow": "0 3px 7px rgba(0, 0, 0, 0.3)",
    "box-shadow": "0 3px 7px rgba(0, 0, 0, 0.3)",
    "-webkit-background-clip": "padding-box",
    "-moz-background-clip": "padding-box",
    backgroundClip: "padding-box",
    maxWidth: "40vw",
    maxHeight: "40vh",
    minWidth: 300,
    minHeight: 300,
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    alignContent: "baseline",
    justifyContent: "center",
    padding: 24,
    textAlign: "center",
  },
  header: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: theme.spacing(1),
  },
  icon: {
    top: 0,
  },
  modalBody: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  emailInput: {},
}))

export default function UnderConstructionView(
  props: UnderConstructionViewProps
) {
  let classes = useStyles(props)
  return (
    <div className={classes.body}>
      <div className={classes.modal}>
        <div className={classes.header}>
          <Icon fontSize="large">
            <LockRounded fontSize="large" style={{verticalAlign: "top"}} />
          </Icon>
          <AppTypography variant="h1" uppercase>
            &nbsp;Coming Soon&nbsp;
          </AppTypography>
          <Icon fontSize="large">
            <LockRounded fontSize="large" style={{verticalAlign: "top"}} />
          </Icon>
        </div>
        <div className={classes.modalBody}>
          <AppTypography>
            We are currently working to create new services to help improve your
            planning experience.
          </AppTypography>
          {props.pageDesc && (
            <>
              <br />
              <AppTypography>{props.pageDesc}</AppTypography>
            </>
          )}
          <br />
          {/* <AppTypography>
            Enter your email below to subscribe to our mailing list:
          </AppTypography> */}
          {/* <div className={classes.emailInput}>
            <TextField label="Email Address" />
            <IconButton>
              <KeyboardArrowRight />
            </IconButton>
          </div> */}
        </div>
      </div>
    </div>
  )
}
