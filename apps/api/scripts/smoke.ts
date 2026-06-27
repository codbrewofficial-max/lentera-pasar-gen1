import "dotenv/config";

const baseUrl = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 4000}`;

async function request(path: string, options: RequestInit = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...(options.headers || {})
    }
  });
  const json = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(`${options.method || "GET"} ${path} failed: ${response.status} ${JSON.stringify(json)}`);
  }
  return json;
}

async function main() {
  const unique = Date.now();
  const internalLogin = await request("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: "internal@lenterapasar.test", password: "password123" })
  });
  const internalToken = internalLogin.data.token;

  const owner = await request("/api/v1/internal/owners", {
    method: "POST",
    headers: { authorization: `Bearer ${internalToken}` },
    body: JSON.stringify({
      name: `Smoke Owner ${unique}`,
      email: `smoke-owner-${unique}@lenterapasar.test`,
      password: "password123"
    })
  });

  const ownerLogin = await request("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: owner.data.email, password: "password123" })
  });
  const ownerToken = ownerLogin.data.token;

  const website = await request("/api/v1/websites", {
    method: "POST",
    headers: { authorization: `Bearer ${ownerToken}` },
    body: JSON.stringify({
      name: `Smoke Company ${unique}`,
      slug: `smoke-company-${unique}`,
      websiteType: "company_profile"
    })
  });
  const websiteId = website.data.id;

  await request(`/api/v1/websites/${websiteId}/pages`, { headers: { authorization: `Bearer ${ownerToken}` } });
  await request(`/api/v1/websites/${websiteId}/sections`, { headers: { authorization: `Bearer ${ownerToken}` } });
  const templates = await request("/api/v1/template-sections/by-slot/home.hero", { headers: { authorization: `Bearer ${ownerToken}` } });
  await request(`/api/v1/websites/${websiteId}/sections/home.hero/template`, {
    method: "PATCH",
    headers: { authorization: `Bearer ${ownerToken}` },
    body: JSON.stringify({ templateSectionId: templates.data[0].id })
  });
  await request(`/api/v1/websites/${websiteId}/sections/home.hero/content`, {
    method: "PATCH",
    headers: { authorization: `Bearer ${ownerToken}` },
    body: JSON.stringify({ contentJson: { title: "Smoke Title", subtitle: "Smoke subtitle" } })
  });
  await request(`/api/v1/websites/${websiteId}/business-profile`, {
    method: "PUT",
    headers: { authorization: `Bearer ${ownerToken}` },
    body: JSON.stringify({ name: "Smoke Company", contactEmail: "smoke@example.com" })
  });
  await request(`/api/v1/websites/${websiteId}/services`, {
    method: "POST",
    headers: { authorization: `Bearer ${ownerToken}` },
    body: JSON.stringify({ title: "Smoke Service", description: "Smoke description", sortOrder: 1 })
  });
  await request(`/api/v1/websites/${websiteId}/publish`, { method: "POST", headers: { authorization: `Bearer ${ownerToken}` } });
  await request(`/api/v1/public/sites/${website.data.slug}`);
  await request(`/api/v1/public/sites/${website.data.slug}/pages/services`);
  await request("/api/v1/public/tracking/events", {
    method: "POST",
    body: JSON.stringify({
      trackingKey: website.data.trackingKey,
      eventName: "page_view",
      visitorId: "smoke_visitor",
      sessionId: "smoke_session",
      pageKey: "home",
      metadata: {}
    })
  });
  await request(`/api/v1/public/sites/${website.data.slug}/contact`, {
    method: "POST",
    body: JSON.stringify({
      name: "Smoke Lead",
      email: "smoke-lead@example.com",
      message: "Smoke contact",
      interest: "Smoke Service",
      sourcePage: "contact",
      sourceSection: "contact.contact_form"
    })
  });
  await request(`/api/v1/websites/${websiteId}/insights/summary`, { headers: { authorization: `Bearer ${ownerToken}` } });

  console.log("Smoke test passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
