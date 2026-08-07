"use client";

import { useRef, useState, useEffect } from "react";
import { toPng } from "html-to-image";
import { createClient } from "@/lib/supabase/client";
import type { Parfum } from "@/lib/supabase/types";

interface StoryCardProps {
  parfum: Parfum;
  avis: string;
  prix: string;
  dateStr: string;
}

/**
 * Composant visuel 9:16 exportable
 * Ratio = 1080×1920 → rendu à 540×960 (scale 2× pour HD)
 */
export function StoryCard({ parfum, avis, prix, dateStr }: StoryCardProps) {
  return (
    <div
      id="story-card"
      style={{
        width: "540px",
        height: "960px",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Geist', 'Geist Sans', -apple-system, sans-serif",
        background: "linear-gradient(160deg, #0a0a0a 0%, #14100a 40%, #0a0a0a 100%)",
        color: "#f5f0e8",
        flexShrink: 0,
      }}
    >
      {/* Background decorative circles */}
      <div
        style={{
          position: "absolute",
          top: "-80px",
          right: "-80px",
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(192,160,80,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "120px",
          left: "-100px",
          width: "280px",
          height: "280px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(192,160,80,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Top border */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "linear-gradient(90deg, transparent, #c0a050, transparent)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          padding: "52px 44px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        {/* Brand header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "52px",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "10px",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "#c0a050",
                margin: 0,
              }}
            >
              Parfums Ramzi
            </p>
            <p
              style={{
                fontSize: "10px",
                letterSpacing: "0.2em",
                color: "rgba(245,240,232,0.5)",
                margin: "2px 0 0",
              }}
            >
              · Québec · Canada ·
            </p>
          </div>
          <div
            style={{
              fontSize: "10px",
              letterSpacing: "0.15em",
              color: "rgba(245,240,232,0.4)",
              textAlign: "right",
            }}
          >
            {dateStr}
          </div>
        </div>

        {/* "Parfum du Jour" label */}
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              border: "1px solid rgba(192,160,80,0.35)",
              borderRadius: "100px",
              background: "rgba(192,160,80,0.08)",
            }}
          >
            <span
              style={{
                fontSize: "9px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#c0a050",
              }}
            >
              ✦ Parfum du Jour
            </span>
          </div>
        </div>

        {/* Main fragrance title */}
        <div style={{ marginBottom: "16px" }}>
          <p
            style={{
              fontSize: "13px",
              letterSpacing: "0.2em",
              color: "#c0a050",
              margin: 0,
              fontWeight: 400,
              textTransform: "uppercase",
            }}
          >
            {parfum.maison}
          </p>
          <h1
            style={{
              fontSize: "42px",
              fontWeight: 300,
              lineHeight: 1.1,
              margin: "6px 0 0",
              letterSpacing: "-0.01em",
              color: "#f5f0e8",
            }}
          >
            {parfum.nom}
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "rgba(245,240,232,0.5)",
              margin: "8px 0 0",
              letterSpacing: "0.1em",
            }}
          >
            {parfum.concentration}
            {parfum.annee ? ` · ${parfum.annee}` : ""}
            {" · "}
            {parfum.genre}
          </p>
        </div>

        {/* Decorative line */}
        <div
          style={{
            width: "48px",
            height: "1px",
            background: "linear-gradient(90deg, #c0a050, transparent)",
            marginBottom: "32px",
          }}
        />

        {/* Pyramide olfactive */}
        <div style={{ marginBottom: "32px" }}>
          <p
            style={{
              fontSize: "9px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(192,160,80,0.7)",
              margin: "0 0 14px",
            }}
          >
            Pyramide Olfactive
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {parfum.notes_tete.length > 0 && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#facc15",
                    flexShrink: 0,
                    marginTop: "5px",
                  }}
                />
                <div>
                  <span
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.2em",
                      color: "rgba(245,240,232,0.4)",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "2px",
                    }}
                  >
                    Tête
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      color: "rgba(245,240,232,0.8)",
                      fontWeight: 300,
                      letterSpacing: "0.03em",
                    }}
                  >
                    {parfum.notes_tete.join("  ·  ")}
                  </span>
                </div>
              </div>
            )}
            {parfum.notes_coeur.length > 0 && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#fb7185",
                    flexShrink: 0,
                    marginTop: "5px",
                  }}
                />
                <div>
                  <span
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.2em",
                      color: "rgba(245,240,232,0.4)",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "2px",
                    }}
                  >
                    Cœur
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      color: "rgba(245,240,232,0.8)",
                      fontWeight: 300,
                      letterSpacing: "0.03em",
                    }}
                  >
                    {parfum.notes_coeur.join("  ·  ")}
                  </span>
                </div>
              </div>
            )}
            {parfum.notes_fond.length > 0 && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#92400e",
                    flexShrink: 0,
                    marginTop: "5px",
                  }}
                />
                <div>
                  <span
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.2em",
                      color: "rgba(245,240,232,0.4)",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "2px",
                    }}
                  >
                    Fond
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      color: "rgba(245,240,232,0.8)",
                      fontWeight: 300,
                      letterSpacing: "0.03em",
                    }}
                  >
                    {parfum.notes_fond.join("  ·  ")}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Avis */}
        {avis && (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "24px",
              background: "rgba(192,160,80,0.06)",
              border: "1px solid rgba(192,160,80,0.15)",
              borderRadius: "16px",
              marginBottom: "32px",
            }}
          >
            <p
              style={{
                fontSize: "9px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "rgba(192,160,80,0.7)",
                margin: "0 0 12px",
              }}
            >
              ✦ Notre Avis
            </p>
            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.65,
                color: "rgba(245,240,232,0.85)",
                margin: 0,
                fontWeight: 300,
                fontStyle: "italic",
                letterSpacing: "0.01em",
              }}
            >
              &ldquo;{avis}&rdquo;
            </p>
          </div>
        )}

        {/* Prix & CTA */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
            background: "linear-gradient(135deg, rgba(192,160,80,0.15), rgba(192,160,80,0.05))",
            border: "1px solid rgba(192,160,80,0.3)",
            borderRadius: "14px",
            marginBottom: "24px",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "9px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "rgba(192,160,80,0.7)",
                margin: "0 0 4px",
              }}
            >
              Décant 10 ml
            </p>
            <p
              style={{
                fontSize: "32px",
                fontWeight: 300,
                color: "#c0a050",
                margin: 0,
                letterSpacing: "-0.01em",
              }}
            >
              {parseFloat(prix).toLocaleString("fr-CA", {
                style: "currency",
                currency: "CAD",
              })}
            </p>
          </div>
          <div
            style={{
              padding: "10px 20px",
              background: "linear-gradient(135deg, #c0a050, #9a7a30)",
              borderRadius: "100px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#0a0a0a",
                margin: 0,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Disponible
            </p>
            <p
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#0a0a0a",
                margin: 0,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              en DM ↗
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              height: "1px",
              flex: 1,
              background: "linear-gradient(90deg, transparent, rgba(192,160,80,0.3))",
            }}
          />
          <p
            style={{
              fontSize: "9px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(192,160,80,0.5)",
              margin: 0,
            }}
          >
            Parfums Ramzi
          </p>
          <div
            style={{
              height: "1px",
              flex: 1,
              background: "linear-gradient(90deg, rgba(192,160,80,0.3), transparent)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
