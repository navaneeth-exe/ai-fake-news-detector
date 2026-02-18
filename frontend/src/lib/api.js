// API helper — communicates with Flask backend
const API_URL = '';

export async function verifyInput(claim) {
  const res = await fetch(`${API_URL}/api/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ claim }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Verification failed.');
  return data;
}

export async function checkPhishing(url) {
  const res = await fetch(`${API_URL}/api/phishing`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Phishing check failed.');
  return data;
}

export async function checkImage(input) {
  // input = { type: 'file', file } | { type: 'url', url }
  if (input.type === 'file') {
    const form = new FormData();
    form.append('image', input.file);
    const res = await fetch(`${API_URL}/api/image`, { method: 'POST', body: form });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Image analysis failed.');
    return data;
  } else {
    const res = await fetch(`${API_URL}/api/image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: input.url }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Image analysis failed.');
    return data;
  }
}

export async function checkAudio(file) {
  const form = new FormData();
  form.append('audio', file);
  const res = await fetch(`${API_URL}/api/audio`, { method: 'POST', body: form });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Audio analysis failed.');
  return data;
}

export async function getTrendingNews() {
  const res = await fetch(`${API_URL}/api/trending`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to fetch trending news.');
  return data.articles;
}

export async function checkHealth() {
  const res = await fetch(`${API_URL}/health`);
  return res.json();
}
