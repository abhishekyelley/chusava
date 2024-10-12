"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { cn, usernameRegex } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "@/lib/axios";
import { IconFromUrl } from "@/components/common/icon-from-url";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { LoaderCircle, Pencil, Trash2, Upload } from "lucide-react";
import { UserResponse } from "@/types/api/user";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

const MAX_IN_MB = 1;

const MAX_FILE_SIZE = MAX_IN_MB * 10 ** 6;
// const ACCEPTED_IMAGE_TYPES = [
//   "image/jpeg",
//   "image/jpg",
//   "image/png",
//   "image/webp",
// ];

const profileFormSchema = z.object({
  first_name: z
    .string()
    .min(2, {
      message: "First name must be at least 2 characters.",
    })
    .max(30, {
      message: "First name must not be longer than 30 characters.",
    }),
  last_name: z
    .string()
    .min(2, {
      message: "First name must be at least 2 characters.",
    })
    .max(30, {
      message: "First name must not be longer than 30 characters.",
    }),
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    })
    .refine((value) => usernameRegex.test(value ?? ""), {
      message:
        "Username can only contain letters, numbers and underscores",
    }),
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),
  bio: z.string().max(160).min(4),
  urls: z
    .array(
      z.object({
        value: z
          .string()
          .url({ message: "Please enter a valid URL." }),
      })
    )
    .optional(),
});

