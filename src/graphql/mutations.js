/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPet = /* GraphQL */ `
  mutation CreatePet(
    $input: CreatePetInput!
    $condition: ModelPetConditionInput
  ) {
    createPet(input: $input, condition: $condition) {
      id
      SK
      entity
      profilePic
      name
      birthday
      deathDay
      lastWord
      accessLevel
      introductionMsg
      state
      managerID
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const updatePet = /* GraphQL */ `
  mutation UpdatePet(
    $input: UpdatePetInput!
    $condition: ModelPetConditionInput
  ) {
    updatePet(input: $input, condition: $condition) {
      id
      SK
      entity
      profilePic
      name
      birthday
      deathDay
      lastWord
      accessLevel
      introductionMsg
      state
      managerID
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const createPetFamily = /* GraphQL */ `
  mutation CreatePetFamily(
    $input: CreatePetFamilyInput!
    $condition: ModelPetFamilyConditionInput
  ) {
    createPetFamily(input: $input, condition: $condition) {
      petID
      familyMemberID
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const deletePetFamily = /* GraphQL */ `
  mutation DeletePetFamily(
    $input: DeletePetFamilyInput!
    $condition: ModelPetFamilyConditionInput
  ) {
    deletePetFamily(input: $input, condition: $condition) {
      petID
      familyMemberID
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      profilePic
      name
      state
      petList {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      profilePic
      name
      state
      petList {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const createLetter = /* GraphQL */ `
  mutation CreateLetter(
    $input: CreateLetterInput!
    $condition: ModelLetterConditionInput
  ) {
    createLetter(input: $input, condition: $condition) {
      id
      petID
      entity
      title
      relationship
      createdAt
      updatedAt
      content
      author {
        id
        profilePic
        name
        state
        createdAt
        updatedAt
        owner
        __typename
      }
      accessLevel
      letterAuthorId
      owner
      __typename
    }
  }
`;
export const updateLetter = /* GraphQL */ `
  mutation UpdateLetter(
    $input: UpdateLetterInput!
    $condition: ModelLetterConditionInput
  ) {
    updateLetter(input: $input, condition: $condition) {
      id
      petID
      entity
      title
      relationship
      createdAt
      updatedAt
      content
      author {
        id
        profilePic
        name
        state
        createdAt
        updatedAt
        owner
        __typename
      }
      accessLevel
      letterAuthorId
      owner
      __typename
    }
  }
`;
export const deleteLetter = /* GraphQL */ `
  mutation DeleteLetter(
    $input: DeleteLetterInput!
    $condition: ModelLetterConditionInput
  ) {
    deleteLetter(input: $input, condition: $condition) {
      id
      petID
      entity
      title
      relationship
      createdAt
      updatedAt
      content
      author {
        id
        profilePic
        name
        state
        createdAt
        updatedAt
        owner
        __typename
      }
      accessLevel
      letterAuthorId
      owner
      __typename
    }
  }
`;
