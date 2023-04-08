import db from '../model/mongo';

const OAuthClientSchema = db.schema({
    name: String,
    description: String,
    icon: String,
    regTime: Date,
    clientId: String,
    clientSecret: String,
    redirectUris: [String],
    ownerId: String,
});

const OAuthCodeSchema = db.schema({
    code: String,
    userId: String,
    clientId: String,
    scope: String,
    ttl: Date,
});

const OAuthAccessTokenSchema = db.schema({
    accessToken: String,
    userId: String,
    clientId: String,
    scope: String,
    ttl: Date,
});

const OAuthRefreshTokenSchema = db.schema({
    refreshToken: String,
    userId: String,
    clientId: String,
    scope: String,
    ttl: Date,
});

const OAuthClientModel = db.model('oauth_client', OAuthClientSchema);
const OAuthCodeModel = db.model('oauth_code', OAuthCodeSchema);
const OAuthAccessTokenModel = db.model('oauth_access_token', OAuthAccessTokenSchema);
const OAuthRefreshTokenModel = db.model('oauth_refresh_token', OAuthRefreshTokenSchema);

export {
    OAuthClientModel,
    OAuthCodeModel,
    OAuthAccessTokenModel,
    OAuthRefreshTokenModel,
};
