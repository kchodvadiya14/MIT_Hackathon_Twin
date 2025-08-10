import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import "./ui.css";
import HackathonScraper from "./components/HackathonScraper";
import AIDashboard from "./components/AIDashboard";
import Chatbot from "./components/Chatbot";
import UserProfile from "./components/UserProfile";


/**
 * Supabase setup (use Vite env vars or replace the strings directly)
 */
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://YOUR-PROJECT.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "YOUR-ANON-KEY";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/** Simple inline styles (no Tailwind) */
const styles = {
  page: { minHeight: "100vh", background: "#f6f7f9", color: "#0f172a", display: "flex", flexDirection: "column" },
  header: { position: "sticky", top: 0, zIndex: 10, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", borderBottom: "1px solid #e5e7eb" },
  headerRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", width: "min(100%, 1040px)", margin: "0 auto" },
  brand: { fontWeight: 700, fontSize: 18, textDecoration: "none", color: "inherit" },
  nav: { display: "flex", gap: 12, alignItems: "center" },
  btn: { borderRadius: 12, border: "1px solid #e5e7eb", padding: "8px 12px", background: "white", cursor: "pointer" },
  btnPrimary: { borderRadius: 12, border: "1px solid #111827", padding: "8px 12px", background: "#111827", color: "white", cursor: "pointer" },
  main: { flex: 1, width: "min(100%, 1040px)", margin: "0 auto", padding: 24 },
  card: { background: "white", border: "1px solid #e5e7eb", borderRadius: 16, boxShadow: "0 1px 2px rgba(0,0,0,0.03)", overflow: "hidden" },
  cardHeader: { padding: "12px 16px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between" },
  cardBody: { padding: 16, display: "grid", gap: 12 },
  h1: { fontSize: 24, fontWeight: 600, margin: 0 },
  h2: { fontSize: 16, fontWeight: 600, margin: 0 },
  textMuted: { color: "#64748b" },
  list: { paddingLeft: 18, margin: 0 },
  fieldRow: { display: "grid", gridTemplateColumns: "200px 1fr", gap: 12, alignItems: "center" },
  input: { border: "1px solid #e5e7eb", borderRadius: 12, padding: "10px 12px", outline: "none", width: "100%" },
  select: { border: "1px solid #e5e7eb", borderRadius: 12, padding: "10px 12px", outline: "none", width: "100%" },
  error: { color: "#dc2626", fontSize: 14 },
  info: { color: "#047857", fontSize: 14 },
  footer: { borderTop: "1px solid #e5e7eb", padding: 16, textAlign: "center", color: "#6b7280", fontSize: 12 },
  center: { minHeight: "40vh", display: "grid", placeItems: "center", color: "#6b7280" },
  row: { display: "flex", gap: 12 },
};

/** Auth Context */
const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;
      setUser(session?.user ?? null);
      setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => { mounted = false; sub?.subscription?.unsubscribe?.(); };
  }, []);

  const value = useMemo(() => ({ user, loading }), [user, loading]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

/** Layout */
function Shell({ children }) {
  const { user } = useAuth();
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerRow}>
          <Link to="/" style={styles.brand}>StubbornApp</Link>
          <nav style={styles.nav}>
            {user ? (
              <>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/scraper">🌐 Web Scraper</Link>
                <Link to="/ai">🤖 AI Tools</Link>
                <Link to="/profile">👤 Profile</Link>
                <Link to="/chatbot">💬 Help</Link>
                <button style={styles.btn} onClick={async () => { await supabase.auth.signOut(); }}>
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login"><button style={styles.btn}>Login</button></Link>
                <Link to="/signup"><button style={styles.btnPrimary}>Sign up</button></Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main style={styles.main}>{children}</main>
      <footer style={styles.footer}>Built with Supabase + React Router</footer>
      {user && <Chatbot />}
    </div>
  );
}

function Home() {
  return (
    <Shell>
      <div style={{ display: "grid", gap: 16 }}>
        <h1 style={styles.h1}>Welcome 👋</h1>
        <p style={styles.textMuted}>
          Email auth with <b>Supabase</b> + <b>role-based dashboards</b> (Student / Organizer).
          Sign up, pick a role, and you’ll be routed to the right dashboard.
        </p>
        <ul style={styles.list}>
          <li>✅ Email + Password sign up & login</li>
          <li>✅ Role saved in <code>user_metadata.role</code></li>
          <li>✅ Protected routes via React Router</li>
          <li>✅ Plain CSS (no Tailwind)</li>
          <li>✅ Web scraping for hackathon discovery</li>
          <li>✅ AI-powered project ideas and team matching</li>
          <li>✅ AI content generation for organizers</li>
          <li>✅ Interactive chatbot for help and guidance</li>
          <li>✅ User profile management with photo upload</li>
        </ul>
        <div style={styles.row}>
          <Link to="/signup"><button style={styles.btnPrimary}>Get started</button></Link>
          <Link to="/login"><button style={styles.btn}>I already have an account</button></Link>
        </div>
      </div>
    </Shell>
  );
}

/** Route Guards */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <FullSpinner label="Checking session" />;
  return user ? children : <Navigate to="/login" replace />;
}

function PublicOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <FullSpinner label="Loading" />;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

function FullSpinner({ label = "Loading" }) {
  return (
    <div style={styles.center}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ height: 24, width: 24, borderRadius: "999px", border: "2px solid #e5e7eb", borderTopColor: "transparent", display: "inline-block", animation: "spin 1s linear infinite" }} />
        {label}…
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0) } to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}

/** Auth Screens */
function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function doLogin(e) {
    e.preventDefault(); setBusy(true); setError("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) { setError(error.message); return; }
    const role = data.user?.user_metadata?.role;
    nav(role === "organizer" ? "/organizer" : "/student", { replace: true });
  }

  return (
    <Shell>
      <div style={{ ...styles.card, maxWidth: 520, margin: "0 auto" }}>
        <div style={styles.cardHeader}><h2 style={styles.h2}>Log in</h2></div>
        <div style={styles.cardBody}>
          <p style={styles.textMuted}>Welcome back. Enter your credentials.</p>
          <form onSubmit={doLogin} style={{ display: "grid", gap: 12 }}>
            <label>
              <div style={{ fontSize: 14 }}>Email</div>
              <input style={styles.input} type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </label>
            <label>
              <div style={{ fontSize: 14 }}>Password</div>
              <input style={styles.input} type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </label>
            {error && <p style={styles.error}>{error}</p>}
            <button disabled={busy} style={busy ? { ...styles.btnPrimary, opacity: 0.6 } : styles.btnPrimary}>
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p style={styles.textMuted}>No account? <Link to="/signup">Create one</Link></p>
          <p style={styles.textMuted}>
            <Link to="/reset">Forgot password?</Link>
          </p>
        </div>
      </div>
    </Shell>
  );
}

function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function handleSend(e) {
    e.preventDefault();
    setBusy(true); setMsg(""); setErr("");
    const redirectTo = `${window.location.origin}/update-password`; // user will land here to set a new password
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    setBusy(false);
    if (error) { setErr(error.message); return; }
    setMsg("If this email exists, a reset link has been sent. Please check your inbox.");
  }

  return (
    <Shell>
      <div style={{ ...styles.card, maxWidth: 520, margin: "0 auto" }}>
        <div style={styles.cardHeader}><h2 style={styles.h2}>Reset your password</h2></div>
        <div style={styles.cardBody}>
          <p style={styles.textMuted}>
            Enter your account email. We’ll send a secure link so you can set a new password.
          </p>
          <form onSubmit={handleSend} style={{ display: "grid", gap: 12 }}>
            <label>
              <div style={{ fontSize: 14 }}>Email</div>
              <input
                style={styles.input}
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </label>
            {err && <p style={styles.error}>{err}</p>}
            {msg && <p style={styles.info}>{msg}</p>}
            <button disabled={busy} style={busy ? { ...styles.btnPrimary, opacity: 0.6 } : styles.btnPrimary}>
              {busy ? "Sending…" : "Send reset link"}
            </button>
          </form>
          <p style={styles.textMuted}>&larr; <Link to="/login">Back to login</Link></p>
        </div>
      </div>
    </Shell>
  );
}

