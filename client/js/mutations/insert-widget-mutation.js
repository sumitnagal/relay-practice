import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';

// the new name of the operation must correspond to the file name of this file
// insert-widget-mutation => insertWidgetMutation
// the operation name must end in 'Mutation', so the file name must end in mutation
// exclamation point means required
// the insertWidget parameter name must be input, this is required
// for the widget edge, the type name, cursor, info and all widget date (under node)
// should be pulled
// for the viewer, the id plus the total count of widgets is needed
const mutation = graphql`
  mutation insertWidgetMutation($input: InsertWidgetInput!) {
    insertWidget(input:$input) {
      widgetEdge {
        __typename
        cursor
        node {
          id
          name
          description
          color
          size
          quantity
        }
      }
      viewer {
        id
        widgets {
          totalCount
        }
      }
    }
  }
`;

// use by both the optimistic updater and real updated to make changes
// to the relay store
const sharedUpdater = (store, viewer, newWidgetEdge, widgetTotalCount) => {

  // load the viewer by id
  // viewer proxy is needed to get the widgets connection off the viewer
  const viewerProxy = store.get(viewer.id);

  // get the connection of viewer to widgets
  // the second argument is a connection key and it connects to the key in widget-app-container.js
  const conn = ConnectionHandler.getConnection(viewerProxy, 'widgetsAppContainer_widgets');

  // VERY IMPORTANT, the setValue's arguments are reversed from standard
  // programming practice
  // update the total count of widgets
  conn.setValue(widgetTotalCount, 'totalCount');

  // inserts the edge at the end of the connection
  ConnectionHandler.insertEdgeAfter(conn, newWidgetEdge);
};

// used to generate mutation ids for the updater and optimistic updater
let clientMutationId = 0;

// "friendly" function called by the component event handler to do
// the insert widget operation
export const insertWidget = (environment, widget, viewer) =>
  commitMutation(
    // environment configuration for the network and store
    environment,
    {
      // mutation query
      mutation,
      // mutation query input argument
      variables: {
        input: {
          // the widget to insert
          widget,
          // client mutation id is linked to optimistic update
          clientMutationId: String(clientMutationId++),
        },
      },
      // returns the response on completed inserts
      onCompleted: res => console.log('Insert Widget Success!', res),
      // returns an error on failed inserts
      onError: err => console.error('Insert Widget Error!', err),
      // updates the store with the returned payload
      // store is the one configured for the QueryRenderer?
      updater: store => {

        // get root field of the return value of the insertWidget mutation
        // payload is the result data returned from the insert
        const payload = store.getRootField('insertWidget');

        // get the new edge
        const newWidgetEdge = payload.getLinkedRecord('widgetEdge');

        // get the new widget count from the payload
        const widgetTotalCount = payload.getLinkedRecord('viewer')
          .getLinkedRecord('widgets').getValue('totalCount');

        // updates the store with the new widget edge
        sharedUpdater(store, viewer, newWidgetEdge, widgetTotalCount);
      },
      // performs optimistic updates while waiting for the result from the
      // real update operation
      // store is the one configured for the QueryRenderer?
      optimisticUpdater: store => {

        // create new widget node
        const newNodeId = 'client:newWidget:' + clientMutationId++;
        const newNode = store.create(newNodeId, 'Widget');

        // set the values on the node
        newNode.setValue(newNodeId, 'id');
        newNode.setValue(widget.name, 'name');
        newNode.setValue(widget.description, 'description');
        newNode.setValue(widget.color, 'color');
        newNode.setValue(widget.size, 'size');
        newNode.setValue(widget.quantity, 'quantity');

        // create a new widget edge
        const newEdge = store.create(
          'client:newEdge:' + clientMutationId++,
          'widgetEdge'
        );
        // attach the new widget node to the new widget edge
        // a linked record connects a parent node to a child node
        newEdge.setLinkedRecord(newNode, 'node');

        // update the store with the new widget edge
        sharedUpdater(store, viewer, newEdge);
      },
    },
  );