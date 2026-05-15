const API_URL = `${import.meta.env.VITE_API_URL}`;

const getAuthHeaders = () => {
  const authData = JSON.parse(localStorage.getItem("user"));
  const token = authData?.data?.token;

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

// ── POST — create a new damage report (multipart/form-data for images) ────────
export async function createDamageReport({
  product_id,
  reported_by_id,
  ref_number,
  damage_type,
  severity,
  description,
  location,
  estimated_cost,
  witnesses,
  incident_date,
  image_1, // File object | null
  image_2, // File object | null
}) {
  try {
    const body = new FormData();

    body.append("product_id", product_id);
    body.append("reported_by", reported_by_id);
    body.append("ref_number", ref_number);
    body.append("damage_type", damage_type);
    body.append("severity", severity);
    body.append("description", description);
    body.append("incident_date", incident_date);

    if (location) body.append("location", location);
    if (estimated_cost) body.append("estimated_cost", estimated_cost);
    if (witnesses) body.append("witnesses", witnesses);
    if (image_1) body.append("image_1", image_1);
    if (image_2) body.append("image_2", image_2);

    // NOTE: Do NOT set Content-Type manually — browser sets multipart boundary automatically
    const headers = getAuthHeaders();
    delete headers["Content-Type"];

    const res = await fetch(`${API_URL}/api/damage`, {
      method: "POST",
      headers: getAuthHeaders(),
      headers,
      body,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to submit report: ${res.status}`);
    }

    return await res.json(); // { success, data }
  } catch (err) {
    console.error("createDamageReport error:", err);
    throw err;
  }
}

// ── GET — fetch all damage reports with optional filters ──────────────────────
export async function getAllDamageReports(filters = {}) {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    const qs = params.toString() ? `?${params}` : "";

    const res = await fetch(`${API_URL}/api/damage/${qs}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!res.ok) throw new Error(`Failed to fetch reports: ${res.status}`);
    return await res.json(); // { success, data, pagination }
  } catch (err) {
    console.error("getAllDamageReports error:", err);
    return null;
  }
}

// ── GET — fetch single user's damage report ─────────────────────────────────
export async function getMyDamageReports(filters = {}) {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    const qs = params.toString() ? `?${params}` : "";

    const res = await fetch(`${API_URL}/api/damage/my/reports${qs}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!res.ok) throw new Error(`Failed to fetch report: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("getMyDamageReports error:", err);
    return null;
  }
}

// ── PATCH — update report status ──────────────────────────────────────────────
export async function updateReportStatus(id, status) {
  try {
    const res = await fetch(`${API_URL}/api/damage/${id}/status`, {
      method: "PATCH",
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) throw new Error(`Failed to update status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("updateReportStatus error:", err);
    throw err;
  }
}

// ── DELETE ────────────────────────────────────────────────────────────────────
export async function deleteDamageReport(id) {
  try {
    const res = await fetch(`${API_URL}/api/damage/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!res.ok) throw new Error(`Failed to delete report: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("deleteDamageReport error:", err);
    throw err;
  }
}
