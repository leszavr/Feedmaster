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
import { mockBots } from "@/lib/data";
import { Circle, MoreHorizontal, PlusCircle, Send, Trash2 } from "lucide-react";
import { PasswordInput } from "@/components/password-input";

export default function BotsPage() {
  const getStatusBadge = (status: "active" | "inactive" | "error") => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-600 hover:bg-green-700"><Circle className="mr-2 h-2 w-2 fill-white"/>Active</Badge>;
      case "inactive":
        return <Badge variant="secondary"><Circle className="mr-2 h-2 w-2 fill-gray-500"/>Inactive</Badge>;
      case "error":
        return <Badge variant="destructive"><Circle className="mr-2 h-2 w-2 fill-white"/>Error</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Bots">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle />
              Add Bot
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Bot</DialogTitle>
              <DialogDescription>
                Enter the details for your new Telegram bot.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" placeholder="My Content Bot" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="token" className="text-right">
                  API Token
                </Label>
                <PasswordInput id="token" placeholder="••••••••••" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="channelId" className="text-right">
                  Channel ID
                </Label>
                <Input
                  id="channelId"
                  placeholder="@your_channel_name"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Bot</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Channel ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockBots.map((bot) => (
              <TableRow key={bot.id}>
                <TableCell className="font-medium">{bot.name}</TableCell>
                <TableCell>{bot.channelId}</TableCell>
                <TableCell>{getStatusBadge(bot.status)}</TableCell>
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
                      <DropdownMenuItem><Send className="mr-2 h-4 w-4"/>Send Test Message</DropdownMenuItem>
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
