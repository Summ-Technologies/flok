import {Button} from "@material-ui/core"
import {OptionsObject, SnackbarKey} from "notistack"

export function apiNotification(
  message: string,
  onClose: (key: SnackbarKey) => void,
  error?: boolean
): {
  key?: SnackbarKey
  message: string
  options?: OptionsObject
  dismissed?: boolean
} {
  return {
    message: message,
    options: {
      action: (key) => (
        <Button color="inherit" onClick={() => onClose(key)}>
          Dismiss
        </Button>
      ),
      variant: error ? "error" : "success",
      persist: false,
      autoHideDuration: 3000,
    },
  }
}
export function replaceDashes(str: string) {
  let strArray = str.split("")
  strArray.forEach((char, i) => {
    if (char === "-") {
      strArray[i] = " "
    }
  })
  return strArray.join("")
}
