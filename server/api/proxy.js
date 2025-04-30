export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const query = getQuery(event); // Get query params (filters)
    const body = await readBody(event); // Get request body
    const endpoint = event.context.params.endpoint; // Dynamic endpoint
    const token = getCookie(event, 'auth_token'); // Securely get auth token
  
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`; // Attach token if available
  
      const url = new URL(`${config.public.apiBaseUrl}/${endpoint}`);
      Object.keys(query).forEach((key) => url.searchParams.append(key, query[key])); // Append filters
  
      const options = { method: event.method, headers };
      if (body) options.body = JSON.stringify(body);
  
      const response = await fetch(url.toString(), options);
      if (!response.ok) throw new Error(`API Error ${response.status}: ${await response.text()}`);
  
      return await response.json();
    } catch (error) {
      console.log('API Middleware Error:', error);
      throw createError({ statusCode: 500, message: 'Internal Server Error' });
    }
  });
  