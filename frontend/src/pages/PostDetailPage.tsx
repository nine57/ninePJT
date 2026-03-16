import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { MobileLayout } from '../components/MobileLayout';
import { Post } from '../types/post';
import { postsService } from '../services/api/postService';

export const PostDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { orgId, postId } = useParams<{ orgId: string; postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    if (!postId) return;

    let isMounted = true;
    const loadPost = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await postsService.get(Number(postId));
        if (!isMounted) return;
        setPost(data);
        setEditTitle(data.title);
        setEditContent(data.content);
      } catch (err) {
        if (!isMounted) return;
        console.error('게시글 로딩 실패', err);
        setError('게시글을 불러오지 못했습니다.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    loadPost();
    return () => {
      isMounted = false;
    };
  }, [postId]);

  const handleDelete = async () => {
    if (!post || !confirm('이 게시글을 삭제하시겠습니까?')) return;
    try {
      await postsService.delete(post.id);
      navigate(`/organizations/${orgId}/posts`);
    } catch (err) {
      console.error('게시글 삭제 실패', err);
      alert('게시글 삭제에 실패했습니다.');
    }
  };

  const handleUpdate = async () => {
    if (!post || !editTitle.trim() || !editContent.trim()) return;
    try {
      const updated = await postsService.update(post.id, {
        title: editTitle.trim(),
        content: editContent.trim(),
      });
      setPost(updated);
      setIsEditing(false);
    } catch (err) {
      console.error('게시글 수정 실패', err);
      alert('게시글 수정에 실패했습니다.');
    }
  };

  if (isLoading) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-slate-500">불러오는 중...</div>
        </div>
      </MobileLayout>
    );
  }

  if (error || !post) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-red-500">{error || '게시글을 찾을 수 없습니다.'}</div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="space-y-4 p-4">
        <button
          onClick={() => navigate(`/organizations/${orgId}/posts`)}
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          &larr; 목록으로
        </button>

        <article className="border border-slate-100 rounded-xl bg-white shadow-lg p-6">
          {isEditing ? (
            <div className="space-y-4">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl font-bold"
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={10}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                >
                  취소
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  저장
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  {post.isNotice && (
                    <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">
                      공지
                    </span>
                  )}
                  {post.isPinned && (
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                      고정
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-slate-900">{post.title}</h1>
                <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
                  <span>{post.authorUsername || '익명'}</span>
                  <span>{new Date(post.createdAt).toLocaleString('ko-KR')}</span>
                </div>
              </div>

              {/* Content */}
              <div className="prose prose-slate max-w-none mb-6 whitespace-pre-wrap">
                {post.content}
              </div>

              {/* Hashtags */}
              {post.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.hashtags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                >
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                >
                  삭제
                </button>
              </div>
            </>
          )}
        </article>
      </div>
    </MobileLayout>
  );
};
