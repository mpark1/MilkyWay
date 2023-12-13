import {getCurrentUser} from 'aws-amplify/auth';
import {generateClient} from 'aws-amplify/api';
import AlertBox from '../components/AlertBox';

export async function checkUser() {
  try {
    const {userId} = await getCurrentUser();
    console.log('userid: ', userId);
    if (userId) {
      console.log('userId from getCurrentUser', userId);
      return userId;
    }
  } catch (error) {
    console.error('Error checking getCurrentUser:', error);
    return null;
  }
}

export async function createUpdateItem(
  isCallingAPI,
  setIsCallingAPI,
  inputObj,
  queryName,
  alertMsg,
  alertFunc,
) {
  try {
    if (!isCallingAPI) {
      setIsCallingAPI(true);
      const client = generateClient();
      const response = await client.graphql({
        query: queryName,
        variables: {input: inputObj},
        authMode: 'userPool',
      });
      AlertBox(alertMsg, '', '확인', () => {
        alertFunc;
      });
      console.log('response after query ', response);
    }
  } catch (error) {
    console.log('error during query: ', error);
  } finally {
    setIsCallingAPI(false);
  }
}

export async function querySingleItem(queryName, variables) {
  try {
    const client = generateClient();
    const response = await client.graphql({
      query: queryName,
      variables: variables,
      authMode: 'userPool',
    });
    const petData = response.data;
    console.log('get selected pet data from db: ', petData);
    return petData;
  } catch (error) {
    console.log('error for getting pet data from db: ', error);
  }
}

export async function queryListItemsByPetIDPagination(
  isLoading,
  setIsLoading,
  queryName,
  sizeLimit,
  petID,
  token,
) {
  if (!isLoading) {
    setIsLoading(true);
    try {
      const client = generateClient();
      const response = await client.graphql({
        query: queryName,
        variables: {
          petID: petID,
          limit: sizeLimit,
          nextToken: token,
        },
        authMode: 'userPool',
      });
      return response.data;
    } catch (error) {
      console.log('error for fetching: ', error);
    } finally {
      setIsLoading(false);
    }
  }
}
