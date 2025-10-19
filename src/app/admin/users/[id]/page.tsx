import { userService } from '@/services/userService';
import { getAllRoles } from '@/services/roleService';
import EditUserClient from './EditUserClient';

export default async function EditUserPage({ params }: { params: { id: string } }) {
    const id = Number(params.id);

    try {
        // Fetch the user to edit AND the list of roles in parallel
        const [user, roles] = await Promise.all([
            userService.getUserById(id),
            getAllRoles(),
        ]);
        return <EditUserClient user={user} roles={roles} />;
    } catch (error) {
        return <div>Người dùng không tồn tại.</div>;
    }
}
