"use client";

import { useEffect, useRef } from "react";

const FeedlyticsWidget = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://widget.feedlytics.in/widget.umd.js";
        script.async = true;
        script.defer = true;
        containerRef.current?.appendChild(script);
    }, []);

    return (
        <div ref={containerRef}>
            <my-widget shadow username="github_kajaveaniruddha"></my-widget>
        </div>
    );
};

declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            "my-widget": any;
        }
    }
}

export default FeedlyticsWidget;
