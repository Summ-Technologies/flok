import {Button, List, makeStyles, TextField} from "@material-ui/core"
import {push} from "connected-react-router"
import {useFormik} from "formik"
import _ from "lodash"
import {useState} from "react"
import {useDispatch} from "react-redux"
import * as yup from "yup"
import AppListItemStep from "../../components/base/AppListItemStep"
import AppLoadingScreen from "../../components/base/AppLoadingScreen"
import AppTypography from "../../components/base/AppTypography"
import AppConfirmationModal from "../../components/base/ConfirmationModal"
import PageBody from "../../components/page/PageBody"
import {AppRoutes} from "../../Stack"
import {ApiAction} from "../../store/actions/api"
import {patchRetreat} from "../../store/actions/retreat"
import {getTextFieldErrorProps} from "../../utils"
import {useRetreat} from "../misc/RetreatProvider"

let useStyles = makeStyles((theme) => ({
  section: {
    margin: theme.spacing(2),
    "& > *:not(:first-child)": {
      paddingLeft: theme.spacing(1),
    },
    "& > *": {
      marginBottom: theme.spacing(2),
    },
  },
  overviewHeader: {},
  list: {
    width: "85%",
    marginLeft: theme.spacing(2),
  },
  form: {
    display: "flex",
    alignItems: "center",
  },
  textField: {
    width: "60%",
    marginBottom: "auto",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  submissionButton: {
    marginLeft: theme.spacing(1),
  },
}))

function RetreatBudgetPage() {
  let [retreat, retreatIdx] = useRetreat()
  let dispatch = useDispatch()
  let classes = useStyles()
  const [loading, setLoading] = useState(false)
  let formik = useFormik({
    initialValues: {
      budget_link: retreat.budget_link ?? "",
    },
    onSubmit: async (values) => {
      setLoading(true)
      let response = (await dispatch(
        patchRetreat(retreat.id, values)
      )) as unknown as ApiAction
      setLoading(false)
      if (!response.error) {
        window.open(response.payload.retreat.budget_link, "_blank")
        dispatch(
          push(
            AppRoutes.getPath("RetreatHomePage", {
              retreatIdx: retreatIdx.toString(),
            })
          )
        )
      }
    },
    validationSchema: yup.object().shape({
      budget_link: yup.string().url("Enter a valid url"),
    }),
  })
  let [confirmationModalOpen, setConfirmationModalOpen] = useState(false)

  return (
    <PageBody appBar>
      <div className={classes.section}>
        <div className={classes.overviewHeader}>
          <AppTypography variant="h1">Budget</AppTypography>
        </div>
        <List className={classes.list}>
          <AppListItemStep
            title="Step 1: Prepare Baking Pans"
            subtext="Nobody wants their cake to stick to the pan, so it's important to prep your pans before pouring in the batter. With the exception of angel food and chiffon cakes, most recipes call for greasing and flouring the pan or lining the pan with waxed or parchment paper."
          />
          <AppListItemStep
            title="Step 2: Allow Ingredients to Reach Room Temperature"
            subtext="Many recipes require cake ingredients such as eggs and butter to stand at room temperature. This allows the butter to blend easily with other ingredients and the eggs will yield a higher cake volume."
          />
          <AppListItemStep
            title="Step 3: Preheat the Oven"
            subtext="When a cake bakes too quickly it can develop tunnels and cracks, too slowly and it can be coarse. Let your oven preheat for at least 10 minutes, and use an oven thermometer ($7, Target) to make sure it reaches the proper temperature. If you're using dark cake pans, you'll want to reduce the oven temperature called for in your recipe by 25°F.
            "
          />
          <AppListItemStep title="Step 4: Upload Budget Link" subtext="">
            <form
              className={classes.form}
              onSubmit={(e) => {
                e.preventDefault()
                setConfirmationModalOpen(true)
              }}>
              <TextField
                variant="outlined"
                label="Final Budget Link"
                fullWidth
                className={classes.textField}
                value={formik.values.budget_link}
                onChange={formik.handleChange}
                id="budget_link"
                {...getTextFieldErrorProps(formik, "budget_link")}
              />
              {loading && <AppLoadingScreen />}
              <Button
                className={classes.submissionButton}
                disabled={_.isEqual(formik.values, formik.initialValues)}
                variant="outlined"
                color="primary"
                type="submit">
                Submit
              </Button>
            </form>
          </AppListItemStep>
        </List>

        <AppConfirmationModal
          title="Confirm Submission"
          text={`Are you sure you wish to submit ${formik.values.budget_link} as your budget link?  This cannot be changed without Flok support.`}
          onClose={() => setConfirmationModalOpen(false)}
          onSubmit={() => {
            formik.handleSubmit()
            setConfirmationModalOpen(false)
          }}
          open={confirmationModalOpen}
        />
      </div>
    </PageBody>
  )
}
export default RetreatBudgetPage
