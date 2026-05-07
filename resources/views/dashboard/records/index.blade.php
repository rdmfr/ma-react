@extends('dashboard.shell')

@push('head')
    <script src="https://cdn.tiny.cloud/1/no-api-key/tinymce/6/tinymce.min.js" referrerpolicy="origin"></script>
@endpush

@push('scripts')
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            if (!window.tinymce) return
            window.tinymce.init({
                selector: 'textarea.js-rich',
                height: 340,
                menubar: false,
                plugins: 'link lists image code table',
                toolbar: 'undo redo | blocks | bold italic underline | bullist numlist | link image | removeformat | code',
                content_style: 'body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; font-size: 14px; }',
                images_upload_url: '{{ $routes['upload'] ?? '' }}',
                images_upload_handler: function (blobInfo, progress) {
                    return new Promise(function(resolve, reject) {
                        const xhr = new XMLHttpRequest();
                        xhr.withCredentials = true;
                        xhr.open('POST', '{{ $routes['upload'] ?? '' }}');
                        xhr.setRequestHeader('X-CSRF-TOKEN', '{{ csrf_token() }}');
                        xhr.upload.onprogress = function (e) {
                            progress(e.loaded / e.total * 100);
                        };
                        xhr.onload = function() {
                            if (xhr.status < 200 || xhr.status >= 300) {
                                reject('HTTP Error: ' + xhr.status);
                                return;
                            }
                            try {
                                const json = JSON.parse(xhr.responseText);
                                if (!json || typeof json.url !== 'string') {
                                    reject('Invalid JSON');
                                    return;
                                }
                                resolve(json.url);
                            } catch (err) {
                                reject('Invalid response');
                            }
                        };
                        xhr.onerror = function () {
                            reject('Upload failed');
                        };
                        const formData = new FormData();
                        formData.append('file', blobInfo.blob(), blobInfo.filename());
                        xhr.send(formData);
                    });
                },
            })
        })
    </script>
@endpush

