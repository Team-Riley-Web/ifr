import { createReadStream } from 'node:fs';
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentRoot = path.resolve(__dirname, '../..');
const courseFolders = [
  '01. Core Skills',
  '02. Seven Worlds',
  '03. Pure Harmony Essentials',
  '04. Chord Melody',
  '05. Chord Melody 2',
  '06. Violin Looping',
];

const {
  R2_ACCOUNT_ID: accountId,
  R2_BUCKET: bucket,
  R2_ACCESS_KEY_ID: accessKeyId,
  R2_SECRET_ACCESS_KEY: secretAccessKey,
} = process.env;

if (!accountId || !bucket || !accessKeyId || !secretAccessKey) {
  throw new Error('Set R2_ACCOUNT_ID, R2_BUCKET, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY before uploading.');
}

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
});

async function* walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) yield* walk(fullPath);
    else if (entry.isFile() && /\.(mp3|mp4|pdf)$/i.test(entry.name)) yield fullPath;
  }
}

let uploaded = 0;
for (const folder of courseFolders) {
  for await (const filePath of walk(path.join(contentRoot, folder))) {
    const fileStat = await stat(filePath);
    const key = path.relative(contentRoot, filePath).split(path.sep).join('/');
    console.log(`Uploading ${key}`);
    await client.send(new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: createReadStream(filePath),
      ContentLength: fileStat.size,
    }));
    uploaded += 1;
  }
}

console.log(`Uploaded ${uploaded} course files to ${bucket}.`);
