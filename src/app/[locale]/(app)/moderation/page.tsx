import { PageHeader } from "@/components/page-header";
import { ModerationCard } from "@/components/moderation/moderation-card";
import { getPosts } from "@/lib/data";
import { useTranslations } from "next-intl";

export default async function ModerationPage() {
  const t = useTranslations("Moderation");
  const posts = await getPosts();
  const pendingPosts = posts.filter((post) => post.status === "pending");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={`${t("title")} (${pendingPosts.length})`} />
      {pendingPosts.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {pendingPosts.map((post) => (
            <ModerationCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">{t("noPosts")}</p>
        </div>
      )}
    </div>
  );
}
