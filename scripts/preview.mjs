import { cp, access } from "node:fs/promises";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
const output = join(root, ".next", "standalone");
try { await access(join(output, "server.js")); }
catch { console.error("Build the site with npm run build before starting the production preview."); process.exit(1); }
await cp(join(root, "public"), join(output, "public"), { recursive: true });
await cp(join(root, ".next", "static"), join(output, ".next", "static"), { recursive: true });
// Load the standalone entry in this process so Ctrl+C and test teardown do not
// leave a detached child holding the build directory open on Windows.
process.env.HOSTNAME = "127.0.0.1";
process.env.PORT ||= "3000";
await import(pathToFileURL(join(output, "server.js")).href);
