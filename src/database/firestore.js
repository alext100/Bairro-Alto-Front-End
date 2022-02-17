/* eslint-disable no-use-before-define */

import { firestoreDb } from "@/database";

import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  deleteField,
  doc,
  endAt,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  startAfter,
  startAt,
  updateDoc,
  where,
} from "firebase/firestore";

const USERS_PATH = "users";
const ROOMS_PATH = "chatRooms";
const MESSAGES_PATH = "messages";
const MESSAGE_PATH = (roomId) => `${ROOMS_PATH}/${roomId}/${MESSAGES_PATH}`;

const TIMESTAMP_FIELD = "timestamp";
const LAST_UPDATED_FIELD = "lastUpdated";
const TYPING_USERS_FIELD = "typingUsers";
const MESSAGE_REACTIONS_FIELD = "reactions";
const ROOM_USERS_FIELD = "users";

export const firestoreListener = onSnapshot;
export const deleteDbField = deleteField();

const getDocuments = (queryD) =>
  getDocs(queryD).then((docs) => ({ data: formatQueryDataArray(docs), docs: docs.docs }));

const getDocument = (ref) => getDoc(ref).then((docGet) => formatQueryDataObject(docGet));

const addDocument = (ref, data) => addDoc(ref, data);

const setDocument = (path, docId, data) => setDoc(doc(firestoreDb, path, docId), data);

const updateDocument = (ref, data) => updateDoc(ref, data);

const deleteDocument = (ref, docId) => deleteDoc(doc(firestoreDb, ref, docId));

// USERS
const usersRef = collection(firestoreDb, USERS_PATH);

const userRef = (userId) => doc(firestoreDb, USERS_PATH, userId);

export const getAllUsers = () => getDocuments(query(usersRef));

export const getUser = (userId) => getDocument(userRef(userId));

export const addUser = (data) => addDocument(usersRef, data);

export const addIdentifiedUser = (userId, data) => setDocument(USERS_PATH, userId, data);

export const updateUser = (userId, data) => updateDocument(userRef(userId), data);

export const deleteUser = (userId) => deleteDocument(USERS_PATH, userId);

// ROOMS
const roomsRef = collection(firestoreDb, ROOMS_PATH);

const roomRef = (roomId) => doc(firestoreDb, ROOMS_PATH, roomId);

export const roomsQuery = (currentUserId, roomsPerPage, lastRoom) => {
  if (lastRoom) {
    return query(
      roomsRef,
      where(USERS_PATH, "array-contains", currentUserId),
      orderBy(LAST_UPDATED_FIELD, "desc"),
      limit(roomsPerPage),
      startAfter(lastRoom)
    );
  }
  return query(
    roomsRef,
    where(USERS_PATH, "array-contains", currentUserId),
    orderBy(LAST_UPDATED_FIELD, "desc"),
    limit(roomsPerPage)
  );
};

export const getAllRooms = () => getDocuments(query(roomsRef));

export const getRooms = (queryR) => getDocuments(queryR);

export const addRoom = (data) => addDocument(roomsRef, data);

export const updateRoom = (roomId, data) => updateDocument(roomRef(roomId), data);

export const deleteRoom = (roomId) => deleteDocument(ROOMS_PATH, roomId);

export const getUserRooms = (currentUserId, userId) =>
  getDocuments(query(roomsRef, where(USERS_PATH, "==", [currentUserId, userId])));

export const addRoomUser = (roomId, usersId) =>
  usersId.forEach((userId) =>
    updateRoom(roomId, {
      [ROOM_USERS_FIELD]: arrayUnion(userId),
    })
  );

export const removeRoomUser = (roomId, userId) =>
  updateRoom(roomId, {
    [ROOM_USERS_FIELD]: arrayRemove(userId),
  });

export const updateRoomTypingUsers = (roomId, currentUserId, action) => {
  const arrayUpdate = action === "add" ? arrayUnion(currentUserId) : arrayRemove(currentUserId);

  return updateRoom(roomId, { [TYPING_USERS_FIELD]: arrayUpdate });
};

// MESSAGES
const messagesRef = (roomId) => collection(firestoreDb, MESSAGE_PATH(roomId));

const messageRef = (roomId, messageId) => doc(firestoreDb, MESSAGE_PATH(roomId), messageId);

export const getMessages = (roomId, messagesPerPage, lastLoadedMessage) => {
  if (lastLoadedMessage) {
    return getDocuments(
      query(
        messagesRef(roomId),
        orderBy(TIMESTAMP_FIELD, "desc"),
        limit(messagesPerPage),
        startAfter(lastLoadedMessage)
      )
    );
  }
  if (messagesPerPage) {
    return getDocuments(query(messagesRef(roomId), orderBy(TIMESTAMP_FIELD, "desc"), limit(messagesPerPage)));
  }
  return getDocuments(messagesRef(roomId));
};

export const getMessage = (roomId, messageId) => getDocument(messageRef(roomId, messageId));

export const addMessage = (roomId, data) => addDocument(messagesRef(roomId), data);

export const updateMessage = (roomId, messageId, data) => updateDocument(messageRef(roomId, messageId), data);

export const deleteMessage = (roomId, messageId) => deleteDocument(MESSAGE_PATH(roomId), messageId);

export const listenRooms = (queryR, callback) =>
  firestoreListener(queryR, (rooms) => {
    callback(formatQueryDataArray(rooms));
  });

export const paginatedMessagesQuery = (roomId, lastLoadedMessage, previousLastLoadedMessage) => {
  if (lastLoadedMessage && previousLastLoadedMessage) {
    return query(
      messagesRef(roomId),
      orderBy(TIMESTAMP_FIELD),
      startAt(lastLoadedMessage),
      endAt(previousLastLoadedMessage)
    );
  }
  if (lastLoadedMessage) {
    return query(messagesRef(roomId), orderBy(TIMESTAMP_FIELD), startAt(lastLoadedMessage));
  }
  if (previousLastLoadedMessage) {
    return query(messagesRef(roomId), orderBy(TIMESTAMP_FIELD), endAt(previousLastLoadedMessage));
  }
  return query(messagesRef(roomId), orderBy(TIMESTAMP_FIELD));
};

export const listenMessages = (roomId, lastLoadedMessage, previousLastLoadedMessage, callback) =>
  firestoreListener(paginatedMessagesQuery(roomId, lastLoadedMessage, previousLastLoadedMessage), (messages) => {
    callback(formatQueryDataArray(messages));
  });

const formatQueryDataObject = (queryData) => ({ ...queryData.data(), id: queryData.id });

const formatQueryDataArray = (queryDataArray) => {
  const formattedData = [];

  queryDataArray.forEach((data) => {
    formattedData.push(formatQueryDataObject(data));
  });
  return formattedData;
};

const lastMessageQuery = (roomId) => query(messagesRef(roomId), orderBy(TIMESTAMP_FIELD, "desc"), limit(1));

export const listenLastMessage = (roomId, callback) =>
  firestoreListener(query(lastMessageQuery(roomId)), (messages) => {
    callback(formatQueryDataArray(messages));
  });

export const updateMessageReactions = (roomId, messageId, currentUserId, reactionUnicode, action) => {
  const arrayUpdate = action === "add" ? arrayUnion(currentUserId) : arrayRemove(currentUserId);

  return updateMessage(roomId, messageId, {
    [`${MESSAGE_REACTIONS_FIELD}.${reactionUnicode}`]: arrayUpdate,
  });
};
