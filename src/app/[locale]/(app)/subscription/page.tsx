
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function SubscriptionPage() {
  const t = await getTranslations("Subscription");

  const plans = [
    {
      name: t("plans.free.name"),
      price: t("plans.free.price"),
      period: t("plans.free.period"),
      description: t("plans.free.description"),
      features: [
        t("plans.free.features.0"),
        t("plans.free.features.1"),
        t("plans.free.features.2"),
        t("plans.free.features.3"),
      ],
      cta: t("plans.free.cta"),
      isCurrent: true,
    },
    {
      name: t("plans.pro.name"),
      price: t("plans.pro.price"),
      period: t("plans.pro.period"),
      description: t("plans.pro.description"),
      features: [
        t("plans.pro.features.0"),
        t("plans.pro.features.1"),
        t("plans.pro.features.2"),
        t("plans.pro.features.3"),
        t("plans.pro.features.4"),
        t("plans.pro.features.5"),
      ],
      cta: t("plans.pro.cta"),
      isCurrent: false,
    },
    {
      name: t("plans.enterprise.name"),
      price: t("plans.enterprise.price"),
      period: t("plans.enterprise.period"),
      description: t("plans.enterprise.description"),
      features: [
        t("plans.enterprise.features.0"),
        t("plans.enterprise.features.1"),
        t("plans.enterprise.features.2"),
        t("plans.enterprise.features.3"),
        t("plans.enterprise.features.4"),
        t("plans.enterprise.features.5"),
      ],
      cta: t("plans.enterprise.cta"),
      isCurrent: false,
    },
  ];


  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t("title")}
        description={t("description")}
      />
      <div className="grid gap-8 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={plan.isCurrent ? "border-primary" : ""}
          >
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-muted-foreground">{plan.period}</span>
                )}
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                disabled={plan.isCurrent}
                variant={plan.isCurrent ? "outline" : "default"}
              >
                {plan.cta}
                {!plan.isCurrent && plan.name !== t("plans.enterprise.name") && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

       <Card>
        <CardHeader>
            <CardTitle>{t("SaaS.manage.title")}</CardTitle>
            <CardDescription>{t("SaaS.manage.description")}</CardDescription>
        </CardHeader>
        <CardFooter>
            <Button variant="outline">{t("SaaS.manage.cta")}</Button>
        </CardFooter>
       </Card>

    </div>
  );
}
