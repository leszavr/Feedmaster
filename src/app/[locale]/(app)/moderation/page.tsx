
"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/page-header";
import { ModerationCard } from "@/components/moderation/moderation-card";
import { getPosts, getBots, getSources } from "@/lib/data";
import type { Post, Bot, Source } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ModerationPage() {
  const t = useTranslations("Moderation");
  const [posts, setPosts] = useState<Post[]>([]);
  const [bots, setBots] = useState<Bot[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [selectedBot, setSelectedBot] = useState("all");
  const [selectedSource, setSelectedSource] = useState("all");

  useEffect(() => {
    async function loadData() {
      const [fetchedPosts, fetchedBots, fetchedSources] = await Promise.all([
        getPosts(),
        getBots(),
        getSources(),
      ]);
      const pendingPosts = fetchedPosts.filter(
        (post) => post.status === "pending"
      );
      setPosts(pendingPosts);
      setBots(fetchedBots);
      setSources(fetchedSources);
    }
    loadData();
  }, []);

  const sourcesByBot = useMemo(() => {
    if (selectedBot === "all") return new Set(sources.map(s => s.name));
    const botSources = sources.filter(s => s.botId === selectedBot);
    return new Set(botSources.map(s => s.name));
  }, [selectedBot, sources]);

  const filteredPosts = useMemo(() => {
    let result = posts;

    if (selectedBot !== "all") {
        const sourceIdsForBot = sources.filter(s => s.botId === selectedBot).map(s => s.id);
        result = result.filter(p => sourceIdsForBot.includes(p.source.id));
    }
    
    if (selectedSource !== "all") {
      result = result.filter((p) => p.source.name === selectedSource);
    }
    
    return result;
  }, [selectedBot, selectedSource, posts, sources]);

  const handlePostUpdate = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId)); 
  }

  const availableSources = useMemo(() => {
    if (selectedBot === "all") return sources;
    return sources.filter(s => s.botId === selectedBot);
  }, [selectedBot, sources]);

  useEffect(() => {
    if (selectedBot !== 'all' && selectedSource !== 'all') {
      const isSourceAvailableForBot = availableSources.some(s => s.name === selectedSource);
      if (!isSourceAvailableForBot) {
        setSelectedSource('all');
      }
    }
  }, [selectedBot, selectedSource, availableSources]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={`${t("title")} (${filteredPosts.length})`}>
        <div className="flex items-center gap-2">
          <Select value={selectedBot} onValueChange={setSelectedBot}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("filterByBot")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allBots")}</SelectItem>
              {bots.map((bot) => (
                <SelectItem key={bot.id} value={bot.id}>
                  {bot.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
           <Select value={selectedSource} onValueChange={setSelectedSource}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("filterBySource")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allSources")}</SelectItem>
              {availableSources.map((source) => (
                <SelectItem key={source.id} value={source.name}>
                  {source.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PageHeader>
      {filteredPosts.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {filteredPosts.map((post) => (
            <ModerationCard
              key={post.id}
              post={{
                ...post,
                fetchedAt: new Date(post.fetchedAt).toISOString(),
              }}
              onStatusUpdate={() => handlePostUpdate(post.id)}
            />
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
