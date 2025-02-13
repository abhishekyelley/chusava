"use client";

import { MediaCard } from "@/components/chats/media-card";
import { MessageCard } from "@/components/chats/message-card";
import { MessageCardSkeleton } from "@/components/chats/message-card-skeleton";
import { Paginator } from "@/components/common/paginator";
import { NoResults } from "@/components/dashboard/friends/no-results";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useConversation } from "@/hooks/use-conversations";
import { useDebounce } from "@/hooks/use-debounce";
import { useLists } from "@/hooks/use-lists";
import axios from "@/lib/axios";
import { paths } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Message } from "@/types/api/messages";
import {
  MovieSearchResponse,
  TVSearchResponse,
} from "@/types/tmdb/tmdb";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosedIcon } from "@radix-ui/react-icons";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { CommandLoading } from "cmdk";
import {
  Eye,
  Film,
  Filter,
  Loader,
  Popcorn,
  Search,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

function isMovie(
  media: MovieSearchResponse | TVSearchResponse
): media is MovieSearchResponse {
  return media.results
    ? media.results.length !== 0
      ? (
          media.results[0] as NonNullable<
            MovieSearchResponse["results"]
          >[0]
        ).title !== undefined
      : true
    : true;
}

function isTV(
  media: MovieSearchResponse | TVSearchResponse
): media is TVSearchResponse {
  return media.results
    ? media.results.length !== 0
      ? (
          media.results[0] as NonNullable<
            TVSearchResponse["results"]
          >[0]
        ).name !== undefined
      : false
    : false;
}

const FilterFormSchema = z.object({
  watched: z
    .union([z.literal("true"), z.literal("false"), z.null()])
    .optional(),
});

export default function Page({
  params: { listId, conversationId },
}: {
  params: { listId: string; conversationId: string };
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [recSearch, setRecSearch] = useState("");
  const [type, setType] = useState("movie");
  const [adult, setAdult] = useState(false);
  const [page, setPage] = useState(1);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const query = useDebounce(value, 300);
  const queryClient = useQueryClient();
  const conversationData = useConversation(conversationId);
  const lists = useLists(conversationId);
  const listData = lists.find((item) => item.list_id === listId);
  const filtersForm = useForm<z.infer<typeof FilterFormSchema>>({
    resolver: zodResolver(FilterFormSchema),
    defaultValues: {
      watched: null,
    },
  });
  const [filters, setFilters] = useState<
    z.infer<typeof FilterFormSchema>
  >({});
  const messages = useQuery<Message[]>({
    queryKey: ["messages", listId, filters],
    queryFn: async ({ signal }) => {
      const searchParams = new URLSearchParams();
      Object.keys(filters).forEach((item) => {
        const key = item as keyof typeof filters;
        searchParams.append(key, String(filters[key]));
      });
      searchParams.append;
      const response = await axios.get<Message[]>(
        paths.api.messages`${listId}` + "?" + searchParams.toString(),
        { signal }
      );
      return response.data;
    },
  });
  const media = useQuery({
    queryKey: ["media", type, query, adult, page],
    queryFn: async ({ signal }) => {
      const q = query.trim().toLowerCase();
      if (!q || q === "" || (type !== "movie" && type !== "tv")) {
        return null;
      }
      if (type === "movie") {
        const response = await axios.get<MovieSearchResponse>(
          `/api/tmdb?query=${q}&type=movie&include_adult=${adult}&page=${page}`,
          { signal }
        );
        return response.data;
      }
      if (type === "tv") {
        const response = await axios.get<TVSearchResponse>(
          `/api/tmdb?query=${q}&type=tv`,
          { signal }
        );
        return response.data;
      }
    },
    staleTime: Infinity,
  });
  const sendMessage = useMutation({
    mutationFn: async ({
      tmdb_id,
      tmdb_type,
    }: {
      tmdb_id: number;
      tmdb_type: "movie" | "tv";
    }) => {
      const response = await axios.post(
        paths.api.messages`${listId}`,
        { tmdb_id, tmdb_type }
      );
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["messages", listId, filters],
      });
      setOpen(false);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Rec already exists in list");
    },
  });
  const deleteMessage = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete<null>(
        paths.api.messagesId`${id}`
      );
      return response.data;
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({
        queryKey: ["messages", listId, filters],
      });
      const oldData = queryClient.getQueryData<Message[]>([
        "messages",
        listId,
      ]);
      queryClient.setQueryData<Message[]>(
        ["messages", listId, filters],
        (old) => {
          return old ? old.filter((item) => item.id !== id) : [];
        }
      );
      return oldData;
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", listId, filters],
        exact: true,
        refetchType: "all",
      });
    },
    onError: (error, data, context) => {
      queryClient.setQueryData<Message[]>(
        ["messages", listId, filters],
        context as Message[]
      );
      toast.error("Could not delete the rec");
      console.error(error);
    },
    onSuccess: () => {
      toast.success("Rec deleted");
    },
  });
  const watchedInsert = useMutation<
    null,
    Error,
    { id: string; tmdb_type: string; tmdb_id: number }
  >({
    mutationFn: async ({ tmdb_type, tmdb_id }) => {
      const response = await axios.post(
        paths.api.tmdb.watched`${tmdb_type}${tmdb_id}`
      );
      return response.data;
    },
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({
        queryKey: ["messages", listId, filters],
      });
      const oldData = queryClient.getQueryData<Message[]>([
        "messages",
        listId,
      ]);
      queryClient.setQueryData<Message[]>(
        ["messages", listId, filters],
        (old) => {
          return old
            ? old.map((item) =>
                item.id !== id ? item : { ...item, watched: true }
              )
            : [];
        }
      );
      return oldData;
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", listId, filters],
        exact: true,
        refetchType: "all",
      });
    },
    onError: (error, data, context) => {
      queryClient.setQueryData<Message[]>(
        ["messages", listId, filters],
        context as Message[]
      );
      toast.error("Could not add rec to watched");
      console.error(error);
    },
  });
  const watchedDelete = useMutation<
    null,
    Error,
    { id: string; tmdb_type: string; tmdb_id: number }
  >({
    mutationFn: async ({ tmdb_type, tmdb_id }) => {
      const response = await axios.delete<null>(
        paths.api.tmdb.watched`${tmdb_type}${tmdb_id}`
      );
      return response.data;
    },
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({
        queryKey: ["messages", listId, filters],
      });
      const oldData = queryClient.getQueryData<Message[]>([
        "messages",
        listId,
      ]);
      queryClient.setQueryData<Message[]>(
        ["messages", listId, filters],
        (old) => {
          return old
            ? old.filter((item) =>
                item.id !== id ? item : { ...item, watched: false }
              )
            : [];
        }
      );
      return oldData;
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", listId, filters],
        exact: true,
        refetchType: "all",
      });
    },
    onError: (error, data, context) => {
      queryClient.setQueryData<Message[]>(
        ["messages", listId],
        context as Message[]
      );
      toast.error("Could not remove rec from watched");
      console.error(error);
    },
  });
  useEffect(() => {
    if (!messages.isLoading) {
      lastMessageRef.current
        ? lastMessageRef.current.scrollIntoView()
        : null;
    }
  }, [messages.isLoading]);
  useEffect(() => {
    setPage(1);
  }, [query]);
  const handlePageChange = useCallback(
    (num: number) => setPage(num),
    []
  );
  const filtersApplied = useCallback(() => {
    let count = 0;
    Object.keys(filters).forEach((item) => {
      const key = item as keyof typeof filters;
      if (!!filters[key]) {
        count++;
      }
    });

    return count;
  }, [filters]);
  const onSubmit = useCallback(
    (data: z.infer<typeof FilterFormSchema>) => {
      setFilters({ ...data });
      setFiltersOpen(false);
    },
    []
  );
  return (
    <div className="w-full rounded-r-xl">
      <div className="rounded-tr-xl sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
        <div className="mx-2 sm:mx-4 flex py-3 items-center">
          <div className="flex items-center">
            <div className="cursor-pointer w-max">
              <div className="flex items-center">
                <div className="mr-4">
                  <Avatar className="h-12 w-12 border border-gray-600 justify-center z-20">
                    <AvatarFallback className="bg-transparent self-center">
                      {conversationData?.first_name?.charAt(0)
                        ? conversationData?.first_name?.charAt(0) +
                          conversationData?.last_name?.charAt(0)
                        : "?"}
                    </AvatarFallback>
                    <AvatarImage
                      className="object-cover"
                      src={conversationData?.avatar}
                    />
                  </Avatar>
                </div>
                <div className="block">
                  <p className="font-semibold">
                    {conversationData?.first_name}{" "}
                    {conversationData?.last_name}
                  </p>
                  <p className="text-muted-foreground">
                    {listData?.list.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-1 items-center space-x-2 justify-end">
            <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn("rounded-full", "h-12 w-12 p-1")}
                >
                  <div className="relative">
                    <Filter
                      className={cn(
                        filtersApplied() ? "text-primary" : ""
                      )}
                    />
                    {filtersApplied() > 0 && (
                      <Badge className="absolute flex justify-center w-full left-4 -top-3 rounded-full">
                        <span className="text-center items-center self-center">
                          {filtersApplied()}
                        </span>
                      </Badge>
                    )}
                  </div>
                </Button>
              </DialogTrigger>
              <div className="h-full"></div>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Filter</DialogTitle>
                  <DialogDescription>
                    Filter your recs.
                  </DialogDescription>
                </DialogHeader>
                <Form {...filtersForm}>
                  <form onSubmit={filtersForm.handleSubmit(onSubmit)}>
                    <FormField
                      control={filtersForm.control}
                      name="watched"
                      render={({ field }) => (
                        <FormItem>
                          <div className="grid grid-cols-6 items-center">
                            <FormLabel className="col-span-2">
                              Watched
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value || ""}
                              value={field.value || ""}
                            >
                              <FormControl className="col-span-3">
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Watched</SelectLabel>
                                  <SelectItem value="true">
                                    <span className="flex items-center">
                                      <EyeClosedIcon className="mr-2" />
                                      Watched
                                    </span>
                                  </SelectItem>
                                  <SelectItem value="false">
                                    <span className="flex items-center">
                                      <Eye className="mr-2" />
                                      Unwatched
                                    </span>
                                  </SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <Button
                              className="col-span-1"
                              variant="outline"
                              type="button"
                              onClick={() =>
                                filtersForm.setValue("watched", null)
                              }
                            >
                              Clear
                            </Button>
                          </div>
                          <FormDescription className="text-right">
                            Filter recs by your watched status
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter
                      className="mt-4 grid grid-cols-4 gap-2"
                      dir="rtl"
                    >
                      <Button
                        type="reset"
                        className="col-span-1 -order-1"
                        variant="destructive"
                        onClick={() => {
                          filtersForm.reset();
                          setFilters({});
                          setFiltersOpen(false);
                        }}
                      >
                        Clear All
                      </Button>
                      <Button
                        type="submit"
                        className="col-span-1 -order-2"
                      >
                        Apply
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              className="rounded-full h-12 w-12 p-1"
            >
              <Search />
            </Button>
          </div>
        </div>
      </div>
      <CommandDialog
        open={open}
        onOpenChange={(val) => {
          if (val === false) {
            setAdult(false);
            setType("movie");
            setPage(1);
            setValue("");
          }
          setOpen(val);
        }}
        commandProps={{ shouldFilter: false }}
        title="Media search"
        description="Search for a movie or tv show to send as a message"
      >
        <div className="flex w-[calc(100%-48px)]">
          <div className="w-full">
            <CommandInput
              placeholder="Type a command or search..."
              value={value}
              onValueChange={setValue}
            />
          </div>
          <div className="flex flex-col justify-center self-center">
            <Select
              value={type}
              onValueChange={(val) => {
                setPage(1);
                setType(val);
              }}
            >
              <SelectTrigger className="w-24 h-12 m-0 border-l border-t-0 rounded-none">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Type</SelectLabel>
                  <SelectItem value="tv">TV</SelectItem>
                  <SelectItem value="movie">Movie</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div
            className={cn(
              "w-max flex px-2 pr-4 space-x-2",
              "border-l-0 border-r border-b rounded-br-md",
              "self-center items-center h-12"
            )}
          >
            <Switch
              className="m-0 p-0"
              id="adult"
              checked={adult}
              onCheckedChange={(checked) => {
                setPage(1);
                setAdult(checked);
              }}
            />
            <label
              htmlFor="adult"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Adult
            </label>
          </div>
        </div>
        <CommandList
          className={cn(
            "overflow-y-auto",
            "[&::-webkit-scrollbar-thumb]:rounded-md",
            "[&::-webkit-scrollbar]:w-2",
            "[&::-webkit-scrollbar-track]:bg-secondary",
            "[&::-webkit-scrollbar-thumb]:bg-primary",
            "max-h-[60vh]"
          )}
        >
          {media.isLoading ? (
            <CommandLoading className="my-4">
              <NoResults
                message="Loading..."
                subtitle="Finding stuff"
                icon={Loader}
                spin
              />
            </CommandLoading>
          ) : (
            <CommandEmpty>
              <NoResults
                message="Keep looking"
                subtitle="Cause we found nutthin'"
              />
            </CommandEmpty>
          )}
          <div className="grid grid-cols-3">
            {media.data &&
              type === "movie" &&
              isMovie(media.data) &&
              media.data.results &&
              media.data.results.map((item) => (
                <CommandItem
                  key={item.id}
                  value={String(item.id)}
                  className="space-x-2 m-2"
                >
                  <MediaCard
                    id={item.id}
                    poster_path={item.poster_path}
                    release_date={item.release_date}
                    sendMessage={() =>
                      sendMessage.mutate({
                        tmdb_id: item.id,
                        tmdb_type: type,
                      })
                    }
                    title={item.title}
                    type={type}
                  />
                </CommandItem>
              ))}
            {media.data &&
              type === "tv" &&
              isTV(media.data) &&
              media.data.results &&
              media.data.results.map((item) => (
                <CommandItem
                  key={item.id}
                  value={String(item.id)}
                  className="space-x-2 m-2"
                >
                  <MediaCard
                    id={item.id}
                    poster_path={item.poster_path}
                    release_date={item.first_air_date}
                    sendMessage={() =>
                      sendMessage.mutate({
                        tmdb_id: item.id,
                        tmdb_type: type,
                      })
                    }
                    title={item.name}
                    type={type}
                  />
                </CommandItem>
              ))}
          </div>
        </CommandList>
        <div className="my-4">
          <Paginator
            total_pages={media.data?.total_pages}
            total_results={media.data?.total_results}
            page={page}
            handleChange={handlePageChange}
          />
        </div>
      </CommandDialog>
      {/* Real stuff start here */}
      <ScrollArea
        className="h-[calc(80dvh-48px-72px)] w-full"
        type="hover"
      >
        <div className="p-8">
          {messages.isLoading && (
            <>
              <MessageCardSkeleton sender={true} />
              <MessageCardSkeleton sender={false} />
              <MessageCardSkeleton sender={true} />
              <MessageCardSkeleton sender={true} />
              <MessageCardSkeleton sender={false} />
            </>
          )}
          {messages.isError && <h1>Error!</h1>}
          {messages.data && messages.data.length === 0 && (
            <NoResults
              message="Ya'll need to start something"
              subtitle="Send a rec. Press the button"
              icon={Popcorn}
            />
          )}
          {messages.data &&
            messages.data.length > 0 &&
            messages.data.map((item, index) => (
              <div
                key={item.id!}
                ref={
                  index === messages.data.length - 1
                    ? lastMessageRef
                    : undefined
                }
              >
                <MessageCard
                  {...item}
                  conversationId={conversationId}
                  deleteMutate={() => deleteMessage.mutate(item.id!)}
                  deletePending={deleteMessage.isPending}
                  addToWatched={() =>
                    watchedInsert.mutate({
                      id: item.id!,
                      tmdb_id: item.tmdb_id!,
                      tmdb_type: item.tmdb_type!,
                    })
                  }
                  removeFromWatched={() =>
                    watchedDelete.mutate({
                      id: item.id!,
                      tmdb_id: item.tmdb_id!,
                      tmdb_type: item.tmdb_type!,
                    })
                  }
                />
              </div>
            ))}
        </div>
      </ScrollArea>
      <form
        className={cn(
          "h-[48px] flex items-center justify-center",
          "rounded-br-lg border-t",
          "focus-within:outline-none focus-within:ring-1 focus-within:ring-ring px-1"
        )}
        onSubmit={(e) => {
          e.preventDefault();
          setOpen(true);
          setValue(recSearch);
          setRecSearch("");
        }}
      >
        <div className="relative w-full h-full">
          <Input
            className="pl-9 disabled:cursor-default h-full border-none focus-visible:ring-0"
            placeholder="Send a Rec..."
            id="rec-search"
            name="rec-search"
            value={recSearch}
            autoComplete="off"
            onChange={(e) => setRecSearch(e.target.value)}
          />
          <Label htmlFor="placeholder-search">
            <Film className="absolute left-0 top-1.5 m-2.5 h-4 w-4 text-muted-foreground" />
          </Label>
        </div>
        <Button type="submit" variant="ghost" disabled={!recSearch}>
          <Search />
        </Button>
      </form>
      {/* <div className="h-[72px] flex items-center justify-center">
      </div> */}
    </div>
  );
}
