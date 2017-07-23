import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';

const mutation = graphql`
  mutation deleteWidgetMutation($input: DeleteWidgetInput!) {
    deleteWidget(input: $input) {
      deletedWidget {
        id name description color size quantity
      }
      viewer {
        widgets {
          totalCount
        }
      }
    }
  }
`;

const sharedUpdater = (source, viewer, deleteWidgetId, widgetTotalCount) => {

  // get the viewer for retrieving the widgets connection
  const viewerProxy = source.get(viewer.id);

  // get the widgets connection
  const conn = ConnectionHandler.getConnection(viewerProxy, 'widgetTable_widgets');

  // VERY IMPORTANT, the setValue's arguments are reversed from standard
  // programming practice
  // update the total count of widgets
  if (widgetTotalCount) {
    conn.setValue(widgetTotalCount, 'totalCount');
  } else {
    conn.setValue(conn.getValue('totalCount') - 1, 'totalCount');
  }

  // delete the node from the widgets connection
  ConnectionHandler.deleteNode(conn, deleteWidgetId);
};

export const deleteWidget = (environment, widgetId, viewer) => {

  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: {
          widgetId,
        }
      },
      updater: source => {

        // get the mutation payload
        const payload = source.getRootField('deleteWidget');

        // get the new widget count from the payload
        const widgetTotalCount = payload.getLinkedRecord('viewer')
          .getLinkedRecord('widgets').getValue('totalCount');

        // get the deleted widget id
        const deletedWidgetId = payload.getLinkedRecord('deletedWidget')
          .getValue('id');

        // update the record source
        sharedUpdater(source, viewer, deletedWidgetId, widgetTotalCount);
      },
      optimisticUpdater: source => {
        sharedUpdater(source, viewer, widgetId);
      },
    }
  );


}; 