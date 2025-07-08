import React, { useEffect, useState } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [clearing, setClearing] = useState(false);

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

    const clearMessages = async () => {
        if (!window.confirm('Are you sure you want to clear all messages?')) {
            return;
        }

        try {
            setClearing(true);
            const response = await fetch('api/messages', {
                method: 'DELETE',
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setMessages([]);
                setError(null);
            } else {
                throw new Error(result.error || 'Failed to clear messages');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setClearing(false);
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
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Chat Messages</h5>
                <button 
                    className="btn btn-outline-danger btn-sm"
                    onClick={clearMessages}
                    disabled={clearing || messages.length === 0}
                >
                    {clearing ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Clearing...
                        </>
                    ) : (
                        <>
                            <i className="bi bi-trash me-1"></i>
                            Clear Chat
                        </>
                    )}
                </button>
            </div>
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
