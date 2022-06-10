import {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {RouteComponentProps} from "react-router-dom"
import RetreatWebsiteHeader from "../components/retreat-website/RetreatWebsiteHeader"
import {AppRoutes} from "../Stack"
import {RootState} from "../store"
import {getUserHome} from "../store/actions/user"
import {useAttendeeLandingWebsiteName} from "../utils/retreatUtils"
import RedirectPage from "./misc/RedirectPage"

type AttendeeWebsiteFormPageProps = RouteComponentProps<{
  retreatName: string
}>
function AttendeeWebsiteFormPage(props: AttendeeWebsiteFormPageProps) {
  let dispatch = useDispatch()
  function replaceDashes(str: string) {
    let strArray = str.split("")
    strArray.forEach((char, i) => {
      if (char === "-") {
        strArray[i] = " "
      }
    })
    return strArray.join("")
  }
  let {retreatName} = props.match.params
  let website = useAttendeeLandingWebsiteName(replaceDashes(retreatName))
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
            website.company_logo_img ??
            "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Brex_logo_black.svg/1200px-Brex_logo_black.svg.png"
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
