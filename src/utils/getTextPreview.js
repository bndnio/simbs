export default function getTextPreview(text, textLimit = 160) {
  if (text.length > textLimit) {
    const limitedText = text.substring(0, textLimit)
    // Cut only up to the last word and attach '...' for readability
    return limitedText.substring(0, limitedText.lastIndexOf(" ")) + "..."
  } else {
    // If it's shorter than the limit, just show it normally
    return text
  }
}
