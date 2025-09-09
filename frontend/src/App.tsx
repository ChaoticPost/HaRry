import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import InterviewListPage from './pages/InterviewListPage';
import CandidatesListPage from './pages/CandidatesListPage';
import CandidatePage from './pages/CandidatePage';
import VideoInterviewPage from './pages/VideoInterviewPage';
import VacanciesPage from './pages/VacanciesPage';
import AddVacancyPage from './pages/AddVacancyPage';
import AddCandidatePage from './pages/AddCandidatePage';
import CriteriaSettingsPage from './pages/CriteriaSettingsPage';
import ReportPage from './pages/ReportPage';
import AIInterviewerPage from './pages/AIInterviewerPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/interviews" element={<InterviewListPage />} />
          <Route path="/interviews/:id/video" element={<VideoInterviewPage />} />
          <Route path="/ai-interviewer" element={<AIInterviewerPage />} />
          <Route path="/candidates" element={<CandidatesListPage />} />
          <Route path="/candidates/new" element={<AddCandidatePage />} />
          <Route path="/candidates/:id" element={<CandidatePage />} />
          <Route path="/vacancies" element={<VacanciesPage />} />
          <Route path="/vacancies/new" element={<AddVacancyPage />} />
          <Route path="/settings/criteria" element={<CriteriaSettingsPage />} />
          <Route path="/reports/:candidateId" element={<ReportPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
