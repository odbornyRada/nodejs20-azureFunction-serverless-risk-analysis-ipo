import { app, InvocationContext, HttpRequest, HttpResponseInit, output, trigger } from "@azure/functions";
import axios from 'axios';

/**
 * Creates call to the DeepL Back-End system and asks for a translation to a desired language
 * @param request 
 * @param context 
 * @returns 
 */
async function askDeepLHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    const body = await request.json() as any;
    console.log(`Data passed as payload to askDeepLFunciton: "${JSON.stringify(body)}"`);
    try {
        const url = 'https://api-free.deepl.com/v2/translate';
        const data = new URLSearchParams();
        // data.append('text', 'Hello, world!');
        // data.append('target_lang', 'DE');
        data.append('text', body.text);
        data.append('target_lang', body.target_lang);
        
        const deeplKey = 'REPLACE-WITH-YOUR-KEY!!!';

        if(deeplKey === 'REPLACE-WITH-YOUR-KEY!!!')
            throw new Error("Bummer: You have to add your DeepL key into the code.")

        const headers = {
        Authorization: 'DeepL-Auth-Key ' + deeplKey,
        'User-Agent': 'MarieTranslator/1.0.0',
        'Content-Type': 'application/x-www-form-urlencoded',
        };

        const deepLresponse = await axios.post(url, data, { headers });
        console.log(`HTTP data returned from DeepL AI: "${JSON.stringify(deepLresponse.data)}"`);
        // Create the HTTP response object and set the headers
        const response: HttpResponseInit = { 
            jsonBody: deepLresponse.data,
            status: 200,
            headers: {
            "Content-Type": "application/json",
            },
        };

        return response;
    } catch (error) {
        if (error instanceof Error) {
        context.log(`Encountered an error: "${error}"`);
        // even better is to create your own errors with your own status codes and translate here
        return { status: 500, body: error.message };
        }
        throw error;
    }
}

app.generic('askDeepL', {
    trigger: trigger.generic({
        type: 'httpTrigger',
        methods: ['POST'],
        authLevel: "anonymous",
    }),
    return: output.generic({
        type: 'http'
    }),
    handler: askDeepLHandler
});