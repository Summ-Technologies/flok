import {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps} from "react-router-dom"
import RetreatWebsiteHeader from "../components/retreat-website/RetreatWebsiteHeader"
import {replaceDashes} from "../notistack-lib/utils"
import {AppRoutes} from "../Stack"
import {RootState} from "../store"
import {getUserHome} from "../store/actions/user"
import {ImageUtils} from "../utils/imageUtils"
import {useAttendeeLandingWebsiteName} from "../utils/retreatUtils"
import RedirectPage from "./misc/RedirectPage"

type AttendeeWebsiteFormPageProps = RouteComponentProps<{
  retreatName: string
}>
function AttendeeWebsiteFormPage(props: AttendeeWebsiteFormPageProps) {
  let dispatch = useDispatch()
  let {retreatName} = props.match.params
  let [website] = useAttendeeLandingWebsiteName(replaceDashes(retreatName))
  let user = useSelector((state: RootState) => state.user)
  useEffect(() => {
    dispatch(getUserHome())
  }, [dispatch])
  if (user.loginStatus === "LOGGED_OUT" && website) {
    return (
      <RedirectPage
        pageName="AttendeeSignUpPage"
        pathParams={{retreatName: website.name}}
      />
    )
  }
  return (
    <div>
      {website && (
        <RetreatWebsiteHeader
          logo={
            website.logo_image?.image_url ??
            ImageUtils.getImageUrl("logoIconTextTrans")
          }
          pageIds={website.page_ids}
          retreatName={retreatName}
          homeRoute={AppRoutes.getPath("RetreatWebsiteHome", {
            retreatName: retreatName,
          })}
          selectedPage={"form-page"}></RetreatWebsiteHeader>
      )}
      user id = {user.user?.id}
    </div>
  )
}
export default AttendeeWebsiteFormPage
