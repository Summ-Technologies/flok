import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Link,
  makeStyles,
  MenuItem,
  Select,
} from "@material-ui/core"
import {forwardRef, useEffect, useState} from "react"
import {FormQuestionModel} from "../../models/form"
import {
  useForm,
  useFormQuestion,
  useFormQuestionOption,
  useFormQuestionRule,
} from "../../utils/formUtils"

let useStyles = makeStyles((theme) => ({
  root: {},
}))

type QuestionRulesProps = {formId: number; questionId: number}
export default function QuestionRules(props: QuestionRulesProps) {
  let classes = useStyles(props)
  let [form, formLoading] = useForm(props.formId)
  let [question, questionLoading] = useFormQuestion(props.questionId)
  let [editRulesOpen, setEditRulesOpen] = useState(false)
  console.log(editRulesOpen)
  if (form && question) {
    return (
      <>
        <Dialog
          disablePortal={true}
          fullWidth
          maxWidth="sm"
          open={editRulesOpen}
          onClose={(e, r) => {
            console.log(e, r)
            setEditRulesOpen(false)
          }}>
          <DialogContent>
            <QuestionRulesEditor question={question} />
          </DialogContent>
        </Dialog>
        <div className={classes.root}>
          {question.form_question_rules.length} conditions
          <Link onClick={() => setEditRulesOpen(true)}>Edit</Link>
        </div>
      </>
    )
  } else if (formLoading || questionLoading) {
    return <CircularProgress />
  } else {
    return <div>Something went wrong</div>
  }
}

type QuestionRulesEditorProps = {question: FormQuestionModel}
function QuestionRulesEditor(props: QuestionRulesEditorProps) {
  let [addQuestionActive, setAddQuestionActive] = useState(false)
  return !addQuestionActive ? (
    <div>
      {props.question.form_question_rules.map((ruleId) => (
        <QuestionRule ruleId={ruleId} />
      ))}
      <Button
        onClick={(e) => {
          setAddQuestionActive(true)
        }}>
        Add rule
      </Button>
    </div>
  ) : (
    <AddQuestionRuleForm currentQuestionId={props.question.id} />
  )
}

type AddQuestionRuleFormProps = {currentQuestionId: number}
function AddQuestionRuleForm(props: AddQuestionRuleFormProps) {
  let [question, questionLoading] = useFormQuestion(props.currentQuestionId)
  let [form, formLoading] = useForm(question?.form_id || -1)
  let [previousQuestions, setPreviousQuestions] = useState<number[]>([])
  let [selectedQuestion, setSelectedQuestion] = useState<number | undefined>(
    undefined
  )
  useEffect(() => {
    if (form) {
      let currQuestionIndex = form.questions.indexOf(props.currentQuestionId)
      setPreviousQuestions(form.questions.slice(0, currQuestionIndex))
    }
  }, [setPreviousQuestions, form, props.currentQuestionId])
  return (
    <Select
      native={false}
      value={selectedQuestion ?? 41}
      onChange={() => alert("hel")}
      // SelectProps={{
      //   MenuProps: {disablePortal: true},
      //   native: false,
      //   onChange: (e) => {
      //     console.log(e)
      //     setSelectedQuestion(e.target.value as number)
      //   }, }}
    >
      {previousQuestions.map((id) => (
        <QuestionSelectOption questionId={id} />
        // <MenuItem key={id} value={id}>
        //   {id}
        // </MenuItem>
      ))}
    </Select>
  )
}

// function QuestionSelectOption(props: {value: number}) {
//   return (
//     <MenuItem  key={props.value} {...props}>
//       <Typography>{props.value}</Typography>
//     </MenuItem>
//   )
// }

let QuestionSelectOption = forwardRef((props: {questionId: number}, ref) => {
  // let [question, questionLoading] = useFormQuestion(props.questionId)
  return true ? (
    // @ts-ignore
    <MenuItem ref={ref} {...props} value={props.questionId}>
      {props.questionId}
    </MenuItem>
  ) : (
    <></>
  )
})

type QuestionRuleProps = {ruleId: number}
function QuestionRule(props: QuestionRuleProps) {
  let [rule, ruleLoading] = useFormQuestionRule(props.ruleId)
  let [question, questionLoading] = useFormQuestion(
    rule?.form_question_id || -1
  )
  let [dependsOnQuestion, dependsOnQuestionLoading] = useFormQuestion(
    rule?.depends_on_form_question_id || -1
  )
  let [dependsOnOption, dependsOnOptionLoading] = useFormQuestionOption(
    rule?.depends_on_select_option_id || -1
  )
  return rule && question && dependsOnQuestion && dependsOnOption ? (
    <div>
      {dependsOnQuestion.title} is {dependsOnOption.option}
    </div>
  ) : ruleLoading ||
    questionLoading ||
    dependsOnQuestionLoading ||
    dependsOnOptionLoading ? (
    <CircularProgress />
  ) : (
    <div>Something went wrong</div>
  )
}
