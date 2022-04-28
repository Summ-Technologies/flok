import {makeStyles} from "@material-ui/core"
import {
  convertFromRaw,
  convertToRaw,
  EditorState,
  RawDraftContentState,
} from "draft-js"
import draftToHtml from "draftjs-to-html"
import {useState} from "react"
import {RouteComponentProps} from "react-router-dom"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import RetreatWebsiteHeader from "../components/retreat-website/RetreatWebsiteHeader"

type RetreatWebsiteProps = RouteComponentProps<{
  retreatName: string
  pageName?: string
}>

let useStyles = makeStyles((theme) => ({
  bannerImg: {
    width: "100%",
    maxHeight: "325px",
  },
  websiteBody: {
    width: "75%",
  },
}))

function RetreatWebsite(props: RetreatWebsiteProps) {
  let {retreatName, pageName} = props.match.params
  let classes = useStyles()
  let testSite = {
    header_image_link:
      "https://upload.wikimedia.org/wikipedia/commons/b/bb/Table_Rock_scenery_banner.jpg",
    company_logo_link:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Brex_logo_black.svg/1200px-Brex_logo_black.svg.png",
    pages: [
      {
        title: "Home",
        blocks: [
          {
            blocks: [
              {
                key: "9492t",
                text: "Brex Retreat 2022",
                type: "header-one",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: "5rk2",
                text: "September 21st - September 29th",
                type: "header-three",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: "3viqq",
                text: "First ever retreat join us here! ",
                type: "unstyled",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {
                  "text-align": "start",
                },
              },
              {
                key: "b93ui",
                text: "Resort Info",
                type: "header-two",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: "fc2en",
                text: "This is some resort info. Lorem ipsum dolor word bacon people something blah zebra fox jumps over the lazy dog In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.",
                type: "unstyled",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: "dqbd2",
                text: "Retreat Link ",
                type: "unstyled",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [
                  {
                    offset: 0,
                    length: 12,
                    key: 0,
                  },
                ],
                data: {},
              },
              {
                key: "1kjeg",
                text: "",
                type: "header-two",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: "fk4v9",
                text: "Packing List:",
                type: "header-two",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: "60bes",
                text: "Bathing Suit",
                type: "unordered-list-item",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: "9v3fi",
                text: "Toiletries",
                type: "unordered-list-item",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: "ppnk",
                text: "Sneakers",
                type: "unordered-list-item",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: "39c7j",
                text: "Workout clothes",
                type: "unordered-list-item",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: "3a7t8",
                text: "Laptop",
                type: "unordered-list-item",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
            ],
            entityMap: {
              "0": {
                type: "LINK",
                mutability: "MUTABLE",
                data: {
                  url: "http://www.google.com",
                  targetOption: "_blank",
                },
              },
            },
          },
        ],
      },
      {
        title: "FAQ",
        blocks: [
          {
            blocks: [
              {
                key: "9492t",
                text: "FAQ",
                type: "header-one",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: "5rk2",
                text: "September 21st - September 29th",
                type: "header-three",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: "3viqq",
                text: "First ever retreat join us here! ",
                type: "unstyled",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {
                  "text-align": "start",
                },
              },
              {
                key: "b93ui",
                text: "Resort Info",
                type: "header-two",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: "fc2en",
                text: "This is some resort info. Lorem ipsum dolor word bacon people something blah zebra fox jumps over the lazy dog",
                type: "unstyled",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: "dqbd2",
                text: "Retreat Link ",
                type: "unstyled",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [
                  {
                    offset: 0,
                    length: 12,
                    key: 0,
                  },
                ],
                data: {},
              },
              {
                key: "1kjeg",
                text: "",
                type: "header-two",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: "fk4v9",
                text: "Packing List:",
                type: "header-two",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: "60bes",
                text: "Bathing Suit",
                type: "unordered-list-item",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: "9v3fi",
                text: "Toiletries",
                type: "unordered-list-item",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: "ppnk",
                text: "Sneakers",
                type: "unordered-list-item",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: "39c7j",
                text: "Workout clothes",
                type: "unordered-list-item",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: "3a7t8",
                text: "Laptop",
                type: "unordered-list-item",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
            ],
            entityMap: {
              "0": {
                type: "LINK",
                mutability: "MUTABLE",
                data: {
                  url: "http://www.google.com",
                  targetOption: "_blank",
                },
              },
            },
          },
        ],
      },
    ],
  }

  let pages = testSite.pages

  // Have to handle page not found
  let page = pageName
    ? pages.find((page) => page.title.toLowerCase() === pageName?.toLowerCase())
    : pages[0]

  //Need Header
  // Header image
  // Body

  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(
      convertFromRaw(page!.blocks[0] as unknown as RawDraftContentState)
    )
  )

  return (
    <PageContainer>
      <PageBody>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
          <RetreatWebsiteHeader
            logo={testSite.company_logo_link}
            pages={testSite.pages.map((page) => page.title)}
            retreatName={retreatName}
            selectedPage={
              pageName ?? testSite.pages[0].title
            }></RetreatWebsiteHeader>
          <img
            src={testSite.header_image_link}
            className={classes.bannerImg}
            alt="Banner"></img>
          <div
            dangerouslySetInnerHTML={{
              __html: draftToHtml(
                convertToRaw(editorState.getCurrentContent())
              ),
            }}
            className={classes.websiteBody}></div>
        </div>
      </PageBody>
    </PageContainer>
  )
}
export default RetreatWebsite
