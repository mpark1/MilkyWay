/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPet = /* GraphQL */ `
  query GetPet($id: ID!, $SK: String!) {
    getPet(id: $id, SK: $SK) {
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
export const listPets = /* GraphQL */ `
  query ListPets(
    $id: ID
    $SK: ModelStringKeyConditionInput
    $filter: ModelPetFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listPets(
      id: $id
      SK: $SK
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const petByName = /* GraphQL */ `
  query PetByName(
    $name: String!
    $id: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPetFilterInput
    $limit: Int
    $nextToken: String
  ) {
    petByName(
      name: $name
      id: $id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const petsByAccessLevel = /* GraphQL */ `
  query PetsByAccessLevel(
    $accessLevel: String!
    $sortDirection: ModelSortDirection
    $filter: ModelPetFilterInput
    $limit: Int
    $nextToken: String
  ) {
    petsByAccessLevel(
      accessLevel: $accessLevel
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const petsByUser = /* GraphQL */ `
  query PetsByUser(
    $managerID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPetFilterInput
    $limit: Int
    $nextToken: String
  ) {
    petsByUser(
      managerID: $managerID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getIntroductionMessage = /* GraphQL */ `
  query GetIntroductionMessage($petID: ID!) {
    getIntroductionMessage(petID: $petID) {
      petID
      introductionMsg
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const getPetFamily = /* GraphQL */ `
  query GetPetFamily($petID: ID!, $familyMemberID: ID!) {
    getPetFamily(petID: $petID, familyMemberID: $familyMemberID) {
      petID
      familyMemberID
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
export const getLetter = /* GraphQL */ `
  query GetLetter($petID: ID!, $createdAt: String!, $id: ID!) {
    getLetter(petID: $petID, createdAt: $createdAt, id: $id) {
      id
      petID
      title
      relationship
      content
      createdAt
      letterAuthorId
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
      owner
      __typename
    }
  }
`;
export const listLetters = /* GraphQL */ `
  query ListLetters(
    $petID: ID
    $createdAtId: ModelLetterPrimaryCompositeKeyConditionInput
    $filter: ModelLetterFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listLetters(
      petID: $petID
      createdAtId: $createdAtId
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        petID
        title
        relationship
        content
        createdAt
        letterAuthorId
        accessLevel
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getGuestBook = /* GraphQL */ `
  query GetGuestBook($petID: ID!, $createdAt: String!, $id: ID!) {
    getGuestBook(petID: $petID, createdAt: $createdAt, id: $id) {
      id
      petID
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
      updatedAt
      guestBookAuthorId
      owner
      __typename
    }
  }
`;
export const listGuestBooks = /* GraphQL */ `
  query ListGuestBooks(
    $petID: ID
    $createdAtId: ModelGuestBookPrimaryCompositeKeyConditionInput
    $filter: ModelGuestBookFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listGuestBooks(
      petID: $petID
      createdAtId: $createdAtId
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        petID
        content
        createdAt
        updatedAt
        guestBookAuthorId
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
