"use client";

import StripeConnectCard from "@/components/features/StripeConnectCard";
import { LoadingSpinner } from "@/components/layout/LoadingSpinner";
import { USER_ROUTES } from "@/constants/routes/user-routes";
import { reviewService } from "@/services/user/review.service";
import { userService } from "@/services/user/user-service";
import { IAggregatedReview } from "@/types/review";
import { IUser } from "@/types/user";
import { handleApiError } from "@/utils/handleApiError";
import { Home, Pen, Star, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const ProfilePage = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [reviews, setReviews] = useState<IAggregatedReview[]>([]);

  const fetchUser = useCallback(async () => {
    try {
      const res = await userService.getUser();
      setUser(res.data);
      fetchReviews();
    } catch (error) {
      handleApiError(error);
    }
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await reviewService.listReviews();
      setReviews(res.data);
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (!user) return <LoadingSpinner></LoadingSpinner>;

  return (
    <div className="w-full bg-white dark:bg-primary text-black dark:text-white sm:px-6 py-6 flex justify-center transition-colors">
      <div className="max-w-4xl w-full bg-gray-100 dark:bg-secondary/30 rounded-2xl shadow-lg p-5 sm:p-8 space-y-6 sm:space-y-8 transition-colors">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          {/* Avatar */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600 mx-auto sm:mx-0">
            {user && user.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt={user.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                <User size={48} className="sm:w-[66px] sm:h-[66px]" />
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-xl sm:text-2xl font-bold">{user?.name}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 break-all">
              {user?.email}
            </p>
            {user?.developerRole && (
              <p className="mt-1 text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base">
                {user.developerRole}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex sm:flex-row gap-3 w-full sm:w-auto sm:ml-auto">
            <Link
              href={USER_ROUTES.HOME}
              className="w-full  sm:hidden  sm:w-auto"
            >
              <button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-secondary hover:bg-secondary/80 text-white rounded-lg transition">
                <Home size={14} />
                <span>Home</span>
              </button>
            </Link>

            <Link href={USER_ROUTES.EDIT_PROFILE} className="w-full sm:w-auto">
              <button className="w-full flex items-center justify-center gap-2 py-1 px-4 bg-btn-primary cursor-pointer hover:bg-btn-primary-hover text-white rounded-lg transition">
                <Pen size={14} />
                <span>Edit</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Bio */}
        {user?.bio && (
          <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
            {user?.bio}
          </p>
        )}

        {/* Experience */}
        {user?.experience && (
          <div>
            <h2 className="font-semibold text-lg">Experience</h2>
            <p className="text-gray-700 dark:text-gray-300 mt-1 text-sm sm:text-base">
              {user?.experience}
            </p>
          </div>
        )}

        {/* Tech Stacks */}
        {user?.techStacks && user?.techStacks?.length > 0 && (
          <div>
            <h2 className="font-semibold text-lg mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {user.techStacks.map((stack) => (
                <span
                  key={stack}
                  className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-xs sm:text-sm text-gray-800 dark:text-gray-200"
                >
                  {stack}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Learning Goals */}
        {user?.learningGoals && user?.learningGoals?.length > 0 && (
          <div>
            <h2 className="font-semibold text-lg mb-2">Learning Goals</h2>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 text-sm sm:text-base">
              {user.learningGoals.map((goal, idx) => (
                <li key={idx}>{goal}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Reputation */}
        <div>
          <h2 className="font-semibold text-lg">Reputation</h2>

          <div className="mt-2 space-y-1 text-sm sm:text-base text-gray-700 dark:text-gray-300">
            <p className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-gray-900 dark:text-white">
                Average Rating:
              </span>
              <span className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    className={`${
                      user.reputation.avgRating >= star
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </span>
              <span className="text-yellow-500">
                {user.reputation.avgRating.toFixed(1)}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                (
                <span className="font-medium text-gray-900 dark:text-white">
                  {user.reputation.totalReviews}
                </span>{" "}
                Reviews)
              </span>
            </p>
          </div>

          {/* Latest Reviews */}
          {reviews?.length > 0 && (
            <div className="mt-5 space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Latest Reviews
              </h3>

              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-border-primary rounded-lg p-3 text-sm bg-white dark:bg-secondary"
                >
                  {/* Stars */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={`${
                          review.rating >= star
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-700 dark:text-gray-300">
                    {review.review}
                  </p>

                  {/* Reviewer */}
                  <div className="flex justify-end">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      — {review.reviewer.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <StripeConnectCard user={user} />
      </div>
    </div>
  );
};

export default ProfilePage;
