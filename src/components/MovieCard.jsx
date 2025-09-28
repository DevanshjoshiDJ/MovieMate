import React, { useState } from 'react';
import StarRating from './StarRating';
const styles = {
    card: { background: '#071031', padding: 12, borderRadius: 10, boxShadow: '0 6px 18px rgba(2,6,23,0.6)' },
    poster: { width: '100%', height: 300, objectFit: 'cover', borderRadius: 6, marginBottom: 8, background: '#0b1220' },
    smallText: { color: '#9fb0d6', fontSize: 13 },
    button: { padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', marginTop: 6 },
    input: { flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #334155', background: '#071031', color: '#e6eef8', fontSize: 13 }
};
export default function MovieCard({ movie, isInWatchlist, onAdd, onRemove, rating, onRate, reviews, onAddReview }) {
    const [reviewText, setReviewText] = useState('');

    if (!movie) {
        return <div className="bg-slate-900 p-4 rounded-xl shadow-lg text-white">No movie data available.</div>;
    }
    return (
        <div className="bg-slate-900 p-4 rounded-xl shadow-lg">
            {movie.Poster && movie.Poster !== 'N/A' ? (
                <img src={movie.Poster} alt={movie.Title} className="w-full h-[300px] object-cover rounded-lg mb-2 bg-slate-800" />
            ) : (
                <div className="w-full h-[300px] flex items-center justify-center rounded-lg mb-2 bg-slate-800 text-blue-300">No Image</div>
            )}
            <h3 className="mt-1 mb-1 text-lg font-semibold">{movie.Title}</h3>
            <div className="text-blue-300 text-sm">{movie.Year} • {movie.Type}</div>
            <div className="mt-2 flex justify-between items-center">
                <StarRating value={rating || 0} onChange={(v) => onRate(movie, v)} />
                {!isInWatchlist ? (
                    <button onClick={() => onAdd(movie)} className="px-3 py-2 rounded-lg mt-1 bg-blue-600 text-white font-medium hover:bg-blue-700">+ Watchlist</button>
                ) : (
                    <button onClick={() => onRemove(movie)} className="px-3 py-2 rounded-lg mt-1 bg-red-500 text-white font-medium hover:bg-red-600">Remove</button>
                )}
            </div>
            <div className="mt-2 flex gap-2">
                <input
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Write a review..."
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-blue-100 text-sm"
                />
                <button
                    onClick={() => { if (reviewText.trim()) { onAddReview(movie, reviewText.trim()); setReviewText(''); } }}
                    className="px-3 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600"
                >Add Review</button>
            </div>
            {reviews && reviews.length > 0 && (
                <div className="mt-2">
                    <div className="text-sm text-blue-300">Reviews:</div>
                    <ul className="pl-4">
                        {reviews.map((r, i) => (<li key={i} className="text-sm text-white">{r}</li>))}
                    </ul>
                </div>
            )}
        </div>
    );
}
