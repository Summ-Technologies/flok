import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    margin: '20px'
  }
});

export interface DestinationCardProps {
  destination: any
}
export default function DestinationCard(props: DestinationCardProps) {
  const classes = useStyles();

  return (
    <Grid item md={4}>
      <Card className={classes.root}>
        <CardContent> 
          {props.destination.city}
        </CardContent>
        <CardActions>
          <Button variant="contained" color="default">Select</Button>
        </CardActions>
      </Card>
    </Grid>
  );
}
