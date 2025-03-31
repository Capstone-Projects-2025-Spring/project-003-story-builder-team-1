// llamaService.js
import LlamaAI from "llamaai";

const llama = new LlamaAI(process.env.API_KEY);

export default llama;