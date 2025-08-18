
import mailchimp from "@/config/mailchimp";
import CryptoJS from "crypto-js";
import { NextResponse } from "next/server";

const hashMD5 = (str) => {
  return CryptoJS.MD5(str.toLowerCase()).toString();
};

const isEmailValid = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

//add new email or update existed email
export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email || !isEmailValid(email)) {
      return NextResponse.json(
        { message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const emailMd5 = hashMD5(email);
  
    const response = await mailchimp.lists.addListMember(
      process.env.MAILCHIMP_AUDIENCE_ID,
      emailMd5,
      {
        email_address: email,
        status: "subscribed",
        status_if_new: "subscribed",
      }
    );

    return NextResponse.json({
      message: "Email subscribed successfully.",
      status: response.status,
    })

  } catch (error) {
    console.error("Mailchimp API Error:", error.response?.body || error.message);

    return NextResponse.json(
      { message: "This email is already subscribed or an error occurred." },
      { status: 400 } // Use a 400 or 409 (Conflict) status for duplicates
    );
  }
}
//get all email pagination
export async function GET(req) {
  try {
    const {searchParams} = new URL(req.url);
    const offset = parseInt(searchParams.get("offset")) || 0;
    const count = parseInt(searchParams.get("count")) || 10;

    const response = await mailchimp.lists.getListMembersInfo(
      process.env.MAILCHIMP_AUDIENCE_ID,
      {
        count: count,
        offset: offset,
        status: "subscribed",
      }
    );
    // console.log(response)

    return NextResponse.json({
      members: response.members,
      total_items: response.total_items,
    });
  } catch (error) {
    console.error("Mailchimp API Error:", error.response?.body || error.message);
    return NextResponse.json(
      { message: "Failed to fetch list members." },
      { status: 500 }
    );
  }
}
//unsubscribe email
export async function PUT(req) {
  try {
    const { emailToUnsubscribe } = await req.json();

    if (!emailToUnsubscribe || !isEmailValid(emailToUnsubscribe.email)) {
      return NextResponse.json(
        { message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const emailMd5 = hashMD5(emailToUnsubscribe.email);

    await mailchimp.lists.deleteListMember(
      process.env.MAILCHIMP_AUDIENCE_ID,
      emailMd5,
      {
        status: "unsubscribed",
      }
    );

    // const response = await mailchimp.lists.setListMember(
    //   emailToUnsubscribe.list_id,
    //   emailToUnsubscribe.id,
    //   {
    //     status: "unsubscribed",
    //   }
    // );

    // console.log(response);

    return NextResponse.json({ message: "Successfully unsubscribed." });
  } catch (error) {
    console.error("Mailchimp API Error:", error.response?.body || error.message);
    return NextResponse.json(
      { message: "Failed to unsubscribe email." },
      { status: 500 }
    );
  }
}

