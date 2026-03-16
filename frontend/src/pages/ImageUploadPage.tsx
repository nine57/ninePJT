import { ExpenseAnalyzeImageResponse, expenseService } from '../services/api/expenseService';
import React, { useState } from 'react';

import { ApiError } from '../utils/api';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

/**
 * 이미지 업로드 페이지
 */
export const ImageUploadPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [groupId, setGroupId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [uploadResult, setUploadResult] = useState<ExpenseAnalyzeImageResponse | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 이미지 파일인지 확인
      if (!file.type.startsWith('image/')) {
        setError('이미지 파일만 업로드 가능합니다.');
        return;
      }
      setSelectedFile(file);
      setError('');
      setSuccess('');

      // 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGroupIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupId(e.target.value);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUploadResult(null);

    if (!selectedFile) {
      setError('이미지 파일을 선택해주세요.');
      return;
    }

    if (!groupId || isNaN(Number(groupId))) {
      setError('유효한 그룹 ID를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await expenseService.analyzeImage({
        image: selectedFile,
        group: Number(groupId),
      });
      setSuccess('이미지 업로드가 완료되었습니다!');
      setUploadResult(result);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.detail || apiError.message || '이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            이미지 업로드
          </h1>
          <p className="text-slate-600">
            지출 내역 이미지를 업로드하고 AI로 분석합니다
          </p>
        </div>

        {/* 폼 카드 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
              <p className="text-sm text-rose-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 그룹 ID 입력 */}
            <Input
              id="groupId"
              type="number"
              label="그룹 ID"
              value={groupId}
              onChange={handleGroupIdChange}
              error={groupId && isNaN(Number(groupId)) ? '유효한 숫자를 입력해주세요.' : undefined}
              required
              showRequiredIndicator={false}
              placeholder="정산 그룹 ID를 입력하세요"
            />

            {/* 파일 선택 */}
            <div>
              <label
                htmlFor="imageFile"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                이미지 파일
              </label>
              <input
                id="imageFile"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                  file:cursor-pointer"
                required
              />
              {selectedFile && (
                <p className="mt-2 text-sm text-slate-600">
                  선택된 파일: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            {/* 미리보기 */}
            {previewUrl && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  미리보기
                </label>
                <div className="border border-slate-200 rounded-lg p-2 bg-slate-50">
                  <img
                    src={previewUrl}
                    alt="미리보기"
                    className="max-w-full h-auto max-h-64 mx-auto rounded"
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              className="mt-6"
            >
              업로드
            </Button>
          </form>

          {/* 업로드 결과 */}
          {uploadResult && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                업로드 결과
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-slate-700">지출 ID:</span>{' '}
                  <span className="text-slate-900">{uploadResult.expense.id}</span>
                </div>
                <div>
                  <span className="font-medium text-slate-700">상호명:</span>{' '}
                  <span className="text-slate-900">
                    {uploadResult.expense.merchant_name || '-'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-slate-700">금액:</span>{' '}
                  <span className="text-slate-900">
                    {uploadResult.expense.amount} {uploadResult.expense.currency || ''}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-slate-700">결제 방법:</span>{' '}
                  <span className="text-slate-900">
                    {uploadResult.expense.payment_method || '-'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-slate-700">메모:</span>{' '}
                  <span className="text-slate-900">
                    {uploadResult.expense.memo || '-'}
                  </span>
                </div>
                {uploadResult.analysis && Object.keys(uploadResult.analysis).length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <span className="font-medium text-slate-700">AI 분석 결과:</span>
                    <pre className="mt-2 p-3 bg-slate-50 rounded text-xs overflow-auto">
                      {JSON.stringify(uploadResult.analysis, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

