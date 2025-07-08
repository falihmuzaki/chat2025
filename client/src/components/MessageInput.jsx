import React, { useState } from 'react';

const MessageInput = ({ onSend }) => {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (username.trim() && message.trim()) {
            onSend({
                username,
                content: message
            });
            setMessage('');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="row g-2">
                <div className="col-md-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Your name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="col-md-7">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    />
                </div>
                <div className="col-md-2">
                    <button type="submit" className="btn btn-primary w-100">
                        Send
                    </button>
                </div>
            </div>
        </form>
    );
};

export default MessageInput;
