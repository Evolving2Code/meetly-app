export function AppInstallSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Mobile app
            </p>
            <h2 className="section-heading mt-3">Take Meetly with you</h2>
            <p className="section-subheading">
              Install Meetly on your phone for one-tap access to your dashboard, booking links,
              and availability — no App Store download required.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-navy">
              <li className="flex gap-3">
                <span className="text-primary">✓</span>
                Android & desktop Chrome: tap <strong>Install app</strong> when prompted
              </li>
              <li className="flex gap-3">
                <span className="text-primary">✓</span>
                iPhone: Safari → Share → Add to Home Screen
              </li>
              <li className="flex gap-3">
                <span className="text-primary">✓</span>
                Opens full-screen like a native app
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-primary/15 bg-gradient-to-br from-primary-light to-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-lg font-black text-white shadow-md">
                M
              </div>
              <div>
                <p className="text-lg font-bold text-navy">Meetly for mobile</p>
                <p className="text-sm text-muted">Free · No app store · Works offline shell</p>
              </div>
            </div>
            <div className="mt-6 space-y-4 rounded-2xl border border-border bg-white p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Android / Chrome
                </p>
                <p className="mt-1 text-sm text-muted">
                  Look for the install banner at the top of this page, or use your browser menu →
                  Install app.
                </p>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  iPhone / iPad
                </p>
                <p className="mt-1 text-sm text-muted">
                  In Safari, tap Share <span aria-hidden="true">↑</span> then Add to Home Screen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
