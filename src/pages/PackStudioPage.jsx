import React, { useState, useCallback, useEffect, useRef } from "react";

const T = {
  bg: "#FAFAF7",
  surface: "#FFFFFF",
  surfaceAlt: "#F5F2EC",
  border: "#E8E2D6",
  borderStrong: "#D4C9B0",
  gold: "#C9A96E",
  goldDark: "#A8813F",
  goldLight: "#F0E6D0",
  goldMid: "#E5D0A0",
  text: "#1A1612",
  textSec: "#6B5E4A",
  textMuted: "#A89880",
  danger: "#8B3030",
  shadow: "0 2px 16px rgba(160,130,80,0.12), 0 1px 4px rgba(0,0,0,0.06)",
  shadowUp: "0 -4px 24px rgba(160,130,80,0.12), 0 -1px 6px rgba(0,0,0,0.06)",
};

const FACES = [
  { id: "front", label: "Front" },
  { id: "back", label: "Back" },
  { id: "left", label: "Left" },
  { id: "right", label: "Right" },
  { id: "top", label: "Top" },
  { id: "bottom", label: "Bottom" },
];
const MATERIALS = [
  "Kraft Paper",
  "Premium Paper",
  "Rigid Board",
  "Corrugated",
  "Eco Recycled",
];
const LAMINATIONS = ["High Gloss", "Soft Matte", "Velvet Touch", "Uncoated"];
const FINISHES = ["None", "Spot UV", "Foil Gold", "Foil Silver", "Emboss"];
const FONTS = [
  "Georgia, serif",
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "'Courier New', monospace",
];
const FONT_LABELS = ["Georgia", "Serif", "Sans", "Mono", "Cursive", "Courier"];

function calcPrice(w, h, d, qty, material) {
  const vol = w * h * d;
  const m =
    {
      "Kraft Paper": 0.8,
      "Premium Paper": 1,
      "Rigid Board": 1.5,
      Corrugated: 1.2,
      "Eco Recycled": 0.9,
    }[material] || 1;
  const unit = Math.max(80, Math.round(160 * (vol / 10) * m * 10) / 10);
  return { unit, total: unit * qty };
}

const Icon = ({ d, size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const Icons = {
  box: "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",
  download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3",
  upload: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12",
  image:
    "M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2zM8.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm-3 9l5-5 3.5 3.5 2.5-2.5 3 3",
  type: "M4 7V4h16v3M9 20h6M12 4v16",
  trash:
    "M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2",
  check: "M20 6L9 17l-5-5",
  layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  rotate:
    "M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15",
  shopping:
    "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0",
  copy: "M20 9H11a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2V11a2 2 0 00-2-2z M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1",
  x: "M18 6L6 18M6 6l12 12",
  undo: "M3 7v6h6M3 13A9 9 0 1021 12",
  redo: "M21 7v6h-6M21 13A9 9 0 113 12",
  maximize:
    "M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3",
  save: "M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2zM17 21v-8H7v8M7 3v5h8",
  flip: "M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4",
  sliders:
    "M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z",
};

const numInput = {
  background: T.surfaceAlt,
  border: `1px solid ${T.border}`,
  borderRadius: 5,
  color: T.goldDark,
  fontSize: 13,
  padding: "7px 8px",
  outline: "none",
  textAlign: "center",
  fontFamily: "monospace",
  width: "100%",
  boxSizing: "border-box",
};
const selectStyle = {
  width: "100%",
  background: T.surfaceAlt,
  border: `1px solid ${T.border}`,
  borderRadius: 6,
  color: T.textSec,
  fontSize: 12,
  padding: "9px 10px",
  outline: "none",
  cursor: "pointer",
};
const hdrBtn = {
  height: 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "none",
  border: `1px solid ${T.border}`,
  borderRadius: 6,
  cursor: "pointer",
  color: T.textSec,
  padding: "0 8px",
  gap: 5,
};

function Sec({ label, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          fontSize: 9,
          color: T.textMuted,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          marginBottom: 8,
          fontWeight: 700,
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

// ─── CSS 3D BOX ───────────────────────────────────────────────────────────────
function CSS3DBox({
  boxW,
  boxH,
  boxD,
  boxColor,
  faceImages,
  lamination,
  finish,
  rotX,
  rotY,
  isSnapping,
}) {
  const sc = 55;
  const w = boxW * sc,
    h = boxH * sc,
    d = boxD * sc;
  const isGloss = lamination === "High Gloss";
  const hasMetal = finish === "Foil Gold" || finish === "Foil Silver";
  const metalColor =
    finish === "Foil Gold"
      ? "rgba(201,169,110,0.35)"
      : "rgba(200,200,210,0.35)";

  const sheen = isGloss ? (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(135deg,rgba(255,255,255,0.22) 0%,transparent 60%)",
        pointerEvents: "none",
        zIndex: 2,
      }}
    />
  ) : null;
  const metalSheen = hasMetal ? (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: metalColor,
        pointerEvents: "none",
        zIndex: 2,
      }}
    />
  ) : null;

  const makeFace = (face, outerStyle, innerStyle) => {
    const img = faceImages[face];
    return (
      <React.Fragment key={face}>
        <div
          style={{
            position: "absolute",
            background: img
              ? `url(${img}) center/cover no-repeat, ${boxColor}`
              : boxColor,
            outline: "1px solid rgba(0,0,0,0.10)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            ...outerStyle,
          }}
        >
          {sheen}
          {metalSheen}
        </div>
        <div
          style={{
            position: "absolute",
            background: boxColor,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            pointerEvents: "none",
            filter: "brightness(0.82)",
            ...innerStyle,
          }}
        />
      </React.Fragment>
    );
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: 900,
        perspectiveOrigin: "50% 40%",
      }}
    >
      <div
        style={{
          position: "relative",
          width: w,
          height: h,
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          transition: isSnapping
            ? "transform 0.45s cubic-bezier(0.25,0.8,0.25,1)"
            : "transform 0.05s linear",
        }}
      >
        {makeFace(
          "front",
          { width: w, height: h, transform: `translateZ(${d / 2}px)` },
          {
            width: w,
            height: h,
            transform: `translateZ(${d / 2}px) rotateY(180deg)`,
          },
        )}
        {makeFace(
          "back",
          {
            width: w,
            height: h,
            transform: `rotateY(180deg) translateZ(${d / 2}px)`,
          },
          {
            width: w,
            height: h,
            transform: `rotateY(180deg) translateZ(${d / 2}px) rotateY(180deg)`,
          },
        )}
        {makeFace(
          "right",
          {
            width: d,
            height: h,
            left: (w - d) / 2,
            transform: `rotateY(90deg) translateZ(${w / 2}px)`,
          },
          {
            width: d,
            height: h,
            left: (w - d) / 2,
            transform: `rotateY(90deg) translateZ(${w / 2}px) rotateY(180deg)`,
          },
        )}
        {makeFace(
          "left",
          {
            width: d,
            height: h,
            left: (w - d) / 2,
            transform: `rotateY(-90deg) translateZ(${w / 2}px)`,
          },
          {
            width: d,
            height: h,
            left: (w - d) / 2,
            transform: `rotateY(-90deg) translateZ(${w / 2}px) rotateY(180deg)`,
          },
        )}
        {makeFace(
          "top",
          {
            width: w,
            height: d,
            top: (h - d) / 2,
            transform: `rotateX(90deg) translateZ(${h / 2}px)`,
          },
          {
            width: w,
            height: d,
            top: (h - d) / 2,
            transform: `rotateX(90deg) translateZ(${h / 2}px) rotateX(180deg)`,
          },
        )}
        {makeFace(
          "bottom",
          {
            width: w,
            height: d,
            top: (h - d) / 2,
            transform: `rotateX(-90deg) translateZ(${h / 2}px)`,
          },
          {
            width: w,
            height: d,
            top: (h - d) / 2,
            transform: `rotateX(-90deg) translateZ(${h / 2}px) rotateX(180deg)`,
          },
        )}
      </div>
    </div>
  );
}

