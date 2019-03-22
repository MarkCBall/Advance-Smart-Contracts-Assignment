import React, { Component } from "react";
import { connect } from "react-redux";
import Piece from "./Piece";

import './Board.css';

class Board extends Component {

    renderSquare = (rowIndex, colIndex, piece) =>{
        return <div key={colIndex} className={"color"+((rowIndex+colIndex)%2)}>
                    <Piece piece={piece}/>
                </div>
    }
    
    render() {
        return (
            <div>
                <p>TURN# {this.props.turnNum+1}</p>
                <div className="container">
                    {this.props.boardMatrix.map((row,rowIndex) =>
                        <div key={rowIndex} className="row">
                            {row.map((piece,colIndex) =>
                                this.renderSquare(rowIndex, colIndex, piece)
                            )}
                        </div>
                    )}
                </div>        
            </div>
        )
    }       
}

function mapStateToProps(state) {
    return {
        boardMatrix: state.BoardRedux.boardMatrix,
        prevMove:state.BoardRedux.prevMove,
        turnNum:state.BoardRedux.turnNum
    }
}
export default connect(mapStateToProps)(Board);