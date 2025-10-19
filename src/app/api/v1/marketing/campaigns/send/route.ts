import { NextResponse } from 'next/server';
import { mailchimp } from '@/lib/mailchimp';
import { getUserSession } from '@/lib/auth/session';
import { ROLES } from '@/config/role';

/**
 * [ADMIN] Sends a specific draft campaign.
 * Expects a JSON body with { campaignId: "..." }
 * @route POST /api/v1/marketing/campaigns/send
 */
export async function POST(req: Request) {
    // 1. Server-Side Protection
    const session = await getUserSession();
    if (!session || session.role !== ROLES.ADMIN) {
        return NextResponse.json({ status: 'fail', message: 'Forbidden' }, { status: 403 });
    }

    try {
        const body = await req.json();

        // 2. Input Validation
        const campaignIdToSend = body.campaignId;
        if (!campaignIdToSend || typeof campaignIdToSend !== 'string') {
            return NextResponse.json(
                { status: 'fail', message: 'A valid campaignId to send is required.' },
                { status: 400 }
            );
        }

        // 3. Make the API call to send the campaign
        await mailchimp.campaigns.send(campaignIdToSend);

        // 4. Return a simple success message
        return NextResponse.json(
            { status: "success", message: `Campaign ${campaignIdToSend} has been sent.` },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Mailchimp API Error (Send Campaign):", error.response?.body || error.message);
        
        // Handle specific errors from Mailchimp if possible
        if (error.response?.body?.title === 'Campaign In Send Process') {
             return NextResponse.json(
                { status: 'fail', message: 'This campaign is already in the process of being sent.' },
                { status: 409 } // 409 Conflict is a good status code for this
            );
        }

        return NextResponse.json(
            { status: 'error', message: 'Failed to send campaign.' },
            { status: 500 }
        );
    }
}
