// Helper function to setup subscription
import {queryUser, retrieveS3Url, retrieveS3UrlForOthers} from './amplifyUtil';
import {generateClient} from 'aws-amplify/api';
import {getUser} from '../graphql/queries';
import {list} from 'aws-amplify/storage';

export async function petPageTabsSubscription(
  client,
  subscriptionQuery,
  mutationType,
  processSubscriptionData,
  petID,
) {
  try {
    return client
      .graphql({
        query: subscriptionQuery,
        variables: {filter: {petID: {eq: petID}}},
        authMode: 'userPool',
      })
      .subscribe({
        next: ({data}) => processSubscriptionData(mutationType, data),
        error: error => console.warn(error),
      });
  } catch (error) {
    console.log('print error for subscription processing in utilpage', error);
  }
}

export async function processUpdateSubscription(letterArray, updatedObj) {
  try {
    const updatedLettersArray = await Promise.all(
      letterArray.map(async letter => {
        if (letter.id === updatedObj.id) {
          return await addUserDetailsToNewObj(updatedObj);
        } else {
          return letter;
        }
      }),
    );
    return updatedLettersArray;
  } catch (error) {
    console.log(
      'print error during updating letters array after onUpdateLetter',
      error,
    );
  }
}

export async function addUserDetailsToNewObj(updatedObj) {
  try {
    // get user's profile picture from s3
    if (
      updatedObj.author.profilePic &&
      updatedObj.author.profilePic.length !== 0
    ) {
      console.log(
        "print added obj's author, profilepic: ",
        updatedObj.author.profilePic,
      );
      const urlResult = await retrieveS3UrlForOthers(
        updatedObj.author.profilePic,
        updatedObj.identityId,
      );
      console.log('print url for profilepic: ', urlResult);
      return {
        ...updatedObj,
        userName: updatedObj.author.name,
        profilePicS3Key: updatedObj.author.profilePic,
        profilePic: urlResult.url.href,
        s3UrlExpiredAt: urlResult.expiresAt.toString(),
      };
    } else {
      return {
        ...updatedObj,
        userName: updatedObj.author.name,
        profilePic: '',
      };
    }
  } catch (userError) {
    console.error('Error fetching user details: ', userError);
    return updatedObj; // Return original letter if fetching user details fails
  }
}

export async function fetchImageArrayForOneAlbumFromS3(albumObj) {
  try {
    // returns all image objects from s3 bucket
    const s3response = await list({
      prefix: 'album/' + albumObj.s3Folder + '/',
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
    return albumObj;
  } catch (error) {
    console.log('print error while getting images from S3', error);
  }
}
