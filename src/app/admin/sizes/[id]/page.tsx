import { getSizeById } from '@/services/sizeService'; // Create this service
import { getAllCategoriesList } from '@/services/categoryService';
import EditSizeClient from './EditSizeClient';

export default async function EditSizePage({ params }: { params: { id: string } }) {
    const id = Number(params.id);

    // Fetch all necessary data in parallel
    const [size, categories] = await Promise.all([
        getSizeById(id),
        getAllCategoriesList(),
    ]);

    return <EditSizeClient size={size} categories={categories} />;
}
