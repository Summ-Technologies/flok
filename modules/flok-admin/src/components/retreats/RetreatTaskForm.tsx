import {
  Box,
  Button,
  makeStyles,
  TextField,
  TextFieldProps,
} from "@material-ui/core"
import {useFormik} from "formik"
import _ from "lodash"
import {useDispatch} from "react-redux"
import {RetreatToTask, RetreatToTaskStateOptions} from "../../models"
import {patchRetreatTask} from "../../store/actions/admin"
import AppTypography from "../base/AppTypography"

let useItemStyles = makeStyles((theme) => ({
  root: {
    disply: "flex",
    flexDirection: "column",
    "& > *:not(:first-child)": {
      marginTop: theme.spacing(1),
    },
  },
  formSection: {
    disply: "flex",
    flexDirection: "column",
    marginTop: -theme.spacing(1),
    "& > *": {
      marginTop: theme.spacing(1),
    },
  },
  basicInfoRow: {
    display: "flex",
    width: "100%",
    marginLeft: theme.spacing(-1),
    "& > *": {
      marginLeft: theme.spacing(1),
    },
  },
  template: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    width: "100%",
    "& > *:not(:first-child)": {
      marginTop: theme.spacing(1),
    },
  },
  summary: {
    display: "flex",
    alignItems: "center",
    alignContent: "center",
  },
  title: {
    lineHeight: "1em",
    textDecoration: "strikethrough",
  },
  desc: {
    paddingLeft: 42,
    paddingBottom: 12,
    "& > *": {
      marginBottom: theme.spacing(2),
    },
  },
  iconExpanded: {
    transform: "rotateZ(180deg)",
  },
  dueDate: {
    display: "flex",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "space-between",
    width: "30%",
    maxWidth: 200,
    marginBottom: 12,
  },
  submitButton: {
    display: "block",
    marginTop: theme.spacing(0.5),
  },
  subtitle: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  taskVarInput: {
    [theme.breakpoints.up("md")]: {
      width: `calc(50% - ${theme.spacing(1)}px)`,
      marginLeft: theme.spacing(0.5),
      marginRight: theme.spacing(0.5),
    },
  },
}))

export default function RetreatTaskForm(props: {
  retreatId: number
  retreatToTask: RetreatToTask
}) {
  let classes = useItemStyles(props)

  let {retreatId, retreatToTask} = props
  let dispatch = useDispatch()
  let formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      state: retreatToTask.state,
      due_date: retreatToTask.due_date ?? "",
      task_vars: retreatToTask.task_vars ?? {},
    },
    onSubmit: (values) => {
      dispatch(
        patchRetreatTask(
          retreatId,
          retreatToTask.task_id,
          values.state,
          values.due_date,
          values.task_vars
        )
      )
    },
  })
  let commonTextFieldProps: TextFieldProps = {
    fullWidth: true,
    onChange: formik.handleChange,
    InputLabelProps: {
      shrink: true,
    },
  }

  return (
    <form onSubmit={formik.handleSubmit} className={classes.root}>
      <div className={classes.formSection}>
        <AppTypography variant="h4">Task State</AppTypography>
        <div className={classes.basicInfoRow}>
          <TextField
            {...commonTextFieldProps}
            id="state"
            select
            SelectProps={{native: true}}
            label="State"
            value={formik.values.state}>
            {RetreatToTaskStateOptions.map((o, i) => (
              <option key={i} value={o} label={o} />
            ))}
          </TextField>
          <TextField
            {...commonTextFieldProps}
            id="due_date"
            type="date"
            value={formik.values.due_date ? formik.values.due_date : ""}
            label="Due Date"
          />
        </div>
      </div>
      <div className={classes.formSection}>
        <AppTypography variant="h4">Task Template</AppTypography>
        <div className={classes.template}>
          <AppTypography variant="body1" fontWeight="bold">
            Title
          </AppTypography>
          <AppTypography variant="body2">
            <HighLightTextByValues
              fullText={props.retreatToTask.task_template.title}
              highlights={Object.keys(props.retreatToTask.task_vars)}
            />
          </AppTypography>
        </div>
        <div className={classes.template}>
          <AppTypography variant="body1" fontWeight="bold">
            Link
          </AppTypography>
          <AppTypography variant="body2">
            {props.retreatToTask.task_template.link ? (
              <HighLightTextByValues
                fullText={props.retreatToTask.task_template.link}
                highlights={Object.keys(props.retreatToTask.task_vars)}
              />
            ) : (
              "No link"
            )}
          </AppTypography>
        </div>
        <div className={classes.template}>
          <AppTypography variant="body1" fontWeight="bold">
            Description
          </AppTypography>
          <AppTypography variant="body2">
            {props.retreatToTask.task_template.description ? (
              <HighLightTextByValues
                fullText={props.retreatToTask.task_template.description}
                highlights={Object.keys(props.retreatToTask.task_vars)}
              />
            ) : (
              "No description"
            )}
          </AppTypography>
        </div>
      </div>
      <div className={classes.formSection}>
        <AppTypography variant="h4">Task Variables</AppTypography>
        {Object.keys(formik.values.task_vars).length ? (
          Object.keys(formik.values.task_vars).map((varName) => {
            return (
              <TextField
                {...commonTextFieldProps}
                className={classes.taskVarInput}
                id={`task_vars[${varName}]`}
                label={varName}
                value={
                  formik.values.task_vars[varName]
                    ? formik.values.task_vars[varName]
                    : ""
                }
              />
            )
          })
        ) : (
          <Box paddingLeft={2}>
            <AppTypography variant="body1">No task vars</AppTypography>
          </Box>
        )}
      </div>

      <Button
        className={classes.submitButton}
        disabled={_.isEqual(formik.values, formik.initialValues)}
        type="submit"
        variant="contained"
        color="primary">
        Submit
      </Button>
    </form>
  )
}

let useHighlightStyles = makeStyles((theme) => ({
  highlight: {
    backgroundColor: theme.palette.warning.main,
  },
}))
function HighLightTextByValues(props: {
  fullText: string
  highlights: string[]
}) {
  let classes = useHighlightStyles()
  let highlighted = props.fullText
  let highlights = `(${props.highlights.join("|")})`
  let regex = RegExp(`({{([^}]*${highlights}[^}]*)}})`, "gi")
  let matches = props.fullText.match(regex)
  if (matches) {
    matches.forEach((val) => {
      highlighted = highlighted.replaceAll(
        val,
        `<span class="${classes.highlight}">${val}</span>`
      )
    })
  }
  return <span dangerouslySetInnerHTML={{__html: highlighted}}></span>
}
