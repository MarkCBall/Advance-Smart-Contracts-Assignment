import React, { Component } from "react";
import BoardRedux from "../redux/actions/BoardRedux";
import InteractDatabase from "../redux/actions/InteractDatabase";
import { connect } from "react-redux";

import BoardTranslations from "../Library/BoardTranslations"
import { BigNumber } from "ethers/utils";

class GameStats extends Component {


    componentDidMount(){
        let boardBN = new BigNumber("0x000000000000000080828486898b8d8f90929496a9abadafb0b2b4b6b9bbbdbf"); //64 digits long,
        this.props.calcBoardMatrix(boardBN)
    }

    renderBoardBN = (boardBN) =>{
        return <div>
            {boardBN.substr(0,18)}
            <br/>{boardBN.substr(18,24)}
            <br/>{boardBN.substr(42,24)}
        </div>
    }

    downloadData = () =>{
        var file = new Blob([JSON.stringify(this.props.boardMatricies)], {type: 'application/json'});
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, 'BoardHistory');
        else { // Others
            var a = document.createElement("a"),
                    url = URL.createObjectURL(file);
            a.href = url;
            a.download = 'BoardHistory';
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);  
            }, 0); 
        }
    }

    

     render() {
        return (
            <div>
                <button onClick={this.downloadData}>Download Board History</button>
                <br/>Propose board as a string:
                <br/><button onClick={()=> 
                    this.props.signAndPostMove(BoardTranslations.MatrixAndMoveToBNStr(this.props.boardMatrix,this.props.prevMove,this.props.turnNum))}
                    >Sign and send move</button><button>Post move to blockchain</button>

                <br/><button onClick={()=>{this.props.getLatestMove()}}>get latest move</button>


                {this.renderBoardBN(BoardTranslations.MatrixAndMoveToBNStr(this.props.boardMatrix,this.props.prevMove,this.props.turnNum))}
                <br/><br/>
                opponent gave you this string
                {this.renderBoardBN(BoardTranslations.MatrixAndMoveToBNStr(this.props.boardMatrix,this.props.prevMove,this.props.turnNum))}
                <button>if invalid, repost previous move on blockchain</button>

            </div>
        )
    }            
}

function mapStateToProps(state) {
    return {
        boardMatricies: state.BoardRedux.boardMatricies,
        boardMatrix: state.BoardRedux.boardMatrix,
        p1Turn: state.BoardRedux.p1Turn,
        prevMove:state.BoardRedux.prevMove,
        turnNum: state.BoardRedux.turnNum
    }
}

function mapDispatchToProps(dispatch) {
    return {
        calcBoardMatrix: (boardBN) =>{
            dispatch(BoardRedux.calcBoardMatrix(dispatch, boardBN))
        },
        signAndPostMove: (boardBN) =>{
            dispatch(InteractDatabase.signAndPostMove(dispatch, boardBN))
        },
        getLatestMove: ()=>{
            dispatch(InteractDatabase.getLatestMove(dispatch))
        },

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(GameStats);
