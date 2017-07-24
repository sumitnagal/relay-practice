import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';

const mutation = graphql`
  mutation updateWidgetMutation($input: UpdateWidgetInput!) {
    updateWidget(input: $input) {
      widget {
        id name description color size quantity
      }
      viewer { id }
    }
  }
`;

const getOptimisticResponse = (widget) => {
  return {
    updateWidget: {
      widget
    },
  };
};


export const updateWidget = (environment, widget) => {

  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: {
          widget
        }
      },
      optimisticResponse: getOptimisticResponse(widget),
    }
  );


};