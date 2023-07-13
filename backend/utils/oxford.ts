import https from 'https';

export default function oxford_check(word: string): Promise<{ valid: boolean }> {
    const options = {
        host: 'od-api.oxforddictionaries.com',
        port: '443',
        path: `/api/v2/entries/en-us/${word}?fields=definitions&strictMatch=false`,
        method: "GET",
        headers: { app_id: process.env.APP_ID, app_key: process.env.APP_KEY }
    };
    return new Promise((resolve, reject) => {
        try {
            https.get(options, (resp) => {
                let body = '';
                resp.on('data', (chunk) => {
                    body += chunk;
                });
                resp.on('end', () => {
                    const parsed = JSON.parse(body);
                    if (parsed.id) {
                        resolve({ valid: true })
                    } else {
                        resolve({ valid: false })
                    }
                });
            });
        } catch (error) {
            reject(new Error(`Something went wrong! Please try again.`))
        }
    })
}


