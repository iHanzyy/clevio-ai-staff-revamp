"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import { Highlight, themes } from "prism-react-renderer";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
    content: string;
    isBot?: boolean;
}

export default function MarkdownRenderer({ content, isBot = false }: MarkdownRendererProps) {
    return (
        <ReactMarkdown
            components={{
                // Code blocks with syntax highlighting
                code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || "");
                    const language = match ? match[1] : "text";
                    const codeString = String(children).replace(/\n$/, "");

                    if (!inline && match) {
                        return (
                            <Highlight
                                theme={isBot ? themes.nightOwl : themes.github}
                                code={codeString}
                                language={language}
                            >
                                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                                    <pre
                                        className={cn(
                                            "p-3 rounded-lg my-2 overflow-x-auto text-xs",
                                            isBot ? "bg-white/10" : "bg-gray-800"
                                        )}
                                        style={{ ...style, margin: 0 }}
                                    >
                                        <code className={className}>
                                            {tokens.map((line, i) => (
                                                <div key={i} {...getLineProps({ line })}>
                                                    {line.map((token, key) => (
                                                        <span key={key} {...getTokenProps({ token })} />
                                                    ))}
                                                </div>
                                            ))}
                                        </code>
                                    </pre>
                                )}
                            </Highlight>
                        );
                    }

                    // Inline code
                    return (
                        <code
                            className={cn(
                                "px-1.5 py-0.5 rounded text-xs font-mono",
                                isBot ? "bg-white/20 text-white" : "bg-gray-200 text-gray-800"
                            )}
                            {...props}
                        >
                            {children}
                        </code>
                    );
                },

                // Paragraphs
                p({ children }) {
                    return <p className="mb-2 last:mb-0">{children}</p>;
                },

                // Bold
                strong({ children }) {
                    return <strong className="font-bold">{children}</strong>;
                },

                // Italic
                em({ children }) {
                    return <em className="italic">{children}</em>;
                },

                // Links
                a({ href, children }) {
                    return (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                                "underline hover:opacity-80 transition-opacity",
                                isBot ? "text-lime-300" : "text-blue-600"
                            )}
                        >
                            {children}
                        </a>
                    );
                },

                // Unordered lists
                ul({ children }) {
                    return <ul className="list-disc ml-4 mb-2 space-y-1">{children}</ul>;
                },

                // Ordered lists
                ol({ children }) {
                    return <ol className="list-decimal ml-4 mb-2 space-y-1">{children}</ol>;
                },

                // List items
                li({ children }) {
                    return <li className="leading-relaxed">{children}</li>;
                },

                // Headers
                h1({ children }) {
                    return <h1 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h1>;
                },
                h2({ children }) {
                    return <h2 className="text-base font-bold mb-2 mt-3 first:mt-0">{children}</h2>;
                },
                h3({ children }) {
                    return <h3 className="text-sm font-bold mb-1 mt-2 first:mt-0">{children}</h3>;
                },
                h4({ children }) {
                    return <h4 className="text-sm font-semibold mb-1 mt-2 first:mt-0">{children}</h4>;
                },
                h5({ children }) {
                    return <h5 className="text-xs font-semibold mb-1 mt-2 first:mt-0">{children}</h5>;
                },
                h6({ children }) {
                    return <h6 className="text-xs font-medium mb-1 mt-2 first:mt-0">{children}</h6>;
                },

                // Blockquotes
                blockquote({ children }) {
                    return (
                        <blockquote
                            className={cn(
                                "border-l-2 pl-3 my-2 italic",
                                isBot ? "border-white/40 text-white/80" : "border-gray-400 text-gray-600"
                            )}
                        >
                            {children}
                        </blockquote>
                    );
                },

                // Horizontal rule
                hr() {
                    return (
                        <hr
                            className={cn(
                                "my-3 border-t",
                                isBot ? "border-white/20" : "border-gray-300"
                            )}
                        />
                    );
                },
            }}
        >
            {content}
        </ReactMarkdown>
    );
}
