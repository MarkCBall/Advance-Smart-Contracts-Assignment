import React, { Component } from "react";
import { connect } from "react-redux";
//import LoginRedux from "../redux/actions/LoginRedux";
import LoginRedux from "../redux/reducers/LoginRedux";
import ProposeNewCh from "./ProposeNewCh";
import ChButton from "./ChButton";


class SelectCh extends Component {
    constructor(props) {
        super(props);
        this.state = {
          //ToggleDispNewCh: false
        }
    }

    // toggleDispNewCh(){
    //     this.setState({ToggleDispNewCh:!this.state.ToggleDispNewCh})
    // }

    render() {
        return (
            <div>

                <button className="btn btn-info" onClick={this.handleTogglePNC}>Toggle Propose New Channel</button>
                { !this.props.showNewChannelForm
                    ? <ProposeNewCh/>
                    : null
                    

                }
                
                
                
                {/* <button className="btn btn-info" onClick={this.toggleDispNewCh.bind(this)}>Toggle Propose New Channel</button>
                {this.state.ToggleDispNewCh &&
                <ProposeNewCh/>
                } */}
                <br/>


                Pending your acceptance: &ensp;
                {Object.keys(this.props.RequestedChannels).map(obj => {
                        return <ChButton key={obj} CID={obj} isOngoing={false}/>
                        })
                    }
                <br/>
                <br></br>

                Pending other acceptance:&ensp;
                {Object.keys(this.props.PendingChannels).map(obj => {
                    return <ChButton key={obj} CID={obj} isOngoing={false}/>
                    })
                }
                <br/>
                <br></br>

                Ongoing/Closing: &ensp;
                {Object.keys(this.props.OngoingChannels).map(obj => {
                    return <ChButton key={obj} CID={obj} isOngoing={true}/>
                    })
                }
                <br/>
                
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        OngoingChannels: state.API_StateChGaming.OngoingChannels,
        PendingChannels: state.InteractDatabase.PendingChannels,
        RequestedChannels: state.InteractDatabase.RequestedChannels,
        activeChannel: state.LoginDetails.activeChannel,
        showNewChannelForm: state.LoginDetails.showNewChannelForm
    }
}
export default connect(mapStateToProps)(SelectCh);




//export default SelectCh;

