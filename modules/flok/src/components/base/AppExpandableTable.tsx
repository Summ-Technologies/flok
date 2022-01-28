import {
  IconButton,
  makeStyles,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core"
import Table from "@material-ui/core/Table"
import {SwapVert} from "@material-ui/icons"
import React, {useState} from "react"
import AppTypography from "./AppTypography"

type ExpandableRowProps = {
  cols: (JSX.Element | String)[]
  body: JSX.Element
}

const useExpandableRowStyles = makeStyles({
  mainRow: {
    "& > *": {
      borderBottom: "unset",
    },
    "& > :first-child": {
      borderRadius: "10px 0 0 10px",
    },
    "& > :last-child": {
      borderRadius: "0 10px 10px 0",
    },
  },
  expandRow: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  expandCell: {
    padding: "10px 0 0 0",
    // borderRadius: "0 0 10px 10px",
  },
  expandBody: {
    background: "#E2E5EC",
    // borderRadius: "0 0 10px 10px",
  },
})

function ExpandableRow(props: ExpandableRowProps) {
  let classes = useExpandableRowStyles()
  let [open, setOpen] = useState(false)
  return (
    <React.Fragment>
      <TableRow className={classes.mainRow}>
        {props.cols.map((c) => (
          <TableCell>
            {c instanceof String ? <AppTypography>{c}</AppTypography> : c}
          </TableCell>
        ))}
        {/* <TableCell>
          <IconButton onClick={() => setOpen(!open)}>
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </TableCell> */}
      </TableRow>
      {/* <TableRow className={classes.expandRow}>
        <TableCell
          className={classes.expandCell}
          colSpan={props.cols.length + 1}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <div className={classes.expandBody}>{props.body}</div>
          </Collapse>
        </TableCell>
      </TableRow> */}
    </React.Fragment>
  )
}

const useTableStyles = makeStyles({
  root: {
    padding: 16,
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 16px",
  },
  body: {
    background: "#FFF",
    // "& > :first-child": {
    //   "& > :first-child": {
    //     borderRadius: "10px 0 0 0",
    //   },
    //   "& > :last-child": {
    //     borderRadius: "0 10px 0 0",
    //   },
    // },
    // "& > :last-child": {
    //   "& > :first-child": {
    //     borderRadius: "0 0 10px 10px",
    //     borderBottom: "unset",
    //   },
    // },
  },
  header: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  headerCell: {
    display: "flex",
    alignItems: "center",
  },
})

type AppExpandableTableProps = {
  headers: Array<{
    name: string
    comparator?: (r1: string[], r2: string[]) => number
  }>
  rows: string[][]
}

export default function AppExpandableTable(props: AppExpandableTableProps) {
  let classes = useTableStyles()

  let [order, setOrder] = useState<"asc" | "desc">("desc")
  let [orderBy, setOrderBy] = useState<String>("")

  const handleSortClick = (headerName: String) => {
    if (orderBy === headerName) {
      setOrder(order === "asc" ? "desc" : "asc")
    } else {
      setOrderBy(headerName)
      setOrder("desc")
    }
  }

  const getComparator = () => {
    let headerObj = props.headers.filter((h) => h.name === orderBy)[0]
    let fn = (r1: string[], r2: string[]) => r1[0].localeCompare(r2[0])

    if (headerObj === undefined) {
      return fn
    }

    if (headerObj.comparator) {
      fn = headerObj.comparator
    }
    if (order === "asc") {
      return (r1: string[], r2: string[]) => fn(r1, r2) * -1
    }

    return fn
  }

  return (
    <TableContainer>
      <Table className={classes.root}>
        <TableHead>
          <TableRow className={classes.header}>
            {props.headers.map((h) => (
              <TableCell>
                <div className={classes.headerCell}>
                  <AppTypography variant="h3">{h.name}</AppTypography>
                  {h.comparator ? (
                    <IconButton onClick={() => handleSortClick(h.name)}>
                      <SwapVert />
                    </IconButton>
                  ) : (
                    <></>
                  )}
                </div>
              </TableCell>
            ))}
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody className={classes.body}>
          {props.rows
            .slice()
            .sort(getComparator())
            .map((data) => (
              <ExpandableRow cols={data} body={<></>} />
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
