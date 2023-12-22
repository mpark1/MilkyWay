import {getCurrentUser} from 'aws-amplify/auth';
import {generateClient} from 'aws-amplify/api';
import {Alert} from 'react-native';
import {
  getImagesByAlbumID,
  getUser,
  listAlbums,
  listGuestBooks,
  listLetters,
  petsByAccessLevel,
} from '../graphql/queries';
import {list, uploadData} from 'aws-amplify/storage';
import {getUrl} from 'aws-amplify/storage';

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
      return response;
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

      // console.log(
      //   'print first fetched letter: ',
      //   typeof letterData.letters[0],
      //   letterData.letters[0],
      // );
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

export async function uploadImageToS3(filename, photoBlob, contentType) {
  try {
    const result = await uploadData({
      key: filename,
      data: photoBlob,
      options: {
        accessLevel: 'protected', // defaults to `guest` but can be 'private' | 'protected' | 'guest'
        contentType: contentType,
        // onProgress // Optional progress callback.
      },
    }).result;
    console.log('Succeeded on upload to S3: ', result);
    return result;
  } catch (error) {
    console.log('Error uploading image to S3: ', error);
  }
}

export async function queryAlbumsByPetIDPagination(
  isLoadingAlbums,
  setIsLoadingAlbums,
  pageSize,
  petID,
  token,
) {
  if (!isLoadingAlbums) {
    try {
      setIsLoadingAlbums(true);
      //1 get album data from Album table in db
      const client = generateClient();
      const response = await client.graphql({
        query: listAlbums,
        variables: {
          petID: petID,
          limit: pageSize,
          nextToken: token,
        },
        authMode: 'userPool',
      });
      const albumData = {albums: [], nextToken: null};
      const {items, nextToken} = response.data.listAlbums; // includes items (array format), nextToken
      albumData.albums = items;
      albumData.nextToken = nextToken;
      console.log(
        'check if albums fetching from db is success: ',
        albumData.albums[0],
      );

      //2. get images from S3
      // returns all image objects from s3 bucket
      albumData.albums.map(async albumObj => {
        const s3response = await list({
          prefix: 'album/' + albumObj.id + '/',
          options: {
            accessLevel: 'protected',
          },
        });
        console.log(
          'check if albums fetching first item from s3 is success: ',
          s3response.items[0],
        );
        const urlPromises = s3response.items.map(async imageObj => {
          const getUrlResult = await getUrl({
            key: imageObj.key,
            options: {
              accessLevel: 'protected',
              validateObjectExistence: false, // defaults to false
              expiresIn: 900, // validity of the URL, in seconds. defaults to 900 (15 minutes) and maxes at 3600 (1 hour)
              useAccelerateEndpoint: false, // Whether to use accelerate endpoint.
            },
          });
          return getUrlResult.url.href;
        });
        // save s3 images as an album object's attribute
        albumObj.imageArray = [];
        albumObj.imageArray = await Promise.all(urlPromises);
        console.log('format of imageArray', typeof albumObj.imageArray);
      });
      setIsLoadingAlbums(false);
      return albumData;
    } catch (error) {
      console.log('error for list fetching, albums: ', error);
      setIsLoadingAlbums(false);
    }
  }
}

export async function queryPetsPagination(
  isLoadingPets,
  setIsLoadingPets,
  pageSize,
  token,
) {
  if (!isLoadingPets) {
    try {
      setIsLoadingPets(true);
      //1 get pet data from Pets table in db
      const client = generateClient();
      const response = await client.graphql({
        query: petsByAccessLevel,
        variables: {
          accessLevel: 'Public',
          limit: pageSize,
          nextToken: token,
        },
        authMode: 'userPool',
      });
      const petsData = {pets: [], nextToken: null};
      const {items, nextToken} = response.data.petsByAccessLevel; // includes items (array format), nextToken
      petsData.pets = items;
      petsData.nextToken = nextToken;
      console.log(
        'print first pet fetched from db is success: ',
        petsData.pets[0],
      );

      //2. get profile image from S3
      // returns all image objects from s3 bucket
      // const urlPromises = petsData.pets.map(async petObj => {
      //   const getUrlResult = await getUrl({
      //     key: petObj.profilePic,
      //     options: {
      //       accessLevel: 'protected',
      //       validateObjectExistence: false, // defaults to false
      //       expiresIn: 900, // validity of the URL, in seconds. defaults to 900 (15 minutes) and maxes at 3600 (1 hour)
      //       useAccelerateEndpoint: false, // Whether to use accelerate endpoint.
      //     },
      //   });
      //   petObj.profilePic = getUrlResult.url.href;
      //   console.log(
      //     'print pet profile pic, type and value: ',
      //     typeof petObj.profilePic,
      //     petObj.profilePic,
      //   );
      // });
      // setIsLoadingPets(false);
      return petsData;
    } catch (error) {
      console.log('error for fetching pets for community: ', error);
      setIsLoadingPets(false);
    }
  }
}
