@extends('dashboard.shell')

@section('dashboard')
    <div class="max-w-7xl" x-data="reportCards({
        branding: @js($branding ?? []),
        classes: @js($classes ?? []),
        subjects: @js($subjects ?? []),
        students: @js($students ?? []),
        scores: @js($scores ?? []),
    })" data-testid="admin-report-cards-page">
        <div class="flex items-start justify-between gap-6 flex-col lg:flex-row">
            <div>
                <div class="text-xs font-bold uppercase tracking-[0.2em] text-brand-700">Admin</div>
                <h1 class="font-display text-4xl font-extrabold text-brand-950 mt-2 tracking-tight">Rapor Siswa</h1>
                <div class="mt-2 text-sm text-slate-600">Generate dan distribusikan rapor per kelas atau batch.</div>
            </div>
            <div class="flex items-center gap-3">
                <button type="button" class="inline-flex items-center gap-2 rounded-xl gradient-brand gradient-brand-hover text-white px-5 py-3 text-sm font-bold" x-on:click="exportAll()" data-testid="rapor-export-all">
                    <i data-lucide="download" class="w-4 h-4"></i> Export Semua (HTML)
                </button>
            </div>
        </div>

        <div class="mt-8 grid lg:grid-cols-3 gap-6">
            <template x-for="c in classes" :key="c.id">
                <div class="bg-white rounded-3xl border border-slate-100 p-6 card-lift" data-testid="rapor-card">
                    <div class="w-12 h-12 rounded-2xl gradient-brand text-white flex items-center justify-center">
                        <i data-lucide="file-text" class="w-5 h-5"></i>
                    </div>
                    <div class="font-display font-extrabold text-xl text-brand-950 mt-4" x-text="c.name || 'Kelas'"></div>
                    <div class="text-xs text-slate-600 mt-1" x-text="metaForClass(c)"></div>
                    <div class="mt-4 flex gap-2">
                        <button type="button" class="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-brand-200 py-2.5 text-xs font-bold text-brand-900 hover:bg-brand-50" x-on:click="openPreview(c)" data-testid="rapor-preview-btn">
                            <i data-lucide="printer" class="w-3.5 h-3.5"></i> Preview
                        </button>
                        <button type="button" class="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl gradient-brand gradient-brand-hover text-white py-2.5 text-xs font-bold" x-on:click="exportClass(c)">
                            <i data-lucide="download" class="w-3.5 h-3.5"></i> Export
                        </button>
                    </div>
                </div>
            </template>
            @if (count($classes ?? []) === 0)
                <div class="bg-white rounded-3xl border border-slate-100 p-6 text-sm text-slate-600">
                    Belum ada data kelas. Tambahkan data kelas dari menu Kelas.
                </div>
            @endif
        </div>

        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" x-show="preview !== null" x-cloak x-on:click="closePreview()" data-testid="rapor-preview-modal">
            <div class="absolute inset-0 bg-brand-950/60 backdrop-blur-sm"></div>
            <div class="relative bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto thin-scroll" x-on:click.stop>
                <div class="px-7 py-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <div>
                        <div class="text-xs font-bold uppercase tracking-wider text-brand-700">Preview Rapor</div>
                        <h3 class="font-display font-extrabold text-2xl text-brand-950 mt-0.5" x-text="preview?.name ? ('— ' + preview.name) : ''"></h3>
                    </div>
                    <div class="flex gap-2">
                        <button type="button" class="inline-flex items-center gap-1.5 rounded-xl gradient-brand gradient-brand-hover text-white px-4 py-2 text-xs font-bold" x-on:click="printPreview()">
                            <i data-lucide="printer" class="w-3.5 h-3.5"></i> Cetak
                        </button>
                        <button type="button" class="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center" x-on:click="closePreview()">
                            <i data-lucide="x" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
                <div class="p-8 print-section" x-ref="printArea">
                    <div class="flex items-start gap-4 pb-5 border-b-2 border-brand-950">
                        <div class="w-16 h-16 rounded-xl bg-white border border-brand-100 p-1.5">
                            <img x-bind:src="branding.logoUrl || ''" alt="" class="w-full h-full object-contain" />
                        </div>
                        <div class="flex-1">
                            <div class="text-xs font-bold uppercase tracking-wider text-brand-700">RAPOR HASIL BELAJAR</div>
                            <div class="font-display font-black text-2xl text-brand-950 mt-1" x-text="branding.schoolName || 'Sekolah'"></div>
                            <div class="text-xs text-slate-600 mt-0.5" x-text="branding.address || ''"></div>
                        </div>
                        <i data-lucide="award" class="w-8 h-8 text-brand-700"></i>
                    </div>

                    <div class="grid grid-cols-2 gap-4 mt-5 text-sm">
                        <div><span class="text-slate-500">Nama Siswa:</span> <span class="font-semibold text-brand-950" x-text="firstStudentForPreview()?.name || '-'"></span></div>
                        <div><span class="text-slate-500">NIS:</span> <span class="font-mono text-brand-950" x-text="firstStudentForPreview()?.nis || '-'"></span></div>
                        <div><span class="text-slate-500">Kelas:</span> <span class="font-semibold text-brand-950" x-text="preview?.name || '-'"></span></div>
                        <div><span class="text-slate-500">Wali Kelas:</span> <span class="font-semibold text-brand-950" x-text="preview?.homeroom || '-'"></span></div>
                    </div>

                    <table class="w-full mt-6 text-sm border border-slate-100 rounded-2xl overflow-hidden">
                        <thead class="bg-brand-950 text-white">
                            <tr>
                                <th class="text-left px-3 py-2 font-bold w-14">No</th>
                                <th class="text-left px-3 py-2 font-bold">Mata Pelajaran</th>
                                <th class="px-3 py-2 font-bold text-center w-28">Nilai</th>
                                <th class="px-3 py-2 font-bold text-center w-28">Predikat</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template x-for="(row, idx) in reportRows(preview)" :key="idx">
                                <tr class="border-b border-slate-100">
                                    <td class="px-3 py-2" x-text="idx + 1"></td>
                                    <td class="px-3 py-2 font-semibold text-brand-950" x-text="row.subject"></td>
                                    <td class="px-3 py-2 text-center" x-text="row.scoreDisplay"></td>
                                    <td class="px-3 py-2 text-center">
                                        <span class="inline-flex w-7 h-7 rounded-full text-white text-xs font-bold items-center justify-center" x-bind:class="badgeClass(row.grade)" x-text="row.grade"></span>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>

                    <div class="mt-8 grid grid-cols-2 gap-12 text-sm">
                        <div class="text-center">
                            <div class="text-slate-600">Mengetahui,<br />Wali Kelas</div>
                            <div class="h-16"></div>
                            <div class="font-bold text-brand-950 border-t border-slate-300 pt-1" x-text="preview?.homeroom || '-'"></div>
                        </div>
                        <div class="text-center">
                            <div class="text-slate-600">Kepala Madrasah</div>
                            <div class="h-16"></div>
                            <div class="font-bold text-brand-950 border-t border-slate-300 pt-1" x-text="branding.headmasterName || '-'"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        function reportCards({ branding, classes, subjects, students, scores }) {
            const esc = (s) => String(s ?? '')
                .replaceAll('&', '&amp;')
                .replaceAll('<', '&lt;')
                .replaceAll('>', '&gt;')
                .replaceAll('"', '&quot;')

            const safeFilename = (s) => String(s ?? 'kelas').toLowerCase().replaceAll(' ', '-').replaceAll('/', '-')

            const numeric = (v) => {
                const n = Number(String(v ?? '').replace(',', '.'))
                return Number.isFinite(n) ? n : null
            }

            const grade = (n) => {
                if (n === null) return '-'
                if (n >= 90) return 'A'
                if (n >= 80) return 'B'
                if (n >= 70) return 'C'
                return 'D'
            }

            const avgScore = (clsName, subName) => {
                const rows = (scores || []).filter(s =>
                    String(s?.class ?? '').trim() === String(clsName ?? '').trim() &&
                    String(s?.subject ?? '').trim() === String(subName ?? '').trim()
                )
                const nums = rows.map(r => numeric(r?.score)).filter(n => n !== null)
                if (nums.length === 0) return null
                return nums.reduce((a, b) => a + b, 0) / nums.length
            }

            const rowsForClass = (c) => {
                const clsName = c?.name ?? ''
                return (subjects || []).map((sub) => {
                    const subName = sub?.name ?? ''
                    const a = avgScore(clsName, subName)
                    const g = grade(a)
                    return {
                        subject: subName || '-',
                        score: a,
                        scoreDisplay: a === null ? '-' : a.toFixed(1),
                        grade: g,
                    }
                })
            }

            const buildHtmlForClass = (c) => {
                const st = (() => {
                    const clsName = String(c?.name ?? '').trim()
                    return (students || []).find(s => String(s?.class ?? '').trim() === clsName) || null
                })()
                const htmlRows = rowsForClass(c).map((r, i) => `
<tr>
  <td style="padding:6px;border-bottom:1px solid #eee;">${i + 1}</td>
  <td style="padding:6px;border-bottom:1px solid #eee;font-weight:600;">${esc(r.subject)}</td>
  <td style="padding:6px;border-bottom:1px solid #eee;text-align:center;">${esc(r.scoreDisplay)}</td>
  <td style="padding:6px;border-bottom:1px solid #eee;text-align:center;font-weight:700;">${esc(r.grade)}</td>
</tr>`).join('')

                return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Rapor - ${esc(c?.name)}</title>
  <style>
    body{font-family:Arial,Helvetica,sans-serif;color:#0f172a;margin:24px;}
    .hdr{display:flex;gap:16px;align-items:flex-start;border-bottom:2px solid #0f172a;padding-bottom:16px;}
    .logo{width:64px;height:64px;object-fit:contain;border:1px solid #e2e8f0;border-radius:12px;padding:6px;}
    h1{margin:0;font-size:20px;}
    .sub{font-size:12px;color:#334155;margin-top:4px;}
    .meta{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:16px;font-size:13px;}
    table{width:100%;border-collapse:collapse;margin-top:16px;font-size:13px;}
    thead th{background:#0f172a;color:#fff;padding:8px;text-align:left;}
    thead th.c{text-align:center;}
    .sign{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:24px;font-size:13px;}
    .sign .box{text-align:center;}
    .line{margin-top:48px;border-top:1px solid #94a3b8;padding-top:6px;font-weight:700;}
    @media print { body{margin:0;} }
  </style>
</head>
<body>
  <div class="hdr">
    <img class="logo" src="${esc(branding?.logoUrl || '')}" alt="" />
    <div style="flex:1">
      <div style="font-size:11px;font-weight:700;letter-spacing:0.08em;color:#065f46;">RAPOR HASIL BELAJAR</div>
      <h1>${esc(branding?.schoolName || 'Sekolah')}</h1>
      <div class="sub">${esc(branding?.address || '')}</div>
    </div>
  </div>
  <div class="meta">
    <div><span style="color:#64748b;">Nama Siswa:</span> <strong>${esc(st?.name || '-')}</strong></div>
    <div><span style="color:#64748b;">NIS:</span> <span style="font-family:ui-monospace,monospace;">${esc(st?.nis || '-')}</span></div>
    <div><span style="color:#64748b;">Kelas:</span> <strong>${esc(c?.name || '-')}</strong></div>
    <div><span style="color:#64748b;">Wali Kelas:</span> <strong>${esc(c?.homeroom || '-')}</strong></div>
  </div>
  <table>
    <thead>
      <tr>
        <th style="width:40px;">No</th>
        <th>Mata Pelajaran</th>
        <th class="c">Nilai</th>
        <th class="c">Predikat</th>
      </tr>
    </thead>
    <tbody>${htmlRows}</tbody>
  </table>
  <div class="sign">
    <div class="box">
      <div style="color:#475569;">Mengetahui,<br/>Wali Kelas</div>
      <div class="line">${esc(c?.homeroom || '-')}</div>
    </div>
    <div class="box">
      <div style="color:#475569;">Kepala Madrasah</div>
      <div class="line">${esc(branding?.headmasterName || '-')}</div>
    </div>
  </div>
</body>
</html>`
            }

            const downloadHtml = (filename, html) => {
                const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = filename
                document.body.appendChild(a)
                a.click()
                a.remove()
                URL.revokeObjectURL(url)
            }

            return {
                branding: branding || {},
                classes: classes || [],
                subjects: subjects || [],
                students: students || [],
                scores: scores || [],
                preview: null,
                metaForClass(c) {
                    const clsName = String(c?.name ?? '').trim()
                    const count = (this.students || []).filter(s => String(s?.class ?? '').trim() === clsName).length
                    const homeroom = c?.homeroom ? ` · ${c.homeroom}` : ''
                    return `${count} siswa${homeroom}`
                },
                openPreview(c) {
                    this.preview = c || null
                    this.$nextTick(() => {
                        if (window.lucide) window.lucide.createIcons()
                    })
                },
                closePreview() {
                    this.preview = null
                },
                printPreview() {
                    window.print()
                },
                firstStudentForPreview() {
                    const clsName = String(this.preview?.name ?? '').trim()
                    return (this.students || []).find(s => String(s?.class ?? '').trim() === clsName) || null
                },
                reportRows(c) {
                    if (!c) return []
                    return rowsForClass(c)
                },
                badgeClass(g) {
                    if (g === 'A') return 'bg-emerald-600'
                    if (g === 'B') return 'bg-brand-600'
                    if (g === 'C') return 'bg-amber-600'
                    if (g === 'D') return 'bg-red-600'
                    return 'bg-slate-400'
                },
                exportClass(c) {
                    const html = buildHtmlForClass(c)
                    downloadHtml(`rapor-${safeFilename(c?.name)}.html`, html)
                },
                exportAll() {
                    const sections = (this.classes || []).map((c) => {
                        const html = buildHtmlForClass(c)
                        const body = html.split('<body>')[1]?.split('</body>')[0] || ''
                        return `<section style="page-break-after:always;">${body}</section>`
                    }).join('')
                    const doc = `<!doctype html><html><head><meta charset="utf-8" /><title>Rapor - Semua</title></head><body>${sections}</body></html>`
                    downloadHtml('rapor-semua.html', doc)
                },
            }
        }
    </script>
@endsection

