import {makeStyles} from "@material-ui/core"
import React from "react"
import Button from "@material-ui/core/Button"
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

let useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: '#fff',
    top: 'auto',
    bottom: 0,
    padding: '10px',
    borderRadius: '0px',
  }
}))

export type PageFloatingFooterProps = {
  cta: string
}
export default function PageFloatingFooter(props: PageFloatingFooterProps) {
  let classes = useStyles(props)
  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <Button variant="contained" color="primary">
          {props.cta}
        </Button>
      </Toolbar>
    </AppBar>
  )
}
