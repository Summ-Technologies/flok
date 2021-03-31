import {Card, makeStyles, TextField} from "@material-ui/core"
import React, {ReactFragment, SyntheticEvent, useState} from "react"
import {RequestState} from "../store/reducers/api"
import {Form, FormUtils} from "../utils/formUtils"
import AppButton from "./AppButton"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    "& > *:not(:last-child)": {
      marginBottom: theme.spacing(2),
    },
  },
  body: {
    "& > *:not(:last-child)": {
      marginBottom: theme.spacing(1),
    },
  },
}))

type AppFormCardProps = {
  hideBody?: boolean
  form: Form<any>
  submitForm: () => void
  setForm: (form: Form<any>) => void
  formRequest?: RequestState
  header?: ReactFragment
  submitButtonText?: string
}

export default function AppFormCard(props: AppFormCardProps) {
  const classes = useStyles()
  let [validate, setValidate] = useState<{[key: string]: boolean}>({})
  let authFormUtils = new FormUtils<any>()
  function submitForm(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()
    props.submitForm()
  }
  function disableSubmit() {
    return (
      Object.keys(props.form).filter((key) => {
        let formField = props.form[key]
        return formField.validator(formField.value, props.form) !== undefined
      }).length > 0
    )
  }
  return (
    <Card className={`${classes.root}`}>
      {props.header}
      {props.hideBody ? undefined : (
        <form className={classes.body} onSubmit={submitForm}>
          {Object.keys(props.form).map((key, i) => {
            let formField = props.form[key]
            return (
              <TextField
                key={i}
                value={formField.value}
                onChange={(e) =>
                  props.setForm({
                    ...props.form,
                    [key]: {...formField, value: e.target.value},
                  })
                }
                onBlur={() => setValidate({...validate, [key]: true})}
                {...(validate[key]
                  ? authFormUtils.getTextErrorProps(props.form, key)
                  : {})}
                label={formField.label ? formField.label : formField.type}
                type={formField.type}
                required={formField.required}
                variant="standard"
                fullWidth
                autoFocus={i === 0}
              />
            )
          })}
          <AppButton
            type="submit"
            variant="contained"
            color="primary"
            disabled={disableSubmit()}>
            {props.submitButtonText ? props.submitButtonText : "Submit"}
          </AppButton>
        </form>
      )}
    </Card>
  )
}
