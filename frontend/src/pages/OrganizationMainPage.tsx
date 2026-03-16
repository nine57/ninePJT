import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { MobileLayout } from '../components/MobileLayout';
import { Organization } from '../types/organization';
import { Post } from '../types/post';
import { Picture, pictureService } from '../services/api/pictureService';
import { formatDateString } from '../utils/date';
import { postsService } from '../services/api/postService';

interface LocationState {
  organization?: Organization;
}

export const OrganizationMainPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const state = location.state as LocationState | null;
  const organization = state?.organization;
  const [notices, setNotices] = useState<Post[]>([]);
  const [isNoticesLoading, setIsNoticesLoading] = useState(true);
  const [noticeError, setNoticeError] = useState<boolean>(false);
  const noticeCount = notices.length;
  const [currentNoticeIndex, setCurrentNoticeIndex] = useState(0);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [isPostsLoading, setIsPostsLoading] = useState(true);
  const [recentPictures, setRecentPictures] = useState<Picture[]>([]);
  const [isPicturesLoading, setIsPicturesLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadNotices = async () => {
      setIsNoticesLoading(true);
      setNoticeError(false);
      try {
        const data = await postsService.list({ organization: Number(id), isNotice: true });
        if (!isMounted) return;
        setNotices(data);
        setCurrentNoticeIndex(0);
      } catch (error) {
        if (!isMounted) return;
        console.error('공지 목록 로딩 실패', error);
        setNoticeError(true);
      } finally {
        if (isMounted) {
          setIsNoticesLoading(false);
        }
      }
    };
    const loadRecentPosts = async () => {
      setIsPostsLoading(true);
      try {
        const data = await postsService.list({ organization: Number(id), isNotice: false });
        if (!isMounted) return;
        setRecentPosts(data.slice(0, 2));
      } catch (error) {
        if (!isMounted) return;
        console.error('게시글 로딩 실패', error);
      } finally {
        if (isMounted) {
          setIsPostsLoading(false);
        }
      }
    };
    const loadPictures = async () => {
      setIsPicturesLoading(true);
      try {
        const data = await pictureService.list({ organization: Number(id) });
        if (!isMounted) return;
        setRecentPictures(data.slice(0, 3));
      } catch (error) {
        if (!isMounted) return;
        console.error('사진 로딩 실패', error);
      } finally {
        if (isMounted) {
          setIsPicturesLoading(false);
        }
      }
    };
    loadNotices();
    loadRecentPosts();
    loadPictures();
    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (!noticeCount) {
      setCurrentNoticeIndex(0);
      return;
    }
    const timer = window.setInterval(() => {
      setCurrentNoticeIndex((prev) => (prev + 1) % noticeCount);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [noticeCount]);

  const slideWidth = noticeCount > 0 ? 100 / noticeCount : 100;
  const translatePercentage = noticeCount > 0 ? currentNoticeIndex * slideWidth : 0;

  // 스와이프/드래그 처리
  const dragStartX = useRef(0);
  const isDragging = useRef(false);
  const isPointerDown = useRef(false);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const SWIPE_THRESHOLD = 50;

  const handlePointerDown = useCallback((clientX: number) => {
    dragStartX.current = clientX;
    isDragging.current = false;
    isPointerDown.current = true;
    setDragOffset(0);
  }, []);

  const handlePointerMove = useCallback((clientX: number) => {
    if (!isPointerDown.current) return;
    const diff = clientX - dragStartX.current;
    if (Math.abs(diff) > 5) {
      isDragging.current = true;
    }
    setDragOffset(diff);
  }, []);

  const handlePointerEnd = useCallback(() => {
    if (!isPointerDown.current) return;
    isPointerDown.current = false;
    const diff = dragOffset;
    if (Math.abs(diff) >= SWIPE_THRESHOLD) {
      if (diff < 0 && currentNoticeIndex < noticeCount - 1) {
        setCurrentNoticeIndex((prev) => prev + 1);
      } else if (diff > 0 && currentNoticeIndex > 0) {
        setCurrentNoticeIndex((prev) => prev - 1);
      }
    }
    setDragOffset(0);
  }, [dragOffset, currentNoticeIndex, noticeCount]);

  return (
    <MobileLayout>
      <div className="space-y-4 p-4">
        <p className="text-2xl font-bold text-slate-900 text-center">
          {organization ? organization.name : '모임'}
        </p>

        <section className="border border-slate-100 rounded-xl bg-white shadow-lg px-3 py-3 space-y-3">
          <h3 className="text-sm font-semibold text-slate-500 px-1">공지사항</h3>
          {isNoticesLoading && (
            <div className="text-center text-slate-500 py-6 text-sm">불러오는 중...</div>
          )}
          {!isNoticesLoading && noticeError && (
            <div className="text-center text-slate-900 py-6 text-sm">공지 정보를 불러오지 못했습니다.</div>
          )}
          {!isNoticesLoading && !noticeError && noticeCount > 0 && (
            <>
              <div
                ref={containerRef}
                className="relative overflow-hidden rounded-xl select-none touch-pan-y"
                onTouchStart={(e) => handlePointerDown(e.touches[0].clientX)}
                onTouchMove={(e) => handlePointerMove(e.touches[0].clientX)}
                onTouchEnd={handlePointerEnd}
                onMouseDown={(e) => { e.preventDefault(); handlePointerDown(e.clientX); }}
                onMouseMove={(e) => handlePointerMove(e.clientX)}
                onMouseUp={handlePointerEnd}
                onMouseLeave={() => { if (isPointerDown.current) handlePointerEnd(); }}
              >
                <div
                  className="flex"
                  style={{
                    width: `${noticeCount * 100}%`,
                    transform: `translateX(calc(-${translatePercentage}% + ${dragOffset}px))`,
                    transition: isPointerDown.current ? 'none' : 'transform 400ms cubic-bezier(0.25, 1, 0.5, 1)',
                  }}
                >
                  {notices.map((notice) => (
                    <article
                      key={notice.id}
                      className="flex-shrink-0 cursor-pointer"
                      style={{ width: `${slideWidth}%` }}
                      aria-label={`공지 ${notice.title}`}
                      onClick={() => {
                        if (!isDragging.current) {
                          navigate(`/organizations/${id}/posts/${notice.id}`);
                        }
                      }}
                    >
                      <div className="border border-slate-100 rounded-xl py-3 px-6 h-full flex flex-col justify-between bg-blue-50">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span className="font-semibold text-blue-500">공지</span>
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-slate-900 mb-1 line-clamp-2">
                            {notice.title}
                          </h4>
                          <time className="text-xs text-slate-500">
                            {formatDateString(notice.createdAt, 'date')}
                          </time>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
              {noticeCount > 1 && (
                <div className="flex justify-center gap-2">
                  {notices.map((notice, index) => (
                    <button
                      key={notice.id}
                      onClick={() => setCurrentNoticeIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentNoticeIndex ? 'bg-blue-500' : 'bg-slate-300'
                      }`}
                      aria-label={`공지 ${index + 1}번 보기`}
                    />
                  ))}
                </div>
              )}
            </>
          )}
          {!isNoticesLoading && !noticeError && noticeCount === 0 && (
            <div className="text-center text-slate-500 py-6 text-sm">공지가 없습니다.</div>
          )}
        </section>

        <section className="border border-slate-100 rounded-xl bg-white shadow-lg px-3 py-3 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-500">최근 게시글</h3>
            <button
              onClick={() => navigate(`/organizations/${id}/posts`)}
              className="text-xs text-blue-500 font-medium hover:text-blue-600"
            >
              더보기 &gt;
            </button>
          </div>
          {isPostsLoading && (
            <div className="text-center text-slate-500 py-6 text-sm">불러오는 중...</div>
          )}
          {!isPostsLoading && recentPosts.length === 0 && (
            <div className="text-center text-slate-500 py-6 text-sm">게시글이 없습니다.</div>
          )}
          {!isPostsLoading && recentPosts.length > 0 && (
            <div className="divide-y divide-slate-100">
              {recentPosts.map((post) => (
                <button
                  key={post.id}
                  onClick={() => navigate(`/organizations/${id}/posts/${post.id}`)}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <h4 className="text-sm font-semibold text-slate-900 truncate">{post.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500">{post.authorUsername}</span>
                    <span className="text-xs text-slate-300">|</span>
                    <time className="text-xs text-slate-500">{formatDateString(post.createdAt, 'date')}</time>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="border border-slate-100 rounded-xl bg-white shadow-lg px-3 py-3 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-500">최근 사진</h3>
            <button
              onClick={() => navigate(`/organizations/${id}/albums`)}
              className="text-xs text-blue-500 font-medium hover:text-blue-600"
            >
              더보기 &gt;
            </button>
          </div>
          {isPicturesLoading && (
            <div className="text-center text-slate-500 py-6 text-sm">불러오는 중...</div>
          )}
          {!isPicturesLoading && recentPictures.length === 0 && (
            <div className="text-center text-slate-500 py-6 text-sm">사진이 없습니다.</div>
          )}
          {!isPicturesLoading && recentPictures.length > 0 && (
            <div className="grid grid-cols-3 gap-1.5">
              {recentPictures.map((picture) => (
                <div
                  key={picture.id}
                  className="aspect-square bg-slate-100 rounded-lg overflow-hidden"
                >
                  <img
                    src={picture.fileUrl}
                    alt={picture.caption || '사진'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </MobileLayout>
  );
};