@section('dashboard')
    <div class="max-w-7xl" x-data="recordCrud({
        type: @js($type),
        fields: @js($module['fields'] ?? []),
        routes: {
            store: @js($routes['store'] ?? ''),
            updateBase: @js($routes['updateBase'] ?? ''),
            deleteBase: @js($routes['deleteBase'] ?? ''),
        },
    })" data-testid="records-page">
        <div class="flex items-start justify-between gap-6 flex-col lg:flex-row">
            <div>
                <div class="text-xs font-bold uppercase tracking-[0.2em] text-brand-700">{{ $section ?? 'Dashboard' }}</div>
                <h1 class="font-display text-4xl font-extrabold text-brand-950 mt-2 tracking-tight">{{ $module['title'] ?? 'Data' }}</h1>
                <div class="mt-2 text-sm text-slate-600">{{ $module['subtitle'] ?? '' }}</div>
            </div>
            <div class="flex items-center gap-3">
                <button type="button" class="inline-flex items-center gap-2 rounded-xl gradient-brand gradient-brand-hover text-white px-5 py-3 text-sm font-bold shadow-lg shadow-brand-900/10 transition card-lift" x-on:click="openCreate()" data-testid="record-create-btn">
                    <i data-lucide="plus" class="w-4 h-4"></i> Tambah {{ $module['title'] ?? 'Data' }}
                </button>

                @if($routes['export'] ?? null)
                    <a href="{{ $routes['export'] }}" class="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 text-slate-700 px-5 py-3 text-sm font-bold hover:bg-slate-50 transition">
                        <i data-lucide="download" class="w-4 h-4"></i> Export CSV
                    </a>
                @endif

                @if($routes['import'] ?? null)
                    <button type="button" x-on:click="$refs.importFile.click()" class="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 text-slate-700 px-5 py-3 text-sm font-bold hover:bg-slate-50 transition">
                        <i data-lucide="upload" class="w-4 h-4"></i> Import CSV
                    </button>
                    <form action="{{ $routes['import'] }}" method="POST" enctype="multipart/form-data" class="hidden">
                        @csrf
                        <input type="file" x-ref="importFile" name="file" x-on:change="$el.form.submit()" accept=".csv">
                    </form>
                @endif
            </div>
        </div>

        @if (session('success'))
            <div class="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{{ session('success') }}</div>
        @endif
        @if (session('error'))
            <div class="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">{{ session('error') }}</div>
        @endif

        <div class="mt-8 bg-white rounded-3xl border border-slate-100 overflow-hidden">
            <div class="p-5 border-b border-slate-100">
                <form method="GET" class="flex flex-col lg:flex-row gap-3 lg:items-center" data-testid="records-filters">
                    <div class="flex items-center gap-3 flex-1">
                        <div class="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-3 flex-1">
                            <i data-lucide="search" class="w-4 h-4 text-slate-500"></i>
                            <input name="q" value="{{ $q }}" placeholder="Cari..." class="bg-transparent flex-1 outline-none text-sm placeholder:text-slate-400" />
                        </div>
                        <button class="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold hover:bg-slate-50">Filter</button>
                    </div>
                    @foreach (($module['filters'] ?? []) as $f)
                        @php
                            $key = (string) ($f['key'] ?? '');
                            $label = (string) ($f['label'] ?? $key);
                            $opt = $f['options'] ?? null;
                            $current = (string) ($filters[$key] ?? '');
                        @endphp
                        <div class="flex items-center gap-2">
                            <div class="text-xs font-bold uppercase tracking-wider text-slate-500">{{ $label }}</div>
                            <select name="{{ $key }}" class="rounded-xl border border-slate-200 px-3 py-3 text-sm">
                                <option value="">Semua</option>
                                @if (is_array($opt))
                                    @foreach ($opt as $o)
                                        <option value="{{ $o['value'] ?? '' }}" @selected((string) ($o['value'] ?? '') === $current)>{{ $o['label'] ?? ($o['value'] ?? '') }}</option>
                                    @endforeach
                                @endif
                            </select>
                        </div>
                    @endforeach
                </form>
            </div>

            <div class="overflow-x-auto">
                <table class="min-w-full text-sm">
                    <thead>
                        <tr class="bg-slate-50 text-slate-600">
                            @foreach (($module['columns'] ?? []) as $col)
                                <th class="text-left font-bold px-5 py-3 whitespace-nowrap">{{ $col['label'] ?? $col['key'] }}</th>
                            @endforeach
                            <th class="text-right font-bold px-5 py-3 whitespace-nowrap">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        @foreach ($rows as $r)
                            <tr class="hover:bg-brand-50/30" data-testid="record-row-{{ $r['id'] }}">
                                @foreach (($module['columns'] ?? []) as $col)
                                    @php
                                        $v = $r[$col['key']] ?? '';
                                        $vs = is_scalar($v) ? (string) $v : '';
                                        $isImg = is_string($vs) && preg_match('/\.(png|jpg|jpeg|webp|gif)(\?.*)?$/i', $vs);
                                    @endphp
                                    <td class="px-5 py-4 text-slate-700 max-w-[360px]">
                                        @if ($isImg)
                                            <img src="{{ $vs }}" alt="" class="w-12 h-10 rounded-xl object-cover border border-slate-100" />
                                        @else
                                            <div class="truncate">{{ $vs }}</div>
                                        @endif
                                    </td>
                                @endforeach
                                <td class="px-5 py-4">
                                    <div class="flex items-center justify-end gap-2">
                                        <button type="button" class="text-xs font-bold text-brand-700 hover:text-brand-900 px-3 py-2 rounded-lg hover:bg-brand-50" x-on:click="openEdit({{ htmlspecialchars(json_encode($r), ENT_QUOTES, 'UTF-8') }})" data-testid="record-edit-{{ $r['id'] }}">Edit</button>
                                        <button type="button" class="text-xs font-bold text-red-600 hover:text-red-800 px-3 py-2 rounded-lg hover:bg-red-50" x-on:click="confirmDelete('{{ $r['id'] }}')" data-testid="record-delete-{{ $r['id'] }}">Hapus</button>
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                        @if ($rows->count() === 0)
                            <tr>
                                <td colspan="{{ count($module['columns'] ?? []) + 1 }}" class="px-5 py-10 text-center text-slate-500">Belum ada data.</td>
                            </tr>
                        @endif
                    </tbody>
                </table>
            </div>

            <div class="p-5 border-t border-slate-100">
                {{ $rows->links() }}
            </div>
        </div>

        <div class="fixed inset-0 z-50 flex items-center justify-center p-6" x-show="modalOpen" x-cloak>
            <div class="absolute inset-0 bg-brand-950/60" x-on:click="closeModal()"></div>
            <div class="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-white/60 overflow-hidden" x-on:keydown.escape.window="closeModal()">
                <div class="p-6 border-b border-slate-100 flex items-center gap-3">
                    <div class="w-10 h-10 rounded-2xl bg-brand-50 text-brand-800 flex items-center justify-center"><i data-lucide="file-pen-line" class="w-4 h-4"></i></div>
                    <div>
                        <div class="font-display font-extrabold text-xl text-brand-950" x-text="modalTitle"></div>
                        <div class="text-sm text-slate-600">{{ $module['title'] ?? '' }}</div>
                    </div>
                    <button type="button" class="ml-auto w-10 h-10 rounded-2xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center" x-on:click="closeModal()">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                </div>
                <form method="POST" x-bind:action="formAction" enctype="multipart/form-data" class="p-6" x-on:submit="beforeSubmit">
                    @csrf
                    <template x-if="methodSpoof !== null">
                        <input type="hidden" name="_method" x-bind:value="methodSpoof" />
                    </template>

                    <div class="grid sm:grid-cols-2 gap-4">
                        @foreach (($module['fields'] ?? []) as $field)
                            @php
                                $key = (string) ($field['key'] ?? '');
                                $label = (string) ($field['label'] ?? $key);
                                $input = (string) ($field['input'] ?? 'text');
                                $options = $field['options'] ?? null;
                            @endphp
                            <div class="sm:col-span-{{ in_array($input, ['textarea', 'richtext'], true) ? '2' : '1' }}">
                                <label class="text-xs font-bold uppercase tracking-wider text-slate-600">{{ $label }}</label>
                                @if ($input === 'textarea')
                                    <textarea name="{{ $key }}" class="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm min-h-28" x-model="form['{{ $key }}']"></textarea>
                                @elseif ($input === 'richtext')
                                    <textarea id="rt-{{ $key }}" name="{{ $key }}" class="js-rich mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" x-text="form['{{ $key }}'] ?? ''"></textarea>
                                @elseif ($input === 'select')
                                    <select name="{{ $key }}" class="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" x-model="form['{{ $key }}']">
                                        @if (is_array($options))
                                            @foreach ($options as $o)
                                                <option value="{{ $o['value'] ?? '' }}">{{ $o['label'] ?? ($o['value'] ?? '') }}</option>
                                            @endforeach
                                        @endif
                                    </select>
                                @elseif ($input === 'date')
                                    <input type="date" name="{{ $key }}" class="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" x-model="form['{{ $key }}']" />
                                @elseif ($input === 'multifile')
                                    <input type="file" name="{{ $key }}[]" multiple class="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                                    <template x-if="Array.isArray(form['{{ $key }}'] ?? null) && (form['{{ $key }}'] || []).length">
                                        <div class="mt-3 grid grid-cols-4 gap-2">
                                            <template x-for="(u, idx) in (form['{{ $key }}'] || []).slice(0, 8)" :key="idx">
                                                <a class="block w-full aspect-[4/3] rounded-xl overflow-hidden border border-slate-100 bg-slate-50" target="_blank" rel="noreferrer" :href="u">
                                                    <img :src="u" alt="" class="w-full h-full object-cover" />
                                                </a>
                                            </template>
                                        </div>
                                    </template>
                                @elseif ($input === 'image' || $input === 'file')
                                    <input type="file" name="{{ $key }}" class="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                                    <template x-if="typeof (form['{{ $key }}'] ?? null) === 'string' && (form['{{ $key }}'] ?? '') !== ''">
                                        <div class="mt-2 text-xs text-slate-500 truncate">File saat ini: <a class="text-brand-700 hover:text-brand-900" target="_blank" rel="noreferrer" x-bind:href="form['{{ $key }}']">Lihat</a></div>
                                    </template>
                                @else
                                    <input name="{{ $key }}" class="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" x-model="form['{{ $key }}']" />
                                @endif
                            </div>
                        @endforeach
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
                        <div class="font-display font-extrabold text-xl text-brand-950">Hapus Data</div>
                        <div class="text-sm text-slate-600">Tindakan ini tidak bisa dibatalkan.</div>
                    </div>
                </div>
                <form method="POST" class="p-6" x-bind:action="deleteAction">
                    @csrf
                    @method('DELETE')
                    <div class="text-sm text-slate-700">Yakin ingin menghapus item ini?</div>
                    <div class="mt-6 flex items-center justify-end gap-3">
                        <button type="button" class="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold hover:bg-slate-50" x-on:click="deleteOpen=false">Batal</button>
                        <button type="submit" class="rounded-xl bg-red-600 hover:bg-red-700 text-white px-6 py-3 text-sm font-bold">Hapus</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script>
        function recordCrud({ type, fields, routes }) {
            const richKeys = (fields || []).filter(f => f && f.input === 'richtext').map(f => f.key)
            const blank = () => {
                const out = {}
                ;(fields || []).forEach(f => { if (f?.key) out[f.key] = '' })
                return out
            }
            return {
                modalOpen: false,
                deleteOpen: false,
                modalTitle: '',
                form: blank(),
                formAction: routes.store,
                methodSpoof: null,
                deleteAction: '',
                openCreate() {
                    this.modalTitle = 'Tambah Data'
                    this.form = blank()
                    this.formAction = routes.store
                    this.methodSpoof = null
                    this.modalOpen = true
                    this.$nextTick(() => {
                        this.resetRichEditors()
                    })
                },
                openEdit(row) {
                    this.modalTitle = 'Edit Data'
                    this.form = Object.assign(blank(), row || {})
                    this.formAction = routes.updateBase.replace('RECORD_ID', row.id)
                    this.methodSpoof = 'PUT'
                    this.modalOpen = true
                    this.$nextTick(() => {
                        this.resetRichEditors()
                    })
                },
                closeModal() {
                    this.modalOpen = false
                },
                confirmDelete(id) {
                    this.deleteAction = routes.deleteBase.replace('RECORD_ID', id)
                    this.deleteOpen = true
                },
                resetRichEditors() {
                    if (!window.tinymce) return
                    richKeys.forEach((k) => {
                        const ed = window.tinymce.get('rt-' + k)
                        if (!ed) return
                        ed.setContent(this.form?.[k] || '')
                    })
                },
                beforeSubmit() {
                    if (window.tinymce) window.tinymce.triggerSave()
                },
            }
        }
    </script>
@endsection
