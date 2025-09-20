import type { Source } from "@/lib/types";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type SourcesTableProps = {
  sources: Source[];
};

export function SourcesTable({ sources }: SourcesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Название</TableHead>
          <TableHead>Тип</TableHead>
          <TableHead>Статус</TableHead>
          <TableHead>URL</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sources.map((source) => (
          <TableRow key={source.id}>
            <TableCell className="font-medium">{source.name}</TableCell>
            <TableCell>
              <Badge variant={source.type === "RSS" ? "secondary" : "default"}>{source.type}</Badge>
            </TableCell>
            <TableCell>
                <Badge variant={source.status === 'active' ? 'default' : 'destructive'}>{source.status}</Badge>
            </TableCell>
            <TableCell>
              <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {source.url}
              </a>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
