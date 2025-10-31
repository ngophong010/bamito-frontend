import { categoryService } from '@/services/categoryService'; // You'll create this service
import CategoryEditClient from './CategoryEditClient';

interface EditCategoryPageProps {
    params: { id: string };
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
    const id = Number(params.id);
    try {
        const category = await categoryService.getCategoryById(id);
        return <CategoryEditClient category={category} />;
    } catch (error) {
        return <div>Danh mục không tồn tại.</div>;
    }
}
