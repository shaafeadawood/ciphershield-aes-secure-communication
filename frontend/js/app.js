/**
 * CipherShield Frontend Application
 * Handles UI interactions and API communication with the backend
 */

const API_BASE = "http://localhost:8000/api/cipher";

// State
let currentKey = null;
let lastEncryption = null;

// DOM Elements
const generateKeyBtn = document.getElementById("generateKeyBtn");
const clearAllBtn = document.getElementById("clearAllBtn");
const copyKeyBtn = document.getElementById("copyKeyBtn");
const encryptBtn = document.getElementById("encryptBtn");
const decryptBtn = document.getElementById("decryptBtn");
const verifyBtn = document.getElementById("verifyBtn");
const plaintextInput = document.getElementById("plaintextInput");
const decryptedOutput = document.getElementById("decryptedOutput");
const statusMessage = document.getElementById("statusMessage");
const notification = document.getElementById("notification");

// Event Listeners
generateKeyBtn.addEventListener("click", generateKey);
clearAllBtn.addEventListener("click", clearAll);
copyKeyBtn.addEventListener("click", () => copyToClipboard("keyDisplay"));
encryptBtn.addEventListener("click", encryptMessage);
decryptBtn.addEventListener("click", decryptMessage);
verifyBtn.addEventListener("click", verifyMatch);

/**
 * Display status message with styling
 */
function updateStatus(message, type = "info") {
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`;
}

/**
 * Show notification toast
 */
function showNotification(message, type = "success") {
  notification.textContent = message;
  notification.className = `notification ${type} show`;
  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

/**
 * Copy text to clipboard
 */
function copyToClipboard(elementId) {
  const element = document.getElementById(elementId);
  const text = element.textContent;

  if (!text || text === "-" || text === "Click \"Generate New Key\" to start") {
    showNotification("Nothing to copy", "warning");
    return;
  }

  navigator.clipboard
    .writeText(text)
    .then(() => {
      showNotification("Copied to clipboard!", "success");
    })
    .catch(() => {
      showNotification("Failed to copy", "error");
    });
}

/**
 * Generate a new AES-256 key
 */
async function generateKey() {
  try {
    updateStatus("Generating new AES-256 key...", "info");
    const response = await fetch(`${API_BASE}/generate-key`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to generate key");
    }

    const data = await response.json();
    currentKey = data.key;
    document.getElementById("keyDisplay").textContent = currentKey;

    updateStatus("✓ New AES-256 key generated successfully", "success");
    showNotification("Key generated!");
  } catch (error) {
    updateStatus(`✗ Error: ${error.message}`, "error");
    showNotification(error.message, "error");
  }
}

/**
 * Encrypt plaintext message
 */
async function encryptMessage() {
  const plaintext = plaintextInput.value.trim();

  if (!currentKey) {
    updateStatus("✗ Please generate a key first", "error");
    showNotification("Generate a key first", "error");
    return;
  }

  if (!plaintext) {
    updateStatus("✗ Please enter a message to encrypt", "error");
    showNotification("Enter a message", "error");
    return;
  }

  try {
    updateStatus("Encrypting message...", "info");
    const response = await fetch(`${API_BASE}/encrypt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plaintext: plaintext,
        key: currentKey,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Encryption failed");
    }

    const data = await response.json();
    lastEncryption = data;

    document.getElementById("nonceDisplay").textContent = data.nonce;
    document.getElementById("ciphertextDisplay").textContent = data.ciphertext;
    document.getElementById("tagDisplay").textContent = data.tag;
    decryptedOutput.value = "";

    updateStatus("✓ Message encrypted successfully", "success");
    showNotification("Encryption successful!");
  } catch (error) {
    updateStatus(`✗ Error: ${error.message}`, "error");
    showNotification(error.message, "error");
  }
}

/**
 * Decrypt ciphertext message
 */
async function decryptMessage() {
  if (!currentKey) {
    updateStatus("✗ Please generate a key first", "error");
    showNotification("Generate a key first", "error");
    return;
  }

  if (!lastEncryption) {
    updateStatus("✗ No encrypted message to decrypt", "error");
    showNotification("Encrypt a message first", "error");
    return;
  }

  try {
    updateStatus("Decrypting message...", "info");
    const response = await fetch(`${API_BASE}/decrypt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nonce: lastEncryption.nonce,
        tag: lastEncryption.tag,
        ciphertext: lastEncryption.ciphertext,
        key: currentKey,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Decryption failed");
    }

    const data = await response.json();
    decryptedOutput.value = data.plaintext;

    updateStatus("✓ Message decrypted successfully", "success");
    showNotification("Decryption successful!");
  } catch (error) {
    updateStatus(`✗ Error: ${error.message}`, "error");
    showNotification(error.message, "error");
  }
}

/**
 * Verify that decrypted output matches original plaintext
 */
function verifyMatch() {
  const plaintext = plaintextInput.value.trim();
  const decrypted = decryptedOutput.value.trim();

  if (!plaintext || !decrypted) {
    updateStatus("✗ Please encrypt and decrypt a message first", "error");
    showNotification("Incomplete operation", "error");
    return;
  }

  if (plaintext === decrypted) {
    updateStatus("✓ MATCH! Decrypted message matches original plaintext", "success");
    showNotification("Messages match perfectly!", "success");
  } else {
    updateStatus("✗ MISMATCH! Decrypted message does not match original", "error");
    showNotification("Messages do not match", "error");
  }
}

/**
 * Clear all inputs and outputs
 */
function clearAll() {
  plaintextInput.value = "";
  decryptedOutput.value = "";
  document.getElementById("nonceDisplay").textContent = "-";
  document.getElementById("ciphertextDisplay").textContent = "-";
  document.getElementById("tagDisplay").textContent = "-";
  lastEncryption = null;
  updateStatus("All fields cleared", "info");
  showNotification("Cleared!");
}

/**
 * Initialize on page load
 */
document.addEventListener("DOMContentLoaded", () => {
  updateStatus("Ready. Generate a key to start.", "info");
});
