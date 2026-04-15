import { Routes, Route } from "react-router-dom";

import Home from "../pages/user/Home";
import Reports from "../pages/user/Reports";
import Status from "../pages/user/Status";
import Notifications from "../pages/user/Notifications";
import Schedule from "../pages/user/Schedule";
import Tips from "../pages/user/Tips";
import UserLayout from "../layouts/UserLayout";

export default function UserRoutes() {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="home" element={<Home />} />
        <Route path="reports" element={<Reports />} />
        <Route path="status" element={<Status />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="tips" element={<Tips />} />
      </Route>
    </Routes>
  );
}
