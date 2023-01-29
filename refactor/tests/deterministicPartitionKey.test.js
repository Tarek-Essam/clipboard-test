const crypto = require("crypto");
const { deterministicPartitionKey } = require('../refactor');

describe('deterministicPartitionKey tests', () => {
  it('should return "0" if no event supplied', () => {
    const result = deterministicPartitionKey();
    expect(result).toEqual("0");
  });

  it('should return number partitionKey supplied as string', () => {
    const result = deterministicPartitionKey({ partitionKey: 12 });
    expect(result).toEqual("12");
  });

  it('should return partitionKey supplied', () => {
    const result = deterministicPartitionKey({ partitionKey: "test" });
    expect(result).toEqual("test");
  });

  it('should return candidate as stringified hex of supplied input if no partitionKey is provided ', () => {
    const event = { x: 10 };
    const result = deterministicPartitionKey(event);
    const expectedResult = crypto.createHash("sha3-512").update(JSON.stringify(event)).digest("hex");
    expect(result).toEqual(expectedResult);
  });

  it('should return candidate as stringified hex of partitionKey is the length is bigger than 256', () => {
    const event = { partitionKey: crypto.randomBytes(257).toString('hex') };
    const result = deterministicPartitionKey(event);
    const expectedResult = crypto.createHash("sha3-512").update(event.partitionKey).digest("hex");
    expect(result).toEqual(expectedResult);
  });
})