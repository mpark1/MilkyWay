/* Amplify Params - DO NOT EDIT
	API_MILKYWAY_GRAPHQLAPIENDPOINTOUTPUT
	API_MILKYWAY_GRAPHQLAPIIDOUTPUT
	API_MILKYWAY_USERTABLE_ARN
	API_MILKYWAY_USERTABLE_NAME
	AUTH_MILKYWAYB2DD3F99_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

// import uuid from 'react-native-uuid';
// import ImageResizer from '@bam.tech/react-native-image-resizer';
// import {uploadImageToS3} from '../../../../../src/utils/amplifyUtil';

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();

exports.handler = async (event, context) => {
  let date = new Date();

  // s3에 프로파일 사진 업로드
  const resizedProfilePic = await ImageResizer.createResizedImage(
    event.request.userAttributes.profilePic, // profilePic path grabbed from Cognito attributes
    300,
    300,
    'JPEG',
    100,
  );

  const photo = await fetch(resizedProfilePic.uri);
  const photoBlob = await photo.blob();

  const s3Result = await uploadImageToS3(
    // accessLevel: 'protected'
    '/profilePic/' + filename + '.jpeg',
    photoBlob,
    'image/jpeg',
  );
  console.log('Check post lambda profilePic upload to S3: ', s3Result);

  // Define the DynamoDB item
  const userParams = {
    TableName: process.env.API_MILKYWAY_USERTABLE_NAME,
    Item: {
      id: {S: event.request.userAttributes.sub},
      name: {S: event.request.userAttributes.name},
      email: {S: event.request.userAttributes.email},
      profilePic: {S: event.request.userAttributes['custom:profilePic']},
      state: {S: 'ACTIVE'},
      createdAt: {S: date.toISOString()},
      updatedAt: {S: date.toISOString()},
    },
  };

  try {
    // Put user's profile picture into
    // Put the user data into DynamoDB
    await dynamodb.putItem(userParams).promise();
    //return {response: 'User data added to DynamoDB successfully.'};
    return event;
  } catch (error) {
    //return {response: 'Error adding user data to DynamoDB'};
    return event;
  }
};
