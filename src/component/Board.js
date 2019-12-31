import React from 'react'

export default function Board({ allRow, row, col, onClick }) {

    if (allRow[col] === 'B') {
      return (
        <button onClick={onClick} className="square-brown">
          <div className="circle-black" > </div>
        </button>
      );
    }
  
    else if (allRow[col] === 'G') {
      return (
        <button onClick={onClick}  className="square-brown">
          <div className="circle-gray"></div>
        </button>
      );
    }
  
    else if (allRow[col] === 'X')
    return (<button onClick={onClick}  className="square-brown"></button>);
  

    else if (allRow[col] === 'KG') {
      return (
        <button onClick={onClick}  className="square-brown">
          <div className="king-gray"></div>
        </button>
      );
    }

    else if (allRow[col] === 'KB') {
      return (
        <button onClick={onClick}  className="square-brown">
          <div className="king-black"></div>
        </button>
      );
    }

    else if (allRow[col] === null) {
      return (<div className="square"></div>);
    }
  
    else return <div>ERROR</div>
  
  }
  


