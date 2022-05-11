import {
  ClickAwayListener,
  makeStyles,
  TextField,
  TextFieldProps,
  Typography,
} from "@material-ui/core"
import clsx from "clsx"
import {useFormik} from "formik"
import React, {useState} from "react"

let useFormHeaderStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > *:not(:first-child)": {
      marginTop: theme.spacing(1),
    },
  },
  formTitle: {
    ...theme.typography.h1,
  },
  formDescription: {
    ...theme.typography.body1,
  },
  editableText: {
    width: "100%",
    borderBottomStyle: "dashed",
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.grey[700],
  },
}))

type FormHeaderProps = {
  formId: number
  title: string
  description: string
  editable?: boolean
}

export function FormHeader(props: FormHeaderProps) {
  let classes = useFormHeaderStyles()
  let formik = useFormik({
    initialValues: {
      title: props.title,
      description: props.description,
    },
    onSubmit: () => undefined,
  })
  const commonTextFieldProps: TextFieldProps = {
    variant: "outlined",
    fullWidth: true,
    onChange: formik.handleChange,
    size: "small",
  }
  let [editActive, setEditActive] = useState(false)
  return (
    <div
      onClick={() => setEditActive(true)}
      onFocus={() => setEditActive(true)}
      onBlur={(e) => {
        if (
          e.relatedTarget == null ||
          e.currentTarget == null ||
          !e.currentTarget.contains(e.relatedTarget as Node)
        ) {
          setEditActive(false)
        }
      }}
      tabIndex={0}>
      {editActive ? (
        <ClickAwayListener onClickAway={() => setEditActive(false)}>
          <form className={classes.root}>
            <TextField
              {...commonTextFieldProps}
              id="title"
              value={formik.values.title ?? ""}
              placeholder={"Form title"}
              InputProps={{
                className: classes.formTitle,
              }}
            />
            <TextField
              {...commonTextFieldProps}
              id="description"
              value={formik.values.description ?? ""}
              placeholder={"(Optional) form description"}
              InputProps={{
                className: classes.formDescription,
              }}
              multiline
              rows={2}
              rowsMax={10}
            />
          </form>
        </ClickAwayListener>
      ) : (
        <div className={classes.root}>
          <Typography
            variant="inherit"
            component="h1"
            className={clsx(
              classes.formTitle,
              props.editable ? classes.editableText : undefined
            )}>
            {props.title}
          </Typography>
          {props.description && (
            <Typography
              variant="inherit"
              component="p"
              className={clsx(
                classes.formDescription,
                props.editable ? classes.editableText : undefined
              )}>
              {props.description}
            </Typography>
          )}
        </div>
      )}
    </div>
  )
}

let useFormQuestionHeaderStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > *:not(:first-child)": {
      marginTop: theme.spacing(1),
    },
  },
  questionTitle: {
    ...theme.typography.body1,
    fontWeight: theme.typography.fontWeightBold,
  },
  questionDescription: {
    ...theme.typography.body2,
  },
  editableText: {
    width: "100%",
    borderBottomStyle: "dashed",
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.grey[700],
  },
}))

type FormQuestionHeaderProps = {
  questionId: number
  title: string
  description: string
  editable?: boolean
  editActive?: boolean
}

export function FormQuestionHeader(props: FormQuestionHeaderProps) {
  let classes = useFormQuestionHeaderStyles()
  let formik = useFormik({
    initialValues: {
      title: props.title,
      description: props.description,
    },
    onSubmit: () => undefined,
  })
  const commonTextFieldProps: TextFieldProps = {
    variant: "outlined",
    fullWidth: true,
    onChange: formik.handleChange,
    size: "small",
  }

  return props.editable && props.editActive ? (
    <form className={classes.root}>
      <TextField
        {...commonTextFieldProps}
        id="title"
        value={formik.values.title ?? ""}
        placeholder={"Question header"}
        InputProps={{
          className: classes.questionTitle,
        }}
      />
      <TextField
        {...commonTextFieldProps}
        id="description"
        value={formik.values.description ?? ""}
        placeholder={"(Optional) question description"}
        InputProps={{
          className: classes.questionDescription,
        }}
        multiline
        rows={2}
        rowsMax={10}
      />
    </form>
  ) : (
    <div tabIndex={-1}>
      <Typography
        variant="inherit"
        component="h1"
        className={clsx(
          classes.questionTitle,
          props.editable ? classes.editableText : undefined
        )}>
        {props.title}
      </Typography>
      {props.description && (
        <Typography
          variant="inherit"
          component="p"
          className={clsx(
            classes.questionDescription,
            props.editable ? classes.editableText : undefined
          )}>
          {props.description}
        </Typography>
      )}
    </div>
  )
}
