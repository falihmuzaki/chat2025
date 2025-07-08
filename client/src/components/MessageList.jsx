import React from 'react';

const MessageList = ({ messages }) => {
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
    };

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
                            <div className="d-flex justify-content-between align-items-start">
                                <span>{message.content}</span>
                                <small className="text-muted ms-2">
                                    {formatTimestamp(message.timestamp)}
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MessageList;
