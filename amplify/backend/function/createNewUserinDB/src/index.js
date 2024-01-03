/* Amplify Params - DO NOT EDIT
	API_MILKYWAY_GRAPHQLAPIENDPOINTOUTPUT
	API_MILKYWAY_GRAPHQLAPIIDOUTPUT
	API_MILKYWAY_USERTABLE_ARN
	API_MILKYWAY_USERTABLE_NAME
	AUTH_MILKYWAYB2DD3F99_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

import uuid from 'react-native-uuid';

const AWS = require('aws-sdk');
// const {uploadImageToS3} = require("../../../../../src/utils/amplifyUtil");
const dynamodb = new AWS.DynamoDB();
const S3 = new AWS.S3();

exports.handler = async (event, context) => {
  let date = new Date();

  // const s3Params = {
  //   key: 'profilePic/' + uuid.v4() + '.jpeg',
  //     data: photoBlob,
  //     options: {
  //   accessLevel: 'protected',
  //       contentType: 'image/jpeg',
  // }}

  // Define the DynamoDB item
  const userParams = {
    TableName: process.env.API_MILKYWAY_USERTABLE_NAME, // Replace with your DynamoDB table name
    Item: {
      id: {S: event.request.userAttributes.sub},
      name: {S: event.request.userAttributes.name},
      email: {S: event.request.userAttributes.email},
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