function UpdatePasswordPage() {
  const nav = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  async function handleUpdate(e) {
    e.preventDefault();
    setErr(""); setMsg("");
    if (password.length < 8) {
      setErr("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setErr("Passwords do not match.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) { setErr(error.message); return; }
    setMsg("Password updated. You can now log in with your new password.");
    setTimeout(() => nav("/login", { replace: true }), 1200);
  }

  return (
    <Shell>
      <div style={{ ...styles.card, maxWidth: 520, margin: "0 auto" }}>
        <div style={styles.cardHeader}><h2 style={styles.h2}>Set a new password</h2></div>
        <div style={styles.cardBody}>
          <p style={styles.textMuted}>
            Enter your new password below. This page works after you click the reset link from your email.
          </p>
          <form onSubmit={handleUpdate} style={{ display: "grid", gap: 12 }}>
            <label>
              <div style={{ fontSize: 14 }}>New password</div>
              <input
                style={styles.input}
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </label>
            <label>
              <div style={{ fontSize: 14 }}>Confirm new password</div>
              <input
                style={styles.input}
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
              />
            </label>
            {err && <p style={styles.error}>{err}</p>}
            {msg && <p style={styles.info}>{msg}</p>}
            <button disabled={busy} style={busy ? { ...styles.btnPrimary, opacity: 0.6 } : styles.btnPrimary}>
              {busy ? "Updating…" : "Update password"}
            </button>
          </form>
          <p style={styles.textMuted}>&larr; <Link to="/login">Back to login</Link></p>
        </div>
      </div>
    </Shell>
  );
}


function SignupPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  async function doSignup(e) {
    e.preventDefault(); setBusy(true); setError(""); setInfo("");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role } },
    });
    setBusy(false);
    if (error) { setError(error.message); return; }

    // If identity exists, email already registered
    if (data?.user?.identities?.length === 0) {
      setError("Email already registered. Try logging in.");
      return;
    }

    setInfo("Check your inbox to confirm your email. After confirming, return here to log in.");
    // If confirmations are disabled, session exists and we can route immediately
    if (data?.session) {
      nav(role === "organizer" ? "/organizer" : "/student", { replace: true });
    }
  }

  return (
    <Shell>
      <div style={{ ...styles.card, maxWidth: 520, margin: "0 auto" }}>
        <div style={styles.cardHeader}><h2 style={styles.h2}>Create account</h2></div>
        <div style={styles.cardBody}>
          <p style={styles.textMuted}>Pick your role to get the right dashboard.</p>
          <form onSubmit={doSignup} style={{ display: "grid", gap: 12 }}>
            <label>
              <div style={{ fontSize: 14 }}>Email</div>
              <input style={styles.input} type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </label>
            <label>
              <div style={{ fontSize: 14 }}>Password</div>
              <input style={styles.input} type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </label>
            <label>
              <div style={{ fontSize: 14 }}>Role</div>
              <select style={styles.select} value={role} onChange={e => setRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="organizer">Organizer</option>
              </select>
            </label>
            {error && <p style={styles.error}>{error}</p>}
            {info && <p style={styles.info}>{info}</p>}
            <button disabled={busy} style={busy ? { ...styles.btnPrimary, opacity: 0.6 } : styles.btnPrimary}>
              {busy ? "Creating…" : "Sign up"}
            </button>
          </form>
          <p style={styles.textMuted}>Already have an account? <Link to="/login">Log in</Link></p>
        </div>
      </div>
    </Shell>
  );
}

/** Dashboards */
function DashboardRouter() {
  const { user } = useAuth();
  const role = user?.user_metadata?.role || "student";
  return role === "organizer" ? <Navigate to="/organizer" replace /> : <Navigate to="/student" replace />;
}

// ======== Student Dashboard (replace your old StudentDashboard) ========
function StudentDashboard() {
  const { user } = useAuth();
  return (
    <Shell>
      <div style={{ display: "grid", gap: 16 }}>
        <h1 style={styles.h1}>🎓 Student Dashboard</h1>

        <Card title="Hello!">
          <Field label="Email" value={user?.email} />
          <Field label="Role" value={user?.user_metadata?.role ?? "student"} />
          <Field label="User ID" value={user?.id} />
        </Card>

        <HackathonSections />
        <TeamFinder />
        <MeetingFeed />
      </div>
    </Shell>
  );
}

