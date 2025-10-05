import { getBrandById } from '@/services/brandService'; // You'll need to create this service
import BrandEditClient from './BrandEditClient';

interface EditBrandPageProps {
    params: { id: string };
}

export default async function EditBrandPage({ params }: EditBrandPageProps) {
    const id = Number(params.id);

    try {
        const brand = await getBrandById(id);
        return <BrandEditClient brand={brand} />;
    } catch (error) {
        return <div>Thương hiệu không tồn tại.</div>;
    }
}
