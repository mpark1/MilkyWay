/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPet = /* GraphQL */ `
  query GetPet($id: ID!) {
    getPet(id: $id) {
      id
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
    $filter: ModelPetFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listPets(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
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
export const getPetFamily = /* GraphQL */ `
  query GetPetFamily($familyMemberID: ID!, $petID: ID!) {
    getPetFamily(familyMemberID: $familyMemberID, petID: $petID) {
      petID
      familyMemberID
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listPetFamilies = /* GraphQL */ `
  query ListPetFamilies(
    $familyMemberID: ID
    $petID: ModelIDKeyConditionInput
    $filter: ModelPetFamilyFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listPetFamilies(
      familyMemberID: $familyMemberID
      petID: $petID
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        petID
        familyMemberID
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
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      email
      profilePic
      name
      state
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
        email
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
        email
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
export const getAlbum = /* GraphQL */ `
  query GetAlbum($petID: ID!, $createdAt: String!, $id: ID!) {
    getAlbum(petID: $petID, createdAt: $createdAt, id: $id) {
      id
      petID
      category
      caption
      createdAt
      author {
        id
        email
        profilePic
        name
        state
        createdAt
        updatedAt
        owner
        __typename
      }
      imageType
      updatedAt
      albumAuthorId
      owner
      __typename
    }
  }
`;
export const listAlbums = /* GraphQL */ `
  query ListAlbums(
    $petID: ID
    $createdAtId: ModelAlbumPrimaryCompositeKeyConditionInput
    $filter: ModelAlbumFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listAlbums(
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
        category
        caption
        createdAt
        imageType
        updatedAt
        albumAuthorId
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const albumByCategory = /* GraphQL */ `
  query AlbumByCategory(
    $category: Int!
    $sortDirection: ModelSortDirection
    $filter: ModelAlbumFilterInput
    $limit: Int
    $nextToken: String
  ) {
    albumByCategory(
      category: $category
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        petID
        category
        caption
        createdAt
        imageType
        updatedAt
        albumAuthorId
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
