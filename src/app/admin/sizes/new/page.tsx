import { categoryService } from '@/services/categoryService'; // Create this service if needed
import CreateSizeClient from './CreateSizeClient';

export default async function CreateSizePage() {
    // Fetch the list of categories for the dropdown on the server
     const categories = await categoryService.getAllCategoriesList();

    return <CreateSizeClient categories={categories} />;
}
