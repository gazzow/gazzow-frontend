import { paymentService } from "@/services/user/payment-service";
import { IUser } from "@/types/user";
import axios from "axios";
import { CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import { StatusBadge } from "../ui/StatusBadge";

type IStripeConnectCardProps = {
  user: IUser | null;
};

export default function StripeConnectCard({ user }: IStripeConnectCardProps) {
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isCompleting, setIsCompleting] = useState<boolean>(false);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      setIsChecking(true);
      const res = await paymentService.checkOnboardingStatus();
      if (res.success) {
        setIsOnboarded(res.data.isOnboarded || false);
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        console.log("Error checking onboarding status:", e.response?.data);
      }
    } finally {
      setIsChecking(false);
    }
  };

  const createConnectAccount = async () => {
    try {
      setIsConnecting(true);
      const res = await paymentService.createConnectAccount();
      if (res.success) {
        const urlRes = await paymentService.generateOnboardingUrl();
        window.location.href = urlRes.data.onboardingUrl;
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        console.log("Error connecting account:", e.response?.data);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const completeOnboarding = async () => {
    try {
      setIsCompleting(true);
      const res = await paymentService.generateOnboardingUrl();
      window.location.href = res.data.onboardingUrl;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        console.log("Error completing onboarding:", e.response?.data);
      }
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white dark:bg-secondary/60 border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-5 transition-colors">
      {/* Show global checking state */}
      {isChecking ? (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Checking Stripe connection status...
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="space-y-1 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <CreditCard />
                Stripe Connect
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Connect your Stripe account to receive payments
              </p>
            </div>

            {/* Status Badge */}
            {user?.stripeAccountId && isOnboarded ? (
              <StatusBadge color="green" text="Connected" />
            ) : user?.stripeAccountId ? (
              <StatusBadge color="red" text="Onboarding Pending" />
            ) : (
              <StatusBadge color="red" text="Not Connected" />
            )}
          </div>

          {/* Connect Button */}
          {!user?.stripeAccountId && (
            <button
              disabled={isConnecting}
              onClick={createConnectAccount}
              className="flex gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all"
            >
              <CreditCard className="w-5 h-5" />
              {isConnecting ? "Connecting..." : "Connect Stripe"}
            </button>
          )}

          {/* Complete Onboarding */}
          {!isOnboarded && user?.stripeAccountId && (
            <button
              disabled={isCompleting}
              onClick={completeOnboarding}
              className="flex gap-2 bg-yellow-200 hover:bg-yellow-300 disabled:opacity-50 text-yellow-800 text-sm font-medium px-5 py-2.5 rounded-lg transition-all"
            >
              <CreditCard className="w-5 h-5" />
              {isCompleting ? "Redirecting..." : "Complete Onboarding"}
            </button>
          )}
        </>
      )}
    </div>
  );
}
