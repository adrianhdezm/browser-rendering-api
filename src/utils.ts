import { timingSafeEqual } from 'node:crypto';
import z from 'zod';

export type BasicAuthCredentials = {
  username: string;
  password: string;
};

export function parseBasicAuthHeader(authorization: string | undefined): BasicAuthCredentials | null {
  if (!authorization) {
    return null;
  }

  const [scheme, encoded] = authorization.split(' ');
  if (scheme !== 'Basic' || !encoded) {
    return null;
  }

  let decoded = '';
  try {
    decoded = Buffer.from(encoded, 'base64').toString('utf8');
  } catch {
    return null;
  }

  const separator = decoded.indexOf(':');
  if (separator === -1) {
    return null;
  }

  return {
    username: decoded.slice(0, separator),
    password: decoded.slice(separator + 1)
  };
}

export function safeEqual(input: string, expected: string): boolean {
  const inputBuffer = Buffer.from(input);
  const expectedBuffer = Buffer.from(expected);

  if (inputBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(inputBuffer, expectedBuffer);
}

export const requestOptionsSchema = z.object({
  url: z.httpUrl().normalize(),
  gotoOptions: z
    .object({
      timeout: z.number().max(60_000).optional(),
      waitUntil: z.enum(['load', 'domcontentloaded', 'networkidle', 'commit']).optional()
    })
    .default({}),
  userAgent: z
    .string()
    .default('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'),
  viewport: z
    .object({
      height: z.number(),
      width: z.number()
    })
    .default({ height: 1080, width: 1920 }),
  locale: z.string().default('en-US'),  
  waitForSelector: z
    .object({
      selector: z.string(),
      hidden: z.literal(true).optional(),
      timeout: z.number().max(120_000).optional(),
      visible: z.literal(true).optional()
    })
    .refine((value) => !(value.hidden && value.visible), {
      message: 'waitForSelector.hidden and waitForSelector.visible cannot both be true.'
    })
    .optional(),
  waitForTimeout: z.number().max(120_000).optional()
});

export type RequestOptions = z.infer<typeof requestOptionsSchema>;
