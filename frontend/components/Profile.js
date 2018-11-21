import React from 'react'
import PasswordUpdate from './PasswordUpdate';
import { Query } from "react-apollo";
import gql from "graphql-tag";

const Profile = () => (
    <Query
      query={gql`
        {
          me {
            name
          }
        }
      `}
    >
      {({ loading, error, data }) => {
        if (loading || error) return <p>Please Login</p>
  
        return <div>
            <p>Hi {data.me.name} 🙋‍ - btw, this data is provided by a secure graphql endpoint, providing data from Azure Graph API! 🔐</p>
            <PasswordUpdate></PasswordUpdate>
        </div>
      }}
    </Query>
);

export default Profile