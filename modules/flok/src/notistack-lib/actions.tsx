import {OptionsObject, SnackbarKey} from "notistack"

export const ENQUEUE_SNACKBAR = "ENQUEUE_SNACKBAR"
export const CLOSE_SNACKBAR = "CLOSE_SNACKBAR"
export const REMOVE_SNACKBAR = "REMOVE_SNACKBAR"

export function enqueueSnackbar(notification: {
  key?: SnackbarKey
  message: string
  options?: OptionsObject
  dismissed?: boolean
}) {
  const key = notification.options && notification.options.key
  return {
    type: ENQUEUE_SNACKBAR,
    notification: {
      ...notification,
      key: key || new Date().getTime() + Math.random(),
    },
  }
}

export function closeSnackbar(key?: SnackbarKey): {
  type: string
  dismissAll: boolean
  key?: SnackbarKey
} {
  return {
    type: CLOSE_SNACKBAR,
    dismissAll: !key, // dismiss all if no key has been defined
    key,
  }
}

export function removeSnackbar(key: SnackbarKey): {
  type: string
  key: SnackbarKey
} {
  return {
    type: REMOVE_SNACKBAR,
    key,
  }
}
