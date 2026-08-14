"use client";

import { FormEvent, KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
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

function formatDateLabel(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === now.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function avatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const hues = [200, 220, 260, 280, 320, 160, 180];
  return hues[Math.abs(hash) % hues.length];
}

type ProjectChatProps = {
  projectId: string;
  currentUser: { id: string; name: string } | null;
  compact?: boolean;
  memberCount?: number;
};

export function ProjectChat({ projectId, currentUser, compact, memberCount }: ProjectChatProps) {
  const [messages, setMessages] = useState<ProjectMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const load = useCallback(async () => {
    try {
      const data = await getProjectMessages(projectId);
      setMessages(data.messages);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load messages");
    } finally {
      setLoading(false);
      setRefreshing(false);
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

  const handleRefresh = () => {
    setRefreshing(true);
    load();
  };

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    const body = draft.trim();
    if (!body || !currentUser || sending) return;

    setSending(true);
    setError(null);
    try {
      const { message } = await sendProjectMessage(projectId, body);
      setMessages((prev) => [...prev, message]);
      setDraft("");
      inputRef.current?.focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const groupedMessages = useMemo(() => {
    const groups: { date: string; items: ProjectMessage[] }[] = [];
    for (const msg of messages) {
      const dateKey = new Date(msg.createdAt).toDateString();
      const last = groups[groups.length - 1];
      if (last && last.date === dateKey) {
        last.items.push(msg);
      } else {
        groups.push({ date: dateKey, items: [msg] });
      }
    }
    return groups;
  }, [messages]);

  return (
    <div className={`project-collab-panel ${compact ? "project-collab-panel-compact" : ""}`}>
      <header className="project-collab-panel-header">
        <div className="project-collab-panel-icon">
          <Icon name="mail" size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="project-collab-panel-title">Team chat</h3>
            <span className="project-collab-live">
              <span className="project-collab-live-dot" aria-hidden />
              Live
            </span>
          </div>
          <p className="project-collab-panel-desc">
            {memberCount && memberCount > 0
              ? `${memberCount} member${memberCount === 1 ? "" : "s"}`
              : "Messages sync across your team in real time."}
          </p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="project-collab-refresh"
          aria-label="Refresh messages"
        >
          <Icon name="history" size={16} className={refreshing ? "project-collab-spin" : ""} />
        </button>
      </header>

      <div ref={listRef} className="project-chat-feed">
        {loading && messages.length === 0 ? (
          <div className="project-chat-skeleton">
            {[1, 2, 3].map((i) => (
              <div key={i} className="project-chat-skeleton-row">
                <span className="project-chat-skeleton-avatar" />
                <span className="project-chat-skeleton-bubble" />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="project-chat-empty-state">
            <span className="project-chat-empty-icon">
              <Icon name="mail" size={24} />
            </span>
            <p className="text-sm font-semibold text-foreground">Start the conversation</p>
            <p className="mt-1 max-w-[14rem] text-xs leading-relaxed text-foreground-muted">
              Share updates, flag issues, or coordinate reviews with your project team.
            </p>
          </div>
        ) : (
          groupedMessages.map((group) => (
            <div key={group.date} className="project-chat-day-group">
              <div className="project-chat-date-divider">
                <span>{formatDateLabel(group.items[0].createdAt)}</span>
              </div>
              {group.items.map((msg, index) => {
                const isSelf = currentUser?.id === msg.authorId;
                const prev = group.items[index - 1];
                const showMeta =
                  !prev ||
                  prev.authorId !== msg.authorId ||
                  new Date(msg.createdAt).getTime() - new Date(prev.createdAt).getTime() > 300_000;

                return (
                  <div
                    key={msg.id}
                    className={`project-chat-row ${isSelf ? "project-chat-row-self" : ""} ${!showMeta ? "project-chat-row-continued" : ""}`}
                  >
                    {!isSelf && showMeta ? (
                      <span
                        className="project-chat-avatar"
                        style={{ background: `hsl(${avatarColor(msg.author.name)} 45% 45%)` }}
                        aria-hidden
                      >
                        {initials(msg.author.name)}
                      </span>
                    ) : !isSelf ? (
                      <span className="project-chat-avatar-spacer" aria-hidden />
                    ) : null}
                    <div className="project-chat-content">
                      {showMeta && (
                        <div className="project-chat-meta">
                          <span className="project-chat-name">{isSelf ? "You" : msg.author.name}</span>
                          <time className="project-chat-time" dateTime={msg.createdAt}>
                            {formatTime(msg.createdAt)}
                          </time>
                        </div>
                      )}
                      <p className="project-chat-text">{msg.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {error && <p className="project-collab-error">{error}</p>}

      <form onSubmit={handleSubmit} className="project-chat-compose">
        <div className="project-chat-compose-inner">
          <textarea
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={currentUser ? "Write a message…" : "Sign in to chat"}
            disabled={!currentUser || sending}
            className="project-chat-input"
            maxLength={500}
            rows={1}
          />
          <button
            type="submit"
            disabled={!currentUser || !draft.trim() || sending}
            className="project-chat-send"
            aria-label="Send message"
          >
            <Icon name="arrow-right" size={16} />
          </button>
        </div>
        <p className="project-chat-compose-hint">
          Enter to send · Shift+Enter for new line
          {draft.length > 0 && (
            <span className="project-chat-char-count">{draft.length}/500</span>
          )}
        </p>
      </form>
    </div>
  );
}
