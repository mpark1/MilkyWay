import {fetchAuthSession, getCurrentUser} from 'aws-amplify/auth';
import {generateClient} from 'aws-amplify/api';
import {Alert} from 'react-native';
import {
  albumByCategory,
  getPet,
  getPetFamily,
  getUser,
  listAlbums,
  listGuestBooks,
  listLetters,
  listPetFamilies,
  petPageFamilyMembers,
  petsByAccessLevel,
} from '../graphql/queries';
import {getUrl, list, uploadData, remove} from 'aws-amplify/storage';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import uuid from 'react-native-uuid';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  deletePet,
  deletePetFamily,
  migrateToInactivePet,
  updateUser,
} from '../graphql/mutations';
import {removeUserProfilePicOnDevice} from './utils';
import {Buffer} from '@craftzdog/react-native-buffer';

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
    return {letters: lettersWithUserDetails, nextToken: nextToken};
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
          if (userObject.profilePic && userObject.profilePic.length !== 0) {
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
              profilePic: '',
            };
          }
        } catch (error) {
          console.log(
            'print error while getting user data from db and get user profile picture from S3',
          );
        }
      }),
    );
    console.log(
      'print the first guestbook message: ',
      guestbooksWithUserDetails[0],
      nextToken,
    );
    return {guestMessages: guestbooksWithUserDetails, nextToken: nextToken};
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

export async function uploadVideoToS3(filename, videoBlob, contentType) {
  try {
    const result = await uploadData({
      key: filename,
      data: videoBlob,
      options: {
        accessLevel: 'protected',
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
      // get urls for album data from S3
      albumData.albums = await getUrlsFromS3ForAlbums(albumData);
      setIsLoadingAlbums(false);
      return albumData;
    } catch (error) {
      console.log('error for list fetching, albums: ', error);
      setIsLoadingAlbums(false);
    }
  }
}

async function getUrlsFromS3ForAlbums(albumData) {
  // returns all image objects from s3 bucket
  const albumPromises = await Promise.all(
    albumData.albums.map(async albumObj => {
      if (albumObj.imageType === 1) {
        let parts = albumObj.widthHeight.split('.');
        let width = parseInt(parts[0], 10);
        let height = parseInt(parts[1], 10);
        albumObj.width = width;
        albumObj.height = height;
      }
      // get s3keys for images from S3 folder
      const s3response = await list({
        prefix: 'album/' + albumObj.s3Folder + '/',
        options: {
          accessLevel: 'protected',
          targetIdentityId: albumObj.authorIdentityID,
        },
      });
      // save image urls and s3key for each given s3key
      albumObj.keyArray = s3response.items.map(item => item.key);
      albumObj.imageArray = await Promise.all(
        s3response.items.map(async imageObj => {
          const getUrlResult = await retrieveS3UrlForOthers(
            imageObj.key,
            albumObj.authorIdentityID,
          );
          return getUrlResult.url.href;
        }),
      );
      return albumObj;
    }),
  );
  console.log('print downloaded images from S3', albumPromises[0]);
  return albumPromises;
}

export async function queryAlbumsByCategory(pageSize, petID, token, category) {
  try {
    const client = generateClient();
    const response = await client.graphql({
      query: albumByCategory,
      variables: {
        category: category,
        filter: {petID: {eq: petID}},
        limit: pageSize,
        nextToken: token,
        sortDirection: 'DESC',
      },
      authMode: 'userPool',
    });
    const albumData = {albums: [], nextToken: null};
    const {items, nextToken} = response.data.albumByCategory; // includes items (array format), nextToken
    albumData.albums = items;
    albumData.nextToken = nextToken;
    // if none found, just return
    if (items.length === 0) {
      return albumData;
    }
    // get images from S3 for selected albums
    albumData.albums = await getUrlsFromS3ForAlbums(albumData);
  } catch (error) {
    console.log('error for albumByCategory fetching, albums: ', error);
  }
}

export async function queryPetsPagination(
  queryName,
  queryNameString,
  variables,
  isLoadingPets,
  setIsLoadingPets,
  myPetsIdArray,
) {
  if (!isLoadingPets) {
    try {
      setIsLoadingPets(true);
      //1 get pet data from Pets table in db. Filter is used not to show the user's own pets
      const client = generateClient();
      const response = await client.graphql({
        query: queryName,
        variables: variables,
        authMode: 'userPool',
      });
      const petsData = {pets: [], nextToken: null};
      const {items, nextToken} = response.data[queryNameString];
      petsData.pets = items;
      petsData.nextToken = nextToken;
      console.log('items and nextToken: ', petsData.pets, petsData.nextToken);
      // if none is found, return
      if (items.length === 0) {
        return petsData;
      }
      // remove pets that are in my pets list (in petFamilies)
      let filteredPets = petsData.pets.filter(
        pet => !myPetsIdArray.includes(pet.id),
      );
      // iterate pet object and update profile picture related attributes
      for (let pet of filteredPets) {
        // update profilepic's url and expiration time
        await getUrlForProfilePic(pet);
      }
      // Update petsData with the processed pets
      petsData.pets = filteredPets;
      return petsData;
    } catch (error) {
      console.log('error for fetching pets for community: ', error);
    } finally {
      setIsLoadingPets(false);
    }
  }
}

export async function getUrlForProfilePic(obj) {
  try {
    if (obj.profilePic && obj.profilePic.length > 0) {
      const getUrlResult = await retrieveS3UrlForOthers(
        obj.profilePic,
        obj.identityId,
      );
      obj.profilePicS3Key = obj.profilePic;
      obj.profilePic = getUrlResult.url.href;
      obj.s3UrlExpiredAt = getUrlResult.expiresAt.toString();
    }
    return obj;
  } catch (error) {
    console.log(
      'print error while getting profile pic url and expiration date: ',
      error,
    );
  }
}

export async function queryMyPetsPagination(
  userID,
  isLoadingPets,
  setIsLoadingPets,
  pageSize,
  token,
  filter,
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
            variables: {
              id: petFamilyItem.petID,
            },
            authMode: 'userPool',
          });
          const petObject = petDetails.data.getPet;
          if (filter !== null && petObject.accessLevel === 'Private') {
            return null;
          } else {
            // update profilepic's url and expiration time
            return await getUrlForProfilePic(petObject);
          }
        }),
      );
      petsData.pets = fetchPetDetails.filter(item => item !== null);
      return petsData;
    } catch (error) {
      console.log('error for fetching my pets from db: ', error);
    } finally {
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

    const s3Key = 'userProfile/' + uuid.v4() + '.jpeg';
    const responseFromS3 = await uploadImageToS3(
      s3Key,
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
    updateInputObject.profilePic = s3Key;
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
          'DynamoDB response from user profilePic update: ',
          response,
        );
      }
    } catch (error) {
      console.log('Inside checkAsyncStorageUserProfile: ', error);
    } finally {
      setIsCallingAPI(false);
    }
  }
}

