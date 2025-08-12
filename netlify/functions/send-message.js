// This code runs on a server and is never exposed to the client
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzEo6RoelzXRA3ZSaljGW2grSfZqkVz-uxO6_-9ph_LAAjPcFcLFtlLro_XWBvgMcKIzw/exec";
const SECRET_TOKEN = process.env.SECRET_TOKEN; // This pulls the variable from Netlify's dashboard

exports.handler = async function(event, context) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { user, message } = JSON.parse(event.body);

        const payload = {
            token: SECRET_TOKEN, // The token is securely added here
            user: user,
            message: message
        };

        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return { statusCode: response.status, body: JSON.stringify(data) };
        }

        return { statusCode: 200, body: JSON.stringify(data) };

    } catch (error) {
        console.error('Netlify Function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ status: "error", data: "Internal Server Error" }),
        };
    }
};