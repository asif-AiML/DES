// 1. HELPER: String to Binary
function textToBinary(text: string): string {
  return text
    .split("")
    .map((char) => {
      return char.charCodeAt(0).toString(2).padStart(8, "0");
    })
    .join("");
}

// 2. HELPER: Binary to Text
function binaryToText(binary: string): string {
  let text = "";
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.substring(i, i + 8);
    text += String.fromCharCode(parseInt(byte, 2));
  }
  return text;
}

// 3. HELPER: XOR Operation
function xorBinary(bin1: string, bin2: string): string {
  let result = "";
  const length = Math.min(bin1.length, bin2.length);
  for (let i = 0; i < length; i++) {
    result += bin1[i] === bin2[i] ? "0" : "1";
  }
  return result;
}

// 4. THE KEY SCHEDULE
function getSubkey(binaryKey: string, round: number): string {
  const shift = round % binaryKey.length;
  return binaryKey.substring(shift) + binaryKey.substring(0, shift);
}

// 5. THE FEISTEL FUNCTION
function feistelFunction(rightHalf: string, roundKey: string): string {
  return xorBinary(rightHalf, roundKey);
}

// 6. THE MAIN ENGINE EXPORT
export function processDESCipher(
  text: string,
  key: string,
  mode: "ENCRYPT" | "DECRYPT",
) {
  if (!text || text.trim() === "")
    return { result: "Error: Input text is empty." };

  let validKey = key;
  if (key.length < 8) validKey = key.padEnd(8, "0");
  else if (key.length > 8) validKey = key.substring(0, 8);

  const binaryKey = textToBinary(validKey);
  let binaryData = "";

  if (mode === "ENCRYPT") {
    binaryData = textToBinary(text);
  } else {
    binaryData = text;
  }

  // ==========================================
  // THE NEW FIX: CHOPPING DATA INTO 64-BIT BLOCKS
  // ==========================================
  const BLOCK_SIZE = 64; // 64 bits = exactly 8 characters
  let blocks = [];

  for (let i = 0; i < binaryData.length; i += BLOCK_SIZE) {
    let block = binaryData.substring(i, i + BLOCK_SIZE);
    // If the last block is shorter than 8 characters, pad it with zeros
    while (block.length < BLOCK_SIZE) block += "0";
    blocks.push(block);
  }

  let finalBinary = "";

  // ==========================================
  // PROCESS EACH BLOCK ONE BY ONE
  // ==========================================
  for (let b = 0; b < blocks.length; b++) {
    let block = blocks[b];

    // Split this specific block perfectly in half (32 bits left, 32 bits right)
    let left = block.substring(0, 32);
    let right = block.substring(32);

    // The 16 Rounds of the Feistel Network for THIS block
    for (let round = 0; round < 16; round++) {
      const tempRight = right;
      const actualRound = mode === "ENCRYPT" ? round : 15 - round;
      const roundKey = getSubkey(binaryKey, actualRound);

      const feistelOutput = feistelFunction(right, roundKey);
      right = xorBinary(left, feistelOutput);
      left = tempRight;
    }

    // Glue the processed block to the final output
    finalBinary += right + left;
  }

  if (mode === "ENCRYPT") {
    return { result: finalBinary };
  } else {
    // Convert back to text and remove the invisible padding zeros from the last block
    return { result: binaryToText(finalBinary).replace(/\0/g, "") };
  }
}
