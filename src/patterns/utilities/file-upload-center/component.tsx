"use client";

import { useState } from "react";
import {
  Check,
  CloudUpload,
  FileImage,
  FileText,
  FolderOpen,
  MoreHorizontal,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { PatternPreviewProps } from "@/types/pattern";
import {
  UtilityShowcase,
  utilityQuickSpring,
  utilitySpring,
} from "@/patterns/utilities/shared/utility-showcase";

interface UploadFile {
  id: number;
  name: string;
  size: string;
  progress: number;
  type: "image" | "document";
}
const starterFiles: UploadFile[] = [
  { id: 1, name: "Capa-aurora.png", size: "4,8 MB", progress: 100, type: "image" },
  { id: 2, name: "Briefing-final.pdf", size: "1,2 MB", progress: 72, type: "document" },
];

export default function FileUploadCenter(props: PatternPreviewProps) {
  const [files, setFiles] = useState(starterFiles);
  const [dragging, setDragging] = useState(false);

  const addMockFile = () => {
    const id = Date.now();
    setFiles((current) => [...current, { id, name: "Nova-referência.jpg", size: "2,6 MB", progress: 18, type: "image" }]);
    [46, 78, 100].forEach((progress, index) => {
      window.setTimeout(() => {
        setFiles((current) => current.map((file) => file.id === id ? { ...file, progress } : file));
      }, 430 * (index + 1));
    });
  };

  return (
    <UtilityShowcase
      {...props}
      eyebrow="Arquivos em movimento"
      title="Central de upload"
      description="Envio por arraste, progresso vivo e organização imediata em uma superfície compacta e responsiva."
      accent={props.accent ?? "#4a8fce"}
    >
      {({ size }) => (
        <div className="utility-view u-split upload-view">
          <aside className="u-aside upload-aside">
            <div className="u-brand"><span className="u-brand-mark"><CloudUpload size={16} /></span> Arquivos</div>
            <div>
              <span className="u-kicker">Espaço do projeto</span>
              <h2 className="u-title">Solte. Organize. Continue.</h2>
              <p className="u-copy u-aside-copy">Tudo entra no fluxo sem interromper o que você está fazendo.</p>
            </div>
            <div className="upload-storage u-hide-small">
              <div className="u-row"><span>18,4 GB usados</span><b>64%</b></div>
              <div className="u-progress"><span style={{ width: "64%" }} /></div>
            </div>
          </aside>

          <main className="u-main upload-main">
            <motion.button
              type="button"
              className={`upload-drop${dragging ? " is-dragging" : ""}`}
              onDragEnter={() => setDragging(true)}
              onDragLeave={() => setDragging(false)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => { event.preventDefault(); setDragging(false); addMockFile(); }}
              onClick={addMockFile}
              animate={{ scale: dragging ? 1.015 : 1 }}
              transition={utilityQuickSpring}
            >
              <motion.span animate={{ y: dragging ? -5 : 0 }} transition={utilityQuickSpring}><CloudUpload size={21} /></motion.span>
              <b>{dragging ? "Pode soltar" : "Arraste seus arquivos"}</b>
              <small>ou toque para selecionar · até 100 MB</small>
            </motion.button>

            <div className="u-row upload-head">
              <span>{files.length} arquivos recentes</span>
              <button type="button" className="u-link-button" onClick={addMockFile}><Plus size={12} /> Adicionar</button>
            </div>

            <AnimatePresence mode="popLayout" initial={false}>
              <motion.ul layout className="u-list upload-list">
                {files.slice(-(size === "small" ? 2 : size === "medium" ? 3 : 4)).map((file) => {
                  const Icon = file.type === "image" ? FileImage : FileText;
                  return (
                    <motion.li layout key={file.id} className="u-list-item upload-file" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 20 }} transition={utilitySpring}>
                      <span className="u-list-icon"><Icon size={15} /></span>
                      <div className="u-grow">
                        <b>{file.name}</b>
                        <small>{file.progress === 100 ? `${file.size} · concluído` : `${file.progress}% de ${file.size}`}</small>
                        {file.progress < 100 ? <div className="u-progress"><motion.span animate={{ width: `${file.progress}%` }} transition={utilitySpring} /></div> : null}
                      </div>
                      {file.progress === 100 ? <span className="upload-done"><Check size={13} /></span> : <button type="button" className="upload-remove" onClick={() => setFiles((current) => current.filter((item) => item.id !== file.id))}><X size={13} /></button>}
                    </motion.li>
                  );
                })}
              </motion.ul>
            </AnimatePresence>

            {size === "large" ? (
              <div className="upload-folders u-secondary-detail">
                <span><FolderOpen size={13} /> Referências</span>
                <span><Sparkles size={13} /> Entregas finais</span>
                <button type="button"><MoreHorizontal size={14} /></button>
              </div>
            ) : null}
          </main>
        </div>
      )}
    </UtilityShowcase>
  );
}
