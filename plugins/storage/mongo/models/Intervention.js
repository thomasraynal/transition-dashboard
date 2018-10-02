module.exports = function (server) {
    var Schema = server.models.mongoose.Schema;
    var interventionSchema = Schema({
        date: {
            type: Date,
            required: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'Participant',
            required: true
        },
        content: {
            type: String,
            required: true
        },
        dashboard: {
            type: Schema.Types.ObjectId,
            ref: 'Dashboard',
            required: true
        },
        __v: { type: Number, select: false }
    });

    return server.models.mongoose.model('Intervention', interventionSchema);
};