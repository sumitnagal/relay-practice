import { commitMutation, graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';

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
      }
    }
  }
`;

const sharedUpdater = (store, viewer, newWidgetEdge) => {

  // load the viewer by id
  const viewerProxy = store.get(viewer.id);

  // get the connection of viewer to widgets
  // the second argument is a connection key and it connects to the key in widget-app-container.js
  const conn = ConnectionHandler.getConnection(viewerProxy,'widgetsAppContainer_widgets');

  // inserts the edge at the end of the connection
  ConnectionHandler.insertEdgeAfter(conn, newWidgetEdge);
};

let clientMutationId = 0;

export const insertWidget = (environment, widget, viewer) => {

  console.log(widget);

  return commitMutation(
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
      onCompleted: () => {
        console.log('Success!');
      },
      onError: err => console.error(err),
      // updates the store with the returned payload
      // store is the one configured for the QueryRenderer?
      updater: store => {

        // get root field of the return value of the insertWidget mutation
        // payload is the result data returned from the insert
        const payload = store.getRootField('insertWidget');

        // get the new edge
        const newWidgetEdge = payload.getLinkedRecord('widgetEdge');

        // updates the store with the new widget edge
        sharedUpdater(store, viewer, newWidgetEdge);
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

};