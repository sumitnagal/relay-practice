import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';

import { GraphQLID, GraphQLNonNull } from 'graphql';

import { viewerType } from './viewer-type';
import { widgetType } from './widget-type';

import { WidgetData } from '../models/widget-data';
import { Viewer, Widget } from '../models/graphql-models';

export const deleteWidgetMutationType = mutationWithClientMutationId({

  name: 'DeleteWidget',

  inputFields: {
    widgetId: { type: new GraphQLNonNull(GraphQLID) },
  },
  
  outputFields: {
    deletedWidget: {
      description: 'The deleted widget',
      type: widgetType,
      resolve: widget => widget,
    },
    viewer: {
      description: 'The viewer',
      type: viewerType,
      resolve: () => Object.assign(new Viewer(), { id: 1 }),
    }
  },

  mutateAndGetPayload: ({ widgetId }, { baseUrl }) => {
    // get the local widget id from the relay global id
    const localWidgetId = fromGlobalId(widgetId).id;

    // create a new instance of the data access class
    const widgetData = new WidgetData(baseUrl);

    // delete and return the widget
    return widgetData.delete(localWidgetId).then(widget =>
      Object.assign(new Widget(), widget));
  },

});