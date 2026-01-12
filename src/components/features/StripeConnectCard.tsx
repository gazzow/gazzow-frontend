import { paymentService } from "@/services/user/payment-service";
import { IUser } from "@/types/user";
import axios from "axios";
import { CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type IStripeConnectCardProps = {
  user: IUser | null;
};

export default function StripeConnectCard({ user }: IStripeConnectCardProps) {
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);
  console.log("Onboarded status: ", isOnboarded);
  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const createConnectAccount = async () => {
    try {
      const res = await paymentService.createConnectAccount();
      if (res.success) {
        const res = await paymentService.generateOnboardingUrl();
        window.location.href = res.data.onboardingUrl;
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        console.log("Error connecting account: ", e.response?.data);
      }
    }
  };

  const checkOnboardingStatus = async () => {
    try {
      const res = await paymentService.checkOnboardingStatus();
      console.log("Onboarding status: ", res.data);
      if (res.success) {
        const { isOnboarded } = res.data;
        setIsOnboarded(isOnboarded || false);
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        console.log("Error checking onboarding status: ", e.response?.data);
      }
    }
  };

  const completeOnboarding = async () => {
    try {
      const res = await paymentService.generateOnboardingUrl();
      window.location.href = res.data.onboardingUrl;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        console.log("Error completing onboarding: ", e.response?.data);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl bg-secondary border border-border-primary rounded-xl p-6 space-y-5">
      {/* Header */}
      <div className="space-y-1 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <CreditCard />
            Stripe Connect
          </h2>
          <p className="text-sm text-neutral-400">
            Connect your Stripe account to receive payments for your
            contributions
          </p>
        </div>
        {user && user.stripeAccountId && isOnboarded ? (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs font-medium text-green-300 bg-green-500/10 px-2 py-1 rounded-full">
              Connected
            </span>
          </div>
        ) : !isOnboarded && user?.stripeAccountId ? (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-xs font-medium text-red-300 bg-red-500/10 px-2 py-1 rounded-full">
              Onboarding Pending
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-xs font-medium text-red-300 bg-red-500/10 px-2 py-1 rounded-full">
              Not Connected
            </span>
          </div>
        )}
      </div>

      {/* Content Row */}
      {!user?.stripeAccountId && (
        <div className="flex justify-between items-center gap-4">
          {/* Status + Label */}
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-white">
              Connect Stripe Account
            </h3>
            <span className="text-xs text-neutral-500">
              Connect your Stripe account to start receiving payments
            </span>
          </div>

          {/* Button */}
          <div>
            <button
              className="flex  gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all"
              onClick={createConnectAccount}
            >
              <CreditCard className="w-5 h-5" />
              Connect Stripe
            </button>
          </div>
        </div>
      )}

      {!isOnboarded && user?.stripeAccountId && (
        <div className="flex justify-between items-center gap-4">
          {/* Status + Label */}
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-white">
              Complete Stripe Onboarding
            </h3>
            <span className="text-xs text-neutral-500">
              Complete your Stripe onboarding to start receiving payments
            </span>
          </div>

          {/* Button */}
          <button
            className="flex  gap-2 bg-yellow-200 hover:bg-yellow-300 text-yellow-800 text-sm font-medium px-5 py-2.5 rounded-lg transition-all"
            onClick={completeOnboarding}
          >
            <CreditCard className="w-5 h-5" />
            Complete Onboarding
          </button>
        </div>
      )}
    </div>
  );
}
