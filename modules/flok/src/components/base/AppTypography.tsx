import {makeStyles, Typography, TypographyProps} from "@material-ui/core"
import clsx from "clsx"

let useStyles = makeStyles((theme) => ({
  root: {
    textDecoration: (props: AppTypographyProps) =>
      props.underline ? "underline" : undefined,
    fontWeight: (props: AppTypographyProps) =>
      props.bold ? theme.typography.fontWeightMedium : undefined,
    fontStyle: (props: AppTypographyProps) =>
      props.italic ? "italic" : undefined,
  },
}))

interface AppTypographyProps extends TypographyProps {
  bold?: boolean
  italic?: boolean
  underline?: boolean
}

export default function AppTypography(props: AppTypographyProps) {
  let classes = useStyles(props)
  let {bold, italic, underline, children, ...otherProps} = props
  return (
    <Typography
      {...otherProps}
      className={clsx(classes.root, otherProps.className)}>
      {props.children}
    </Typography>
  )
}
