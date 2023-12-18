import {getCurrentUser} from 'aws-amplify/auth';
import {generateClient} from 'aws-amplify/api';
import {Alert} from 'react-native';
import {getUser} from '../graphql/queries';

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

export async function mutationItem(
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
      alertBox(alertMsg, '', '확인', alertFunc);
      console.log('response after query ', response);
    }
  } catch (error) {
    console.log('error during query: ', error);
  } finally {
    setIsCallingAPI(false);
  }
}

const alertBox = (title, message, buttonText, onConfirm) => {
  if (onConfirm === 'none') {
    Alert.alert(title, message, [
      {
        text: buttonText,
      },
    ]);
  } else {
    Alert.alert(title, message, [
      {
        text: buttonText,
        onPress: () => onConfirm(), // Pass the callback function here
      },
    ]);
  }
};

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

export async function queryLettersByPetIDPagination(
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

      const letterData = {letters: [], nextToken: null};
      const {items, nextToken} = response.data.listLetters; // includes items (array format), nextToken
      letterData.letters = items;
      letterData.nextToken = nextToken;

      const lettersWithUserDetails = await Promise.all(
        letterData.letters.map(async letter => {
          const userDetails = await client.graphql({
            query: getUser,
            variables: {id: letter.letterAuthorId},
            authMode: 'userPool',
          });
          letter.userName = userDetails.data.getUser.name;
          letter.profilePic = userDetails.data.getUser.profilePic;
        }),
      );

      console.log('print first fetched letter: ', letterData.letters[0]);
      return letterData;
    } catch (error) {
      console.log('error for list fetching: ', error);
    } finally {
      setIsLoading(false);
    }
  }
}

export async function queryGuestBooksByPetIDPagination(
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

      const letterData = {letters: [], nextToken: null};
      const {items, nextToken} = response.data.listGuestBooks; // includes items (array format), nextToken
      letterData.letters = items;
      letterData.nextToken = nextToken;

      const lettersWithUserDetails = await Promise.all(
        letterData.letters.map(async letter => {
          const userDetails = await client.graphql({
            query: getUser,
            variables: {id: letter.guestBookAuthorId},
            authMode: 'userPool',
          });
          letter.userName = userDetails.data.getUser.name;
          letter.profilePic = userDetails.data.getUser.profilePic;
        }),
      );

      console.log(
        'print first fetched guest messages : ',
        letterData.letters[0],
      );
      return letterData;
    } catch (error) {
      console.log('error for list fetching, guestBook: ', error);
    } finally {
      setIsLoading(false);
    }
  }
}
