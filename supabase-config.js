// Public Supabase URL + anon key (safe to ship in the browser).
// Filled after the Little Explorer project is created.
window.LEW_DB = (function () {
  const URL = "https://bgzafcsgjtkkmkemnmny.supabase.co";
  const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnemFmY3NnanRra21rZW1ubW55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3ODg4NjUsImV4cCI6MjEwMzM2NDg2NX0.2CAeoZsbF89QTc8O1BJqNg4IO8s7z7E4I54VRMOGCyk";

  function client() {
    if (!URL || !ANON_KEY || !window.supabase || !window.supabase.createClient) return null;
    if (!client._c) client._c = window.supabase.createClient(URL, ANON_KEY);
    return client._c;
  }

  async function getProfile(email) {
    const c = client();
    if (!c) return null;
    const { data, error } = await c.rpc("get_explorer_profile", { p_email: String(email || "").trim().toLowerCase() });
    if (error) throw error;
    return data || null;
  }

  async function upsertProfile(row) {
    const c = client();
    if (!c) return null;
    const { data, error } = await c.rpc("upsert_explorer_profile", { p_row: row });
    if (error) throw error;
    return data || null;
  }

  async function deleteProfile(email) {
    const c = client();
    if (!c) return false;
    const { data, error } = await c.rpc("delete_explorer_profile", {
      p_email: String(email || "").trim().toLowerCase()
    });
    if (error) throw error;
    return !!data;
  }

  return {
    enabled: function () { return !!(URL && ANON_KEY); },
    getProfile,
    upsertProfile,
    deleteProfile
  };
})();
