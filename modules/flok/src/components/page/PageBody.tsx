import {makeStyles} from "@material-ui/core"
import clsx from "clsx"
import React, {PropsWithChildren} from "react"
import PageHeader, {PageHeaderProps} from "./PageHeader"

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    minWidth: 0, // flex box trick to max width 100%
    display: "flex",
    flexDirection: "column",
    paddingLeft: (props: PageBodyProps) =>
      props.noGutter ? 0 : theme.spacing(1),
    paddingRight: (props: PageBodyProps) =>
      props.noGutter ? 0 : theme.spacing(1),
    [theme.breakpoints.up("md")]: {
      paddingLeft: (props: PageBodyProps) =>
        props.noGutter ? 0 : theme.spacing(4),
      paddingRight: (props: PageBodyProps) =>
        props.noGutter ? 0 : theme.spacing(4),
    },
  },
  backgroundImage: {
    backgroundImage: (props: PageBodyProps) =>
      `url("${props.backgroundImage}")`,
    backgroundPosition: "center",
    backgroundSize: "cover",
  },
  body: {
    flex: 1,
  },
}))

type PageBodyProps = PropsWithChildren<{
  noGutter?: boolean
  HeaderProps?: PageHeaderProps
  backgroundImage?: string
}>
export default function PageBody(props: PageBodyProps) {
  const classes = useStyles(props)
  return (
    <div
      className={clsx(
        classes.root,
        props.backgroundImage ? classes.backgroundImage : undefined
      )}>
      {props.HeaderProps ? <PageHeader {...props.HeaderProps} /> : undefined}
      <div className={classes.body}>{props.children}</div>
    </div>
  )
}
