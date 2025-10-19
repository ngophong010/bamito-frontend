import { roleService } from '@/services/roleService';
import CreateUserClient from './CreateUserClient';

export default async function CreateUserPage() {
    // Data is fetched ONCE on the server.
    const roles = await roleService.getAllRoles();
    // Pass the data down as a prop.
    return <CreateUserClient roles={roles} />;
}
