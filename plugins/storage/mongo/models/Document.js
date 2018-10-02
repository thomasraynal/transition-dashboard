module.exports = function (server) {
    var Schema = server.models.mongoose.Schema;
    var DocumentSchema = Schema({
        url: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true,
            unique: true
        },
        position: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        type: {
            type: String,
            required: true,
            enum: server.constants.DOCUMENTS
        },
        dashboard: {
            type: Schema.Types.ObjectId,
            ref: 'Dashboard',
            required: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'Participant',
            required: true
        },

        __v: { type: Number, select: false }

    });

    return server.models.mongoose.model('Document', DocumentSchema);
}