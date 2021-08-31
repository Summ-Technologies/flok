import { useState } from "react"
import { RouteComponentProps, withRouter } from "react-router-dom"
import PageBody from "../page/PageBody"
import PageContainer from "../page/PageContainer"
import PageFloatingFooter from "../page/PageFloatingFooter"
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, connectHits, Hits } from 'react-instantsearch-dom';
import { makeStyles, createStyles, Theme, GridList } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import DestinationCard from "./DestinationCard"

const searchClient = algoliasearch('0GNPYG0XAN', '1bfd529008a4c2c0945b629b44707593');

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(0.5),
      },
      "& li": {
        display: 'inline'
      },
    }
  }),
);

function destinationName(hit: any) {
  return (`${hit.city}, ${(hit.country == "US" ? hit.state : hit.country)}`);
}

type ChooseDestinationPageProps = RouteComponentProps<{}>
function ChooseDestinationPage(props: ChooseDestinationPageProps) {
  
  const Hit = ({hit} : { hit: any }) => (
    <DestinationCard destination={hit} />
  );

  const classes = useStyles();

  return (
    <>
      <PageContainer>
        <PageBody
          HeaderProps={{
            header: "Location",
            subheader: "You've taken the first step in planning your retreat!",
          }}>
          <InstantSearch searchClient={searchClient} indexName="destinations">
            <div className={classes.root}>
              <GridList cols={3}>
                <DestinationHits />
              </GridList>
            </div>
          </InstantSearch>
        </PageBody>
      </PageContainer>
      <PageFloatingFooter cta="Next Step" />
    </>
  )
}
export default withRouter(ChooseDestinationPage)

const DestinationHits = connectHits(({ hits }) => {
  const hs = hits.map(hit => <DestinationCard destination={hit} />);
  return <>{hs}</>;
});
