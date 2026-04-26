import { readGpuData, writeGpuModule } from "./gpu-data.mjs";

const records = await readGpuData();
await writeGpuModule(records);
console.log(`Synced ${records.length} GPU records to src/data/gpus.js.`);
