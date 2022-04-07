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
    },
    validationSchema: yup.object({
      title: yup.string(),
      description: yup.string(),
      link: yup.string(),
    }),
    onSubmit: (values) => {
      // retreat && dispatch(patchRetreatDetails(retreat.id, values))
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
          {...commonTextFieldProps}
          {...getTextFieldErrorProps(formik, "description")}
          id="description"
          multiline
          minRows={3}
          value={formik.values.description}
          label="Description"
        />

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
