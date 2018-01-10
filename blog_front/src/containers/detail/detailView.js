import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import dateFormat from 'dateformat';
//components
import {Documentation} from 'components/detail';
//redux
import * as commonAction from 'redux/common';
import * as httpRequest from 'redux/helper/httpRequest';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as modalActions from 'redux/modal';
import * as motionActions from 'redux/main';
import * as postsAction from 'redux/posts';

//svg&images

class DetailView extends Component {
    constructor(props){
        super(props);
        this.state={
            windowWidth:0,
            windowHeight:0,
            frameWrap:0,
            frameSizeX:0,
            frameSizeY:0,
            frameDivide:false,
            frameFull:false,
            mobileMode:false,
            deskMode:true,
            iframeLoad:false,
            doc:false,
            commentsText:'',
            modifyIndex:null,
            commentView:'',
            replyText:''
        }
    }
    componentDidMount(){   
        this.dimentions();
        window.addEventListener('resize',this.dimentions);
        const {get}=this.props; 
        window.addEventListener('click',this.outHide);
        setTimeout(()=>{
            get.getSinglePost('POSTS/SINGLE_GET',this.props.match.params.category,this.props.match.params.postId);
        },400)
    }
    componentWillUnmount(){
        window.removeEventListener("resize", this.dimentions);  
 
    }
    componentWillReceiveProps(nextProps) {
        const {get,data,motionDispatch,handleHeader,motion,loading,commentsLoading,dataState}=nextProps;
        const locationChanged = nextProps.location !== this.props.location;
        if(locationChanged){
            setTimeout(()=>{
                get.getSinglePost('POSTS/SINGLE_GET',nextProps.match.params.category,nextProps.match.params.postId);
            },400)
        }
        if(!motion.detailLoad){
            this.setState({
                iframeLoad:false
            })
            if(this.props.loading!==loading && dataState==="success"){ 
                let isBright = (parseInt(this.get_brightness(data.bgColor),10) > 160);                
                motionDispatch.motionActions({
                    motions:{
                        bgColor:data.bgColor,
                        detailLoad:true
                    }
                });  
                handleHeader.isBrightness({
                    isBright:isBright
                });
            }
        }
        //change commentsData
        if(this.props.commentsLoading!==commentsLoading){
            //when update complete,modify hide
            if(!commentsLoading){
                this.setState({
                    modifyIndex:null
                })
            }
        }
 

    }

    //window resize width
    dimentions=()=>{
        const{motionDispatch}=this.props;
        const {mobileMode} = this.state;
        let sizeX;
        let sizeY;
        const frameWrap=document.documentElement.clientWidth<1900?
        document.documentElement.clientWidth<1600?
        document.documentElement.clientWidth<1400?
        document.documentElement.clientWidth:
        900:
        900:
        document.documentElement.clientWidth*0.6;
        const frameDivide=document.documentElement.clientWidth<1400?false:true;
        if(mobileMode){
            sizeX='375px';
            sizeY=600;
        }else{
            sizeX='100%';
            sizeY=document.documentElement.clientHeight-200;
        }
        this.setState({
            windowWidth:document.documentElement.clientWidth,
            windowHeight:document.documentElement.clientHeight,
            frameSizeX:sizeX,
            frameSizeY:sizeY,
            frameDivide:frameDivide,
            frameFull:document.documentElement.clientWidth<1400?true:false,
            frameWrap:frameWrap,
            doc:false
        })
    }
  
