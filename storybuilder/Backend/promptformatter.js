/*
Allows for fast, organized prompt formatting. Templates for drafting, critiquing and judging stories.
*/

function judge(storybank) {
    var judge = {
        model: "llama3.1-8b", // Use model names from API documentation for model provider
        messages: [
            { "role": "user", "content": "Your job now is to judge all of these stories as objectively as you can based on the initial prompt information. Each of these stories have gone through two drafting sessions, now you will rank them from best to worst. " + storybank },
        ],
        stream: false, 
    };
    return judge;
}

function draft(promptinfo) {
    var draft = {
        model: "llama3.1-8b", // Use model names from API documentation for model provider
        messages: [
            { "role": "system", "content": `You are a helpful assistant. You will work in a Mechanical Turks style with other assistants to compose stories for users following a certain set of steps. The story will be written in chapters, and you will write the first chapter.`},
            { "role": "user", "content": `This is the story outline. Please adapt Chapter 1: ${promptinfo}`},
        ],
        stream: false, // Ensures a single response instead of a streamed response
    };
    return draft;
    }
    
function critique(promptinfo, chapter) {
    var crit =  {
        model: "llama3.1-8b", 
        messages: [
            { "role": "system", "content": "You are now being fed a chapter written by another agent. You will critique the drafting of this story based on grammatical correctness as well as its faithfulness to the style parameters that were specified."},
            { "role": "user", "content": promptinfo},
            { "role": "assistant", "content": chapter},
        ],
        stream: false, 
    };
    return crit;
    }

//takes in previous chapter context, story outline and story prompt
function nextchapter(outline, chapter) {
    var chap =  {
        model: "llama3.1-8b", 
        messages: [
            { "role": "system", "content": `You are now being fed a chapter written by another agent. You will continue the story in another chapter of roughly equal length while still following the guidelines established in the original prompt.`},
            { "role": "assistant", "content": `Story outline: ${outline}`},
            { "role": "user", "content": `These are the chapters that have already been written. Please write chapter ${chapter.length}: ${chapter}`},
        ],
        stream: false, 
    };
    return chap;
    }

function storyoutline(chaptercount, promptinfo) {
    //array template to be formatted for the prompt, organized by chapter number
    var outlinelist = [];
    for(let i = 1; i <= chaptercount; i++) {
        //every chapter entry in the list has a (Fill this entry) stuck in its outline field so the LLM knows EXACTLY where to place its outline
        outlinelist.push({chapter: i, outline: `(Fill this entry)`})
    }

    //create outline template for other templates to easily parse after the LLM call
    var outlinestring = outlinelist.map(entry => `Chapter ${entry.chapter}: ${entry.outline}`).join("\n");
    var outlineprompt =  {
        model: "llama3.1-8b", 
        messages: [
            { "role": "system", "content": `The following is a prompt for a story that will be split into ${chaptercount} chapters. You will write an outline for each chapter, no more than two sentences for each chapter. You will fill the provided list with a summary of each chapter.`},
            { "role": "user", "content": `${promptinfo}:\n\n ${outlinestring}`},
        ],
        stream: false, 
    };
    return outlineprompt;
}

//Boosts model to a newer, higher-parameter version.
function boostmodel(prompt) {
    prompt.model = "llama3.1-8b";
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
            { "role": "user", "content": `Return a list of style tags that correlate with this prompt: ${promptinfo}, Return it so that I could just extract the list and append it to the end of a prompt, with commas and everything.`}
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





module.exports = {judge, draft, critique, nextchapter, storyoutline, boostmodel, degrademodel, defaultmodel, getstylesearch, setstream};
