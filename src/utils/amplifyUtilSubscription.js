import {generateClient} from 'aws-amplify/api';
import * as subscription from '../graphql/subscriptions';

export async function sucriptionForMyPets(userID) {
  const client = generateClient();
  const variables = {
    filter: {managerID: {eq: userID}},
    owner: userID,
  };
  // create mutation
  const createSub = client
    .graphql({
      query: subscription.onCreatePet,
      variables,
    })
    .subscribe({
      next: ({data}) => {
        console.log(
          "print what's returned from onCreatePet subscription: ",
          data,
        );
        return true;
      },
      error: error => {
        console.warn(error);
        return false;
      },
    });
  console.log('my pet subscription is on');
  // createSub.unsubscribe();
  // console.log('my pet subscription is turned off');
}

export async function supscriptionForCreate(petID, subscriptionQuery) {
  const client = generateClient();
  const variables = {
    filter: {petID: {eq: petID}},
  };
  // create mutation
  const createSub = client
    .graphql({
      query: subscriptionQuery,
      variables: variables,
      authMode: 'userPool',
    })
    .subscribe({
      next: ({data}) => {
        console.log('print subscription result for create query: ', data);
      },
      error: error => console.warn(error),
    });
  return createSub;
}
//
// export async function supscriptionForUpdate(petID, createSubQuery) {
//   // update mutation
//   const updateSub = client.graphql({query: updateSubQuery}).subscribe({
//     next: ({data}) => console.log(data),
//     error: error => console.warn(error),
//   });
//   // delete mutation
//   const deleteSub = client.graphql({query: deleteSubQuery}).subscribe({
//     next: ({data}) => console.log(data),
//     error: error => console.warn(error),
//   });
// }
