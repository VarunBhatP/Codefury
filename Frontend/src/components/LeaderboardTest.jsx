import React, { useState } from 'react';
import { getApiUrl } from '../config/api';

const LeaderboardTest = () => {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState({});

    const testLeaderboardEndpoints = async () => {
        setLoading(true);
        setResults({});

        try {
            // Test artist leaderboard
            console.log('Testing artist leaderboard...');
            const artistResponse = await fetch(getApiUrl('ARTS', 'LEADERBOARD_ARTISTS'));
            const artistData = await artistResponse.json();
            
            setResults(prev => ({
                ...prev,
                artists: {
                    status: artistResponse.status,
                    ok: artistResponse.ok,
                    data: artistData,
                    url: getApiUrl('ARTS', 'LEADERBOARD_ARTISTS')
                }
            }));

            // Test artwork leaderboard
            console.log('Testing artwork leaderboard...');
            const artworkResponse = await fetch(getApiUrl('ARTS', 'LEADERBOARD_ARTWORKS'));
            const artworkData = await artworkResponse.json();
            
            setResults(prev => ({
                ...prev,
                artworks: {
                    status: artworkResponse.status,
                    ok: artworkResponse.ok,
                    data: artworkData,
                    url: getApiUrl('ARTS', 'LEADERBOARD_ARTWORKS')
                }
            }));

        } catch (error) {
            console.error('Test error:', error);
            setResults(prev => ({
                ...prev,
                error: error.message
            }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Leaderboard API Test</h2>
            
            <button
                onClick={testLeaderboardEndpoints}
                disabled={loading}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50 mb-4"
            >
                {loading ? 'Testing...' : 'Test Leaderboard Endpoints'}
            </button>
            
            {Object.keys(results).length > 0 && (
                <div className="space-y-4">
                    {results.error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            <strong>Error:</strong> {results.error}
                        </div>
                    )}
                    
                    {results.artists && (
                        <div className="bg-gray-50 border border-gray-200 p-4 rounded">
                            <h3 className="font-bold mb-2">Artist Leaderboard Test</h3>
                            <p><strong>URL:</strong> {results.artists.url}</p>
                            <p><strong>Status:</strong> {results.artists.status} ({results.artists.ok ? 'OK' : 'Failed'})</p>
                            <p><strong>Data:</strong></p>
                            <pre className="bg-white p-2 rounded text-xs overflow-auto max-h-40">
                                {JSON.stringify(results.artists.data, null, 2)}
                            </pre>
                        </div>
                    )}
                    
                    {results.artworks && (
                        <div className="bg-gray-50 border border-gray-200 p-4 rounded">
                            <h3 className="font-bold mb-2">Artwork Leaderboard Test</h3>
                            <p><strong>URL:</strong> {results.artworks.url}</p>
                            <p><strong>Status:</strong> {results.artworks.status} ({results.artworks.ok ? 'OK' : 'Failed'})</p>
                            <p><strong>Data:</strong></p>
                            <pre className="bg-white p-2 rounded text-xs overflow-auto max-h-40">
                                {JSON.stringify(results.artworks.data, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LeaderboardTest;
