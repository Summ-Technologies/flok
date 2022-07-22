import {Action} from "redux"
import {
  FormApiResponse,
  QuestionApiResponse,
  QuestionOptionApiResponse,
} from "../../models/api"
import {
  FormModel,
  FormQuestionModel,
  FormQuestionRuleModel,
  FormQuestionSelectOptionModel,
  FormResponseModel,
} from "../../models/form"
import {ApiAction} from "../actions/api"
import {
  DELETE_FORM_QUESTION_OPTION_SUCCESS,
  DELETE_FORM_QUESTION_SUCCESS,
  DELETE_QUESTION_RULE_SUCCESS,
  GET_FORM_QUESTION_OPTION_SUCCESS,
  GET_FORM_QUESTION_SUCCESS,
  GET_FORM_RESPONSE_SUCCESS,
  GET_FORM_SUCCESS,
  GET_QUESTION_RULE_SUCCESS,
  PATCH_FORM_QUESTION_OPTION_SUCCESS,
  PATCH_FORM_QUESTION_SUCCESS,
  PATCH_FORM_SUCCESS,
  POST_FORM_QUESTION_OPTION_SUCCESS,
  POST_FORM_QUESTION_SUCCESS,
  POST_FORM_RESPONSE_SUCCESS,
  POST_QUESTION_RULE_SUCCESS,
} from "../actions/form"

export type FormState = {
  forms: {
    [id: number]: FormModel | undefined
  }
  formQuestions: {
    [id: number]: FormQuestionModel | undefined
  }
  questionOptions: {
    [id: number]: FormQuestionSelectOptionModel | undefined
  }
  questionRules: {
    [id: number]: FormQuestionRuleModel | undefined
  }
  formResponses: {
    [id: number]: FormResponseModel
  }
}

const initialState: FormState = {
  forms: {},
  formQuestions: {},
  questionOptions: {},
  questionRules: {},
  formResponses: {},
}

export default function formReducer(
  state: FormState = initialState,
  action: Action
): FormState {
  var newQuestionRules
  var newFormQuestions
  var newForms
  var newQuestionOptions
  var questionRule
  switch (action.type) {
    case GET_FORM_SUCCESS:
    case PATCH_FORM_SUCCESS:
      let form = ((action as ApiAction).payload as FormApiResponse).form
      return {
        ...state,
        forms: {...state.forms, [form.id]: form},
      }
    case GET_FORM_QUESTION_SUCCESS:
    case POST_FORM_QUESTION_SUCCESS:
    case PATCH_FORM_QUESTION_SUCCESS:
      let question = ((action as ApiAction).payload as QuestionApiResponse)
        .form_question
      return {
        ...state,
        formQuestions: {...state.formQuestions, [question.id]: question},
      }
    case DELETE_FORM_QUESTION_SUCCESS:
      let questionId = (action as unknown as {meta: {questionId: number}}).meta
        .questionId
      newFormQuestions = {...state.formQuestions}
      delete newFormQuestions[questionId]
      newForms = Object.keys(state.forms).reduce((prev, currKey: string) => {
        let currId = currKey as unknown as number
        let currForm = state.forms[currId]
        if (currForm && currForm.questions) {
          currForm = {...currForm}
          currForm.questions = currForm.questions.filter(
            (id) => id !== questionId
          )
        }
        return {...prev, [currId]: currForm}
      }, {})
      return {
        ...state,
        forms: newForms,
        formQuestions: newFormQuestions,
      }
    case GET_FORM_QUESTION_OPTION_SUCCESS:
    case POST_FORM_QUESTION_OPTION_SUCCESS:
    case PATCH_FORM_QUESTION_OPTION_SUCCESS:
      let option = ((action as ApiAction).payload as QuestionOptionApiResponse)
        .select_option
      return {
        ...state,
        questionOptions: {...state.questionOptions, [option.id]: option},
      }
    case DELETE_FORM_QUESTION_OPTION_SUCCESS:
      let optionId = (action as unknown as {meta: {optionId: number}}).meta
        .optionId
      newQuestionOptions = {...state.questionOptions}
      delete newQuestionOptions[optionId]
      newFormQuestions = Object.keys(state.formQuestions).reduce(
        (prev, currKey: string) => {
          let currId = currKey as unknown as number
          let currQuestion = state.formQuestions[currId]
          if (currQuestion && currQuestion.select_options) {
            currQuestion = {...currQuestion}
            currQuestion.select_options = currQuestion.select_options.filter(
              (id) => id !== optionId
            )
          }
          return {...prev, [currId]: currQuestion}
        },
        {}
      )
      return {
        ...state,
        questionOptions: newQuestionOptions,
        formQuestions: newFormQuestions,
      }
    case GET_FORM_RESPONSE_SUCCESS:
    case POST_FORM_RESPONSE_SUCCESS:
      let formResponse = (
        (action as ApiAction).payload as {form_response: FormResponseModel}
      ).form_response
      return {
        ...state,
        formResponses: {
          ...state.formResponses,
          [formResponse.id]: formResponse,
        },
      }
    case GET_QUESTION_RULE_SUCCESS:
    case POST_QUESTION_RULE_SUCCESS:
      questionRule = (
        (action as ApiAction).payload as {
          form_question_rule: FormQuestionRuleModel
        }
      ).form_question_rule
      newFormQuestions = {...state.formQuestions}
      // For the post
      if (
        newFormQuestions[questionRule.form_question_id] &&
        !newFormQuestions[
          questionRule.form_question_id
        ]!.form_question_rules.includes(questionRule.id)
      ) {
        newFormQuestions[
          questionRule.form_question_id
        ]!.form_question_rules.push(questionRule.id)
      }
      return {
        ...state,
        formQuestions: newFormQuestions,
        questionRules: {
          ...state.questionRules,
          [questionRule.id]: questionRule,
        },
      }
    case DELETE_QUESTION_RULE_SUCCESS:
      let questionRuleId = (
        action as unknown as {meta: {questionRuleId: number}}
      ).meta.questionRuleId
      newQuestionRules = {...state.questionRules}
      delete newQuestionRules[questionRuleId]
      newFormQuestions = Object.keys(state.formQuestions).reduce(
        (prev, currKey: string) => {
          let currId = currKey as unknown as number
          let currQuestion = state.formQuestions[currId]
          if (currQuestion && currQuestion.form_question_rules) {
            currQuestion = {...currQuestion}
            currQuestion.form_question_rules =
              currQuestion.form_question_rules.filter(
                (id) => id !== questionRuleId
              )
          }
          return {...prev, [currId]: currQuestion}
        },
        {}
      )
      return {
        ...state,
        formQuestions: newFormQuestions,
        questionRules: newQuestionRules,
      }
    default:
      return state
  }
}
