import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Homepage from './Pages/Homepage'
import EmailService from './Pages/Email'
import BussinessProposalService from './Pages/BusinessProposal'
import OfferLetterService from './Pages/OfferLetter'
import SalesScriptService from './Pages/SalesScript'
import SummarizeService from './Pages/Summarize'
import ContentGenerationService from './Pages/ContentGeneration'
import ProfileForm from './Pages/Profile'
import WelcomePage from './Pages/WelcomePage'
import SignInForm from './Pages/SignIn'
import Translate from './Pages/Translate'
import { AuthProvider } from './components/Global/AuthContext'

function App() {
  return (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<WelcomePage/>}></Route>
        <Route path='/signin' element={<SignInForm/>}></Route>
        <Route path='/dashboard' element={<Homepage/>}></Route>
        <Route path='/email' element={<EmailService/>}></Route>
        <Route path='/businessproposal' element={<BussinessProposalService/>}></Route>
        <Route path='/offerletter' element={<OfferLetterService/>}></Route>
        <Route path='/sales' element={<SalesScriptService/>}></Route>
        <Route path='/summarize' element={<SummarizeService/>}></Route>
        <Route path='/contentgeneration' element={<ContentGenerationService/>}></Route>
        <Route path='/profile' element={<ProfileForm/>}></Route>
        <Route path='/translate' element={<Translate/>}></Route>


      </Routes>
    </BrowserRouter>
    </AuthProvider>
  )
}

export default App
