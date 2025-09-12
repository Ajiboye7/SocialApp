import React from "react";
import { z } from "zod";
import { CommentValidation } from "@/lib/validations/threads";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { useRouter } from "next/navigation";
import { createComment } from "@/store/slices/threadSlice";

interface Props {
  parentId: string;
  user: string
}

const Comment = ({ parentId, user }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: "",
    },
  });

  async function onSubmit(data: z.infer<typeof CommentValidation>) {
    try {
      await dispatch(
        createComment({
          thread: data.thread,
          parentId,
        })
      ).unwrap();
    } catch (error: any) {
      console.log("Error creating comment", error);
      alert(error || "Something went wrong");
    }
  }

 

  return (
    <Form {...form}>
      <form
        className="mt-10 flex items-center gap-4 border-y border-y-dark-4 py-5 max-xs:flex-col !important"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex w-full items-center gap-3">
              <FormLabel>
                <Image
                  src={user}
                  alt="current_user"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  type="text"
                  {...field}
                  placeholder="Comment..."
                  className=" outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 !important text-light-1 "
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="rounded-3xl bg-primary-500 px-8 py-2 !text-small-regular text-light-1 max-xs:w-full !important"
        >
          Reply
        </Button>
      </form>
    </Form>
  );
};

export default Comment;
