import {Button, Typography} from "@material-ui/core"
import {
  convertFromRaw,
  convertToRaw,
  EditorState,
  RawDraftContentState,
} from "draft-js"
import draftToHtml from "draftjs-to-html"
import {useState} from "react"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"

function RetreatWebsite() {
  let testSite = {
    header_image_link:
      "https://upload.wikimedia.org/wikipedia/commons/b/bb/Table_Rock_scenery_banner.jpg",
    pages: [
      {
        title: "home",
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

  let page = testSite.pages[0]
  //Need Header
  // Header image
  // Body

  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(
      convertFromRaw(
        testSite.pages[0].blocks[0] as unknown as RawDraftContentState
      )
    )
  )

  return (
    <PageContainer>
      <PageBody>
        <div style={{display: "flex", flexDirection: "column"}}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "20px",
            }}>
            <Typography variant="h1">Logo</Typography>
            <div>
              Home {"   "}FAQ {"   "} About{" "}
            </div>
            <Button color="primary" variant="contained">
              Register Now
            </Button>
          </div>
          <img src={testSite.header_image_link} style={{width: "100%"}}></img>
          <div
            dangerouslySetInnerHTML={{
              __html: draftToHtml(
                convertToRaw(editorState.getCurrentContent())
              ),
            }}
            style={{marginLeft: "30px"}}></div>
          {/* EditorState.createWithContent(convertFromRaw(JSON.parse(testcontent))) */}
        </div>
      </PageBody>
    </PageContainer>
  )
}
export default RetreatWebsite
