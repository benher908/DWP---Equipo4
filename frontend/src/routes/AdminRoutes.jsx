import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/admin/Dashboard";
import CrudSchedules from "../pages/admin/CrudSchedules";
import CrudAnnouncements from "../pages/admin/CrudAnnouncements";
import ManageReports from "../pages/admin/ManageReports";
import CrudTips from "../pages/admin/CrudTips";
import AdminLayout from "../layouts/AdminLayout";
import Users from "../pages/admin/Users";

export default function AdminRoutes() {
  return (
    <Routes>

      <Route element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="schedules" element={<CrudSchedules />} />
        <Route path="users" element={<Users />} />
        <Route path="announcements" element={<CrudAnnouncements />} />
        <Route path="reports" element={<ManageReports />} />
        <Route path="tips" element={<CrudTips />} />
      </Route>
    </Routes>
  );
}
