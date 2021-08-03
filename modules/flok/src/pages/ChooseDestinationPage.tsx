import { useState } from "react"
import { RouteComponentProps, withRouter } from "react-router-dom"
import PageBody from "../components/page/PageBody"
import PageContainer from "../components/page/PageContainer"
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-dom';
import { Chip, makeStyles, createStyles, Theme } from '@material-ui/core';
import AddCircle from '@material-ui/icons/AddCircle';

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
  const [destinations, setDestinations] = useState<string[]>([]);
  const destinationClick = (city: string) => {
    if (!destinations.includes(city)) {
      setDestinations(destinations => [...destinations, city]);
    }
  };
  
  const Hit = ({hit} : { hit: any }) => (
    <Chip
      key={hit.objectID}
      icon={<AddCircle />}
      label={destinationName(hit)}
      onClick={() => {
        if (!destinations.includes(destinationName(hit))) {
          setDestinations(destinations => [...destinations, destinationName(hit)]);
        }
      }}
    />
  );

  const classes = useStyles();

  return (
    <PageContainer>
      <PageBody
        HeaderProps={{
          header: "You've taken the first step in planning your retreat!",
        }}>
        <InstantSearch searchClient={searchClient} indexName="destinations">
          <SearchBox />
          <div className={classes.root}>
            {destinations.map((city) => {
              return (<Chip
                label={city}
              />)
            })}
            <Hits hitComponent={Hit} />
          </div>
        </InstantSearch>
      </PageBody>
    </PageContainer>
  )
}
export default withRouter(ChooseDestinationPage)