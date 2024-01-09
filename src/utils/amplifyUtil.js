import {fetchAuthSession, getCurrentUser} from 'aws-amplify/auth';
import {generateClient} from 'aws-amplify/api';
import {Alert} from 'react-native';
import {
  getPet,
  getPetFamily,
  getUser,
  listAlbums,
  listGuestBooks,
  listLetters,
  listPetFamilies,
  petsByAccessLevel,
} from '../graphql/queries';
import {getUrl, list, uploadData} from 'aws-amplify/storage';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import uuid from 'react-native-uuid';

import * as RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {updateUser} from '../graphql/mutations';
import {removeUserProfilePicOnDevice} from './utils';

export async function checkUser() {
  try {
    const {userId} = await getCurrentUser();
    if (userId) {
      return userId;
    }
  } catch (error) {
    console.error('Error checking getCurrentUser:', error);
    return null;
  }
}

export async function getIdentityID() {
  try {
    const {identityId} = await fetchAuthSession();
    return identityId;
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
      // if none is found in db, just return
      if (items.length === 0) {
        return letterData;
      }

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
      console.log('print 방명록 list fetching result: ', items[0]);
      // if none is found in db, just return
      if (items.length === 0) {
        return letterData;
      }

      const lettersWithUserDetails = await Promise.all(
        letterData.letters.map(async letter => {
          const userDetails = await client.graphql({
            query: getUser,
            variables: {id: letter.guestBookAuthorId},
            authMode: 'userPool',
          });
          if (userDetails.data.getUser === null) {
            letter.userName = '탈퇴한 회원';
          } else {
            letter.userName = userDetails.data.getUser.name;
            // letter.profilePic = userDetails.data.getUser.profilePic;
          }
        }),
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
      // if none found, just return
      if (items.length === 0) {
        return albumData;
      }

      //2. get images from S3
      // returns all image objects from s3 bucket
      albumData.albums.map(async albumObj => {
        const s3response = await list({
          prefix: 'album/' + albumObj.id + '/',
          options: {
            accessLevel: 'protected',
            targetIdentityId: albumObj.authorIdentityID,
          },
        });
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
        // console.log('format of imageArray', typeof albumObj.imageArray);
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
      // console.log(
      //   'print first pet fetched from db is success: ',
      //   petsData.pets[0],
      // );

      return petsData;
    } catch (error) {
      console.log('error for fetching pets for community: ', error);
      setIsLoadingPets(false);
    }
  }
}

export async function queryMyPetsPagination(
  userID,
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
        query: listPetFamilies,
        variables: {
          familyMemberID: userID,
          limit: pageSize,
          nextToken: token,
        },
        authMode: 'userPool',
      });
      const petsData = {petFamily: [], pets: [], nextToken: null};
      const {items, nextToken} = response.data.listPetFamilies; // includes items (array format), nextToken
      petsData.petFamily = items;
      petsData.nextToken = nextToken;
      // if none is found, return
      if (items.length === 0) {
        return petsData;
      }

      const fetchPetDetails = await Promise.all(
        petsData.petFamily.map(async petFamilyItem => {
          const petDetails = await client.graphql({
            query: getPet,
            variables: {id: petFamilyItem.petID},
            authMode: 'userPool',
          });
          return petDetails.data.getPet;
        }),
      );
      petsData.pets = await Promise.all(fetchPetDetails);
      return petsData;
    } catch (error) {
      console.log('error for fetching my pets from db: ', error);
      setIsLoadingPets(false);
    }
  }
}

export async function checkFamily(
  userID,
  petID,
  setIsFamily,
  petInfo,
  setIsManager,
) {
  /* 가족관계 확인 */
  try {
    const client = generateClient();
    const response = await client.graphql({
      query: getPetFamily,
      variables: {
        familyMemberID: userID,
        petID: petID,
      },
      authMode: 'userPool',
    });
    setIsFamily(true);

    // 매니저인지 확인
    if (petInfo.owner === userID) {
      setIsManager(true);
    }
  } catch (error) {
    console.log('Error fetching pet family', error);
    // 가족이 아닐 경우 DB 기록이 없는데 null 또는 에러 반환되는지 확인 해야함
    setIsFamily(false);
  }
}

export async function updateProfilePic(filepath, isPet, petId) {
  /* TODO: S3에 있는 사진 지우기 */

  // convert resized image to blob
  const newPicId = uuid.v4();
  try {
    await ImageResizer.createResizedImage(
      filepath, // path
      200, // width
      200, // height
      'JPEG', // format
      100, // quality
    ).then(async resFromResizer => {
      const photo = await fetch(resFromResizer.uri);
      const photoBlob = await photo.blob();

      const filename = isPet
        ? 'petProfile/' + petId + '/' + newPicId + '.jpeg'
        : 'userProfile/' + newPicId + '.jpeg';

      // send over to s3
      const resultFromS3 = await uploadImageToS3(
        filename,
        photoBlob,
        'image/jpeg',
      );
      console.log('Inside updateProfilePic in s3: ', resultFromS3);
    });
    return newPicId;
  } catch (error) {
    console.log('Error updating profile pic in S3: ', error);
  }
}

export async function checkAsyncStorageUserProfile(
  isCallingUpdateAPI,
  setIsCallingUpdateAPI,
  updateInputObject,
) {
  try {
    // 1. File System 에서 프로필 사진 가져와서 S3에 업로드
    const fileSystemPath = await AsyncStorage.getItem('userProfile');
    if (fileSystemPath.length > 0) {
      const fileOnDevice = await RNFS.readFile(fileSystemPath, 'base64');

      const base64Response = await fetch(
        `data:image/jpeg;base64,${fileOnDevice}`,
      );
      const photoBlob = await base64Response.blob();
      console.log('Blob to be sent to S3: ', photoBlob);

      const picId = uuid.v4();

      const filename = 'userProfile/' + picId + '.jpeg';
      const responseFromS3 = await uploadImageToS3(
        filename,
        photoBlob,
        'image/jpeg',
      );
      console.log(
        'Did profilePic in AsyncStorage get uploaded to S3? ',
        responseFromS3,
      );
      // 2. S3 성공하면 remove profilePic from File System and AsyncStorage
      await removeUserProfilePicOnDevice(fileSystemPath);

      updateInputObject.profilePic = picId;
      console.log('updateUserInput: ', updateInputObject);
      // 3. Update User in DB: Set User profilePic attribute to uuid(picID) from above
      /* TODO: 자동로그인이나 일반로그인 했을때 사진 업로드되면 사진만 업로드하는 mutation 을 따로 만드는게 어떨지 */
      // await mutationItem(
      //   setIsCallingUpdateAPI,
      //   setIsCallingUpdateAPI,
      //   updateInputObject,
      //   updateUser,
      //   '',
      //   '',
      // );
    }
  } catch (error) {
    console.log('Inside checkAsyncStorageUserProfile: ', error);
  } finally {
    setIsCallingUpdateAPI(false);
  }
}
