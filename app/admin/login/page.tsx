"use client";

import { useActionState } from "react";
import { authenticate } from "@/lib/actions/auth";

export default function LoginPage() {
  const [errorMessage, dispatch, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-neutral-50 px-4 dark:bg-neutral-950">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Admin Login
          </h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Enter your credentials to access the dashboard
          </p>
        </div>

        <form action={dispatch} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm focus:border-neutral-900 focus:outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-neutral-50"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Password
              </label>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm focus:border-neutral-900 focus:outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-50 dark:focus:border-neutral-50"
            />
          </div>

          {errorMessage && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-md bg-neutral-900 py-2 text-sm font-medium text-neutral-50 transition-colors hover:bg-neutral-800 disabled:opacity-50 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            {isPending ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
