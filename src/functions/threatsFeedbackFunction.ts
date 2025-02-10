import { app, InvocationContext, HttpRequest, HttpResponseInit, output, trigger } from "@azure/functions";
import path = require("path");

/**
 * Provides basic HTML/Javascript FE for Threats feedback operation
 * @param request Client GET request
 * @param context index.html page with Javascript
 * @returns 
 */
async function threatsHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    
    try {
        const fs = require("fs");
        const htmlContent = fs.readFileSync(path.join(__dirname, '/../content/index.html'), "utf8");
        // Create the HTTP response object and set the headers
        const response: HttpResponseInit = { 
            body: htmlContent,
            status: 200,
            headers: {
            "Content-Type": "text/html",
            },
        };

        return response;
        // return { body: `Hello, world!` };
    } catch (error) {
        if (error instanceof Error) {
        context.log(`Encountered an error: "${error}"`);
        // even better is to create your own errors with your own status codes and translate here
        return { status: 500, body: error.message };
        }
        throw error;
    }
}

app.generic('threatsFeedback', {
    trigger: trigger.generic({
        type: 'httpTrigger',
        methods: ['GET'],
        authLevel: "anonymous",
    }),
    return: output.generic({
        type: 'http'
    }),
    handler: threatsHandler
});