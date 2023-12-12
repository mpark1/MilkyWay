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
      profilePic
      name
      birthday
      deathDay
      lastWord
      accessLevel
      state
      deathCause
      petType
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
      profilePic
      name
      birthday
      deathDay
      lastWord
      accessLevel
      state
      deathCause
      petType
      managerID
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onCreatePetIntroduction = /* GraphQL */ `
  subscription OnCreatePetIntroduction(
    $filter: ModelSubscriptionPetIntroductionFilterInput
    $owner: String
  ) {
    onCreatePetIntroduction(filter: $filter, owner: $owner) {
      petID
      introductionMsg
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onUpdatePetIntroduction = /* GraphQL */ `
  subscription OnUpdatePetIntroduction(
    $filter: ModelSubscriptionPetIntroductionFilterInput
    $owner: String
  ) {
    onUpdatePetIntroduction(filter: $filter, owner: $owner) {
      petID
      introductionMsg
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onDeletePetIntroduction = /* GraphQL */ `
  subscription OnDeletePetIntroduction(
    $filter: ModelSubscriptionPetIntroductionFilterInput
    $owner: String
  ) {
    onDeletePetIntroduction(filter: $filter, owner: $owner) {
      petID
      introductionMsg
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
      title
      relationship
      content
      createdAt
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
      updatedAt
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
      title
      relationship
      content
      createdAt
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
      updatedAt
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
      title
      relationship
      content
      createdAt
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
      updatedAt
      letterAuthorId
      owner
      __typename
    }
  }
`;
