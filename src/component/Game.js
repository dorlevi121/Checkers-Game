import React, { Component } from 'react'
import Board from './Board';
import Text from './Text';
import { ListGroup } from 'react-bootstrap';
import * as Helper from './Helper';
import Button from 'react-bootstrap/Button'

const INITIAL_BOARD = Helper.board;

export default class Game extends Component {

    constructor(props) {
        super(props);

        this.state = {
            board: this.getBoard(),
            isGrayTurn: false,
            firstClick: [-1, -1],
            secondClick: [-1, -1],
            status: "",
            isKing: false,
            isWin: false,
            history: Array(0),
            redo: Array(0)
        };
    }



    handleClick(row, col) {
        var winner = this.state.isWin;
        if (winner) return;
        var temp = this.cloneArrayBoard(this.state.board); //Hold the board
        const allColumn = temp[row];
        const square = allColumn[col];

        const first = this.state.firstClick;
        const second = this.state.secondClick;

        let king = this.state.isKing;
        const garyTurn = this.state.isGrayTurn;
        let correct = true;

        ////////////// Check first click //////////////
        if (first[0] === -1 && ((square === 'KG' && garyTurn) ||
            (square === 'KB' && !garyTurn))) {
            king = true;
        }

        //Check if player move in him turn - if its a gray/black player and 
        //if it's his turn and its a first click or if the first player click is on 
        //empty square
        else if ((first[0] === -1 && square === 'G' && !this.state.isGrayTurn) ||
            (first[0] === -1 && square === 'B' && this.state.isGrayTurn)
            || (first[0] === -1 && square === 'X')) {
            this.setState({ status: "Wrong Player" })
            return;
        }


        //Init first and second click
        if (first[0] === -1) {
            first[0] = row;
            first[1] = col;
            this.setState({
                firstClick: first,
                isKing: king
            });
            return;
        }
        else {
            second[0] = row;
            second[1] = col;
            this.setState({
                secondClick: second
            });
        }

        ////////////// Check second click //////////////

        ///////King Progress///////
        if (king && !winner) {
            const player = garyTurn ? 'KG' : 'KB';
            const turn = garyTurn ? 'G' : 'B';
            var ans;
            if (square !== 'X' ||
                Math.abs(first[0] - second[0]) !== Math.abs(first[1] - second[1])) {
                this.setState({ status: "Can't go to this square" });
                correct = false;
            }
            else if (first[0] > second[0]) { //Move from bottom to top 
                if (first[1] > second[1]) {//Move from bottom right to top left
                    ans = Helper.checkIfKingCanEatFromBottomRight(first[0], first[1], second[0], temp, turn);
                    correct = true;
                }
                else if (first[1] < second[1]) {//Move from bottom left to top right
                    ans = Helper.checkIfKingCanEatFromBottomLeft(first[0], first[1], second[0], temp, turn);
                    correct = true;
                }
            }

            else if (first[0] < second[0]) {//Move from top to bottom
                if (first[1] > second[1]) {//Move from top right to bottom left
                    ans = Helper.checkIfKingCanEatFromTopRight(first[0], first[1], second[0], temp, turn);
                    correct = true;
                }
                else if (first[1] < second[1]) {//Move from left top to right bottom
                    ans = Helper.checkIfKingCanEatFromTopLeft(first[0], first[1], second[0], temp, turn);
                    correct = true;
                }
            }

            else if (first[0] === second[0]) {
                correct = false;
                this.setState({ status: "King can't move in the same line" })
            }
            if (ans !== false && correct) {
                temp = ans;
                const bRow = temp[first[0]];
                temp[first[0]] = Helper.changeTo(bRow, first[1], 'X');
                //Move the King
                const tRow = temp[second[0]];
                temp[second[0]] = Helper.changeTo(tRow, second[1], player);
            }
            else correct = false;
        }


        ///////Check Progress///////

        //Checks if the player went back or 
        //if the player has only progressed one line or
        //if gray want "eat" gray
        else if (garyTurn && (first[0] - second[0] !== 1 || square === 'G' ||
            Math.abs(first[1] - second[1]) !== 1)) {
            this.setState({ status: "Wrong Progressed - You can move just one line" })
            correct = false;
        }


        //Checks if the player went back or 
        //if the player has only progressed one line or
        //if black want "eat" black
        else if (!garyTurn && (second[0] - first[0] !== 1 || square === 'B' ||
            Math.abs(first[1] - second[1]) !== 1)) {
            this.setState({ status: "Wrong Progressed - You can move just one line" })
            correct = false;
        }

        ////////////// Check Player Eating  //////////////

        else if (square === 'X' && !winner) {
            //Move the player to new square
            temp[row] = Helper.changeTo(temp[row], col, garyTurn ? 'G' : 'B');
            //Change the old square to empty
            temp[first[0]] = Helper.changeTo(temp[first[0]], first[1], 'X');
            correct = true;
        }
        //Turn//
        else if (square !== 'X' && !winner) {
            //Check if there is a player on the sqauer after 
            const r = second[0];
            let c = second[1];
            var nextRow;
            if (first[1] > c) c--;
            else c++;

            if (!garyTurn) nextRow = r + 1;
            else nextRow = r - 1;
            let nRow = temp[nextRow];
            if (nRow[c] !== 'X') {
                correct = false;
                this.setState({ status: "Can't move to this square - no empty square" })
            }

            else if (Helper.checkEdge(row, col)) {
                //Change the square with black to X
                temp[row] = Helper.changeTo(temp[row], col, 'X');

                //Make the cuurent square to empty
                temp[first[0]] = Helper.changeTo(temp[first[0]], first[1], 'X');

                //Put the  player in a square 
                temp[nextRow] = Helper.changeTo(nRow, c, garyTurn ? 'G' : 'B');
                correct = true;
            }

            else {
                correct = false;
                this.setState({ status: "Can move to this square" })
            }
        }


        if (correct) {
            winner = Helper.checkWin(temp);
            let kingIndex;
            if (garyTurn && !winner) {
                kingIndex = Helper.checkKing(temp[0], 'G');
                if (kingIndex !== -1)
                    temp[0] = Helper.changeTo(temp[0], kingIndex, 'KG')

            }
            else if (!garyTurn && !winner) {
                kingIndex = Helper.checkKing(temp[7], 'B');
                if (kingIndex !== -1)
                    temp[7] = Helper.changeTo(temp[7], kingIndex, 'KB')
            }
            else if (winner === 'G'){
                this.setState({ status: "Gray is win!!" })
                this.setState({ turn: "Gray is win!!" })
            }

            else if (winner === 'B'){
                this.setState({ status: "Black is win!!" })
                this.setState({ turn: "Black is win!!" })
            }
            const oldBoard = this.state.history;
            oldBoard.push(this.cloneArrayBoard(this.state.board));
            
            this.setState({
                history: oldBoard,
                board: temp,
                firstClick: [-1, -1],
                secondClick: [-1, -1],
                isGrayTurn: !this.state.isGrayTurn,
                isKing: false,
                isWin: winner
            });
            return;
        }
        else {
            this.setState({
                firstClick: [-1, -1],
                secondClick: [-1, -1],
                isKing: false
            });
            return;
        }
    }


