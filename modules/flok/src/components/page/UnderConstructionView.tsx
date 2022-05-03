import {Icon, makeStyles, SvgIconTypeMap} from "@material-ui/core"
import {OverridableComponent} from "@material-ui/core/OverridableComponent"
import {LockRounded} from "@material-ui/icons"
import AppTypography from "../base/AppTypography"

type UnderConstructionViewProps = {
  pageDesc?: string
  header?: string
  headerIcon?: OverridableComponent<SvgIconTypeMap<{}, "svg">>
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
    borderRadius: 5,
    boxShadow: "0 3px 7px rgba(0, 0, 0, 0.3)",
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
  const HeaderIcon = props.headerIcon ?? LockRounded
  return (
    <div className={classes.body}>
      <div className={classes.modal}>
        <div className={classes.header}>
          <Icon fontSize="large">
            <HeaderIcon fontSize="large" style={{verticalAlign: "top"}} />
          </Icon>
          <AppTypography variant="h1" uppercase>
            &nbsp;{props.header ?? "Coming Soon"}&nbsp;
          </AppTypography>
          <Icon fontSize="large">
            <HeaderIcon fontSize="large" style={{verticalAlign: "top"}} />
          </Icon>
        </div>
        <div className={classes.modalBody}>
          {!props.pageDesc && (
            <AppTypography>
              We are currently working to create new services to help improve
              your planning experience.
            </AppTypography>
          )}
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
