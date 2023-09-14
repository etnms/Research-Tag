export const generateRandomKey = (prefix: string = "key"): string => {
  const timestamp = Date.now().toString(36);
  const randomString = Math.random().toString(36).substring(2, 10); // Generate a random string

  // Combine the timestamp and random string to create a unique key
  const key = `${prefix}-${timestamp}-${randomString}`;

  return key;
};
