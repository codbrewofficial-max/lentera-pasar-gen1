// ============================================================
// PASTE INI setelah baris: registerCrud("brand-partners", brandBody);
// ============================================================

// --- Business Timeline CRUD ---
const registerTimelineRoutes = () => {
  const base = "timelines";
  app.get(`/api/v1/websites/:websiteId/${base}`, async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const rows = await prisma.businessTimeline.findMany({
      where: { websiteId: website.id },
      orderBy: { sortOrder: "asc" }
    });
    return ok(reply, rows, "timelines loaded");
  });

  app.post(`/api/v1/websites/:websiteId/${base}`, async (request: Req, reply) => {
    const { user, website } = await getWebsiteForAccess(request);
    const body = timelineBody.parse(request.body);
    const row = await prisma.businessTimeline.create({
      data: { ...body, websiteId: website.id }
    });
    await createAuditLog(request, {
      action: "timelines.created",
      actor: user,
      websiteId: website.id,
      entityType: "timeline",
      entityId: row.id,
      summary: "Timeline item created",
      metadata: { year: row.year, title: row.title }
    });
    return ok(reply, row, "timeline created", 201);
  });

  app.get(`/api/v1/websites/:websiteId/${base}/:timelineId`, async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const row = await prisma.businessTimeline.findFirst({
      where: { id: (request.params as any).timelineId, websiteId: website.id }
    });
    if (!row) throw new AppError(404, "ITEM_NOT_FOUND", "Timeline item not found");
    return ok(reply, row, "timeline loaded");
  });

  app.patch(`/api/v1/websites/:websiteId/${base}/:timelineId`, async (request: Req, reply) => {
    const { user, website } = await getWebsiteForAccess(request);
    const body = timelineBody.partial().parse(request.body);
    const existing = await prisma.businessTimeline.findFirst({
      where: { id: (request.params as any).timelineId, websiteId: website.id }
    });
    if (!existing) throw new AppError(404, "ITEM_NOT_FOUND", "Timeline item not found");
    const row = await prisma.businessTimeline.update({ where: { id: existing.id }, data: body });
    await createAuditLog(request, {
      action: "timelines.updated",
      actor: user,
      websiteId: website.id,
      entityType: "timeline",
      entityId: row.id,
      summary: "Timeline item updated",
      metadata: { changedFields: Object.keys(body) }
    });
    return ok(reply, row, "timeline updated");
  });

  app.delete(`/api/v1/websites/:websiteId/${base}/:timelineId`, async (request: Req, reply) => {
    const { user, website } = await getWebsiteForAccess(request);
    const existing = await prisma.businessTimeline.findFirst({
      where: { id: (request.params as any).timelineId, websiteId: website.id }
    });
    if (!existing) throw new AppError(404, "ITEM_NOT_FOUND", "Timeline item not found");
    await prisma.businessTimeline.delete({ where: { id: existing.id } });
    await createAuditLog(request, {
      action: "timelines.deleted",
      actor: user,
      websiteId: website.id,
      entityType: "timeline",
      entityId: existing.id,
      summary: "Timeline item deleted",
      metadata: { year: existing.year, title: existing.title }
    });
    return ok(reply, true, "timeline deleted");
  });
};

// --- Team Member CRUD ---
const registerTeamMemberRoutes = () => {
  const base = "team-members";
  app.get(`/api/v1/websites/:websiteId/${base}`, async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const rows = await prisma.teamMember.findMany({
      where: { websiteId: website.id },
      orderBy: { sortOrder: "asc" }
    });
    return ok(reply, rows, "team members loaded");
  });

  app.post(`/api/v1/websites/:websiteId/${base}`, async (request: Req, reply) => {
    const { user, website } = await getWebsiteForAccess(request);
    const body = teamMemberBody.parse(request.body);
    const row = await prisma.teamMember.create({
      data: { ...body, websiteId: website.id }
    });
    await createAuditLog(request, {
      action: "team-members.created",
      actor: user,
      websiteId: website.id,
      entityType: "team_member",
      entityId: row.id,
      summary: "Team member created",
      metadata: { name: row.name }
    });
    return ok(reply, row, "team member created", 201);
  });

  app.get(`/api/v1/websites/:websiteId/${base}/:teamMemberId`, async (request: Req, reply) => {
    const { website } = await getWebsiteForAccess(request);
    const row = await prisma.teamMember.findFirst({
      where: { id: (request.params as any).teamMemberId, websiteId: website.id }
    });
    if (!row) throw new AppError(404, "ITEM_NOT_FOUND", "Team member not found");
    return ok(reply, row, "team member loaded");
  });

  app.patch(`/api/v1/websites/:websiteId/${base}/:teamMemberId`, async (request: Req, reply) => {
    const { user, website } = await getWebsiteForAccess(request);
    const body = teamMemberBody.partial().parse(request.body);
    const existing = await prisma.teamMember.findFirst({
      where: { id: (request.params as any).teamMemberId, websiteId: website.id }
    });
    if (!existing) throw new AppError(404, "ITEM_NOT_FOUND", "Team member not found");
    const row = await prisma.teamMember.update({ where: { id: existing.id }, data: body });
    await createAuditLog(request, {
      action: "team-members.updated",
      actor: user,
      websiteId: website.id,
      entityType: "team_member",
      entityId: row.id,
      summary: "Team member updated",
      metadata: { changedFields: Object.keys(body) }
    });
    return ok(reply, row, "team member updated");
  });

  app.delete(`/api/v1/websites/:websiteId/${base}/:teamMemberId`, async (request: Req, reply) => {
    const { user, website } = await getWebsiteForAccess(request);
    const existing = await prisma.teamMember.findFirst({
      where: { id: (request.params as any).teamMemberId, websiteId: website.id }
    });
    if (!existing) throw new AppError(404, "ITEM_NOT_FOUND", "Team member not found");
    await prisma.teamMember.delete({ where: { id: existing.id } });
    await createAuditLog(request, {
      action: "team-members.deleted",
      actor: user,
      websiteId: website.id,
      entityType: "team_member",
      entityId: existing.id,
      summary: "Team member deleted",
      metadata: { name: existing.name }
    });
    return ok(reply, true, "team member deleted");
  });
};

registerTimelineRoutes();
registerTeamMemberRoutes();
