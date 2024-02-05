/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPet = /* GraphQL */ `
  mutation CreatePet(
    $input: CreatePetInput!
    $condition: ModelPetConditionInput
  ) {
    createPet(input: $input, condition: $condition) {
      id
      profilePic
      name
      birthday
      deathDay
      lastWord
      accessLevel
      deathCause
      identityId
      petType
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
      profilePic
      name
      birthday
      deathDay
      lastWord
      accessLevel
      deathCause
      identityId
      petType
      managerID
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const deletePet = /* GraphQL */ `
  mutation DeletePet(
    $input: DeletePetInput!
    $condition: ModelPetConditionInput
  ) {
    deletePet(input: $input, condition: $condition) {
      id
      profilePic
      name
      birthday
      deathDay
      lastWord
      accessLevel
      deathCause
      identityId
      petType
      managerID
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const migrateToInactivePet = /* GraphQL */ `
  mutation MigrateToInactivePet(
    $input: CreateInactivePetInput!
    $condition: ModelInactivePetConditionInput
  ) {
    migrateToInactivePet(input: $input, condition: $condition) {
      id
      profilePic
      name
      birthday
      deathDay
      lastWord
      deathCause
      identityId
      petType
      managerID
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const deleteInactivePet = /* GraphQL */ `
  mutation DeleteInactivePet(
    $input: DeleteInactivePetInput!
    $condition: ModelInactivePetConditionInput
  ) {
    deleteInactivePet(input: $input, condition: $condition) {
      id
      profilePic
      name
      birthday
      deathDay
      lastWord
      deathCause
      identityId
      petType
      managerID
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const createPetPageBackgroundImage = /* GraphQL */ `
  mutation CreatePetPageBackgroundImage(
    $input: CreatePetPageBackgroundImageInput!
    $condition: ModelPetPageBackgroundImageConditionInput
  ) {
    createPetPageBackgroundImage(input: $input, condition: $condition) {
      petID
      backgroundImageKey
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const updatePetPageBackgroundImage = /* GraphQL */ `
  mutation UpdatePetPageBackgroundImage(
    $input: UpdatePetPageBackgroundImageInput!
    $condition: ModelPetPageBackgroundImageConditionInput
  ) {
    updatePetPageBackgroundImage(input: $input, condition: $condition) {
      petID
      backgroundImageKey
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const deletePetPageBackgroundImage = /* GraphQL */ `
  mutation DeletePetPageBackgroundImage(
    $input: DeletePetPageBackgroundImageInput!
    $condition: ModelPetPageBackgroundImageConditionInput
  ) {
    deletePetPageBackgroundImage(input: $input, condition: $condition) {
      petID
      backgroundImageKey
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
export const createPetIntroduction = /* GraphQL */ `
  mutation CreatePetIntroduction(
    $input: CreatePetIntroductionInput!
    $condition: ModelPetIntroductionConditionInput
  ) {
    createPetIntroduction(input: $input, condition: $condition) {
      petID
      introductionMsg
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const updatePetIntroduction = /* GraphQL */ `
  mutation UpdatePetIntroduction(
    $input: UpdatePetIntroductionInput!
    $condition: ModelPetIntroductionConditionInput
  ) {
    updatePetIntroduction(input: $input, condition: $condition) {
      petID
      introductionMsg
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const deletePetIntroduction = /* GraphQL */ `
  mutation DeletePetIntroduction(
    $input: DeletePetIntroductionInput!
    $condition: ModelPetIntroductionConditionInput
  ) {
    deletePetIntroduction(input: $input, condition: $condition) {
      petID
      introductionMsg
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
      email
      profilePic
      name
      state
      createdAt
      updatedAt
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
      email
      profilePic
      name
      state
      createdAt
      updatedAt
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
      title
      relationship
      content
      createdAt
      letterAuthorId
      identityId
      author {
        id
        email
        profilePic
        name
        state
        createdAt
        updatedAt
        __typename
      }
      accessLevel
      updatedAt
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
      title
      relationship
      content
      createdAt
      letterAuthorId
      identityId
      author {
        id
        email
        profilePic
        name
        state
        createdAt
        updatedAt
        __typename
      }
      accessLevel
      updatedAt
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
      title
      relationship
      content
      createdAt
      letterAuthorId
      identityId
      author {
        id
        email
        profilePic
        name
        state
        createdAt
        updatedAt
        __typename
      }
      accessLevel
      updatedAt
      owner
      __typename
    }
  }
`;
export const createGuestBook = /* GraphQL */ `
  mutation CreateGuestBook(
    $input: CreateGuestBookInput!
    $condition: ModelGuestBookConditionInput
  ) {
    createGuestBook(input: $input, condition: $condition) {
      id
      petID
      content
      createdAt
      identityId
      author {
        id
        email
        profilePic
        name
        state
        createdAt
        updatedAt
        __typename
      }
      updatedAt
      guestBookAuthorId
      owner
      __typename
    }
  }
`;
export const updateGuestBook = /* GraphQL */ `
  mutation UpdateGuestBook(
    $input: UpdateGuestBookInput!
    $condition: ModelGuestBookConditionInput
  ) {
    updateGuestBook(input: $input, condition: $condition) {
      id
      petID
      content
      createdAt
      identityId
      author {
        id
        email
        profilePic
        name
        state
        createdAt
        updatedAt
        __typename
      }
      updatedAt
      guestBookAuthorId
      owner
      __typename
    }
  }
`;
export const deleteGuestBook = /* GraphQL */ `
  mutation DeleteGuestBook(
    $input: DeleteGuestBookInput!
    $condition: ModelGuestBookConditionInput
  ) {
    deleteGuestBook(input: $input, condition: $condition) {
      id
      petID
      content
      createdAt
      identityId
      author {
        id
        email
        profilePic
        name
        state
        createdAt
        updatedAt
        __typename
      }
      updatedAt
      guestBookAuthorId
      owner
      __typename
    }
  }
`;
export const createAlbum = /* GraphQL */ `
  mutation CreateAlbum(
    $input: CreateAlbumInput!
    $condition: ModelAlbumConditionInput
  ) {
    createAlbum(input: $input, condition: $condition) {
      id
      petID
      category
      caption
      createdAt
      authorIdentityID
      imageType
      widthHeight
      s3Folder
      updatedAt
      owner
      __typename
    }
  }
`;
export const updateAlbum = /* GraphQL */ `
  mutation UpdateAlbum(
    $input: UpdateAlbumInput!
    $condition: ModelAlbumConditionInput
  ) {
    updateAlbum(input: $input, condition: $condition) {
      id
      petID
      category
      caption
      createdAt
      authorIdentityID
      imageType
      widthHeight
      s3Folder
      updatedAt
      owner
      __typename
    }
  }
`;
export const deleteAlbum = /* GraphQL */ `
  mutation DeleteAlbum(
    $input: DeleteAlbumInput!
    $condition: ModelAlbumConditionInput
  ) {
    deleteAlbum(input: $input, condition: $condition) {
      id
      petID
      category
      caption
      createdAt
      authorIdentityID
      imageType
      widthHeight
      s3Folder
      updatedAt
      owner
      __typename
    }
  }
`;
export const createManager = /* GraphQL */ `
  mutation CreateManager(
    $input: CreateManagerInput!
    $condition: ModelManagerConditionInput
  ) {
    createManager(input: $input, condition: $condition) {
      id
      petID
      requesterID
      category
      clientMessage
      status
      adminComment
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateManager = /* GraphQL */ `
  mutation UpdateManager(
    $input: UpdateManagerInput!
    $condition: ModelManagerConditionInput
  ) {
    updateManager(input: $input, condition: $condition) {
      id
      petID
      requesterID
      category
      clientMessage
      status
      adminComment
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteManager = /* GraphQL */ `
  mutation DeleteManager(
    $input: DeleteManagerInput!
    $condition: ModelManagerConditionInput
  ) {
    deleteManager(input: $input, condition: $condition) {
      id
      petID
      requesterID
      category
      clientMessage
      status
      adminComment
      createdAt
      updatedAt
      __typename
    }
  }
`;
