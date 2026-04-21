import "server-only";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/env";

// 1. Initialize S3 client pointing to Cloudflare R2
export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

// 2. Helper to generate a presigned upload URL
export async function getPresignedUploadUrl(
  filename: string,
  contentType: string,
) {
  const command = new PutObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key: filename,
    ContentType: contentType,
  });

  // URL expires in 5 minutes (300 seconds)
  const url = await getSignedUrl(r2Client, command, { expiresIn: 300 });

  return {
    url,
    publicUrl: `${env.NEXT_PUBLIC_R2_PUBLIC_URL}/${filename}`, // e.g. https://images.yourstore.com/my-image.webp
  };
}
