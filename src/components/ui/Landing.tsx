"use client";

import React, { useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import ApiResponse from "@/lib/apiResponse";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";

function Landing() {
  const [prompt, setPrompt] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGenerateImage = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      if (!prompt) {
        return toast.error("Please provide prompt!");
      }
      setIsLoading(true);
      const response = await axios.post<ApiResponse>("/api/image-gen", {
        prompt,
      });
      console.log(response);
      if (response.data.success) {
        setImage(response.data.imageUrl || "");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message ??
        "Somthing went wrong during signup!";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadImage = async () => {
    const response = await fetch(image);
    const blob = await response.blob();

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "generated-image";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return (
    <div className="bg-black h-screen">
      <p className="bg-blue-900 text-white text-center font-normal text-xl py-3">
        We are in beta phase!
      </p>
      <div className="flex items-center justify-between bg-gray-900 p-4 rounded-2xl shadow-lg">
        <Link href="/" className="text-white text-2xl font-bold">
          PixelForge
        </Link>
        <Button
          onClick={() => signOut()}
          variant="outline"
          className="cursor-pointer"
        >
          Logout
        </Button>
      </div>

      <div className="bg-white w-full h-[1px]"></div>

      <form
        onSubmit={handleGenerateImage}
        className="flex mt-10 mx-10 gap-3 items-center justify-center "
      >
        <Input
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          placeholder="Enter prompt"
          className="text-white max-w-48"
        />

        <Button className="cursor-pointer" disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate"}
        </Button>
      </form>
      {image && (
        <div className="flex flex-col items-center justify-center mt-10 ">
          <Image
            src={image}
            height={100}
            width={100}
            className="w-[300px] h-[300px] rounded-2xl object-cover"
            alt="generated-image"
          />
          <Button
            onClick={handleDownloadImage}
            className="w-[300px] mt-3 cursor-pointer"
          >
            Download
          </Button>
        </div>
      )}
    </div>
  );
}

export default Landing;
