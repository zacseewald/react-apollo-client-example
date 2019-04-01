import React from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import './index.css';
import StarImg from '../../images/star.png';

const GET_REPOSITORIES_OF_ORGANIZATION = gql`
  {
    organization(login: "the-road-to-learn-react") {
      repositories(first: 20) {
        edges {
          node {
            id
            name
            url
            viewerHasStarred
            forkCount
            stargazers {
              totalCount
            }
          }
        }
      }
    }
  }
`;

const STAR_REPOSITORY = gql`
  mutation($id: ID!) {
    addStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;
// I created this mutation to update the database when a user clicks the button to remove a star
const UNSTAR_REPOSITORY = gql`
  mutation($id: ID!) {
    removeStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

const App = () => (
  <Query query={GET_REPOSITORIES_OF_ORGANIZATION}>
    {({ data: { organization }, loading }) => {
      if (loading || !organization) {
        return <div>Loading ...</div>;
      }
      return (
        <Repositories repositories={organization.repositories} />
      );
    }}
  </Query>
);

class Repositories extends React.Component {
  state = {
    selectedRepositoryIds: [],
  };

  toggleSelectRepository = (id, isSelected) => {
    let { selectedRepositoryIds } = this.state;

    selectedRepositoryIds = isSelected
      ? selectedRepositoryIds.filter(itemId => itemId !== id)
      : selectedRepositoryIds.concat(id);

    this.setState({ selectedRepositoryIds });
  };

  render() {
    return (
      
      <RepositoryList
        repositories={this.props.repositories}
        selectedRepositoryIds={this.state.selectedRepositoryIds}
        toggleSelectRepository={this.toggleSelectRepository}
      />
    );
  }
}

const RepositoryList = ({
  repositories,
  selectedRepositoryIds,
  toggleSelectRepository,
}) => (
  <ul className="ul-list">
    {repositories.edges.map(({ node }) => {
      const isSelected = selectedRepositoryIds.includes(node.id);

      const rowClassName = ['row'];

      if (isSelected) {
        rowClassName.push('row_selected');
      }

      return (
      
        <li className={rowClassName.join(' ')} key={node.id}>
          <Select
            id={node.id}
            isSelected={isSelected}
            toggleSelectRepository={toggleSelectRepository}
          />{' '} 
          <a 
            href={node.url} 
            // I added this so that when the user clicks the link it will open a new tap instead of navigating to the repo in the existing tab.
            target={ "_blank" }> {node.name} </a>  {' '}
          <Star id={node.id} starred={node.viewerHasStarred} />
          <div id="spacer"></div>
          <Forked  forked={node.forkCount} />
          <StarCount  stargazers={node.stargazers.totalCount} />
        </li>
      );
    })}
  </ul>
);
// This is to show how many times each repo has been forked
const Forked = ({ id, forked}) => (
  <div id="forked">FORKED: { forked }</div>
);
// This is to display the number of total stars
const StarCount = ({stargazers}) => (
<div id="starCount">{ stargazers } <img id="star-img" src={StarImg} /></div>
)
const Star = ({ id, starred }) => {
  // I added this if statement for toggleing the starred button. It checks if the user has starred the repo and executes the appropriate function. 
  if (starred) {
    return (
      // This runs in the case of the user unstarring a repo. It takes in the unstar mutation function  definned above and updates the database via apollo/graphQL. I have created a seperate mutation above to accomplush this.
      <Mutation mutation={UNSTAR_REPOSITORY} variables={{ id }}>
        {unStarRepository => (
          <button 
            id="btn-unstar" 
            type="button" 
            onClick={unStarRepository}
          >UnStar</button>
        )}
      </Mutation>
    );
  } else {
      return (
        // This mutation takes in the add star function and updates the database via apollo/graphQL.
      <Mutation mutation={STAR_REPOSITORY} variables={{ id }}>
        {starRepository => (
          <button 
            id="btn-star" 
            type="button" 
            onClick={starRepository}
          >Star</button>
        )}
      </Mutation>)
  }
};

const Select = ({ id, isSelected, toggleSelectRepository }) => (
  <button
    id="btn-select"
    type="button"
    onClick={() => toggleSelectRepository(id, isSelected)}
  >
    {isSelected ? 'Unselect' : 'Select'}
  </button>
);


export default App;

