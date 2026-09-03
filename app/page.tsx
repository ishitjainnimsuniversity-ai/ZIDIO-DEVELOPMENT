export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="flex items-center justify-between px-6 py-5 md:px-12">
        <h1 className="text-2xl font-bold tracking-tight">
          LOOP<span className="text-blue-400">.</span>
        </h1>

        <div className="flex items-center gap-4">
          <a
            href="/login"
            className="text-sm text-slate-300 hover:text-white"
          >
            Log in
          </a>
          <a
            href="/signup"
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium hover:bg-blue-600"
          >
            Get Started
          </a>
        </div>
      </nav>

      <section className="mx-auto flex max-w-5xl flex-col items-center px-6 py-24 text-center">
        <p className="mb-5 rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300">
          AI-Powered Customer Feedback Intelligence
        </p>

        <h2 className="max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">
          Close the loop on
          <span className="text-blue-400"> customer feedback.</span>
        </h2>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
          Turn scattered customer feedback into meaningful themes, trends,
          insights, and evidence-backed decisions.
        </p>

        <div className="mt-10 flex gap-4">
          <a
            href="/signup"
            className="rounded-lg bg-blue-500 px-6 py-3 font-medium hover:bg-blue-600"
          >
            Start Exploring
          </a>

          <a
            href="#features"
            className="rounded-lg border border-slate-700 px-6 py-3 font-medium text-slate-200 hover:bg-slate-900"
          >
            Learn More
          </a>
        </div>
      </section>

      <section
        id="features"
        className="mx-auto grid max-w-5xl gap-5 px-6 pb-20 md:grid-cols-3"
      >
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-lg font-semibold">Understand Feedback</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Collect and organize customer feedback from multiple channels.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-lg font-semibold">Discover Trends</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Identify important themes and understand what is changing over time.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-lg font-semibold">Ask LOOP</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Ask questions in plain English and get answers based on real feedback.
          </p>
        </div>
      </section>
    </main>
  );
}