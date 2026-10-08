"use client";

import { useState, type FormEvent } from "react";
import { STAFF_PRESENTATION_COPY } from "../../core/identity/staff-presentation-notice";

export type AuthNoticeState =
  | "signed_out"
  | "expired"
  | "unauthorized"
  | "locked"
  | "loading"
  | "offline_expired"
  | "remote_sign_out_unconfirmed"
  | "invalid_credentials"
  | "credentials_required"
  | "access_disabled"
  | "assignments_unavailable"
  | "provider_unavailable"
  | "offline_sign_in";

export type LoginCredentials = {
  readonly email: string;
  readonly password: string;
};

export type LoginScreenProps = {
  noticeState?: AuthNoticeState;
  busy?: boolean;
  errorMessage?: string;
  supportReference?: string;
  onSignIn?: (request: LoginCredentials) => void;
};

const NOTICES: Record<Exclude<AuthNoticeState, "signed_out" | "loading">, { tone: "warning" | "danger" | "info"; title: string; body: string }> = {
  expired: {
    tone: "warning",
    title: "Session ended.",
    body: `${STAFF_PRESENTATION_COPY.session_expired} Your local cart has been kept.`,
  },
  unauthorized: {
    tone: "danger",
    title: "Access denied.",
    body: "You don't have permission to sign in here.",
  },
  invalid_credentials: {
    tone: "danger",
    title: "Sign-in failed.",
    body: STAFF_PRESENTATION_COPY.invalid_credentials,
  },
  credentials_required: {
    tone: "warning",
    title: "Sign-in failed.",
    body: STAFF_PRESENTATION_COPY.credentials_required,
  },
  access_disabled: {
    tone: "danger",
    title: "POS access disabled.",
    body: STAFF_PRESENTATION_COPY.access_disabled,
  },
  assignments_unavailable: {
    tone: "warning",
    title: "Registers unavailable.",
    body: STAFF_PRESENTATION_COPY.assignments_unavailable,
  },
  provider_unavailable: {
    tone: "warning",
    title: "Sign-in unavailable.",
    body: STAFF_PRESENTATION_COPY.provider_unavailable,
  },
  offline_sign_in: {
    tone: "warning",
    title: "No internet connection.",
    body: STAFF_PRESENTATION_COPY.offline_sign_in,
  },
  locked: {
    tone: "info",
    title: "Register locked.",
    body: "Sign in to unlock the current shift.",
  },
  offline_expired: {
    tone: "warning",
    title: "Offline access expired.",
    body: "Sign in again when you are online. Your saved cart and transaction checks stay on this device.",
  },
  remote_sign_out_unconfirmed: {
    tone: "warning",
    title: "Signed out on this device.",
    body: "Remote sign-out could not be confirmed.",
  },
};

export function LoginScreen({
  noticeState = "signed_out",
  busy = false,
  errorMessage,
  supportReference,
  onSignIn,
}: LoginScreenProps) {
  const loading = busy || noticeState === "loading";
  const notice =
    noticeState === "expired" ||
    noticeState === "unauthorized" ||
    noticeState === "locked" ||
    noticeState === "offline_expired" ||
    noticeState === "remote_sign_out_unconfirmed" ||
    noticeState === "invalid_credentials" ||
    noticeState === "credentials_required" ||
    noticeState === "access_disabled" ||
    noticeState === "assignments_unavailable" ||
    noticeState === "provider_unavailable" ||
    noticeState === "offline_sign_in"
      ? NOTICES[noticeState]
      : null;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading || !onSignIn) return;
    onSignIn({ email, password });
  }

  return (
  <main className="auth-screen" id="main-content">
    <section className="auth-shell" aria-labelledby="login-title">
      <aside className="auth-brand-panel">
        <div className="auth-brand-top">
          <div className="auth-logo" aria-hidden="true">
            CT
          </div>

          <div>
            <div className="auth-brand-name">CETECH</div>
            <div className="auth-brand-product">Point of Sale</div>
          </div>
        </div>

        <div className="auth-brand-content">
          <span className="auth-brand-kicker">Retail workspace</span>

          <h2>
            Everything your counter needs,
            <span> in one focused workspace.</span>
          </h2>

          <p>
            Built for quick product lookup, customer service, checkout,
            receipts and daily register operations.
          </p>

          <div className="auth-benefits">
            <div className="auth-benefit">
              <span className="auth-benefit-icon">01</span>
              <div>
                <strong>Fast selling</strong>
                <small>Search, scan and build customer orders quickly.</small>
              </div>
            </div>

            <div className="auth-benefit">
              <span className="auth-benefit-icon">02</span>
              <div>
                <strong>Register aware</strong>
                <small>Your assigned register and shift stay connected to your session.</small>
              </div>
            </div>

            <div className="auth-benefit">
              <span className="auth-benefit-icon">03</span>
              <div>
                <strong>Resilient workflow</strong>
                <small>Saved work and recovery tools help protect unfinished transactions.</small>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-brand-footer">
          <span className="auth-brand-dot" />
          CETECH retail operations
        </div>
      </aside>

      <section className="card auth-card">
        <div className="auth-mobile-brand">
          <div className="auth-logo" aria-hidden="true">
            CT
          </div>
          <strong>CETECH POS</strong>
        </div>

        <div className="eyebrow">Staff sign-in</div>

        <h1 id="login-title">Welcome back</h1>

        <p className="subtle">
          Sign in with your staff account to access the point of sale.
        </p>

        {notice ? (
          <div className={`banner ${notice.tone}`} role="status">
            <div>
              <strong>{notice.title}</strong>
              <span> {notice.body}</span>
            </div>
          </div>
        ) : null}

        {supportReference ? (
          <p className="auth-reference muted" data-support-reference="">
            Support reference: {supportReference}
          </p>
        ) : null}

        {errorMessage ? (
          <div className="banner danger" role="alert">
            {errorMessage}
          </div>
        ) : null}

        <form className="auth-actions stack" onSubmit={handleSubmit}>
          <label className="field">
            <span>Email address</span>
            <input
              className="input"
              type="email"
              name="staff-email"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              inputMode="email"
              placeholder="you@cetech.com"
              value={email}
              disabled={loading}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <div className="field">
            <label htmlFor="staff-password">Password</label>

            <span className="auth-password-control">
              <input
                className="input"
                id="staff-password"
                type={passwordVisible ? "text" : "password"}
                name="staff-password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                disabled={loading}
                onChange={(event) => setPassword(event.target.value)}
              />

              <button
                className="auth-password-toggle"
                type="button"
                disabled={loading}
                aria-label={passwordVisible ? "Hide password" : "Show password"}
                aria-pressed={passwordVisible}
                onClick={() => setPasswordVisible((current) => !current)}
              >
                {passwordVisible ? "Hide" : "Show"}
              </button>
            </span>
          </div>

          <button
            className="btn primary block auth-submit"
            type="submit"
            disabled={loading || !onSignIn}
            aria-busy={loading}
          >
            {loading ? "Signing in…" : "Sign in to POS"}
          </button>
        </form>

        <div className="auth-form-footer">
          <span className="auth-secure-mark" aria-hidden="true">
            ✓
          </span>

          <p>
            Secure staff access
            <small>Scan → Sell → Pay → Print</small>
          </p>
        </div>
      </section>
    </section>
  </main>
);
}
