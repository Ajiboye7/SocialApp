"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useState, ChangeEvent } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { profileValidation } from "@/lib/validations/profile";
import { Textarea } from "../ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUploadThing } from "@/lib/uploadthing";
import { isBase64Image } from "@/lib/utils";
import { updateUser } from "@/store/slices/userSlice";
import { useDispatch, UseDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";

interface Props {
  user: {
    id: string;
    //objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}

const AccountProfile = ({ user, btnTitle }: Props) => {
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();
  const { startUpload } = useUploadThing("imageUploader");
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<z.infer<typeof profileValidation>>({
    resolver: zodResolver(profileValidation),
    defaultValues: {
      profile_photo: user?.image || "",
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        profile_photo: user.image || "",
        name: user.name || "",
        username: user.username || "",
        bio: user.bio || "",
      });
    }
  }, [user, form]);

  async function onSubmit(data: z.infer<typeof profileValidation>) {
    const blob = data.profile_photo;

    const hasImageChanged = isBase64Image(blob);

    if (hasImageChanged) {
      const imgRes = await startUpload(files);

      if (imgRes && imgRes[0].ufsUrl) {
        data.profile_photo = imgRes[0].ufsUrl;
      }
    }
    try {
      await dispatch(
        updateUser({
          bio: data.bio,
          name: data.name,
          userName: data.username,
          profile_picture: data.profile_photo,
        })
      ).unwrap();

      router.push("/");
    } catch (error: any) {
      console.log("Error creating thread", error);
      alert(
        typeof error === "string"
          ? error
          : error.message || "Something went wrong"
      );
    }
  }

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full mt-10 flex flex-col gap-8"
      >
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4 w-fit">
              <FormLabel>
                {field.value ? (
                  <Image
                    src={field.value}
                    alt="profile_icon"
                    width={96}
                    height={96}
                    priority
                    className="rounded-full object-contain"
                  />
                ) : (
                  <Image
                    src="/assets/profile.svg"
                    alt="profile_icon"
                    width={54}
                    height={54}
                    className="object-contain"
                  />
                )}
              </FormLabel>
              <FormControl className="flex-1 text-gray-200 text-[16px] leading-[140%] font-[600]">
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Add profile photo"
                  className=" cursor-pointer border-none bg-transparent outline-none file:text-blue"
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Jon Doe"
                  className="text-light-1 border border-dark-4 bg-dark-3 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Username</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Jon Doe"
                  className="text-light-1 border border-dark-4 bg-dark-3 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is your public display name.
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
              <FormLabel className="text-white">Bio</FormLabel>
              <FormControl>
                <Textarea
                  rows={10}
                  className="w-full h-70 text-light-1 border border-dark-4 bg-dark-3 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="px-4 py-2 bg-primary-500 text-white font-semibold rounded w-full hover:bg-dark-2"
        >
          {btnTitle}
        </Button>
      </form>
    </Form>
  );
};

export default AccountProfile;
