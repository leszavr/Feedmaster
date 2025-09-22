import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  plan: string;
  status: string;
  lastLogin: string;
}

interface UserDetailModalProps {
  user: User;
  onClose: () => void;
}

export default function UserDetailModal({ user, onClose }: UserDetailModalProps) {
  const [action, setAction] = useState("");
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("");

  const handleSubmit = () => {
    // TODO: Implement action submission
    console.log('Applying action:', { action, reason, duration, userId: user.id });
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="modal-user-details">
        <DialogHeader>
          <DialogTitle>Детали пользователя</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Имя</Label>
              <p className="text-sm" data-testid="text-user-name">{user.name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Email</Label>
              <p className="text-sm" data-testid="text-user-email">{user.email}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Дата регистрации</Label>
              <p className="text-sm" data-testid="text-registration-date">15.03.2024</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Способ оплаты</Label>
              <p className="text-sm" data-testid="text-payment-method">СБП</p>
            </div>
          </div>

          {/* Action Form */}
          <div className="border-t border-border pt-6">
            <h4 className="text-sm font-semibold mb-4">Применить действие</h4>
            <div className="space-y-4">
              <div>
                <Label htmlFor="action">Действие</Label>
                <Select value={action} onValueChange={setAction}>
                  <SelectTrigger data-testid="select-action">
                    <SelectValue placeholder="Выберите действие" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="suspend">Приостановить</SelectItem>
                    <SelectItem value="block">Заблокировать</SelectItem>
                    <SelectItem value="restore">Восстановить</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="reason">Причина</Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger data-testid="select-reason">
                    <SelectValue placeholder="Выберите причину" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spam">Спам</SelectItem>
                    <SelectItem value="fraud">Мошенничество</SelectItem>
                    <SelectItem value="tos">Нарушение ToS</SelectItem>
                    <SelectItem value="other">Другое</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="duration">Срок</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger data-testid="select-duration">
                    <SelectValue placeholder="Выберите срок" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1d">1 день</SelectItem>
                    <SelectItem value="7d">7 дней</SelectItem>
                    <SelectItem value="30d">30 дней</SelectItem>
                    <SelectItem value="permanent">Бессрочно</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full bg-destructive hover:bg-destructive/90"
                onClick={handleSubmit}
                disabled={!action || !reason}
                data-testid="button-execute-action"
              >
                Выполнить
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
