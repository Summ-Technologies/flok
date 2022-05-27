import {makeStyles} from "@material-ui/core"
import {RawDraftContentState} from "draft-js"
import draftToHtml from "draftjs-to-html"
import {useDispatch} from "react-redux"
import {RouteComponentProps} from "react-router-dom"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import RetreatWebsiteHeader from "../components/retreat-website/RetreatWebsiteHeader"
<<<<<<< HEAD
import {AppRoutes} from "../Stack"
=======
import {ResourceNotFound} from "../models"
import {AppRoutes} from "../Stack"
import {ImageUtils} from "../utils/imageUtils"
>>>>>>> andrew/landing-pages-fixes
import {
  useAttendeeLandingPageBlock,
  useAttendeeLandingPageName,
  useAttendeeLandingWebsiteName,
<<<<<<< HEAD
} from "../utils/retreatUtils"
=======
  useRetreat,
} from "../utils/retreatUtils"
import LoadingPage from "./misc/LoadingPage"
>>>>>>> andrew/landing-pages-fixes
import NotFound404Page from "./misc/NotFound404Page"

let useStyles = makeStyles((theme) => ({
  bannerImg: {
    width: "100%",
    maxHeight: "325px",
<<<<<<< HEAD
    objectFit: "cover",
=======
>>>>>>> andrew/landing-pages-fixes
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
<<<<<<< HEAD
  let classes = useStyles()
  let dispatch = useDispatch()
=======
  let dispatch = useDispatch()
  let classes = useStyles()
>>>>>>> andrew/landing-pages-fixes
  function replaceDashes(str: string) {
    let strArray = str.split("")
    strArray.forEach((char, i) => {
      if (char === "-") {
        strArray[i] = " "
      }
    })
    return strArray.join("")
  }
<<<<<<< HEAD
  // let [loading, setLoading] = useState(false)
  // useEffect(() => {
  //   setLoading(true)
  //   dispatch(getWebsiteByName(replaceDashes(retreatName)))
  // }, [])
  let website = useAttendeeLandingWebsiteName(replaceDashes(retreatName))
  let page = useAttendeeLandingPageName(
    website?.id ?? 0,
    replaceDashes(pageName ?? "home")
  )
  return !page || !website ? (
=======
  let [website, websiteLoading] = useAttendeeLandingWebsiteName(
    replaceDashes(retreatName)
  )
  let [page, pageLoading] = useAttendeeLandingPageName(
    website?.id ?? 0,
    replaceDashes(pageName ?? "home")
  )
  let [retreat, retreatLoading] = useRetreat(website?.retreat_id ?? -1)
  const titleTag = document.getElementById("titleTag")
  titleTag!.innerHTML = `${website?.name} | ${page?.title}`
  return websiteLoading || pageLoading || retreatLoading ? (
    <LoadingPage />
  ) : !page || !website || !retreat || retreat === ResourceNotFound ? (
>>>>>>> andrew/landing-pages-fixes
    <NotFound404Page />
  ) : (
    <PageContainer>
      <PageBody>
        <div className={classes.overallPage}>
          <RetreatWebsiteHeader
            logo={
<<<<<<< HEAD
              website.logo_image?.image_url ??
              "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Brex_logo_black.svg/1200px-Brex_logo_black.svg.png"
=======
              website.company_logo_img ??
              ImageUtils.getImageUrl("logoIconTextTrans")
>>>>>>> andrew/landing-pages-fixes
            }
            pageIds={website.page_ids}
            retreatName={retreatName}
            homeRoute={AppRoutes.getPath("RetreatWebsiteHome", {
              retreatName: retreatName,
            })}
<<<<<<< HEAD
            selectedPage={pageName ?? "home"}></RetreatWebsiteHeader>
          <img
            src={
              website.banner_image?.image_url ??
=======
            selectedPage={pageName ?? "home"}
            registrationLink={
              retreat.attendees_registration_form_link
            }></RetreatWebsiteHeader>
          <img
            src={
              website.banner_img ??
>>>>>>> andrew/landing-pages-fixes
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
