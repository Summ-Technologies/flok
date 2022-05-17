import {makeStyles} from "@material-ui/core"
import {RawDraftContentState} from "draft-js"
import draftToHtml from "draftjs-to-html"
import {RouteComponentProps} from "react-router-dom"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import RetreatWebsiteHeader from "../components/retreat-website/RetreatWebsiteHeader"
import {AppRoutes} from "../Stack"
import {
  useAttendeeLandingPageBlock,
  useAttendeeLandingPageName,
  useAttendeeLandingWebsiteName,
} from "../utils/retreatUtils"
import NotFound404Page from "./misc/NotFound404Page"

let useStyles = makeStyles((theme) => ({
  bannerImg: {
    width: "100%",
    maxHeight: "325px",
    [theme.breakpoints.down("sm")]: {
      minHeight: "130px",
      objectFit: "cover",
    },
  },
  websiteBody: {
    width: "75%",
    "& > *:not(:first-child)": {
      margin: "1em 0",
    },
    "& > *:not(:first-child) > *:not(:first-child)": {
      margin: "1em 0",
    },
  },
  overallPage: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}))
type RetreatWebsiteProps = RouteComponentProps<{
  retreatName: string
  pageName?: string
}>

function RetreatWebsite(props: RetreatWebsiteProps) {
  let {retreatName, pageName} = props.match.params
  let classes = useStyles()
  function replaceDashes(str: string) {
    let strArray = str.split("")
    strArray.forEach((char, i) => {
      if (char === "-") {
        strArray[i] = " "
      }
    })
    return strArray.join("")
  }
  let website = useAttendeeLandingWebsiteName(replaceDashes(retreatName))
  let page = useAttendeeLandingPageName(
    website?.id ?? 0,
    replaceDashes(pageName ?? "home")
  )
  return !page || !website ? (
    <NotFound404Page />
  ) : (
    <PageContainer>
      <PageBody>
        <div className={classes.overallPage}>
          <RetreatWebsiteHeader
            logo={
              website.company_logo_img ??
              "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Brex_logo_black.svg/1200px-Brex_logo_black.svg.png"
            }
            pageIds={website.page_ids}
            retreatName={retreatName}
            homeRoute={AppRoutes.getPath("RetreatWebsiteHome", {
              retreatName: retreatName,
            })}
            selectedPage={pageName ?? "home"}></RetreatWebsiteHeader>
          <img
            src={
              website.banner_img ??
              "https://upload.wikimedia.org/wikipedia/commons/b/bb/Table_Rock_scenery_banner.jpg"
            }
            className={classes.bannerImg}
            alt="Banner"></img>
          {page?.block_ids[0] && (
            <WYSIWYGBlockRenderer blockId={page.block_ids[0]} />
          )}
        </div>
      </PageBody>
    </PageContainer>
  )
}

export default RetreatWebsite

let useBlockRendererStyles = makeStyles((theme) => ({
  websiteBody: {
    width: "75%",
    "& > *:not(:first-child)": {
      margin: "1em 0",
    },
    "& > *:not(:first-child) > *:not(:first-child)": {
      margin: "1em 0",
    },
  },
}))

type WYSIWYGBlockRendererProps = {
  blockId: number
}
function WYSIWYGBlockRenderer(props: WYSIWYGBlockRendererProps) {
  let block = useAttendeeLandingPageBlock(props.blockId)
  let classes = useBlockRendererStyles()
  return block?.content ? (
    <div
      dangerouslySetInnerHTML={{
        __html: draftToHtml(block!.content as unknown as RawDraftContentState),
      }}
      className={classes.websiteBody}></div>
  ) : (
    <></>
  )
}
