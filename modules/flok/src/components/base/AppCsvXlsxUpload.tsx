import {Button} from "@material-ui/core"
import Papa from "papaparse"
import * as XLSX from "xlsx"
import AppMoreInfoIcon from "./AppMoreInfoIcon"
type AppCsvXlsxUploadProps = {
  onUpload: (data: string[][]) => void
}
function AppCsvXlsxUpload(props: AppCsvXlsxUploadProps) {
  function handleCsvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    // @ts-ignore
    Papa.parse(e.target.files[0], {
      complete: function (results) {
        props.onUpload(results.data as unknown as string[][])
      },
    })
  }
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    var files = e.target.files
    if (files) {
      let f = files[0]
      var reader = new FileReader()
      reader.onload = function (e) {
        var data = e!.target!.result
        let readedData = XLSX.read(data, {type: "binary"})
        const wsname = readedData.SheetNames[0]
        const ws = readedData.Sheets[wsname]

        /* Convert array to json*/
        const dataParse = XLSX.utils.sheet_to_json(ws, {header: 1})
        props.onUpload(dataParse as unknown as string[][])
      }
      reader.readAsBinaryString(f)
    }
  }
  return (
    <Button component="label">
      Batch Upload
      <input
        type="file"
        accept=".xlsx, .csv"
        hidden
        onChange={(e) => {
          // @ts-ignore
          if (e.target.files[0].type === "text/csv") {
            handleCsvUpload(e)
          } else {
            handleUpload(e)
          }
        }}></input>
      <AppMoreInfoIcon tooltipText="Accepts CSV and XLSX files" />
    </Button>
  )
}
export default AppCsvXlsxUpload
