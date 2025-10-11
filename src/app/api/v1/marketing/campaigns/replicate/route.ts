import { NextResponse } from 'next/server';
import { mailchimp } from '@/lib/mailchimp';
import { getUserSession } from '@/lib/auth/session';
import { ROLES } from '@/config/roles';

/**
 * [ADMIN] Creates a new draft campaign by replicating an existing one.
 * Expects a JSON body with { templateId: "..." }
 * @route POST /api/v1/marketing/campaigns/replicate
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
        const templateId = body.templateId;
        if (!templateId || typeof templateId !== 'string') {
            return NextResponse.json(
                { status: 'fail', message: 'A valid templateId is required.' },
                { status: 400 }
            );
        }

        // 3. Make the API call
        const replicatedCampaign = await mailchimp.campaigns.replicate(templateId);

        // 4. Return the ID of the NEWLY created draft campaign
        return NextResponse.json(
            { 
                status: "success", 
                data: { 
                    newCampaignId: replicatedCampaign.id,
                    webId: replicatedCampaign.web_id, // Useful for a "view in browser" link
                    status: replicatedCampaign.status // Should be 'save' (draft)
                } 
            },
            { status: 201 } // 201 Created is the correct status code here
        );

    } catch (error: any) {
        console.error("Mailchimp API Error (Replicate Campaign):", error.response?.body || error.message);
        
        return NextResponse.json(
            { status: 'error', message: 'Failed to create draft campaign.' },
            { status: 500 }
        );
    }
}
