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
  config: boolean
}

function LandingPageEditForm(props: LandingPageEditFormProps) {
  let {page, setBlocks, blocks} = props
  console.log(blocks)

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
              config={props.config}
            />
          )
        })}
    </div>
  )
}
export default LandingPageEditForm
