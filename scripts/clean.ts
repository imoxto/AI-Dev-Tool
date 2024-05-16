import fs from "fs";

async function cleanWudpeckerSpeakers() {
  const fileContent = fs.readFileSync("assets/convo.txt", "utf-8");
  const cleanedContent = fileContent
    .replace(/Speaker 0\s*\d\d:\d\d\s*/g, "Speaker 0: ")
    .replace(/Speaker 1\s*\d\d:\d\d\s*/g, "Speaker 1: ");
  fs.writeFileSync("assets/convo.cleaned.txt", cleanedContent);
}

cleanWudpeckerSpeakers();
