# Streamly

Streamly is a full-stack video platform for creators and viewers to upload, browse, and manage video content with community features such as comments, likes, subscriptions, and playlists.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss)

## 1. Title & one-line description

Streamly is a full-stack video platform for creators and viewers to upload, discover, and manage content with built-in engagement features like comments, likes, subscriptions, and playlists.

## 2. Live demo & screenshots

- Live demo: TODO — deploy the app and replace this with the production URL.
- Frontend: TODO
- Backend API: TODO

### 1. Home Dashboard

The main Streamly dashboard provides personalized video discovery, navigation, and access to core platform features.

<p align="center">
  <img src="./screenshots/Home%20(Dashboard).png" alt="Streamly Home Dashboard" width="900">
</p>

### 2. Video Search

Users can search and discover videos across the platform.

<p align="center">
  <img src="./screenshots/search.png" alt="Streamly Video Search" width="900">
</p>

### 3. Channel Overview

Each channel has a dedicated page where users can explore channel information, content, and activity.

<p align="center">
  <img src="./screenshots/channel_overview.png" alt="Streamly Channel Overview" width="900">
</p>

### 4. Channel

The channel interface organizes a creator's videos and provides users with access to channel-specific content.

<p align="center">
  <img src="./screenshots/channel.png" alt="Streamly Channel" width="900">
</p>

### 5. Channel Playlists

Creators can organize videos into playlists, allowing viewers to browse related content efficiently.

<p align="center">
  <img src="./screenshots/channel_playlist.png" alt="Streamly Channel Playlists" width="900">
</p>

### 6. Channel Tweets

Channels can publish short updates and interact with their audience through the platform's social features.

<p align="center">
  <img src="./screenshots/channel_tweet.png" alt="Streamly Channel Tweets" width="900">
</p>

### 7. Following Channels

Users can follow channels to keep track of their favorite creators and content.

<p align="center">
  <img src="./screenshots/channel_following.png" alt="Streamly Following Channels" width="900">
</p>

### 8. Subscribers

The subscriber section provides creators with an overview of their audience.

<p align="center">
  <img src="./screenshots/subscribers.png" alt="Streamly Subscribers" width="900">
</p>

### 9. Followers

Users can view and manage their followers through their profile.

<p align="center">
  <img src="./screenshots/followers.png" alt="Streamly Followers" width="900">
</p>

### 10. Liked Videos

Users can access videos they have previously liked.

<p align="center">
  <img src="./screenshots/liked_videos_section.png" alt="Streamly Liked Videos" width="900">
</p>

### 11. Watch History

The watch history section allows users to revisit previously watched videos.

<p align="center">
  <img src="./screenshots/watch_history.png" alt="Streamly Watch History" width="900">
</p>

### 12. Notifications

Users receive notifications for relevant platform and channel activity.

<p align="center">
  <img src="./screenshots/notifications.png" alt="Streamly Notifications" width="900">
</p>

### 13. Video Upload

Creators can upload and publish videos through the dedicated upload interface.

<p align="center">
  <img src="./screenshots/upload_section.png" alt="Streamly Video Upload" width="900">
</p>

### 14. Sidebar Navigation

The sidebar provides quick access to the platform's primary features and content sections.

<p align="center">
  <img src="./screenshots/side_bar.png" alt="Streamly Sidebar Navigation" width="900">
</p>

### 15. Login

Existing users can securely authenticate to access their Streamly account.

<p align="center">
  <img src="./screenshots/login%20page.png" alt="Streamly Login" width="700">
</p>

### 16. Registration

New users can create a Streamly account through the registration interface.

<p align="center">
  <img src="./screenshots/register_page.png" alt="Streamly Registration" width="700">
</p>


## 3. Key features

- Secure user registration, login, logout, and token refresh using JWT and bcrypt.
- Video upload, publishing, editing, and deletion with Cloudinary-backed media storage.
- Video browsing and search by title or channel name with pagination.
- Individual video detail pages that increment view counts and track watch history.
- Comments on videos with update/delete support.
- Like and unlike actions for videos, comments, and tweets.
- Channel subscriptions and follower/following views.
- Playlist creation, update, deletion, and add/remove video actions.
- User watch history and liked-videos collection.
- Channel dashboard with video stats and user tweets/posts.
- Notification feed for subscriber and interaction activity.

