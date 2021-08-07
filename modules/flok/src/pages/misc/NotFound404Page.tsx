import {makeStyles, Typography} from "@material-ui/core"
import PageContainer from "../../components/page/PageContainer"

let useStyles = makeStyles((theme) => ({
  body: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "baseline",
    "& > *:nth-child(2)": {
      borderLeft: `solid 2px ${theme.palette.text.primary}`,
      marginLeft: theme.spacing(2),
      paddingLeft: theme.spacing(2),
    },
  },
}))

type NotFound404PageProps = {}

export default function NotFound404Page(props: NotFound404PageProps) {
  let classes = useStyles(props)
  return (
    <PageContainer>
      <div className={classes.body}>
        <Typography variant={"h1"}>404</Typography>
        <Typography variant={"h3"}>
          The page you're looking for can't be found
        </Typography>
      </div>
    </PageContainer>
  )
}
