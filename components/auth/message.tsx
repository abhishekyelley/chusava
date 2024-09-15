import { AlertDestructive } from "../common/alert";
import { BaseAuthFormProps } from "@/types/auth";

export function Message<T extends BaseAuthFormProps>({
  formState,
}: {
  formState: T["formState"];
}) {
  if (!formState) {
    return <></>;
  }
  if ("error" in formState) {
    if (formState.type === "validation") {
      return <AlertDestructive>{formState.message}</AlertDestructive>;
    }
    if (formState.type === "authentication") {
      return <AlertDestructive>{formState.message}</AlertDestructive>;
    }
  }
  if (formState.type === "success") {
    return (
      <AlertDestructive variant="success">
        {formState.message}
      </AlertDestructive>
    );
  }
}