    getBoard = () => {
        return this.cloneArrayBoard(INITIAL_BOARD);
    } 

    //Clone the 2Darray
    cloneArrayBoard = (array) =>{
        return array.map( o => [...o]);
    }

    undo = () =>{
        if(this.state.history.length < 1){
            this.setState({ 
                status: "Cant do undo anymore!!" })
        }
        else{
            const history = this.state.history;
            const redo = this.state.redo;
            redo.push(this.state.board);
            this.setState({
                board: this.cloneArrayBoard(history.pop()),
                history: history,
                redo: redo,
                isGrayTurn: !this.state.isGrayTurn
            });
        }
    }

    redo = () =>{
        if(this.state.redo.length < 1){
            this.setState({ 
                status: "Cant do redo anymore!!" })
        }
        else{
            const redo = this.state.redo;
            const history = this.state.history;
            history.push(this.state.board);
            this.setState({
                board: this.cloneArrayBoard(redo.pop()),
                redo: redo,
                history: history,
                isGrayTurn: !this.state.isGrayTurn
            });
        }
    }

    start = () => {
        this.setState({
            board: this.getBoard(),
            isGrayTurn: false,
            firstClick: [-1, -1],
            secondClick: [-1, -1],
            status: "",
            isKing: false,
            isWin: false,
            history: Array(0),
            redo: Array(0)
        })
    }

    render() {
        console.log('render')

        const board = this.state.board;
        return (
            <div className="center" >
                <div >
                    {board.map((row, i) => (
                        <div className="row" key={i}>
                            {row.map((col, j) => (
                                <ListGroup key={j}>
                                    <Board allRow={row} row={i} col={j}
                                        onClick={(row, col) => this.handleClick(i, j)} >
                                    </Board>
                                </ListGroup>
                            ))}
                        </div>
                    ))}
                </div>

                <Text turn={this.state.isGrayTurn} status={this.state.status} />
                <Button variant="secondary" onClick = {this.undo}>Undo</Button>
                <Button variant="dark" onClick = {this.redo}>Redo</Button>
                <Button variant="secondary" onClick = {this.start}>Start New Game</Button>
            </div>
        );
    }
}


