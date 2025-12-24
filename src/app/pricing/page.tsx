"use client";

import { PlanDuration, PlanType } from "@/types/plan";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { IPlan } from "@/types/plan";
import { subscriptionService } from "@/services/user/subscription.service";
import { toast } from "react-toastify";
import { ISubscription } from "@/types/subscription";

export default function Pricing() {
  const [plans, setPlans] = useState<IPlan[]>([]);
  const [activeSubscription, setActiveSubscription] =
    useState<ISubscription | null>(null);
  const [planDuration, setPlanDuration] = useState<PlanDuration>(
    PlanDuration.MONTHLY
  );

  const handleMonthlyClick = () => {
    setPlanDuration(PlanDuration.MONTHLY);
  };

  const handleYearlyClick = () => {
    setPlanDuration(PlanDuration.YEARLY);
  };

  const isCurrentPlan = (plan: IPlan, activeSubscription: ISubscription) => {
    return (
      activeSubscription &&
      activeSubscription.activePlan.type === plan.type &&
      activeSubscription.activePlan.duration === plan.duration
    );
  };

  const fetchPlans = useCallback(async () => {
    try {
      const res = await subscriptionService.listPlans(planDuration);
      console.log("plans data: ", res.data);
      if (res.success) {
        setPlans(res.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Project management error: ", error);
      }
    }
  }, [planDuration]);

  const fetchSubscription = useCallback(async () => {
    try {
      const res = await subscriptionService.getCurrentSubscription();
      console.log("Subscription data: ", res.data);
      if (res.success) {
        setActiveSubscription(res.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Project management error: ", error);
      }
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const getPlanTypeDescription = (type: PlanType) => {
    switch (type) {
      case PlanType.BASE:
        return "Perfect for getting started";
      case PlanType.PREMIUM:
        return "Best for active freelancers";
      case PlanType.DIAMOND:
        return "For serious professionals";
    }
  };

  const getPlanFeatureLabels = (type: PlanType) => {
    switch (type) {
      case PlanType.BASE:
        return (
          <>
            <li>✔ 3 project postings per month</li>
            <li>✔ 1 active contribution</li>
            <li>✔ Basic project visibility</li>
            <li>✔ Community support</li>
            <li>✔ Standard payment processing</li>
          </>
        );
      case PlanType.PREMIUM:
        return (
          <>
            {" "}
            <li>✔ 15 project postings per month</li>
            <li>✔ 5 active contributions</li>
            <li>✔ Enhanced project visibility</li>
            <li>✔ Priority customer support</li>
            <li>✔ Advanced analytics</li>
            <li>✔ Faster payment processing</li>
            <li>✔ Profile verification badge</li>
          </>
        );
      case PlanType.DIAMOND:
        return (
          <>
            <li>✔ Unlimited project postings</li>
            <li>✔ Unlimited active contributions</li>
            <li>✔ Maximum project visibility</li>
            <li>✔ Dedicated account manager</li>
            <li>✔ Advanced analytics & insights</li>
            <li>✔ Instant payment processing</li>
            <li>✔ Premium verification badge</li>
            <li>✔ Featured profile placement</li>
            <li>✔ Custom branding options</li>
          </>
        );
    }
  };

  const PLAN_ORDER: Record<PlanType, number> = {
    [PlanType.BASE]: 1,
    [PlanType.PREMIUM]: 2,
    [PlanType.DIAMOND]: 3,
  };

  const DURATION_ORDER: Record<PlanDuration, number> = {
    [PlanDuration.MONTHLY]: 1,
    [PlanDuration.YEARLY]: 2,
  };

  const getPlanLabel = (plan: IPlan, subscription: ISubscription | null) => {
    if (!subscription) return;

    const targetDurationLevel = DURATION_ORDER[plan.duration];
    const targetTypeLevel = PLAN_ORDER[plan.type];

    const currentDurationLevel =
      DURATION_ORDER[subscription.activePlan.duration];
    const currentTypeLevel = PLAN_ORDER[subscription.activePlan.type];

    if (
      currentTypeLevel === targetTypeLevel &&
      currentDurationLevel === targetDurationLevel
    ) {
      return "✓ Current Plan";
    }

    if (
      targetTypeLevel > currentTypeLevel ||
      targetDurationLevel > currentDurationLevel
    ) {
      return `Upgrade to ${plan.name}`;
    }

    return `Downgrade to ${plan.name}`;
  };

  const handleSubscriptionCheckout = async (planId: string) => {
    try {
      const res = await subscriptionService.createSubscriptionCheckout(planId);
      if (res.success) {
        toast.success("Redirecting to checkout...");
        window.location.href = res.data.checkoutUrl;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Failed to initiate payment for task");
        toast.error(
          error.response?.data.message ||
            "Failed to initiate subscription checkout"
        );
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* Heading*/}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          Choose Your Plan
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          Unlock more opportunities and grow your freelance career with the
          right plan
        </p>
      </div>

      {/*  Billing Toggle */}
      <div className="flex justify-center mb-12">
        <div className="bg-secondary rounded-full p-1 flex gap-1">
          <button
            className={`px-5 py-2 rounded-full text-sm font-medium cursor-pointer  ${
              planDuration === PlanDuration.MONTHLY
                ? "bg-purple-600"
                : "text-gray-400"
            }`}
            onClick={handleMonthlyClick}
          >
            Monthly
          </button>
          <button
            className={`px-5 py-2 rounded-full text-sm font-medium cursor-pointer ${
              planDuration === PlanDuration.YEARLY
                ? "bg-purple-600"
                : "text-gray-400"
            }`}
            onClick={handleYearlyClick}
          >
            Yearly
            {/* <span className="text-purple-400 ml-1">Save 17%</span> */}
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.length === 0 && (
          <p className="text-center text-gray-400">No plans available</p>
        )}

        {plans.map((plan) => {
          const isPopular = plan.type === PlanType.PREMIUM;
          const isCurrent =
            activeSubscription !== null
              ? isCurrentPlan(plan, activeSubscription)
              : false;
          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-8 bg-[#0f1624] border-2
        ${isPopular ? "border-purple-600" : "border-[#1f2937]"}`}
            >
              {isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-xs px-4 py-1 rounded-full">
                  Most Popular
                </span>
              )}

              <h3 className="text-xl font-semibold mb-1">{plan.name}</h3>
              <p className="text-gray-400 text-sm mb-6">
                {getPlanTypeDescription(plan.type)}
              </p>

              <div className="text-4xl font-bold mb-1">${plan.price}</div>
              <p className="text-sm text-gray-400 mb-6">
                / {planDuration === PlanDuration.MONTHLY ? "monthly" : "yearly"}
              </p>

              <button
                disabled={isCurrent}
                className={`w-full py-3 rounded-lg transition
          ${
            isCurrent
              ? "bg-gray-700 text-gray-300 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 text-white"
          }`}
                onClick={() => handleSubscriptionCheckout(plan.id)}
              >
                {getPlanLabel(plan, activeSubscription)}
              </button>
              <ul className="mt-8 space-y-3 text-sm text-gray-300">
                <li>
                  ✔ {plan.features.commissionRate}% commission on earnings
                </li>
                {getPlanFeatureLabels(plan.type)}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