    //바깥 클릭 시 메뉴드랍 접기
    outHide=(e)=>{
        const {modalView,modal}=this.props;
        if(modal.postAuth.open){
            modalView.closeModal({
                modalName:'postAuth'
            });
        }
    }
    //메뉴 드랍다운
    dropdown=(e)=>{
        e.stopPropagation();
        const {modal,modalView}=this.props;
        if(modal.postAuth.open){
            modalView.closeModal({
                modalName:'postAuth'
            }); 
        }else{
            modalView.openModal({
                modalName:'postAuth'
            }); 
        }      
    }
    layerclose=()=>{
        this.props.history.goBack();
        
    }
    iframeLoad=()=>{
        const {motion} = this.props;
        if(motion.detailLoad){
            this.setState({
                iframeLoad:true
            })
        }
        
        
    }
    modeChange=(mode)=>{
        const{frameWrap}=this.state;
        if(mode==="mobile"){
            this.setState({
                mobileMode:true,
                deskMode:false,
                frameSizeX:'375px',
                frameSizeY:600
            });
        }else{
            this.setState({
                mobileMode:false,
                deskMode:true,
                frameSizeX:'100%',
                frameSizeY:document.documentElement.clientHeight-200
            })
        }
    }
   get_brightness=(hexCode)=>{
        hexCode = hexCode.replace('#', '');
        var c_r = parseInt(hexCode.substr(0, 2),16);
        var c_g = parseInt(hexCode.substr(2, 2),16);
        var c_b = parseInt(hexCode.substr(4, 2),16);
        return ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;
    }
    renderView=({ style, ...props })=>{
        return (
            <div {...props} style={{ ...style }}/>
        );
    }
    fullSize=()=>{
        this.setState({
            frameFull:!this.state.frameFull
        })
    }
    scrollDown=()=>{
        this.setState({
            doc:!this.state.doc
        });
    }
    commentsOnChange=(type,i,rei,e)=>{
    
        const {input,data}=this.props
        if(type==='write'){
            this.setState({
                commentsText:e.target.value
            })
        }else if(type==='modify'){
            input.modifyComments({
                index:i,
                body:e.target.value,
                view:'write'
            })
        }else if(type==='reply'){
            this.setState({
                replyText:e.target.value
            })
        }else if(type==='replyModify'){
            input.modifyComments({
                index:i,
                replyIndex:rei,
                body:e.target.value,
                view:'reply'
            })
        }
    }
    writeComments=(postId,type,i)=>{
        const now = new Date();
        const {get,data,authUser,modalView}=this.props;
        if(authUser.isLogin){
            if(type==='write'){
                return get.writeComments({   
                    data:{
                        comments:{
                            oauthID:authUser.user.oauthID,
                            name:authUser.user.userName,
                            date:dateFormat(now,"mmm d, yyyy"),
                            body:this.state.commentsText,
                        }
                    },
                    postId:postId,
                    type:'POSTS/COMMENTS_SAVE'
                });
            }else if(type==='modify'){
                return get.updateComments({   
                    data:data,
                    postId:postId,
                    type:'POSTS/COMMENTS_UPDATE'
                });
            }else if(type==='reply'){
                return get.replyComments({   
                    data:{
                        reply:{
                            oauthID:authUser.user.oauthID,
                            name:authUser.user.userName,
                            date:dateFormat(now,"mmm d, yyyy"),
                            body:this.state.replyText,
                        }
                    },
                    index:i,
                    postId:postId,
                    type:'POSTS/COMMENTS_REPLY'
                });
            }else if(type==='replyModify'){
                return get.updateComments({   
                    data:data,
                    postId:postId,
                    type:'POSTS/COMMENTS_UPDATE'
                });
            }
        }else{
            return modalView.openModal({
                        modalName:'login'
                    });
        }
    }
    writeMode=(type,i,rei)=>{
        if(type==='modify'){
            return this.setState({
                modifyIndex:i,
                commentView:'modify'
            })
        }else if(type==='reply'){
            return this.setState({
                modifyIndex:i,
                commentView:'reply'
            })
        }else if(type==='replyModify'){
            return this.setState({
                modifyIndex:rei,
                commentView:'replyModify'
            })
        }
        
    }

    delComments=(id,type,i,rei)=>{
        const{get}=this.props;
        get.deleteComments({
            type:'POSTS/COMMENTS_DELETE',
            view:type,
            id:id,
            index:i,
            replyIndex:rei
        });
 
    }
    
