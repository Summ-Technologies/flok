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
    case GET_FORM_QUESTION_OPTION_SUCCESS:
    case POST_FORM_QUESTION_OPTION_SUCCESS:
    case PATCH_FORM_QUESTION_OPTION_SUCCESS:
      let option = ((action as ApiAction).payload as QuestionOptionApiResponse)
        .select_option
      return {
        ...state,
        questionOptions: {...state.questionOptions, [option.id]: option},
      }
    default:
      return state
  }
}
