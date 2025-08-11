// CommentList.tsx
import { UserIcon } from '@heroicons/react/24/solid';
import { CommentDTO } from '../Models/CommentDTO';

type CommentListProps = {
    comments: CommentDTO[];
    loading: boolean;
};

export default function CommentList({ comments, loading }: CommentListProps) {
    return (
        <div className="mt-5 font-montserrat">
            <h3 className="text-sm font-semibold mb-2">Comments</h3>

            {loading ? (
                <p className="text-gray-500 text-sm">Loading comments...</p>
            ) : comments.length > 0 ? (
                <ul className="space-y-3 mb-5">
                    {comments.map((comment) => (
                        <li
                            key={comment.id}
                            className="flex items-start space-x-1"
                        >
                            <UserIcon className="w-10 h-10 bg-bg-og-bg-of-mc rounded-full text-white mt-2 p-1" />
                            <div className="bg-bg-of-mc/50 p-3 rounded-lg text-sm border border-gray-200 flex-1">
                                <p className="font-semibold">{comment.user?.username}</p>
                                <p className="text-xs text-gray-500">
                                    {new Date(comment.createdAt ?? 0).toLocaleString()}
                                </p>
                                <p className="mt-1">{comment.message}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500 text-sm">No comments yet.</p>
            )}
        </div>
    );
}
