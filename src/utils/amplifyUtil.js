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
  if (isLoading) {
    return; // Prevent executing the function again if it's already loading
  }
  setIsLoading(true);
  try {
    const client = generateClient();
    const response = await client.graphql({
      query: listLetters,
      variables: {
        petID: petID,
        limit: sizeLimit,
        nextToken: token,
        sortDirection: 'DESC',
      },
      authMode: 'userPool',
    });

    const {items, nextToken} = response.data.listLetters;
    if (items.length === 0) {
      return {letters: [], nextToken: null};
    }
    const lettersWithUserDetails = await Promise.all(
      items.map(async letter => {
        return await queryUser(letter);
      }),
    );
    // console.log('print first fetched letter obj: ', lettersWithUserDetails[0]);
    return {letters: lettersWithUserDetails, nextToken};
  } catch (error) {
    console.log('error for list fetching: ', error);
  } finally {
    setIsLoading(false);
  }
}

export async function queryUser(letter) {
  // get user's information
  try {
    const client = generateClient();
    const userDetails = await client.graphql({
      query: getUser,
      variables: {id: letter.letterAuthorId},
      authMode: 'userPool',
    });
    const userObject = userDetails.data.getUser;

    // get user's profile picture from s3
    if (userObject.profilePic.length !== 0) {
      const getUrlResult = await retrieveS3UrlForOthers(
        userObject.profilePic,
        letter.identityId,
      );
      return {
        ...letter,
        userName: userObject.name, // 작성자 이름
        profilePicS3Key: userObject.profilePic, //작성자 사진 s3 key
        profilePic: getUrlResult.url.href, // 작성자 사진 url
        s3UrlExpiredAt: getUrlResult.expiresAt.toString(), // 작성자 사진 url expiration 날짜
      };
    } else {
      return {
        ...letter,
        userName: userObject.name,
        profilePic: '',
      };
    }
  } catch (userError) {
    console.error('Error fetching user details: ', userError);
    return letter; // Return original letter if fetching user details fails
  }
}

export async function queryGuestBooksByPetIDPagination(
  isLoading,
  setIsLoading,
  sizeLimit,
  petID,
  token,
) {
  if (isLoading) {
    return; // Prevent executing the function again if it's already loading
  }
  setIsLoading(true);
  try {
    const client = generateClient();
    const response = await client.graphql({
      query: listGuestBooks,
      variables: {
        petID: petID,
        limit: sizeLimit,
        nextToken: token,
        sortDirection: 'DESC',
      },
      authMode: 'userPool',
    });

    const {items, nextToken} = response.data.listGuestBooks;
    const guestbookData = {guestMessages: [], nextToken: null};
    if (items.length === 0) {
      return guestbookData;
    }

    const guestbooksWithUserDetails = await Promise.all(
      items.map(async guestbook => {
        try {
          // get user info from db
          const userDetails = await client.graphql({
            query: getUser,
            variables: {id: guestbook.guestBookAuthorId},
            authMode: 'userPool',
          });
          const userObject = userDetails.data.getUser;
          // get user profile pic from S3 if profile pic exists
          if (userObject.profilePic.length !== 0) {
            const getUrlResult = await retrieveS3UrlForOthers(
              userObject.profilePic,
              guestbook.identityId,
            );
            return {
              ...guestbook,
              userName: userObject.name,
              profilePicS3Key: userObject.profilePic,
              profilePic: getUrlResult.url.href,
              s3UrlExpiredAt: getUrlResult.expiresAt.toString(),
            };
          } else {
            return {
              ...guestbook,
              userName: userObject.name,
            };
          }
        } catch (error) {
          console.log(
            'print error while getting user data from db and get user profile picture from S3',
          );
        }
      }),
    );
    return {guestMessages: guestbooksWithUserDetails, nextToken};
  } catch (error) {
    console.log('error for list fetching: ', error);
    return {guestMessages: [], nextToken: null};
  } finally {
    setIsLoading(false);
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

export async function uploadVideoToS3(
  filename,
  videoBlob,
  contentType,
  width,
  height,
) {
  try {
    const result = await uploadData({
      key: filename,
      data: videoBlob,
      options: {
        accessLevel: 'protected',
        contentType: contentType,
        metadata: {width: width, height: height}, // metadata?: {key: "value"}
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
          sortDirection: 'DESC',
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
      const albumPromises = albumData.albums.map(async albumObj => {
        const s3response = await list({
          prefix: 'album/' + albumObj.id + '/',
          options: {
            accessLevel: 'protected',
            targetIdentityId: albumObj.authorIdentityID,
          },
        });
        const urlPromises = s3response.items.map(async imageObj => {
          const getUrlResult = await retrieveS3UrlForOthers(
            imageObj.key,
            albumObj.authorIdentityID,
          );
          return getUrlResult.url.href;
        });
        // save s3 images as an album object's attribute
        albumObj.imageArray = await Promise.all(urlPromises);
      });
      await Promise.all(albumPromises);
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
      // console.log(
      //   'print first pet object in fetch pets in community page: ',
      //   petsData.pets[0],
      // );
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
            petObject.profilePicS3Key = petObject.profilePic;
            petObject.profilePic = getUrlResult.url.href;
            petObject.s3UrlExpiredAt = getUrlResult.expiresAt.toString();
          }
          if (petObject.backgroundPic.length > 0) {
            getUrlResult = await retrieveS3UrlForOthers(
              petObject.backgroundPic,
              petObject.identityId,
            );
            petObject.backgroundPicS3Key = petObject.backgroundPic;
            petObject.backgroundPic = getUrlResult.url.href;
            petObject.backgroundPicS3UrlExpiredAt =
              getUrlResult.expiresAt.toString();
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
    // currPicS3key format - 유저는 userProfile/uuid.jpeg, 동물은 petProfile/uuid.jpeg
    try {
      await remove({key: currPicS3key, options: {accessLevel: 'protected'}});
    } catch (error) {
      console.log('Error inside updateProfilePic ', error);
    }
  }

  // 2. 새로운 사진 리사이징 후 blob 으로 만들기
  return await uploadProfilePic(newPicPath, type);
}

export async function uploadProfilePic(newPicPath, type) {
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
        type === 'pet' || 'petBackground'
          ? 'petProfile/' + newPicId
          : 'userProfile/' + newPicId;
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

export async function checkS3Url(type, s3UrlExpiredAt, s3Key) {
  if (new Date(Date.now()) >= new Date(s3UrlExpiredAt)) {
    // renew presigned url
    const newPicInfo = retrieveS3Url(s3Key); // pet/user profile or background picture url is renewed
    const newUrl = newPicInfo.url.href;
    const newExpiresAt = newPicInfo.expiresAt.toString();
    switch (type) {
      case 'petProfilePic':
        return {
          profilePic: newUrl,
          s3UrlExpiredAt: newExpiresAt,
        };
      case 'petBackgroundPic':
        return {
          backgroundPic: newUrl,
          backgroundPicS3UrlExpiredAt: newExpiresAt,
        };
      default:
        return null;
    }
  }
  // picture url is still valid
  return {
    profilePic: null,
    s3UrlExpiredAt: null,
  };
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
        targetIdentityId: identityId,
        validateObjectExistence: false,
        expiresIn: 3600, // validity of the URL, in seconds. defaults to 900 (15 minutes) and maxes at 3600 (1 hour)
        useAccelerateEndpoint: false,
      },
    });
  } catch (error) {
    console.log('print error message for getting url from s3', error);
  }
}
