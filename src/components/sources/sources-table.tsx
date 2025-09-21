
import type { Source, Bot } from "@/lib/types";
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
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

type SourcesTableProps = {
  sources: Source[];
  bots: Bot[];
  onEdit: (source: Source) => void;
  onDelete: (source: Source) => void;
};

export function SourcesTable({ sources, bots, onEdit, onDelete }: SourcesTableProps) {
  const t = useTranslations("Sources.table");

  const getBotName = (botId: string) => {
    return bots.find(b => b.id === botId)?.name || 'N/A';
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("name")}</TableHead>
          <TableHead>{t("type")}</TableHead>
          <TableHead>{t("bot")}</TableHead>
          <TableHead>{t("status")}</TableHead>
          <TableHead>{t("url")}</TableHead>
          <TableHead className="text-right">{t("actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sources.map((source) => (
          <TableRow key={source.id}>
            <TableCell className="font-medium">{source.name}</TableCell>
            <TableCell>
              <Badge variant={source.type === "RSS" ? "secondary" : "default"}>
                {source.type}
              </Badge>
            </TableCell>
             <TableCell>{getBotName(source.botId)}</TableCell>
            <TableCell>
              <Badge
                variant={source.status === "active" ? "default" : "destructive"}
              >
                {source.status}
              </Badge>
            </TableCell>
            <TableCell>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline max-w-xs truncate block"
              >
                {source.url}
              </a>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(source)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    {t("edit")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(source)} className="text-destructive">
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
