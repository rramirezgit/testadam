'use client';

import * as React from 'react';
import { useState } from 'react';

interface HtmlPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  htmlContent: string;
  title?: string;
}

export default function HtmlPreviewDialog({
  open,
  onClose,
  htmlContent,
  title,
}: HtmlPreviewDialogProps) {
  const [activeTab, setActiveTab] = useState(0);

  if (!open) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlContent);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-[90vw] h-[90vh] max-w-6xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">{title || 'HTML Preview'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab(0)}
            className={`px-4 py-2 font-medium ${
              activeTab === 0
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            👁️ Preview
          </button>
          <button
            onClick={() => setActiveTab(1)}
            className={`px-4 py-2 font-medium ${
              activeTab === 1
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📄 HTML Code
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-hidden">
          {activeTab === 0 ? (
            <div className="h-full border border-gray-300 rounded">
              <iframe
                srcDoc={htmlContent}
                title="Newsletter HTML Preview"
                className="w-full h-full rounded"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
              />
            </div>
          ) : (
            <div className="h-full border border-gray-300 rounded bg-gray-50 p-4 overflow-auto">
              <pre className="text-sm whitespace-pre-wrap break-all">{htmlContent}</pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t">
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            📋 Copy HTML
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
