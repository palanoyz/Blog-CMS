"use client";

import { useState } from "react";
import { submitComment } from "@/lib/actions/comment";
import { CommentSchema } from "@/lib/validations";

interface CommentFormProps {
  blogId: string;
}

export function CommentForm({ blogId }: CommentFormProps) {
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setSuccess(false);

    const formData = { senderName, message, blogId };

    // Client-side validation
    const result = CommentSchema.safeParse(formData);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      setIsSubmitting(false);
      return;
    }

    const response = await submitComment(formData);

    if (response.error) {
      setErrors(response.error as Record<string, string[]>);
    } else {
      setSuccess(true);
      setSenderName("");
      setMessage("");
    }
    setIsSubmitting(false);
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900/50">
      <h3 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-50">
        Leave a Comment
      </h3>
      {success && (
        <div className="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400">
          Your comment has been submitted and is awaiting moderation.
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="senderName"
            className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Name
          </label>
          <input
            id="senderName"
            type="text"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            className={`w-full rounded-md border px-4 py-2 text-sm focus:outline-none dark:bg-neutral-950 ${errors.senderName
              ? "border-red-500 focus:border-red-500"
              : "border-neutral-300 focus:border-blue-500 dark:border-neutral-700"
              }`}
            placeholder="Your name"
            maxLength={100}
            disabled={isSubmitting}
          />
          {errors.senderName && (
            <p className="mt-1 text-xs text-red-500">{errors.senderName[0]}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="message"
            className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Comment (Thai characters & Numbers only)
          </label>
          <textarea
            id="message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`w-full rounded-md border px-4 py-2 text-sm focus:outline-none dark:bg-neutral-950 ${errors.message
              ? "border-red-500 focus:border-red-500"
              : "border-neutral-300 focus:border-blue-500 dark:border-neutral-700"
              }`}
            placeholder="พิมพ์ความคิดเห็นของคุณที่นี่ (ภาษาไทยและตัวเลขเท่านั้น)"
            disabled={isSubmitting}
          />
          {errors.message && (
            <p className="mt-1 text-xs text-red-500">{errors.message[0]}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-50 transition-colors hover:bg-neutral-800 disabled:opacity-50 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          {isSubmitting ? "Submitting..." : "Submit Comment"}
        </button>
      </form>
    </div>
  );
}
