"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  getProjectMessages,
  sendProjectMessage,
  type ProjectMessage,
} from "@/lib/api";
import { Icon } from "@/components/icons/Icon";

function formatTime(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

type ProjectChatProps = {
  projectId: string;
  currentUser: { id: string; name: string } | null;
  compact?: boolean;
};

export function ProjectChat({ projectId, currentUser, compact }: ProjectChatProps) {
  const [messages, setMessages] = useState<ProjectMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const data = await getProjectMessages(projectId);
      setMessages(data.messages);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    setLoading(true);
    load();
    const interval = setInterval(load, 12_000);
    return () => clearInterval(interval);
  }, [load]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const body = draft.trim();
    if (!body || !currentUser || sending) return;

    setSending(true);
    setError(null);
    try {
      const { message } = await sendProjectMessage(projectId, body);
      setMessages((prev) => [...prev, message]);
      setDraft("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={`project-collab-panel ${compact ? "project-collab-panel-compact" : ""}`}>
      <header className="project-collab-panel-header">
        <div className="project-collab-panel-icon">
          <Icon name="mail" size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="project-collab-panel-title">Team chat</h3>
          <p className="project-collab-panel-desc">Messages sync across your team in real time.</p>
        </div>
        <span className="project-collab-live">Live</span>
      </header>

      <div ref={listRef} className="project-chat-feed">
        {loading && messages.length === 0 ? (
          <p className="project-chat-empty">Loading conversation…</p>
        ) : messages.length === 0 ? (
          <div className="project-chat-empty-state">
            <span className="project-chat-empty-icon">
              <Icon name="mail" size={24} />
            </span>
            <p className="text-sm font-medium text-foreground">Start the conversation</p>
            <p className="mt-1 text-xs text-foreground-muted">
              Share updates, questions, or review notes with your team.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isSelf = currentUser?.id === msg.authorId;
            const prev = messages[index - 1];
            const showMeta =
              !prev ||
              prev.authorId !== msg.authorId ||
              new Date(msg.createdAt).getTime() - new Date(prev.createdAt).getTime() > 300_000;

            return (
              <div
                key={msg.id}
                className={`project-chat-row ${isSelf ? "project-chat-row-self" : ""}`}
              >
                {!isSelf && showMeta && (
                  <span className="project-chat-avatar" aria-hidden>
                    {initials(msg.author.name)}
                  </span>
                )}
                {!isSelf && !showMeta && <span className="project-chat-avatar-spacer" aria-hidden />}
                <div className="project-chat-content">
                  {showMeta && (
                    <div className="project-chat-meta">
                      <span className="project-chat-name">{isSelf ? "You" : msg.author.name}</span>
                      <time className="project-chat-time">{formatTime(msg.createdAt)}</time>
                    </div>
                  )}
                  <p className="project-chat-text">{msg.body}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {error && <p className="project-collab-error">{error}</p>}

      <form onSubmit={handleSubmit} className="project-chat-compose">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={currentUser ? "Write a message…" : "Sign in to chat"}
          disabled={!currentUser || sending}
          className="project-form-input project-chat-input"
          maxLength={500}
        />
        <button
          type="submit"
          disabled={!currentUser || !draft.trim() || sending}
          className="btn-primary project-chat-send"
        >
          {sending ? "…" : "Send"}
        </button>
      </form>
    </div>
  );
}
