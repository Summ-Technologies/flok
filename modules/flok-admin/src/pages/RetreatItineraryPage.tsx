import {
  Breadcrumbs,
  Button,
  Link,
  makeStyles,
  TextField,
  TextFieldProps,
  Typography,
} from "@material-ui/core"
import {useFormik} from "formik"
import _ from "lodash"
import {useDispatch} from "react-redux"
import {
  Link as ReactRouterLink,
  RouteComponentProps,
  withRouter,
} from "react-router-dom"
import * as yup from "yup"
import AppTypography from "../components/base/AppTypography"
import PageBase from "../components/page/PageBase"
import RetreatStateTitle from "../components/retreats/RetreatStateTitle"
import {AppRoutes} from "../Stack"
import {patchRetreatDetails} from "../store/actions/admin"
import {getTextFieldErrorProps, useRetreat} from "../utils"

let useStyles = makeStyles((theme) => ({
  body: {
    flex: "1 1 auto",
    width: "100%",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
  },
  header: {
    width: "100%",
    marginBottom: theme.spacing(1),
  },
  footer: {
    paddingTop: theme.spacing(1),
  },

  root: {
    borderRadius: theme.shape.borderRadius,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    backgroundColor: theme.palette.common.white,
    display: "flex",
    flexWrap: "wrap",
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(10),
    marginRight: theme.spacing(10),
    "& > *:not(:first-child)": {
      marginTop: theme.spacing(1),
    },
  },
  textField: {
    marginBottom: theme.spacing(1.25),
  },
}))
type RetreatItineraryPageProps = RouteComponentProps<{
  retreatId: string
}>

function RetreatItineraryPage(props: RetreatItineraryPageProps) {
  let classes = useStyles(props)
  let dispatch = useDispatch()
  let retreatId = parseInt(props.match.params.retreatId) || -1 // -1 for an id that will always return 404

  // Get retreat data
  let [retreat] = useRetreat(retreatId)

  let formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      // itinerary_first_draft_link: retreat?.itinerary_first_draft_link ?? "",
      itinerary_final_draft_link: retreat?.itinerary_final_draft_link ?? "",
    },
    validationSchema: yup.object({
      // itinerary_first_draft_link: yup.string().url("Please enter a valid URL"),
      itinerary_final_draft_link: yup.string().url("Please enter a valid URL"),
    }),
    onSubmit: (values) => {
      retreat && dispatch(patchRetreatDetails(retreat.id, values))
    },
  })
  const commonTextFieldProps: TextFieldProps = {
    onChange: formik.handleChange,
    InputLabelProps: {shrink: true},
    fullWidth: true,
    className: classes.textField,
  }

  return (
    <PageBase>
      <div className={classes.body}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            color="inherit"
            to={AppRoutes.getPath("RetreatsPage")}
            component={ReactRouterLink}>
            All Retreats
          </Link>
          <Link
            color="inherit"
            to={AppRoutes.getPath("RetreatPage", {
              retreatId: retreatId.toString(),
            })}
            component={ReactRouterLink}>
            {retreat?.company_name}
          </Link>
          <AppTypography color="textPrimary">Itinerary</AppTypography>
        </Breadcrumbs>
        {retreat && <RetreatStateTitle retreat={retreat} type="itinerary" />}
        <form className={classes.root} onSubmit={formik.handleSubmit}>
          <Typography className={classes.header} variant="h4">
            Retreat Itinerary Link
          </Typography>
          {/* <TextField
            {...commonTextFieldProps}
            id="itinerary_first_draft_link"
            {...getTextFieldErrorProps(formik, "itinerary_first_draft_link")}
            value={formik.values.itinerary_first_draft_link}
            label="Itinerary first draft link"
          /> */}
          <TextField
            {...commonTextFieldProps}
            {...getTextFieldErrorProps(formik, "itinerary_final_draft_link")}
            id="itinerary_final_draft_link"
            value={formik.values.itinerary_final_draft_link}
            label="Itinerary document link"
          />

          <div className={classes.footer}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={
                _.isEqual(formik.initialValues, formik.values) ||
                !formik.isValid
              }>
              Save State
            </Button>
          </div>
        </form>
      </div>
    </PageBase>
  )
}
export default withRouter(RetreatItineraryPage)
