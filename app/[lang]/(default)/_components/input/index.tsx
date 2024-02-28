"use client";

import { KeyboardEvent, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { toast } from "sonner";

const phoneAreaCodes = ["+1", "+86", "+44", "+91", "+81", "+61"]; // 这里列出一些示例的区号

export default function ({ dict }: { dict: any }) {
  const params = useParams();

  const router = useRouter();
  const [isEmail, setIsEmail] = useState(true); // 默认是邮箱
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [phoneAreaCode, setPhoneAreaCode] = useState(phoneAreaCodes[1]); // 默认选择第一个区号

  const handleSubmit = async () => {
    if (isEmail) {
      if (!emailOrPhone) {
        toast.error("please enter your email");
        return;
      }
    } else {
      if (!emailOrPhone) {
        toast.error("please enter your phone number");
        return;
      }
    }

    try {
      const params = isEmail
        ? { email: emailOrPhone }
        : { phone: `${phoneAreaCode}${emailOrPhone}` };

      const resp = await fetch("/api/save-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      const { code, message, data } = await resp.json();
      if (code !== 0) {
        toast.error(message);
        return;
      }
      if (data) {
        toast.success("Thanks for your subscription, see you later");
        setEmailOrPhone("");
      }
    } catch (e) {
      toast.error("subscribe failed");
      console.log("subscribe failed", e);
    }
  };

  const handleInputKeydown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter" && !e.shiftKey) {
      if (e.keyCode !== 229) {
        e.preventDefault();
        handleSubmit();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailOrPhone(e.target.value);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPhoneAreaCode(e.target.value);
  };

  return (
    <div className="mx-auto mt-6 flex max-w-lg gap-x-4">
      <select
        value={isEmail ? "email" : "phone"}
        onChange={(e) => {
          setIsEmail(e.target.value === "email");
        }}
        className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-1.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
      >
        <option value="email">Email</option>
        <option value="phone">Phone</option>
      </select>
      {!isEmail && (
        <select
          value={phoneAreaCode}
          onChange={handleSelectChange}
          className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
        >
          {phoneAreaCodes.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      )}
      <input
        type={isEmail ? "email" : "tel"}
        required
        className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
        placeholder={
          isEmail
            ? dict.subscribe.placeholderEmail
            : dict.subscribe.placeholderPhone
        }
        value={emailOrPhone}
        onChange={handleInputChange}
        onKeyDown={handleInputKeydown}
      />
      <button
        type="button"
        className="flex-none rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        onClick={handleSubmit}
      >
        {dict.subscribe.button}
      </button>
    </div>
  );
}
