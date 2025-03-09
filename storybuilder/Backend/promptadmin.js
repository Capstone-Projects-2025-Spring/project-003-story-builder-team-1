/*
Allows for fast, organized prompt formatting. Templates for drafting, critiquing and judging stories.
*/
export function prompt(promptinfo, type) {
    switch(type) {
        case "write":
            var write = {
                model: "llama3.2-1b", // Use model names from API documentation for model provider
                messages: [
                    { "role": "user", "content": "You are a helpful assistant. You will work in a Mechanical Turks style with other assistants to compose stories for users following a certain set of steps. You will write your first draft now. " + promptinfo}
                ],
                stream: false, // Ensures a single response instead of a streamed response
            };
            return write;
        case "critique":
            var critique =  {
                model: "llama3.2-1b", 
                messages: [
                    { "role": "user", "content": "You are now being fed a story written by another agent. You will critique the drafting of this story based on grammatical correctness as well as its faithfulness to the style parameters that were specified. " + promptinfo }
                ],
                stream: false, 
            };
            return critique;
        case "judge":
            var judge = {
                model: "llama3.2-1b", // Use model names from API documentation for model provider
                messages: [
                    { "role": "user", "content": "Your job now is to judge all of these stories as objectively as you can based on the initial prompt information. Each of these stories have gone through two drafting sessions, now you will rank them from best to worst. " + promptinfo }
                ],
                stream: false, 
            };
            return judge;
    }
}
//Boosts model to a newer, higher-parameter version.
export function boostmodel(prompt) {
    prompt.model = "llama3.2-8b";
    return prompt;
}

//Downgrades model to a less expensive, lower-parameter version.
export function degrademodel(prompt) {
    prompt.model = "llama3.1-1b";
    return prompt;
}

//Brings model back to the default 3.2 at 1B.
export function defaultmodel(prompt) {
    prompt.model = "llama3.1-1b";
    return prompt;
}

//Creates a call to return a list of style tags using a lower parameter model in Llama's API.
export function getstylesearch(promptinfo) {
    var stylesearch = 
    {
        model: "llama3.1-1b", // Uses a cheaper model for a less intensive task
        messages: [
            { "role": "user", "content": "Return a list of style tags that correlate with this prompt: " + promptinfo + ", Return it so that I could just extract the list and append it to the end of a prompt, with commas and everything."}
        ],
        stream: false, // Ensures a single response instead of a streamed response
    };
    return stylesearch;
}

//Sets prompt settings to "stream" mode (this may be useful for real-time critiques)
export function setstream(prompt, streamset) {
    if(streamset == true) {
        prompt.stream = true;
    }
    else {
        prompt.stream = false;
    }
    return prompt;
}