import {Button} from "@material-ui/core"
import WYSIWYGBlockEditor from "./WYSIWYGBlockEditor"

type LandingPageEditFormProps = {
  page: {
    title: string
    id: number
    blocks: {content: any; type: string; id: number}[]
  }
  blocks: any
  setBlocks: any
}

function LandingPageEditForm(props: LandingPageEditFormProps) {
  let {page, setBlocks, blocks} = props
  console.log(blocks)

  let testContent = {
    blocks: [
      {
        key: "9492t",
        text: "asdfa",
        type: "header-one",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
    ],
    entityMap: {},
  }

  let testContent2 = {
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
  }

  return (
    <div>
      {!blocks.filter((block: any) => block.page_id === page.id).length && (
        <Button
          onClick={() =>
            setBlocks([
              ...blocks,
              {
                content: undefined,
                type: "WYSIWYG",
                id: 0,
                page_id: page.id,
              },
            ])
          }>
          Add Block
        </Button>
      )}
      {blocks
        .filter((block: any) => block.page_id === page.id)
        .map((block: any) => {
          return (
            <WYSIWYGBlockEditor
              block={block}
              setBlocks={setBlocks}
              blocks={blocks}
            />
          )
        })}
    </div>
  )
}
export default LandingPageEditForm
