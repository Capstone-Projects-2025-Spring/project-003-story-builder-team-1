import LlamaAI from "llamaai";
import get_prompt_list from "./tools/prompt_list.js";
import get_function_list from "./tools/function_list.js";
import { tools } from "./tools/tool_list.js";
import prompts from "../../promptformatter.js"
const llama = new LlamaAI(process.env.API_KEY);
const apiRequestJson = {
  model: "llama3.3-70b",
  messages: [
    { role: "system", content: "You are a story drafting assistant. Use the available functions to draft, critique, and continue stories. ALWAYS use tool calls instead of returning function calls in text." },
    {role: "user", content: "Write a story about penguins"},
    //{ role: "user", content: "As the three unlikely allies began to discuss their plan, a flock of penguins waddled into view, their tuxedo-like feathers a stark contrast to the desolate landscape. They seemed to be drawn to the group, as if sensing the weight of their conversation. The penguins formed a semi-circle around the trio, their beady eyes fixed on Jesus. One of them, seemingly the leader, waddled forward and spoke in a high-pitched voice, \"We've been watching you, Jesus. We know of your power to heal and bring hope. We, too, have a role to play in this battle against Sauron.\" Gandalf's eyes widened in surprise, while Legolas's hand tightened around his bow. Jesus, however, smiled and nodded in understanding. \"Tell me, little penguin, what do you propose we do together?\" The stage was set for an epic adventure, one that would bring together the most unlikely of allies in a battle against the forces of darkness." },
  ],
  tools,
  tool_calls: "auto",
  tool_choice: "required",
  stream: false,
};

const response = await llama.run(apiRequestJson);
console.log("Raw API Response:", JSON.stringify(response, null, 2));

const messageContent = response?.choices?.[0]?.message?.tool_calls || response?.choices?.[0]?.message?.content;
const toolCallsArray = extractToolCalls(messageContent);
console.log( "Extracted Tool Calls:", JSON.stringify(toolCallsArray, null, 2));

if (messageContent) {
  console.log("Llama API Message Content:", messageContent);

  // Match function call format: <function=NAME>{JSON_ARGS}</function>
  const functionCallMatch = messageContent.match(
    /<function=(.*?)>(.*)<\/function>/
  );

  if (toolCallsArray.length > 0) {

    const { functionName, functionArgs } = toolCallsArray[0]; // Get the first tool call
    console.log("Function Name:", functionName);
    console.log("Function Arguments:", JSON.stringify(functionArgs, null, 2));
    
    // Validate function arguments
    if (!functionName || !functionArgs) {
      console.error("Error: Invalid function call detected.");
    }

    // Ensure functionArgs is an object
    if (typeof functionArgs !== "object" || Array.isArray(functionArgs)) {
      console.error("Error: Function arguments must be an object.");
    }

    // If functionArgs is a string, parse it as JSON
    if (typeof functionArgs === "string") {
      try {
        functionArgs = JSON.parse(functionArgs);
      } catch (error) {
        console.error("Error parsing function arguments:", error);
      }
    }

    // Now you can call the function dynamically
    if (functionName === "get_current_weather") {
      get_current_weather(functionArgs);
    }

    // Handle the function calls for story drafting and critique
    else if (functionName ==="draft") {

      console.log(prompts.draft(functionArgs.promptinfo));

      llama.run(prompts.draft(functionArgs.promptinfo)).then((draftResponse) => {
        console.log("Draft Response:", draftResponse.choices[0].message.content);
      }).catch((error) => {
        console.error("Error generating draft:", error);
      });
    }

    else if (functionName ==="critique") {
      prompts.critique(functionArgs.promptinfo, functionArgs.chapter);

      console.log("Critiquing chapter...");
      llama.run(prompts.critique(functionArgs.promptinfo, functionArgs.chapter)).then((critiqueResponse) => {
        console.log("Critique Response:", critiqueResponse.choices[0].message.content);
      }).catch((error) => {
        console.error("Error generating critique:", error);
      });
    }

    else if (functionName === "nextchapter") {
      prompts.nextchapter(functionArgs.promptinfo, functionArgs.chapter);
    }

  } else {
    console.log("No function call detected, displaying message normally.");
  }

} else {
  console.error("Error: No valid message content in response");
}

async function get_current_weather(args) {
  const { location, days, unit } = args;

  // Here you would implement the actual logic to get the weather data
  // For demonstration, let's just log the parameters
  console.log(`Fetching weather for ${location} for ${days} days in ${unit}...`);

  // Simulate a weather response
  const weatherResponse = {
    location: location,
    forecast: [
      { day: 1, temperature: unit === "celsius" ? "20°C" : "68°F", condition: "Sunny" },
      { day: 2, temperature: unit === "celsius" ? "22°C" : "72°F", condition: "Partly Cloudy" },
    ],
  };

  console.log("Weather Response:", JSON.stringify(weatherResponse, null, 2));
  return weatherResponse;
}

function extractToolCalls(toolCallsArray) {
  try {
      // Ensure toolCallsArray is a valid object (if it's a string, parse it)
      if (typeof toolCallsArray === "string") {
          toolCallsArray = JSON.parse(toolCallsArray);
      }

      return toolCallsArray.map(toolCall => {
          const functionName = toolCall.function.name;
          const functionArgs = JSON.parse(toolCall.function.arguments); // Parse JSON string

          return { functionName, functionArgs };
      });

  } catch (error) {
      console.error("Error parsing tool calls:", error);
      return [];
  }
}