export async function checkS3Url(s3UrlExpiredAt, s3Key) {
  if (new Date(Date.now()) >= new Date(s3UrlExpiredAt)) {
    const newPicInfo = retrieveS3Url(s3Key); // pet/user profile or background picture url is renewed
    const newUrl = newPicInfo.url.href;
    const newExpiresAt = newPicInfo.expiresAt.toString();
    return {
      profilePic: newUrl,
      s3UrlExpiredAt: newExpiresAt,
    };
  }
  return {
    profilePic: null,
    s3UrlExpiredAt: null,
  };
}

export async function checkS3UrlForOthers(
  type,
  s3UrlExpiredAt,
  s3Key,
  identityId,
) {
  if (new Date(Date.now()) >= new Date(s3UrlExpiredAt)) {
    // renew presigned url
    const newPicInfo = retrieveS3UrlForOthers(s3Key, identityId);
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
  return null;
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

export async function deletePetPage(
  isCallingUpdateAPI,
  setIsCallingUpdateAPI,
  petID,
  createInputVariables,
  alertBoxFunc,
) {
  if (!isCallingUpdateAPI) {
    setIsCallingUpdateAPI(true);
    const client = generateClient();
    // 1. get family members object array
    const response1 = await client.graphql({
      query: petPageFamilyMembers,
      variables: {
        petID: petID,
        nextToken: null,
        limit: 50,
      },
      authMode: 'userPool',
    });
    console.log(
      'print getting pet family members: ',
      response1.data.petPageFamilyMembers.items,
    );
    const petFamilyObjArray = response1.data.petPageFamilyMembers.items;
    // 2. delete family members from the petFamily table
    if (petFamilyObjArray.length > 0) {
      petFamilyObjArray.forEach(async obj => {
        try {
          await client.graphql({
            query: deletePetFamily,
            variables: {
              input: {
                petID: obj.petID,
                familyMemberID: obj.familyMemberID,
              },
            },
            authMode: 'userPool',
          });
        } catch (error) {
          console.error('Error deleting pet family member:', error);
        }
      });
    }
    // 3. move pet item from Pet table to InactivePet
    // 3-1 create a new item in InactivePet table
    // 3-2. delete the item from Pet table.
    await movePetToInactiveTable(createInputVariables, petID);
    alertBox('추모공간이 삭제되었습니다.', '', '확인', alertBoxFunc);
  }
  setIsCallingUpdateAPI(false);
}

export async function movePetToInactiveTable(createInputVariables, petID) {
  const client = generateClient();
  try {
    await client.graphql({
      query: migrateToInactivePet,
      variables: {input: createInputVariables},
      authMode: 'userPool',
    });
  } catch (e) {
    console.error('Error creating migrateToInactivePet :', e);
  }
  try {
    await client.graphql({
      query: deletePet,
      variables: {input: {id: petID}},
      authMode: 'userPool',
    });
  } catch (e) {
    console.error('Error deleting pet from PetTable :', e);
  }
}

export async function checkAdmin() {
  try {
    const {accessToken} = (await fetchAuthSession().tokens) ?? {};
    console.log('accessToken from checkAdmin: ', accessToken);
    if (Object.keys(accessToken).length === 0) {
      return false;
    }
    const groupsUserBelongTo = accessToken.payload['cognito:groups'];
    return groupsUserBelongTo.includes('admin');
  } catch (err) {
    console.log(err);
  }
}

export async function hasOneFamilyMember(petID) {
  const client = generateClient();
  const response = await client.graphql({
    query: petPageFamilyMembers,
    variables: {
      petID: petID,
      nextToken: null,
      limit: 2, // 가족 중 아무나 2명 가져오기
    },
    authMode: 'userPool',
  });
  return response.data.petPageFamilyMembers.items.length === 1;
}
