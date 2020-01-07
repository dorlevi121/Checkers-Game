import React from 'react'
import { Spring } from "react-spring/renderprops";

export default function Text({ turn, status }) {
    var player;
    if (turn) player = 'Gray'
    else player = 'Black'
    return (
        <Spring
            from={{ opacity: 0, marginTop: -500 }}
            to={{ opacity: 1, marginTop: 0 }} >
            {props => (
                <div style={props}>
                    <div className="text">
                        <h3>{player} is your turn</h3>
                        <p>{status}</p>
                    </div>
                </div>
            )}
        </Spring>

    )
}
