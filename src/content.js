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

// speak helper using Web Speech API
function speakText(text, opts = {}) {
    if (!('speechSynthesis' in window)) {
        console.warn('SpeechSynthesis not supported in this browser.');
        return;
    }

    const utterance = new SpeechSynthesisUtterance(String(text || ''));
    utterance.lang = opts.lang || 'en-US';
    utterance.rate = typeof opts.rate === 'number' ? opts.rate : 1;
    utterance.pitch = typeof opts.pitch === 'number' ? opts.pitch : 1;
    utterance.volume = typeof opts.volume === 'number' ? opts.volume : 1;

    // optional: choose a specific voice by name substring
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0 && opts.voiceName) {
        const v = voices.find((x) => x.name.toLowerCase().includes(opts.voiceName.toLowerCase()));
        if (v) utterance.voice = v;
    }

    utterance.onstart = () => console.log('TTS started');
    utterance.onend = () => console.log('TTS finished');
    utterance.onerror = (e) => console.error('TTS error', e);

    // cancel any existing speech and speak
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
}

// // Example: speak the Readability article already parsed in your content script
// if (typeof article !== 'undefined' && article) {
//     const snippet = article.textContent ? article.textContent.slice(0, 400) : article.content || article.title || 'No article';
//     speakText(`${article.title || 'Article'}: ${snippet}`, { lang: 'en-US', rate: 1, voiceName: 'Google' });
// }

// run extraction (or call this on user action)
const article = extractReadableArticle();

speakText(article.textContent, { lang: 'en-US', rate: 1, voiceName: 'Google' })