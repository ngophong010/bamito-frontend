import { sizeService } from '@/services/sizeService'; // Create this service
import { categoryService } from '@/services/categoryService';
import EditSizeClient from './EditSizeClient';

export default async function EditSizePage({ params }: { params: { id: string } }) {
    const id = Number(params.id);

    // Fetch all necessary data in parallel
    const [size, categories] = await Promise.all([
        sizeService.getSizeById(id),
        categoryService.getCategories(),
    ]);

    return <EditSizeClient size={size} categories={categories} />;
}
