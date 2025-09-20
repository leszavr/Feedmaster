import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { mockSources } from "@/lib/data";
import { Circle, MoreHorizontal, Play, PlusCircle, Trash2 } from "lucide-react";

export default function SourcesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Sources">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle />
              Add Source
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Source</DialogTitle>
              <DialogDescription>
                Configure a new source to fetch content from.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" defaultValue="TechCrunch" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rss">RSS</SelectItem>
                    <SelectItem value="telegram">Telegram</SelectItem>
                    <SelectItem value="web">Web</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="url" className="text-right">
                  URL
                </Label>
                <Input
                  id="url"
                  defaultValue="https://techcrunch.com/feed/"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="keywords" className="text-right">
                  Keywords
                </Label>
                <Input
                  id="keywords"
                  defaultValue="AI, startup"
                  className="col-span-3"
                  placeholder="e.g., AI, machine learning"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Source</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="hidden md:table-cell">URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Last Run</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockSources.map((source) => (
              <TableRow key={source.id}>
                <TableCell className="font-medium">{source.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{source.type}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell max-w-sm truncate">
                  {source.url}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={source.status === "active" ? "default" : "secondary"}
                    className={source.status === "active" ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    <Circle className={`mr-2 h-2 w-2 fill-current ${source.status === 'active' ? 'text-white' : 'text-gray-500'}`} />
                    {source.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {source.lastRun.toLocaleString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem><Play className="mr-2 h-4 w-4"/>Run now</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4"/>Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
