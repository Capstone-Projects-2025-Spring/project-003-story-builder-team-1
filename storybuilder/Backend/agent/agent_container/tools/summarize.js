// summarize.js

/**
 * Creates an API payload for the Summarize function.
 * The given text content is placed inside the messages array after the defined function call.
 *
 * @param {string} content - The text passage to be summarized.
 * @returns {Object} The API JSON payload with the provided content.
 */
export function create_summarize_payload(content) {
    return {
      model: "llama3.1-70b",
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
        }
      ],
      function_call: { name: "Summarize" },
      messages: [
        { role: "user", content: content }
      ]
    };
  }
  