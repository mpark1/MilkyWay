/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async event => {
  try {
    const petID = event.petID;
    const sizeLimit = event.limit;
    const nextToken = event.nextToken;
    const letters = await getLettersByPetID(petID, sizeLimit, nextToken);
    const lettersWithUserDetails = await Promise.all(
      letters.map(async letter => {
        const userDetails = await getUserDetails(letter.letterAuthorId);
        return {
          ...letter,
          authorName: userDetails.name,
          authorProfilePic: userDetails.profilePic,
        };
      }),
    );

    return lettersWithUserDetails;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching data');
  }
};

async function getLettersByPetID(petID, sizeLimit, nextToken) {
  const params = {
    TableName: 'Letter',
    KeyConditionExpression: 'petID = :petID',
    ExpressionAttributeValues: {
      ':petID': petID,
    },
    Limit: sizeLimit,
    nextToken: nextToken,
  };

  const result = await dynamoDb.query(params).promise();
  return result.Items;
}

async function getUserDetails(letterAuthorId) {
  const params = {
    TableName: 'User',
    Key: {
      id: letterAuthorId,
    },
  };

  const result = await dynamoDb.get(params).promise();
  return result.Item;
}
