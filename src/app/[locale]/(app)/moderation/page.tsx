import { mockPosts } from "@/lib/data";
import type { Post } from "@/lib/types";
import { PageHeader } from "@/components/page-header";
import { ModerationCard } from "@/components/moderation/moderation-card";

async function getPendingPosts(): Promise<Post[]> {
  // In a real app, this would fetch from a database
  return mockPosts.filter((p) => p.status === "pending");
}

export default async function ModerationPage() {
  const posts = await getPendingPosts();

  return (
    <div className="space-y-6">
      <PageHeader title="Moderation Queue" />
      {posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <ModerationCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h3 className="text-lg font-medium">All Clear!</h3>
            <p className="text-muted-foreground">There are no posts pending moderation.</p>
        </div>
      )}
    </div>
  );
}
