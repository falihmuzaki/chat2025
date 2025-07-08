import React, { useEffect, useState } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch('api/messages');
                const result = await response.json();
                
                if (response.ok && result.success) {
                    setMessages(result.data);
                } else {
                    throw new Error(result.error || 'Failed to fetch messages');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, []);

    const addMessage = async (message) => {
        try {
            const response = await fetch('api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(message),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setMessages(prev => [result.data, ...prev]);
                setError(null);
            } else {
                throw new Error(result.error || 'Failed to send message');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <div className="mt-2">Loading messages...</div>
            </div>
        );
    }

    return (
        <div>
            {error && (
                <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
                    {error}
                    <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => setError(null)}
                        aria-label="Close"
                    ></button>
                </div>
            )}
            <div className="card mb-3">
                <div className="card-body" style={{ height: '400px', overflowY: 'auto' }}>
                    <MessageList messages={messages} />
                </div>
            </div>
            <MessageInput onSend={addMessage} />
        </div>
    );
};

export default Chat;
