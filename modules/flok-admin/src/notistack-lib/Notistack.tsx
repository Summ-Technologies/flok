import {SnackbarKey, useSnackbar} from "notistack"
import {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {removeSnackbar} from "./actions"
import {DefaultNotistackState} from "./reducer"

let displayed: SnackbarKey[] = []

export default function Notistack() {
  const dispatch = useDispatch()
  const notifications = useSelector(
    (store: DefaultNotistackState) => store.notistack.notifications || []
  )
  const {enqueueSnackbar, closeSnackbar} = useSnackbar()

  const storeDisplayed = (id: SnackbarKey) => {
    displayed = [...displayed, id]
  }

  const removeDisplayed = (id: SnackbarKey) => {
    displayed = [...displayed.filter((key) => id !== key)]
  }

  useEffect(() => {
    notifications.forEach((notification) => {
      if (notification.dismissed) {
        // dismiss snackbar using notistack
        closeSnackbar(notification.key)
        return
      }

      // do nothing if snackbar is already displayed
      if (displayed.includes(notification.key)) return

      // display snackbar using notistack
      enqueueSnackbar(notification.message, {
        key: notification.key,
        ...notification.options,
        onExited: (event, myKey) => {
          // remove this snackbar from redux store
          dispatch(removeSnackbar(myKey as string))
          removeDisplayed(myKey)
        },
      })

      // keep track of snackbars that we've displayed
      storeDisplayed(notification.key)
    })
  }, [notifications, closeSnackbar, enqueueSnackbar, dispatch])

  return null
}
