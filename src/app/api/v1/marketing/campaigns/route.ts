import { NextResponse } from 'next/server';
import { mailchimp } from '@/lib/clients/mailchimp'; // Assuming you create a central mailchimp config
import { getUserSession } from '@/lib/auth/session'; // Our server-side auth helper
import { ROLES } from '@/config/role';

// ===============================================================
// --- GET /api/v1/marketing/campaigns ---
// ===============================================================
/**
 * [ADMIN] Fetches a list of all Mailchimp campaigns.
 */
export async function GET() {
    // 1. Server-Side Protection
    const session = await getUserSession();
    if (!session || session.role !== ROLES.ADMIN) {
        return NextResponse.json(
            { status: 'fail', message: 'Forbidden: Admin access required.' },
            { status: 403 }
        );
    }
    
    try {
        const response = await mailchimp.campaigns.list({
            count: 50, // Best practice: add pagination
            sort_field: "create_time",
            sort_dir: "DESC",
        });

        // 2. Standardized Success Response
        return NextResponse.json({ status: "success", data: response.campaigns });

    } catch (error: any) {
        console.error("Mailchimp API Error (List Campaigns):", error.response?.body || error.message);
        
        // 3. Safe, Standardized Error Response
        return NextResponse.json(
            { status: 'error', message: 'Failed to fetch campaigns from Mailchimp.' },
            { status: 500 }
        );
    }
}


// ===============================================================
// --- POST /api/v1/marketing/campaigns ---
// (This is a bad route. We will split it into two RESTful routes)
// ===============================================================
// The original POST did two things: replicate AND send. This is not RESTful.
// A better pattern is one endpoint to create (replicate) and another to send.
// However, to match your logic, let's keep it in one but rename the route.
// A better route would be POST /api/v1/marketing/campaigns/[id]/send

// Let's assume you create a new route for this:
// /src/app/api/v1/marketing/campaigns/[id]/send/route.ts
//
// export async function POST(req: Request, { params }: { params: { id: string } }) { ... }

// For now, let's just refactor your existing POST handler.
// This should be in a file like `/api/v1/marketing/campaigns/send/route.ts`
export async function POST(req: Request) {
    // 1. Server-Side Protection
    const session = await getUserSession();
    if (!session || session.role !== ROLES.ADMIN) {
        return NextResponse.json({ status: 'fail', message: 'Forbidden.' }, { status: 403 });
    }

    try {
        const body = await req.json();
        
        // 2. Input Validation
        const campaignIdToReplicate = body.id;
        if (!campaignIdToReplicate || typeof campaignIdToReplicate !== 'string') {
            return NextResponse.json(
                { status: 'fail', message: 'A valid campaign ID is required.' },
                { status: 400 }
            );
        }

        // Replicate the campaign to create a draft
        const replicatedCampaign = await mailchimp.campaigns.replicate(campaignIdToReplicate);
        
        // Send the newly created draft
        await mailchimp.campaigns.send(replicatedCampaign.id);

        // 3. Standardized Success Response
        return NextResponse.json(
            { status: "success", data: { newCampaignId: replicatedCampaign.id, message: "Campaign has been sent successfully." } },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Mailchimp API Error (Send Campaign):", error.response?.body || error.message);
        
        // 4. Safe, Standardized Error Response
        return NextResponse.json(
            { status: 'error', message: 'Failed to send campaign via Mailchimp.' },
            { status: 500 }
        );
    }
}