## 4. Tech stack

### Frontend

- React 19
- Vite
- React Router DOM
- Redux Toolkit
- Axios
- Tailwind CSS
- Framer Motion
- Lucide React
- React Icons
- React Player
- React Toastify

### Backend

- Node.js
- Express 5
- Mongoose
- MongoDB
- JWT
- bcrypt
- Cloudinary
- Multer
- Cookie Parser
- CORS
- dotenv

### Database

- MongoDB
- Mongoose ODM

### DevOps / Tools

- Git
- npm
- Postman (used for API testing in workflow)
- VS Code
- Nodemon
- Docker: TODO — not currently configured in the repo

### Testing

- No automated test runner is currently configured in the front-end or back-end package manifests.
- TODO: add unit and integration coverage for auth, video upload, and API routes.

## 5. Architecture overview

The app is split into two main parts:

- Frontend: a React + Redux client under `client/src` that renders pages for home, video detail, channel management, playlists, tweets, and profile areas.
- Backend: an Express API under `server/src` that handles authentication, media uploads, routing, validation, and database interaction.
- Database: MongoDB stores users, videos, comments, likes, subscriptions, playlists, notifications, and watch history through Mongoose schemas.

The frontend calls a versioned REST API at `/api/v1`, while protected routes are guarded by JWT middleware. Media files are uploaded through Multer and stored via Cloudinary, and the app uses Redux Toolkit slices to manage client-side state.

Folder structure:

```text
streamly/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── index.js
│   ├── package.json
│   ├── .env.sample
│   └── .env
├── README.md
└── .gitignore
```

## 6. Technical highlights

- REST API design with versioned routes under `/api/v1` and resource-specific controllers.
- JWT-based authentication with access and refresh tokens, password hashing via bcrypt, and protected route middleware.
- Cloudinary integration for video file and thumbnail uploads.
- MongoDB aggregation pipelines for video listing/search, channel statistics, and subscriber queries.
- Redux Toolkit state management for auth, videos, likes, notifications, playlists, and subscriptions.
- Centralized error handling and consistent API response formatting through custom utility classes.
- Cookie-based auth flow and CORS configuration for local frontend/back-end communication.
- Watch history and user channel data stored on the user model for personalized experiences.
- TODO: CI/CD and Docker deployment pipeline are not yet defined in this repository.

## 7. API overview

All routes are mounted under `/api/v1`. Protected endpoints require JWT authentication via the auth middleware.

### Auth & user routes

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/api/v1/users/register` | Register a new user and optionally upload avatar/cover image. |
| POST | `/api/v1/users/login` | Authenticate a user and issue JWT tokens. |
| POST | `/api/v1/users/logout` | Log the current user out and clear session data. |
| POST | `/api/v1/users/refresh-access-token` | Refresh the access token using the refresh token. |
| POST | `/api/v1/users/change-password` | Change the authenticated user’s password. |
| GET | `/api/v1/users/current-user` | Get the authenticated user profile. |
| PATCH | `/api/v1/users/update-account` | Update the authenticated user’s profile details. |
| PATCH | `/api/v1/users/update-avatar` | Upload and update the user avatar. |
| PATCH | `/api/v1/users/update-cover-image` | Upload and update the cover image. |
| GET | `/api/v1/users/channel/:userName` | Fetch a channel profile by username. |
| GET | `/api/v1/users/watch-history` | Get the authenticated user’s watch history. |

### Video routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/v1/videos` | Fetch videos with pagination, optional search, and user filtering. |
| GET | `/api/v1/videos/:videoId` | Fetch a single video and increment its view count. |
| POST | `/api/v1/videos/upload` | Upload a new video and thumbnail. |
| PATCH | `/api/v1/videos/:videoId` | Update an existing video’s title, description, or thumbnail. |
| DELETE | `/api/v1/videos/:videoId` | Delete a video. |
| PATCH | `/api/v1/videos/toggle/publish/:videoId` | Toggle the video publish state. |

