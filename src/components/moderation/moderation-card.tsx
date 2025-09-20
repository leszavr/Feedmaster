"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getSummary, updatePostStatus } from "@/app/actions";
import type { Post } from "@/lib/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ThumbsUp, ThumbsDown, Sparkles, LoaderCircle, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { useTranslations } from "next-intl";

type ModerationCardProps = {
  post: Post;
};

export function ModerationCard({ post }: ModerationCardProps) {
  const t = useTranslations("Moderation.card");
  const { toast } = useToast();
  const [summary, setSummary] = useState<string | null>(post.summary || null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isUpdating, setIsUpdating] = useState<"approved" | "rejected" | null>(null);

  const handleSummarize = async () => {
    setIsSummarizing(true);
    try {
      const result = await getSummary(post.content);
      setSummary(result);
    } catch (error) {
      toast({
        title: t("toast.summarizeError.title"),
        description: t("toast.summarizeError.description"),
        variant: "destructive",
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleStatusUpdate = async (status: "approved" | "rejected") => {
    setIsUpdating(status);
    const result = await updatePostStatus(post.id, status);
    if(result.success) {
      toast({
        title: t("toast.updateSuccess.title"),
        description: result.message,
      });
    } else {
        toast({
            title: t("toast.updateError.title"),
            description: t("toast.updateError.description"),
            variant: "destructive",
        });
    }
    // In a real app, the card would be removed from the list upon success.
    // Here we just stop the loading state.
    setIsUpdating(null);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div>
            <CardTitle className="mb-1">{post.title}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              {t("source", { name: post.source.name, type: post.source.type })}
              <Link href={post.link} target="_blank">
                <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-primary"/>
              </Link>
            </CardDescription>
          </div>
          <Badge variant="secondary">{new Date(post.fetchedAt).toLocaleTimeString()}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{post.content}</p>
        {summary || isSummarizing ? (
          <div className="p-4 bg-muted/50 rounded-lg space-y-2 border">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h4 className="font-semibold">{t("summaryTitle")}</h4>
            </div>
            {isSummarizing ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <p className="text-sm">{summary}</p>
            )}
          </div>
        ) : null}
        <Separator />
        <div className="flex flex-wrap gap-2">
          {post.keywords.map((keyword) => (
            <Badge key={keyword} variant="outline">
              {keyword}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleSummarize} disabled={isSummarizing || !!isUpdating}>
          {isSummarizing ? <LoaderCircle className="animate-spin" /> : <Sparkles />}
          {t("summarizeButton")}
        </Button>
        <div className="flex gap-2">
          <Button variant="destructive" onClick={() => handleStatusUpdate('rejected')} disabled={!!isUpdating}>
            {isUpdating === 'rejected' ? <LoaderCircle className="animate-spin" /> : <ThumbsDown />}
             {t("rejectButton")}
          </Button>
          <Button onClick={() => handleStatusUpdate('approved')} disabled={!!isUpdating}>
            {isUpdating === 'approved' ? <LoaderCircle className="animate-spin" /> : <ThumbsUp />}
            {t("approveButton")}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
