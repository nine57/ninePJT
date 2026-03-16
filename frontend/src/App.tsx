import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AlbumCreatePage } from './pages/AlbumCreatePage';
import { AlbumDetailPage } from './pages/AlbumDetailPage';
import { AlbumListPage } from './pages/AlbumListPage';
import { ExpenseCreatePage } from './pages/ExpenseCreatePage';
import { ExpenseEditPage } from './pages/ExpenseEditPage';
import { ImageUploadPage } from './pages/ImageUploadPage';
import { InvitationManagePage } from './pages/InvitationManagePage';
import { LoginPage } from './pages/LoginPage';
import { MemberListPage } from './pages/MemberListPage';
import { OrganizationCreatePage } from './pages/OrganizationCreatePage';
import { OrganizationJoinPage } from './pages/OrganizationJoinPage';
import { OrganizationMainPage } from './pages/OrganizationMainPage';
import { OrganizationSelectPage } from './pages/OrganizationSelectPage';
import { OrganizationSettingsPage } from './pages/OrganizationSettingsPage';
import { PictureUploadPage } from './pages/PictureUploadPage';
import { PostCreatePage } from './pages/PostCreatePage';
import { PostDetailPage } from './pages/PostDetailPage';
import { PostListPage } from './pages/PostListPage';
import { SettlementGroupCreatePage } from './pages/SettlementGroupCreatePage';
import { SettlementGroupDetailPage } from './pages/SettlementGroupDetailPage';
import { SettlementGroupListPage } from './pages/SettlementGroupListPage';
import { SettlementHistoryDetailPage } from './pages/SettlementHistoryDetailPage';
import { SignupPage } from './pages/SignupPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 flex justify-center">
        <div className="w-full max-w-lg min-h-screen relative shadow-xl bg-white">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/organizations/select" element={<OrganizationSelectPage />} />
        <Route path="/organizations/create" element={<OrganizationCreatePage />} />
        <Route path="/organizations/join" element={<OrganizationJoinPage />} />
        <Route path="/organizations/:id" element={<OrganizationMainPage />} />
        <Route path="/organizations/:id/settings" element={<OrganizationSettingsPage />} />
        <Route path="/organizations/:orgId/members" element={<MemberListPage />} />
        <Route path="/organizations/:orgId/invitations" element={<InvitationManagePage />} />
        <Route path="/organizations/:orgId/settlements" element={<SettlementGroupListPage />} />
        <Route path="/organizations/:orgId/settlements/create" element={<SettlementGroupCreatePage />} />
        <Route path="/organizations/:orgId/settlements/:groupId" element={<SettlementGroupDetailPage />} />
        <Route path="/organizations/:orgId/settlements/:groupId/expenses/create" element={<ExpenseCreatePage />} />
        <Route path="/organizations/:orgId/settlements/:groupId/expenses/:expenseId/edit" element={<ExpenseEditPage />} />
        <Route path="/organizations/:orgId/settlements/:groupId/history/:settlementId" element={<SettlementHistoryDetailPage />} />
        <Route path="/organizations/:orgId/albums" element={<AlbumListPage />} />
        <Route path="/organizations/:orgId/albums/create" element={<AlbumCreatePage />} />
        <Route path="/organizations/:orgId/albums/:albumId" element={<AlbumDetailPage />} />
        <Route path="/organizations/:orgId/pictures/upload" element={<PictureUploadPage />} />
        <Route path="/organizations/:orgId/posts" element={<PostListPage />} />
        <Route path="/organizations/:orgId/posts/create" element={<PostCreatePage />} />
        <Route path="/organizations/:orgId/posts/:postId" element={<PostDetailPage />} />
        <Route path="/upload" element={<ImageUploadPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;