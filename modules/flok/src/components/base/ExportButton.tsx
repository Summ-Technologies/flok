import {Button, makeStyles} from "@material-ui/core"
// Export Button is a button to export table data to CSV
function ExportButton(props: {rows: {item: {}}[]; fileName: string}) {
  let {rows, fileName} = props

  let useStyles = makeStyles((theme) => ({
    downloadButtonLink: {
      textDecoration: "none",
    },
    downloadButton: {
      marginLeft: theme.spacing(2),
    },
  }))
  let classes = useStyles()

  let encodedUri
  if (rows[0]) {
    let table = rows.map((e) => Object.values(e.item).join(","))
    table.unshift(Object.keys(rows[0].item).join(","))
    let csvContent = "data:text/csv;charset=utf-8," + table.join("\n")

    encodedUri = encodeURI(csvContent)
  }
  return (
    <a
      href={encodedUri}
      download={`${fileName}.csv`}
      className={classes.downloadButtonLink}>
      <Button
        variant="contained"
        color="primary"
        size="small"
        className={classes.downloadButton}>
        Export to CSV
      </Button>
    </a>
  )
}
export default ExportButton
