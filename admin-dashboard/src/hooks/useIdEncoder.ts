/**
 * Custom hook for encoding/decoding entity IDs
 * Simple base64 encoding to obfuscate numeric IDs in URLs
 */
export const useIdEncoder = () => {
  
  const encode = (id: number | string): string => {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(numericId)) {
      throw new Error('Invalid ID provided for encoding');
    }
    return btoa(numericId.toString());
  };

  const decode = (encodedId: string): number => {
    try {
      const decodedString = atob(encodedId);
      const numericId = parseInt(decodedString, 10);
      
      if (isNaN(numericId)) {
        throw new Error('Decoded ID is not a valid number');
      }
      
      return numericId;
    } catch (error) {
      throw new Error('Invalid encoded ID provided');
    }
  };

  return { encode, decode };
};