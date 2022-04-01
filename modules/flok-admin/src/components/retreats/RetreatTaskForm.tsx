import {Button, makeStyles, TextField} from "@material-ui/core"
import {useFormik} from "formik"
import _ from "lodash"
import ReactMarkdown from "react-markdown"
import {useDispatch} from "react-redux"
import {RetreatToTask, RetreatToTaskStateOptions} from "../../models"
import {patchRetreatTask} from "../../store/actions/admin"
import AppTypography from "../base/AppTypography"

let useItemStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: "12px",
    backgroundColor: theme.palette.background.paper,
    padding: 6,
    borderRadius: 5,
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
  input: {
    margin: theme.spacing(0.5),
  },
  submitButton: {
    display: "block",
    marginTop: theme.spacing(0.5),
  },
  subtitle: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}))

export default function RetreatTaskForm(props: {
  retreatId: number
  task: RetreatToTask
}) {
  let classes = useItemStyles(props)

  let {retreatId, task} = props
  let dispatch = useDispatch()
  let formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      state: task.state,
      dueDate: task.due_date ?? "",
      order: task.order,
      taskVars: task.task_vars,
    },
    onSubmit: (values) => {
      dispatch(
        patchRetreatTask(
          retreatId,
          task.task.id,
          values.order,
          values.state,
          new Date(values.dueDate),
          values.taskVars
        )
      )
    },
  })
  return (
    <form onSubmit={formik.handleSubmit}>
      <AppTypography variant="h4">Basic Task Info</AppTypography>
      <TextField
        id="state"
        select
        SelectProps={{native: true}}
        onChange={formik.handleChange}
        label="State"
        className={classes.input}
        value={formik.values.state}>
        {RetreatToTaskStateOptions.map((o, i) => (
          <option key={i} value={o} label={o} />
        ))}
      </TextField>
      <TextField
        className={classes.input}
        id="dueDate"
        type="date"
        value={formik.values.dueDate}
        label="Due Date"
        onChange={formik.handleChange}
      />
      <TextField
        className={classes.input}
        id="order"
        type="number"
        value={formik.values.order}
        onChange={formik.handleChange}
        label="Order"
      />
      {formik.values.taskVars?.title ? (
        <>
          <AppTypography variant="h4" className={classes.subtitle}>
            Title Template
          </AppTypography>
          <ReactMarkdown>{task.templates.title}</ReactMarkdown>
          {Object.keys(formik.values.taskVars.title).map((k, i) => (
            <TextField
              key={i}
              onChange={formik.handleChange}
              className={classes.input}
              id={`taskVars.title.${k}`}
              value={formik.values.taskVars.title[k]}
              label={k}
            />
          ))}
        </>
      ) : undefined}
      {formik.values.taskVars?.description ? (
        <>
          <AppTypography variant="h4" className={classes.subtitle}>
            Description Template
          </AppTypography>
          <ReactMarkdown>{task.templates.description}</ReactMarkdown>
          {Object.keys(formik.values.taskVars.description).map((k, i) => (
            <TextField
              key={i}
              className={classes.input}
              onChange={formik.handleChange}
              id={`taskVars.description.${k}`}
              value={formik.values.taskVars.description[k]}
              label={k}
            />
          ))}
        </>
      ) : undefined}
      {formik.values.taskVars?.link ? (
        <>
          <AppTypography variant="h4" className={classes.subtitle}>
            Link Template
          </AppTypography>
          <ReactMarkdown>{task.templates.link}</ReactMarkdown>
          {Object.keys(formik.values.taskVars.link).map((k, i) => (
            <TextField
              key={i}
              onChange={formik.handleChange}
              className={classes.input}
              id={`taskVars.link.${k}`}
              value={formik.values.taskVars.link[k]}
              label={k}
            />
          ))}
        </>
      ) : undefined}
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
