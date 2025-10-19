import { NextResponse, NextRequest } from 'next/server';
import crypto from 'crypto'; // Use Node.js built-in crypto module
import { mailchimp } from '@/lib/mailchimp';
import { getUserSession } from '@/lib/auth/session';
import { ROLES } from '@/config/role';

// Helper function for MD5 hashing
const createMd5Hash = (str: string) => {
  return crypto.createHash('md5').update(str.toLowerCase()).digest('hex');
};

// ===============================================================
// --- GET /api/v1/marketing/subscribers ---
// ===============================================================
/**
 * [ADMIN] Fetches a paginated list of subscribed members.
 */
export async function GET(req: NextRequest) {
    // 1. Server-Side Protection: ONLY ADMINS can view the subscriber list.
    const session = await getUserSession();
    if (!session || session.role !== ROLES.ADMIN) {
        return NextResponse.json({ status: 'fail', message: 'Forbidden' }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const offset = parseInt(searchParams.get("offset") || '0', 10);
        const count = parseInt(searchParams.get("count") || '10', 10);

        const response = await mailchimp.lists.getListMembersInfo(
            process.env.MAILCHIMP_AUDIENCE_ID!,
            { count, offset, status: "subscribed" }
        );

        return NextResponse.json({ status: 'success', data: response });
    } catch (error: any) {
        console.error("Mailchimp API Error (GET Subscribers):", error.response?.body || error.message);
        return NextResponse.json({ status: 'error', message: "Failed to fetch list members." }, { status: 500 });
    }
}

// ===============================================================
// --- POST /api/v1/marketing/subscribers ---
// ===============================================================
/**
 * [PUBLIC] Subscribes a new email address to the list.
 */
export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ status: 'fail', message: "Please provide a valid email address." }, { status: 400 });
    }

    // Using `setListMember` with `status_if_new` is the modern "upsert" way.
    // It will subscribe a new user or re-subscribe an unsubscribed one.
    const response = await mailchimp.lists.setListMember(
      process.env.MAILCHIMP_AUDIENCE_ID!,
      createMd5Hash(email),
      {
        email_address: email,
        status_if_new: "subscribed",
      }
    );

    return NextResponse.json({ status: 'success', data: { message: "Email subscribed successfully.", id: response.id } });

  } catch (error: any) {
    console.error("Mailchimp API Error (POST Subscriber):", error.response?.body || error.message);
    // Check if it's a "Member Exists" error from Mailchimp
    if (error.response?.body?.title === 'Member Exists') {
        return NextResponse.json({ status: 'fail', message: "This email is already subscribed." }, { status: 409 }); // 409 Conflict
    }
    return NextResponse.json({ status: 'error', message: "An error occurred during subscription." }, { status: 500 });
  }
}

// ===============================================================
// --- DELETE /api/v1/marketing/subscribers ---
// ===============================================================
/**
 * [ADMIN] Unsubscribes (archives) a member from the list.
 * Note: Mailchimp prefers archiving (unsubscribing) over permanent deletion.
 */
export async function DELETE(req: NextRequest) {
    // 1. Server-Side Protection: ONLY ADMINS can delete subscribers.
    const session = await getUserSession();
    if (!session || session.role !== ROLES.ADMIN) {
        return NextResponse.json({ status: 'fail', message: 'Forbidden' }, { status: 403 });
    }
    
    try {
        const { email } = await req.json();
        if (!email || typeof email !== 'string') {
            return NextResponse.json({ status: 'fail', message: 'Please provide a valid email address.' }, { status: 400 });
        }

        const emailMd5 = createMd5Hash(email);

        // This method updates the member's status to 'unsubscribed'.
        await mailchimp.lists.updateListMember(
            process.env.MAILCHIMP_AUDIENCE_ID!,
            emailMd5,
            { status: "unsubscribed" }
        );

        return new NextResponse(null, { status: 204 }); // 204 No Content is standard for successful DELETE
    } catch (error: any) {
        console.error("Mailchimp API Error (DELETE Subscriber):", error.response?.body || error.message);
        return NextResponse.json({ status: 'error', message: "Failed to unsubscribe email." }, { status: 500 });
    }
}
