import { getVoucherById } from '@/services/voucherService'; // Create this service
import EditVoucherClient from './EditVoucherClient';

export default async function EditVoucherPage({ params }: { params: { id: string } }) {
    const id = Number(params.id);
    try {
        const voucher = await getVoucherById(id);
        return <EditVoucherClient voucher={voucher} />;
    } catch (error) {
        return <div>Voucher không tồn tại.</div>;
    }
}
