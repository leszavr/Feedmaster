import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage");
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">{t("title")}</h1>
      <p className="text-xl text-muted-foreground">{t("subtitle")}</p>
    </main>
  );
}