const avatarFormSchema = z.object({
  avatar: z
    .instanceof(FileList)
    .refine((files) => files.length === 1)
    .refine(
      (files) => files[0]?.size <= MAX_FILE_SIZE,
      `Max file size is ${MAX_IN_MB} MB.`
    ),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
export type AvatarFormValues = z.infer<typeof avatarFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
  username: "",
  email: "",
  first_name: "",
  last_name: "",
  bio: "",
  urls: [{ value: "" }],
};

function getImage(files: FileList | undefined, current?: string) {
  if (files && files.length > 0) {
    return URL.createObjectURL(files[0]);
  }
  if (current) {
    return current;
  }
  return "";
}

export function ProfileForm() {
  const queryClient = useQueryClient();
  const user = useQuery({
    queryFn: async ({ signal }) => {
      const response = await axios.get<UserResponse>("/api/user", {
        signal,
      });
      return response.data;
    },
    queryKey: ["user"],
  });
  const update = useMutation({
    mutationFn: async (data: Partial<ProfileFormValues>) => {
      return await axios.post("/api/user", data);
    },
    onSuccess: async () => {
      toast.success("Profile information updated.", {
        description: new Date().toLocaleTimeString(),
      });
      queryClient.invalidateQueries({
        queryKey: ["user"],
        exact: false,
        refetchType: "all",
      });
    },
    onError: () => {
      toast.error("Profile information was not updated.", {
        description: new Date().toLocaleTimeString(),
      });
      queryClient.invalidateQueries({
        queryKey: ["user"],
        exact: false,
        refetchType: "all",
      });
    },
  });
  const avatarUpdate = useMutation({
    mutationFn: async (formData: FormData) => {
      return await axios.post("/api/user/avatar", formData);
    },
    onSuccess: () => {
      toast.success("Avatar updated.", {
        description: new Date().toLocaleTimeString(),
      });
      queryClient.invalidateQueries({
        queryKey: ["avatar", "user"],
        exact: false,
        refetchType: "all",
      });
    },
    onError: () => {
      toast.error("Avatar could not be updated.", {
        description: new Date().toLocaleTimeString(),
      });
      queryClient.invalidateQueries({
        queryKey: ["avatar"],
        exact: false,
        refetchType: "all",
      });
    },
  });
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });
  const avatarForm = useForm<AvatarFormValues>({
    resolver: zodResolver(avatarFormSchema),
    mode: "onChange",
  });
  const { fields, append, remove, replace } = useFieldArray({
    name: "urls",
    control: form.control,
  });
  useEffect(() => {
    if (user.data) {
      form.setValue("first_name", user.data.first_name ?? "");
      form.setValue("last_name", user.data.last_name ?? "");
      form.setValue("username", user.data.username ?? "");
      form.setValue("email", user.data.email ?? "");
      form.setValue("bio", user.data.bio ?? "");
      user.data.urls &&
        replace(user.data.urls.map((url) => ({ value: url })));
    }
  }, [user.data, form, replace]);

  function handleUrlDelete(name: string) {
    const idx = Number(name.split(".")[1]);
    remove(idx);
  }

  function onSubmit(data: ProfileFormValues) {
    update.mutate(data);
  }
  function onAvatarSubmit(data: AvatarFormValues) {
    const formData = new FormData();
    formData.append("avatar", data.avatar[0]);
    avatarUpdate.mutate(formData);
  }
  const avatarRef = avatarForm.register("avatar");
  return (
    <>
      <Form {...avatarForm}>
        <form
          className="space-y-8"
          onSubmit={avatarForm.handleSubmit(onAvatarSubmit)}
        >
          <FormField
            control={avatarForm.control}
            name="avatar"
            render={() => (
              <FormItem>
                <FormLabel>Avatar</FormLabel>
                <FormControl>
                  <div className="w-max">
                    <Avatar className="cursor-pointer h-48 w-48">
                      {getImage(
                        avatarForm.getValues("avatar"),
                        user.data?.avatar
                      ) && (
                        <div className="rounded-full absolute w-48 h-48">
                          <Pencil className="text-white relative left-[50%] -translate-x-[50%] top-[50%] -translate-y-[50%] h-12 w-12 z-10" />
                        </div>
                      )}
                      <AvatarImage
                        src={getImage(
                          avatarForm.getValues("avatar"),
                          user.data?.avatar
                        )}
                        className="object-cover brightness-50"
                      />
                      <Input
                        className="-top-4 m-0 p-0 h-48 w-48 overflow-clip absolute rounded-full z-10 cursor-pointer opacity-0"
                        type="file"
                        accept="image/jpeg"
                        {...avatarRef}
                      />
                      <AvatarFallback className="flex-col space-y-4">
                        <Upload />
                        <p>Upload an image</p>
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </FormControl>
                <FormDescription>
                  This is your avatar, publicly visible to everyone.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={avatarUpdate.isPending} type="submit">
            {!avatarUpdate.isPending && <span>Save Avatar</span>}
            {avatarUpdate.isPending && (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            )}
          </Button>
        </form>
      </Form>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <div className="flex flex-wrap">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem className="mr-4">
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="---" {...field} />
                  </FormControl>
                  <FormDescription>
                    <VisuallyHidden>Your First Name</VisuallyHidden>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="---" {...field} />
                  </FormControl>
                  <FormDescription>
                    <VisuallyHidden>Your Last Name</VisuallyHidden>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="---" {...field} disabled />
                </FormControl>
                <FormDescription>
                  This is your public display name. It can be your
                  real name or a pseudonym.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="---" {...field} disabled />
                </FormControl>
                <FormDescription>
                  This is the email address your account was created
                  with.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little bit about yourself"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  You can{" "}
                  <span>
                    <strong>@mention</strong>
                  </span>{" "}
                  other users to link to them.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            {fields.map((field, index) => (
              <FormField
                control={form.control}
                key={field.id}
                name={`urls.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={cn(index !== 0 && "sr-only")}
                    >
                      Socials
                    </FormLabel>
                    <FormDescription
                      className={cn(index !== 0 && "sr-only")}
                    >
                      Add links to your website, blog, or social media
                      profiles.
                    </FormDescription>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Input {...field} />
                        <TooltipProvider delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant={"destructive"}
                                className="rounded-md border-2 p-2"
                                onClick={() =>
                                  handleUrlDelete(field.name)
                                }
                              >
                                <Trash2 height={18} width={18} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{"Remove link"}</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link
                                href={field.value}
                                target={field.value ? "_blank" : ""}
                                className="rounded-md border-2 p-2"
                              >
                                <IconFromUrl url={field.value} />
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{"Visit link"}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => append({ value: "" })}
            >
              Add URL
            </Button>
          </div>
          <Button type="submit" disabled={update.isPending || !user}>
            {(!user || update.isPending) && (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            )}
            {update.isPending && <span>Updating...</span>}
            {user && !update.isPending && <span>Update profile</span>}
          </Button>
        </form>
      </Form>
    </>
  );
}
