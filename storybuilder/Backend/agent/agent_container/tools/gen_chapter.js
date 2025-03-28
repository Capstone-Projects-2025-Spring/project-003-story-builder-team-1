// gen_chapter.js

/**
 * Creates an API payload for the Generate function.
 * The given text content is placed inside the messages array.
 * 
 * @param {string} content - The the context for the passage to be generated.
 * @returns {Object} The API JSON payload with the provided content.
 */

export function create_gen_chapter_payload(content) {
    return {
        model: "llama3.1-70b",
        functions: [
        {
            name: "Generate",
            description: "You are a helpful assistant. You will work in a Mechanical Turks style with other assistants to compose stories for users following a certain set of steps. The story will be written in chapters, and you will write the first chapter. Make sure to use markdown",
            parameters: {
            type: "object",
            properties: {
                summary: {
                title: "Generated",
                description: "The generated passage of a single portion of the story",
                type: "string"
                }
            },
            required: ["Generated"]
            }
        }
        ],
        function_call: { name: "Generate" },
        messages: [
        { role: "user", content: content }
        ]
    };
}