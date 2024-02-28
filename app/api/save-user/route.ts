import { respData, respErr } from "@/lib/resp";

import { User } from "@/types/user";
import { genUuid } from "@/lib";
import { saveUser } from "@/services/user";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    let email: string = body.email ?? "";
    let phone: string = body.phone ?? "";

    if (!email && !phone) {
      return respErr("invalid params");
    }
    if (email && !email.includes("@")) {
      return respErr("invalid email");
    }
    if (phone && !isValidPhoneNumber(phone)) {
      return respErr("invalid phone number");
    }

    const created_at = new Date().toISOString();
    const user_uuid = genUuid();

    const user: User = {
      email: email,
      phone: phone,
      nickname: "",
      avatar_url: "",
      created_at: created_at,
      uuid: user_uuid,
    };
    console.log("save user info", user);

    await saveUser(user);

    return respData(user);
  } catch (e) {
    console.log("save user failed", e);
    return respErr("save user failed");
  }
}

function isValidPhoneNumber(phoneNumber: string): boolean {
  // 使用正则表达式匹配电话号码的模式
  const phonePattern = /^\+\d+$/;
  // 检查是否匹配模式并且字符串长度是否合适
  return phonePattern.test(phoneNumber);
}
