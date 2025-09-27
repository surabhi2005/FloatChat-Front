// src/components/MessageCard.jsx
import React from "react";
import TextCard from "./TextCard";
import TableCard from "./TableCard";
import ChartCard from "./ChartCard";
import MapCard from "./MapCard";
import CanvasDebugPanel from "./CanvasDebugPanel";

export default function MessageCard({ message }) {
    const { content, type, loading } = message;

    if (type === "user") return <TextCard text={content} isUser />;

    if (loading) return <TextCard text="Bot is thinking..." />;

    if (!content) return <TextCard text="No response yet." />;

    // Priority logic
    if (content.structured) {
        switch (content.structured.type) {
            case "table":
                return <TableCard data={content.structured} />;
            case "chart":
                return <ChartCard data={content.structured} />;
            case "map":
                return <MapCard data={content.structured} />;
            default:
                return <TextCard text={content.answer || "No data found"} />;
        }
    } else if (content.answer && content.answer !== "INSUFFICIENT_CONTEXT") {
        return <TextCard text={content.answer} />;
    } else {
        return <TextCard text="No data found for your query" />;
    }
}
