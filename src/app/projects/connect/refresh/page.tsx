"use client";

export default function OnboardingRefreshPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-100">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold">Onboarding Incomplete</h1>
        <p className="text-neutral-400 text-sm">
          Looks like you didn’t complete the onboarding process.
        </p>

        <a
          href="/creator/onboard"
          className="inline-block px-4 py-2 bg-neutral-800 rounded-lg text-sm hover:bg-neutral-700"
        >
          Retry Onboarding
        </a>
      </div>
    </div>
  );
}
