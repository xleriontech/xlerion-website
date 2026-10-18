import React from 'react';

export default function Game() {
    return (
        <div className="w-full h-screen bg-black flex items-center justify-center">
            <iframe
                src="/game/index.html"
                title="Xlerion Game"
                className="w-full h-full border-0"
            />
        </div>
    );
}
