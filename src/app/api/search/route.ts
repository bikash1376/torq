import { NextRequest, NextResponse } from 'next/server';

// Tavily Web Search API endpoint
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { query } = body;

        if (!query) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        const tavilyApiKey = process.env.TAVILY_API_KEY;

        if (!tavilyApiKey) {
            console.error('[Search API] TAVILY_API_KEY not configured');
            return NextResponse.json({ error: 'Search API not configured' }, { status: 500 });
        }

        console.log('[Search API] Searching for:', query);

        const response = await fetch('https://api.tavily.com/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                api_key: tavilyApiKey,
                query: query,
                search_depth: 'basic',
                include_answer: true,
                include_raw_content: false,
                max_results: 5,
            }),
        });

        if (!response.ok) {
            console.error('[Search API] Tavily error:', response.status);
            return NextResponse.json({ error: 'Search failed' }, { status: 500 });
        }

        const data = await response.json();

        // Format results
        const results = (data.results || []).map((result: { title: string; url: string; content: string }) => ({
            title: result.title,
            url: result.url,
            content: result.content,
        }));

        console.log('[Search API] Found', results.length, 'results');

        return NextResponse.json({
            query,
            answer: data.answer || null,
            results,
        });
    } catch (error) {
        console.error('[Search API] Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
