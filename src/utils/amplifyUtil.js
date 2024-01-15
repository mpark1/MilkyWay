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
import {getUrl, list, uploadData, remove} from 'aws-amplify/storage';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import uuid from 'react-native-uuid';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {updateUser} from '../graphql/mutations';
import {removeUserProfilePicOnDevice} from './utils';
import {Buffer} from '@craftzdog/react-native-buffer';
import config from '../amplifyconfiguration.json';

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
    console.log('print identity Id in amplify util page: ', identityId);
    return identityId;
  } catch (error) {
    console.error('Error checking getCurrentUser:', error);
    return null;
  }
}

export async function fetchUserFromDB(userID) {
  try {
    const client = generateClient();
    const response = await client.graphql({
      query: getUser,
      variables: {id: userID},
      authMode: 'userPool',
    });
    return response.data.getUser;
  } catch (error) {
    console.log('error during query: ', error);
  }
}

export async function mutationItemNoAlertBox(
  isCallingAPI,
  setIsCallingAPI,
  inputObj,
  queryName,
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
      return response;
    }
  } catch (error) {
    console.log('error during query: ', error);
  } finally {
    setIsCallingAPI(false);
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
          letter.userName = userDetails.data.getUser.name; // get user's name
          letter.profilePic = userDetails.data.getUser.profilePic; //get user profile pic's s3 key
          letter.profilePicUrl = retrieveS3UrlForOthers(
            userDetails.data.getUser.profilePic,
            letter.identityId,
          );
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
          letter.userName = userDetails.data.getUser.name;
          letter.profilePic = userDetails.data.getUser.profilePic; //s3 key
          letter.profilePicUrl = retrieveS3UrlForOthers(
            userDetails.data.getUser.profilePic,
            letter.identityId,
          ); // get s3 url
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
          const getUrlResult = retrieveS3Url(imageObj.key);
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
  userID,
  isLoadingPets,
  setIsLoadingPets,
  pageSize,
  token,
  myPetsIdArray,
) {
  if (!isLoadingPets) {
    try {
      setIsLoadingPets(true);
      //1 get pet data from Pets table in db. Filter is used not to show the user's own pets
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
      console.log(
        'print number of pets in community page: ',
        response.data.petsByAccessLevel.items.length,
      );
      const petsData = {pets: [], nextToken: null};
      const {items, nextToken} = response.data.petsByAccessLevel; // includes items (array format), nextToken
      petsData.pets = items;
      petsData.nextToken = nextToken;
      // if none is found, return
      if (items.length === 0) {
        return petsData;
      }
      console.log(
        'print first pet object in fetch pets in community page: ',
        petsData.pets[0],
      );
      // remove pets that are in my pets list (in petFamilies)
      let filteredPets = petsData.pets.filter(
        pet => !myPetsIdArray.includes(pet.id),
      );
      // iterate pet object and update profile picture related attributes
      for (let pet of filteredPets) {
        if (pet.profilePic.length > 0) {
          const getUrlResult = await retrieveS3UrlForOthers(
            pet.profilePic,
            pet.identityId,
          );
          console.log(
            'print getUrl result for community pets fetch: ',
            getUrlResult,
          );
          pet.profilePicS3Key = pet.profilePic;
          pet.profilePic = getUrlResult.url.href;
          pet.s3UrlExpiredAt = getUrlResult.expiresAt.toString();
        }
      }
      // Update petsData with the processed pets
      petsData.pets = filteredPets;
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
          const petObject = petDetails.data.getPet;
          let getUrlResult;
          // console.log('get pet profile pic', petObject.profilePic);
          // console.log('get pet identity id', petObject.identityId);
          if (petObject.profilePic.length > 0) {
            getUrlResult = await retrieveS3UrlForOthers(
              petObject.profilePic,
              petObject.identityId,
            );
            // console.log(
            //   'print getUrl result for my pets fetch: ',
            //   getUrlResult,
            // );
            petObject.profilePicS3Key = petObject.profilePic;
            petObject.profilePic = getUrlResult.url.href;
            petObject.s3UrlExpiredAt = getUrlResult.expiresAt.toString();
          }
          return petObject;
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

export async function updateProfilePic(newPicPath, type, currPicS3key) {
  /**
    1. 리덕스 User profilePic (currPicS3key) 넘겨받기
   *    - length = 0? s3에 사진이 없음
   *    - length > 0? S3에 있는 기존 사진 지우기
   */
  if (currPicS3key && currPicS3key.length > 0) {
    // currPicS3key format - 유저는 userProfile/uuid.jpeg, 동물은 petProfile/petId/uuid.jpeg
    try {
      await remove({key: currPicS3key, options: {accessLevel: 'protected'}});
    } catch (error) {
      console.log('Error inside updateProfilePic ', error);
    }
  }

  // 2. 새로운 사진 리사이징 후 blob 으로 만들기
  return await uploadPetProfilePic(newPicPath, type);
}

export async function uploadPetProfilePic(newPicPath, type) {
  const newPicId = uuid.v4() + '.jpeg';
  try {
    await ImageResizer.createResizedImage(
      newPicPath, // path
      200, // width
      200, // height
      'JPEG', // format
      100, // quality
    ).then(async resFromResizer => {
      const photo = await fetch(resFromResizer.uri);
      const photoBlob = await photo.blob();
      const filename =
        type === 'pet' ? 'petProfile/' + newPicId : 'userProfile/' + newPicId;
      // 3. send over to s3
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
  isCallingAPI,
  setIsCallingAPI,
  updateInputObject,
) {
  try {
    // 1. File System 에서 프로필 사진 가져와서 S3에 업로드
    const fileSystemPath = await AsyncStorage.getItem('userProfile100');
    console.log(
      'print filesystempath from async storage before getting file from the file system.',
      fileSystemPath,
    );
    if (fileSystemPath && fileSystemPath.length > 0) {
      const base64 = await RNFS.readFile(fileSystemPath, 'base64');
      console.log('fileOnDevice: ', base64);

      const buffer = Buffer.from(base64, 'base64');
      const photoBlob = new Blob([buffer], {type: 'image/jpeg'});
      console.log('Blob to be sent to S3: ', photoBlob);

      const s3key = 'userProfile/' + uuid.v4() + '.jpeg';
      const responseFromS3 = await uploadImageToS3(
        s3key,
        photoBlob,
        'image/jpeg',
      );
      console.log(
        'Did profilePic in AsyncStorage get uploaded to S3? ',
        responseFromS3,
      );

      // 2. S3 성공하면 remove profilePic from File System and AsyncStorage
      await removeUserProfilePicOnDevice(fileSystemPath);

      // 3. Update User in DB: Set User profilePic attribute to s3key from above
      updateInputObject.profilePic = s3key;
      console.log('updateUserInput: ', updateInputObject);
      try {
        if (!isCallingAPI) {
          setIsCallingAPI(true);
          const client = generateClient();
          const response = await client.graphql({
            query: updateUser,
            variables: {input: updateInputObject},
            authMode: 'userPool',
          });
          console.log(
            'DynamoDB response from User profilePic update: ',
            response,
          );
          return response;
        }
      } catch (error) {
        console.log('error during query: ', error);
      } finally {
        setIsCallingAPI(false);
      }
    }
  } catch (error) {
    console.log('Inside checkAsyncStorageUserProfile: ', error);
  }
}

export async function checkS3Url(s3UrlExpiredAt, profilePicS3Key) {
  if (new Date(Date.now()) >= new Date(s3UrlExpiredAt)) {
    const returnData = {};
    // renew presigned url
    const newProfilePic = retrieveS3Url(profilePicS3Key);
    returnData.profilePic = newProfilePic.url.href; //profile picture url is renewed
    returnData.s3UrlExpiredAt = newProfilePic.expiresAt.toString();
    return returnData;
  }
  return ''; // profile picture url is still valid
}

export async function retrieveS3Url(key) {
  return await getUrl({
    key: key,
    options: {
      accessLevel: 'protected',
      validateObjectExistence: false,
      expiresIn: 3600, // validity of the URL, in seconds. defaults to 900 (15 minutes) and maxes at 3600 (1 hour)
      useAccelerateEndpoint: false,
    },
  });
}

export async function retrieveS3UrlForOthers(key, identityId) {
  try {
    return await getUrl({
      key: key,
      options: {
        accessLevel: 'protected',
        targetIdentityId:
          config.aws_user_files_s3_bucket_region + ':' + identityId,
        validateObjectExistence: false,
        expiresIn: 3600, // validity of the URL, in seconds. defaults to 900 (15 minutes) and maxes at 3600 (1 hour)
        useAccelerateEndpoint: false,
      },
    });
  } catch (error) {
    console.log('print error message for getting url from s3', error);
  }
}
