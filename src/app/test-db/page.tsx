"use client";

import { useState } from "react";

export default function TestDBPage() {
    const [testResult, setTestResult] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const testSave = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/test-db", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "save" })
            });
            const data = await response.json();
            setTestResult(JSON.stringify(data, null, 2));
        } catch (error: any) {
            setTestResult("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const testFetch = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/test-db", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "fetch" })
            });
            const data = await response.json();
            setTestResult(JSON.stringify(data, null, 2));
        } catch (error: any) {
            setTestResult("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Database Test Page</h1>

            <div className="flex gap-4 mb-6">
                <button
                    onClick={testSave}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    Test Save
                </button>

                <button
                    onClick={testFetch}
                    disabled={loading}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                >
                    Test Fetch
                </button>
            </div>

            {testResult && (
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
                    <h2 className="font-semibold mb-2">Result:</h2>
                    <pre className="text-sm overflow-auto">{testResult}</pre>
                </div>
            )}
        </div>
    );
}
