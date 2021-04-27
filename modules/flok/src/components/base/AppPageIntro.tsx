import {Box, BoxProps, makeStyles, Typography} from "@material-ui/core"
import clsx from "clsx"

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *:not(:last-child)": {
      marginBottom: theme.spacing(1),
    },
  },
}))

interface AppPageIntroProps extends BoxProps {
  title: string
  body: string
}

export default function AppPageIntro(props: AppPageIntroProps) {
  let classes = useStyles()
  let {title, body, ...boxProps} = props
  return (
    <Box
      width="100%"
      py={1}
      {...boxProps}
      className={clsx(classes.root, boxProps.className)}>
      <Typography variant="h2">{props.title}</Typography>
      <Typography variant="body1">{props.body}</Typography>
    </Box>
  )
}
