import React from 'react';
import Chat from './components/Chat';
import './App.css';

const App = () => {
    return (
        <div className="container-fluid py-4" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div className="row">
                <div className="col">
                    <h1 className="text-center mb-4 text-primary">Chat Application</h1>
                    <Chat />
                </div>
            </div>
        </div>
    );
};

export default App;