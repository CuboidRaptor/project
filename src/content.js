// this script runs when Alt+R is pressed

import { Readability } from "@mozilla/readability";

console.log("DEBUG: content.js run");

function extractReadableArticle() {
    // Create a standalone Document from the page HTML so Readability can operate safely
    const serialized = document.documentElement.outerHTML;
    const doc = new DOMParser().parseFromString(serialized, "text/html");

    const reader = new Readability(doc);
    const article = reader.parse(); // returns { title, content, textContent, length, dir, etc. } or null

    if (!article) {
        console.log("Readability: no article found");
        return null;
    }

    // article.content is an HTML string containing the extracted content
    console.log(article.textContent);

    // You can send it to background or open a new tab, etc.
    // Example: send to background script
    if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
        chrome.runtime.sendMessage({ type: "READABILITY_RESULT", article });
    }

    return article;
}

// run extraction (or call this on user action)
const article = extractReadableArticle();