/pages/api/chat
  ├── create.ts             → Create chat room
  ├── send-message.ts       → Send message
  ├── get-messages.ts       → Fetch messages for a chat
  ├── get-user-chats.ts     → Get all chat rooms for a user






1. Create Chat Room (POST /api/chatrooms/create)
Flow:
Client sends JSON with:

senderUsername (the user who initiates chat)

receiverUsername (the user to chat with)

Server connects to the database.

It fetches both users by their usernames.

Checks if a chat room already exists between these two users.

If yes, returns existing room data (so no duplicate chat rooms).

If no, creates a new chat room document with both users as participants.

Returns the new or existing chat room with participant details populated.

2. Send Message (POST /api/messages/send)
Flow:
Client sends JSON with:

senderUsername (who sends the message)

chatRoomId (which chat room the message belongs to)

type (like 'text', 'image', or 'voice')

content (text message or URL to media)

Server connects to DB.

Finds the sender user and chat room by IDs.

Creates a new message document linked to that chat room and sender.

Populates sender info in the message for frontend display.

Returns the created message.

3. Get Messages of a Chat (GET /api/messages/[chatRoomId])
Flow:
Client requests all messages for a particular chat room by chatRoomId.

Server connects to DB.

Queries messages where chatRoom equals given chatRoomId.

Sorts messages by createdAt ascending (oldest first).

Populates sender details for each message.

Returns the list of messages.

4. Get All Chat Rooms for User (GET /api/chatrooms/user?username=krishna)
Flow:
Client requests all chat rooms where user is a participant by passing username as query.

Server connects to DB.

Finds the user by username.

Finds all chat rooms where this user is in the participants array.

Populates the participant details for each chat room.

Returns the list of chat rooms with their participant info.

Summary Flow for Chat Usage:
User wants to start chatting → call Create Chat Room.

User sends messages → call Send Message.

User opens chat to see history → call Get Messages of a Chat.

User views all chat conversations → call Get All Chat Rooms for User.