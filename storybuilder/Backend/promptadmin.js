/*
Allows for fast, organized prompt formatting. Templates for drafting, critiquing and judging stories.
*/

function judge(storybank) {
    var judge = {
        model: "llama3.2-1b", // Use model names from API documentation for model provider
        messages: [
            { "role": "user", "content": "Your job now is to judge all of these stories as objectively as you can based on the initial prompt information. Each of these stories have gone through two drafting sessions, now you will rank them from best to worst. " + storybank }
        ],
        stream: false, 
    };
    return judge;
}


function write(promptinfo, last_response) {
    var draft = {
        model: "llama3.1-8b", // Use model names from API documentation for model provider
        messages: [
            { role: "system", content: "You are a helpful assistant that writes stories for the user. You will work step by step to help the user build the story by chapter/scene" },
            {role: "assistant", content: last_response},
            { role: "user", content: promptinfo},
        ],
        stream: false, // Ensures a single response instead of a streamed response
    };
    return draft;
    }
    
function critique(promptinfo, chapter) {
    var crit =  {
        model: "llama3.2-1b", 
        messages: [
            { "role": "user", "content": "You are now being fed a chapter written by another agent. You will critique the drafting of this story based on grammatical correctness as well as its faithfulness to the style parameters that were specified. The prompt is: '" + promptinfo + "', and the story you are going to critique is: '" + chapter + "'"}
        ],
        stream: false, 
    };
    return crit;
    }

function nextchapter(promptinfo, chapter) {
    var crit =  {
        model: "llama3.2-1b", 
        messages: [
            { "role": "user", "content": "You are now being fed a chapter written by another agent. You will continue the story in another chapter of roughly equal length while still following the guidelines established in the original prompt. The prompt is: '" + promptinfo + "', and the most recent chapter of this story is: '" + chapter + "'"}
        ],
        stream: false, 
    };
    return crit;
    }

//Boosts model to a newer, higher-parameter version.
function boostmodel(prompt) {
    prompt.model = "llama3.2-8b";
    return prompt;
}

//Downgrades model to a less expensive, lower-parameter version.
function degrademodel(prompt) {
    prompt.model = "llama3.1-1b";
    return prompt;
}

//Brings model back to the default 3.2 at 1B.
function defaultmodel(prompt) {
    prompt.model = "llama3.1-8b";
    return prompt;
}

//Creates a call to return a list of style tags using a lower parameter model in Llama's API.
function getstylesearch(promptinfo) {
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
function setstream(prompt, streamset) {
    if(streamset == true) {
        prompt.stream = true;
    }
    else {
        prompt.stream = false;
    }
    return prompt;
}

module.exports = {judge, write, critique, nextchapter, boostmodel, degrademodel, defaultmodel, getstylesearch, setstream};