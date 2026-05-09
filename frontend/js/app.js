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
const charCounter = document.getElementById("charCount");

// Event Listeners
generateKeyBtn.addEventListener("click", generateKey);
clearAllBtn.addEventListener("click", clearAll);
copyKeyBtn.addEventListener("click", () => copyToClipboard("keyDisplay"));
encryptBtn.addEventListener("click", encryptMessage);
decryptBtn.addEventListener("click", decryptMessage);
verifyBtn.addEventListener("click", verifyMatch);
plaintextInput.addEventListener("input", updateCharCounter);
/**
 * Display status message with styling
 */
function updateStatus(message, type = "info") {
  statusMessage.textContent = message;
  statusMessage.className = `status-content`;
}

/**
 * Show notification toast
 */
function showNotification(message, type = "success") {
  notification.textContent = message;
  notification.className = `notification-toast ${type} show`;
  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

/**
 * Update character counter
 */
function updateCharCounter() {
  const count = plaintextInput.value.length;
  charCounter.textContent = Math.min(count, 10000);
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

  showLoading(true, "Encrypting message...");
  
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
    
    // Add to history
    addToHistory(plaintext);

    updateStatus("✓ Message encrypted successfully", "success");
    showNotification("Encryption successful!");
  } catch (error) {
    updateStatus(`✗ Error: ${error.message}`, "error");
    showNotification(error.message, "error");
  } finally {
    showLoading(false);
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

  showLoading(true, "Decrypting message...");
  
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
  } finally {
    showLoading(false);
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
 * Show or hide loading overlay
 */
function showLoading(show, text = "Processing...") {
  const overlay = document.getElementById("loadingOverlay");
  const loadingText = document.getElementById("loadingText");
  
  if (show) {
    overlay.classList.add("active");
    loadingText.textContent = text;
  } else {
    overlay.classList.remove("active");
  }
}

/**
 * ==========================================
 * HISTORY MANAGEMENT
 * ==========================================
 */

// Load history from localStorage
function loadHistory() {
  const stored = localStorage.getItem("ciphershieldHistory");
  return stored ? JSON.parse(stored) : [];
}

// Save history to localStorage
function saveHistory(history) {
  localStorage.setItem("ciphershieldHistory", JSON.stringify(history));
}

// Add message to history
function addToHistory(plaintext) {
  const history = loadHistory();
  const now = new Date();
  
  history.unshift({
    id: Date.now(),
    plaintext: plaintext,
    timestamp: now.toLocaleString(),
    timeAgo: getTimeAgo(now)
  });
  
  // Keep only last 50 entries
  if (history.length > 50) {
    history.pop();
  }
  
  saveHistory(history);
  updateHistoryDisplay();
}

// Get human-readable time difference
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// Display history items
function updateHistoryDisplay() {
  const history = loadHistory();
  const historyList = document.getElementById("historyList");
  const historyCount = document.getElementById("historyCount");
  
  historyCount.textContent = history.length;
  
  if (history.length === 0) {
    historyList.innerHTML = '<div class="history-empty"><p>💭 No encryption history yet. Start encrypting messages to see them here.</p></div>';
    return;
  }
  
  historyList.innerHTML = history.map(item => `
    <div class="history-item">
      <div class="history-content">
        <div class="history-time">${item.timestamp}</div>
        <div class="history-text">"${item.plaintext}"</div>
      </div>
      <div class="history-actions">
        <button class="history-btn" onclick="copyHistoryItem('${item.plaintext.replace(/'/g, "\\'")}')">Copy</button>
      </div>
    </div>
  `).join("");
}

// Copy history item to clipboard
function copyHistoryItem(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      showNotification("Copied from history!", "success");
    })
    .catch(() => {
      showNotification("Failed to copy", "error");
    });
}

// Clear all history
function clearHistory() {
  if (confirm("Are you sure you want to clear all encryption history? This cannot be undone.")) {
    localStorage.removeItem("ciphershieldHistory");
    updateHistoryDisplay();
    showNotification("History cleared", "success");
  }
}

/**
 * ==========================================
 * EXPORT FUNCTIONALITY
 * ==========================================
 */

// Export encrypted data as JSON
function exportEncryptedData() {
  if (!lastEncryption || !currentKey) {
    showNotification("No encryption data to export", "error");
    return;
  }
  
  const data = {
    timestamp: new Date().toISOString(),
    plaintext: plaintextInput.value,
    encrypted: {
      nonce: lastEncryption.nonce,
      ciphertext: lastEncryption.ciphertext,
      tag: lastEncryption.tag
    },
    keyHash: btoa(currentKey).substring(0, 16) + "..." // Show partial key for reference
  };
  
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `ciphershield-export-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
  
  showNotification("Data exported successfully", "success");
}

/**
 * ==========================================
 * SECURITY SIMULATION
 * ==========================================
 */

// Simulate an interception attack
function simulateAttack() {
  if (!lastEncryption) {
    showNotification("Encrypt a message first to simulate attack", "error");
    return;
  }
  
  showLoading(true, "Simulating network interception...");
  
  setTimeout(() => {
    showLoading(false);
    
    // Combine encrypted components as if intercepted over network
    const interceptedData = JSON.stringify({
      session_id: Math.random().toString(36).substring(2),
      timestamp: new Date().getTime(),
      nonce: lastEncryption.nonce,
      ciphertext: lastEncryption.ciphertext,
      tag: lastEncryption.tag,
      source: "192.168.1.100",
      destination: "192.168.1.50"
    });
    
    document.getElementById("interceptedCode").textContent = interceptedData;
    const resultDiv = document.getElementById("simulationResult");
    resultDiv.classList.remove("hidden");
    
    updateStatus("⚠️ Simulated attack: Data intercepted but unreadable without key", "info");
    showNotification("Attack simulated! See data below - it's useless without the key", "info");
    
    // Scroll to simulation result
    setTimeout(() => {
      document.getElementById("simulationResult").scrollIntoView({ behavior: "smooth" });
    }, 300);
  }, 1500);
}

/**
 * Initialize on page load
 */
document.addEventListener("DOMContentLoaded", () => {
  updateStatus("Ready. Generate a key to start.", "info");
  
  // Setup new feature event listeners
  const clearHistoryBtn = document.getElementById("clearHistoryBtn");
  const simulateAttackBtn = document.getElementById("simulateAttackBtn");
  
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener("click", clearHistory);
  }
  
  if (simulateAttackBtn) {
    simulateAttackBtn.addEventListener("click", simulateAttack);
  }
  
  // Load and display initial history
  updateHistoryDisplay();
});
