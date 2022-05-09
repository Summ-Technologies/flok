import {
  Checkbox,
  ClickAwayListener,
  FormControl,
  FormControlLabel,
  FormGroup,
  makeStyles,
  Radio,
  RadioGroup,
  TextField,
  TextFieldProps,
  Typography,
} from "@material-ui/core"
import clsx from "clsx"
import {useFormik} from "formik"
import {useState} from "react"
import {useDispatch} from "react-redux"
import {RouteComponentProps, withRouter} from "react-router-dom"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import PageSidenav from "../components/page/PageSidenav"
import {
  FormQuestionModel,
  FormQuestionSelectOptionModel,
  FormQuestionTypeEnum,
  FormQuestionTypeName,
  FormQuestionTypeValues,
} from "../models/form"

const FORM = {
  form: {
    id: 1,
    title: "First form",
    description: "this is my first form",
    questions: [
      {
        description: "",
        form_id: 1,
        id: 1,
        required: null,
        select_allow_user_input: null,
        select_options: [
          {
            id: 1,
            option: "First option",
          },
          {
            id: 2,
            option: "Second option",
          },
          {
            id: 3,
            option: "Third option",
          },
        ],
        title: "Single select",
        type: "SINGLE_SELECT",
      },
      {
        description: "",
        form_id: 1,
        id: 4,
        required: null,
        select_allow_user_input: null,
        select_options: [
          {
            id: 4,
            option: "First option",
          },
          {
            id: 5,
            option: "Second option",
          },
          {
            id: 6,
            option: "Third option",
          },
        ],
        title: "Multi select",
        type: "MULTI_SELECT",
      },
      {
        description: "",
        form_id: 1,
        id: 2,
        required: null,
        select_allow_user_input: null,
        select_options: [],
        title: "Short answer",
        type: "SHORT_ANSWER",
      },
      {
        description: "",
        form_id: 1,
        id: 3,
        required: null,
        select_allow_user_input: null,
        select_options: [],
        title: "Long answer",
        type: "LONG_ANSWER",
      },
    ],
  },
}

let useStyles = makeStyles((theme) => ({
  body: {
    margin: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      margin: theme.spacing(0.5),
    },
  },
  builderForm: {
    margin: theme.spacing(1),
    "& > :not(:first-child)": {marginTop: theme.spacing(2)},
  },
  formSection: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    borderRadius: theme.shape.borderRadius,
  },
  formQuestionTitleInput: {
    ...theme.typography.body1,
    fontWeight: theme.typography.fontWeightBold,
  },
  formQuestionDescriptionInput: {
    ...theme.typography.body2,
  },
}))

type AttendeesRegFormBuilderProps = RouteComponentProps<{retreatIdx: string}>
function AttendeesRegFormBuilderPage(props: AttendeesRegFormBuilderProps) {
  let classes = useStyles()
  let dispatch = useDispatch()
  let retreatIdx = parseInt(props.match.params.retreatIdx)

  return (
    <PageContainer>
      <PageSidenav activeItem="attendees" retreatIdx={retreatIdx} />
      <PageBody appBar>
        <div className={classes.body}>
          <Typography variant="h1">Attendee Registration Form</Typography>
          <div className={classes.builderForm}>
            <div className={classes.formSection}>
              <FormHeader
                editable
                formId={FORM.form.id}
                title={FORM.form.title}
                description={FORM.form.description}
              />
            </div>
            {FORM.form.questions.map((question) => (
              <div className={classes.formSection}>
                <RegFormBuilderQuestion
                  question={question as unknown as FormQuestionModel}
                  editable
                />
              </div>
            ))}
          </div>
        </div>
      </PageBody>
    </PageContainer>
  )
}

export default withRouter(AttendeesRegFormBuilderPage)

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
  question: FormQuestionModel
}
function RegFormBuilderQuestion(props: RegFormBuilderQuestionProps) {
  let classes = useQuestionStyles()
  let [editActive, setEditActive] = useState(false)
  return (
    <ClickAwayListener onClickAway={() => setEditActive(false)}>
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
              title={props.question.title}
              description={props.question.description ?? ""}
              questionId={props.question.id}
              editable={props.editable}
              editActive={editActive}
            />
          </div>
          {editActive && (
            <TextField
              variant="outlined"
              select
              SelectProps={{native: true}}
              value={props.question?.type || "SHORT_ANSWER"}>
              {FormQuestionTypeValues.map((type) => (
                <option value={type}>
                  {FormQuestionTypeName[type] ?? type}
                </option>
              ))}
            </TextField>
          )}
        </div>
        <RegFormBuilderQuestionSwitch question={props.question} />
      </div>
    </ClickAwayListener>
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
function RegFormBuilderSelectQuestion(
  props: RegFormBuilderSelectQuestionProps
) {
  let classes = useSelectQuestionStyles()
  return (
    <FormControl>
      {props.type === FormQuestionTypeEnum.SINGLE_SELECT ? (
        <RadioGroup value={false}>
          {props.options.map((opt) => {
            return (
              <FormControlLabel
                value={opt.option}
                control={<Radio />}
                label={opt.option}
              />
            )
          })}
        </RadioGroup>
      ) : (
        <FormGroup>
          {props.options.map((opt) => {
            return (
              <FormControlLabel
                value={opt.option}
                control={<Checkbox checked={false} name={opt.option} />}
                label={opt.option}
              />
            )
          })}
        </FormGroup>
      )}
    </FormControl>
  )
}

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

function FormHeader(props: FormHeaderProps) {
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
  return editActive ? (
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
    <div
      onClick={() => props.editable && setEditActive(true)}
      className={classes.root}>
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

function FormQuestionHeader(props: FormQuestionHeaderProps) {
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
