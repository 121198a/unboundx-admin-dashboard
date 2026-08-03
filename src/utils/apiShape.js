/**
 * Backends disagree on how they wrap list data. This pulls the actual
 * array out of whatever envelope the API used, so pages never need to
 * know or care which shape the backend chose.
 *
 * Supports: { data: [] }, { success, data: [] }, { results: [] },
 * { items: [] }, or a bare array.
 */
export function extractList(payload) {
  if (!payload) return [];

  // Direct array
  if (Array.isArray(payload)) {
    return payload;
  }


  // YOUR BACKEND RESPONSE
  if (Array.isArray(payload.rows)) {
    return payload.rows;
  }


  // Other formats
  if (Array.isArray(payload.data)) {
    return payload.data;
  }


  if (Array.isArray(payload.results)) {
    return payload.results;
  }


  if (Array.isArray(payload.items)) {
    return payload.items;
  }


  // Nested data
  if (
    payload.data &&
    typeof payload.data === "object"
  ) {
    return extractList(payload.data);
  }


  return [];
}

/**
 * Normalizes whichever pagination fields the backend returned
 * (page/limit, per_page, offset/limit, meta.*, etc.) into one shape
 * the UI always consumes: { page, pageSize, total, totalPages }.
 */
export function extractPagination(payload, fallback = {}) {
  const meta = payload?.meta || payload?.pagination || {};

  const page =
    meta.page ??
    meta.current_page ??
    fallback.page ??
    1;

  const pageSize =
    meta.limit ??
    meta.per_page ??
    meta.pageSize ??
    fallback.pageSize ??
    10;

  // ✅ Your backend returns count
  const total =
    payload?.count ??
    meta.total ??
    meta.total_count ??
    meta.totalItems ??
    fallback.total ??
    0;

  const totalPages =
    meta.total_pages ??
    meta.totalPages ??
    Math.max(1, Math.ceil(total / pageSize));

  return {
    page: Number(page),
    pageSize: Number(pageSize),
    total: Number(total),
    totalPages: Number(totalPages),
  };
}

/** Builds request params covering the common pagination conventions at once. */
export function buildPaginationParams({ page, pageSize, search }) {
  const params = {
    page,
    size: pageSize, // confirmed convention used by development.unboundxinc.us
    limit: pageSize,
    per_page: pageSize,
    offset: (page - 1) * pageSize,
  };

  if (search?.trim()) {
    params.search = search.trim();
  }

  return params;
}
