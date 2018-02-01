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
import IconPhone from 'images/iconPhone';
import IconDesk from 'images/iconDesk';
import IconBack from 'images/iconBack';
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
            replyText:'',
            modifyIndex:null,
            commentView:'',
            isBright:false,
            deskView:true
            
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
            this.dimentions()
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
                this.setState({
                    isBright:isBright
                })
            }
        }
        //change commentsData
        if(this.props.commentsLoading!==commentsLoading){
            //when update complete,modify hide
            if(!commentsLoading){
                this.setState({
                    modifyIndex:null,
                    commentsText:'',
                    replyText:'',
                })
            }
        }
 

    }

    //window resize width
    dimentions=()=>{
        const{motionDispatch}=this.props;
        const {mobileMode} = this.state;
        let windowWidth=document.documentElement.clientWidth;
        let windowHeight=document.documentElement.clientHeight;
        let sizeX;
        let sizeY=windowHeight-200;
        const frameWrap=windowWidth<1900?
        windowWidth<1600?
        windowWidth<1400?
        windowWidth:
        900:
        900:
        windowWidth*0.6;
        const frameDivide=windowWidth<1400?false:true;
        if(mobileMode){
            sizeX=windowWidth<768?'100%':'375px';
        }else{
            sizeX='100%';
        }
        this.setState({
            windowWidth:windowWidth,
            windowHeight:document.documentElement.clientHeight,
            frameSizeX:sizeX,
            frameSizeY:sizeY,
            frameDivide:frameDivide,
            frameFull:windowWidth<1400?true:false,
            frameWrap:frameWrap,
            doc:false,
            deskView:windowWidth<768?false:true,
            deskMode:windowWidth<768?false:true,
            mobileMode:windowWidth<768?true:false,
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
            });
        }else{
            this.setState({
                mobileMode:false,
                deskMode:true,
                frameSizeX:'100%',
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
    commentsOnChange=(type,e)=>{
        const {input,authUser,modalView}=this.props;
        if(!authUser.isLogin){
            return modalView.openModal({
                modalName:'login'
            });
        }
        if(type==='write'){
            this.setState({
                commentsText:e.target.value
            })
        }else if(type==='modify'){
            this.setState({
                replyText:e.target.value
            })
        }else if(type==='reply'){
            this.setState({
                replyText:e.target.value
            })
        }else if(type==='replyModify'){
            this.setState({
                replyText:e.target.value
            })
        }
    }
    writeComments=(postId,type,i,rei,e)=>{
        e.stopPropagation();
        const now = new Date();
        const {get,data,authUser,modalView}=this.props;
        const {commentsText,replyText}=this.state;
        if(authUser.isLogin){
             
            if(type==='write'){
                //blank space
                let blank_pattern = /^\s+|\s+$/g;
                if(commentsText.replace( blank_pattern, '' ) === ""){
                    alert('blank');
                    return false;
                }else{
                    return get.writeComments({   
                        data:{
                            comments:{
                                date:dateFormat(now,"mmm d, yyyy"),
                                body:this.state.commentsText,
                            }
                        },
                        postId:postId,
                        type:'POSTS/COMMENTS_SAVE'
                    });
                }
            }else if(type==='modify'){
                //blank space
                let blank_pattern = /^\s+|\s+$/g;
                if(replyText.replace( blank_pattern, '' ) === "" ){
                    alert('blank');
                    return false;
                }else{
                    return get.updateComments({   
                        data:{
                            comments:{
                                body:this.state.replyText,
                            }
                        },
                        postId:postId,
                        index:i,
                        type:'POSTS/COMMENTS_UPDATE'
                    });
                }
            }else if(type==='reply'){
                //blank space
                let blank_pattern = /^\s+|\s+$/g;
                if(replyText.replace( blank_pattern, '' ) === "" ){
                    alert('blank');
                    return false;
                }else{
                    return get.replyComments({   
                        data:{
                            reply:{
                                date:dateFormat(now,"mmm d, yyyy"),
                                body:this.state.replyText,
                            }
                        },
                        index:i,
                        postId:postId,
                        type:'POSTS/COMMENTS_REPLY'
                    });
                }
            }else if(type==='replyModify'){
                return get.updateComments({   
                    data:{
                        comments:{
                            body:this.state.replyText,
                        }
                    },
                    postId:postId,
                    index:i,
                    replyIndex:rei,
                    type:'POSTS/COMMENTS_UPDATE'
                });
            }
        }else{
            return modalView.openModal({
                        modalName:'login'
                    });
        }
    }
    writeMode=(type,i,rei,value,e)=>{
        e.stopPropagation();
        const {modifyIndex} = this.state;
        const {authUser,modalView}=this.props;
        if(!authUser.isLogin){
            return modalView.openModal({
                modalName:'login'
            });
        }
            if(type==='modify'){
                return this.setState({
                    modifyIndex:i===modifyIndex?null:i,
                    commentView:'modify',
                    replyText:value
                })
            }else if(type==='reply'){
                return this.setState({
                    modifyIndex:i===modifyIndex?null:i,
                    commentView:'reply',
                    replyText:''
                })
            }else if(type==='replyModify'){
                return this.setState({
                    modifyIndex:`${i}/${rei}`===modifyIndex?null:`${i}/${rei}`,
                    commentView:'replyModify',
                    replyText:value
                })
            }
        
    }

    delComments=(id,type,i,rei,e)=>{
        e.stopPropagation();
        const{get}=this.props;
        get.deleteComments({
            type:'POSTS/COMMENTS_DELETE',
            view:type,
            id:id,
            index:i,
            replyIndex:rei
        });
 
    }
    modalView=()=>{
        const {modalView} = this.props;
        modalView.openModal({
            modalName:'login'
        });
    }
    writeInit=(type)=>{
        if(type==='write'){
            return this.setState({
                modifyIndex:null
            })
        }
    }
    textareaCancel=(e)=>{
        e.stopPropagation()
        this.setState({
            modifyIndex:null
        })
    }
    commentsCount=()=>{
        const {data}=this.props;
        let originalCount=data.comments.length;
        let replyCount=0;
       data.comments.map((item,i)=>{
            item.reply.map((replyItem,i)=>{
                replyCount=replyCount+1;
            })
       });
       return originalCount+replyCount;
    }
    goBack=()=>{
        this.props.history.goBack()
    }
    render() {
        const {data,motion,get,authUser,commentsLoading,common}=this.props;
        const {deskView,deskMode,mobileMode,replyText,commentView,windowWidth,windowHeight,iframeLoad,frameWrap,frameSizeX,frameSizeY,frameDivide,frameFull,doc,commentsText,modifyIndex,isBright} = this.state;
        return (
            <div className={`detail-frame ${isBright?'bright':'dark'}`}
                style={{
                    height:`${windowHeight}px`,
                }}
            >
                <span className={`go-back ${doc?'preview':'documentation'}`} onClick={this.goBack}>
                    <IconBack isBright={frameFull?isBright:true}/>
                </span>
                <div className={`detail-main ${motion.detailLoad?'animate':''}`}
                    style={{
                        width:frameFull?`${windowWidth}px`:motion.detailLoad?`${frameWrap}px`:`${windowWidth}px`,
                        height:doc?`100px`:`${windowHeight}px`,
                        backgroundColor:motion.bgColor
                    }}>
                    <div className={`loading-text ${iframeLoad?'fade-out':''}`}>
                        <h3 
                        style={{
                            color:common.isBright?'#333':'#fff'
                        }}
                        >Loading...</h3>
                    </div>
                    {motion.detailLoad? 
                        <div key={data._id} className={`detail-simulate ${doc?'fade-out':''}`}>
                            <div className={`fullsize ${!frameDivide?'fade-out':''}`} onClick={this.fullSize}>
                                <span></span>
                                <span></span>
                            </div>
                            <div className="device-controll-wrap">
                                <div className="device-controll">
                                    <div className={`dic mobile ${mobileMode?'active':'default'}`} onClick={this.modeChange.bind(this,'mobile')}>
                                        <IconPhone isBright={isBright}/>
                                    </div>
                                    {deskView?
                                        <div className={`dic desk ${deskMode?'active':'default'}`} onClick={this.modeChange.bind(this,'desk')}>
                                            <IconDesk isBright={isBright}/>
                                        </div>:null
                                    }
                                </div>
                                <div className="visit-site">
                                    <a href={data.iframeUrl}>Visit Site</a>
                                </div>
                            </div>
                            
                            <div key={data._id} className={`iframe-wrap ${iframeLoad?'animate':''}`}
                                style={{
                                    width:frameSizeX,
                                    height:`${frameSizeY}px`,
                                    transform:`scale(${iframeLoad?1:0.3})`,
                                    
                                }}
                            >
                                
                                <iframe title="This is a detailView" key="i" src={data.iframeUrl}
                                    onLoad={this.iframeLoad} 
                                    scrolling="auto"
                                    frameBorder="0" width={"100%"} height={`${frameSizeY}px`}></iframe>
                            </div>  
                        </div>
                    :null} 
                    {motion.detailLoad?
                    <div className={`scroll-doc ${!frameFull?'fade-out':''}`}>
                        <span className={doc?`Preview`:`Documentation`}onClick={this.scrollDown}>{doc?`Preview`:`Documentation`}</span>
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
                            commentsCount={this.commentsCount()}

                            writeInit={this.writeInit}
                            data={data}
                            commentsData={data.comments}
                            writeComments={this.writeComments.bind(this,data._id)}
                            
                            delComments={this.delComments.bind(this,data._id)}
                            isLogin={authUser.isLogin}
                            currentUser={authUser.user}

                            commentsOnChange={this.commentsOnChange}
                            commentsText={commentsText}
                            replyText={replyText}

                            modifyIndex={modifyIndex}
                            commentView={commentView}
                            writeMode={this.writeMode}
                            modalView={this.modalView}
                            textareaCancel={this.textareaCancel}
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