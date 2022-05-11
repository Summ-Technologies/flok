import {
  Checkbox,
  ClickAwayListener,
  FormControl,
  FormControlLabel,
  FormGroup,
  makeStyles,
  MenuItem,
  Radio,
  TextField,
  TextFieldProps,
} from "@material-ui/core"
import {useFormik} from "formik"
import React, {useState} from "react"
import {
  FormQuestionModel,
  FormQuestionSelectOptionModel,
  FormQuestionTypeEnum,
  FormQuestionTypeName,
  FormQuestionTypeValues,
} from "../../models/form"
import {useFormQuestion} from "./FormQuestionProvider"
import {FormQuestionHeader} from "./Headers"

let useQuestionStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    borderRadius: theme.shape.borderRadius,
    display: "flex",
    flexDirection: "column",
  },
  questionHeaderContainer: {
    display: "flex",
    flexDirection: "row",
    marginBottom: theme.spacing(4),
  },
  questionTitleSubtitle: {
    flex: 1,
    marginRight: theme.spacing(2),
    "& > *:not(:first-child)": {
      marginTop: theme.spacing(1),
    },
  },
  formQuestionTitleInput: {
    ...theme.typography.body1,
    fontWeight: theme.typography.fontWeightBold,
  },
  formQuestionDescriptionInput: {
    ...theme.typography.body2,
  },
}))

type RegFormBuilderQuestionProps = {
  editable?: boolean
}
export function RegFormBuilderQuestion(props: RegFormBuilderQuestionProps) {
  let classes = useQuestionStyles()
  let [editActive, setEditActive] = useState(false)
  let question = useFormQuestion()
  let questionBody = (
    <div
      className={classes.root}
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
      <div className={classes.questionHeaderContainer}>
        <div className={classes.questionTitleSubtitle}>
          <FormQuestionHeader
            title={question.title}
            description={question.description ?? ""}
            questionId={question.id}
            editable={props.editable}
            editActive={editActive}
          />
        </div>
        {editActive && (
          <TextField
            variant="outlined"
            select
            size="small"
            SelectProps={{native: false}}
            value={question?.type || "SHORT_ANSWER"}>
            {FormQuestionTypeValues.map((type) => (
              <MenuItem value={type}>
                {FormQuestionTypeName[type] ?? type}
              </MenuItem>
            ))}
          </TextField>
        )}
      </div>
      <RegFormBuilderQuestionSwitch question={question} />
    </div>
  )
  return editActive ? (
    <ClickAwayListener
      touchEvent="onTouchStart"
      mouseEvent="onMouseDown"
      onClickAway={() => {
        setEditActive(false)
      }}>
      {questionBody}
    </ClickAwayListener>
  ) : (
    questionBody
  )
}

function RegFormBuilderQuestionSwitch(props: {question: FormQuestionModel}) {
  function render(questionType: typeof props.question.type) {
    switch (questionType) {
      case FormQuestionTypeEnum.SHORT_ANSWER:
        return (
          <RegFormBuilderTextQuestion
            type={FormQuestionTypeEnum.SHORT_ANSWER}
          />
        )
      case FormQuestionTypeEnum.LONG_ANSWER:
        return (
          <RegFormBuilderTextQuestion type={FormQuestionTypeEnum.LONG_ANSWER} />
        )
      case FormQuestionTypeEnum.SINGLE_SELECT:
        return (
          <RegFormBuilderSelectQuestion
            type={FormQuestionTypeEnum.SINGLE_SELECT}
            options={props.question.select_options}
          />
        )
      case FormQuestionTypeEnum.MULTI_SELECT:
        return (
          <RegFormBuilderSelectQuestion
            type={FormQuestionTypeEnum.MULTI_SELECT}
            options={props.question.select_options}
          />
        )
      // case FormQuestionTypeEnum.DATE:
      // case FormQuestionTypeEnum.DATETIME:
      default:
        return <div>Something went wrong</div>
    }
  }
  return render(props.question.type)
}

let useTextQuestionStyles = makeStyles((theme) => ({
  root: {},
  formQuestionTextInput: {
    ...theme.typography.body1,
  },
}))

type RegFormBuilderTextQuestionProps = {
  type: FormQuestionTypeEnum.SHORT_ANSWER | FormQuestionTypeEnum.LONG_ANSWER
}
function RegFormBuilderTextQuestion(props: RegFormBuilderTextQuestionProps) {
  let classes = useTextQuestionStyles()
  return (
    <TextField
      variant="outlined"
      disabled
      fullWidth
      InputProps={{
        className: classes.formQuestionTextInput,
      }}
      multiline={props.type === FormQuestionTypeEnum.LONG_ANSWER}
      rows={props.type === FormQuestionTypeEnum.LONG_ANSWER ? 3 : undefined}
      rowsMax={props.type === FormQuestionTypeEnum.LONG_ANSWER ? 3 : undefined}
      placeholder={`${FormQuestionTypeName[props.type]}`}
    />
  )
}

let useSelectQuestionStyles = makeStyles((theme) => ({
  root: {},
}))

type RegFormBuilderSelectQuestionProps = {
  type: FormQuestionTypeEnum.MULTI_SELECT | FormQuestionTypeEnum.SINGLE_SELECT
  options: FormQuestionSelectOptionModel[]
}
export function RegFormBuilderSelectQuestion(
  props: RegFormBuilderSelectQuestionProps
) {
  let classes = useSelectQuestionStyles()
  let formik = useFormik({
    initialValues: {
      options: props.options,
    },
    onSubmit: () => undefined,
  })
  let commonOptionTextFieldProps: TextFieldProps = {
    onChange: formik.handleChange,
    size: "small",
  }

  return (
    <FormControl>
      <FormGroup>
        {formik.values.options.map((opt, i) => {
          return (
            <FormControlLabel
              value={formik.values.options[i].option}
              control={
                props.type === FormQuestionTypeEnum.SINGLE_SELECT ? (
                  <Radio />
                ) : (
                  <Checkbox checked={false} />
                )
              }
              label={
                <TextField
                  {...commonOptionTextFieldProps}
                  id={`options[${i}]`}
                  value={formik.values.options[i].option}
                />
              }
            />
          )
        })}
        <FormControlLabel
          value={"new"}
          control={
            props.type === FormQuestionTypeEnum.SINGLE_SELECT ? (
              <Radio />
            ) : (
              <Checkbox checked={false} />
            )
          }
          label={
            <TextField
              onClick={() =>
                formik.setFieldValue("options", [
                  ...formik.values.options,
                  {id: -1, option: ""},
                ])
              }
            />
          }
        />
      </FormGroup>
    </FormControl>
  )
}

function SelectQuestionLabel(props: {
  editActive: boolean
  option: string
  type:
    | typeof FormQuestionTypeEnum.MULTI_SELECT
    | typeof FormQuestionTypeEnum.SINGLE_SELECT
}) {
  let control =
    props.type === FormQuestionTypeEnum.MULTI_SELECT ? (
      <Checkbox checked={false} />
    ) : (
      <Radio />
    )
  return (
    <FormControlLabel
      value={props.option}
      control={control}
      label={<TextField value={props.option} />}
    />
  )
}
