const baseURL = '';

export type BodyType<BodyData = unknown> = BodyData;

export const fetchInstance = async <T>(
  url: string,
  {
    method,
    params,
    body,
  }: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    params?: Record<string, string>;
    body?: BodyType<unknown>;
    responseType?: string;
  },
): Promise<T> => {
  let targetUrl = `${baseURL}${url}`;

  if (params) {
    const searchParams = new URLSearchParams(params);
    targetUrl += `?${searchParams.toString()}`;
  }

  const response = await fetch(targetUrl, {
    method,
    body: body as BodyInit | undefined,
  });

  return response.json() as Promise<T>;
};

export default fetchInstance;
