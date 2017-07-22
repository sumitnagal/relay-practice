import { Environment, Network, RecordSource, Store } from 'relay-runtime';

import { fetchQuery } from './network';

export const environment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
});