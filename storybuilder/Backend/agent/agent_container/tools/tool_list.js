export const tools = [
    {
        type: "function",
        function: {
            name: "judge",
            description: "Ranks a list of drafted stories from best to worst based on the initial prompt information.",
            parameters: {
                type: "object",
                properties: {
                    storybank: {
                        title: "storybank",
                        type: "string",
                        description: "A collection of stories to be judged and ranked."
                    }
                },
                required: ["storybank"]
            }
        }
        },
        {
        type: "function",
        function: {
            name: "draft",
            description: "Generates the first chapter of a story based on the provided prompt information.",
            parameters: {
                type: "object",
                properties: {
                    promptinfo: {
                        title: "promptinfo",
                        type: "string",
                        description: "Information about the story prompt to guide the drafting process."
                    }
                },
                required: ["promptinfo"]
            }
        }
        },
        {
        type: "function",
        function: {
            name: "critique",
            description: "Provides a critique of a given chapter, analyzing grammatical correctness and adherence to style parameters.",
            parameters: {
                type: "object",
                properties: {
                    promptinfo: {
                        title: "promptinfo",
                        type: "string",
                        description: "The original prompt used to generate the story."
                    },
                    chapter: {
                        title: "chapter",
                        type: "string",
                        description: "The chapter text to be critiqued."
                    }
                },
                required: ["promptinfo", "chapter"]
            }
        }
        },
        {
        type: "function",
        function: {
            name: "nextchapter",
            description: "Continues the story by writing the next chapter based on a given chapter and prompt information.",
            parameters: {
                type: "object",
                properties: {
                    promptinfo: {
                        title: "promptinfo",
                        type: "string",
                        description: "The original prompt to maintain style consistency."
                    },
                    chapter: {
                        title: "chapter",
                        type: "string",
                        description: "The previous chapter to continue the story from."
                    }
                },
                required: ["promptinfo", "chapter"]
            }
        }
    }
]
export default tools;
// This code exports a list of tools that can be used by an agent to perform various tasks related to story writing and critique.
