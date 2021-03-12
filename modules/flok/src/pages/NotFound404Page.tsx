import {Typography} from "@material-ui/core"
import PageBody from "../components/PageBody"

type NotFound404PageProps = {}

export default function NotFound404Page(props: NotFound404PageProps) {
  return (
    <PageBody>
      <Typography variant={"h3"}>
        The page you're looking for can't be found
      </Typography>
    </PageBody>
  )
}
