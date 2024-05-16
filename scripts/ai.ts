import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";

const openai = new OpenAI();
const anthropic = new Anthropic();

function getConvo() {
  return fs.readFileSync("assets/lecture.txt", "utf-8");
}

function getSystemPrompt() {
  return fs.readFileSync("assets/system.txt", "utf-8");
}

function addResult(resultObject: any) {
  const currentResult = fs.readFileSync("assets/results.json", "utf-8");
  const currentResultsArray = JSON.parse(currentResult) as any[];
  const newResultsArray = [resultObject, ...currentResultsArray];
  fs.writeFileSync(
    "assets/results.json",
    JSON.stringify(newResultsArray, null, 2)
  );
}

function viewLastResult() {
  const currentResult = fs.readFileSync("assets/results.json", "utf-8");
  const currentResultsArray = JSON.parse(currentResult) as any[];
  console.log(currentResultsArray[0]);
}

async function openAiRequest() {
  const sampleConvo = getConvo();
  const prompt = getSystemPrompt();
  const promptMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: prompt,
    },
    { role: "user", content: sampleConvo },
  ];
  const model: OpenAI.Chat.ChatModel = "gpt-4o";
  const completion = await openai.chat.completions.create({
    messages: promptMessages,
    model: model,
  });

  console.log(completion.choices[0].message.content);

  addResult({
    model,
    result: completion.choices[0].message.content,
    prompt: {
      system: prompt,
      user: sampleConvo,
    },
    usage: completion.usage,
    type: "openai",
  });
}

async function claudeAiRequest() {
  const sampleConvo = getConvo();
  const model = "claude-3-opus-20240229";
  const prompt = getSystemPrompt();
  const promptMessages: Anthropic.Messages.MessageParam[] = [
    { role: "user", content: sampleConvo },
  ];
  const message = await anthropic.messages.create({
    system: prompt,
    max_tokens: 4096,
    messages: promptMessages,
    model,
  });

  console.log(message.content[0].text);
  addResult({
    model,
    result: message.content,
    prompt: {
      system: prompt,
      user: sampleConvo,
    },
    usage: message.usage,
    type: "claude",
  });
}

async function main() {
  await claudeAiRequest();
  await openAiRequest();
  //await viewLastResult();
}

main();