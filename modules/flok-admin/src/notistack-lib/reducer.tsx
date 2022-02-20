import {OptionsObject, SnackbarKey} from "notistack"
import {CLOSE_SNACKBAR, ENQUEUE_SNACKBAR, REMOVE_SNACKBAR} from "./actions"

type NotificationType = {
  key: SnackbarKey
  message: string
  options: OptionsObject
  dismissed?: boolean
}

type NotistackState = {
  notifications: NotificationType[]
}
const defaultState: NotistackState = {
  notifications: [],
}

export type DefaultNotistackState = {
  notistack: NotistackState
}

export default function NotistackReducer(state = defaultState, action: any) {
  if ((action.type as string).endsWith("_FAILURE")) {
    return {
      ...state,
      notifications: [
        ...state.notifications,
        {
          key: new Date().getTime() + Math.random(),
          message: "Oops! Something went wrong.",
          options: {variant: "error"},
        },
      ],
    }
  }
  switch (action.type) {
    case ENQUEUE_SNACKBAR:
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            key: action.key,
            ...action.notification,
          },
        ],
      }

    case CLOSE_SNACKBAR:
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          action.dismissAll || notification.key === action.key
            ? {...notification, dismissed: true}
            : {...notification}
        ),
      }

    case REMOVE_SNACKBAR:
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.key !== action.key
        ),
      }

    default:
      return state
  }
}
