import { voucherService } from '@/services/voucherService'; // Create this service
import EditVoucherClient from './EditVoucherClient';

export default async function EditVoucherPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);
    try {
        const voucher = await voucherService.getVoucherById(id);
        return <EditVoucherClient voucher={voucher} />;
    } catch (error) {
        return <div>Voucher không tồn tại.</div>;
    }
}