// ======== Hackathons (Ongoing & Upcoming) ========
function HackathonSections() {
  const [upcoming, setUpcoming] = useState([]);
  const [ongoing, setOngoing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true); setErr("");
      const nowIso = new Date().toISOString();

      const { data: live, error: e1 } = await supabase
        .from("hackathons")
        .select("*")
        .lte("starts_at", nowIso)
        .gt("ends_at", nowIso)
        .order("starts_at", { ascending: false });

      const { data: upc, error: e2 } = await supabase
        .from("hackathons")
        .select("*")
        .gt("starts_at", nowIso)
        .order("starts_at", { ascending: true });

      if (!ignore) {
        if (e1 || e2) setErr(e1?.message || e2?.message || "Failed to load hackathons");
        setOngoing(live || []);
        setUpcoming(upc || []);
        setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  if (loading) return <FullSpinner label="Loading hackathons" />;
  if (err) return <Card title="Hackathons"><p style={styles.error}>{err}</p></Card>;

  return (
    <>
      <Card title="🚀 Ongoing Hackathons">
        {ongoing.length === 0 ? (
          <p style={styles.textMuted}>No hackathons are live right now.</p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {ongoing.map(h => <HackathonItem key={h.id} h={h} />)}
          </div>
        )}
      </Card>

      <Card title="⏳ Upcoming Hackathons">
        {upcoming.length === 0 ? (
          <p style={styles.textMuted}>No upcoming hackathons yet. Check back soon!</p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {upcoming.map(h => <HackathonItem key={h.id} h={h} />)}
          </div>
        )}
      </Card>
    </>
  );
}

function HackathonItem({ h }) {
  return (
    <section style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
        <div style={{ fontWeight: 600 }}>{h.title}</div>
        <div style={{ fontSize: 12, color: "#64748b" }}>
          {formatDate(h.starts_at)} → {formatDate(h.ends_at)}
        </div>
      </div>
      {h.description && <p style={{ marginTop: 6 }}>{h.description}</p>}
    </section>
  );
}

function formatDate(iso) {
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
}

// ======== Find a Teammate ========
function TeamFinder() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [headline, setHeadline] = useState("");
  const [skills, setSkills] = useState("");
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true); setErr("");
      const { data, error } = await supabase
        .from("team_requests")
        .select("*")
        .eq("is_open", true)
        .order("created_at", { ascending: false });
      if (!ignore) {
        if (error) setErr(error.message);
        setList(data || []);
        setLoading(false);
      }
    })();

    const channel = supabase
      .channel("team_requests_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "team_requests" }, () => refresh())
      .subscribe();

    async function refresh() {
      const { data } = await supabase
        .from("team_requests")
        .select("*")
        .eq("is_open", true)
        .order("created_at", { ascending: false });
      setList(data || []);
    }

    return () => { supabase.removeChannel(channel); ignore = true; };
  }, []);

  async function submitRequest(e) {
    e.preventDefault();
    setBusy(true); setErr("");
    const { error } = await supabase.from("team_requests").insert({
      user_id: user?.id, headline, skills, details, is_open: true
    });
    setBusy(false);
    if (error) { setErr(error.message); return; }
    setHeadline(""); setSkills(""); setDetails("");
  }

  async function closeMyRequest(id) {
    await supabase.from("team_requests").update({ is_open: false }).eq("id", id).eq("user_id", user?.id);
  }

  if (loading) return <FullSpinner label="Loading teammate board" />;

  return (
    <Card title="🤝 Find a Teammate">
      <p style={styles.textMuted}>Post your skills and browse others looking for teammates.</p>

      <form onSubmit={submitRequest} style={{ display: "grid", gap: 12, marginTop: 8 }}>
        <label>
          <div style={{ fontSize: 14 }}>Headline</div>
          <input style={styles.input} value={headline} onChange={e => setHeadline(e.target.value)} placeholder="Frontend dev seeks team" required />
        </label>
        <label>
          <div style={{ fontSize: 14 }}>Skills</div>
          <input style={styles.input} value={skills} onChange={e => setSkills(e.target.value)} placeholder="React, Python, LLMs" />
        </label>
        <label>
          <div style={{ fontSize: 14 }}>Details</div>
          <textarea style={{ ...styles.input, minHeight: 80 }} value={details} onChange={e => setDetails(e.target.value)} placeholder="I can take frontend and auth. Available evenings." />
        </label>
        {err && <p style={styles.error}>{err}</p>}
        <div style={{ display: "flex", gap: 8 }}>
          <button disabled={busy} style={busy ? { ...styles.btnPrimary, opacity: 0.6 } : styles.btnPrimary}>
            {busy ? "Posting…" : "Post request"}
          </button>
        </div>
      </form>

      <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
        {list.length === 0 ? (
          <p style={styles.textMuted}>No open requests yet. Be the first!</p>
        ) : list.map(item => (
          <div key={item.id} style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div style={{ fontWeight: 600 }}>{item.headline}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>{new Date(item.created_at).toLocaleString()}</div>
            </div>
            {item.skills && <div style={{ marginTop: 4 }}><b>Skills:</b> {item.skills}</div>}
            {item.details && <p style={{ marginTop: 4 }}>{item.details}</p>}
            {item.user_id === user?.id && item.is_open && (
              <div style={{ marginTop: 6 }}>
                <button style={styles.btn} onClick={() => closeMyRequest(item.id)}>Mark as closed</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

// ======== Announcements / Meeting links ========
function MeetingFeed() {
  const [list, setList] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true); setErr("");
      const { data, error } = await supabase
        .from("meetings")
        .select("*, hackathons(title)")
        .order("created_at", { ascending: false })
        .limit(25);
      if (!ignore) {
        if (error) setErr(error.message);
        setList(data || []);
        setLoading(false);
      }
    })();

    const channel = supabase
      .channel("meetings_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "meetings" }, () => refresh())
      .subscribe();

    async function refresh() {
      const { data } = await supabase
        .from("meetings")
        .select("*, hackathons(title)")
        .order("created_at", { ascending: false })
        .limit(25);
      setList(data || []);
    }

    return () => { supabase.removeChannel(channel); ignore = true; };
  }, []);

  if (loading) return <FullSpinner label="Loading announcements" />;
  if (err) return <Card title="📣 Announcements & Meeting Links"><p style={styles.error}>{err}</p></Card>;

  return (
    <Card title="📣 Announcements & Meeting Links">
      {list.length === 0 ? (
        <p style={styles.textMuted}>No announcements yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {list.map(m => (
            <div key={m.id} style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{m.title}</div>
                  {m.hackathons?.title && (
                    <div style={{ fontSize: 12, color: "#64748b" }}>for: {m.hackathons.title}</div>
                  )}
                </div>
                <div style={{ fontSize: 12, color: "#64748b" }}>{new Date(m.created_at).toLocaleString()}</div>
              </div>
              {m.note && <p style={{ marginTop: 6 }}>{m.note}</p>}
              {m.link && (
                <div style={{ marginTop: 6 }}>
                  <a href={m.link} target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>
                    Join meeting
                  </a>
                  {m.starts_at && (
                    <span style={{ marginLeft: 8, color: "#64748b", fontSize: 12 }}>
                      (starts {new Date(m.starts_at).toLocaleString()})
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

// ================= ORGANIZER DASHBOARD (styled) =================
function OrganizerDashboard() {
  const { user } = useAuth();
  return (
    <Shell>
      <div className="page">
        <div className="card">
          <div className="card-h">
            <div className="row">
              <span className="pill">Organizer</span>
              <div className="card-title">Your profile</div>
            </div>
          </div>
          <div className="card-b">
            <div className="row" style={{ gap: 20, flexWrap: 'wrap' }}>
              <div><span className="kbd">Email</span>&nbsp; {user?.email}</div>
              <div><span className="kbd">User ID</span>&nbsp; <span className="small">{user?.id}</span></div>
            </div>
            <div className="muted small">Tip: Create a hackathon, then broadcast a meeting link — students will see it instantly.</div>
          </div>
        </div>

        <CreateHackathonForm />
        <MyHackathons />
        <CreateMeetingForm />
        <MyMeetings />
      </div>
    </Shell>
  );
}

// -------- date helpers ----------
function toLocalInputValue(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function toISOFromLocal(localStr) { return localStr ? new Date(localStr).toISOString() : null; }
function statusOf(h) {
  const now = Date.now();
  const s = new Date(h.starts_at).getTime();
  const e = new Date(h.ends_at).getTime();
  if (now < s) return "upcoming";
  if (now >= s && now < e) return "live";
  return "past";
}

// -------- Create Hackathon ----------
function CreateHackathonForm() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr(""); setMsg("");
    if (!title || !start || !end) { setErr("Title, start and end are required."); return; }
    const starts_at = toISOFromLocal(start);
    const ends_at = toISOFromLocal(end);
    setBusy(true);
    const { error } = await supabase.from("hackathons").insert({ title, description: desc, starts_at, ends_at });
    setBusy(false);
    if (error) { setErr(error.message); return; }
    setMsg("Hackathon created.");
    setTitle(""); setDesc(""); setStart(""); setEnd("");
    window.dispatchEvent(new CustomEvent("org:refresh-hacks"));
  }

  return (
    <div className="card">
      <div className="card-h"><div className="card-title">Create Hackathon</div></div>
      <div className="card-b">
        <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
          <label>
            <div className="small muted">Title</div>
            <input className="input" value={title} onChange={e=>setTitle(e.target.value)} required />
          </label>
          <label>
            <div className="small muted">Description</div>
            <textarea className="textarea" value={desc} onChange={e=>setDesc(e.target.value)} />
          </label>
          <div className="grid-2">
            <label>
              <div className="small muted">Starts at</div>
              <input type="datetime-local" className="input" value={start} onChange={e=>setStart(e.target.value)} required />
            </label>
            <label>
              <div className="small muted">Ends at</div>
              <input type="datetime-local" className="input" value={end} onChange={e=>setEnd(e.target.value)} required />
            </label>
          </div>
          {err && <div className="small" style={{ color: "var(--danger)" }}>{err}</div>}
          {msg && <div className="small" style={{ color: "var(--ok)" }}>{msg}</div>}
          <div className="row">
            <button disabled={busy} className={`btn btn-primary`}>{busy ? "Creating…" : "Create"}</button>
            <span className="muted small">⌘/Ctrl + Enter to submit</span>
          </div>
        </form>
      </div>
    </div>
  );
}

// -------- List / Edit / Delete own hackathons ----------
function MyHackathons() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true); setErr("");
      const { data, error } = await supabase.from("hackathons").select("*").eq("created_by", user?.id).order("starts_at", { ascending: false });
      if (!ignore) {
        if (error) setErr(error.message);
        setRows(data || []);
        setLoading(false);
      }
    }
    load();

    function onRefresh(){ load(); }
    window.addEventListener("org:refresh-hacks", onRefresh);
    const channel = supabase
      .channel("hackathons_own_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "hackathons", filter: `created_by=eq.${user?.id}` }, () => load())
      .subscribe();
    return () => { window.removeEventListener("org:refresh-hacks", onRefresh); supabase.removeChannel(channel); ignore = true; };
  }, [user?.id]);

  if (loading) return <FullSpinner label="Loading your hackathons" />;

  return (
    <div className="card">
      <div className="card-h"><div className="card-title">Your Hackathons</div></div>
      <div className="card-b">
        {err && <div className="small" style={{ color: "var(--danger)" }}>{err}</div>}
        {rows.length === 0 ? (
          <div className="muted">You haven’t created any hackathons yet.</div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {rows.map(h => <HackathonEditor key={h.id} row={h} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function HackathonEditor({ row }) {
  const [title, setTitle] = useState(row.title || "");
  const [desc, setDesc] = useState(row.description || "");
  const [start, setStart] = useState(toLocalInputValue(row.starts_at));
  const [end, setEnd] = useState(toLocalInputValue(row.ends_at));
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const badge = statusOf(row);

  async function save() {
    setErr(""); setMsg("");
    const starts_at = toISOFromLocal(start);
    const ends_at = toISOFromLocal(end);
    if (!title || !starts_at || !ends_at) { setErr("Title, start and end required."); return; }
    setSaving(true);
    const { error } = await supabase.from("hackathons").update({ title, description: desc, starts_at, ends_at }).eq("id", row.id);
    setSaving(false);
    if (error) { setErr(error.message); return; }
    setMsg("Saved.");
  }

  async function remove() {
    if (!confirm("Delete this hackathon?")) return;
    const { error } = await supabase.from("hackathons").delete().eq("id", row.id);
    if (error) { alert(error.message); return; }
    window.dispatchEvent(new CustomEvent("org:refresh-hacks"));
  }

  return (
    <div className="item">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "baseline" }}>
        <div className="row" style={{ gap: 10 }}>
          <span className={`pill ${badge}`}>{badge === "live" ? "Live" : badge === "upcoming" ? "Upcoming" : "Past"}</span>
          <div style={{ fontWeight: 700 }}>{row.title}</div>
        </div>
        <div className="muted small">{new Date(row.created_at).toLocaleString()}</div>
      </div>
      <hr className="sep"/>
      <div className="grid-2" style={{ marginTop: 10 }}>
        <label>
          <div className="small muted">Title</div>
          <input className="input" value={title} onChange={e=>setTitle(e.target.value)} />
        </label>
        <label>
          <div className="small muted">Starts</div>
          <input className="input" type="datetime-local" value={start} onChange={e=>setStart(e.target.value)} />
        </label>
        <label className="grid-span-2">
          <div className="small muted">Description</div>
          <textarea className="textarea" value={desc} onChange={e=>setDesc(e.target.value)} />
        </label>
        <label>
          <div className="small muted">Ends</div>
          <input className="input" type="datetime-local" value={end} onChange={e=>setEnd(e.target.value)} />
        </label>
      </div>
      {err && <div className="small" style={{ color: "var(--danger)" }}>{err}</div>}
      {msg && <div className="small" style={{ color: "var(--ok)" }}>{msg}</div>}
      <div className="row" style={{ marginTop: 8 }}>
        <button onClick={save} disabled={saving} className="btn btn-primary">{saving ? "Saving…" : "Save"}</button>
        <button onClick={remove} className="btn btn-danger">Delete</button>
      </div>
    </div>
  );
}

// -------- Create Meeting ----------
function CreateMeetingForm() {
  const { user } = useAuth();
  const [hacks, setHacks] = useState([]);
  const [hackathonId, setHackathonId] = useState("");
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [starts, setStarts] = useState("");
  const [note, setNote] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let ignore=false;
    (async () => {
      const { data } = await supabase.from("hackathons").select("id,title").eq("created_by", user?.id).order("starts_at", { ascending:false });
      if (!ignore) setHacks(data || []);
    })();
    return ()=>{ignore=true};
  }, [user?.id]);

  async function submit(e){
    e.preventDefault();
    setErr(""); setMsg("");
    if (!title){ setErr("Title is required."); return; }
    const starts_at = starts ? toISOFromLocal(starts) : null;
    setBusy(true);
    const { error } = await supabase.from("meetings").insert({
      hackathon_id: hackathonId || null, title, link: link || null, starts_at, note: note || null
    });
    setBusy(false);
    if (error){ setErr(error.message); return; }
    setMsg("Announcement/meeting created.");
    setHackathonId(""); setTitle(""); setLink(""); setStarts(""); setNote("");
    window.dispatchEvent(new CustomEvent("org:refresh-meetings"));
  }

  return (
    <div className="card">
      <div className="card-h"><div className="card-title">Create Announcement / Meeting</div></div>
      <div className="card-b">
        <form onSubmit={submit} style={{ display:"grid", gap:12 }}>
          <label>
            <div className="small muted">Title</div>
            <input className="input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Kickoff Call" required />
          </label>
          <div className="grid-2">
            <label>
              <div className="small muted">Hackathon (optional)</div>
              <select className="select" value={hackathonId} onChange={e=>setHackathonId(e.target.value)}>
                <option value="">— None —</option>
                {hacks.map(h => <option key={h.id} value={h.id}>{h.title}</option>)}
              </select>
            </label>
            <label>
              <div className="small muted">Starts at (optional)</div>
              <input className="input" type="datetime-local" value={starts} onChange={e=>setStarts(e.target.value)} />
            </label>
          </div>
          <label>
            <div className="small muted">Meeting link (optional)</div>
            <input className="input" value={link} onChange={e=>setLink(e.target.value)} placeholder="https://meet.google.com/abc-defg-hij" />
          </label>
          <label>
            <div className="small muted">Note (optional)</div>
            <textarea className="textarea" value={note} onChange={e=>setNote(e.target.value)} placeholder="Welcome everyone! Recording will be shared." />
          </label>
          {err && <div className="small" style={{ color:"var(--danger)" }}>{err}</div>}
          {msg && <div className="small" style={{ color:"var(--ok)" }}>{msg}</div>}
          <div className="row">
            <button disabled={busy} className="btn btn-primary">{busy ? "Sending…" : "Create"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// -------- My Meetings ----------
function MyMeetings() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore=false;
    async function load(){
      setLoading(true); setErr("");
      const { data, error } = await supabase.from("meetings").select("*, hackathons(title)").eq("created_by", user?.id).order("created_at", { ascending:false }).limit(50);
      if(!ignore){
        if (error) setErr(error.message);
        setList(data || []);
        setLoading(false);
      }
    }
    load();
    function onRefresh(){ load(); }
    window.addEventListener("org:refresh-meetings", onRefresh);
    const channel = supabase
      .channel("meetings_own_changes")
      .on("postgres_changes", { event:"*", schema:"public", table:"meetings", filter:`created_by=eq.${user?.id}`}, () => load())
      .subscribe();
    return ()=>{ window.removeEventListener("org:refresh-meetings", onRefresh); supabase.removeChannel(channel); ignore=true; };
  }, [user?.id]);

  async function del(id){
    if(!confirm("Delete this announcement?")) return;
    const { error } = await supabase.from("meetings").delete().eq("id", id);
    if (error) alert(error.message);
  }

  if (loading) return <FullSpinner label="Loading your announcements" />;

  return (
    <div className="card">
      <div className="card-h"><div className="card-title">Your Announcements / Meetings</div></div>
      <div className="card-b">
        {err && <div className="small" style={{ color:"var(--danger)" }}>{err}</div>}
        {list.length === 0 ? (
          <div className="muted">No announcements yet.</div>
        ) : (
          <div style={{ display:"grid", gap:10 }}>
            {list.map(m => (
              <div key={m.id} className="item">
                <div className="row" style={{ justifyContent:"space-between" }}>
                  <div className="row" style={{ gap:10 }}>
                    <div style={{ fontWeight:700 }}>{m.title}</div>
                    {m.hackathons?.title && <span className="pill">for: {m.hackathons.title}</span>}
                  </div>
                  <div className="muted small">{new Date(m.created_at).toLocaleString()}</div>
                </div>
                {m.starts_at && <div className="small muted" style={{ marginTop:6 }}>starts {new Date(m.starts_at).toLocaleString()}</div>}
                {m.note && <p style={{ marginTop:6 }}>{m.note}</p>}
                {m.link && <div className="small" style={{ marginTop:6 }}><a href={m.link} target="_blank" rel="noreferrer">Open link</a></div>}
                <div className="row" style={{ marginTop:8 }}>
                  <button onClick={() => del(m.id)} className="btn btn-danger">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


function Card({ title, children }) {
  return (
    <section style={styles.card}>
      <div style={styles.cardHeader}><h2 style={styles.h2}>{title}</h2></div>
      <div style={styles.cardBody}>{children}</div>
    </section>
  );
}

function Field({ label, value }) {
  return (
    <div style={styles.fieldRow}>
      <div style={{ fontSize: 14, color: "#64748b" }}>{label}</div>
      <div style={{ wordBreak: "break-word" }}>{value || "—"}</div>
    </div>
  );
}

/** App Root */
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/reset" element={<PublicOnly><ResetPasswordPage /></PublicOnly>} />
          <Route path="/update-password" element={<PublicOnly><UpdatePasswordPage /></PublicOnly>} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<PublicOnly><LoginPage /></PublicOnly>} />
          <Route path="/signup" element={<PublicOnly><SignupPage /></PublicOnly>} />

          <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
          <Route path="/student" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
          <Route path="/organizer" element={<ProtectedRoute><OrganizerDashboard /></ProtectedRoute>} />
          <Route path="/scraper" element={<ProtectedRoute><Shell><HackathonScraper /></Shell></ProtectedRoute>} />
          <Route path="/ai" element={<ProtectedRoute><Shell><AIDashboard /></Shell></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Shell><UserProfile /></Shell></ProtectedRoute>} />
          <Route path="/chatbot" element={<ProtectedRoute><Shell><div style={{ padding: '20px', textAlign: 'center' }}><h1>💬 Chatbot</h1><p>Use the chat button in the bottom right corner to get help!</p></div></Shell></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
