/*
Allows for fast, organized prompt formatting. Templates for drafting, critiquing and judging stories.
*/

function judge(storybank, promptinfo) {
    //creates string from storybank object clearly delineating each story from each other
    var outlinestring = storybank.map(entry => `Story index number ${entry.story_index}: ${entry.story}`).join("\n\n");
    var judge = {
        model: "llama3.1-8b", // Use model names from API documentation for model provider
        messages: [
            { "role": "system", "content": `Your job now is to judge all of these stories as objectively as you can based on the initial prompt information. You will choose the best story. Do not return an explanation for your decision and don't return the stories themselves, just return the story's index number.` },
            { "role": "user", "content": `${promptinfo}\n\n${outlinestring}` },
        ],
        stream: false, 
    };
    return judge;
}

function draft(promptinfo, outline) {
    var draft = {
        model: "llama3.1-8b", // Use model names from API documentation for model provider
        messages: [
            { "role": "system", "content": `You are a helpful assistant. You will work in a Mechanical Turks style with other assistants to compose stories for users following a certain set of steps. The story will be written in chapters, and you will write the first chapter.`},
            { "role": "user", "content": `${promptinfo}`},
        ],
        stream: false, // Ensures a single response instead of a streamed response
    };
    return draft;
    }
    
function critique(promptinfo, chapter, outline) {
    var crit =  {
        model: "llama3.1-8b", 
        messages: [
            { "role": "system", "content": `You are now being fed a chapter written by another agent. You will critique the drafting of this story based on grammatical correctness as well as its faithfulness to the style parameters that were specified. Do not rewrite the chapter.`},
            { "role": "user", "content":  `${promptinfo}: Synopsis: ${outline}\n\nChapter: ${chapter}`},
        ],
        stream: false, 
    };
    return crit;
    }

function rewrite(promptinfo, chapter, critique, outline) {
        var rewrite =  {
            model: "llama3.1-8b", 
            messages: [
                { "role": "system", "content": `You are now being fed a chapter written by another agent, along with a critique of that chapter and the original prompt information. Rewrite the chapter, improving it based upon the critique's observations. Make sure it's a similar chapter length, and do not change anything if it doesn't violate the critique parameters. Just return the rewritten chapter and nothing else.`},
                { "role": "user", "content":  `This is the prompt: ${promptinfo}\n\nThis is the critique: ${critique}\n\nAnd this is the chapter: ${chapter}`},
            ],
            stream: false, 
        };
        return rewrite;
        }

//takes in previous chapter context, story outline and story prompt
function nextchapter(promptinfo, outline, chapter) {
    var chap =  {
        model: "llama3.1-8b", 
        messages: [
            { "role": "system", "content": `You are now being fed a chapter written by another agent. You will continue the story in another chapter of roughly equal length while still following the guidelines established in the original prompt.`},
            { "role": "user", "content": `${promptinfo}\n\nStory outline: ${outline}\n\n Chapter: ${chapter}`},
        ],
        stream: false, 
    };
    return chap;
    }

function storyoutline(chaptercount, promptinfo) {
    //create list to be filled by an AI with summaries of each chapter
    var outlinelist = [];
    for(let i = 1; i <= chaptercount; i++) {
        //every chapter entry in the list has a (Fill this entry) stuck in its outline field so the LLM knows EXACTLY where to place its outline
        outlinelist.push({chapter: i, outline: "(Fill this entry)"})
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
    prompt.model = "llama3.1-70b";
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





module.exports = {judge, draft, critique, rewrite, nextchapter, storyoutline, boostmodel, degrademodel, defaultmodel, setstream};
