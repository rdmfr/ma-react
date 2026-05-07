import React, { useState, useRef } from "react";
import { Bold, Italic, List, Link as LinkIcon, Image as ImageIcon, Quote, Heading2, Underline } from "lucide-react";

export default function RichEditor({ value, onChange, placeholder = "Tulis konten di sini..." }) {
    const ref = useRef(null);

    const exec = (cmd, val = null) => {
        document.execCommand(cmd, false, val);
        onChange?.(ref.current.innerHTML);
        ref.current.focus();
    };

    const tools = [
        { icon: Heading2, cmd: () => exec("formatBlock", "H3"), label: "Heading" },
        { icon: Bold, cmd: () => exec("bold"), label: "Bold" },
        { icon: Italic, cmd: () => exec("italic"), label: "Italic" },
        { icon: Underline, cmd: () => exec("underline"), label: "Underline" },
        { icon: List, cmd: () => exec("insertUnorderedList"), label: "List" },
        { icon: Quote, cmd: () => exec("formatBlock", "BLOCKQUOTE"), label: "Quote" },
        { icon: LinkIcon, cmd: () => { const url = prompt("URL:"); if (url) exec("createLink", url); }, label: "Link" },
        { icon: ImageIcon, cmd: () => { const url = prompt("URL Gambar:"); if (url) exec("insertImage", url); }, label: "Image" },
    ];

    return (
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white" data-testid="rich-editor">
            <div className="flex items-center gap-1 px-2 py-1.5 border-b border-slate-100 bg-slate-50/60">
                {tools.map((t, i) => (
                    <button key={i} type="button" onClick={t.cmd} title={t.label}
                        className="w-8 h-8 rounded-lg hover:bg-white text-slate-700 hover:text-brand-700 flex items-center justify-center transition">
                        <t.icon className="w-3.5 h-3.5" />
                    </button>
                ))}
            </div>
            <div
                ref={ref}
                contentEditable
                onInput={(e) => onChange?.(e.currentTarget.innerHTML)}
                dangerouslySetInnerHTML={{ __html: value || "" }}
                data-placeholder={placeholder}
                className="min-h-[200px] p-4 text-sm leading-relaxed text-brand-900 focus:outline-none [&_h3]:font-display [&_h3]:font-bold [&_h3]:text-lg [&_h3]:text-brand-950 [&_h3]:mt-3 [&_h3]:mb-2 [&_blockquote]:border-l-4 [&_blockquote]:border-brand-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-brand-800 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-brand-700 [&_a]:underline [&_img]:rounded-lg [&_img]:my-3 empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400"
            />
        </div>
    );
}
