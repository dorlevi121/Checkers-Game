import React from 'react'

export default function Text({turn, status}) {
    var player;
    if(turn) player = 'Gray'
    else player = 'Black'
    return (
        <div className="text">
            <h3>{player} is your turn</h3>
            <p>{status}</p>
        </div>
    )
}
