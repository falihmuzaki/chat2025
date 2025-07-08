# Chat Application

This is a real-time chat application built using Node.js, React.js, and MongoDB. The application allows users to send and receive messages in real-time.

## Project Structure

```
chat-app
├── client                # Frontend application
│   ├── src               # Source files for React app
│   │   ├── components     # React components
│   │   ├── App.jsx        # Main application component
│   │   └── index.js       # Entry point for React app
│   ├── public            # Public assets
│   │   └── index.html     # Main HTML file
│   └── package.json      # Client dependencies and scripts
├── server                # Backend application
│   ├── src               # Source files for Node.js server
│   │   ├── models         # Mongoose models
│   │   ├── routes         # API routes
│   │   └── server.js      # Entry point for Node.js server
│   └── package.json      # Server dependencies and scripts
├── docker-compose.yml    # Docker Compose configuration
├── Dockerfile            # Dockerfile for server
└── README.md             # Project documentation
```

## Technologies Used

- **Frontend**: React.js
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Containerization**: Docker

## Getting Started

### Prerequisites

- Node.js
- Docker
- MongoDB

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd chat-app
   ```

2. Install dependencies for the client:
   ```
   cd client
   npm install
   ```

3. Install dependencies for the server:
   ```
   cd server
   npm install
   ```

### Running the Application

You can run the application using Docker Compose:

```
docker-compose up
```

This command will start the client, server, and MongoDB services.

### Accessing the Application

Once the application is running, you can access it at `http://localhost:3000`.

## Usage

- Users can send messages through the input field.
- Messages will be displayed in real-time in the message list.

## License

This project is licensed under the MIT License.