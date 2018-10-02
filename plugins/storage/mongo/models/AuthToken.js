module.exports = function(server) {
    var Schema = server.models.mongoose.Schema;

    var expiration = 36000;

    var AuthTokenSchema = Schema({
        userId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        expire: {
            default: expiration,
            type: Number,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: expiration,
        }
    });

    return server.models.mongoose.model('AuthToken', AuthTokenSchema);
}