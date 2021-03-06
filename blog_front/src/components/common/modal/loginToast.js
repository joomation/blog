import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {TransitionMotion,spring} from 'react-motion';
const springOption={
    enter:{
        stiffness: 180, 
        damping: 30
    },
    leave:{
        stiffness: 180, 
        damping: 30
    }
}
class LoginToast extends Component {
    constructor(props){
        super(props);
        this.state={
            item:[]
        }
    }
    componentDidUpdate(prevProps, prevState){
        if(prevProps.open !== this.props.open) {
            if(!this.props.open) {
                this.setState({
                    item:[]
                })
            }else{
                this.setState({
                    item:[
                        {
                            key: 'toast',
                            style:{
                                size:spring(0,springOption.enter)
                            },
                        },
    
                    ]
                });
            }
          }    
    }
    willEnter=()=>{
        return {
            size:200
        }
    }
    willLeave=()=>{
        return{
            size:spring(220,springOption.leave)
        }
    }
    render() {
        
        return(       
            <TransitionMotion
            styles={this.state.item.map(item=>({
                key:item.key,
                style:item.style
            }))}
            willEnter={this.willEnter}
            willLeave={this.willLeave}
            didLeave={this.didLeave}              
        >
            {interpolatedStyles=>
            <div>
                {interpolatedStyles.map(config => {
                return(
                    <div className="login-toast"
                    key={config.key}
                    style={{
                        transform:`translate3d(${config.style.size}px,0,0)`,
                    }}
                    >
                        {this.props.isLogin?
                        <div className="avatar"
                        style={{backgroundImage:`url(${this.props.userImg})`}}
                        >
                        </div>:null
                        }
                        <div className={`user-info ${this.props.isLogin?'left':'center'}`}>
                            {this.props.isLogin?
                            <p className="type">{this.props.type}</p>:null
                            }
                            {this.props.children}
                        </div>
                    </div>
                )
                })}
            </div>  
            }
            </TransitionMotion>      
            );
        }
}

LoginToast.propTypes = {
    open:PropTypes.bool,
};

export default LoginToast;