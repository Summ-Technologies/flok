import {
  Button,
  makeStyles,
  TextField,
  TextFieldProps,
  Typography,
} from "@material-ui/core"
import {useFormik} from "formik"
import _ from "lodash"
import {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import * as yup from "yup"
import {
  OrderedRetreatAttendeesState,
  OrderedRetreatFlightsState,
  OrderedRetreatIntakeState,
  OrderedRetreatItineraryState,
  OrderedRetreatLodgingState,
} from "../../models"
import {RootState} from "../../store"
import {getTask, patchTask} from "../../store/actions/admin"
import {getTextFieldErrorProps} from "../../utils"

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
  dropDown: {
    minWidth: "140px",
    marginBottom: theme.spacing(1.25),
    marginRight: theme.spacing(1.25),
  },
  stateFields: {
    display: "flex",
    width: "100%",
  },
}))

type TaskTableProps = {taskId: number}

function TaskForm(props: TaskTableProps) {
  let dispatch = useDispatch()
  let {taskId} = props
  let task = useSelector((state: RootState) => {
    return state.admin.tasks[taskId]
  })
  useEffect(() => {
    !task && dispatch(getTask(taskId))
  }, [dispatch, taskId, task])
  let classes = useStyles(props)

  let formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      link: task?.link ?? "",
      is_flok_task: task?.is_flok_task ?? false,
      state_updates: {
        intake_state: task?.state_updates?.intake_state,
        lodging_state: task?.state_updates?.lodging_state,
        attendees_state: task?.state_updates?.attendees_state,
        flights_state: task?.state_updates?.flights_state,
        itinerary_state: task?.state_updates?.itinerary_state,
      },
    },
    validationSchema: yup.object({
      title: yup.string(),
      description: yup.string(),
      link: yup.string(),
    }),
    onSubmit: (values) => {
      task && dispatch(patchTask(task.id.toString(), values))
    },
  })
  const commonTextFieldProps: TextFieldProps = {
    onChange: formik.handleChange,
    InputLabelProps: {shrink: true},
    fullWidth: true,
    className: classes.textField,
  }

  return (
    <>
      <form className={classes.root} onSubmit={formik.handleSubmit}>
        <Typography className={classes.header} variant="h4">
          Task Details
        </Typography>
        <TextField
          {...commonTextFieldProps}
          id="title"
          {...getTextFieldErrorProps(formik, "title")}
          value={formik.values.title}
          label="Title"
        />

        <TextField
          {...commonTextFieldProps}
          {...getTextFieldErrorProps(formik, "link")}
          id="link"
          value={formik.values.link}
          label="Link"
        />
        <TextField
          className={classes.dropDown}
          id="is_flok_task"
          label="Is Flok Task?"
          select
          SelectProps={{native: true}}
          onChange={(e) => {
            formik.setFieldValue("is_flok_task", e.target.value === "true")
          }}
          value={formik.values.is_flok_task ? "true" : "false"}>
          <option value={"true"}>True</option>
          <option value={"false"}>False</option>
        </TextField>

        <TextField
          {...commonTextFieldProps}
          {...getTextFieldErrorProps(formik, "description")}
          id="description"
          multiline
          minRows={3}
          value={formik.values.description}
          label="Description"
        />
        <Typography className={classes.header} variant="h4">
          Retreat Updates upon Completion
        </Typography>
        <div className={classes.stateFields}>
          <TextField
            className={classes.dropDown}
            id="state_updates.intake_state"
            label="Intake State"
            select
            SelectProps={{native: true}}
            onChange={(e) =>
              formik.setFieldValue(
                "state_updates.intake_state",
                e.target.value === "NO_UPDATE" ? undefined : e.target.value
              )
            }
            value={formik.values.state_updates.intake_state ?? "NO_UPDATE"}>
            <option value={"NO_UPDATE"}>NO_UPDATE</option>
            {OrderedRetreatIntakeState.map((v) => (
              <option value={v}>{v}</option>
            ))}
          </TextField>
          <TextField
            className={classes.dropDown}
            id="state_updates.lodging_state"
            label="Lodging State"
            select
            SelectProps={{native: true}}
            onChange={(e) =>
              formik.setFieldValue(
                "state_updates.lodging_state",
                e.target.value === "NO_UPDATE" ? undefined : e.target.value
              )
            }
            value={formik.values.state_updates.lodging_state ?? "NO_UPDATE"}>
            <option value={"NO_UPDATE"}>NO_UPDATE</option>
            {OrderedRetreatLodgingState.map((v) => (
              <option value={v}>{v}</option>
            ))}
          </TextField>
          <TextField
            className={classes.dropDown}
            id="state_updates.attendees_state"
            label="Attendees State"
            select
            SelectProps={{native: true}}
            onChange={(e) =>
              formik.setFieldValue(
                "state_updates.attendees_state",
                e.target.value === "NO_UPDATE" ? undefined : e.target.value
              )
            }
            value={formik.values.state_updates.attendees_state ?? "NO_UPDATE"}>
            <option value={"NO_UPDATE"}>NO_UPDATE</option>
            {OrderedRetreatAttendeesState.map((v) => (
              <option value={v}>{v}</option>
            ))}
          </TextField>
          <TextField
            className={classes.dropDown}
            id="state_updates.flights_state"
            label="Flights State"
            select
            SelectProps={{native: true}}
            onChange={(e) =>
              formik.setFieldValue(
                "state_updates.flights_state",
                e.target.value === "NO_UPDATE" ? undefined : e.target.value
              )
            }
            value={formik.values.state_updates.flights_state ?? "NO_UPDATE"}>
            <option value={"NO_UPDATE"}>NO_UPDATE</option>
            {OrderedRetreatFlightsState.map((v) => (
              <option value={v}>{v}</option>
            ))}
          </TextField>
          <TextField
            className={classes.dropDown}
            id="state_updates.itinerary_state"
            label="Itinerary State"
            select
            SelectProps={{native: true}}
            onChange={(e) =>
              formik.setFieldValue(
                "state_updates.itinerary_state",
                e.target.value === "NO_UPDATE" ? undefined : e.target.value
              )
            }
            value={formik.values.state_updates.itinerary_state ?? "NO_UPDATE"}>
            <option value={"NO_UPDATE"}>NO_UPDATE</option>
            {OrderedRetreatItineraryState.map((v) => (
              <option value={v}>{v}</option>
            ))}
          </TextField>
        </div>
        <div className={classes.footer}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={
              _.isEqual(formik.initialValues, formik.values) || !formik.isValid
            }>
            Save State
          </Button>
        </div>
      </form>
    </>
  )
}
export default TaskForm
