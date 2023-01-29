const crypto = require("crypto");
const { TRIVIAL_PARTITION_KEY, MAX_PARTITION_KEY_LENGTH } = require('./constants');

const createHashFromEvent = (event) => {
  return crypto.createHash("sha3-512").update(JSON.stringify(event)).digest("hex")
}

const generateCandidateFromEvent = (event) => {
  const { partitionKey } = event;
  if (!partitionKey) return createHashFromEvent(event);
  if (typeof partitionKey === 'string') return partitionKey;
  return JSON.stringify(partitionKey);
}

exports.deterministicPartitionKey = (event) => {
  if (!event) return TRIVIAL_PARTITION_KEY;
  
  let candidate = generateCandidateFromEvent(event);

  if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    candidate = crypto.createHash("sha3-512").update(candidate).digest("hex");
  }

  return candidate;
};