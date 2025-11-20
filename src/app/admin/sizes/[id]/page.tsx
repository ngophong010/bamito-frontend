import { sizeService } from '@/services/sizeService'; // Create this service
import { categoryService } from '@/services/categoryService';
import EditSizeClient from './EditSizeClient';

export default async function EditSizePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);

    // Fetch all necessary data in parallel
    const [size, categories] = await Promise.all([
        sizeService.getSizeById(id),
        categoryService.getAllCategoriesList(),
    ]);

    return <EditSizeClient size={size} categories={categories} />;
}
