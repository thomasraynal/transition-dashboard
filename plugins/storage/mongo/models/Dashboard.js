module.exports = function (server) {
    var Schema = server.models.mongoose.Schema;
    var DocumentSchema = Schema({
        name: {
            type: String,
            required: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'Participant',
            required: true
        },
        __v: { type: Number, select: false }

    });

    return server.models.mongoose.model('Dashboard', DocumentSchema);
}