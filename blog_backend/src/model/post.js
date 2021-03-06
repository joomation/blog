var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;

var postSchema = new Schema({
   // _id:String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'account'
    },
    author:String,
    title:String,
    summary:String,
    body:String,
    bgColor:String,
    iframeUrl:String,
    blogType:String,
    category:String,
    starred: [Number],
    tags:[String],
    thumbnail:{data:{
        type: Schema.Types.Mixed, default: {}
    }},
    gif:{data:{
        type: Schema.Types.Mixed, default: {}
    }},
    files:{data:[]},
    comments:[
        {
            user: {
                oauthID:Number,
                type: Schema.Types.ObjectId,
                ref: 'account'
            },
            date:String,
            body:String,
            reply:[
                {
                    user: {
                        type: Schema.Types.ObjectId,
                        ref: 'account'
                    },
                    date:String,
                    body:String,
                }
            ]
        }
    ],
    postDate: String
   
},{ minimize: false });
postSchema.plugin(mongoosePaginate);
postSchema.index({title: 'text', summary: 'text'});
module.exports = mongoose.model('post',postSchema);