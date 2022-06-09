import {RouteComponentProps} from "react-router-dom"
import RetreatWebsiteHeader from "../components/retreat-website/RetreatWebsiteHeader"
import {AppRoutes} from "../Stack"
import {useAttendeeLandingWebsiteName} from "../utils/retreatUtils"

type AttendeeWebsiteFormPageProps = RouteComponentProps<{
  retreatName: string
}>
function AttendeeWebsiteFormPage(props: AttendeeWebsiteFormPageProps) {
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
    </div>
  )
}
export default AttendeeWebsiteFormPage
