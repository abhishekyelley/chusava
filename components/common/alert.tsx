import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export function AlertDestructive({
  children,
  variant = "destructive",
}: {
  children: React.ReactNode;
  variant?: "destructive" | "default" | "success";
}) {
  return (
    <Alert
      variant={variant}
      className={cn(
        "border-x-4",
        variant === "destructive"
          ? "dark:text-red-600 dark:border-red-600"
          : ""
      )}
    >
      <ExclamationTriangleIcon
        className={cn(
          "h-4 w-4",
          variant === "destructive" ? "dark:text-red-600" : ""
        )}
      />
      <AlertTitle className="font-extrabold">
        {variant === "destructive"
          ? "Error"
          : variant === "success"
          ? "Verified"
          : "Alert"}
      </AlertTitle>
      <AlertDescription className="font-bold">
        {children}
      </AlertDescription>
    </Alert>
  );
}

export function AlertDialogWrapper({
  children,
  title = "Are you absolutely sure?",
  description = "This action cannot be undone.",
  confirm = "Continue",
  confirmClass = "",
  handleCancel = () => {},
  handleConfirm,
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
  confirm?: React.ReactNode;
  confirmClass?: string;
  handleCancel?: React.MouseEventHandler<HTMLButtonElement>;
  handleConfirm: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className={confirmClass}
            onClick={handleConfirm}
          >
            {confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
