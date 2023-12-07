/* Amplify Params - DO NOT EDIT
	API_MILKYWAY_GRAPHQLAPIENDPOINTOUTPUT
	API_MILKYWAY_GRAPHQLAPIIDOUTPUT
	API_MILKYWAY_GRAPHQLAPIKEYOUTPUT
	API_MILKYWAY_USERTABLE_ARN
	API_MILKYWAY_USERTABLE_NAME
	AUTH_MILKYWAYB2DD3F99_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();

exports.handler = async (event, context) => {
  let date = new Date();

  // Define the DynamoDB item
  const userParams = {
    TableName: process.env.USER, // Replace with your DynamoDB table name
    Item: {
      id: {S: event.request.userAttributes.sub},
      name: {S: event.request.userAttributes.name},
      email: {S: event.request.userAttributes.email},
      profilePic: {S: event.request.userAttributes['custom:profilePic']},
      createdAt: {S: date.toISOString()},
      updatedAt: {S: date.toISOString()},
    },
  };

  try {
    // Put the user data into DynamoDB
    await dynamodb.putItem(userParams).promise();
    console.log('User data added to DynamoDB successfully.');
  } catch (error) {
    console.error('Error adding user data to DynamoDB:', error);
  }
};
