<template>
  <div class="window-container" :class="{ 'window-mobile': isDevice }">
    <form v-if="addNewRoom" @submit.prevent="createRoom">
      <n-select
        multiple
        v-model:value="multipleValue"
        :options="options"
        :render-label="renderLabel"
        :render-tag="renderMultipleSelectTag"
        filterable
        placeholder="Добавить пользователей"
        type="text"
      />
      <button type="submit" :disabled="disableForm || !options">Создать новый чат</button>
      <button class="button-cancel" @click="addNewRoom = false">Отменить</button>
    </form>

    <form v-if="inviteRoomId" @submit.prevent="addRoomUser">
      <n-select
        multiple
        v-model:value="multipleValue"
        :options="options"
        :render-label="renderLabel"
        :render-tag="renderMultipleSelectTag"
        filterable
        placeholder="Добавить пользователей"
        type="text"
      />
      <button type="submit" :disabled="disableForm || !options">Добавить пользователя</button>
      <button class="button-cancel" @click="inviteRoomId = null">Отменить</button>
    </form>

    <form v-if="removeRoomId" @submit.prevent="deleteRoomUser">
      <select v-model="removeUserId">
        <option default value="">Select User</option>
        <option v-for="user in removeUsers" :key="user._id" :value="user._id">
          {{ user.username }}
        </option>
      </select>
      <button type="submit" :disabled="disableForm || !removeUserId">Удалить пользователя</button>
      <button class="button-cancel" @click="removeRoomId = null">Отменить</button>
    </form>

    <vue-advanced-chat
      :height="screenHeight"
      :theme="theme"
      :styles="JSON.stringify(styles)"
      :current-user-id="currentUserId"
      :room-id="roomId"
      :rooms="JSON.stringify(loadedRooms)"
      :loading-rooms="loadingRooms"
      :messages="JSON.stringify(messages)"
      :messages-loaded="messagesLoaded"
      :rooms-loaded="roomsLoaded"
      :room-message="roomMessage"
      :room-actions="JSON.stringify(roomActions)"
      :menu-actions="JSON.stringify(menuActions)"
      :message-selection-actions="JSON.stringify(messageSelectionActions)"
      :templates-text="JSON.stringify(templatesText)"
      @fetch-messages="fetchMessages($event.detail[0])"
      @send-message="sendMessage($event.detail[0])"
      @edit-message="editMessage($event.detail[0])"
      @delete-message="deleteMessage($event.detail[0])"
      @open-file="openFile($event.detail[0])"
      @open-user-tag="openUserTag($event.detail[0])"
      @add-room="addRoom($event.detail[0])"
      @room-action-handler="menuActionHandler($event.detail[0])"
      @menu-action-handler="menuActionHandler($event.detail[0])"
      @message-selection-action-handler="messageSelectionActionHandler($event.detail[0])"
      @send-message-reaction="sendMessageReaction($event.detail[0])"
      @typing-message="typingMessage($event.detail[0])"
      @toggle-rooms-list="$emit('show-demo-options', $event.detail[0].opened)"
      :text-messages="JSON.stringify(textMessages)"
    >
    </vue-advanced-chat>
  </div>
</template>

<script>
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import * as firebaseService from "@/database/firebase";
import * as firestoreService from "@/database/firestore";
import * as storageService from "@/database/storage";
import { formatTimestamp, parseTimestamp } from "@/utils/dates";
import { NAvatar, NSelect, NTag, NText } from "naive-ui";
import { computed, h, onMounted, ref } from "vue";
import { register } from "vue-advanced-chat";
import { mapState, useStore } from "vuex";

