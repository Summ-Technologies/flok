import {Action} from "redux"
import {
  FormApiResponse,
  QuestionApiResponse,
  QuestionOptionApiResponse,
} from "../../models/api"
import {
  FormModel,
  FormQuestionModel,
  FormQuestionSelectOptionModel,
} from "../../models/form"
import {ApiAction} from "../actions/api"
import {
  DELETE_FORM_QUESTION_OPTION_SUCCESS,
  DELETE_FORM_QUESTION_SUCCESS,
  GET_FORM_QUESTION_OPTION_SUCCESS,
  GET_FORM_QUESTION_SUCCESS,
  GET_FORM_SUCCESS,
  PATCH_FORM_QUESTION_OPTION_SUCCESS,
  PATCH_FORM_QUESTION_SUCCESS,
  PATCH_FORM_SUCCESS,
  POST_FORM_QUESTION_OPTION_SUCCESS,
  POST_FORM_QUESTION_SUCCESS,
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
}

const initialState: FormState = {
  forms: {
    // 1: {
    //   id: 1,
    //   questions: [1, 2, 3],
    //   title: "Flok Retreat Registration",
    //   description: "Fill out this form by EOD 11/25 to go on the Flok retreat.",
    // },
  },
  formQuestions: {
    // 1: {
    //   description: "",
    //   form_id: 1,
    //   id: 1,
    //   required: undefined,
    //   select_allow_user_input: undefined,
    //   select_options: [1, 2, 3],
    //   title: "Single select",
    //   type: "SINGLE_SELECT",
    // },
    // 2: {
    //   description: "",
    //   form_id: 1,
    //   id: 2,
    //   required: undefined,
    //   select_allow_user_input: undefined,
    //   select_options: [4, 5, 6],
    //   title: "Multi select",
    //   type: "MULTI_SELECT",
    // },
    // 3: {
    //   description: "",
    //   form_id: 1,
    //   id: 3,
    //   required: undefined,
    //   select_allow_user_input: undefined,
    //   select_options: [],
    //   title: "Short answer",
    //   type: "SHORT_ANSWER",
    // },
    // 4: {
    //   description: "",
    //   form_id: 1,
    //   id: 4,
    //   required: undefined,
    //   select_allow_user_input: undefined,
    //   select_options: [],
    //   title: "Long answer",
    //   type: "LONG_ANSWER",
    // },
  },
  questionOptions: {},
}

export default function formReducer(
  state: FormState = initialState,
  action: Action
): FormState {
  var payload
  var newFormQuestions
  var newForms
  var newQuestionOptions
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
    default:
      return state
  }
}