
import type { Bot } from "@/lib/types";
import { MessengerPlatform } from "@/lib/adapters";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Pencil, Trash2, MessageSquare, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { ObfuscatedToken } from "./obfuscated-token";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

type BotsTableProps = {
  bots: Bot[];
  onEdit: (bot: Bot) => void;
  onDelete: (bot: Bot) => void;
  isSuspended?: boolean;
};

export function BotsTable({ bots, onEdit, onDelete, isSuspended = false }: BotsTableProps) {
  const t = useTranslations("Bots.table");

  const getStatusVariant = (status: Bot["status"]) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "error":
        return "destructive";
      case "stopped":
        return "outline";
    }
  };

  const getPlatformIcon = (platform: MessengerPlatform) => {
    switch (platform) {
      case MessengerPlatform.TELEGRAM:
        return <MessageSquare className="h-4 w-4 text-blue-600" />;
      case MessengerPlatform.MAX:
        return <Zap className="h-4 w-4 text-purple-600" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getPlatformName = (platform: MessengerPlatform) => {
    switch (platform) {
      case MessengerPlatform.TELEGRAM:
        return "Telegram";
      case MessengerPlatform.MAX:
        return "MAX";
      default:
        return platform;
    }
  };

  const formatLastScan = (date?: Date | string) => {
    if (!date) return "N/A";
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: ru,
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("name")}</TableHead>
          <TableHead>Платформа</TableHead>
          <TableHead>{t("token")}</TableHead>
          <TableHead>{t("channelId")}</TableHead>
          <TableHead>{t("lastScan")}</TableHead>
          <TableHead>{t("status")}</TableHead>
          <TableHead className="text-right">{t("actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bots.map((bot) => (
          <TableRow key={bot.id}>
            <TableCell className="font-medium">{bot.name}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {getPlatformIcon(bot.platform)}
                <span className="text-sm">{getPlatformName(bot.platform)}</span>
              </div>
            </TableCell>
            <TableCell>
              <ObfuscatedToken token={bot.token} />
            </TableCell>
            <TableCell>{bot.channelId}</TableCell>
            <TableCell>{formatLastScan(bot.lastScan)}</TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(bot.status)}>{bot.status}</Badge>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" disabled={isSuspended}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(bot)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    {t("edit")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(bot)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t("delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