### Comment routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/v1/comments/:videoId` | Fetch comments for a video. |
| POST | `/api/v1/comments/:videoId` | Add a new comment to a video. |
| PATCH | `/api/v1/comments/channel/:commentId` | Update a comment by comment ID. |
| DELETE | `/api/v1/comments/channel/:commentId` | Delete a comment by comment ID. |

### Like routes

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/api/v1/likes/toggle/video/:videoId` | Toggle like on a video. |
| POST | `/api/v1/likes/toggle/channel/:commentId` | Toggle like on a comment. |
| POST | `/api/v1/likes/toggle/tweet/:tweetId` | Toggle like on a tweet. |
| GET | `/api/v1/likes/videos` | Get the authenticated user’s liked videos. |

### Subscription routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/v1/subscriptions/channel/:channelId/subscribers` | Get all subscribers for a channel. |
| GET | `/api/v1/subscriptions/user/:subscriberId/channels` | Get all channels a user is subscribed to. |
| POST | `/api/v1/subscriptions/channel/:channelId/toggle` | Subscribe or unsubscribe from a channel. |

### Playlist routes

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/api/v1/playlists` | Create a new playlist. |
| GET | `/api/v1/playlists/:playlistId` | Get a playlist by ID. |
| PATCH | `/api/v1/playlists/:playlistId` | Update a playlist. |
| DELETE | `/api/v1/playlists/:playlistId` | Delete a playlist. |
| GET | `/api/v1/playlists/user/:userId` | Get all playlists for a user. |
| POST | `/api/v1/playlists/add/:videoId/:playlistId` | Add a video to a playlist. |
| POST | `/api/v1/playlists/remove/:videoId/:playlistId` | Remove a video from a playlist. |

### Tweet routes

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/api/v1/tweets` | Create a new tweet/post. |
| GET | `/api/v1/tweets/user/:userId` | Fetch tweets for a specific user. |
| PATCH | `/api/v1/tweets/:tweetId` | Update a tweet. |
| DELETE | `/api/v1/tweets/:tweetId` | Delete a tweet. |

### Notification routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/v1/notifications` | Fetch the authenticated user’s notifications. |
| PATCH | `/api/v1/notifications/read-all` | Mark all notifications as read. |
| PATCH | `/api/v1/notifications/:notificationId/read` | Mark one notification as read. |

### Dashboard & health routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/v1/dashboard/stats` | Get channel stats for the authenticated user. |
| GET | `/api/v1/dashboard/videos` | Get videos for the authenticated user’s channel. |
| GET | `/api/v1/healthcheck` | Health check endpoint for the server. |

## 8. Getting started

### Prerequisites

- Node.js 18+
- npm
- MongoDB instance or MongoDB Atlas cluster
- Cloudinary account for media uploads
- Git

### Installation

```bash
git clone https://github.com/your-username/streamly.git
cd streamly
```

Install the server dependencies:

```bash
cd server
npm install
```

Install the client dependencies:

```bash
cd ../client
npm install
```

### Environment variables

Create environment files from the examples before running the app:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

`server/.env.example`

```env
PORT=8000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/streamly
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

`client/.env.example`

```env
VITE_BACKEND_URL=http://localhost:8000/api/v1
```

### Run locally

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend:

```bash
cd client
npm run dev
```

The frontend runs at `http://localhost:5173` and the backend runs at `http://localhost:8000` by default.

## 9. Testing

There are no dedicated automated test scripts defined in the current `server/package.json` or `client/package.json` files.

Current validation available:

```bash
cd client
npm run lint
```

TODO: add Jest/Vitest or integration tests for auth, upload flows, subscriptions, and video listing logic.

## 10. Future improvements

- Add automated tests and CI checks for backend and frontend workflows.
- Introduce real-time updates for comments, notifications, and live chat.
- Add moderation tools and admin controls for video/report management.
- Improve scalability with caching, Redis, and query optimization for high-traffic video lists.
- Add Docker and deployment automation for staging/production environments.

## 11. Author

### Md. Abu Nayem

- LinkedIn: https://linkedin.com/in/md-abunayem
- GitHub: https://github.com/md-abunayem
- Portfolio: https://your-portfolio.com
- Email: md.abunayem.cs@gmail.com

This project demonstrates full-stack JavaScript development, secure API design, media handling, and modern front-end state management in a real-world content platform.


