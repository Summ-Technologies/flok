import {Typography} from "@material-ui/core"
import PageBody from "../../components/page/PageBody"
import PageSidenav from "../../components/page/PageSidenav"

type NotFound404PageProps = {}

export default function NotFound404Page(props: NotFound404PageProps) {
  return (
    <PageBody sideNav={<PageSidenav />}>
      <Typography variant={"h3"}>
        The page you're looking for can't be found
      </Typography>
    </PageBody>
  )
}
