import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { MobileLayout } from '../components/MobileLayout';
import { Post } from '../types/post';
import { postsService } from '../services/api/postService';

export const PostListPage: React.FC = () => {
  const navigate = useNavigate();
  const { orgId } = useParams<{ orgId: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<'all' | 'notice' | 'general'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orgId) return;

    let isMounted = true;
    const loadPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params: { organization: number; isNotice?: boolean } = {
          organization: Number(orgId),
        };
        if (filter === 'notice') params.isNotice = true;
        if (filter === 'general') params.isNotice = false;

        const data = await postsService.list(params);
        if (!isMounted) return;
        setPosts(data);
      } catch (err) {
        if (!isMounted) return;
        console.error('게시글 목록 로딩 실패', err);
        setError('게시글 목록을 불러오지 못했습니다.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    loadPosts();
    return () => {
      isMounted = false;
    };
  }, [orgId, filter]);

  return (
    <MobileLayout>
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900">게시판</h1>
          <button
            onClick={() => navigate(`/organizations/${orgId}/posts/create`)}
            className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
          >
            글쓰기
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {[
            { key: 'all', label: '전체' },
            { key: 'notice', label: '공지' },
            { key: 'general', label: '일반' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as typeof filter)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="text-center text-slate-500 py-12">불러오는 중...</div>
        )}

        {!isLoading && error && (
          <div className="text-center text-red-500 py-12">{error}</div>
        )}

        {!isLoading && !error && posts.length === 0 && (
          <div className="text-center text-slate-500 py-12">
            <p className="mb-4">아직 게시글이 없습니다.</p>
            <button
              onClick={() => navigate(`/organizations/${orgId}/posts/create`)}
              className="text-blue-500 hover:underline"
            >
              첫 번째 글을 작성해보세요
            </button>
          </div>
        )}

        {!isLoading && !error && posts.length > 0 && (
          <div className="space-y-3">
            {posts.map((post) => (
              <article
                key={post.id}
                onClick={() => navigate(`/organizations/${orgId}/posts/${post.id}`)}
                className={`border rounded-xl bg-white shadow-lg p-4 cursor-pointer hover:shadow-xl transition-shadow ${
                  post.isPinned ? 'border-blue-300 bg-blue-50' : 'border-slate-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
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
                      <h2 className="font-bold text-slate-900">{post.title}</h2>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">{post.content}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                      <span>{post.authorUsername || '익명'}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
                      {post.hashtags.length > 0 && (
                        <div className="flex gap-1">
                          {post.hashtags.slice(0, 3).map((tag) => (
                            <span key={tag.id} className="text-blue-500">
                              #{tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </MobileLayout>
  );
};
