import React from 'react';

const MessageList = ({ messages }) => {
    if (messages.length === 0) {
        return (
            <div className="text-center text-muted py-4">
                <p>No messages yet. Start the conversation!</p>
            </div>
        );
    }

    return (
        <div className="list-group list-group-flush">
            {messages.map((message, index) => (
                <div key={index} className="list-group-item border-0 px-0">
                    <div className="d-flex align-items-start">
                        <span className="badge bg-primary me-2 mt-1">
                            {message.username}
                        </span>
                        <div className="flex-grow-1">
                            {message.content}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MessageList;
