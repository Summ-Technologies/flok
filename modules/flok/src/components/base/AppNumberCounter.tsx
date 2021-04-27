import {Box, IconButton, makeStyles, Typography} from "@material-ui/core"
import {AddBoxOutlined, IndeterminateCheckBoxOutlined} from "@material-ui/icons"

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "nowrap",
    "& > *:not(:last-child)": {
      marginRight: theme.spacing(1),
    },
  },
}))

type AppNumberCounterProps = {
  count: number
  onUpdateCount?: (newCount: number) => void
  max?: number
  min?: number
}
export default function AppNumberCounter(props: AppNumberCounterProps) {
  let classes = useStyles()
  return (
    <Box className={classes.root}>
      <IconButton
        size="small"
        onClick={() => {
          if (props.onUpdateCount) props.onUpdateCount(props.count - 1)
        }}
        disabled={
          !props.onUpdateCount ||
          (props.min !== undefined && props.count <= props.min)
        }>
        <IndeterminateCheckBoxOutlined />
      </IconButton>
      <Typography variant="body1">{props.count}</Typography>
      <IconButton
        size="small"
        onClick={() => {
          if (props.onUpdateCount) props.onUpdateCount(props.count + 1)
        }}
        disabled={
          props.onUpdateCount === undefined ||
          (props.max !== undefined && props.count >= props.max)
        }>
        <AddBoxOutlined />
      </IconButton>
    </Box>
  )
}
