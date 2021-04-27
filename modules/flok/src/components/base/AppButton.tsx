import {Button, ButtonProps, makeStyles} from "@material-ui/core"
import React, {PropsWithChildren} from "react"

const useStyles = makeStyles((theme) => ({
  root: (props: AppButtonProps) => {
    return props.width !== undefined
      ? {
          width: props.width,
        }
      : {}
  },
}))

interface AppButtonProps extends ButtonProps {
  width?: string | number
}

export default function AppButton(props: PropsWithChildren<AppButtonProps>) {
  const classes = useStyles(props)
  return (
    <Button {...props} className={`${classes.root} ${props.className}`}>
      {props.children}
    </Button>
  )
}
