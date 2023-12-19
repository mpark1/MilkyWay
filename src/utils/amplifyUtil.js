import {getCurrentUser} from 'aws-amplify/auth';
import {generateClient} from 'aws-amplify/api';
import {Alert} from 'react-native';
import {
  getImagesByAlbumID,
  getUser,
  listAlbums,
  listGuestBooks,
  listLetters,
} from '../graphql/queries';
import {uploadData} from 'aws-amplify/storage';
import { getUrl } from 'aws-amplify/storage';

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
  sizeLimit,
  petID,
  token,
) {
  if (!isLoading) {
    setIsLoading(true);
    try {
      const client = generateClient();
      const response = await client.graphql({
        query: listLetters,
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
      setIsLoading(false);
      return letterData;
    } catch (error) {
      console.log('error for list fetching: ', error);
      setIsLoading(false);
    }
  }
}

export async function queryGuestBooksByPetIDPagination(
  isLoading,
  setIsLoading,
  sizeLimit,
  petID,
  token,
) {
  if (!isLoading) {
    setIsLoading(true);
    try {
      const client = generateClient();
      const response = await client.graphql({
        query: listGuestBooks,
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
      setIsLoading(false);
      return letterData;
    } catch (error) {
      console.log('error for list fetching, guestBook: ', error);
      setIsLoading(false);
    }
  }
}

export async function uploadImageToS3(
  isLoading,
  setIsLoading,
  filename,
  imageUri,
) {
  if (!isLoading) {
    setIsLoading(true);
    try {
      const result = await uploadData({
        key: filename,
        data: imageUri,
        options: {
          accessLevel: 'protected', // defaults to `guest` but can be 'private' | 'protected' | 'guest'
          // onProgress // Optional progress callback.
        },
      }).result;
      console.log('Succeeded on upload to S3: ', result);
      setIsLoading(false);
      return result;
    } catch (error) {
      console.log('Error uploading image to S3: ', error);
      setIsLoading(false);
    }
  }
}

export async function queryAlbumsByPetIDPagination(
  isLoading,
  setIsLoading,
  sizeLimit,
  petID,
  token,
) {
  if (!isLoading) {
    setIsLoading(true);
    try {
      //1-1 get album data from Album table in db
      const client = generateClient();
      const response = await client.graphql({
        query: listAlbums,
        variables: {
          petID: petID,
          limit: sizeLimit,
          nextToken: token,
        },
        authMode: 'userPool',
      });
      const albumData = {albums: [], nextToken: null};
      const {items, nextToken} = response.data.listAlbums; // includes items (array format), nextToken
      albumData.albums = items;
      albumData.nextToken = nextToken;

      //1-2. get images from Image table in db
      const getImagesForAlbum = await Promise.all(
        albumData.albums.map(async album => {
          // album.s3KeyArray = [];
          album.s3ImageUrlArray = [];
          await client
            .graphql({
              query: getImagesByAlbumID,
              variables: {id: album.id},
              authMode: 'userPool',
            })
            .then(images =>
              images.map(image => {
              // retrieve images from S3
                const getUrl = await getUrl({
                  key: album.s3ImageUrlArray, // need to verify
                  options: {
                    accessLevel?: 'protected' , // can be 'private', 'protected', or 'guest' but defaults to `guest`
                    targetIdentityId?: 'XXXXXXX', // id of another user, if `accessLevel` is `guest`
                    validateObjectExistence?: false,  // defaults to false
                    expiresIn?: 200 // validity of the URL, in seconds. defaults to 900 (15 minutes) and maxes at 3600 (1 hour)
                    useAccelerateEndpoint?: true; // Whether to use accelerate endpoint.
                  },
                });
                // need to save this in s3ImageUrlArray
            });
        }),
      );
      console.log(
        'print first fetched image data for first album : ',
        albumData.albums[0].s3imageArray[0],
      );
      setIsLoading(false);
      return albumData;
    } catch (error) {
      console.log('error for list fetching, albums: ', error);
      setIsLoading(false);
    }
  }
}
