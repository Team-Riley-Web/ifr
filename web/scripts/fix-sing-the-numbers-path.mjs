// One-time migration: the Sing the Numbers playlist folders were uploaded to
// the bucket root instead of nested under "07. Sing the Numbers/", which is
// the object-key prefix courses.ts expects. This copies every object under
// the four misplaced prefixes to the correct path, then removes the original.
//
// Usage (from web/, with R2 credentials in the environment or web/.env):
//   node --env-file=.env scripts/fix-sing-the-numbers-path.mjs
import { CopyObjectCommand, DeleteObjectCommand, ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';

const {
  R2_ACCOUNT_ID: accountId,
  R2_BUCKET: bucket,
  R2_ACCESS_KEY_ID: accessKeyId,
  R2_SECRET_ACCESS_KEY: secretAccessKey,
} = process.env;

if (!accountId || !bucket || !accessKeyId || !secretAccessKey) {
  throw new Error('Set R2_ACCOUNT_ID, R2_BUCKET, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY before running.');
}

const client = new S3Client({
  region: 'auto',
  forcePathStyle: true,
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
});

const misplacedPrefixes = [
  'Feel the Numbers/',
  'Sing the Numbers 1/',
  'Sing the Numbers 2/',
  'Sing the Numbers 3/',
];
const targetPrefix = '07. Sing the Numbers/';

function encodeCopySource(key) {
  return `${bucket}/${encodeURIComponent(key).replace(/%2F/g, '/')}`;
}

async function* listAll(prefix) {
  let continuationToken;
  do {
    const response = await client.send(new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
      ContinuationToken: continuationToken,
    }));
    for (const object of response.Contents ?? []) yield object;
    continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;
  } while (continuationToken);
}

let moved = 0;
for (const prefix of misplacedPrefixes) {
  for await (const object of listAll(prefix)) {
    const oldKey = object.Key;
    const newKey = `${targetPrefix}${oldKey}`;
    console.log(`${oldKey} -> ${newKey}`);
    await client.send(new CopyObjectCommand({
      Bucket: bucket,
      CopySource: encodeCopySource(oldKey),
      Key: newKey,
    }));
    await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: oldKey }));
    moved += 1;
  }
}

console.log(`Moved ${moved} objects under "${targetPrefix}".`);
