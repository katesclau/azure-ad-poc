import React from 'react'
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

const UPDATE_PASSWORD = gql`
  mutation UpdatePassword($input: UpdatePasswordInput!) {
    updatePassword(input: $input) {
      name
      email
      oid
    }
  }
`;

const PasswordUpdate = () => {
    let currentPassword, newPassword;
  
    return (
      <Mutation mutation={UPDATE_PASSWORD}>
        {(updatePassword, { data }) => (
          <div>
            <form
              onSubmit={e => {
                e.preventDefault();
                updatePassword({ variables: { input: { currentPassword: currentPassword.value, newPassword: newPassword.value } } });
              }}
            >
                <label>Current password:
                    <input ref={node => { currentPassword = node }} type="password" />
                </label>
                <br />
                <label>New password:
                    <input ref={node => { newPassword = node }} type="password" />
                </label>
                <button type="submit">Update Password</button>
            </form>
          </div>
        )}
      </Mutation>
    );
};

export default PasswordUpdate