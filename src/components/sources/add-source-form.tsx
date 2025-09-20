
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  type: z.enum(["RSS", "Telegram", "Web"]),
  url: z.string().url("Please enter a valid URL."),
  keywords: z.string().optional(),
  filterLogic: z.enum(["AND", "OR"]).default("OR"),
  blacklist: z.string().optional(),
  fetchInterval: z.coerce.number().min(1).default(60),
});

type AddSourceFormProps = {
  onFormSubmit: (data: z.infer<typeof formSchema>) => void;
};

export function AddSourceForm({ onFormSubmit }: AddSourceFormProps) {
  const t = useTranslations("Sources.addDialog");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      url: "",
      keywords: "",
      filterLogic: "OR",
      blacklist: "",
      fetchInterval: 60,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onFormSubmit(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("nameLabel")}</FormLabel>
              <FormControl>
                <Input placeholder={t("namePlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("typeLabel")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("typePlaceholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="RSS">{t("typeRss")}</SelectItem>
                    <SelectItem value="Telegram">
                      {t("typeTelegram")}
                    </SelectItem>
                    <SelectItem value="Web">{t("typeWeb")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
          control={form.control}
          name="fetchInterval"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("fetchIntervalLabel")}</FormLabel>
              <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("fetchIntervalPlaceholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="5">{t("interval5min")}</SelectItem>
                  <SelectItem value="15">{t("interval15min")}</SelectItem>
                  <SelectItem value="30">{t("interval30min")}</SelectItem>
                  <SelectItem value="60">{t("interval1hour")}</SelectItem>
                  <SelectItem value="180">{t("interval3hours")}</SelectItem>
                  <SelectItem value="360">{t("interval6hours")}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("urlLabel")}</FormLabel>
              <FormControl>
                <Input placeholder={t("urlPlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("keywordsLabel")}</FormLabel>
              <FormControl>
                <Input placeholder={t("keywordsPlaceholder")} {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="filterLogic"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>{t("filterLogicLabel")}</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex items-center space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="OR" />
                    </FormControl>
                    <FormLabel className="font-normal">{t("filterLogicOr")}</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="AND" />
                    </FormControl>
                    <FormLabel className="font-normal">{t("filterLogicAnd")}</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="blacklist"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("blacklistLabel")}</FormLabel>
              <FormControl>
                <Input placeholder={t("blacklistPlaceholder")} {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit">{t("submitButton")}</Button>
        </div>
      </form>
    </Form>
  );
}
