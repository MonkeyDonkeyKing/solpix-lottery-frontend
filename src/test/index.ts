import { PublicKey } from "@solana/web3.js"; // Import the Solana PublicKey class
import superjson from "superjson";

// Register the custom transformer for PublicKey
superjson.registerCustom<PublicKey, string>(
  {
    deserialize: (v) => new PublicKey(v),
    isApplicable: (v): v is PublicKey => v instanceof PublicKey,
    serialize: (v) => v.toBase58(),
  },
  "PublicKey"
);

// Create a sample PublicKey instance
const publicKey = new PublicKey("2y2RgsLQe2vj2oL27iMe3A43c73RwRgxXFBoC1jv94jc");

// Serialize the PublicKey instance
const serializedPublicKey = superjson.serialize(publicKey);

// Deserialize the serialized PublicKey
const deserializedPublicKey =
  superjson.deserialize<PublicKey>(serializedPublicKey);

console.log(deserializedPublicKey instanceof PublicKey);

console.log(deserializedPublicKey.toBase58() === publicKey.toBase58());
