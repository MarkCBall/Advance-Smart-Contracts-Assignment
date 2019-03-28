import React, { Component } from "react";
import { connect } from "react-redux";
import LoginRedux from "../redux/actions/LoginRedux";
import InteractDatabase from "../redux/actions/InteractDatabase";


class ChButton extends Component {


    render() {
        return (
                <>
                    {(this.props.CID === this.props.activeChannel) ?
                        <button 
                            className="btn btn-info btn-sm active"
                            onClick={() => this.props.setActiveChannel(this.props.CID,this.props.isOngoing)}
                        >
                            CH{this.props.CID}
                        </button>
                    :
                        <button 
                            className="btn btn-info btn-sm disabled"
                            onClick={() => this.props.setActiveChannel(this.props.CID, this.props.isOngoing)}
                        >
                            CH{this.props.CID}
                        </button>
                    }
                </>

        );
    }
}

function mapStateToProps(state) {
    return {
        activeChannel: state.LoginDetails.activeChannel.channel
    }
}
function mapDispatchToProps(dispatch) {
    return {
        setActiveChannel: (CID, isOngoing) => {
            
            dispatch(InteractDatabase.getChannelDetails(dispatch,CID));
            dispatch(InteractDatabase.getHighestNonce(dispatch,CID));
            dispatch(InteractDatabase.getHighestSignedNonce(dispatch,CID));
            //
            dispatch(LoginRedux.setActiveChannel(dispatch, CID, isOngoing));
        }
    }
}
export default connect( mapStateToProps, mapDispatchToProps)(ChButton);

