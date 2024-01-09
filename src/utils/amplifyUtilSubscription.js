import {generateClient} from 'aws-amplify/api';
import * as subscription from '../graphql/subscriptions';

export async function sucriptionForAllMutation(
  petID,
  createSubQuery,
  updateSubQuery,
  deleteSubQuery,
) {
  const client = generateClient();
  const variables = {
    filter: {petID: {eq: petID}},
  };
  // create mutation
  const createSub = client
    .graphql({
      query: createSubQuery,
      variables,
    })
    .subscribe({
      next: ({data}) => console.log(data),
      error: error => console.warn(error),
    });
  // update mutation
  const updateSub = client.graphql({query: updateSubQuery}).subscribe({
    next: ({data}) => console.log(data),
    error: error => console.warn(error),
  });
  // delete mutation
  const deleteSub = client.graphql({query: deleteSubQuery}).subscribe({
    next: ({data}) => console.log(data),
    error: error => console.warn(error),
  });
}
