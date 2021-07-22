import {Avatar, makeStyles} from "@material-ui/core"
import React, {PropsWithChildren} from "react"

let useStyles = makeStyles((theme) => ({
  root: {
    width: (props: AppAvatarProps) =>
      props.size === "md" || props.size === undefined
        ? 32
        : props.size === "sm"
        ? 24
        : props.size === "lg"
        ? 48
        : props.size,
    height: (props: AppAvatarProps) =>
      props.size === "md" || props.size === undefined
        ? 32
        : props.size === "sm"
        ? 24
        : props.size === "lg"
        ? 48
        : props.size,
    backgroundColor: (props: AppAvatarProps) =>
      props.color === "primary"
        ? theme.palette.primary.main
        : props.color === "success"
        ? theme.palette.success.main
        : props.color === "warning"
        ? theme.palette.warning.main
        : props.color === "error"
        ? theme.palette.error.main
        : "inherit",
    color: (props: AppAvatarProps) =>
      props.color === "primary"
        ? theme.palette.common.white
        : props.color === "success"
        ? theme.palette.common.white
        : props.color === "warning"
        ? theme.palette.common.white
        : props.color === "error"
        ? theme.palette.common.white
        : "unset",
    border: (props: AppAvatarProps) =>
      `${
        props.borderColor === "primary"
          ? theme.palette.primary.main
          : props.borderColor === "grey"
          ? theme.palette.grey[200]
          : "rgba(0, 0, 0, 0)"
      } 2px solid`,
  },
}))

type AppAvatarProps = PropsWithChildren<{
  size?: "sm" | "md" | "lg" | number
  color?: "primary" | "success" | "warning" | "error"
  borderColor?: "primary" | "grey"
}>
export default function AppAvatar(props: AppAvatarProps) {
  let classes = useStyles(props)
  return (
    <Avatar className={classes.root}>
      {props.children ? props.children : <>&nbsp;</>}
    </Avatar>
  )
}
