import {makeStyles} from "@material-ui/core"
import clsx from "clsx"
import {PropsWithChildren} from "react"
import AppTypography from "../base/AppTypography"

type PageFooterProps = PropsWithChildren<{
  right?: boolean
}>

let useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    bottom: 0,
  },
  leftPos: {
    left: 0,
  },
  rightPos: {
    right: 0,
  },
}))

export default function PageFooter(props: PageFooterProps) {
  let classes = useStyles(props)

  let content =
    props.children instanceof String ? (
      <AppTypography variant="h2" fontWeight="bold">
        {props.children}
      </AppTypography>
    ) : (
      props.children
    )
  return (
    <div
      className={clsx(
        classes.root,
        props.right ? classes.rightPos : classes.leftPos
      )}>
      {content}
    </div>
  )
}
