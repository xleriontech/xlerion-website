@extends('layouts.app')

@section('content')
<div class="bg-dark min-h-screen py-8">
    <div class="container-app">
        <h1 class="text-3xl font-bold mb-8">Gestionar Usuarios</h1>

        <div x-data="adminUsers()" x-init="loadUsers()" class="space-y-6">
            <!-- Search -->
            <div class="bg-secondary rounded-lg p-4">
                <input 
                    type="text" 
                    x-model="search"
                    @input="loadUsers()"
                    placeholder="Buscar por nombre o email..."
                    class="input-field w-full"
                >
            </div>

            <!-- Users table -->
            <div x-show="loading" class="text-center text-gray-400 py-8">
                Cargando usuarios...
            </div>

            <div x-show="!loading && users.length > 0" class="bg-secondary rounded-lg overflow-hidden">
                <table class="w-full">
                    <thead class="bg-dark border-b border-gray-700">
                        <tr>
                            <th class="text-left px-6 py-3">Nombre</th>
                            <th class="text-left px-6 py-3">Email</th>
                            <th class="text-left px-6 py-3">Rol</th>
                            <th class="text-left px-6 py-3">Unido</th>
                            <th class="text-left px-6 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template x-for="user in users" :key="user.id">
                            <tr class="border-t border-gray-700 hover:bg-dark transition">
                                <td class="px-6 py-3" x-text="user.name"></td>
                                <td class="px-6 py-3 text-gray-400" x-text="user.email"></td>
                                <td class="px-6 py-3">
                                    <span 
                                        class="badge"
                                        :class="{
                                            'badge-active': user.role === 'admin',
                                            'badge-closed': user.role === 'seller',
                                        }"
                                        x-text="user.role"
                                    ></span>
                                </td>
                                <td class="px-6 py-3 text-gray-400" x-text="formatDate(user.created_at)"></td>
                                <td class="px-6 py-3">
                                    <button 
                                        @click="banUser(user.id)"
                                        class="text-red-400 hover:underline text-sm"
                                    >
                                        Ban
                                    </button>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>

            <div x-show="!loading && users.length === 0" class="text-center py-8 text-gray-400">
                No se encontraron usuarios
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script>
    function adminUsers() {
        return {
            loading: true,
            users: [],
            search: '',

            formatDate(date) {
                return new Date(date).toLocaleDateString('es-CO');
            },

            async loadUsers() {
                this.loading = true;
                try {
                    const { data } = await axios.get('/api/admin/users', {
                        params: { search: this.search },
                    });
                    this.users = data.data || data;
                } catch (err) {
                    console.error('Error loading users:', err);
                    notificationService.error('Error al cargar usuarios');
                } finally {
                    this.loading = false;
                }
            },

            async banUser(id) {
                if (!confirm('¿Estás seguro de que quieres banear este usuario?')) return;

                try {
                    await axios.patch(`/api/admin/users/${id}/ban`);
                    notificationService.success('Usuario baneado');
                    this.loadUsers();
                } catch (err) {
                    notificationService.error('Error al banear usuario');
                }
            },
        };
    }
</script>
@endpush
@endsection