    render() {
        const {data,motion,get,authUser,commentsLoading}=this.props;
        const {replyText,commentView,windowWidth,windowHeight,iframeLoad,frameWrap,frameSizeX,frameSizeY,frameDivide,frameFull,doc,commentsText,modifyIndex} = this.state;
        return (
            <div className={`detail-frame`}>
                <div className={`detail-main ${motion.detailLoad?'animate':''}`}
                    style={{
                        width:frameFull?`${windowWidth}px`:motion.detailLoad?`${frameWrap}px`:`${windowWidth}px`,
                        height:doc?`100px`:`${windowHeight}px`,
                        backgroundColor:motion.bgColor
                    }}>
                    <div className={`loading-text ${iframeLoad?'fade-out':''}`}>
                        <h3>Loading...</h3>
                    </div>
                    {motion.detailLoad? 
                        <div key={data._id} className={`detail-simulate ${doc?'fade-out':''}`}>
                            <div className={`fullsize ${!frameDivide?'fade-out':''}`} onClick={this.fullSize}>
                                <span></span>
                                <span></span>
                            </div>
                            <div className="device-controll-wrap">
                                <div className="device-controll">
                                    <div className="dic mobile" onClick={this.modeChange.bind(this,'mobile')}>
                                        <span className="icon-device"></span>
                                        <span className="icon-text">Phone</span>
                                    </div>
                                    <div className="dic desk" onClick={this.modeChange.bind(this,'desk')}>
                                        <span className="icon-device"></span>
                                        <span className="icon-text">Desktop</span>
                                    </div>
                                    <div className="dic visit-site">
                                        <a href={data.iframeUrl}>Visit Site</a>
                                    </div>
                                </div>
                            </div>
                            
                            <div key={data._id} className={`iframe-wrap ${iframeLoad?'animate':''}`}
                                style={{
                                    width:frameSizeX,
                                    height:`${frameSizeY}px`,
                                    transform:`scale(${iframeLoad?1:0.3})`
                                }}
                            >
                                
                                <iframe title="This is a detailView" key="i" src={data.iframeUrl}
                                    onLoad={this.iframeLoad} 
                                    frameBorder="0" width={"100%"} height="100%"></iframe>
                            </div>  
                        </div>
                    :null} 
                    {motion.detailLoad?
                    <div className={`scroll-doc ${!frameFull?'fade-out':''}`}>
                        <span onClick={this.scrollDown}>{doc?`Preview`:`Documentation`}</span>
                    </div> :null
                    }
                    
                </div>
                
                {motion.detailLoad?
                    <Scrollbars
                    className={`detail-doc ${frameFull?'full':'divide'} ${doc?'doc':'preview'}`}
                    renderView={this.renderView}
                    style={{
                        width:frameFull?`100%`:`calc(100% - ${frameWrap}px)`,
                        height:frameFull?`calc(100% - 100px)`:`${windowHeight}px`,
                    }}>
                        <Documentation 
                            className={`detail-contents-wrap ${motion.detailLoad?'animate':''}`} 

                            data={data}
                            commentsData={data.comments}
                            writeComments={this.writeComments.bind(this,data._id)}
                            
                            delComments={this.delComments.bind(this,data._id)}
                            currentUser={authUser.user}

                            commentsOnChange={this.commentsOnChange}
                            commentsText={commentsText}
                            replyText={replyText}

                            modifyIndex={modifyIndex}
                            commentView={commentView}
                            writeMode={this.writeMode}
                        />
                    </Scrollbars>
                    :null
                }
                
            </div>
        )
    }
}


export default connect(
    (state)=>({
        authUser:state.auth.toJS().profile,
        common:state.common.toJS(),        
        motion:state.main.toJS().motions,
        modal:state.modal.toJS(),
        data:state.posts.toJS().itemData.data,
        loading:state.posts.toJS().itemData.pending,
        commentsLoading:state.posts.toJS().itemData.comments.pending,
        dataState:state.posts.toJS().itemData.state,
    }),
    (dispatch)=>({
        get:bindActionCreators(httpRequest,dispatch),
        modalView: bindActionCreators(modalActions, dispatch),
        motionDispatch:bindActionCreators(motionActions,dispatch),
        handleHeader:bindActionCreators(commonAction,dispatch),
        input: bindActionCreators(postsAction, dispatch),
    })
)(DetailView);