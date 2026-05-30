const fs = require("node:fs");
const path = require("node:path");
const protoLoader = require("@grpc/proto-loader");

const PROTO_DIR = path.join(process.cwd(), "proto");
const PROTO_FILES = [
  "feedback_analysis.proto",
  "invitation_email.proto",
  "verification_email.proto",
];

for (const file of PROTO_FILES) {
  const fullPath = path.join(PROTO_DIR, file);
  if (!fs.existsSync(fullPath)) {
    console.error(`verify-build: missing ${fullPath}`);
    process.exit(1);
  }
}

try {
  protoLoader.loadSync(
    PROTO_FILES.map((file) => path.join(PROTO_DIR, file)),
    {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    }
  );
} catch (err) {
  console.error("verify-build: failed to load proto files:", err);
  process.exit(1);
}

console.log("verify-build: proto files present and loadable");
