import React, { Component } from "react";
import BoardRedux from "../redux/actions/BoardRedux";
import { connect } from "react-redux";

import BoardTranslations from "../Library/BoardTranslations"
import { BigNumber } from "ethers/utils";

class GameStats extends Component {


    componentDidMount(){
        let piecesBN = new BigNumber("0x000000000000000080828486898b8d8f90929496a9abadafb0b2b4b6b9bbbdbf"); //64 digits long,
        this.props.calcBoardMatrix(piecesBN)
    }

    renderBoardBN = (boardBN) =>{
        //console.log(BNString)
        return <div>
            <br/>Board as a string is:
            <br/>{boardBN.substr(0,18)}
            <br/>{boardBN.substr(18,24)}
            <br/>{boardBN.substr(42,24)}
        </div>

    }

     render() {
        return (
            <div>
                {this.renderBoardBN(BoardTranslations.MatrixtoBN(this.props.boardMatrix))}
                <p>{this.props.p1Turn ? "P1 RED TURN" : "P2 BLACK TURN"}</p>        
            </div>
        )
    }            
}

function mapStateToProps(state) {
    return {
        boardMatrix: state.BoardRedux.boardMatrix,
        validp1TurnMovesMatrix: state.BoardRedux.p1Turn,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        calcBoardMatrix: (piecesBN) =>{
            dispatch(BoardRedux.calcBoardMatrix(dispatch, piecesBN))
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(GameStats);

