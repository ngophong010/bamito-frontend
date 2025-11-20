import { brandService } from '@/services/brandService'; // You'll need to create this service
import BrandEditClient from './BrandEditClient';

interface EditBrandPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditBrandPage({ params }: EditBrandPageProps) {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);

    try {
        const brand = await brandService.getBrandById(id);
        return <BrandEditClient brand={brand} />;
    } catch (error) {
        return <div>Thương hiệu không tồn tại.</div>;
    }
}
