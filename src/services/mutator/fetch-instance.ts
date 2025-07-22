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
    params?: Record<string, unknown>;
    body?: BodyType<unknown>;
    responseType?: string;
  },
): Promise<T> => {
  let targetUrl = `${baseURL}${url}`;

  if (params) {
    targetUrl += `?${new URLSearchParams(params)}`;
  }

  const response = await fetch(targetUrl, {
    method,
    body,
  });

  return response.json();
};

export default fetchInstance;
