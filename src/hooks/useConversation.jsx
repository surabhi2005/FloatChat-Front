// src/hooks/useConversation.jsx
import { useState } from "react";
import { runQuery, getJobResult } from "../api/ragApi";

export function useConversation() {
    const [messages, setMessages] = useState([]);

    const sendQuery = async (query) => {
        const msgId = crypto.randomUUID();
        setMessages((prev) => [...prev, { id: msgId, type: "user", content: query }]);
        const jobMeta = await runQuery({ query });
        setMessages((prev) => [...prev, { id: jobMeta.job_id, type: "bot", content: null, loading: true }]);
        const result = await getJobResult(jobMeta.job_id);
        setMessages((prev) =>
            prev.map((m) =>
                m.id === jobMeta.job_id
                    ? { ...m, content: result, loading: false }
                    : m
            )
        );
    };

    return { messages, sendQuery };
}
