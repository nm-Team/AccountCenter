import axios from 'axios';
import express from 'express';

const clientId = '1d7a6eee-3194-4ee4-a1e8-39d96a732514';
const clientSecret = 'c667618e21da4fb586afc528eadc6a27a42b0b1185cfe3fb07e5b7f9e46c2a4a';
const redirectUri = 'http://localhost:3000/callback';

const backend = 'http://localhost:4000/';
const scope = 'email';

const tokenUrl = `${backend}oauth/token`;

const app = express();
const authUrl = `${backend}oauth/authorize?response_type=code&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}`;
console.log(authUrl);

app.get('/callback', async (req, res) => {
    const { code } = req.query;

    try {
        const response = await axios.post(
            tokenUrl,
            {
                client_id: clientId,
                client_secret: clientSecret,
                code,
                redirect_uri: redirectUri,
            },
        );

        const accessToken = response.data.data.access_token;

        const userResponse = await axios.post(`${backend}oauth/test`, {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        res.send(userResponse.data);
        console.log(userResponse.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(3000, () => {
    console.log('App listening on port 3000');
});
