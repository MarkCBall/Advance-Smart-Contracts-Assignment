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
        return <div>
            {boardBN.substr(0,18)}
            <br/>{boardBN.substr(18,24)}
            <br/>{boardBN.substr(42,24)}
        </div>
    }

    

     render() {
        return (
            <div>
                <br/>Propose board as a string:
                <br/><button>Sign and send move</button><button>Post move to blockchain</button>
                {this.renderBoardBN(BoardTranslations.MatrixAndMoveToBNStr(this.props.boardMatrix,this.props.prevMove))}
                if str != oldstr
                <br/><br/>
                opponent gave you this string
                {this.renderBoardBN(BoardTranslations.MatrixAndMoveToBNStr(this.props.boardMatrix,this.props.prevMove))}
                <button>if invalid, repost previous move on blockchain</button>

            </div>
        )
    }            
}

function mapStateToProps(state) {
    return {
        boardMatrix: state.BoardRedux.boardMatrix,
        p1Turn: state.BoardRedux.p1Turn,
        prevMove:state.BoardRedux.prevMove
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