// ─── DRAGGABLE ELEMENT ────────────────────────────────────────────────────────
function DraggableEl({
  el,
  selected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  canvasW,
  canvasH,
}) {
  const startRef = useRef(null);

  const handleDragStart = (e) => {
    e.stopPropagation();
    onSelect(el.id);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    startRef.current = { sx: clientX, sy: clientY, ox: el.x, oy: el.y };
    const move = (ev) => {
      const cx = ev.touches ? ev.touches[0].clientX : ev.clientX;
      const cy = ev.touches ? ev.touches[0].clientY : ev.clientY;
      onUpdate(el.id, {
        x: Math.max(
          0,
          Math.min(
            canvasW - el.w,
            startRef.current.ox + cx - startRef.current.sx,
          ),
        ),
        y: Math.max(
          0,
          Math.min(
            canvasH - el.h,
            startRef.current.oy + cy - startRef.current.sy,
          ),
        ),
      });
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", up);
  };

  const handleResizeStart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    startRef.current = { sx: clientX, sy: clientY, ow: el.w, oh: el.h };
    const move = (ev) => {
      const cx = ev.touches ? ev.touches[0].clientX : ev.clientX;
      const cy = ev.touches ? ev.touches[0].clientY : ev.clientY;
      onUpdate(el.id, {
        w: Math.max(40, startRef.current.ow + cx - startRef.current.sx),
        h: Math.max(20, startRef.current.oh + cy - startRef.current.sy),
      });
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", up);
  };

  const transform =
    `${el.flipX ? "scaleX(-1)" : ""} ${el.flipY ? "scaleY(-1)" : ""}`.trim() ||
    "none";

  return (
    <div
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(el.id);
      }}
      style={{
        position: "absolute",
        left: el.x,
        top: el.y,
        width: el.w,
        height: el.h,
        border: selected ? `1.5px solid ${T.gold}` : "1.5px solid transparent",
        boxSizing: "border-box",
        cursor: "grab",
        userSelect: "none",
        zIndex: selected ? 10 : 1,
        transform,
      }}
    >
      {el.type === "image" && (
        <img
          src={el.src}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            pointerEvents: "none",
            display: "block",
          }}
          alt=""
        />
      )}
      {el.type === "text" && (
        <div
          style={{
            width: "100%",
            height: "100%",
            color: el.color,
            fontSize: el.size,
            fontFamily: el.fontFamily || "serif",
            fontWeight: el.bold ? "bold" : "normal",
            fontStyle: el.italic ? "italic" : "normal",
            display: "flex",
            alignItems: "center",
            justifyContent:
              el.align === "left"
                ? "flex-start"
                : el.align === "right"
                  ? "flex-end"
                  : "center",
            textAlign: el.align || "center",
            pointerEvents: "none",
            lineHeight: 1.2,
            padding: "0 4px",
            boxSizing: "border-box",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {el.t}
        </div>
      )}
      {el.type === "shape" &&
        (() => {
          const s = {
            width: "100%",
            height: "100%",
            opacity: (el.opacity || 100) / 100,
          };
          if (el.shape === "circle")
            return (
              <div style={{ ...s, background: el.fill, borderRadius: "50%" }} />
            );
          if (el.shape === "diamond")
            return (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "70%",
                    height: "70%",
                    background: el.fill,
                    opacity: (el.opacity || 100) / 100,
                    transform: "rotate(45deg)",
                  }}
                />
              </div>
            );
          if (el.shape === "line")
            return (
              <div
                style={{
                  width: "100%",
                  height: 3,
                  background: el.fill,
                  opacity: (el.opacity || 100) / 100,
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
            );
          return <div style={{ ...s, background: el.fill }} />;
        })()}
      {selected && (
        <>
          <div
            onMouseDown={handleResizeStart}
            onTouchStart={handleResizeStart}
            style={{
              position: "absolute",
              right: -5,
              bottom: -5,
              width: 10,
              height: 10,
              background: T.gold,
              borderRadius: 2,
              cursor: "nwse-resize",
              zIndex: 20,
            }}
          />
          <div
            onClick={(e) => {
              e.stopPropagation();
              onDelete(el.id);
            }}
            style={{
              position: "absolute",
              right: -10,
              top: -10,
              width: 18,
              height: 18,
              background: T.danger,
              borderRadius: "50%",
              cursor: "pointer",
              zIndex: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            <Icon d={Icons.x} size={10} />
          </div>
        </>
      )}
    </div>
  );
}

// ─── DIELINE EXPORT ───────────────────────────────────────────────────────────
async function downloadDieline(
  boxW,
  boxH,
  boxD,
  boxName,
  material,
  faceElements,
  faceImages,
  boxColor,
) {
  const S = 80;

  async function renderFaceToDataUrl(faceId) {
    let fw, fh;
    if (faceId === "front" || faceId === "back") {
      fw = boxW;
      fh = boxH;
    } else if (faceId === "left" || faceId === "right") {
      fw = boxD;
      fh = boxH;
    } else {
      fw = boxW;
      fh = boxD;
    }
    const cw = fw * S,
      ch = fh * S;
    const canvas = document.createElement("canvas");
    canvas.width = cw * 2;
    canvas.height = ch * 2;
    const ctx = canvas.getContext("2d");
    ctx.scale(2, 2);
    ctx.fillStyle = boxColor;
    ctx.fillRect(0, 0, cw, ch);

    if (faceImages[faceId]) {
      await new Promise((res) => {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, cw, ch);
          res();
        };
        img.onerror = res;
        img.src = faceImages[faceId];
      });
    } else {
      const scale = S / 105;
      const els = faceElements[faceId] || [];
      let pending = 0;
      await new Promise((res) => {
        const checkDone = () => {
          if (--pending <= 0) res();
        };
        els.forEach((el) => {
          if (el.type === "shape") {
            ctx.save();
            ctx.globalAlpha = (el.opacity || 100) / 100;
            ctx.fillStyle = el.fill;
            const ex = el.x * scale,
              ey = el.y * scale,
              ew = el.w * scale,
              eh = el.h * scale;
            if (el.shape === "circle") {
              ctx.beginPath();
              ctx.ellipse(
                ex + ew / 2,
                ey + eh / 2,
                ew / 2,
                eh / 2,
                0,
                0,
                Math.PI * 2,
              );
              ctx.fill();
            } else if (el.shape === "diamond") {
              ctx.save();
              ctx.translate(ex + ew / 2, ey + eh / 2);
              ctx.rotate(Math.PI / 4);
              ctx.fillRect(-ew * 0.35, -eh * 0.35, ew * 0.7, eh * 0.7);
              ctx.restore();
            } else if (el.shape === "line") {
              ctx.fillRect(ex, ey + eh / 2 - 1.5, ew, 3);
            } else {
              ctx.fillRect(ex, ey, ew, eh);
            }
            ctx.restore();
          } else if (el.type === "text") {
            ctx.save();
            const fs = el.size * scale;
            ctx.font = `${el.italic ? "italic " : ""}${el.bold ? "bold " : ""}${fs}px ${el.fontFamily || "serif"}`;
            ctx.fillStyle = el.color;
            ctx.textBaseline = "middle";
            ctx.textAlign = el.align || "center";
            const ex = el.x * scale,
              ey = el.y * scale,
              ew = el.w * scale,
              eh = el.h * scale;
            const tx =
              el.align === "left"
                ? ex + 4
                : el.align === "right"
                  ? ex + ew - 4
                  : ex + ew / 2;
            ctx.fillText(el.t, tx, ey + eh / 2);
            ctx.restore();
          } else if (el.type === "image") {
            pending++;
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
              const ex = el.x * scale,
                ey = el.y * scale,
                ew = el.w * scale,
                eh = el.h * scale;
              ctx.drawImage(img, ex, ey, ew, eh);
              checkDone();
            };
            img.onerror = checkDone;
            img.src = el.src;
          }
        });
        if (pending === 0) res();
      });
    }
    return { dataUrl: canvas.toDataURL("image/png"), w: cw, h: ch };
  }

  const faces = {};
  for (const f of ["front", "back", "left", "right", "top", "bottom"]) {
    faces[f] = await renderFaceToDataUrl(f);
  }

  const fW = boxW * S,
    fH = boxH * S,
    fD = boxD * S;
  const pad = 60;
  const headerH = 56;
  const totalW = pad + fD + fW + fD + fW + pad;
  const totalH = pad + fD + fH + fD + pad;

  const frontX = pad + fD,
    frontY = pad + fD;
  const backX = pad + fD + fW + fD,
    backY = pad + fD;
  const leftX = pad,
    leftY = pad + fD;
  const rightX = pad + fD + fW,
    rightY = pad + fD;
  const topX = pad + fD,
    topY = pad;
  const bottomX = pad + fD,
    bottomY = pad + fD + fH;

  const imgTag = (id, x, y, w, h) =>
    `<image href="${faces[id].dataUrl}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"/>`;

  const faceRects = [
    { id: "front", x: frontX, y: frontY, w: fW, h: fH },
    { id: "back", x: backX, y: backY, w: fW, h: fH },
    { id: "left", x: leftX, y: leftY, w: fD, h: fH },
    { id: "right", x: rightX, y: rightY, w: fD, h: fH },
    { id: "top", x: topX, y: topY, w: fW, h: fD },
    { id: "bottom", x: bottomX, y: bottomY, w: fW, h: fD },
  ];

  const cutPath = `
    M ${pad} ${pad + fD}
    L ${pad + fD} ${pad + fD}
    L ${pad + fD} ${pad}
    L ${pad + fD + fW} ${pad}
    L ${pad + fD + fW} ${pad + fD}
    L ${pad + fD + fW + fD} ${pad + fD}
    L ${pad + fD + fW + fD + fW} ${pad + fD}
    L ${pad + fD + fW + fD + fW} ${pad + fD + fH}
    L ${pad + fD + fW + fD} ${pad + fD + fH}
    L ${pad + fD + fW + fD} ${pad + fD + fH + fD}
    L ${pad + fD + fW} ${pad + fD + fH + fD}
    L ${pad + fD + fW} ${pad + fD + fH}
    L ${pad + fD} ${pad + fD + fH}
    L ${pad + fD} ${pad + fD + fH + fD}
    L ${pad} ${pad + fD + fH + fD}
    Z
  `;

  const regMark = (cx, cy) => `
    <line x1="${cx - 10}" y1="${cy}" x2="${cx + 10}" y2="${cy}" stroke="#C9A96E" stroke-width="0.8"/>
    <line x1="${cx}" y1="${cy - 10}" x2="${cx}" y2="${cy + 10}" stroke="#C9A96E" stroke-width="0.8"/>
    <circle cx="${cx}" cy="${cy}" r="3" fill="none" stroke="#C9A96E" stroke-width="0.8"/>
  `;

  const regMarks = [
    regMark(pad - 20, pad - 20),
    regMark(totalW - pad + 20, pad - 20),
    regMark(pad - 20, totalH - pad + 20),
    regMark(totalW - pad + 20, totalH - pad + 20),
  ].join("");

  const faceLabels = [
    { id: "front", x: frontX + fW / 2, y: frontY - 8 },
    { id: "back", x: backX + fW / 2, y: backY - 8 },
    { id: "left", x: leftX + fD / 2, y: leftY - 8 },
    { id: "right", x: rightX + fD / 2, y: rightY - 8 },
    { id: "top", x: topX + fW / 2, y: topY - 5 },
    { id: "bottom", x: bottomX + fW / 2, y: bottomY + fD + 14 },
  ];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
    width="${totalW}" height="${totalH + headerH}" viewBox="0 0 ${totalW} ${totalH + headerH}" style="background:#FAFAF7">
    <defs>
      <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill="#A89880"/>
      </marker>
    </defs>
    <rect width="100%" height="100%" fill="#FAFAF7"/>
    <text x="${pad}" y="24" font-family="sans-serif" font-size="16" font-weight="bold" fill="#1A1612">PackStudio — Dieline Export</text>
    <text x="${pad}" y="46" font-family="sans-serif" font-size="11" fill="#6B5E4A">${boxName} · ${boxW}"×${boxH}"×${boxD}" · ${material} · ${new Date().toLocaleDateString()}</text>
    <g transform="translate(0,${headerH})">
      ${faceRects
        .map(
          (f) => `
        <rect x="${f.x}" y="${f.y}" width="${f.w}" height="${f.h}" fill="${boxColor}" stroke="none"/>
        ${imgTag(f.id, f.x, f.y, f.w, f.h)}
      `,
        )
        .join("")}
      <path d="${cutPath}" fill="none" stroke="#1A1612" stroke-width="1.5"/>
      ${faceRects.map((f) => `<rect x="${f.x}" y="${f.y}" width="${f.w}" height="${f.h}" fill="none" stroke="#1A1612" stroke-width="0.8" stroke-dasharray="5 3"/>`).join("")}
      ${regMarks}
      ${faceLabels.map((f) => `<text x="${f.x}" y="${f.y}" font-family="sans-serif" font-size="10" fill="#A89880" text-anchor="middle">${f.id.toUpperCase()}</text>`).join("")}
    </g>
  </svg>`;

  const a = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" })),
    download: `PackStudio_${boxName.replace(/\s+/g, "_")}_Dieline.svg`,
  });
  a.click();
}

// ─── TOAST ───────────────────────────────────────────────────────────────────
function Toast({ msg, isMobile }) {
  if (!msg) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: isMobile ? 88 : 24,
        left: "50%",
        transform: "translateX(-50%)",
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 10,
        padding: "10px 18px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        zIndex: 200,
        boxShadow: "0 8px 32px rgba(160,130,80,0.18)",
        whiteSpace: "nowrap",
        animation: "fadeUp 0.2s ease",
      }}
    >
      <span style={{ color: T.gold, display: "flex" }}>
        <Icon d={Icons.check} size={14} />
      </span>
      <span style={{ fontSize: 12, color: T.textSec, fontWeight: 500 }}>
        {msg}
      </span>
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function PackStudio() {
  const [boxW, setBoxW] = useState(3);
  const [boxH, setBoxH] = useState(5);
  const [boxD, setBoxD] = useState(2);
  const [material, setMaterial] = useState("Premium Paper");
  const [lamination, setLamination] = useState("High Gloss");
  const [finish, setFinish] = useState("None");
  const [qty, setQty] = useState(250);
  const [boxColor, setBoxColor] = useState("#f5f0eb");
  const [boxName, setBoxName] = useState("Signature Collection");
  const [viewMode, setViewMode] = useState("3d");
  const [currentFace, setCurrentFace] = useState("front");
  const [showGuides, setShowGuides] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState(null);
  const [activeTab, setActiveTab] = useState("design");
  const [rightPanel, setRightPanel] = useState("layers");
  const [faceElements, setFaceElements] = useState({});
  const [faceImages, setFaceImages] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [history, setHistory] = useState([{}]);
  const [histIdx, setHistIdx] = useState(0);
  const [newText, setNewText] = useState("");
  const [fontColor, setFontColor] = useState("#1a1a1a");
  const [fontSize, setFontSize] = useState(36);
  const [fontFamily, setFontFamily] = useState("Georgia, serif");
  const [fontBold, setFontBold] = useState(false);
  const [fontItalic, setFontItalic] = useState(false);
  const [textAlign, setTextAlign] = useState("center");
  const [shapeType, setShapeType] = useState("rect");
  const [shapeColor, setShapeColor] = useState("#c9a96e");
  const [shapeOpacity, setShapeOpacity] = useState(100);
  const [toast, setToast] = useState(null);
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [rotX, setRotX] = useState(-15);
  const [rotY, setRotY] = useState(25);
  const [isSnapping, setIsSnapping] = useState(false);
  const canvasRef = useRef(null);

  // FACE → rotation angles that bring each face toward the viewer
  const FACE_ANGLES = {
    front: { rx: 0, ry: 0 },
    back: { rx: 0, ry: 180 },
    right: { rx: 0, ry: -90 },
    left: { rx: 0, ry: 90 },
    top: { rx: 90, ry: 0 },
    bottom: { rx: -90, ry: 0 },
  };

  const snapToFace = useCallback((faceId) => {
    const { rx, ry } = FACE_ANGLES[faceId];
    setIsSnapping(true);
    setRotX(rx);
    setRotY(ry);
    setTimeout(() => setIsSnapping(false), 480);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { unit, total } = calcPrice(boxW, boxH, boxD, qty, material);
  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }, []);

  const canvasDims = useCallback(() => {
    const s = isMobile ? 65 : 105;
    if (currentFace === "front" || currentFace === "back")
      return { w: boxW * s, h: boxH * s };
    if (currentFace === "left" || currentFace === "right")
      return { w: boxD * s, h: boxH * s };
    return { w: boxW * s, h: boxD * s };
  }, [currentFace, boxW, boxH, boxD, isMobile]);
  const cd = canvasDims();

  const pushHistory = useCallback(
    (elements) => {
      setHistory((prev) => [
        ...prev.slice(0, histIdx + 1),
        JSON.parse(JSON.stringify(elements)),
      ]);
      setHistIdx((p) => p + 1);
    },
    [histIdx],
  );

  const undo = () => {
    if (histIdx <= 0) return;
    setFaceElements(history[histIdx - 1]);
    setHistIdx((h) => h - 1);
    showToast("Undone");
  };
  const redo = () => {
    if (histIdx >= history.length - 1) return;
    setFaceElements(history[histIdx + 1]);
    setHistIdx((h) => h + 1);
    showToast("Redone");
  };

  const captureFace = useCallback(
    async (faceId, elements, color) => {
      const els = elements[faceId] || [];
      if (!els.length) return null;
      return new Promise((resolve) => {
        const s = isMobile ? 65 : 105;
        let cw, ch;
        if (faceId === "front" || faceId === "back") {
          cw = boxW * s;
          ch = boxH * s;
        } else if (faceId === "left" || faceId === "right") {
          cw = boxD * s;
          ch = boxH * s;
        } else {
          cw = boxW * s;
          ch = boxD * s;
        }
        const canvas = document.createElement("canvas");
        canvas.width = cw * 2;
        canvas.height = ch * 2;
        const ctx = canvas.getContext("2d");
        ctx.scale(2, 2);
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, cw, ch);
        let pending = 0;
        const done = () => {
          if (--pending <= 0) resolve(canvas.toDataURL("image/png"));
        };
        els.forEach((el) => {
          if (el.type === "shape") {
            ctx.save();
            ctx.globalAlpha = (el.opacity || 100) / 100;
            ctx.fillStyle = el.fill;
            if (el.shape === "circle") {
              ctx.beginPath();
              ctx.ellipse(
                el.x + el.w / 2,
                el.y + el.h / 2,
                el.w / 2,
                el.h / 2,
                0,
                0,
                Math.PI * 2,
              );
              ctx.fill();
            } else if (el.shape === "diamond") {
              ctx.save();
              ctx.translate(el.x + el.w / 2, el.y + el.h / 2);
              ctx.rotate(Math.PI / 4);
              ctx.fillRect(-el.w * 0.35, -el.h * 0.35, el.w * 0.7, el.h * 0.7);
              ctx.restore();
            } else if (el.shape === "line") {
              ctx.fillRect(el.x, el.y + el.h / 2 - 1.5, el.w, 3);
            } else {
              ctx.fillRect(el.x, el.y, el.w, el.h);
            }
            ctx.restore();
          } else if (el.type === "text") {
            ctx.save();
            ctx.font = `${el.italic ? "italic " : ""}${el.bold ? "bold " : ""}${el.size}px ${el.fontFamily || "serif"}`;
            ctx.fillStyle = el.color;
            ctx.textBaseline = "middle";
            ctx.textAlign = el.align || "center";
            const tx =
              el.align === "left"
                ? el.x + 4
                : el.align === "right"
                  ? el.x + el.w - 4
                  : el.x + el.w / 2;
            ctx.fillText(el.t, tx, el.y + el.h / 2);
            ctx.restore();
          } else if (el.type === "image") {
            pending++;
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
              ctx.save();
              ctx.drawImage(img, el.x, el.y, el.w, el.h);
              ctx.restore();
              done();
            };
            img.onerror = done;
            img.src = el.src;
          }
        });
        if (pending === 0) resolve(canvas.toDataURL("image/png"));
      });
    },
    [isMobile, boxW, boxH, boxD],
  );

  const applyFaceTo3D = useCallback(async () => {
    setSelectedId(null);
    const dataUrl = await captureFace(currentFace, faceElements, boxColor);
    if (dataUrl) setFaceImages((p) => ({ ...p, [currentFace]: dataUrl }));
    else
      setFaceImages((p) => {
        const n = { ...p };
        delete n[currentFace];
        return n;
      });
    setViewMode("3d");
  }, [currentFace, faceElements, boxColor, captureFace]);

  // FIXED: switchFace now always snaps 3D view to the selected face
  const switchFace = async (faceId) => {
    if (viewMode === "2d") {
      const dataUrl = await captureFace(currentFace, faceElements, boxColor);
      if (dataUrl) setFaceImages((p) => ({ ...p, [currentFace]: dataUrl }));
      else
        setFaceImages((p) => {
          const n = { ...p };
          delete n[currentFace];
          return n;
        });
    }
    setCurrentFace(faceId);
    snapToFace(faceId);
    if (isMobile) setActiveDrawer(null);
  };

  // ─── 3D ORBIT ───────────────────────────────────────────────────────────────
  const getFrontFace = useCallback((rx, ry) => {
    let y = (((ry % 360) + 540) % 360) - 180;
    let x = (((rx % 360) + 540) % 360) - 180;
    if (x > 45) return "top";
    if (x < -45) return "bottom";
    if (y > -45 && y <= 45) return "front";
    if (y > 45 && y <= 135) return "right";
    if (y > 135 || y <= -135) return "back";
    if (y > -135 && y <= -45) return "left";
    return "front";
  }, []);

  const handle3DMouseDown = (e) => {
    if (viewMode !== "3d") return;
    const startX = e.touches ? e.touches[0].clientX : e.clientX;
    const startY = e.touches ? e.touches[0].clientY : e.clientY;
    const startRX = rotX,
      startRY = rotY;
    let moved = false;
    let latestRX = rotX,
      latestRY = rotY;
    const move = (ev) => {
      const cx = ev.touches ? ev.touches[0].clientX : ev.clientX;
      const cy = ev.touches ? ev.touches[0].clientY : ev.clientY;
      if (Math.abs(cx - startX) > 5 || Math.abs(cy - startY) > 5) moved = true;
      if (!moved) return;
      setIsSnapping(false);
      latestRX = Math.max(-60, Math.min(60, startRX - (cy - startY) * 0.4));
      latestRY = startRY + (cx - startX) * 0.5;
      setRotX(latestRX);
      setRotY(latestRY);
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
      if (!moved) {
        const face = getFrontFace(latestRX, latestRY);
        snapToFace(face);
        setCurrentFace(face);
      }
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", up);
  };

  // ─── ELEMENTS ─────────────────────────────────────────────────────────────
  const addEl = (data) => {
    const el = { id: Date.now().toString(), x: 30, y: 30, ...data };
    setFaceElements((p) => {
      const next = { ...p, [currentFace]: [...(p[currentFace] || []), el] };
      pushHistory(next);
      return next;
    });
    setSelectedId(el.id);
    setViewMode("2d");
  };
  const updateEl = (id, props) =>
    setFaceElements((p) => ({
      ...p,
      [currentFace]: (p[currentFace] || []).map((el) =>
        el.id === id ? { ...el, ...props } : el,
      ),
    }));
  const deleteEl = (id) => {
    setFaceElements((p) => {
      const next = {
        ...p,
        [currentFace]: (p[currentFace] || []).filter((el) => el.id !== id),
      };
      pushHistory(next);
      return next;
    });
    setSelectedId(null);
    showToast("Removed");
  };

  const addText = () => {
    if (!newText.trim()) return showToast("Type something first");
    addEl({
      type: "text",
      t: newText,
      color: fontColor,
      size: fontSize,
      fontFamily,
      bold: fontBold,
      italic: fontItalic,
      align: textAlign,
      w: Math.max(160, newText.length * fontSize * 0.6),
      h: fontSize * 2,
    });
    setNewText("");
    showToast("Text added");
    if (isMobile) setActiveDrawer(null);
  };
  const addShape = () => {
    addEl({
      type: "shape",
      shape: shapeType,
      fill: shapeColor,
      opacity: shapeOpacity,
      w: 120,
      h: 120,
    });
    showToast("Shape added");
    if (isMobile) setActiveDrawer(null);
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      addEl({
        type: "image",
        src: ev.target.result,
        w: cd.w * 0.7,
        h: cd.h * 0.5,
      });
      showToast("Image added");
    };
    reader.readAsDataURL(file);
  };

  const clearFace = () => {
    setFaceElements((p) => {
      const n = { ...p, [currentFace]: [] };
      pushHistory(n);
      return n;
    });
    setFaceImages((p) => {
      const n = { ...p };
      delete n[currentFace];
      return n;
    });
    setSelectedId(null);
    showToast("Face cleared");
  };

  const copyFaceToAll = async () => {
    const dataUrl = await captureFace(currentFace, faceElements, boxColor);
    const img = dataUrl || faceImages[currentFace];
    if (!img) return showToast("Add content to this face first");
    setFaceImages({
      front: img,
      back: img,
      left: img,
      right: img,
      top: img,
      bottom: img,
    });
    showToast("Copied to all faces");
  };

  const saveDesign = () => {
    setSavedDesigns((p) => [
      {
        name: boxName,
        date: new Date().toLocaleDateString(),
        faceImages: { ...faceImages },
        faceElements: JSON.parse(JSON.stringify(faceElements)),
        boxColor,
        material,
        lamination,
        finish,
        boxW,
        boxH,
        boxD,
      },
      ...p.slice(0, 4),
    ]);
    showToast("Saved!");
  };
  const loadDesign = (d) => {
    setBoxName(d.name);
    setFaceImages(d.faceImages);
    setFaceElements(d.faceElements);
    setBoxColor(d.boxColor);
    setMaterial(d.material);
    setLamination(d.lamination);
    setFinish(d.finish);
    setBoxW(d.boxW);
    setBoxH(d.boxH);
    setBoxD(d.boxD);
    showToast("Loaded!");
  };

  const selEl = (faceElements[currentFace] || []).find(
    (e) => e.id === selectedId,
  );
  const TABS = [
    { id: "design", label: "Design" },
    { id: "text", label: "Text" },
    { id: "shapes", label: "Shapes" },
    { id: "upload", label: "Upload" },
    { id: "saves", label: "Saved" },
  ];

  // ─── TAB CONTENTS ──────────────────────────────────────────────────────────
  const DesignTab = () => (
    <>
      <Sec label="Box Name">
        <input
          value={boxName}
          onChange={(e) => setBoxName(e.target.value)}
          style={{
            ...numInput,
            textAlign: "left",
            fontFamily: "inherit",
            fontSize: 13,
          }}
        />
      </Sec>
      <Sec label="Dimensions (inches)">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 8,
          }}
        >
          {[
            ["W", boxW, setBoxW],
            ["H", boxH, setBoxH],
            ["D", boxD, setBoxD],
          ].map(([l, v, s]) => (
            <div key={l}>
              <div
                style={{
                  fontSize: 9,
                  color: T.textMuted,
                  marginBottom: 4,
                  letterSpacing: "0.1em",
                }}
              >
                {l}
              </div>
              <input
                type="number"
                value={v}
                min={1}
                max={24}
                onChange={(e) => s(Math.max(1, Number(e.target.value)))}
                style={numInput}
              />
            </div>
          ))}
        </div>
      </Sec>
      <Sec label={`Quantity — ${qty.toLocaleString()} units`}>
        <input
          type="range"
          min={50}
          max={5000}
          step={50}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          style={{ width: "100%", accentColor: T.gold }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          <span style={{ fontSize: 11, color: T.textSec }}>
            Total: ₹{total.toLocaleString()}
          </span>
          <span style={{ fontSize: 11, color: T.goldDark, fontWeight: 700 }}>
            ₹{unit}/pc
          </span>
        </div>
      </Sec>
      <Sec label="Material">
        <select
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
          style={selectStyle}
        >
          {MATERIALS.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </Sec>
      <Sec label="Lamination">
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}
        >
          {LAMINATIONS.map((l) => (
            <button
              key={l}
              onClick={() => setLamination(l)}
              style={{
                padding: "9px 6px",
                background: lamination === l ? T.goldLight : "none",
                border: `1px solid ${lamination === l ? T.gold : T.border}`,
                borderRadius: 6,
                color: lamination === l ? T.goldDark : T.textSec,
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </Sec>
      <Sec label="Special Finish">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {FINISHES.map((f) => (
            <button
              key={f}
              onClick={() => setFinish(f)}
              style={{
                padding: "5px 10px",
                background: finish === f ? T.goldMid : "none",
                border: `1px solid ${finish === f ? T.gold : T.border}`,
                borderRadius: 20,
                color: finish === f ? T.goldDark : T.textMuted,
                fontSize: 10,
                cursor: "pointer",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </Sec>
      <Sec label="Base Color">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              overflow: "hidden",
              border: `1px solid ${T.border}`,
            }}
          >
            <input
              type="color"
              value={boxColor}
              onChange={(e) => setBoxColor(e.target.value)}
              style={{
                width: 52,
                height: 52,
                border: "none",
                cursor: "pointer",
                margin: "-8px",
              }}
            />
          </div>
          <span
            style={{
              fontSize: 11,
              color: T.textMuted,
              fontFamily: "monospace",
            }}
          >
            {boxColor.toUpperCase()}
          </span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {[
            "#f5f0eb",
            "#1a1a1a",
            "#2d4a3e",
            "#8b1a1a",
            "#1a2d4a",
            "#4a3a28",
            "#f0e6d3",
            "#2a2a35",
          ].map((c) => (
            <button
              key={c}
              onClick={() => setBoxColor(c)}
              style={{
                width: 26,
                height: 26,
                background: c,
                border: `2px solid ${boxColor === c ? T.gold : "transparent"}`,
                borderRadius: 5,
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      </Sec>
    </>
  );

  const TextTab = () => (
    <>
      <Sec label="Text">
        <textarea
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Enter text..."
          style={{
            width: "100%",
            minHeight: 80,
            background: T.surfaceAlt,
            border: `1px solid ${T.border}`,
            borderRadius: 8,
            color: T.text,
            fontSize: 13,
            padding: 10,
            outline: "none",
            resize: "vertical",
            fontFamily: "inherit",
            boxSizing: "border-box",
          }}
        />
      </Sec>
      <Sec label="Font">
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          style={selectStyle}
        >
          {FONTS.map((f, i) => (
            <option key={f} value={f}>
              {FONT_LABELS[i]}
            </option>
          ))}
        </select>
      </Sec>
      <Sec label={`Size — ${fontSize}px`}>
        <input
          type="range"
          min={10}
          max={120}
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          style={{ width: "100%", accentColor: T.gold }}
        />
      </Sec>
      <Sec label="Style">
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {[
            ["B", fontBold, () => setFontBold((b) => !b)],
            ["I", fontItalic, () => setFontItalic((b) => !b)],
          ].map(([lbl, active, fn]) => (
            <button
              key={lbl}
              onClick={fn}
              style={{
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: active ? T.goldLight : T.surfaceAlt,
                border: `1px solid ${active ? T.gold : T.border}`,
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: lbl === "B" ? "bold" : "normal",
                fontStyle: lbl === "I" ? "italic" : "normal",
                color: active ? T.goldDark : T.textMuted,
              }}
            >
              {lbl}
            </button>
          ))}
          {["left", "center", "right"].map((a) => (
            <button
              key={a}
              onClick={() => setTextAlign(a)}
              style={{
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: textAlign === a ? T.goldLight : T.surfaceAlt,
                border: `1px solid ${textAlign === a ? T.gold : T.border}`,
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 11,
                color: textAlign === a ? T.goldDark : T.textMuted,
              }}
            >
              {a[0].toUpperCase()}
            </button>
          ))}
        </div>
      </Sec>
      <Sec label="Color">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              overflow: "hidden",
              border: `1px solid ${T.border}`,
            }}
          >
            <input
              type="color"
              value={fontColor}
              onChange={(e) => setFontColor(e.target.value)}
              style={{
                width: 48,
                height: 48,
                border: "none",
                cursor: "pointer",
                margin: "-8px",
              }}
            />
          </div>
          <span
            style={{
              fontSize: 10,
              color: T.textMuted,
              fontFamily: "monospace",
            }}
          >
            {fontColor}
          </span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {[
            "#1a1a1a",
            "#ffffff",
            "#c9a96e",
            "#8b1a1a",
            "#2d4a3e",
            "#f5f0eb",
            "#888",
            "#333",
          ].map((c) => (
            <button
              key={c}
              onClick={() => setFontColor(c)}
              style={{
                width: 24,
                height: 24,
                background: c,
                border: `2px solid ${fontColor === c ? T.gold : "transparent"}`,
                borderRadius: 4,
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      </Sec>
      <button
        onClick={addText}
        style={{
          width: "100%",
          padding: "12px",
          background: `linear-gradient(135deg,${T.gold},${T.goldDark})`,
          border: "none",
          borderRadius: 8,
          color: "#fff",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.1em",
          cursor: "pointer",
        }}
      >
        ADD TEXT
      </button>
    </>
  );

  const ShapesTab = () => (
    <>
      <Sec label="Shape">
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
        >
          {[
            ["rect", "Rectangle"],
            ["circle", "Circle"],
            ["diamond", "Diamond"],
            ["line", "Line"],
          ].map(([s, l]) => (
            <button
              key={s}
              onClick={() => setShapeType(s)}
              style={{
                padding: "10px",
                background: shapeType === s ? T.goldLight : "none",
                border: `1px solid ${shapeType === s ? T.gold : T.border}`,
                borderRadius: 6,
                color: shapeType === s ? T.goldDark : T.textSec,
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </Sec>
      <Sec label="Fill Color">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              overflow: "hidden",
              border: `1px solid ${T.border}`,
            }}
          >
            <input
              type="color"
              value={shapeColor}
              onChange={(e) => setShapeColor(e.target.value)}
              style={{
                width: 48,
                height: 48,
                border: "none",
                cursor: "pointer",
                margin: "-8px",
              }}
            />
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {[
            "#c9a96e",
            "#1a1a1a",
            "#2d4a3e",
            "#8b1a1a",
            "#f5f0eb",
            "#4a3a28",
            "#1a2d4a",
            "#fff",
          ].map((c) => (
            <button
              key={c}
              onClick={() => setShapeColor(c)}
              style={{
                width: 24,
                height: 24,
                background: c,
                border: `2px solid ${shapeColor === c ? T.gold : T.border}`,
                borderRadius: 4,
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      </Sec>
      <Sec label={`Opacity — ${shapeOpacity}%`}>
        <input
          type="range"
          min={10}
          max={100}
          value={shapeOpacity}
          onChange={(e) => setShapeOpacity(Number(e.target.value))}
          style={{ width: "100%", accentColor: T.gold }}
        />
      </Sec>
      <button
        onClick={addShape}
        style={{
          width: "100%",
          padding: "12px",
          background: `linear-gradient(135deg,${T.gold},${T.goldDark})`,
          border: "none",
          borderRadius: 8,
          color: "#fff",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.1em",
          cursor: "pointer",
        }}
      >
        ADD SHAPE
      </button>
    </>
  );

  const UploadTab = () => (
    <>
      <label
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          padding: "28px 16px",
          background: T.surfaceAlt,
          border: `1.5px dashed ${T.borderStrong}`,
          borderRadius: 12,
          cursor: "pointer",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: T.goldLight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: T.gold,
          }}
        >
          <Icon d={Icons.upload} size={22} />
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 13, color: T.textSec, marginBottom: 4 }}>
            Tap to upload image
          </div>
          <div style={{ fontSize: 11, color: T.textMuted }}>
            PNG, JPG, SVG, WebP
          </div>
        </div>
        <input type="file" hidden accept="image/*" onChange={handleUpload} />
      </label>
      <Sec label="Quick Actions">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button
            onClick={copyFaceToAll}
            style={{
              padding: "11px",
              background: "none",
              border: `1px solid ${T.border}`,
              borderRadius: 6,
              color: T.textSec,
              fontSize: 11,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            Mirror face to all sides
          </button>
          <button
            onClick={clearFace}
            style={{
              padding: "11px",
              background: "none",
              border: "1px solid #e8c8c8",
              borderRadius: 6,
              color: T.danger,
              fontSize: 11,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            Clear this face
          </button>
        </div>
      </Sec>
    </>
  );

  const SavesTab = () => (
    <>
      <button
        onClick={saveDesign}
        style={{
          width: "100%",
          padding: "12px",
          background: `linear-gradient(135deg,${T.gold},${T.goldDark})`,
          border: "none",
          borderRadius: 8,
          color: "#fff",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.1em",
          cursor: "pointer",
          marginBottom: 16,
        }}
      >
        SAVE CURRENT DESIGN
      </button>
      {savedDesigns.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "24px 0",
            color: T.textMuted,
            fontSize: 12,
          }}
        >
          No saved designs yet
        </div>
      ) : (
        savedDesigns.map((d, i) => (
          <div
            key={i}
            onClick={() => loadDesign(d)}
            style={{
              padding: 14,
              background: T.surfaceAlt,
              border: `1px solid ${T.border}`,
              borderRadius: 8,
              cursor: "pointer",
              marginBottom: 8,
            }}
          >
            <div style={{ fontSize: 13, color: T.goldDark, fontWeight: 600 }}>
              {d.name}
            </div>
            <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>
              {d.date} · {d.boxW}"×{d.boxH}"×{d.boxD}"
            </div>
          </div>
        ))
      )}
    </>
  );

  const tabContentMap = {
    design: <DesignTab />,
    text: <TextTab />,
    shapes: <ShapesTab />,
    upload: <UploadTab />,
    saves: <SavesTab />,
  };

  // ─── LAYERS PANEL ──────────────────────────────────────────────────────────
  const LayersContent = () => (
    <>
      <div
        style={{
          display: "flex",
          gap: 0,
          marginBottom: 14,
          borderBottom: `1px solid ${T.border}`,
        }}
      >
        {[
          { id: "layers", label: "Layers" },
          { id: "properties", label: "Properties" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setRightPanel(t.id)}
            style={{
              flex: 1,
              padding: "10px 4px",
              background: "none",
              border: "none",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: "pointer",
              color: rightPanel === t.id ? T.goldDark : T.textMuted,
              borderBottom: `2px solid ${rightPanel === t.id ? T.gold : "transparent"}`,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      {rightPanel === "layers" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {!(faceElements[currentFace] || []).length ? (
            <div
              style={{
                textAlign: "center",
                padding: "24px 0",
                color: T.textMuted,
                fontSize: 12,
              }}
            >
              No layers on this face
            </div>
          ) : (
            [...(faceElements[currentFace] || [])].reverse().map((el) => (
              <div
                key={el.id}
                onClick={() => {
                  setSelectedId(el.id);
                  setViewMode("2d");
                  if (isMobile) setActiveDrawer(null);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px",
                  background: selectedId === el.id ? T.goldLight : T.surfaceAlt,
                  border: `1px solid ${selectedId === el.id ? T.gold : T.border}`,
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                <span style={{ color: T.gold, flexShrink: 0 }}>
                  <Icon
                    d={
                      el.type === "image"
                        ? Icons.image
                        : el.type === "text"
                          ? Icons.type
                          : Icons.layers
                    }
                    size={14}
                  />
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: T.textSec,
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {el.type === "image"
                    ? "Image"
                    : el.type === "text"
                      ? el.t
                      : el.shape}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteEl(el.id);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: T.textMuted,
                    padding: 4,
                  }}
                >
                  <Icon d={Icons.x} size={12} />
                </button>
              </div>
            ))
          )}
        </div>
      )}
      {rightPanel === "properties" &&
        (selEl ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div
              style={{
                fontSize: 10,
                color: T.gold,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {selEl.type}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              {[
                ["X", selEl.x, (v) => updateEl(selectedId, { x: Number(v) })],
                ["Y", selEl.y, (v) => updateEl(selectedId, { y: Number(v) })],
                ["W", selEl.w, (v) => updateEl(selectedId, { w: Number(v) })],
                ["H", selEl.h, (v) => updateEl(selectedId, { h: Number(v) })],
              ].map(([l, val, fn]) => (
                <div key={l}>
                  <div
                    style={{ fontSize: 9, color: T.textMuted, marginBottom: 4 }}
                  >
                    {l}
                  </div>
                  <input
                    type="number"
                    value={Math.round(val)}
                    onChange={(e) => fn(e.target.value)}
                    style={numInput}
                  />
                </div>
              ))}
            </div>
            {selEl.type === "text" && (
              <div>
                <div
                  style={{ fontSize: 9, color: T.textMuted, marginBottom: 4 }}
                >
                  SIZE
                </div>
                <input
                  type="number"
                  value={selEl.size}
                  onChange={(e) =>
                    updateEl(selectedId, { size: Number(e.target.value) })
                  }
                  style={numInput}
                />
              </div>
            )}
            {selEl.type === "shape" && (
              <div>
                <div
                  style={{ fontSize: 9, color: T.textMuted, marginBottom: 4 }}
                >
                  OPACITY
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={selEl.opacity}
                  onChange={(e) =>
                    updateEl(selectedId, { opacity: Number(e.target.value) })
                  }
                  style={{ width: "100%", accentColor: T.gold }}
                />
              </div>
            )}
            <div
              style={{
                display: "flex",
                gap: 8,
                paddingTop: 8,
                borderTop: `1px solid ${T.border}`,
              }}
            >
              <button
                onClick={() => {
                  const el = (faceElements[currentFace] || []).find(
                    (e) => e.id === selectedId,
                  );
                  if (el) addEl({ ...el, x: el.x + 20, y: el.y + 20 });
                  showToast("Duplicated");
                }}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "none",
                  border: `1px solid ${T.border}`,
                  borderRadius: 6,
                  color: T.textSec,
                  fontSize: 11,
                  cursor: "pointer",
                }}
              >
                Duplicate
              </button>
              <button
                onClick={() => deleteEl(selectedId)}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "none",
                  border: "1px solid #e8c8c8",
                  borderRadius: 6,
                  color: T.danger,
                  fontSize: 11,
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "24px 0",
              color: T.textMuted,
              fontSize: 12,
            }}
          >
            Select a layer
          </div>
        ))}
    </>
  );

  // ─── VIEWPORT ──────────────────────────────────────────────────────────────
  const Viewport = () => {
    if (viewMode === "3d") {
      return (
        <div
          onMouseDown={handle3DMouseDown}
          onTouchStart={handle3DMouseDown}
          style={{
            width: "100%",
            height: "100%",
            cursor: "grab",
            userSelect: "none",
            position: "relative",
          }}
        >
          <CSS3DBox
            boxW={boxW}
            boxH={boxH}
            boxD={boxD}
            boxColor={boxColor}
            faceImages={faceImages}
            lamination={lamination}
            finish={finish}
            rotX={rotX}
            rotY={rotY}
            isSnapping={isSnapping}
          />
          {showGuides && (
            <div
              style={{
                position: "absolute",
                bottom: 76,
                left: 12,
                background: T.surface + "ee",
                backdropFilter: "blur(8px)",
                border: `1px solid ${T.border}`,
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 11,
                color: T.textSec,
                lineHeight: 1.8,
                boxShadow: T.shadow,
                pointerEvents: "none",
              }}
            >
              <div>
                <span style={{ color: T.gold }}>W</span> {boxW}" ·{" "}
                <span style={{ color: T.gold }}>H</span> {boxH}" ·{" "}
                <span style={{ color: T.gold }}>D</span> {boxD}"
              </div>
              <div>{material}</div>
            </div>
          )}
          <div
            style={{
              position: "absolute",
              bottom: 76,
              right: 12,
              fontSize: 10,
              color: T.textMuted,
              pointerEvents: "none",
            }}
          >
            Drag to rotate
          </div>
        </div>
      );
    }
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: isMobile ? "48px 12px 16px" : "60px 40px 80px",
          boxSizing: "border-box",
          overflowY: "auto",
          position: "relative",
        }}
        onClick={() => setSelectedId(null)}
      >
        {showGrid && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `linear-gradient(${T.borderStrong}44 1px,transparent 1px),linear-gradient(90deg,${T.borderStrong}44 1px,transparent 1px)`,
              backgroundSize: "20px 20px",
              pointerEvents: "none",
            }}
          />
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 9,
              color: T.textMuted,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            Editing · {currentFace}
          </span>
          <div
            ref={canvasRef}
            style={{
              position: "relative",
              backgroundColor: boxColor,
              width: cd.w,
              height: cd.h,
              boxShadow:
                "0 20px 60px rgba(160,130,80,0.18),0 4px 16px rgba(0,0,0,0.08)",
              overflow: "hidden",
              flexShrink: 0,
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedId(null);
            }}
          >
            {(faceElements[currentFace] || []).map((el) => (
              <DraggableEl
                key={el.id}
                el={el}
                selected={selectedId === el.id}
                onSelect={setSelectedId}
                onUpdate={updateEl}
                onDelete={deleteEl}
                onDuplicate={(id) => {
                  const e = (faceElements[currentFace] || []).find(
                    (x) => x.id === id,
                  );
                  if (e) addEl({ ...e, x: e.x + 20, y: e.y + 20 });
                }}
                canvasW={cd.w}
                canvasH={cd.h}
              />
            ))}
          </div>
          {selEl && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 10,
                padding: "6px 10px",
                boxShadow: T.shadow,
              }}
            >
              <span style={{ fontSize: 10, color: T.textMuted }}>
                {selEl.type}
              </span>
              {[
                {
                  icon: Icons.copy,
                  fn: () => {
                    const e = (faceElements[currentFace] || []).find(
                      (x) => x.id === selectedId,
                    );
                    if (e) addEl({ ...e, x: e.x + 20, y: e.y + 20 });
                    showToast("Duplicated");
                  },
                },
                {
                  icon: Icons.flip,
                  fn: () => updateEl(selectedId, { flipX: !selEl.flipX }),
                },
                {
                  icon: Icons.rotate,
                  fn: () => updateEl(selectedId, { flipY: !selEl.flipY }),
                },
                {
                  icon: Icons.trash,
                  fn: () => deleteEl(selectedId),
                  danger: true,
                },
              ].map(({ icon, fn, danger }, i) => (
                <button
                  key={i}
                  onClick={fn}
                  style={{
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: danger ? T.danger : T.textSec,
                  }}
                >
                  <Icon d={icon} size={14} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ─── DRAWER ────────────────────────────────────────────────────────────────
  const Drawer = ({ id, title, children }) => {
    if (activeDrawer !== id) return null;
    return (
      <>
        <div
          onClick={() => setActiveDrawer(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(26,22,18,0.35)",
            zIndex: 50,
          }}
        />
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 60,
            background: T.surface,
            borderRadius: "20px 20px 0 0",
            boxShadow: T.shadowUp,
            maxHeight: "82vh",
            display: "flex",
            flexDirection: "column",
            animation: "slideUp 0.25s ease",
          }}
        >
          <div style={{ padding: "12px 16px 0", flexShrink: 0 }}>
            <div
              style={{
                width: 36,
                height: 4,
                background: T.border,
                borderRadius: 4,
                margin: "0 auto 12px",
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 700, color: T.text }}>
                {title}
              </span>
              <button
                onClick={() => setActiveDrawer(null)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: T.textMuted,
                  padding: 4,
                }}
              >
                <Icon d={Icons.x} size={18} />
              </button>
            </div>
          </div>
          <div
            style={{ overflowY: "auto", padding: "12px 16px 24px", flex: 1 }}
          >
            {children}
          </div>
        </div>
      </>
    );
  };

  // ─── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        fontFamily: "'DM Sans','Helvetica Neue',sans-serif",
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: T.bg,
        color: T.text,
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateX(-50%) translateY(12px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
        @keyframes slideUp { from { transform:translateY(100%); } to { transform:translateY(0); } }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>

      {/* HEADER */}
      <div
        style={{
          height: 52,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px",
          background: T.surface,
          borderBottom: `1px solid ${T.border}`,
          flexShrink: 0,
          zIndex: 30,
          boxShadow: T.shadow,
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              background: `linear-gradient(135deg,${T.gold},${T.goldDark})`,
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              flexShrink: 0,
            }}
          >
            <Icon d={Icons.box} size={14} />
          </div>
          <span
            style={{
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "0.12em",
              color: T.text,
              whiteSpace: "nowrap",
            }}
          >
            PACK<span style={{ color: T.gold }}>Studio</span>
          </span>
          {!isMobile && (
            <>
              <span
                style={{
                  width: 1,
                  height: 16,
                  background: T.border,
                  margin: "0 4px",
                  flexShrink: 0,
                }}
              />
              <input
                value={boxName}
                onChange={(e) => setBoxName(e.target.value)}
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: T.textMuted,
                  fontSize: 12,
                  fontFamily: "inherit",
                  minWidth: 0,
                  width: 150,
                }}
              />
            </>
          )}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexShrink: 0,
          }}
        >
          {!isMobile && (
            <>
              <button onClick={undo} title="Undo" style={hdrBtn}>
                <Icon d={Icons.undo} size={14} />
              </button>
              <button onClick={redo} title="Redo" style={hdrBtn}>
                <Icon d={Icons.redo} size={14} />
              </button>
              <span style={{ width: 1, height: 16, background: T.border }} />
            </>
          )}
          <button onClick={saveDesign} style={{ ...hdrBtn, padding: "0 10px" }}>
            <Icon d={Icons.save} size={14} />
            {!isMobile && <span style={{ fontSize: 11 }}>Save</span>}
          </button>
          <button
            onClick={() =>
              downloadDieline(
                boxW,
                boxH,
                boxD,
                boxName,
                material,
                faceElements,
                faceImages,
                boxColor,
              )
            }
            style={{
              ...hdrBtn,
              padding: "0 10px",
              color: T.goldDark,
              border: `1px solid ${T.gold}`,
              background: T.goldLight,
            }}
          >
            <Icon d={Icons.download} size={14} />
            {!isMobile && <span style={{ fontSize: 11 }}>Dieline</span>}
          </button>
          <button
            onClick={() => showToast("Proceeding to order...")}
            style={{
              padding: "0 12px",
              height: 32,
              background: `linear-gradient(135deg,${T.gold},${T.goldDark})`,
              border: "none",
              borderRadius: 6,
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 5,
              whiteSpace: "nowrap",
            }}
          >
            <Icon d={Icons.shopping} size={13} />
            {!isMobile && "ORDER"}
          </button>
        </div>
      </div>

      {/* BODY */}
      {isMobile ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 10,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 20,
              display: "flex",
              background: T.surface,
              borderRadius: 10,
              padding: 3,
              border: `1px solid ${T.border}`,
              boxShadow: T.shadow,
            }}
          >
            {[
              ["3d", "3D"],
              ["2d", "2D"],
            ].map(([m, l]) => (
              <button
                key={m}
                onClick={() =>
                  m === "3d" ? applyFaceTo3D() : setViewMode("2d")
                }
                style={{
                  padding: "5px 14px",
                  borderRadius: 7,
                  border: "none",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  cursor: "pointer",
                  background: viewMode === m ? T.gold : "none",
                  color: viewMode === m ? "#fff" : T.textMuted,
                }}
              >
                {l}
              </button>
            ))}
          </div>
          {viewMode === "2d" && (
            <button
              onClick={applyFaceTo3D}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                zIndex: 20,
                padding: "6px 10px",
                background: T.surface,
                border: `1px solid ${T.gold}`,
                borderRadius: 8,
                color: T.goldDark,
                fontSize: 10,
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: T.shadow,
              }}
            >
              Apply →3D
            </button>
          )}
          <div
            style={{
              flex: 1,
              position: "relative",
              background: T.surfaceAlt,
              overflow: "hidden",
            }}
          >
            <Viewport />
          </div>
          <div
            style={{
              background: T.goldLight,
              borderTop: `1px solid ${T.border}`,
              padding: "7px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 11, color: T.textSec }}>
              {qty.toLocaleString()} units · ₹{unit}/pc
            </span>
            <span style={{ fontSize: 17, fontWeight: 800, color: T.text }}>
              ₹{total.toLocaleString()}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              background: T.surface,
              borderTop: `1px solid ${T.border}`,
              flexShrink: 0,
              boxShadow: T.shadowUp,
            }}
          >
            {[
              { id: "tools", icon: Icons.sliders, label: "Tools" },
              { id: "faces", icon: Icons.grid, label: "Faces" },
              { id: "layers", icon: Icons.layers, label: "Layers" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() =>
                  setActiveDrawer(activeDrawer === item.id ? null : item.id)
                }
                style={{
                  flex: 1,
                  padding: "10px 4px 12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: activeDrawer === item.id ? T.goldDark : T.textMuted,
                  borderTop: `2px solid ${activeDrawer === item.id ? T.gold : "transparent"}`,
                }}
              >
                <Icon d={item.icon} size={19} />
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                  }}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </div>
          <Drawer id="tools" title="Design Tools">
            <div
              style={{
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
                marginBottom: 16,
              }}
            >
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 20,
                    border: `1px solid ${activeTab === tab.id ? T.gold : T.border}`,
                    background: activeTab === tab.id ? T.goldLight : "none",
                    color: activeTab === tab.id ? T.goldDark : T.textMuted,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {tabContentMap[activeTab]}
          </Drawer>
          <Drawer id="layers" title="Layers & Properties">
            <LayersContent />
          </Drawer>
          <Drawer id="faces" title="Select Face">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 8,
                marginBottom: 16,
              }}
            >
              {FACES.map((f) => (
                <button
                  key={f.id}
                  onClick={() => switchFace(f.id)}
                  style={{
                    padding: "14px 8px",
                    borderRadius: 8,
                    border: `1.5px solid ${currentFace === f.id ? T.gold : T.border}`,
                    background:
                      currentFace === f.id ? T.goldLight : T.surfaceAlt,
                    color: currentFace === f.id ? T.goldDark : T.textSec,
                    fontSize: 13,
                    fontWeight: currentFace === f.id ? 700 : 400,
                    cursor: "pointer",
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                ["3d", "3D Preview", applyFaceTo3D],
                [
                  "2d",
                  "2D Canvas",
                  () => {
                    setViewMode("2d");
                    setActiveDrawer(null);
                  },
                ],
              ].map(([m, l, fn]) => (
                <button
                  key={m}
                  onClick={fn}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: 8,
                    border: `1px solid ${T.border}`,
                    background: viewMode === m ? T.goldLight : "none",
                    color: viewMode === m ? T.goldDark : T.textSec,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          </Drawer>
        </div>
      ) : (
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Left panel */}
          <div
            style={{
              width: 248,
              background: T.surface,
              borderRight: `1px solid ${T.border}`,
              display: "flex",
              flexDirection: "column",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                padding: "12px 12px 8px",
                borderBottom: `1px solid ${T.border}`,
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: "5px 10px",
                      borderRadius: 16,
                      border: `1px solid ${activeTab === tab.id ? T.gold : T.border}`,
                      background: activeTab === tab.id ? T.goldLight : "none",
                      color: activeTab === tab.id ? T.goldDark : T.textMuted,
                      fontSize: 10,
                      fontWeight: 600,
                      cursor: "pointer",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
              {tabContentMap[activeTab]}
            </div>
          </div>

          {/* Viewport */}
          <div
            style={{
              flex: 1,
              position: "relative",
              background: T.surfaceAlt,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 14,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 20,
                display: "flex",
                background: T.surface,
                borderRadius: 10,
                padding: 3,
                border: `1px solid ${T.border}`,
                boxShadow: T.shadow,
              }}
            >
              {[
                ["3d", "3D Preview"],
                ["2d", "2D Canvas"],
              ].map(([mode, label]) => (
                <button
                  key={mode}
                  onClick={() =>
                    mode === "3d" ? applyFaceTo3D() : setViewMode("2d")
                  }
                  style={{
                    padding: "5px 18px",
                    borderRadius: 7,
                    border: "none",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    cursor: "pointer",
                    background: viewMode === mode ? T.gold : "none",
                    color: viewMode === mode ? "#fff" : T.textMuted,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <div
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                zIndex: 20,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {[
                {
                  fn: () => setShowGuides((g) => !g),
                  active: showGuides,
                  icon: Icons.eye,
                  tip: "Guides",
                },
                {
                  fn: () => setShowGrid((g) => !g),
                  active: showGrid,
                  icon: Icons.grid,
                  tip: "Grid",
                },
              ].map(({ fn, active, icon, tip }) => (
                <button
                  key={tip}
                  onClick={fn}
                  title={tip}
                  style={{
                    width: 30,
                    height: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: T.surface,
                    border: `1px solid ${T.border}`,
                    borderRadius: 6,
                    cursor: "pointer",
                    color: active ? T.goldDark : T.textMuted,
                    boxShadow: T.shadow,
                  }}
                >
                  <Icon d={icon} size={13} />
                </button>
              ))}
              {viewMode === "2d" && (
                <button
                  onClick={applyFaceTo3D}
                  title="Apply to 3D"
                  style={{
                    width: 30,
                    height: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: T.goldLight,
                    border: `1px solid ${T.gold}`,
                    borderRadius: 6,
                    cursor: "pointer",
                    color: T.goldDark,
                    boxShadow: T.shadow,
                  }}
                >
                  <Icon d={Icons.maximize} size={13} />
                </button>
              )}
            </div>
            <div style={{ flex: 1, position: "relative" }}>
              <Viewport />
            </div>
            {/* FIXED: Face selector snaps 3D view to that face */}
            <div
              style={{
                position: "absolute",
                bottom: 16,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                background: T.surface + "ee",
                backdropFilter: "blur(12px)",
                border: `1px solid ${T.border}`,
                borderRadius: 10,
                padding: 3,
                gap: 2,
                zIndex: 20,
                boxShadow: T.shadow,
              }}
            >
              {FACES.map((f) => (
                <button
                  key={f.id}
                  onClick={() => switchFace(f.id)}
                  style={{
                    padding: "4px 12px",
                    borderRadius: 7,
                    border: "none",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    cursor: "pointer",
                    background: currentFace === f.id ? T.gold : "none",
                    color: currentFace === f.id ? "#fff" : T.textMuted,
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right panel */}
          <div
            style={{
              width: 214,
              background: T.surface,
              borderLeft: `1px solid ${T.border}`,
              display: "flex",
              flexDirection: "column",
              flexShrink: 0,
            }}
          >
            <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px 0" }}>
              <LayersContent />
            </div>
            <div
              style={{
                padding: "14px",
                borderTop: `1px solid ${T.border}`,
                background: T.goldLight,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: T.textMuted,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                Total
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: T.text,
                  letterSpacing: "-0.02em",
                }}
              >
                ₹{total.toLocaleString()}
              </div>
              <div style={{ fontSize: 10, color: T.textSec, marginTop: 2 }}>
                ₹{unit} · {qty.toLocaleString()} units
              </div>
            </div>
          </div>
        </div>
      )}

      <Toast msg={toast} isMobile={isMobile} />
    </div>
  );
}
