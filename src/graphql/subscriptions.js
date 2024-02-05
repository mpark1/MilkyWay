/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePet = /* GraphQL */ `
  subscription OnCreatePet(
    $filter: ModelSubscriptionPetFilterInput
    $owner: String
  ) {
    onCreatePet(filter: $filter, owner: $owner) {
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
export const onUpdatePet = /* GraphQL */ `
  subscription OnUpdatePet(
    $filter: ModelSubscriptionPetFilterInput
    $owner: String
  ) {
    onUpdatePet(filter: $filter, owner: $owner) {
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
export const onDeletePet = /* GraphQL */ `
  subscription OnDeletePet(
    $filter: ModelSubscriptionPetFilterInput
    $owner: String
  ) {
    onDeletePet(filter: $filter, owner: $owner) {
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
export const onCreateInactivePet = /* GraphQL */ `
  subscription OnCreateInactivePet(
    $filter: ModelSubscriptionInactivePetFilterInput
    $owner: String
  ) {
    onCreateInactivePet(filter: $filter, owner: $owner) {
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
export const onDeleteInactivePet = /* GraphQL */ `
  subscription OnDeleteInactivePet(
    $filter: ModelSubscriptionInactivePetFilterInput
    $owner: String
  ) {
    onDeleteInactivePet(filter: $filter, owner: $owner) {
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
export const onCreatePetPageBackgroundImage = /* GraphQL */ `
  subscription OnCreatePetPageBackgroundImage(
    $filter: ModelSubscriptionPetPageBackgroundImageFilterInput
    $owner: String
  ) {
    onCreatePetPageBackgroundImage(filter: $filter, owner: $owner) {
      petID
      backgroundImageKey
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onUpdatePetPageBackgroundImage = /* GraphQL */ `
  subscription OnUpdatePetPageBackgroundImage(
    $filter: ModelSubscriptionPetPageBackgroundImageFilterInput
    $owner: String
  ) {
    onUpdatePetPageBackgroundImage(filter: $filter, owner: $owner) {
      petID
      backgroundImageKey
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onDeletePetPageBackgroundImage = /* GraphQL */ `
  subscription OnDeletePetPageBackgroundImage(
    $filter: ModelSubscriptionPetPageBackgroundImageFilterInput
    $owner: String
  ) {
    onDeletePetPageBackgroundImage(filter: $filter, owner: $owner) {
      petID
      backgroundImageKey
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
export const onCreateGuestBook = /* GraphQL */ `
  subscription OnCreateGuestBook(
    $filter: ModelSubscriptionGuestBookFilterInput
    $owner: String
  ) {
    onCreateGuestBook(filter: $filter, owner: $owner) {
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
export const onUpdateGuestBook = /* GraphQL */ `
  subscription OnUpdateGuestBook(
    $filter: ModelSubscriptionGuestBookFilterInput
    $owner: String
  ) {
    onUpdateGuestBook(filter: $filter, owner: $owner) {
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
export const onDeleteGuestBook = /* GraphQL */ `
  subscription OnDeleteGuestBook(
    $filter: ModelSubscriptionGuestBookFilterInput
    $owner: String
  ) {
    onDeleteGuestBook(filter: $filter, owner: $owner) {
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
export const onCreateAlbum = /* GraphQL */ `
  subscription OnCreateAlbum(
    $filter: ModelSubscriptionAlbumFilterInput
    $owner: String
  ) {
    onCreateAlbum(filter: $filter, owner: $owner) {
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
export const onUpdateAlbum = /* GraphQL */ `
  subscription OnUpdateAlbum(
    $filter: ModelSubscriptionAlbumFilterInput
    $owner: String
  ) {
    onUpdateAlbum(filter: $filter, owner: $owner) {
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
export const onDeleteAlbum = /* GraphQL */ `
  subscription OnDeleteAlbum(
    $filter: ModelSubscriptionAlbumFilterInput
    $owner: String
  ) {
    onDeleteAlbum(filter: $filter, owner: $owner) {
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
export const onCreateManager = /* GraphQL */ `
  subscription OnCreateManager($filter: ModelSubscriptionManagerFilterInput) {
    onCreateManager(filter: $filter) {
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
export const onUpdateManager = /* GraphQL */ `
  subscription OnUpdateManager($filter: ModelSubscriptionManagerFilterInput) {
    onUpdateManager(filter: $filter) {
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
export const onDeleteManager = /* GraphQL */ `
  subscription OnDeleteManager($filter: ModelSubscriptionManagerFilterInput) {
    onDeleteManager(filter: $filter) {
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
