/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePet = /* GraphQL */ `
  subscription OnCreatePet(
    $filter: ModelSubscriptionPetFilterInput
    $owner: String
  ) {
    onCreatePet(filter: $filter, owner: $owner) {
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
export const onUpdatePet = /* GraphQL */ `
  subscription OnUpdatePet(
    $filter: ModelSubscriptionPetFilterInput
    $owner: String
  ) {
    onUpdatePet(filter: $filter, owner: $owner) {
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
export const onCreatePetFamily = /* GraphQL */ `
  subscription OnCreatePetFamily(
    $filter: ModelSubscriptionPetFamilyFilterInput
    $owner: String
  ) {
    onCreatePetFamily(filter: $filter, owner: $owner) {
      petID
      familyMemberID
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onDeletePetFamily = /* GraphQL */ `
  subscription OnDeletePetFamily(
    $filter: ModelSubscriptionPetFamilyFilterInput
    $owner: String
  ) {
    onDeletePetFamily(filter: $filter, owner: $owner) {
      petID
      familyMemberID
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onCreateLetter = /* GraphQL */ `
  subscription OnCreateLetter(
    $filter: ModelSubscriptionLetterFilterInput
    $owner: String
  ) {
    onCreateLetter(filter: $filter, owner: $owner) {
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
export const onUpdateLetter = /* GraphQL */ `
  subscription OnUpdateLetter(
    $filter: ModelSubscriptionLetterFilterInput
    $owner: String
  ) {
    onUpdateLetter(filter: $filter, owner: $owner) {
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
export const onDeleteLetter = /* GraphQL */ `
  subscription OnDeleteLetter(
    $filter: ModelSubscriptionLetterFilterInput
    $owner: String
  ) {
    onDeleteLetter(filter: $filter, owner: $owner) {
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
