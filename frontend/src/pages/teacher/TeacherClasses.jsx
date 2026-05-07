import React from "react";
import { GraduationCap, Users, ChevronRight } from "lucide-react";
import { PageHeader } from "../../components/shared/Primitives";
import { classes } from "../../data/mockData";
import { useNavigate } from "react-router-dom";

export default function TeacherClasses() {
    const navigate = useNavigate();
    return (
        <div data-testid="teacher-classes">
            <PageHeader title="Kelas Saya" description="Daftar kelas yang Anda ampu semester ini." breadcrumbs={["Guru", "Kelas"]} />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {classes.slice(0, 6).map(c => (
                    <button
                        key={c.id}
                        onClick={() => navigate(`/teacher/scores?class=${encodeURIComponent(c.name)}`)}
                        className="bg-white rounded-3xl border border-slate-100 p-6 card-lift text-left"
                        data-testid={`my-class-${c.id}`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="w-12 h-12 rounded-2xl gradient-brand text-white flex items-center justify-center"><GraduationCap className="w-5 h-5" /></div>
                            <ChevronRight className="w-5 h-5 text-brand-400" />
                        </div>
                        <div className="font-display font-extrabold text-2xl text-brand-950 mt-4">{c.name}</div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 mt-1"><Users className="w-3.5 h-3.5" />{c.students} siswa</div>
                        <div className="mt-5 pt-4 border-t border-slate-100 text-xs text-slate-600">Wali kelas: <span className="font-semibold text-brand-800">{c.homeroom}</span></div>
                    </button>
                ))}
            </div>
        </div>
    );
}
