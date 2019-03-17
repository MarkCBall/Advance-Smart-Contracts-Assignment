import React, { Component } from "react";
// import {ethers} from "ethers";
import { BigNumber } from "ethers/utils";
// import { connect } from "react-redux";
// import InteractReduxState from "../redux/actions/InteractReduxState";
// import InteractDatabase from "../redux/actions/InteractDatabase";
// import InteractBlockchain from "../redux/actions/InteractBlockchain";
// import {isValidAddress} from "ethereumjs-util";

import './Board.css';
//mport { Button } from 'react-bootstrap';

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            boardMatrix: [],
            validMovesMatrix: this.createEmptyValidMovesMatrix(),
            activeSquare: {}
        }
}

    


    componentDidMount(){
        let piecesBN = new BigNumber("0x80828486898b8d8f909294960000000000000000a9abadafb0b2b4b6b9bbbdbf"); //64 digits long,
        //setup an empty board
        let boardMatrix = []
        for (let row =0;row<8;row++){
            boardMatrix.push([])
            for (let col=0;col<8;col++){
                boardMatrix[row][col] = {row:row, col:col, active:0}
            }
        }
        //parse the bignumber into pieces data
        let str = piecesBN.toHexString()
        for (let i=1;i<33;i++){
            let pieceHex = str.substr(i*2,2)
            let pieceBinary =  (parseInt(pieceHex, 16)).toString(2).padStart(8,"0")
            let col = parseInt(pieceBinary.substr(5,3),2)
            let row = parseInt(pieceBinary.substr(2,3),2)

            //fill pieces into the board
            if (pieceBinary.charAt(0) === "1"){
                boardMatrix[row][col] = {
                    id: i-1,
                    red: (i<17),
                    active: (pieceBinary.charAt(0) === "1"),
                    queen: (pieceBinary.charAt(1) === "1"),
                    row:row,
                    col:col
                }
            }
        }
        this.setState({
            ...this.state,
            boardMatrix:boardMatrix
        })

    }
    createEmptyValidMovesMatrix = () =>{
        let validMovesMatrix = []
        for (let row =0;row<8;row++){
            validMovesMatrix.push([])
            for (let col=0;col<8;col++){
                validMovesMatrix[row][col] = false;
            }
        }
        return validMovesMatrix
    }

    renderPiece = (piece) => {
        //console.log(piece)
        let temp = () =>{
            if (piece.active)
                if (piece.red){
                    if (piece.queen){
                        return <div className="red queen" onClick={()=>this.handlePieceClick(this.state.boardMatrix,piece)}></div>
                    }
                    else{
                        return <div className="red" onClick={()=>this.handlePieceClick(this.state.boardMatrix,piece)}></div>
                    }
                }else{
                    if (piece.queen){
                        return <div className="black queen" onClick={()=>this.handlePieceClick(this.state.boardMatrix,piece)}></div>
                    }
                    else{
                        return <div className="black" onClick={()=>this.handlePieceClick(this.state.boardMatrix,piece)}></div>
                    }
                }
            }

        if (this.state.validMovesMatrix[piece.row][piece.col])
            //console.log(piece.row, piece.col)
            return <div className="valid" onClick={()=>this.handleMove(this.state.boardMatrix,piece,this.state.activeSquare)}>{temp()}</div>
        if (piece.row === this.state.activeSquare.row && piece.col === this.state.activeSquare.col)
            return <div className="selected" >{temp()}</div>
        else 
            return temp()
    }

   
    handleMove = (board,validSpot,activeSquare) => {
        let boardMatrix = board;
        let dataToUpdate = {row:validSpot.row, col:validSpot.col}
        //if you get to the end of the board, make the piece a queen
        if (validSpot.row === 7 || validSpot.row === 0){
            dataToUpdate = {...dataToUpdate, queen:true}
        }
        //if you moved two squares, it was an attack - kill the jumped piece
        if (Math.abs(validSpot.row - activeSquare.row)>1){
            let killedRow = (validSpot.row + activeSquare.row)/2
            let killedCol = (validSpot.col + activeSquare.col)/2
            boardMatrix[killedRow][killedCol] = {active:0, row:killedRow, col:killedCol}
        }

        boardMatrix[validSpot.row][validSpot.col] = {
            ...boardMatrix[activeSquare.row][activeSquare.col],
            ...dataToUpdate
        }
        boardMatrix[activeSquare.row][activeSquare.col] = {active:0, row:activeSquare.row, col:activeSquare.col}
        this.setState({
            ...this.state,
            boardMatrix:boardMatrix,
            validMovesMatrix: this.createEmptyValidMovesMatrix(),
            activeSquare: {}
        })
        //do some calls to backend here
    }

    //currently you can kill your own piece??????
    NWValid = (boardMatrix,piece) =>{
        return ((piece.row > 0) && (piece.col>0) && !boardMatrix[piece.row-1][piece.col-1].active && (!piece.red || piece.queen))
    }
    NEValid = (boardMatrix,piece) =>{
        return ((piece.row > 0) && (piece.col<7) && !boardMatrix[piece.row-1][piece.col+1].active && (!piece.red || piece.queen))
    }
    SEValid = (boardMatrix,piece) =>{
        return ((piece.row < 7) && (piece.col<7) && !boardMatrix[piece.row+1][piece.col+1].active && (piece.red || piece.queen))
    }
    SWValid = (boardMatrix,piece) =>{
        return ((piece.row < 7) && (piece.col>0) && !boardMatrix[piece.row+1][piece.col-1].active && (piece.red || piece.queen))
    }


    NWValidAttack = (boardMatrix,piece) =>{
        return ((piece.row > 1) && (piece.col > 1) && boardMatrix[piece.row-1][piece.col-1].active && (!piece.red || piece.queen)
        &&  !boardMatrix[piece.row-2][piece.col-2].active && (boardMatrix[piece.row-1][piece.col-1].red !== piece.red) )
    }
    NEValidAttack = (boardMatrix,piece) =>{
        return ((piece.row > 1) && (piece.col < 6) && boardMatrix[piece.row-1][piece.col+1].active && (!piece.red || piece.queen)
        &&  !boardMatrix[piece.row-2][piece.col+2].active && (boardMatrix[piece.row-1][piece.col+1].red !== piece.red) )
    }
    SEValidAttack = (boardMatrix,piece) =>{
        return ((piece.row < 6) && (piece.col < 6) && boardMatrix[piece.row+1][piece.col+1].active && (piece.red || piece.queen)
        &&  !boardMatrix[piece.row+2][piece.col+2].active && (boardMatrix[piece.row+1][piece.col+1].red !== piece.red) )
    }
    SWValidAttack = (boardMatrix,piece) =>{
        return ((piece.row < 6) && (piece.col > 1) && boardMatrix[piece.row+1][piece.col-1].active && (piece.red || piece.queen)
        &&  !boardMatrix[piece.row+2][piece.col-2].active && (boardMatrix[piece.row+1][piece.col-1].red !== piece.red) )
    }

    handlePieceClick = (boardMatrix, piece) =>{
        let validMovesMatrix = this.createEmptyValidMovesMatrix()


        if (this.NWValid(boardMatrix,piece)){
            validMovesMatrix[piece.row-1][piece.col-1] = true;
        }
        if (this.NEValid(boardMatrix,piece)){
            validMovesMatrix[piece.row-1][piece.col+1] = true;
        }
        if (this.SEValid(boardMatrix,piece)){
            validMovesMatrix[piece.row+1][piece.col+1] = true;
        }
        if (this.SWValid(boardMatrix,piece)){
            validMovesMatrix[piece.row+1][piece.col-1] = true;
        }

        if (this.NWValidAttack(boardMatrix,piece)){
            validMovesMatrix[piece.row-2][piece.col-2] = true;
        }
        if (this.NEValidAttack(boardMatrix,piece)){
            validMovesMatrix[piece.row-2][piece.col+2] = true;
        }
        if (this.SEValidAttack(boardMatrix,piece)){
            validMovesMatrix[piece.row+2][piece.col+2] = true;
        }
        if (this.SWValidAttack(boardMatrix,piece)){
            validMovesMatrix[piece.row+2][piece.col-2] = true;
        }




        this.setState({
            ...this.state,
            activeSquare:{row:piece.row, col:piece.col},
            validMovesMatrix:validMovesMatrix
        })

    }


    render() {
        return (
            <div>
                
                <div className="container center">
            
                    {this.state.boardMatrix.map((row,rowIndex) =>
                        <div key={rowIndex} className="row">
                            {row.map((piece,colIndex) =>
                                <div key={colIndex} className={"color"+((rowIndex+colIndex)%2)}>
                                    {this.renderPiece(piece)}
                                </div>
                            )}
                        </div>
                    )}
     
                </div> 
                          
            </div>
        )
    }
                
}

export default Board;
