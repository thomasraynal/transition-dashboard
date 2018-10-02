module.exports = function (server) {
    var Schema = server.models.mongoose.Schema;
    var ParticipantSchema = Schema({
        password: {
            type: String,
            required: true,
            select: false
        },
        email: {
            type: String,
            required: true
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            default: server.constants.DEFAULT_AVATAR
        },
        position: {
            type: String,
            required: true,
        },
        phone: {
            type: String
        },
        identity: {
            type: String,
            default: server.constants.USER
        }, 
        dashboard: {
            type: Schema.Types.ObjectId,
            ref: 'Dashboard',
            required: true
        },
        __v: { type: Number, select: false }

    });

    ParticipantSchema.methods.toJSON = function () {
        var obj = this.toObject();
        delete obj.password;
        return obj;
    }

    return server.models.mongoose.model('Participant', ParticipantSchema);
}