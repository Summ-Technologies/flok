export enum FormCreationTypeEnum {
  ATTENDEE_REGISTRATION = "ATTENDEE_REGISTRATION",
}

export type FormCreationType = `${FormCreationTypeEnum}`

export type FormModel = {
  id: number
  title: string
  description?: string
  questions: number[]
}

export enum FormQuestionTypeEnum {
  SHORT_ANSWER = "SHORT_ANSWER",
  LONG_ANSWER = "LONG_ANSWER",
  SINGLE_SELECT = "SINGLE_SELECT",
  MULTI_SELECT = "MULTI_SELECT",
  DATETIME = "DATETIME",
  DATE = "DATE",
}
export const FormQuestionTypeName = {
  [FormQuestionTypeEnum.SHORT_ANSWER]: "Short answer",
  [FormQuestionTypeEnum.LONG_ANSWER]: "Long answer",
  [FormQuestionTypeEnum.SINGLE_SELECT]: "Single select",
  [FormQuestionTypeEnum.MULTI_SELECT]: "Multi select",
  [FormQuestionTypeEnum.DATETIME]: "Date & time",
  [FormQuestionTypeEnum.DATE]: "Date",
}
export type FormQuestionType = `${FormQuestionTypeEnum}`
export const FormQuestionTypeValues: FormQuestionType[] =
  Object.values(FormQuestionTypeEnum)

export type FormQuestionModel = {
  id: number
  form_id: number
  title: string
  description?: string
  type: FormQuestionType
  required?: boolean
  select_allow_user_input?: boolean
  select_options: number[]
}

export type FormQuestionSelectOptionModel = {
  option: string
  id: number
  form_question_id: number
}
