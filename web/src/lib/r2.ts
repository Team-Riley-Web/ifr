import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const accountId = process.env.R2_ACCOUNT_ID;
const bucket = process.env.R2_BUCKET;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

export const hasR2Config = Boolean(accountId && bucket && accessKeyId && secretAccessKey);

const client = hasR2Config
  ? new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: accessKeyId!, secretAccessKey: secretAccessKey! },
    })
  : null;

export async function getSignedContentUrl(key: string): Promise<string> {
  if (!client || !bucket) throw new Error('R2 is not configured');
  return getSignedUrl(client, new GetObjectCommand({ Bucket: bucket, Key: key }), { expiresIn: 15 * 60 });
}

export async function getObjectBytes(key: string): Promise<Uint8Array> {
  if (!client || !bucket) throw new Error('R2 is not configured');
  const { Body } = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  if (!Body) throw new Error(`R2 object has no body: ${key}`);
  return Body.transformToByteArray();
}
