// function_list.js

/**
 * Returns a list of the available functions for the agnets.
 */
export function get_function_list() {
    return {
        model: "llama3.1-8b",
        functions: [
            {
                name: "Summarize",
                description: "Summarize this passage of a story into a 50 to 100 word summary. Use a Markdown format for the summary",
                parameters: {
                type: "object",
                properties: {
                    summary: {
                    title: "Summary",
                    description: "The generated summary of the passage",
                    type: "string"
                    }
                },
                required: ["summary"]
                }
            },
            {
                name: "Generate",
                description: "You are a helpful assistant. You will work in a Mechanical Turks style with other assistants to compose stories for users following a certain set of steps. The story will be written in chapters, and you will write the first chapter. Make sure to use markdown",
                parameters: {
                type: "object",
                properties: {
                    summary: {
                    title: "Generated",
                    description: "The generated passage",
                    type: "string"
                    }
                },
                required: ["Generated"]
                }
            }
        ],
		messages: "Take in these functions",
		stream: false
    };
}
