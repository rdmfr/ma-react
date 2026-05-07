@php
    use Carbon\Carbon;
@endphp

@extends('dashboard.shell')

@section('dashboard')
    <div class="max-w-7xl" x-data="adminUsersCrud({
        routes: {
            store: @js(route('admin.users.store')),
            updateBase: @js(route('admin.users.update', ['user' => 'USER_ID'])),
            deleteBase: @js(route('admin.users.destroy', ['user' => 'USER_ID'])),
        },
    })" data-testid="admin-users-page">
        <div class="flex items-start justify-between gap-6 flex-col lg:flex-row">
            <div>
                <div class="text-xs font-bold uppercase tracking-[0.2em] text-brand-700">Admin</div>
                <h1 class="font-display text-4xl font-extrabold text-brand-950 mt-2 tracking-tight">Manajemen Pengguna</h1>
                <div class="mt-2 text-sm text-slate-600">Kelola akun admin, guru, dan OSIS.</div>
            </div>
            <div class="flex items-center gap-3">
                <button type="button" class="inline-flex items-center gap-2 rounded-xl gradient-brand gradient-brand-hover text-white px-5 py-3 text-sm font-bold" x-on:click="openCreate()" data-testid="user-create-btn">
                    <i data-lucide="plus" class="w-4 h-4"></i> Tambah Pengguna
                </button>
            </div>
        </div>

        @if (session('success'))
            <div class="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{{ session('success') }}</div>
        @endif
        @if (session('error'))
            <div class="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">{{ session('error') }}</div>
        @endif
        @if ($errors->any())
            <div class="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
                <div class="font-bold">Ada error pada input:</div>
                <ul class="list-disc pl-5 mt-2 space-y-1">
                    @foreach ($errors->all() as $e)
                        <li>{{ $e }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <div class="mt-8 bg-white rounded-3xl border border-slate-100 overflow-hidden">
            <div class="p-5 border-b border-slate-100">
                <form method="GET" class="flex flex-col lg:flex-row gap-3 lg:items-center" data-testid="admin-users-filters">
                    <div class="flex items-center gap-3 flex-1">
                        <div class="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-3 flex-1">
                            <i data-lucide="search" class="w-4 h-4 text-slate-500"></i>
                            <input name="q" value="{{ $q ?? '' }}" placeholder="Cari nama atau email..." class="bg-transparent flex-1 outline-none text-sm placeholder:text-slate-400" />
                        </div>
                        <select name="role" class="rounded-xl border border-slate-200 px-3 py-3 text-sm">
                            <option value="all" @selected(($role ?? 'all') === 'all')>Semua Role</option>
                            <option value="admin" @selected(($role ?? 'all') === 'admin')>admin</option>
                            <option value="teacher" @selected(($role ?? 'all') === 'teacher')>teacher</option>
                            <option value="osis" @selected(($role ?? 'all') === 'osis')>osis</option>
                        </select>
                        <button class="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold hover:bg-slate-50">Filter</button>
                    </div>
                </form>
            </div>

            <div class="overflow-x-auto">
                <table class="min-w-full text-sm">
                    <thead>
                        <tr class="bg-slate-50 text-slate-600">
                            <th class="text-left font-bold px-5 py-3 whitespace-nowrap">Nama</th>
                            <th class="text-left font-bold px-5 py-3 whitespace-nowrap">Email</th>
                            <th class="text-left font-bold px-5 py-3 whitespace-nowrap">Role</th>
                            <th class="text-left font-bold px-5 py-3 whitespace-nowrap">Status</th>
                            <th class="text-left font-bold px-5 py-3 whitespace-nowrap">Login Terakhir</th>
                            <th class="text-right font-bold px-5 py-3 whitespace-nowrap">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        @foreach ($users as $u)
                            @php
                                $last = $u->last_login_at ? Carbon::parse($u->last_login_at)->locale('id')->translatedFormat('j M Y H:i') : '-';
                            @endphp
                            <tr class="hover:bg-brand-50/30" data-testid="user-row-{{ $u->id }}">
                                <td class="px-5 py-4 font-semibold text-brand-950">{{ $u->name }}</td>
                                <td class="px-5 py-4 text-slate-700">{{ $u->email }}</td>
                                <td class="px-5 py-4">
                                    <span class="inline-flex items-center gap-1.5 text-[11px] font-bold bg-brand-100 text-brand-800 rounded-full px-2.5 py-0.5">
                                        <i data-lucide="user-cog" class="w-3 h-3"></i>{{ $u->role }}
                                    </span>
                                </td>
                                <td class="px-5 py-4">
                                    @php
                                        $active = ($u->status ?? 'active') === 'active';
                                    @endphp
                                    <span class="inline-flex items-center text-[11px] font-bold rounded-full px-2.5 py-0.5 {{ $active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700' }}">{{ $active ? 'active' : 'inactive' }}</span>
                                </td>
                                <td class="px-5 py-4 text-slate-600 text-xs">{{ $last }}</td>
                                <td class="px-5 py-4">
                                    <div class="flex items-center justify-end gap-2">
                                        <button type="button" class="text-xs font-bold text-brand-700 hover:text-brand-900 px-3 py-2 rounded-lg hover:bg-brand-50" x-on:click='openEdit(@js([
                                            "id" => $u->id,
                                            "name" => $u->name,
                                            "email" => $u->email,
                                            "role" => $u->role,
                                            "status" => $u->status,
                                            "avatar_url" => $u->avatar_url,
                                        ]))' data-testid="user-edit-{{ $u->id }}">Edit</button>
                                        <button type="button" class="text-xs font-bold text-red-600 hover:text-red-800 px-3 py-2 rounded-lg hover:bg-red-50" x-on:click="confirmDelete('{{ $u->id }}')" data-testid="user-delete-{{ $u->id }}">Hapus</button>
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                        @if ($users->count() === 0)
                            <tr>
                                <td colspan="6" class="px-5 py-10 text-center text-slate-500">Belum ada pengguna.</td>
                            </tr>
                        @endif
                    </tbody>
                </table>
            </div>

            <div class="p-5 border-t border-slate-100">
                {{ $users->links() }}
            </div>
        </div>

        <div class="fixed inset-0 z-50 flex items-center justify-center p-6" x-show="modalOpen" x-cloak>
            <div class="absolute inset-0 bg-brand-950/60" x-on:click="closeModal()"></div>
            <div class="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-white/60 overflow-hidden" x-on:keydown.escape.window="closeModal()">
                <div class="p-6 border-b border-slate-100 flex items-center gap-3">
                    <div class="w-10 h-10 rounded-2xl bg-brand-50 text-brand-800 flex items-center justify-center"><i data-lucide="user" class="w-4 h-4"></i></div>
                    <div>
                        <div class="font-display font-extrabold text-xl text-brand-950" x-text="modalTitle"></div>
                        <div class="text-sm text-slate-600">Pengguna</div>
                    </div>
                    <button type="button" class="ml-auto w-10 h-10 rounded-2xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center" x-on:click="closeModal()">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                </div>
                <form method="POST" x-bind:action="formAction" class="p-6">
                    @csrf
                    <template x-if="methodSpoof !== null">
                        <input type="hidden" name="_method" x-bind:value="methodSpoof" />
                    </template>

                    <div class="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label class="text-xs font-bold uppercase tracking-wider text-slate-600">Nama</label>
                            <input name="name" class="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" x-model="form.name" />
                        </div>
                        <div>
                            <label class="text-xs font-bold uppercase tracking-wider text-slate-600">Email</label>
                            <input name="email" class="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" x-model="form.email" />
                        </div>
                        <div>
                            <label class="text-xs font-bold uppercase tracking-wider text-slate-600">Role</label>
                            <select name="role" class="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" x-model="form.role">
                                <option value="admin">admin</option>
                                <option value="teacher">teacher</option>
                                <option value="osis">osis</option>
                            </select>
                        </div>
                        <div>
                            <label class="text-xs font-bold uppercase tracking-wider text-slate-600">Status</label>
                            <select name="status" class="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" x-model="form.status">
                                <option value="active">active</option>
                                <option value="inactive">inactive</option>
                            </select>
                        </div>
                        <div class="sm:col-span-2">
                            <label class="text-xs font-bold uppercase tracking-wider text-slate-600">Avatar URL (opsional)</label>
                            <input name="avatar_url" class="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" x-model="form.avatar_url" />
                        </div>
                        <div>
                            <label class="text-xs font-bold uppercase tracking-wider text-slate-600">Password</label>
                            <input name="password" type="password" class="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" x-model="form.password" />
                            <div class="mt-2 text-xs text-slate-500" x-show="isEdit" x-cloak>Kosongkan jika tidak ingin mengubah password.</div>
                        </div>
                        <div>
                            <label class="text-xs font-bold uppercase tracking-wider text-slate-600">Konfirmasi Password</label>
                            <input name="password_confirmation" type="password" class="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" x-model="form.password_confirmation" />
                        </div>
                    </div>

                    <div class="mt-6 flex items-center justify-end gap-3">
                        <button type="button" class="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold hover:bg-slate-50" x-on:click="closeModal()">Batal</button>
                        <button type="submit" class="rounded-xl gradient-brand gradient-brand-hover text-white px-6 py-3 text-sm font-bold">Simpan</button>
                    </div>
                </form>
            </div>
        </div>

        <div class="fixed inset-0 z-50 flex items-center justify-center p-6" x-show="deleteOpen" x-cloak>
            <div class="absolute inset-0 bg-brand-950/60" x-on:click="deleteOpen=false"></div>
            <div class="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
                <div class="p-6 border-b border-slate-100 flex items-center gap-3">
                    <div class="w-10 h-10 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center"><i data-lucide="trash" class="w-4 h-4"></i></div>
                    <div>
                        <div class="font-display font-extrabold text-xl text-brand-950">Hapus Pengguna</div>
                        <div class="text-sm text-slate-600">Tindakan ini tidak bisa dibatalkan.</div>
                    </div>
                </div>
                <form method="POST" class="p-6" x-bind:action="deleteAction">
                    @csrf
                    @method('DELETE')
                    <div class="text-sm text-slate-700">Yakin ingin menghapus pengguna ini?</div>
                    <div class="mt-6 flex items-center justify-end gap-3">
                        <button type="button" class="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold hover:bg-slate-50" x-on:click="deleteOpen=false">Batal</button>
                        <button type="submit" class="rounded-xl bg-red-600 hover:bg-red-700 text-white px-6 py-3 text-sm font-bold">Hapus</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script>
        function adminUsersCrud({ routes }) {
            const blank = () => ({
                id: null,
                name: '',
                email: '',
                role: 'teacher',
                status: 'active',
                avatar_url: '',
                password: '',
                password_confirmation: '',
            })
            return {
                modalOpen: false,
                deleteOpen: false,
                modalTitle: '',
                form: blank(),
                formAction: routes.store,
                methodSpoof: null,
                deleteAction: '',
                isEdit: false,
                openCreate() {
                    this.modalTitle = 'Tambah Pengguna'
                    this.isEdit = false
                    this.form = blank()
                    this.formAction = routes.store
                    this.methodSpoof = null
                    this.modalOpen = true
                },
                openEdit(user) {
                    this.modalTitle = 'Edit Pengguna'
                    this.isEdit = true
                    this.form = Object.assign(blank(), user || {})
                    this.form.password = ''
                    this.form.password_confirmation = ''
                    this.formAction = routes.updateBase.replace('USER_ID', user.id)
                    this.methodSpoof = 'PUT'
                    this.modalOpen = true
                },
                closeModal() {
                    this.modalOpen = false
                },
                confirmDelete(id) {
                    this.deleteAction = routes.deleteBase.replace('USER_ID', id)
                    this.deleteOpen = true
                },
            }
        }
    </script>
@endsection

