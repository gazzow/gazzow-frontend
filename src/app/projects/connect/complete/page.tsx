"use client";

export default function OnboardingCompletePage() {
  const redirectToDashboard = () => {
    window.location.href = "/projects";
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-neutral-100">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold">Onboarding Completed 🎉</h1>
        <p className="text-neutral-400 text-sm">
          Your payout account has been successfully configured.
        </p>
        <div>
          <button
            onClick={redirectToDashboard}
            className="bg-btn-primary text-xs px-2 py-1 rounded "
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
