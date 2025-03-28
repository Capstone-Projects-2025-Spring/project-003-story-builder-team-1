const axios = require("axios");
let body = []
// Define the model for creating titles and outlines using LLaMA 3.1-8B model
const llamaEndpoint = "http://localhost:5000/agent/generate"; // Replace with your actual LLaMA API endpoint

// Function to call LLaMA API
async function callLlamaAPI(prompt) {
    try {
        body.push({ role: "system", content: prompt });
        apirequestjson = {
            model: "llama3.1-8b",
            messages: body,
            stream: false,
        }
        const response = await axios.post(
            llamaEndpoint, apirequestjson,
            { headers: { "Content-Type": "application/json" } });
            
        
        return response.data; // Assuming the response has the structure you need
    } catch (error) {
        console.error("Error calling LLaMA API:", error.response ? error.response.data : error.message);
    }
}

// Function to generate title and outline
async function generateTitleAndOutline(userInput) {
    const outlinePrompt = `You are a creative writer. Based on the following user input, generate a suitable title and outline for the story:\n${userInput}\n`;
    const response = await callLlamaAPI(outlinePrompt);
    body.push({ role: "assistant", content: response.reply });
    return response?.reply || response?.content || JSON.stringify(response);
}

// Function to generate chapter content
async function generateChapterContent(storySoFar, chapterNumber) {
    const writingPrompt = `You are a writer in the style of Shakespeare. You only write 1 chapter at a time. Write the story at this chapter number ${chapterNumber}:\n${JSON.stringify(storySoFar)}\n`;
    const response = await callLlamaAPI(writingPrompt);
    body.push({ role: "assistant", content: response.reply });
    return response?.reply || response?.content || JSON.stringify(response);
}

// Function to vote on generated stories (majority vote)
function voteOnStory(agentResponses) {
    const votes = agentResponses.map((response) => response);
    const bestResponse = votes.sort((a, b) =>
        votes.filter((v) => v === a).length - votes.filter((v) => v === b).length
    )[0];
    return bestResponse;
}

// Function to critique the story
async function critiqueStory(story) {
    const critiquePrompt = `You are a literary critic. Critique this passage and provide suggestions for improvement:\n${story}\n`;
    const response = await callLlamaAPI(critiquePrompt);
    return response?.reply || response?.content || JSON.stringify(response);
}

// Final decision function
function finalizeStory(story, critique, bestChapter) {
    return `Original Chapter: ${bestChapter}`;
}

async function summarizeChapter(chapter) {
    const summaryPrompt = `Summarize the following chapter in 50-100 words:\n${chapter}\n`;
    const response = await callLlamaAPI(summaryPrompt);
    body.push({ role: "assistant", content: response.reply });
    return response?.reply || response?.content || JSON.stringify(response);
}

// Full iterative story generation process for each chapter
async function generateFullStory(userInput, numChapters = 4) {
    // Step 1: Generate Title and Outline
    body.push({ role: "user", content: userInput });
    const titleAndOutline = await generateTitleAndOutline(userInput);
    console.log("Generated Title and Outline:", titleAndOutline);
    let storySoFar = [];
    storySoFar = titleAndOutline; // This will hold the growing story
    let chapters = []; // List to store all chapters

    // Generate each chapter
    for (let chapterNumber = 1; chapterNumber < numChapters; chapterNumber++) {
        console.log(`\nGenerating Chapter ${chapterNumber}...`);

        // Step 2: Generate stories from multiple agents
        const generatedChapter = await generateChapterContent(storySoFar, chapterNumber);

        // Step 3: Voting on the best story
        //const bestChapter = voteOnStory(generatedChapters);

        // Step 4: Critiquing the best chapter
        //const critique = await critiqueStory(bestChapter);

        // Step 5: Final decision based on critique and vote
        //const finalChapter = finalizeStory(generatedChapters);

        // Step 6: Summarize generated chapter from this loop
        const chapterSummary = await summarizeChapter(generatedChapter);
        console.log(`Chapter ${chapterNumber}\n${generatedChapter}\n\nSummary: ${chapterSummary}`);

        // Append chapter to the story so far
        storySoFar += `\n${chapterSummary}`;
        chapters.push(generatedChapter);
    }

    return { finalStory: storySoFar, chapters };
}

// Example usage
(async () => {
    const userInput = "A fantasy adventure about a young wizard who discovers his powers.";
    const { finalStory, chapters } = await generateFullStory(userInput, 5);
    console.log("\nFull Generated Story:");
    console.log(finalStory);
})();
