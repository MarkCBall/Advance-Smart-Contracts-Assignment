import {ethers} from "ethers";
import { MERGE_BLOCKCHAIN_GETGAME } from "../constants/ActionTypes";
import { BigNumber } from "ethers/utils";
import { provider } from "../constants/Other";
import { StateChGamingAddr } from "../constants/Other";
import { StateChGamingAbi } from "../constants/Other";
import { StateChGamingContract } from "../constants/Other";

export default {

    initGame: () =>{
        return async (dispatch,getState) => {
            let activeWallet = new ethers.Wallet(getState().LoginDetails.privKey).connect(provider)
            let callableContract = new ethers.Contract(StateChGamingAddr,StateChGamingAbi, activeWallet)
            let GD = getState().GameData
            await callableContract.initGame(
                GD.ERC20Amount,
                GD.ERC20Addr,
                GD.gameID,
                GD.p1Addr,
                GD.p2Addr,
                GD.VCAddr,
                GD.turnLength,
                GD.gameSig.v,
                GD.gameSig.r,
                GD.gameSig.s
            )
            //unconnect wallet?
            //dispatch a state update to re-render
        }
    },
    unenforcedBCMove:(dispatch, newBNStr) => {
        return async (dispatch,getState) => {
            if (window.confirm("call unenformedBCMove?")){
                let gameID = getState().GameData.gameID
                let activeWallet = new ethers.Wallet(getState().LoginDetails.privKey).connect(provider)
                let callableContract = new ethers.Contract(StateChGamingAddr,StateChGamingAbi, activeWallet)
                let BN = new BigNumber(newBNStr);
                console.log(gameID)
                console.log(BN)
                console.log(
                    await callableContract.unenforcedBCMove(gameID,BN)
                )
            }
        }
    },
    // enforcedBCMove:(dispatch, newBNStr) => {
    //     return async (dispatch,getState) => {
    //     if (window.confirm("call enformedBCMove?")){

    //     }

    //     }
    // },


                 
    getGame: (dispatch, gameID, timestamp) => {
        return async (dispatch,getState) => {
            let game = await StateChGamingContract.allGames(gameID)
            let gameData
            // if the game is initialized
            if(game.state.toString().length!==1){
                // console.log("xx with ",game.state)
                gameData = {
                    p1Addr:game.p1.toLowerCase(),
                    p2Addr:game.p2.toLowerCase(),
                    ERC20Amount:game.gamePayout.toString(),
                    boardBN:game.state,//.toString(16),
                    turnNum: game.state.toHexString().substring(2).padStart(64,"0").slice(8,16), 
                    blockNum:game.blockNum.toString(),
                    VCAddr:game.vcAddr,
                    ERC20Addr:game.tokenAddr,
                    turnLength:game.blocksPerTurn.toString(),
                    latestBCTimestamp:timestamp,
                    iAmP1Red:(getState().LoginDetails.addressSignedIn === game.p1.toLowerCase()),
                    iAmP2Black:(getState().LoginDetails.addressSignedIn === game.p2.toLowerCase())
                }
                // console.log("BC response", gameData)
                dispatch({
                    type: MERGE_BLOCKCHAIN_GETGAME,
                    payload: gameData
                })
            } 
        }
    },

}