import { getAdminStats } from "@/services/blog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  FileText,
  MessageSquare,
  Eye
} from "lucide-react";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  const cards = [
    {
      title: "Total Blogs",
      value: stats.blogCount,
      icon: FileText,
      description: "Blogs created in the system",
    },
    {
      title: "Pending Comments",
      value: stats.pendingCommentCount,
      icon: MessageSquare,
      description: "Comments awaiting moderation",
    },
    {
      title: "Total Views",
      value: stats.totalViews,
      icon: Eye,
      description: "Cumulative blog views",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          Dashboard
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Overview of your blog system performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
