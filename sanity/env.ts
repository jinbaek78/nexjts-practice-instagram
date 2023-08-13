export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-08-13';

export const token = process.env.NEXT_PUBLIC_SANITY_TOKEN;

process.env.NEXT_PUBLIC_SANITY_API_VERSION;
export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
);

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
);

// NEXT_PUBLIC_SANITY_PROJECT_ID,
// skxeFOCQG2Ay7KvEkK26cQQ3nsDO1T7hPmhCELW36twZ4EeZYGPKpMeQppvYrHhuXuWsVo4kECOToE54U8Y7vexf6CSvaGDaGI6X5xCD9GMgrEUX1FgQH4MAeXd5vsHC5RPRX5wA1P9Is9WE9AjEfD2YsM6ljXvNRp6DJHSy0TOno7PZWir4

export const useCdn = false;

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}
