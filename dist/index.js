"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const node_cron_1 = __importDefault(require("node-cron"));
let CHUNKS;
let INDEX = 0;
let day = 0;
fs_1.default.readFile(__dirname + "/results.txt", "utf8", (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    const splitData = data.split("\n");
    const chunks = [];
    let currChunk = [];
    for (data of splitData) {
        if (data === "") {
            chunks.push(currChunk);
            currChunk = [];
            continue;
        }
        if (currChunk.length === 0) {
            currChunk.push(data.slice(11, data.length));
            continue;
        }
        currChunk.push(data);
    }
    CHUNKS = chunks;
});
const app = (0, express_1.default)();
const port = 8080;
app.use((0, cors_1.default)());
function checkNextDay() {
    const epochMs = new Date(2022, 0).valueOf();
    const now = Date.now();
    const msInDay = 86400000;
    const index = Math.floor((now - epochMs) / msInDay);
    if (index !== day) {
        INDEX++;
        console.log(day, index);
    }
    day = index;
}
app.get("/", (_, res) => {
    res.json({ response: "Server Reached" });
});
app.get("/words", (_, res) => {
    res.json({
        response: {
            words: CHUNKS[INDEX][0].split(", "),
            word: CHUNKS[INDEX][1].slice(1, CHUNKS[INDEX][1].length).split(","),
            day: INDEX,
        },
    });
});
node_cron_1.default.schedule("* * * * * ", checkNextDay);
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map