import {Typography} from "@material-ui/core"
import PageContainer from "../../components/page/PageContainer"
import PageSidenav from "../../components/page/PageSidenav"

type NotFound404PageProps = {}

export default function NotFound404Page(props: NotFound404PageProps) {
  return (
    <PageContainer>
      <PageSidenav />
      <Typography variant={"h3"}>
        The page you're looking for can't be found
      </Typography>
    </PageContainer>
  )
}
