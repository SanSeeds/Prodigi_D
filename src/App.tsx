import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Homepage from './Pages/Homepage';
import EmailService from './Pages/Email';
import BussinessProposalService from './Pages/BusinessProposal';
import OfferLetterService from './Pages/OfferLetter';
import SalesScriptService from './Pages/SalesScript';
import SummarizeService from './Pages/Summarize';
import ContentGenerationService from './Pages/ContentGeneration';
import ProfileForm from './Pages/Profile';
import WelcomePage from './Pages/WelcomePage';
import SignInForm from './Pages/SignIn';
import Translate from './Pages/Translate';
import { AuthProvider } from './components/Global/AuthContext';
import Footer from './components/Global/Footer';
import ForgetPassword from './components/SignInPage/ForgetPassword';
import SignUpForm from './components/SignInPage/SignupPage';
import PrivateRoute from './components/Global/PrivateRoute'; // Import PrivateRoute

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/signin" element={<SignInForm />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/forgotPassword" element={<ForgetPassword />} />
            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Homepage />} />
              <Route path="/email" element={<EmailService />} />
              <Route path="/businessproposal" element={<BussinessProposalService />} />
              <Route path="/offerletter" element={<OfferLetterService />} />
              <Route path="/sales" element={<SalesScriptService />} />
              <Route path="/summarize" element={<SummarizeService />} />
              <Route path="/contentgeneration" element={<ContentGenerationService />} />
              <Route path="/profile" element={<ProfileForm />} />
              <Route path="/translate" element={<Translate />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
