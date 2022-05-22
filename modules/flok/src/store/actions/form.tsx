import {ThunkDispatch} from "redux-thunk"
import {
  FormModel,
  FormQuestionModel,
  FormQuestionSelectOptionModel,
} from "../../models/form"
import {ApiAction, createApiAction} from "./api"

export const GET_FORM_REQUEST = "GET_FORM_REQUEST"
export const GET_FORM_SUCCESS = "GET_FORM_SUCCESS"
export const GET_FORM_FAILURE = "GET_FORM_FAILURE"

export function getForm(formId: number) {
  let endpoint = `/v1.0/forms/${formId}`
  return createApiAction({
    method: "GET",
    endpoint,
    types: [GET_FORM_REQUEST, GET_FORM_SUCCESS, GET_FORM_FAILURE],
  })
}

export const PATCH_FORM_REQUEST = "PATCH_FORM_REQUEST"
export const PATCH_FORM_SUCCESS = "PATCH_FORM_SUCCESS"
export const PATCH_FORM_FAILURE = "PATCH_FORM_FAILURE"

export function patchForm(
  formId: number,
  form: Partial<Pick<FormModel, "description" | "title">>
) {
  let endpoint = `/v1.0/forms/${formId}`
  return createApiAction({
    method: "PATCH",
    body: JSON.stringify(form),
    endpoint,
    types: [PATCH_FORM_REQUEST, PATCH_FORM_SUCCESS, PATCH_FORM_FAILURE],
  })
}

export const GET_FORM_QUESTION_REQUEST = "GET_FORM_QUESTION_REQUEST"
export const GET_FORM_QUESTION_SUCCESS = "GET_FORM_QUESTION_SUCCESS"
export const GET_FORM_QUESTION_FAILURE = "GET_FORM_QUESTION_FAILURE"

export function getFormQuestion(questionId: number) {
  let endpoint = `/v1.0/questions/${questionId}`
  return createApiAction({
    method: "GET",
    endpoint,
    types: [
      GET_FORM_QUESTION_REQUEST,
      GET_FORM_QUESTION_SUCCESS,
      GET_FORM_QUESTION_FAILURE,
    ],
  })
}

export const POST_FORM_QUESTION_REQUEST = "POST_FORM_QUESTION_REQUEST"
export const POST_FORM_QUESTION_SUCCESS = "POST_FORM_QUESTION_SUCCESS"
export const POST_FORM_QUESTION_FAILURE = "POST_FORM_QUESTION_FAILURE"

export function postFormQuestion(
  formQuestion: Pick<FormQuestionModel, "form_id" | "type">
) {
  let endpoint = "/v1.0/questions"
  return async (dispatch: ThunkDispatch<any, any, any>) => {
    let postResponse = (await dispatch(
      createApiAction({
        method: "POST",
        body: JSON.stringify({...formQuestion, title: ""}),
        endpoint,
        types: [
          POST_FORM_QUESTION_REQUEST,
          POST_FORM_QUESTION_SUCCESS,
          POST_FORM_QUESTION_FAILURE,
        ],
      })
    )) as unknown as ApiAction
    if (!postResponse.error) {
      dispatch(getForm(formQuestion.form_id))
    }
  }
}

export const PATCH_FORM_QUESTION_REQUEST = "PATCH_FORM_QUESTION_REQUEST"
export const PATCH_FORM_QUESTION_SUCCESS = "PATCH_FORM_QUESTION_SUCCESS"
export const PATCH_FORM_QUESTION_FAILURE = "PATCH_FORM_QUESTION_FAILURE"

export function patchFormQuestion(
  formId: number,
  formQuestion: Partial<
    Pick<FormQuestionModel, "description" | "title" | "type">
  >
) {
  let endpoint = `/v1.0/forms/${formId}`
  return createApiAction({
    method: "PATCH",
    body: JSON.stringify(formQuestion),
    endpoint,
    types: [
      PATCH_FORM_QUESTION_REQUEST,
      PATCH_FORM_QUESTION_SUCCESS,
      PATCH_FORM_QUESTION_FAILURE,
    ],
  })
}

export const GET_FORM_QUESTION_OPTION_REQUEST =
  "GET_FORM_QUESTION_OPTION_REQUEST"
export const GET_FORM_QUESTION_OPTION_SUCCESS =
  "GET_FORM_QUESTION_OPTION_SUCCESS"
export const GET_FORM_QUESTION_OPTION_FAILURE =
  "GET_FORM_QUESTION_OPTION_FAILURE"

export function getFormQuestionOption(optionId: number) {
  let endpoint = `/v1.0/options/${optionId}`
  return createApiAction({
    method: "GET",
    endpoint,
    types: [
      GET_FORM_QUESTION_OPTION_REQUEST,
      GET_FORM_QUESTION_OPTION_SUCCESS,
      GET_FORM_QUESTION_OPTION_FAILURE,
    ],
  })
}

export const POST_FORM_QUESTION_OPTION_REQUEST =
  "POST_FORM_QUESTION_OPTION_REQUEST"
export const POST_FORM_QUESTION_OPTION_SUCCESS =
  "POST_FORM_QUESTION_OPTION_SUCCESS"
export const POST_FORM_QUESTION_OPTION_FAILURE =
  "POST_FORM_QUESTION_OPTION_FAILURE"

export function postFormQuestionOption(
  questionOption: Pick<
    FormQuestionSelectOptionModel,
    "option" | "form_question_id"
  >
) {
  let endpoint = "/v1.0/options"
  return async (dispatch: ThunkDispatch<any, any, any>) => {
    let postResponse = (await dispatch(
      createApiAction({
        method: "POST",
        body: JSON.stringify(questionOption),
        endpoint,
        types: [
          POST_FORM_QUESTION_OPTION_REQUEST,
          POST_FORM_QUESTION_OPTION_SUCCESS,
          POST_FORM_QUESTION_OPTION_FAILURE,
        ],
      })
    )) as unknown as ApiAction
    if (!postResponse.error) {
      dispatch(getFormQuestion(questionOption.form_question_id))
    }
  }
}

export const PATCH_FORM_QUESTION_OPTION_REQUEST =
  "PATCH_FORM_QUESTION_OPTION_REQUEST"
export const PATCH_FORM_QUESTION_OPTION_SUCCESS =
  "PATCH_FORM_QUESTION_OPTION_SUCCESS"
export const PATCH_FORM_QUESTION_OPTION_FAILURE =
  "PATCH_FORM_QUESTION_OPTION_FAILURE"

export function patchFormQuestionOptions(
  questionId: number,
  questionOption: Partial<Pick<FormQuestionSelectOptionModel, "option">>
) {
  let endpoint = `/v1.0/questions/${questionId}`
  return createApiAction({
    method: "PATCH",
    body: JSON.stringify(questionOption),
    endpoint,
    types: [
      PATCH_FORM_QUESTION_OPTION_REQUEST,
      PATCH_FORM_QUESTION_OPTION_SUCCESS,
      PATCH_FORM_QUESTION_OPTION_FAILURE,
    ],
  })
}
