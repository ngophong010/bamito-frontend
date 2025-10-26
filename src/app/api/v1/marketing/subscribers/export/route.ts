import { NextResponse } from 'next/server';
import { mailchimp } from '@/lib/clients/mailchimp';
import { getUserSession } from '@/lib/auth/session';
import { ROLES } from '@/config/role';

/**
 * [ADMIN] Exports all subscribed members as a CSV file.
 */
export async function GET() {
    // 1. Server-Side Protection
    const session = await getUserSession();
    if (!session || session.role !== ROLES.ADMIN) {
        return NextResponse.json({ status: 'fail', message: 'Forbidden' }, { status: 403 });
    }

    try {
        // Fetch ALL members. Note: Mailchimp's default count is 10.
        // For a large list, you'd need to paginate through the results here.
        const response = await mailchimp.lists.getListMembersInfo(
            process.env.MAILCHIMP_AUDIENCE_ID!,
            { status: "subscribed", count: 1000 } // Fetch up to 1000
        );
        
        const members = response.members || [];
        
        // 2. Build the CSV content
        const csvHeader = "Email Address,First Name,Last Name,Status\n";
        const csvRows = members.map((member: any) => 
            [
                member.email_address,
                member.merge_fields?.FNAME || '',
                member.merge_fields?.LNAME || '',
                member.status
            ].join(',')
        ).join("\n");

        const csvContent = csvHeader + csvRows;

        // 3. Return a proper file response
        return new NextResponse(csvContent, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="bamito_subscribers_${new Date().toISOString().split('T')[0]}.csv"`,
            },
        });

    } catch (error: any) {
        console.error("Mailchimp API Error (Export):", error.response?.body || error.message);
        return NextResponse.json({ status: 'error', message: "Failed to export subscribers." }, { status: 500 });
    }
}