export default {
  components: {
    NSelect,
  },

  props: {
    currentUserId: { type: String, required: true },
    theme: { type: String, required: true },
    isDevice: { type: Boolean, required: true },
  },

  emits: ["show-demo-options"],

  data() {
    return {
      roomsPerPage: 15,
      rooms: [],
      roomId: "",
      startRooms: null,
      endRooms: null,
      roomsLoaded: false,
      loadingRooms: true,
      allUsers: [],
      loadingLastMessageByRoom: 0,
      roomsLoadedCount: false,
      selectedRoom: null,
      messagesPerPage: 20,
      messages: [],
      messagesLoaded: false,
      roomMessage: "",
      lastLoadedMessage: null,
      previousLastLoadedMessage: null,
      roomsListeners: [],
      listeners: [],
      typingMessageCache: "",
      disableForm: false,
      addNewRoom: null,
      inviteRoomId: null,
      removeRoomId: null,
      removeUserId: "",
      removeUsers: [],
      roomActions: [
        { name: "inviteUser", title: "Пригласить пользователя" },
        { name: "removeUser", title: "Удалить пользователя" },
        { name: "deleteRoom", title: "Удалить чат" },
      ],
      menuActions: [
        { name: "inviteUser", title: "Пригласить пользователя" },
        { name: "removeUser", title: "Удалить пользователя" },
        { name: "deleteRoom", title: "Удалить чат" },
      ],
      messageSelectionActions: [{ name: "deleteMessages", title: "Delete" }],
      styles: { container: { borderRadius: "4px" } },
      templatesText: [
        {
          tag: "help",
          text: "This is the help",
        },
        {
          tag: "action",
          text: "This is the action",
        },
        {
          tag: "action 2",
          text: "This is the second action",
        },
      ],

      textMessages: {
        ROOMS_EMPTY: "Нет чатов",
        ROOM_EMPTY: "Комната не выбрана",
        NEW_MESSAGES: "Новые сообщения",
        MESSAGE_DELETED: "Это сообщение было удалено",
        MESSAGES_EMPTY: "Нет сообщений",
        CONVERSATION_STARTED: "Разговор начался:",
        TYPE_MESSAGE: "Напишите сообщение...",
        SEARCH: "Поиск",
        IS_ONLINE: "Онлайн",
        LAST_SEEN: "был онлайн ",
        IS_TYPING: "печатает...",
        CANCEL_SELECT_MESSAGE: "Отменить выделение",
      },
      // ,dbRequestCount: 0
    };
  },

  setup() {
    const { state, dispatch } = useStore();

    const getOptionsToShow = () =>
      state.allUsers.map((user) => ({
        label: `${user.firstName} ${user.lastName}`,
        value: user.id,
        description: user.email,
      }));

    onMounted(() => {
      register();
      dispatch("getAllUsersFromApi");
    });

    const renderMultipleSelectTag = ({ option, handleClose }) =>
      h(
        NTag,
        {
          style: {
            padding: "0 6px 0 4px",
          },
          round: true,
          closable: true,
          onClose: (e) => {
            e.stopPropagation();
            handleClose();
          },
        },
        {
          default: () =>
            h(
              "div",
              {
                style: {
                  display: "flex",
                  alignItems: "center",
                },
              },
              [
                h(NAvatar, {
                  src: "https://storage.googleapis.com/bairro-alto.appspot.com/tile-1648000761200.webp",
                  round: true,
                  size: 22,
                  style: {
                    marginRight: "4px",
                  },
                }),
                option.label,
              ]
            ),
        }
      );
    const renderSingleSelectTag = ({ option }) =>
      h(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
          },
        },
        [
          h(NAvatar, {
            src: "https://storage.googleapis.com/bairro-alto.appspot.com/tile-1648000761200.webp",
            round: true,
            size: 24,
            style: {
              marginRight: "12px",
            },
          }),
          option.label,
        ]
      );
    const renderLabel = (option) =>
      h(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
          },
        },
        [
          h(NAvatar, {
            src: "",
            round: true,
            size: "small",
          }),
          h(
            "div",
            {
              style: {
                marginLeft: "12px",
                padding: "4px 0",
              },
            },
            [
              h("div", null, [option.label]),
              h(
                NText,
                { depth: 3, tag: "div" },
                {
                  default: () => option.description,
                }
              ),
            ]
          ),
        ]
      );
    return {
      multipleValue: ref(null),
      options: computed(() => getOptionsToShow()),
      renderMultipleSelectTag,
      renderSingleSelectTag,
      renderLabel,
    };
  },

  computed: {
    loadedRooms() {
      return this.rooms.slice(0, this.roomsLoadedCount);
    },
    screenHeight() {
      return this.isDevice ? `${window.innerHeight}px` : "calc(100vh - 80px)";
    },
  },

  mounted() {
    this.fetchRooms();
    firebaseService.updateUserOnlineStatus(this.currentUserId);
  },

  methods: {
    ...mapState(["currentUser"]),

    resetRooms() {
      this.loadingRooms = true;
      this.loadingLastMessageByRoom = 0;
      this.roomsLoadedCount = 0;
      this.rooms = [];
      this.roomsLoaded = true;
      this.startRooms = null;
      this.endRooms = null;
      this.roomsListeners.forEach((listener) => listener());
      this.roomsListeners = [];
      this.resetMessages();
    },

    resetMessages() {
      this.messages = [];
      this.messagesLoaded = false;
      this.lastLoadedMessage = null;
      this.previousLastLoadedMessage = null;
      this.listeners.forEach((listener) => listener());
      this.listeners = [];
    },

    fetchRooms() {
      this.resetRooms();
      this.fetchMoreRooms();
    },

    async fetchMoreRooms() {
      if (this.endRooms && !this.startRooms) {
        this.roomsLoaded = true;
        return;
      }

      const query = firestoreService.roomsQuery(this.currentUserId, this.roomsPerPage, this.startRooms);

      const { data, docs } = await firestoreService.getRooms(query);
      // this.incrementDbCounter('Fetch Rooms', data.length)

      this.roomsLoaded = data.length === 0 || data.length < this.roomsPerPage;

      if (this.startRooms) this.endRooms = this.startRooms;
      this.startRooms = docs[docs.length - 1];

      const roomUserIds = [];
      data.forEach((room) => {
        room.users.forEach((userId) => {
          const foundUser = this.allUsers.find((user) => user?._id === userId);
          if (!foundUser && roomUserIds.indexOf(userId) === -1) {
            roomUserIds.push(userId);
          }
        });
      });

      // this.incrementDbCounter('Fetch Room Users', roomUserIds.length)
      const rawUsers = [];
      roomUserIds.forEach((userId) => {
        const promise = firestoreService.getUser(userId);
        rawUsers.push(promise);
      });

      this.allUsers = [...this.allUsers, ...(await Promise.all(rawUsers))];

      const roomList = {};
      data.forEach((room) => {
        roomList[room.id] = { ...room, users: [] };

        room.users.forEach((userId) => {
          const foundUser = this.allUsers.find((user) => user?._id === userId);
          if (foundUser) roomList[room.id].users.push(foundUser);
        });
      });

      const formattedRooms = [];

      Object.keys(roomList).forEach((key) => {
        const room = roomList[key];

        const roomContacts = room.users.filter((user) => user._id !== this.currentUserId);

        room.roomName = roomContacts.map((user) => user.username).join(", ") || "Myself";

        const roomAvatar =
          roomContacts.length === 1 && roomContacts[0].avatar
            ? roomContacts[0].avatar
            : ""; /* require("@/assets/logo.png") */

        formattedRooms.push({
          ...room,
          roomId: key,
          avatar: roomAvatar,
          index: room.lastUpdated.seconds,
          lastMessage: {
            content: "Room created",
            timestamp: formatTimestamp(new Date(room.lastUpdated.seconds), room.lastUpdated),
          },
        });
      });

      this.rooms = this.rooms.concat(formattedRooms);
      formattedRooms.forEach((room) => this.listenLastMessage(room));

      if (!this.rooms.length) {
        this.loadingRooms = false;
        this.roomsLoadedCount = 0;
      }

      this.listenUsersOnlineStatus(formattedRooms);
      this.listenRooms(query);
      // setTimeout(() => console.log('TOTAL', this.dbRequestCount), 2000)
    },

    listenLastMessage(room) {
      const listener = firestoreService.listenLastMessage(room.roomId, (messages) => {
        // this.incrementDbCounter('Listen Last Room Message', messages.length)
        messages.forEach((message) => {
          const lastMessage = this.formatLastMessage(message, room);

          if (lastMessage.new) {
            if (!lastMessage.seen) {
              this.setUnreadCounter(room.roomId, room.unreadCount + 1);
            }
            if (lastMessage.seen) {
              this.setUnreadCounter(room.roomId, 0);
            }
          }

          const roomIndex = this.rooms.findIndex((r) => room.roomId === r.roomId);
          this.rooms[roomIndex].lastMessage = lastMessage;
          this.rooms = [...this.rooms];
        });
        if (this.loadingLastMessageByRoom < this.rooms.length) {
          this.loadingLastMessageByRoom += 1;

          if (this.loadingLastMessageByRoom === this.rooms.length) {
            this.loadingRooms = false;
            this.roomsLoadedCount = this.rooms.length;
          }
        }
      });

      this.roomsListeners.push(listener);
    },

    formatLastMessage(message, room) {
      if (!message.timestamp) return;

      let { content } = message;
      if (message.files?.length) {
        const file = message.files[0];
        content = `${file.name}.${file.extension || file.type}`;
      }

      const username =
        message.sender_id !== this.currentUserId
          ? room.users.find((user) => message.sender_id === user._id)?.username
          : "";

      // eslint-disable-next-line consistent-return
      return {
        ...message,
        ...{
          content,
          timestamp: formatTimestamp(new Date(message.timestamp.seconds * 1000), message.timestamp),
          username,
          distributed: true,
          seen: message.sender_id === this.currentUserId ? message.seen : null,
          new: message.sender_id !== this.currentUserId && (!message.seen || !message.seen[this.currentUserId]),
        },
      };
    },

    fetchMessages({ room, options = {} }) {
      this.$emit("show-demo-options", false);

      if (options.reset) {
        this.resetMessages();
        this.roomId = room.roomId;
      }

      if (this.previousLastLoadedMessage && !this.lastLoadedMessage) {
        this.messagesLoaded = true;
        return;
      }

      this.selectedRoom = room.roomId;

      firestoreService.getMessages(room.roomId, this.messagesPerPage, this.lastLoadedMessage).then(({ data, docs }) => {
        // this.incrementDbCounter('Fetch Room Messages', messages.length)
        if (this.selectedRoom !== room.roomId) return;

        if (data.length === 0 || data.length < this.messagesPerPage) {
          // eslint-disable-next-line no-return-assign
          setTimeout(() => (this.messagesLoaded = true), 0);
        }

        if (options.reset) this.messages = [];

        data.forEach((message) => {
          const formattedMessage = this.formatMessage(room, message);

          if (!formattedMessage.seen && message.sender_id !== this.currentUserId) {
            this.setUnreadCounter(room.roomId, 0);
          }

          this.messages.unshift(formattedMessage);
        });

        if (this.lastLoadedMessage) {
          this.previousLastLoadedMessage = this.lastLoadedMessage;
          this.setUnreadCounter(room.roomId, 0);
        }
        this.lastLoadedMessage = docs[docs.length - 1];

        this.listenMessages(room);
      });
    },

    listenMessages(room) {
      const listener = firestoreService.listenMessages(
        room.roomId,
        this.lastLoadedMessage,
        this.previousLastLoadedMessage,
        (messages) => {
          messages.forEach((message) => {
            const formattedMessage = this.formatMessage(room, message);
            const messageIndex = this.messages.findIndex((m) => m._id === message.id);

            if (messageIndex === -1) {
              this.messages = this.messages.concat([formattedMessage]);
            } else {
              this.messages[messageIndex] = formattedMessage;
              this.messages = [...this.messages];
            }

            this.markMessagesSeen(room, message);
          });
        }
      );
      this.listeners.push(listener);
    },

    async setUnreadCounter(roomId, count) {
      firestoreService.updateRoom(roomId, { unreadCount: count });
    },

    markMessagesSeen(room, message) {
      if (message.sender_id !== this.currentUserId && (!message.seen || !message.seen[this.currentUserId])) {
        firestoreService.updateMessage(room.roomId, message.id, {
          [`seen.${this.currentUserId}`]: new Date(),
        });
      }
    },

    formatMessage(room, message) {
      const formattedMessage = {
        ...message,
        ...{
          senderId: message.sender_id,
          _id: message.id,
          seconds: message.timestamp.seconds,
          timestamp: parseTimestamp(message.timestamp, "HH:mm"),
          date: parseTimestamp(message.timestamp, "DD MMMM YYYY"),
          username: room.users.find((user) => message.sender_id === user._id)?.username,
          // avatar: senderUser ? senderUser.avatar : null,
          distributed: true,
        },
      };

      if (message.replyMessage) {
        formattedMessage.replyMessage = {
          ...message.replyMessage,
          ...{
            senderId: message.replyMessage.sender_id,
          },
        };
      }

      return formattedMessage;
    },

    async sendMessage({ content, roomId, files, replyMessage }) {
      const message = {
        sender_id: this.currentUserId,
        content,
        timestamp: new Date(),
        files: null,
        replyMessage: null,
      };

      if (files) {
        message.files = this.formattedFiles(files);
      }

      if (replyMessage) {
        message.replyMessage = {
          _id: replyMessage._id,
          content: replyMessage.content,
          sender_id: replyMessage.senderId,
        };

        if (replyMessage.files) {
          message.replyMessage.files = replyMessage.files;
        }
      }

      const { id } = await firestoreService.addMessage(roomId, message);

      if (files) {
        files.forEach((file) => this.uploadFile({ file, messageId: id, roomId }));
      }

      firestoreService.updateRoom(roomId, { lastUpdated: new Date() });
    },

    async editMessage({ messageId, newContent, roomId, files }) {
      const newMessage = { edited: new Date(), content: newContent, files: null };

      if (files) {
        newMessage.files = this.formattedFiles(files);
      } else {
        newMessage.files = firestoreService.deleteDbField;
      }

      await firestoreService.updateMessage(roomId, messageId, newMessage);

      if (files) {
        files.forEach((file) => {
          if (file?.blob) {
            this.uploadFile({ file, messageId, roomId });
          }
        });
      }
    },

    async deleteMessage({ message, roomId }) {
      await firestoreService.updateMessage(roomId, message._id, {
        deleted: new Date(),
      });

      const { files } = message;

      if (files) {
        files.forEach((file) => {
          storageService.deleteFile(this.currentUserId, message._id, file);
        });
      }
    },

    async uploadFile({ file, messageId, roomId }) {
      return new Promise((resolve) => {
        let type = file.extension || file.type;
        if (type === "svg" || type === "pdf") {
          type = file.type;
        }

        storageService.listenUploadImageProgress(
          this.currentUserId,
          messageId,
          file,
          type,
          (progress) => {
            this.updateFileProgress(messageId, file.localUrl, progress);
          },
          (_error) => {
            resolve(false);
            throw _error;
          },
          async (url) => {
            const message = await firestoreService.getMessage(roomId, messageId);

            message.files.forEach((messageFile) => {
              if (messageFile.url === file.localUrl) {
                messageFile.url = url;
              }
            });

            await firestoreService.updateMessage(roomId, messageId, {
              files: message.files,
            });
            resolve(true);
          }
        );
      });
    },

    updateFileProgress(messageId, fileUrl, progress) {
      const newMessage = this.messages.find((message) => message._id === messageId);

      if (!newMessage || !newMessage.files) return;

      newMessage.files.find((file) => file.url === fileUrl).progress = progress;
      this.messages = [...this.messages];
    },

    formattedFiles(files) {
      const formattedFiles = [];

      files.forEach((file) => {
        const messageFile = {
          name: file.name,
          size: file.size,
          type: file.type,
          extension: file.extension || file.type,
          url: file.url || file.localUrl,
        };

        if (file.audio) {
          messageFile.audio = true;
          messageFile.duration = file.duration;
        }

        formattedFiles.push(messageFile);
      });

      return formattedFiles;
    },

    openFile({ file }) {
      window.open(file.file.url, "_blank");
    },

    async openUserTag({ user }) {
      let roomId;

      this.rooms.forEach((oneRoom) => {
        if (oneRoom.users.length === 2) {
          const userId1 = oneRoom.users[0]._id;
          const userId2 = oneRoom.users[1]._id;
          if (
            (userId1 === user._id || userId1 === this.currentUserId) &&
            (userId2 === user._id || userId2 === this.currentUserId)
          ) {
            roomId = oneRoom.roomId;
          }
        }
      });

      if (roomId) {
        this.roomId = roomId;
        return;
      }

      const query1 = await firestoreService.getUserRooms(this.currentUserId, user._id);

      if (query1.data.length) {
        this.loadRoom(query1);
      }

      const query2 = await firestoreService.getUserRooms(user._id, this.currentUserId);

      if (query2.data.length) {
        this.loadRoom(query2);
      }

      const users = user._id === this.currentUserId ? [this.currentUserId] : [user._id, this.currentUserId];

      const room = await firestoreService.addRoom({
        users,
        lastUpdated: new Date(),
      });

      this.roomId = room.id;
      this.fetchRooms();
    },

    async loadRoom(query) {
      query.forEach(async (room) => {
        if (this.loadingRooms) return;
        await firestoreService.updateRoom(room.id, { lastUpdated: new Date() });
        this.roomId = room.id;
        this.fetchRooms();
      });
    },

    menuActionHandler({ action, roomId }) {
      switch (action.name) {
        case "inviteUser":
          return this.inviteUser(roomId);
        case "removeUser":
          return this.removeUser(roomId);
        case "deleteRoom":
          return this.deleteRoom(roomId);
        default:
          return false;
      }
    },

    messageSelectionActionHandler({ action, messages, roomId }) {
      if (action.name === "deleteMessages") {
        return messages.forEach((message) => {
          this.deleteMessage({ message, roomId });
        });
      }
      return false;
    },

    async sendMessageReaction({ reaction, remove, messageId, roomId }) {
      firestoreService.updateMessageReactions(
        roomId,
        messageId,
        this.currentUserId,
        reaction.unicode,
        remove ? "remove" : "add"
      );
    },

    typingMessage({ message, roomId }) {
      if (roomId) {
        if (message?.length > 1) {
          this.typingMessageCache = message;
          return;
        }

        if (message?.length === 1 && this.typingMessageCache) {
          this.typingMessageCache = message;
          return;
        }

        this.typingMessageCache = message;

        firestoreService.updateRoomTypingUsers(roomId, this.currentUserId, message ? "add" : "remove");
      }
    },

    async listenRooms(query) {
      const listener = firestoreService.listenRooms(query, (rooms) => {
        // this.incrementDbCounter('Listen Rooms Typing Users', rooms.length)
        rooms.forEach((room) => {
          const foundRoom = this.rooms.find((r) => r.roomId === room.id);
          if (foundRoom) {
            foundRoom.typingUsers = room.typingUsers;
            foundRoom.index = room.lastUpdated.seconds;
            foundRoom.unreadCount = room?.unreadCount;
          }
        });
      });
      this.roomsListeners.push(listener);
    },

    listenUsersOnlineStatus(rooms) {
      rooms.forEach((room) => {
        room.users.forEach((user) => {
          const listener = firebaseService.firebaseListener(firebaseService.userStatusRef(user._id), (snapshot) => {
            if (!snapshot || !snapshot.val()) return;

            const lastChanged = formatTimestamp(
              new Date(snapshot.val().lastChanged),
              new Date(snapshot.val().lastChanged)
            );

            user.status = { ...snapshot.val(), lastChanged };

            const roomIndex = this.rooms.findIndex((r) => room.roomId === r.roomId);

            this.rooms[roomIndex] = room;
            this.rooms = [...this.rooms];
          });
          this.roomsListeners.push(listener);
        });
      });
    },

    addRoom() {
      this.resetForms();
      this.addNewRoom = true;
    },

    async createRoom() {
      this.disableForm = true;

      await firestoreService.addRoom({
        users: [...this.multipleValue, this.currentUserId],
        lastUpdated: new Date(),
      });

      this.addNewRoom = false;
      this.fetchRooms();
    },

    inviteUser(roomId) {
      this.resetForms();
      this.inviteRoomId = roomId;
    },

    async addRoomUser() {
      this.disableForm = true;

      await firestoreService.addRoomUser(this.inviteRoomId, [...this.multipleValue]);

      this.inviteRoomId = null;
      this.fetchRooms();
    },

    removeUser(roomId) {
      this.resetForms();
      this.removeRoomId = roomId;
      this.removeUsers = this.rooms.find((room) => room.roomId === roomId).users;
    },

    async deleteRoomUser() {
      this.disableForm = true;

      await firestoreService.removeRoomUser(this.removeRoomId, this.removeUserId);

      this.removeRoomId = null;
      this.removeUserId = "";
      this.fetchRooms();
    },

    async deleteRoom(roomId) {
      firestoreService.getMessages(roomId).then(({ data }) => {
        data.forEach((message) => {
          firestoreService.deleteMessage(roomId, message.id);
          if (message.files) {
            message.files.forEach((file) => {
              storageService.deleteFile(this.currentUserId, message.id, file);
            });
          }
        });
      });

      await firestoreService.deleteRoom(roomId);

      this.fetchRooms();
    },

    resetForms() {
      this.disableForm = false;
      this.addNewRoom = null;
      this.inviteRoomId = null;
      this.removeRoomId = null;
      this.removeUserId = "";
    },

    // ,incrementDbCounter(type, size) {
    // 	size = size || 1
    // 	this.dbRequestCount += size
    // 	console.log(type, size)
    // }
  },
};
</script>

<style lang="scss" scoped>
.window-container {
  width: 100%;
}

.window-mobile {
  form {
    padding: 0 10px 10px;
  }
}

form {
  padding-bottom: 20px;
}

input {
  padding: 5px;
  width: 140px;
  height: 21px;
  border-radius: 4px;
  border: 1px solid #d2d6da;
  outline: none;
  font-size: 14px;
  vertical-align: middle;

  &::placeholder {
    color: #9ca6af;
  }
}

button {
  background: #1976d2;
  color: #fff;
  outline: none;
  cursor: pointer;
  border-radius: 4px;
  padding: 8px 12px;
  margin-left: 10px;
  border: none;
  font-size: 14px;
  transition: 0.3s;
  vertical-align: middle;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.6;
  }

  &:disabled {
    cursor: initial;
    background: #c6c9cc;
    opacity: 0.6;
  }
}

.button-cancel {
  color: #a8aeb3;
  background: none;
  margin-left: 5px;
}

select {
  vertical-align: middle;
  height: 33px;
  width: 152px;
  font-size: 13px;
  margin: 0 !important;
}
</style>
