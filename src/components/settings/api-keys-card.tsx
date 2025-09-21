
"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  PlusCircle,
  Copy,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type ApiKey = {
  id: string;
  key: string;
  name: string;
  createdAt: Date;
};

export function ApiKeysCard() {
  const t = useTranslations("Settings.api");
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);

  useEffect(() => {
    // Initialize state on client to avoid hydration mismatch
    setApiKeys([
      {
        id: "key-1",
        key: `fm_sk_live_${Math.random().toString(36).substring(2)}`,
        name: "Default Key",
        createdAt: new Date(),
      },
    ]);
  }, []);


  const generateKey = () => {
    const newKey: ApiKey = {
      id: `key-${apiKeys.length + 1}`,
      key: `fm_sk_live_${Math.random().toString(36).substring(2)}`,
      name: `Key ${apiKeys.length + 1}`,
      createdAt: new Date(),
    };
    setApiKeys((prev) => [...prev, newKey]);
    toast({
      title: t("toast.generateSuccess.title"),
      description: t("toast.generateSuccess.description"),
    });
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: t("toast.copySuccess.title"),
    });
  };

  const deleteKey = (keyId: string) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== keyId));
    toast({
      title: t("toast.deleteSuccess.title"),
      variant: "destructive",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("table.name")}</TableHead>
              <TableHead>{t("table.key")}</TableHead>
              <TableHead>{t("table.createdAt")}</TableHead>
              <TableHead className="text-right">{t("table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeys.map((apiKey) => (
              <TableRow key={apiKey.id}>
                <TableCell className="font-medium">{apiKey.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono">
                    {apiKey.key.substring(0, 15)}...
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(apiKey.createdAt, "dd MMM, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => copyKey(apiKey.key)}>
                        <Copy className="mr-2 h-4 w-4" />
                        {t("table.copy")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => deleteKey(apiKey.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t("table.delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Button onClick={generateKey}>
          <PlusCircle />
          {t("generateButton")}
        </Button>
      </CardFooter>
    </Card>
  );
}
