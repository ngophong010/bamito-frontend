import { userService } from '@/services/userService';
import { roleService } from '@/services/roleService';
import EditUserClient from './EditUserClient';

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);

    try {
        // Fetch the user to edit AND the list of roles in parallel
        const [user, roles] = await Promise.all([
            userService.getUserById(id),
            roleService.getAllRoles(),
        ]);
        return <EditUserClient user={user} roles={roles} />;
    } catch (error) {
        return <div>Người dùng không tồn tại.</div>;
    }
}
