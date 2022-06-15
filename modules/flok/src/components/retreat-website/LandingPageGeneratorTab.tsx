import {Link, Tab} from "@material-ui/core"
import {Link as RouterLink} from "react-router-dom"
import {AppRoutes} from "../../Stack"
import {useAttendeeLandingPage} from "../../utils/retreatUtils"

type LandingPageGeneratorTabProps = {
  pageId: number
  value: number
  retreatIdx: number
}

function LandingPageGeneratorTab(props: LandingPageGeneratorTabProps) {
  let page = useAttendeeLandingPage(props.pageId)
  console.log(props.pageId)

  return (
    <Link
      // className={classes.pageTitleText}
      component={RouterLink}
      to={AppRoutes.getPath("LandingPageGeneratorPage", {
        retreatIdx: props.retreatIdx.toString(),
        currentPageId: props.pageId.toString(),
      })}>
      <Tab value={props.pageId} label={page?.title} />
    </Link>
  )
}
export default LandingPageGeneratorTab
